import type { Draft, Attachment } from './model';
const base=(import.meta.env.VITE_ONBOARDING_API_URL??'').replace(/\/$/,'');
export const cloudAvailable=(()=>{try{const url=new URL(base);return url.protocol==='https:'||(url.protocol==='http:'&&['127.0.0.1','localhost'].includes(url.hostname));}catch{return false;}})();
export type Session={token:string;role:'client'|'admin';expiresAt:number};
export type CloudFile={id:string;category:string;name:string;size:number;type:string;created:string};
export type CloudDossier={version:number;draft:Draft|null;status:string;files:CloudFile[]};
async function request(path:string,session?:Session,init:RequestInit={}){if(!cloudAvailable)throw new Error('O recebimento online ainda não foi ativado. Seus dados permanecem neste aparelho.');const response=await fetch(base+path,{...init,headers:{...(session?{Authorization:`Bearer ${session.token}`}:{}) ,...init.headers}});if(!response.ok){let message='Não foi possível conectar ao recebimento.';try{message=(await response.json()).error??message;}catch{}throw new Error(message);}return response;}
export async function login(code:string):Promise<Session>{return (await request('/v1/login',undefined,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code})})).json();}
export async function loadCloud(session:Session):Promise<CloudDossier>{return (await request('/v1/dossier',session)).json();}
export async function saveCloud(session:Session,draft:Draft,version:number):Promise<{version:number}>{return (await request('/v1/dossier',session,{method:'PUT',headers:{'Content-Type':'application/json','If-Match':String(version)},body:JSON.stringify(draft)})).json();}
export async function uploadCloud(session:Session,file:Attachment):Promise<CloudFile>{return (await request('/v1/files',session,{method:'POST',headers:{'Content-Type':'application/octet-stream','X-File-Name':encodeURIComponent(file.name),'X-Category':file.category,'X-File-Id':file.id},body:file.blob})).json();}
export async function submitCloud(session:Session,version:number):Promise<{receipt:string;receivedAt:string}>{return (await request('/v1/submit',session,{method:'POST',headers:{'Content-Type':'application/json','If-Match':String(version)},body:JSON.stringify({confirm:true})})).json();}
export async function downloadCloud(session:Session,id:string):Promise<Blob>{return (await request(`/v1/files/${id}`,session)).blob();}
