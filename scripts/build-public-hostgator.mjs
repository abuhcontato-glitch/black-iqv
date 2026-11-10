import { mkdtemp, mkdir, cp, copyFile, writeFile, rm, chmod } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { steps, categories } from '../src/onboarding-app/model.ts';
const root = fileURLToPath(new URL('..', import.meta.url));
const argument = process.argv.indexOf('--output');
if (argument < 0 || !process.argv[argument + 1]) throw new Error('Use --output /caminho/base.zip');
const output = resolve(process.argv[argument + 1]);
const temp = await mkdtemp(join(tmpdir(), 'hostgator-public-'));
try {
  const build = join(temp, 'build'), home = join(temp, 'home'), target = join(home, 'public_html', 'onboarding-construcel'), api = join(target, 'api');
  const result = spawnSync('npm', ['run', 'build', '--', '--base=/onboarding-construcel/', `--outDir=${build}`, '--emptyOutDir'], {
    cwd: root, env: { ...process.env, VITE_ONBOARDING_API_URL: 'https://abuhsca.com.br/onboarding-construcel/api/index.php?route=' }, stdio: ['ignore', 'ignore', 'inherit'],
  });
  if (result.status !== 0) throw new Error('Build público HostGator falhou.');
  await mkdir(api, { recursive: true });
  await copyFile(join(build, 'construcel', 'onboarding', 'index.html'), join(target, 'index.html'));
  await cp(join(build, 'assets'), join(target, 'assets'), { recursive: true });
  await cp(join(build, 'media', 'construcel'), join(target, 'media', 'construcel'), { recursive: true });
  for (const [from, to] of [['public.htaccess', join(target, '.htaccess')], ['api.php', join(api, 'index.php')], ['api.htaccess', join(api, '.htaccess')], ['user.ini', join(api, '.user.ini')]]) await copyFile(join(root, 'server', 'hostgator', from), to);
  await writeFile(join(api, 'schema.json'), JSON.stringify({ fields: steps.flatMap(step => step.fields.map(field => `${step.id}.${field.id}`)), required: steps.flatMap(step => step.fields.filter(field => field.required).map(field => `${step.id}.${field.id}`)), steps: steps.map(step => step.id), categories: categories.map(category => category.key) }));
  const privatePath = join(home, 'abuhsca-onboarding-private');
  await mkdir(privatePath, { mode: 0o700 });
  await copyFile(join(root, 'server', 'hostgator', 'private.htaccess'), join(privatePath, '.htaccess'));
  await writeFile(join(privatePath, 'INSTALACAO.txt'), 'PRIMEIRA INSTALAÇÃO — HOSTGATOR\n\nEnvie e extraia o ZIP na pasta INICIAL da conta cPanel, um nível ACIMA de public_html. Não extraia dentro de public_html. Se as pastas já existirem, preserve a instalação e não substitua config.php.\n\nAtive PHP 8.1+ e SSL válido. Teste https://abuhsca.com.br/onboarding-construcel/api/index.php?route=/health (esperado ok:true).\n\nAbra o aplicativo, salve um rascunho e anexo fictícios com o convite de cliente. Em outro navegador, use o convite da agência para carregar a nuvem e baixar o anexo. O protocolo confirma recebimento, não aprovação.\n\nOs convites estão em CONVITES-PRIVADOS.txt nesta pasta privada. Não envie este pacote no grupo. Após extrair, apague o ZIP enviado à hospedagem. Mantenha backup privado de configuração e dados.\n');
  await mkdir(dirname(output), { recursive: true });
  const packed = spawnSync('python3', ['-c', `import pathlib,zipfile,sys\nroot=pathlib.Path(sys.argv[1])\nwith zipfile.ZipFile(sys.argv[2],'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:\n for p in sorted(root.rglob('*')):\n  if p.relative_to(root).as_posix()=='public_html': continue\n  if p.name in ('config.php','CONVITES-PRIVADOS.txt'): raise RuntimeError('Private file in public template')\n  z.write(p,p.relative_to(root))\n`, home, output], { stdio: 'inherit' });
  if (packed.status !== 0) throw new Error('Não foi possível gerar base pública.');
  await chmod(output, 0o644);
  console.log('Template público gerado sem chaves nem convites.');
} finally { await rm(temp, { recursive: true, force: true }); }
