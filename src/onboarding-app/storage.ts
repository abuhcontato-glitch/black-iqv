import type { Attachment, Draft } from './model';
const name='construcel-onboarding-app-v1';
export function openStore():Promise<IDBDatabase>{return new Promise((resolve,reject)=>{const req=indexedDB.open(name,1);req.onupgradeneeded=()=>{req.result.createObjectStore('draft');req.result.createObjectStore('files',{keyPath:'id'});};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);req.onblocked=()=>reject(new Error('Feche outras abas do onboarding e tente novamente.'));});}
async function transaction<T>(store:string,mode:IDBTransactionMode,action:(object:IDBObjectStore)=>IDBRequest<T>):Promise<T>{const db=await openStore();return new Promise((resolve,reject)=>{const tx=db.transaction(store,mode);const request=action(tx.objectStore(store));tx.oncomplete=()=>{db.close();resolve(request.result);};tx.onabort=tx.onerror=()=>{db.close();reject(tx.error??new Error('Não foi possível salvar neste navegador.'));};});}
export const loadDraft=()=>transaction<Draft|undefined>('draft','readonly',store=>store.get('current'));
export const saveDraft=(draft:Draft)=>transaction('draft','readwrite',store=>store.put(draft,'current'));
export const listFiles=()=>transaction<Attachment[]>('files','readonly',store=>store.getAll());
export const putFile=(file:Attachment)=>transaction('files','readwrite',store=>store.put(file));
export const removeFile=(id:string)=>transaction('files','readwrite',store=>store.delete(id));
