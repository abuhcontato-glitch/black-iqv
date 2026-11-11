import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DossierSync} from '../src/onboarding-app/sync.ts';
import {emptyDraft} from '../src/onboarding-app/model.ts';
const changed=(text)=>({...emptyDraft(),values:{'empresa.razao':text}});
const tick=()=>new Promise(resolve=>setImmediate(resolve));
const file={id:'a'.repeat(32),name:'logo.png',category:'marca.logo',size:3,type:'image/png',createdAt:new Date().toISOString(),blob:new Blob(['png'])};
const remote={...file,created:new Date().toISOString()};
test('an in-flight acknowledgement never claims that newer edits are saved',async()=>{
 let release;const calls=[];const first=new Promise(resolve=>release=resolve);
 const engine=new DossierSync(emptyDraft(),0,[],{save:async(draft,version)=>{calls.push(draft.values['empresa.razao']);if(calls.length===1)await first;return {version:version+1};},upload:async()=>remote,submit:async()=>{throw Error('unexpected');}},()=>{});
 engine.schedule(changed('PRIMEIRA'));const flushing=engine.flush();await tick();engine.schedule(changed('SEGUNDA'));assert.notEqual(engine.state.phase,'saved');release();await flushing;assert.deepEqual(calls,['PRIMEIRA','SEGUNDA']);assert.equal(engine.state.phase,'saved');engine.dispose();
});
test('100% transmitted is not received until acknowledgement; failed upload retries the same file',async()=>{
 let attempts=0;const engine=new DossierSync(emptyDraft(),0,[],{save:async(_draft,version)=>({version:version+1}),upload:async(upload,progress)=>{attempts++;assert.equal(upload.id,file.id);progress(1);assert.equal(engine.state.files[file.id].phase,'uploading');if(attempts===1)throw Error('conexão perdida');return remote;},submit:async()=>{throw Error('unexpected');}},()=>{});
 engine.attach(file);await tick();assert.equal(engine.state.files[file.id].phase,'error');assert.equal(engine.state.remoteFiles.length,0);assert.equal(engine.state.receipt,null);await engine.flush();assert.equal(attempts,2);assert.equal(engine.state.remoteFiles.length,1);assert.equal(engine.state.files[file.id].phase,'received');engine.dispose();
});
test('a version conflict stops later writes and keeps local changes without automatic overwrite',async()=>{
 let calls=0;const engine=new DossierSync(emptyDraft(),0,[],{save:async()=>{calls++;throw Object.assign(Error('versão mais recente'),{status:409});},upload:async()=>remote,submit:async()=>{throw Error('unexpected');}},()=>{});
 engine.schedule(changed('RASCUHO PRESERVADO'));await assert.rejects(engine.flush(),/versão/);engine.schedule(changed('NOVA ALTERAÇÃO'));await assert.rejects(engine.flush(),/versão/);assert.equal(calls,1);assert.equal(engine.state.phase,'conflict');assert.equal(engine.state.receipt,null);engine.dispose();
});
test('final receipt requires every pending upload, confirmed answers and exact attachment manifest',async()=>{
 const actions=[];const receipt={receipt:'CONSTRUCEL-TESTE',receivedAt:new Date().toISOString()};
 const engine=new DossierSync(emptyDraft(),0,[],{save:async(_draft,version)=>{actions.push('save');return {version:version+1};},upload:async()=>{actions.push('upload');return remote;},submit:async(version,ids)=>{actions.push('submit');assert(version>0);assert.deepEqual(ids,[file.id]);return receipt;}},()=>{});
 engine.attach(file);const result=await engine.submit();assert.deepEqual(result,receipt);assert(actions.indexOf('upload')<actions.indexOf('submit'));assert(actions.lastIndexOf('save')<actions.indexOf('submit'));assert.deepEqual(engine.state.receipt,receipt);engine.schedule(changed('EDITADO APÓS ENVIO'));assert.equal(engine.state.receipt,null);engine.dispose();
});
