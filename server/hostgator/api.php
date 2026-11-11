<?php
declare(strict_types=1);

// Shared-hosting backend. Configuration and encrypted data must be outside public_html.
ini_set('display_errors', '0');
ini_set('memory_limit', '256M');
umask(0077);
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

final class RequestError extends RuntimeException {
    public int $status;
    public function __construct(int $status, string $message) {
        parent::__construct($message);
        $this->status = $status;
    }
}
function fail(int $status, string $message): never { throw new RequestError($status, $message); }
function bytesSetting(string $value): int {
    if ($value === '-1') return PHP_INT_MAX;
    $number = (int)$value;
    return match (strtolower(substr(trim($value), -1))) {
        'g' => $number * 1024 ** 3,
        'm' => $number * 1024 ** 2,
        'k' => $number * 1024,
        default => $number,
    };
}
function encryptData(string $plain): string {
    global $key;
    $iv = random_bytes(12);
    $cipher = openssl_encrypt($plain, 'aes-256-gcm', $key, OPENSSL_RAW_DATA, $iv, $tag);
    if ($cipher === false) throw new RuntimeException('Encryption failed');
    return $iv . $cipher . $tag;
}
function decryptData(string $encrypted): string {
    global $key;
    if (strlen($encrypted) < 28) throw new RuntimeException('Invalid encrypted data');
    $plain = openssl_decrypt(substr($encrypted, 12, -16), 'aes-256-gcm', $key, OPENSSL_RAW_DATA, substr($encrypted, 0, 12), substr($encrypted, -16));
    if ($plain === false) throw new RuntimeException('Decryption failed');
    return $plain;
}
function atomicWrite(string $path, string $content): void {
    $temporary = $path . '.' . bin2hex(random_bytes(8)) . '.tmp';
    if (file_put_contents($temporary, $content, LOCK_EX) !== strlen($content)) {
        @unlink($temporary);
        throw new RuntimeException('Write failed');
    }
    chmod($temporary, 0600);
    if (!rename($temporary, $path)) { @unlink($temporary); throw new RuntimeException('Commit failed'); }
}
function commitState(): void {
    global $dirty, $state, $private, $lock;
    if ($dirty ?? false) {
        atomicWrite($private . '/state.bin', encryptData(json_encode($state, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE)));
        $dirty = false;
    }
    if (isset($lock) && is_resource($lock)) { flock($lock, LOCK_UN); fclose($lock); }
}
function respond(int $status, array $body): never {
    commitState();
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($body, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE);
    exit;
}
function readBody(int $maximum): string {
    if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > $maximum) fail(413, 'Solicitação acima do limite. Para arquivos grandes, use um link restrito.');
    $stream = fopen('php://input', 'rb');
    $body = '';
    while (!feof($stream)) {
        $chunk = fread($stream, 65536);
        if ($chunk === false) throw new RuntimeException('Read failed');
        $body .= $chunk;
        if (strlen($body) > $maximum) fail(413, 'Solicitação acima do limite.');
    }
    fclose($stream);
    if (isset($_SERVER['CONTENT_LENGTH']) && strlen($body) !== (int)$_SERVER['CONTENT_LENGTH']) fail(400, 'Solicitação incompleta. Tente novamente; nenhum envio foi confirmado.');
    return $body;
}
function inputJson(): array {
    try { $input = json_decode(readBody(1024 * 1024), true, 64, JSON_THROW_ON_ERROR); }
    catch (JsonException $error) { fail(400, 'JSON inválido.'); }
    if (!is_array($input)) fail(400, 'Solicitação inválida.');
    return $input;
}
function validLink(string $value): bool {
    $value = trim($value);
    $url = parse_url($value);
    return is_array($url) && strtolower($url['scheme'] ?? '') === 'https' && !empty($url['host']) && !isset($url['user']) && !isset($url['pass']) && !preg_match('/[\x00-\x20]/', $value);
}
function sanitizeDraft(array $draft): array {
    global $schema;
    if (($draft['schema'] ?? null) !== 1 || !is_array($draft['values'] ?? null) || !is_array($draft['links'] ?? null) || !is_array($draft['categoryState'] ?? null) || !is_array($draft['completed'] ?? null)) fail(400, 'Dossiê inválido.');
    $values = []; $links = []; $statuses = [];
    foreach ($schema['fields'] as $field) {
        if (array_key_exists($field, $draft['values'])) {
            $value = $draft['values'][$field];
            if (!is_string($value) || strlen($value) > 32000) fail(400, 'Campo inválido ou muito longo.');
            $values[$field] = $value;
        }
    }
    foreach ($schema['categories'] as $category) {
        $link = $draft['links'][$category] ?? '';
        if ($link !== '') {
            if (!is_string($link) || strlen($link) > 2000 || !validLink($link)) fail(400, 'Links devem usar HTTPS e não conter credenciais.');
            $links[$category] = trim($link);
        }
        $status = $draft['categoryState'][$category] ?? '';
        if ($status !== '') {
            if (!in_array($status, ['Disponível', 'Não possui', 'A providenciar', 'Não se aplica'], true)) fail(400, 'Situação inválida.');
            $statuses[$category] = $status;
        }
    }
    return ['schema' => 1, 'values' => (object)$values, 'links' => (object)$links, 'categoryState' => (object)$statuses,
        'completed' => array_values(array_filter($draft['completed'], fn($id) => in_array($id, $schema['steps'], true))), 'updatedAt' => gmdate('c')];
}
function versionMatches(): void {
    global $state;
    if ((string)$state['version'] !== ($_SERVER['HTTP_IF_MATCH'] ?? '')) fail(409, 'Existe uma versão mais recente. Carregue a versão da nuvem antes de salvar.');
}
function draftValues(): array {
    global $state;
    return (array)($state['draft']['values'] ?? []);
}

