import { mkdir, writeFile, copyFile } from 'node:fs/promises';
import { join } from 'node:path';
import { randomBytes, createHash } from 'node:crypto';
import { steps, categories } from '../src/onboarding-app/model.ts';

export async function prepareHostgatorBackend(home, options = {}) {
  const origin = options.origin ?? 'https://abuhsca.com.br';
  const client = options.clientCode ?? randomBytes(32).toString('base64url');
  const admin = options.adminCode ?? randomBytes(32).toString('base64url');
  if (client === admin || client.length < 24 || admin.length < 24) throw new Error('Convites devem ser distintos e fortes.');
  const url = new URL(origin);
  if (url.origin !== origin || !['https:', 'http:'].includes(url.protocol) || (url.protocol === 'http:' && !options.allowHttp)) throw new Error('Origem inválida.');
  const target = join(home, 'public_html', 'onboarding-construcel', 'api');
  const privatePath = join(home, 'abuhsca-onboarding-private');
  await mkdir(target, { recursive: true });
  await mkdir(privatePath, { recursive: true, mode: 0o700 });
  await copyFile(new URL('../server/hostgator/api.php', import.meta.url), join(target, 'index.php'));
  await copyFile(new URL('../server/hostgator/api.htaccess', import.meta.url), join(target, '.htaccess'));
  await copyFile(new URL('../server/hostgator/user.ini', import.meta.url), join(target, '.user.ini'));
  await copyFile(new URL('../server/hostgator/private.htaccess', import.meta.url), join(privatePath, '.htaccess'));
  const schema = {
    fields: steps.flatMap(step => step.fields.map(field => `${step.id}.${field.id}`)),
    required: steps.flatMap(step => step.fields.filter(field => field.required).map(field => `${step.id}.${field.id}`)),
    steps: steps.map(step => step.id), categories: categories.map(category => category.key),
  };
  await writeFile(join(target, 'schema.json'), JSON.stringify(schema));
  const origins = [origin];
  if (!options.allowHttp) origins.push('https://www.' + url.hostname, 'https://abuhcontato-glitch.github.io');
  const phpLiteral = value => "'" + value.replaceAll('\\', '\\\\').replaceAll("'", "\\'") + "'";
  const config = `<?php\nreturn [\n 'key' => '${randomBytes(32).toString('hex')}',\n 'clientHash' => '${createHash('sha256').update(client).digest('hex')}',\n 'adminHash' => '${createHash('sha256').update(admin).digest('hex')}',\n 'origins' => ${'[' + origins.map(phpLiteral).join(', ') + ']'},\n 'allowHttp' => ${options.allowHttp ? 'true' : 'false'},\n];\n`;
  await writeFile(join(privatePath, 'config.php'), config, { mode: 0o600, flag: 'wx' });
  await writeFile(join(privatePath, 'CONVITES-PRIVADOS.txt'), `INSTALAÇÃO PRIVADA — CONSTRUCEL\n\nAplicativo: ${origin}/onboarding-construcel/\nConvite da CLIENTE (compartilhar somente com a cliente):\n${client}\n\nConvite da AGÊNCIA (não compartilhar com a cliente):\n${admin}\n\nNunca publique este arquivo nem envie o pacote de instalação à cliente. Guarde backup da configuração e dos dados fora de public_html. Não substitua config.php em uma atualização.\n`, { mode: 0o600, flag: 'wx' });
  return { target, privatePath, client, admin };
}
