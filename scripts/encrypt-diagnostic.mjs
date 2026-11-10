import { readFile, writeFile } from 'node:fs/promises';
import { createCipheriv,randomBytes } from 'node:crypto';
import { resolve,relative } from 'node:path';
const [input,keyFile]=process.argv.slice(2);
if(!input||!keyFile)throw Error('Uso: node scripts/encrypt-diagnostic.mjs /arquivo/privado.json /chave/privada.json');
for(const path of [input,keyFile]){const r=relative(process.cwd(),resolve(path));if(!r.startsWith('..'))throw Error('Fontes privadas devem estar fora do repositório.');}
const data=JSON.parse(await readFile(input,'utf8'));if(data.schema!==1||!Array.isArray(data.sections))throw Error('Diagnóstico inválido');
const key=Buffer.from(JSON.parse(await readFile(keyFile,'utf8')).key,'base64url');if(key.length!==32)throw Error('Chave inválida');
const iv=randomBytes(12),header=Buffer.from('ABUHDS01'),cipher=createCipheriv('aes-256-gcm',key,iv);cipher.setAAD(header);
await writeFile('public/diagnostico-construcel/record.bin',Buffer.concat([header,iv,cipher.update(JSON.stringify(data)),cipher.final(),cipher.getAuthTag()]),{mode:0o644});
console.log('Diagnóstico criptografado. Fontes e chave não publicadas.');
