import {randomBytes,createHash} from 'node:crypto';import {writeFile} from 'node:fs/promises';
const client=randomBytes(32).toString('base64url'),admin=randomBytes(32).toString('base64url');
await writeFile('onboarding-private.env',`DATA_KEY=${randomBytes(32).toString('hex')}\nCLIENT_TOKEN_HASH=${createHash('sha256').update(client).digest('hex')}\nADMIN_TOKEN_HASH=${createHash('sha256').update(admin).digest('hex')}\nALLOWED_ORIGIN=https://abuhcontato-glitch.github.io\n`,{mode:0o600,flag:'wx'});
await writeFile('onboarding-invites-private.txt',`Convite cliente: ${client}\nConvite agência: ${admin}\nCompartilhe separadamente por canal privado. Não publique nem envie ao GitHub.\n`,{mode:0o600,flag:'wx'});
console.log('Configuração e convites gravados em arquivos privados locais.');
