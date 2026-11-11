import type { Draft, Attachment } from './model';
import type { CloudFile, Receipt } from './cloud';
export type SyncPhase = 'saved'|'pending'|'saving'|'offline'|'error'|'conflict';
export type FileTransfer = { phase:'pending'|'uploading'|'received'|'error'; progress:number; error?:string };
export type SyncState = {phase:SyncPhase; error:string; files:Record<string,FileTransfer>; remoteFiles:CloudFile[]; receipt:Receipt|null; busy:boolean};
export type SyncApi = {save:(draft:Draft,version:number)=>Promise<{version:number}>;upload:(file:Attachment,progress:(value:number)=>void)=>Promise<CloudFile>;submit:(version:number,ids:string[])=>Promise<Receipt>};
const fingerprint=(draft:Draft)=>JSON.stringify(draft);
export class DossierSync {
 private draft:Draft; private acknowledged:string; private version:number; private queued=new Map<string,Attachment>(); private tail:Promise<unknown>=Promise.resolve(); private timer:ReturnType<typeof setTimeout>|undefined; private disposed=false; private blocked=false;
 state:SyncState; private api:SyncApi; private changed:(state:SyncState)=>void;
 constructor(draft:Draft,version:number,files:CloudFile[],api:SyncApi,changed:(state:SyncState)=>void,hasRemote=true,receipt:Receipt|null=null){this.api=api;this.changed=changed;this.draft=draft;this.acknowledged=hasRemote?fingerprint(draft):'';this.version=version;this.state={phase:hasRemote?'saved':'pending',error:'',files:Object.fromEntries(files.map(file=>[file.id,{phase:'received',progress:1}])),remoteFiles:files,receipt,busy:false};}
 private emit(update:Partial<SyncState>={}){if(this.disposed)return;this.state={...this.state,...update};this.changed({...this.state,files:{...this.state.files},remoteFiles:[...this.state.remoteFiles]});}
 schedule(draft:Draft){this.draft=draft;if(fingerprint(draft)===this.acknowledged)return;this.emit({phase:this.blocked?'conflict':'pending',receipt:null});clearTimeout(this.timer);if(!this.blocked)this.timer=setTimeout(()=>{void this.flush().catch(()=>{});},650);}
 attach(file:Attachment){if(this.state.remoteFiles.some(item=>item.id===file.id))return;this.queued.set(file.id,file);this.state.files[file.id]={phase:'pending',progress:0};this.emit({phase:'pending',receipt:null});if(!this.blocked)void this.flush().catch(()=>{});}
 removeLocal(id:string){if(this.state.files[id]?.phase==='uploading')return;this.queued.delete(id);delete this.state.files[id];this.emit();}
 private run<T>(work:()=>Promise<T>):Promise<T>{const next=this.tail.catch(()=>{}).then(async()=>{if(this.disposed)throw new Error('Sessão encerrada.');if(this.blocked)throw new Error('Há uma versão diferente no servidor. Compare antes de continuar.');this.emit({busy:true});try{return await work();}catch(error){const status=(error as {status?:number}).status;this.blocked=status===409;this.emit({phase:this.blocked?'conflict':typeof navigator!=='undefined'&&!navigator.onLine?'offline':'error',error:error instanceof Error?error.message:'Falha na sincronização.'});throw error;}finally{this.emit({busy:false});}});this.tail=next;return next;}
 private async synchronize(force=false){
  while(!this.disposed&&(force||fingerprint(this.draft)!==this.acknowledged)){
   force=false;const snapshot=this.draft,signature=fingerprint(snapshot);this.emit({phase:'saving',error:''});const result=await this.api.save(snapshot,this.version);if(this.disposed)return;this.version=result.version;this.acknowledged=signature;this.emit({phase:signature===fingerprint(this.draft)&&this.queued.size===0?'saved':'pending',receipt:null});
  }
  for(const [id,file] of this.queued){
   if(this.disposed)return;this.state.files[id]={phase:'uploading',progress:0};this.emit({phase:'saving',error:''});
   try{const remote=await this.api.upload(file,progress=>{this.state.files[id]={phase:'uploading',progress};this.emit();});if(this.disposed)return;this.queued.delete(id);this.state.files[id]={phase:'received',progress:1};this.emit({remoteFiles:[...this.state.remoteFiles.filter(item=>item.id!==id),remote],receipt:null});}
   catch(error){this.state.files[id]={phase:'error',progress:0,error:error instanceof Error?error.message:'Falha no envio.'};this.emit();throw error;}
  }
  if(fingerprint(this.draft)!==this.acknowledged)await this.synchronize();
  if(!this.disposed)this.emit({phase:'saved',error:''});
 }
 flush(){clearTimeout(this.timer);return this.run(()=>this.synchronize());}
 submit(){clearTimeout(this.timer);return this.run(async()=>{await this.synchronize(true);if(this.disposed)throw new Error('Sessão encerrada.');const result=await this.api.submit(this.version,this.state.remoteFiles.map(file=>file.id));if(this.disposed)throw new Error('Sessão encerrada.');this.emit({receipt:result,phase:'saved',error:''});return result;});}
 dispose(){this.disposed=true;clearTimeout(this.timer);}
}
