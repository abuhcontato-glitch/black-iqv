import {test} from 'node:test';import assert from 'node:assert/strict';import {mkdtemp,rm,stat} from 'node:fs/promises';import {tmpdir} from 'node:os';import {join} from 'node:path';import {spawnSync} from 'node:child_process';
test('standalone public HTML and ZIP metadata use 0644 for shared-hosting static access',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'dossier-permissions-'));try{
  const archive=join(dir,'dossie.zip');const built=spawnSync(process.execPath,['scripts/build-standalone-dossier.mjs','--output',archive],{encoding:'utf8'});assert.equal(built.status,0,built.stderr);
  assert.equal((await stat(join(dir,'consulta-autonoma.html'))).mode&0o777,0o644);
  const checked=spawnSync('python3',['-c',"import zipfile,sys\nwith zipfile.ZipFile(sys.argv[1]) as z:\n assert z.testzip() is None\n assert (z.getinfo('dossie-construcel/index.html').external_attr>>16)&0o777==0o644\n assert (z.getinfo('LEIA-ME.txt').external_attr>>16)&0o777==0o644\n page=z.read('dossie-construcel/index.html')\n assert b'encrypted-payload' in page\n assert b\"fetch('./record.bin'\" not in page\n",archive],{encoding:'utf8'});assert.equal(checked.status,0,checked.stderr);
 }finally{await rm(dir,{recursive:true,force:true});}
});
