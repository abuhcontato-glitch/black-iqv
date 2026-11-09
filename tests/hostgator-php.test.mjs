import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { mkdtemp, rm, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createServer } from 'node:net';
import { randomBytes } from 'node:crypto';
import { prepareHostgatorBackend } from '../scripts/hostgator-package-lib.mjs';
import { emptyDraft } from '../src/onboarding-app/model.ts';
const php = process.env.PHP_BINARY ?? 'php';
const available = spawnSync(php, ['-v'], { stdio: 'ignore' }).status === 0;
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
async function freePort() { const server = createServer(); await new Promise(resolve => server.listen(0, '127.0.0.1', resolve)); const port = server.address().port; await new Promise(resolve => server.close(resolve)); return port; }

test('HostGator PHP backend: authenticated persistent delivery, encrypted files, versions, roles and concurrency', { skip: !available ? 'PHP CLI unavailable; run with PHP_BINARY before packaging HostGator.' : false }, async () => {
  const home = await mkdtemp(join(tmpdir(), 'hostgator-php-'));
  const port = await freePort();
  const origin = `http://127.0.0.1:${port}`;
  const clientCode = 'client-hostgator-test-invitation-0001';
  const adminCode = 'agency-hostgator-test-invitation-0002';
  const setup = await prepareHostgatorBackend(home, { origin, allowHttp: true, clientCode, adminCode });
  const endpoint = `${origin}/onboarding-construcel/api/index.php?route=`;
  let processHandle;
  async function start() {
    processHandle = spawn(php, ['-S', `127.0.0.1:${port}`, '-t', join(home, 'public_html')], { stdio: 'ignore', detached: true, env: { ...process.env, PHP_CLI_SERVER_WORKERS: '4' } });
    for (let attempt = 0; attempt < 40; attempt++) {
      try { const response = await fetch(endpoint + '/health', { signal: AbortSignal.timeout(1000) }); if (response.status === 200) return; } catch {}
      if (processHandle.exitCode !== null) throw new Error('PHP server exited.');
      await pause(100);
    }
    throw new Error('PHP readiness timed out.');
  }
  async function stop() { if (!processHandle || processHandle.exitCode !== null) return; const exited = new Promise(resolve => processHandle.once('exit', resolve)); process.kill(-processHandle.pid, 'SIGTERM'); await exited; }
  const call = (path, init = {}) => fetch(endpoint + path, init);
  const headers = token => ({ Authorization: `Bearer ${token}` });
  const signIn = async code => (await call('/v1/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }) })).json();
  try {
    await start();
    assert.equal((await call('/v1/dossier')).status, 401);
    assert.equal((await call('/health', { headers: { Origin: 'https://unrelated.example' } })).status, 403);
    assert.equal((await call('/v1/login', { method: 'POST', body: JSON.stringify({ code: 'wrong' }) })).status, 401);
    const client = await signIn(clientCode);
    assert.equal(client.role, 'client');
    const draft = emptyDraft();
    Object.assign(draft.values, { 'empresa.razao': 'HOSTGATOR-PRIVATE-DATA-FIXTURE', 'empresa.fantasia': 'Construcel', 'empresa.contato': 'Ana', 'empresa.email': 'ana@example.com' });
    const save = expected => call('/v1/dossier', { method: 'PUT', headers: { ...headers(client.token), 'Content-Type': 'application/json', 'If-Match': String(expected) }, body: JSON.stringify(draft) });
    assert.equal((await save(0)).status, 200);
    const concurrent = await Promise.all([save(1), save(1)]);
    assert.deepEqual(concurrent.map(response => response.status).sort(), [200, 409]);
    const invalid = structuredClone(draft); invalid.links['marca.logo'] = 'javascript:alert(1)';
    assert.equal((await call('/v1/dossier', { method: 'PUT', headers: { ...headers(client.token), 'If-Match': '2' }, body: JSON.stringify(invalid) })).status, 400);
    const id = randomBytes(16).toString('hex');
    const uploadHeaders = { ...headers(client.token), 'Content-Type': 'application/octet-stream', 'X-Category': 'marca.logo', 'X-File-Name': encodeURIComponent('logo-ação.png'), 'X-File-Id': id };
    const bytes = Buffer.from('PRIVATE-FILE-HOSTGATOR');
    assert.equal((await call('/v1/files', { method: 'POST', headers: uploadHeaders, body: bytes })).status, 201);
    assert.equal((await call('/v1/files', { method: 'POST', headers: uploadHeaders, body: bytes })).status, 200);
    assert.equal((await call('/v1/files', { method: 'POST', headers: uploadHeaders, body: 'OTHER' })).status, 409);
    assert.equal((await call('/v1/files', { method: 'POST', headers: { ...uploadHeaders, 'X-File-Name': '..%2Fevil.png' }, body: bytes })).status, 422);
    assert.equal((await call('/v1/files', { method: 'POST', headers: { ...uploadHeaders, 'X-Category': '../private' }, body: bytes })).status, 400);
    const downloaded = await call(`/v1/files/${id}`, { headers: headers(client.token) });
    assert.equal(downloaded.headers.get('content-type'), 'application/octet-stream');
    assert.equal(downloaded.headers.get('x-content-type-options'), 'nosniff');
    assert.deepEqual(Buffer.from(await downloaded.arrayBuffer()), bytes);
    assert(!(await readFile(join(setup.privatePath, 'state.bin'))).includes(Buffer.from('HOSTGATOR-PRIVATE-DATA-FIXTURE')));
    assert(!(await readFile(join(setup.privatePath, 'files', id))).includes(bytes));
    assert.equal((await call(`/v1/files/${id}`, { method: 'DELETE', headers: headers(client.token) })).status, 403);
    assert.equal((await call('/v1/submit', { method: 'POST', headers: { ...headers(client.token), 'If-Match': '2' }, body: JSON.stringify({ confirm: false }) })).status, 422);
    const delivered = await call('/v1/submit', { method: 'POST', headers: { ...headers(client.token), 'If-Match': '2' }, body: JSON.stringify({ confirm: true }) });
    assert.equal((await delivered.json()).receipt, 'CONSTRUCEL-2');
    await stop(); await start();
    const agency = await signIn(adminCode);
    const received = await (await call('/v1/dossier', { headers: headers(agency.token) })).json();
    assert.equal(received.status, 'submitted');
    assert.equal(received.draft.values['empresa.razao'], 'HOSTGATOR-PRIVATE-DATA-FIXTURE');
    assert.equal(received.files.length, 1);
    assert.equal((await call(`/v1/files/${id}`, { method: 'DELETE', headers: headers(agency.token) })).status, 200);
    assert.equal((await call(`/v1/files/${id}`, { headers: headers(agency.token) })).status, 404);
  } finally { await stop(); await rm(home, { recursive: true, force: true }); }
});

test('HostGator package refuses to replace an existing private encryption configuration', async () => {
  const home = await mkdtemp(join(tmpdir(), 'hostgator-config-'));
  try {
    const setup = await prepareHostgatorBackend(home);
    const before = await readFile(join(setup.privatePath, 'config.php'));
    await assert.rejects(prepareHostgatorBackend(home), /EEXIST/);
    assert.deepEqual(await readFile(join(setup.privatePath, 'config.php')), before);
  } finally { await rm(home, { recursive: true, force: true }); }
});
