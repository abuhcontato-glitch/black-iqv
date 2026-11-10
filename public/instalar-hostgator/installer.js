import { privateZip, appendPrivateZip } from './zip.js';
const button = document.querySelector('#prepare');
const save = document.querySelector('#save');
const status = document.querySelector('#status');
const progress = document.querySelector('#progress');
let downloadUrl;
const hex = bytes => Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
const token = () => hex(crypto.getRandomValues(new Uint8Array(32)));
const hash = async text => hex(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))));
button.addEventListener('click', async () => {
  button.disabled = true; save.hidden = true; progress.hidden = false;
  status.textContent = 'Baixando os arquivos públicos do aplicativo…';
  try {
    if (!crypto.subtle || !crypto.getRandomValues) throw new Error('Abra esta página por HTTPS em um navegador atualizado.');
    const response = await fetch('./base.zip', { credentials: 'omit' });
    if (!response.ok) throw new Error('O pacote ainda não está disponível. Atualize esta página e tente novamente.');
    const total = Number(response.headers.get('content-length'));
    const chunks = []; let received = 0;
    if (!response.body) throw new Error('Use um navegador atualizado para baixar o pacote.');
    const reader = response.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      received += value.length;
      if (received > 150 * 1024 * 1024) throw new Error('Pacote acima do tamanho esperado.');
      chunks.push(value);
      if (total) { progress.max = total; progress.value = received; }
      status.textContent = `Baixando aplicativo: ${(received / 1024 / 1024).toFixed(1)} MB${total ? ` de ${(total / 1024 / 1024).toFixed(1)} MB` : ''}.`;
    }
    status.textContent = 'Preparando a configuração privada neste navegador…';
    const client = token(), admin = token(), key = token();
    const clientHash = await hash(client), adminHash = await hash(admin);
    const config = `<?php\nreturn [\n 'key' => '${key}',\n 'clientHash' => '${clientHash}',\n 'adminHash' => '${adminHash}',\n 'origins' => ['https://abuhsca.com.br', 'https://www.abuhsca.com.br', 'https://abuhcontato-glitch.github.io'],\n 'allowHttp' => false,\n];\n`;
    const invitations = `CONVITES PRIVADOS — ONBOARDING CONSTRUCEL\n\nAplicativo: https://abuhsca.com.br/onboarding-construcel/\n\nConvite da CLIENTE (compartilhar somente com a cliente):\n${client}\n\nConvite da AGÊNCIA (não compartilhar com a cliente):\n${admin}\n\nGuarde este arquivo em local privado. Não publique e não envie o ZIP ao grupo. Nunca substitua config.php de uma instalação com dados.\n`;
    const extra = await privateZip([
      { name: 'abuhsca-onboarding-private/config.php', content: config },
      { name: 'abuhsca-onboarding-private/CONVITES-PRIVADOS.txt', content: invitations },
    ]);
    const base = new Uint8Array(await new Blob(chunks).arrayBuffer());
    const archive = appendPrivateZip(base, extra);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    downloadUrl = URL.createObjectURL(archive);
    save.href = downloadUrl; save.hidden = false; progress.hidden = true; button.hidden = true;
    status.textContent = 'Pronto. Clique em “Salvar ZIP no computador”. Os convites foram gerados neste navegador e não foram enviados ao servidor.';
  } catch (error) {
    status.textContent = error instanceof Error ? error.message : 'Não foi possível preparar o download.';
    progress.hidden = true; button.disabled = false;
  }
});