try {
    if (PHP_VERSION_ID < 80100 || !extension_loaded('openssl') || !function_exists('flock')) fail(503, 'A hospedagem precisa de PHP 8.1 ou superior, OpenSSL e bloqueio de arquivos.');
    if (bytesSetting((string)ini_get('memory_limit')) < 256 * 1024 * 1024) fail(503, 'Configure memory_limit em 256M para receber os arquivos.');
    $publicRoot = __DIR__;
    while (basename($publicRoot) !== 'public_html' && dirname($publicRoot) !== $publicRoot) $publicRoot = dirname($publicRoot);
    if (basename($publicRoot) !== 'public_html') fail(503, 'Instale o pacote em public_html/onboarding-construcel.');
    $private = dirname($publicRoot) . '/abuhsca-onboarding-private';
    if (!is_file($private . '/config.php')) fail(503, 'A pasta privada de configuração ainda precisa ser instalada fora de public_html.');
    $config = require $private . '/config.php';
    if (!is_array($config) || !preg_match('/^[a-f0-9]{64}$/', $config['key'] ?? '') || !preg_match('/^[a-f0-9]{64}$/', $config['clientHash'] ?? '') || !preg_match('/^[a-f0-9]{64}$/', $config['adminHash'] ?? '') || $config['clientHash'] === $config['adminHash']) throw new RuntimeException('Invalid configuration');
    $key = hex2bin($config['key']);
    $secure = (!empty($_SERVER['HTTPS']) && strtolower((string)$_SERVER['HTTPS']) !== 'off') || (int)($_SERVER['SERVER_PORT'] ?? 0) === 443;
    if (!$secure && !($config['allowHttp'] ?? false)) fail(426, 'Acesse pelo endereço HTTPS com certificado SSL válido.');
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin !== '' && !in_array($origin, $config['origins'], true)) fail(403, 'Origem não autorizada.');
    if ($origin !== '') { header('Access-Control-Allow-Origin: ' . $origin); header('Vary: Origin'); }
    header('Access-Control-Allow-Headers: Authorization,Content-Type,If-Match,X-File-Name,X-File-Id,X-Category');
    header('Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS');
    $method = $_SERVER['REQUEST_METHOD'];
    if ($method === 'OPTIONS') respond(204, []);
    $route = $_GET['route'] ?? '';
    if (!is_string($route)) fail(400, 'Rota inválida.');
    $schema = json_decode((string)file_get_contents(__DIR__ . '/schema.json'), true, 64, JSON_THROW_ON_ERROR);
    $fileDirectory = $private . '/files';
    if (!is_dir($fileDirectory) && !mkdir($fileDirectory, 0700, true) && !is_dir($fileDirectory)) throw new RuntimeException('Cannot create storage');
    $lock = fopen($private . '/state.lock', 'c');
    if (!$lock || !flock($lock, LOCK_EX)) throw new RuntimeException('Cannot lock storage');
    $state = is_file($private . '/state.bin') ? json_decode(decryptData((string)file_get_contents($private . '/state.bin')), true, 64, JSON_THROW_ON_ERROR) :
        ['version' => 0, 'draft' => null, 'status' => 'draft', 'updatedAt' => null, 'files' => [], 'sessions' => [], 'attempts' => []];
    $dirty = false;
    $now = time();
    foreach ($state['sessions'] as $id => $item) if ($item['expires'] < $now) { unset($state['sessions'][$id]); $dirty = true; }
    foreach ($state['attempts'] as $id => $item) if ($item['until'] < $now) { unset($state['attempts'][$id]); $dirty = true; }
    if ($route === '/health' && $method === 'GET') respond(200, ['ok' => true, 'maxFileBytes' => 50 * 1024 * 1024]);
    if ($route === '/v1/login' && $method === 'POST') {
        $ip = hash_hmac('sha256', $_SERVER['REMOTE_ADDR'] ?? 'unknown', $key);
        $attempt = $state['attempts'][$ip] ?? ['count' => 0, 'until' => $now + 600];
        ++$attempt['count']; $state['attempts'][$ip] = $attempt; $dirty = true;
        if ($attempt['count'] > 10) fail(429, 'Muitas tentativas. Aguarde 10 minutos.');
        $input = inputJson(); $code = $input['code'] ?? '';
        if (!is_string($code) || strlen($code) < 24 || strlen($code) > 200) fail(401, 'Convite inválido.');
        $hash = hash('sha256', $code); $role = null;
        if (hash_equals($config['clientHash'], $hash)) $role = 'client';
        if (hash_equals($config['adminHash'], $hash)) $role = 'admin';
        if ($role === null) fail(401, 'Convite inválido.');
        $token = bin2hex(random_bytes(32));
        $state['sessions'][hash('sha256', $token)] = ['role' => $role, 'expires' => $now + 7200];
        respond(200, ['token' => $token, 'role' => $role, 'expiresAt' => ($now + 7200) * 1000]);
    }
    $authorization = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
    $session = $state['sessions'][hash('sha256', preg_replace('/^Bearer /', '', $authorization))] ?? null;
    if (!$session || $session['expires'] < $now) fail(401, 'Acesso expirado. Entre novamente com seu convite.');
    if ($route === '/v1/dossier' && $method === 'GET') {
        $wireDraft = $state['draft'];
        if ($wireDraft !== null) foreach (['values', 'links', 'categoryState'] as $map) $wireDraft[$map] = (object)($wireDraft[$map] ?? []);
        respond(200, ['version' => $state['version'], 'draft' => $wireDraft, 'status' => $state['status'], 'updatedAt' => $state['updatedAt'], 'receipt' => $state['receipt'] ?? null, 'receivedAt' => $state['receivedAt'] ?? null, 'files' => array_values($state['files'])]);
    }
    if ($route === '/v1/dossier' && $method === 'PUT') {
        if ($session['role'] !== 'client') fail(403, 'Somente a cliente pode alterar as respostas.');
        $draft = sanitizeDraft(inputJson()); versionMatches();
        $state['receipt'] = null; $state['receivedAt'] = null;
        $state['draft'] = $draft; ++$state['version']; $state['status'] = 'draft'; $state['updatedAt'] = $draft['updatedAt']; $dirty = true;
        respond(200, ['version' => $state['version'], 'status' => 'draft', 'updatedAt' => $state['updatedAt']]);
    }
    if ($route === '/v1/submit' && $method === 'POST') {
        if ($session['role'] !== 'client') fail(403, 'Somente a cliente pode concluir o envio.');
        $values = draftValues();
        foreach ($schema['required'] as $field) if (trim((string)($values[$field] ?? '')) === '') fail(422, 'Preencha os dados essenciais da empresa.');
        if (!filter_var($values['empresa.email'] ?? '', FILTER_VALIDATE_EMAIL)) fail(422, 'Informe um e-mail válido.');
        versionMatches(); $input = inputJson();
        if (($input['confirm'] ?? false) !== true) fail(422, 'Confirme a revisão e as pendências.');
        if (array_key_exists('fileIds', $input)) {
            if (!is_array($input['fileIds'])) fail(422, 'Confira os arquivos antes de enviar.');
            $expected = $input['fileIds']; $actual = array_keys($state['files']);
            sort($expected); sort($actual);
            if ($expected !== $actual) fail(409, 'Os arquivos no servidor mudaram. Atualize e confira antes de concluir.');
        }
        if ($state['status'] !== 'submitted' || empty($state['receivedAt'])) {
            $state['receipt'] = 'CONSTRUCEL-' . $state['version'];
            $state['receivedAt'] = gmdate('c');
        }
        $state['status'] = 'submitted'; $dirty = true;
        respond(200, ['status' => 'submitted', 'version' => $state['version'], 'receipt' => $state['receipt'], 'receivedAt' => $state['receivedAt']]);
    }
    if ($route === '/v1/files' && $method === 'POST') {
        if ($session['role'] !== 'client') fail(403, 'Somente a cliente pode enviar materiais.');
        $category = $_SERVER['HTTP_X_CATEGORY'] ?? ''; $id = $_SERVER['HTTP_X_FILE_ID'] ?? '';
        if (!in_array($category, $schema['categories'], true)) fail(400, 'Categoria inválida.');
        if (!preg_match('/^[a-f0-9]{32}$/', $id)) fail(400, 'Identificador de arquivo inválido.');
        $name = rawurldecode($_SERVER['HTTP_X_FILE_NAME'] ?? '');
        if (strlen($name) > 800 || preg_match('~[\\\\/\x00-\x1f]~', $name) || !preg_match('/\.(png|jpe?g|webp|gif|avif|heic|svg|pdf|ai|eps|zip|mp4|mov|webm|m4v|avi|mkv|docx?|xlsx?|csv|pptx?|txt)$/i', $name)) fail(422, 'Nome ou formato não aceito.');
        $bytes = readBody(50 * 1024 * 1024); $size = strlen($bytes);
        if ($size === 0) fail(422, 'O arquivo está vazio.');
        if (isset($state['files'][$id])) {
            $previous = $state['files'][$id];
            if ($previous['category'] !== $category || $previous['name'] !== $name || $previous['size'] !== $size || !hash_equals(hash('sha256', decryptData((string)file_get_contents($fileDirectory . '/' . $id))), hash('sha256', $bytes))) fail(409, 'Identificador de arquivo já utilizado.');
            respond(200, $previous);
        }
        $total = array_sum(array_column($state['files'], 'size'));
        if ($total + $size > 200 * 1024 * 1024) fail(422, 'Limite de 200 MB por dossiê. Use links para arquivos maiores.');
        $signature = strtolower(pathinfo($name, PATHINFO_EXTENSION));
        if (($signature === 'png' && !str_starts_with($bytes, "\x89PNG\r\n\x1a\n")) || (in_array($signature, ['jpg', 'jpeg'], true) && !str_starts_with($bytes, "\xff\xd8\xff")) || ($signature === 'pdf' && !str_starts_with($bytes, '%PDF-'))) fail(422, 'O conteúdo do arquivo não corresponde ao formato informado.');
        $file = ['id' => $id, 'category' => $category, 'name' => $name, 'type' => 'application/octet-stream', 'size' => $size, 'created' => gmdate('c'), 'sha256' => hash('sha256', $bytes)];
        atomicWrite($fileDirectory . '/' . $id, encryptData($bytes));
        $state['files'][$id] = $file; $state['status'] = 'draft'; $state['receipt'] = null; $state['receivedAt'] = null; $dirty = true;
        respond(201, $file);
    }
    if (preg_match('~^/v1/files/([a-f0-9]{32})$~', $route, $match)) {
        $id = $match[1]; $file = $state['files'][$id] ?? null;
        if (!$file) fail(404, 'Arquivo não encontrado.');
        if ($method === 'GET') {
            $bytes = decryptData((string)file_get_contents($fileDirectory . '/' . $id)); commitState();
            header('Content-Type: application/octet-stream');
            header("Content-Disposition: attachment; filename*=UTF-8''" . rawurlencode($file['name']));
            echo $bytes; exit;
        }
        if ($method === 'DELETE') {
            if ($session['role'] !== 'admin') fail(403, 'Remoção de arquivo recebido exige acesso da agência.');
            // Commit metadata first; a crash can leave an encrypted orphan, never a broken live reference.
            unset($state['files'][$id]); $state['status'] = 'draft'; $state['receipt'] = null; $state['receivedAt'] = null; $dirty = true; commitState();
            @unlink($fileDirectory . '/' . $id); respond(200, ['ok' => true]);
        }
    }
    fail(404, 'Rota não encontrada.');
} catch (RequestError $error) {
    respond($error->status, ['error' => $error->getMessage()]);
} catch (Throwable $error) {
    // Do not commit a partially modified state after a storage or cryptography error.
    $dirty = false;
    if (isset($lock) && is_resource($lock)) { flock($lock, LOCK_UN); fclose($lock); }
    http_response_code(500); header('Content-Type: application/json; charset=utf-8');
    echo '{"error":"Não foi possível concluir no armazenamento privado. Tente novamente."}';
}
