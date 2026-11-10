import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { privateZip, inspectZip, appendPrivateZip } from '../public/instalar-hostgator/zip.js';

test('browser installer appends private files without recompressing or corrupting public files', async () => {
  const fixture = spawnSync('python3', ['-c', `import io,sys,zipfile\nb=io.BytesIO()\nwith zipfile.ZipFile(b,'w',zipfile.ZIP_DEFLATED) as z:\n z.writestr('public_html/onboarding-construcel/index.html','PUBLIC TEMPLATE')\n z.writestr('abuhsca-onboarding-private/.htaccess','Require all denied')\nsys.stdout.buffer.write(b.getvalue())\n`]);
  assert.equal(fixture.status, 0);
  const extra = await privateZip([{ name: 'abuhsca-onboarding-private/config.php', content: 'PRIVATE TEST CONFIGURATION' }, { name: 'abuhsca-onboarding-private/CONVITES-PRIVADOS.txt', content: 'PRIVATE TEST INVITES' }]);
  const joined = appendPrivateZip(new Uint8Array(fixture.stdout), extra);
  const bytes = new Uint8Array(await joined.arrayBuffer());
  assert.equal(inspectZip(bytes).count, 4);
  const verified = spawnSync('python3', ['-c', `import io,sys,zipfile\nz=zipfile.ZipFile(io.BytesIO(sys.stdin.buffer.read()))\nassert z.testzip() is None\nassert z.read('public_html/onboarding-construcel/index.html')==b'PUBLIC TEMPLATE'\nassert z.read('abuhsca-onboarding-private/config.php')==b'PRIVATE TEST CONFIGURATION'\nassert z.read('abuhsca-onboarding-private/CONVITES-PRIVADOS.txt')==b'PRIVATE TEST INVITES'\nassert z.getinfo('public_html/onboarding-construcel/index.html').compress_type==zipfile.ZIP_DEFLATED\nassert (z.getinfo('abuhsca-onboarding-private/config.php').external_attr>>16)&0o777==0o600\n`], { input: bytes });
  assert.equal(verified.status, 0, verified.stderr.toString());
});

test('browser installer rejects a public template containing credentials, invalid paths or damaged indexes', async () => {
  const extra = await privateZip([{ name: 'abuhsca-onboarding-private/config.php', content: 'FIXTURE' }]);
  const credentials = await privateZip([{ name: 'abuhsca-onboarding-private/config.php', content: 'SHOULD NOT BE PUBLIC' }]);
  assert.throws(() => appendPrivateZip(credentials, extra), /convites|privada/);
  const otherPath = await privateZip([{ name: '../../unexpected', content: 'FIXTURE' }]);
  assert.throws(() => appendPrivateZip(otherPath, extra), /Estrutura|Caminho/);
  const legitimate = await privateZip([{ name: 'public_html/onboarding-construcel/index.html', content: 'PUBLIC' }]);
  assert.throws(() => appendPrivateZip(legitimate, otherPath), /Caminho/);
  assert.throws(() => inspectZip(new Uint8Array(50)), /inválido/);
});
