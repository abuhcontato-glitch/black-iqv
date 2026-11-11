import http from 'node:http';
import { DatabaseSync } from 'node:sqlite';
import { createHash, randomBytes, createCipheriv, createDecipheriv, timingSafeEqual } from 'node:crypto';
import { mkdir, writeFile, readFile, unlink } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { categories, steps, missingRequired, isPrivateLink, validateFile } from '../../src/onboarding-app/model.ts';

export async function createOnboardingServer(options={}) {
 const dir=resolve(options.dataDir??process.env.DATA_DIR??'/data');await mkdir(join(dir,'files'),{recursive:true,mode:0o700});
 const key=Buffer.from(options.key??process.env.DATA_KEY??'','hex');if(key.length!==32)throw new Error('DATA_KEY deve conter 32 bytes em hexadecimal.');
 const clientHash=options.clientHash??process.env.CLIENT_TOKEN_HASH,adminHash=options.adminHash??process.env.ADMIN_TOKEN_HASH;
 if(!/^[a-f0-9]{64}$/.test(clientHash??'')||!/^[a-f0-9]{64}$/.test(adminHash??'')||clientHash===adminHash)throw new Error('Configure hashes SHA-256 distintos para convites de cliente e agência.');
 const allowedOrigin=options.origin??process.env.ALLOWED_ORIGIN;if(!allowedOrigin)throw new Error('Configure ALLOWED_ORIGIN.');
 const db=new DatabaseSync(join(dir,'onboarding.sqlite'));db.exec('PRAGMA journal_mode=WAL; CREATE TABLE IF NOT EXISTS dossier (id INTEGER PRIMARY KEY CHECK(id=1), version INTEGER NOT NULL, payload BLOB NOT NULL, status TEXT NOT NULL, updated TEXT NOT NULL); CREATE TABLE IF NOT EXISTS files (id TEXT PRIMARY KEY, category TEXT NOT NULL, name TEXT NOT NULL, type TEXT NOT NULL, size INTEGER NOT NULL, created TEXT NOT NULL);');
 const encrypt=(buffer)=>{const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',key,iv);return Buffer.concat([iv,cipher.update(buffer),cipher.final(),cipher.getAuthTag()]);};
 const decrypt=(buffer)=>{const bytes=Buffer.from(buffer),cipher=createDecipheriv('aes-256-gcm',key,bytes.subarray(0,12));cipher.setAuthTag(bytes.subarray(-16));return Buffer.concat([cipher.update(bytes.subarray(12,-16)),cipher.final()]);};
 const sessions=new Map(),attempts=new Map();let changing=false;
 const json=(res,status,data)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data));};
 const error=(status,message)=>Object.assign(new Error(message),{status});
 async function body(req,max){const chunks=[];let size=0;for await(const chunk of req){size+=chunk.length;if(size>max)throw error(413,'Arquivo ou solicitação acima do limite.');chunks.push(chunk);}return Buffer.concat(chunks);}
 const parse=async(req)=>{try{return JSON.parse((await body(req,1024*1024)).toString());}catch(e){if(e.status)throw e;throw error(400,'JSON inválido.');}};
 function sanitize(draft){
  if(draft?.schema!==1||!draft.values||!draft.links||!draft.categoryState||!Array.isArray(draft.completed))throw error(400,'Dossiê inválido.');
  const result={schema:1,values:{},links:{},categoryState:{},completed:[],updatedAt:new Date().toISOString()};
  for(const step of steps)for(const field of step.fields){const id=`${step.id}.${field.id}`,value=draft.values[id];if(value!==undefined){if(typeof value!=='string'||value.length>8000)throw error(400,'Campo inválido ou muito longo.');result.values[id]=value;}}
  for(const category of categories){const link=draft.links[category.key];if(link){if(typeof link!=='string'||link.length>2000||!isPrivateLink(link))throw error(400,'Links devem usar HTTPS.');result.links[category.key]=link;}const state=draft.categoryState[category.key];if(state){if(!['Disponível','Não possui','A providenciar','Não se aplica'].includes(state))throw error(400,'Situação inválida.');result.categoryState[category.key]=state;}}
  result.completed=draft.completed.filter(id=>steps.some(step=>step.id===id));return result;
 }
 function getDossier(){const row=db.prepare('SELECT * FROM dossier WHERE id=1').get();return row?{version:row.version,draft:JSON.parse(decrypt(row.payload)),status:row.status,updatedAt:row.updated}: {version:0,draft:null,status:'draft'};}
 db.exec('CREATE TABLE IF NOT EXISTS receipt (id INTEGER PRIMARY KEY, payload BLOB NOT NULL)');
 const persistedReceipt=()=>{const row=db.prepare('SELECT payload FROM receipt WHERE id=1').get();return row?JSON.parse(decrypt(row.payload)):{receipt:null,receivedAt:null};};
 const server=http.createServer(async(req,res)=>{
  try{
   if(req.headers.origin&&req.headers.origin!==allowedOrigin)throw error(403,'Origem não autorizada.');
   res.setHeader('Access-Control-Allow-Origin',allowedOrigin);res.setHeader('Vary','Origin');res.setHeader('Access-Control-Allow-Headers','Authorization,Content-Type,If-Match,X-File-Name,X-Category,X-File-Id');res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,DELETE,OPTIONS');
   if(req.method==='OPTIONS'){res.writeHead(204);res.end();return;}
   const path=new URL(req.url,'http://localhost').pathname;
   if(path==='/health'&&req.method==='GET'){json(res,200,{ok:true});return;}
   if(path==='/v1/login'&&req.method==='POST'){
    const ip=req.socket.remoteAddress??'unknown',now=Date.now();let item=attempts.get(ip);if(!item||item.until<now){item={count:0,until:now+10*60*1000};attempts.set(ip,item);}if(++item.count>10)throw error(429,'Muitas tentativas. Aguarde 10 minutos.');
    const input=await parse(req);if(typeof input.code!=='string'||input.code.length<24||input.code.length>200)throw error(401,'Convite inválido.');const hash=createHash('sha256').update(input.code).digest();let role=null;
    for(const [label,value] of [['client',clientHash],['admin',adminHash]])if(timingSafeEqual(hash,Buffer.from(value,'hex')))role=label;
    if(!role)throw error(401,'Convite inválido.');if(sessions.size>1000)sessions.clear();const token=randomBytes(32).toString('base64url');sessions.set(token,{role,expires:now+2*60*60*1000});json(res,200,{token,role,expiresAt:now+2*60*60*1000});return;
   }
   const session=sessions.get((req.headers.authorization??'').replace(/^Bearer /,''));if(!session||session.expires<Date.now())throw error(401,'Acesso expirado. Entre novamente com seu convite.');
   if(path==='/v1/dossier'&&req.method==='GET'){json(res,200,{...getDossier(),...persistedReceipt(),files:db.prepare('SELECT * FROM files ORDER BY created').all()});return;}
   if(path==='/v1/dossier'&&req.method==='PUT'){
    if(session.role!=='client')throw error(403,'Somente a cliente pode alterar as respostas.');
    const draft=sanitize(await parse(req)),current=getDossier();if(String(current.version)!==req.headers['if-match'])throw error(409,'Existe uma versão mais recente. Carregue a versão da nuvem antes de salvar.');const version=current.version+1;db.prepare('DELETE FROM receipt').run();
    db.prepare('INSERT INTO dossier(id,version,payload,status,updated) VALUES(1,?,?,?,?) ON CONFLICT(id) DO UPDATE SET version=excluded.version,payload=excluded.payload,status=excluded.status,updated=excluded.updated').run(version,encrypt(Buffer.from(JSON.stringify(draft))),'draft',draft.updatedAt);json(res,200,{version,status:'draft',updatedAt:draft.updatedAt});return;
   }
   if(path==='/v1/submit'&&req.method==='POST'){
    if(session.role!=='client')throw error(403,'Somente a cliente pode concluir o envio.');
    const current=getDossier();if(!current.draft||missingRequired(current.draft).length||!/^\S+@\S+\.\S+$/.test(current.draft.values['empresa.email']??''))throw error(422,'Preencha os dados essenciais da empresa e um e-mail válido.');if(String(current.version)!==req.headers['if-match'])throw error(409,'A versão foi atualizada. Confira antes de entregar.');const input=await parse(req);if(input.confirm!==true)throw error(422,'Confirme a revisão e as pendências.');
    if(input.fileIds){const actual=db.prepare('SELECT id FROM files').all().map(row=>row.id).sort();if(!Array.isArray(input.fileIds)||JSON.stringify([...input.fileIds].sort())!==JSON.stringify(actual))throw error(409,'Os arquivos mudaram. Atualize antes de concluir.');}let receipt=persistedReceipt();if(current.status!=='submitted'||!receipt.receivedAt){receipt={receipt:`CONSTRUCEL-${current.version}`,receivedAt:new Date().toISOString()};db.prepare('INSERT INTO receipt(id,payload) VALUES(1,?) ON CONFLICT(id) DO UPDATE SET payload=excluded.payload').run(encrypt(Buffer.from(JSON.stringify(receipt))));}db.prepare("UPDATE dossier SET status='submitted' WHERE id=1").run();json(res,200,{status:'submitted',version:current.version,...receipt});return;
   }
   if(path==='/v1/files'&&req.method==='POST'){
    if(session.role!=='client')throw error(403,'Somente a cliente pode enviar materiais.');
    if(changing)throw error(409,'Outro arquivo está sendo processado. Tente novamente.');changing=true;
    try{const category=String(req.headers['x-category']??'');if(!categories.some(item=>item.key===category))throw error(400,'Categoria inválida.');let name;try{name=decodeURIComponent(String(req.headers['x-file-name']??''));}catch{throw error(400,'Nome inválido.');}if(name.length>200||/[\\/\x00-\x1f]/.test(name))throw error(400,'Nome inválido.');
     const bytes=await body(req,50*1024*1024),total=db.prepare('SELECT COALESCE(SUM(size),0) AS total FROM files').get().total,msg=validateFile({name,size:bytes.length},Number(total)-Number(db.prepare('SELECT size FROM files WHERE id=?').get(String(req.headers['x-file-id']??''))?.size??0));if(msg)throw error(422,msg);
     const requested=String(req.headers['x-file-id']??'');if(!/^[a-f0-9]{32}$/.test(requested))throw error(400,'Identificador de arquivo inválido.');const previous=db.prepare('SELECT * FROM files WHERE id=?').get(requested);if(previous){if(previous.name!==name||previous.category!==category||previous.size!==bytes.length||!createHash('sha256').update(decrypt(await readFile(join(dir,'files',requested)))).digest().equals(createHash('sha256').update(bytes).digest()))throw error(409,'Identificador de arquivo já utilizado.');json(res,200,previous);return;}
     const file={id:requested,category,name,type:'application/octet-stream',size:bytes.length,created:new Date().toISOString()};await writeFile(join(dir,'files',file.id),encrypt(bytes),{mode:0o600});try{db.exec('BEGIN');db.prepare('INSERT INTO files VALUES(?,?,?,?,?,?)').run(file.id,file.category,file.name,file.type,file.size,file.created);db.prepare('DELETE FROM receipt').run();db.prepare("UPDATE dossier SET status='draft' WHERE id=1").run();db.exec('COMMIT');}catch(e){db.exec('ROLLBACK');await unlink(join(dir,'files',file.id));throw e;}json(res,201,file);return;
    }finally{changing=false;}
   }
   const match=path.match(/^\/v1\/files\/([a-f0-9]{32})$/);if(match){const file=db.prepare('SELECT * FROM files WHERE id=?').get(match[1]);if(!file)throw error(404,'Arquivo não encontrado.');if(req.method==='GET'){const bytes=decrypt(await readFile(join(dir,'files',file.id)));res.writeHead(200,{'Content-Type':'application/octet-stream','Content-Disposition':`attachment; filename*=UTF-8''${encodeURIComponent(file.name)}`,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(bytes);return;}if(req.method==='DELETE'){if(session.role!=='admin')throw error(403,'Remoção de arquivo recebido exige acesso da agência.');db.exec('BEGIN');try{db.prepare('DELETE FROM files WHERE id=?').run(file.id);db.prepare('DELETE FROM receipt').run();db.prepare("UPDATE dossier SET status='draft' WHERE id=1").run();db.exec('COMMIT');}catch(e){db.exec('ROLLBACK');throw e;}await unlink(join(dir,'files',file.id)).catch(()=>{});json(res,200,{ok:true});return;}}
   throw error(404,'Rota não encontrada.');
  }catch(e){if(!res.headersSent)json(res,e.status??500,{error:e.status?e.message:'Não foi possível concluir. Tente novamente.'});else res.end();}
 });
 server.on('close',()=>db.close());return server;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const server=await createOnboardingServer();server.listen(Number(process.env.PORT??8080),'0.0.0.0',()=>console.log('Onboarding privado iniciado.'));}
