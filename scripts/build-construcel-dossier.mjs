import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { randomBytes, createCipheriv, createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { steps } from '../src/onboarding-app/model.ts';
const argument = name => { const index = process.argv.indexOf(name); if (index < 0 || !process.argv[index + 1]) throw new Error(`Informe ${name}.`); return resolve(process.argv[index + 1]); };
const dossier = argument('--dossier'), report = argument('--report'), keyFile = argument('--key-file');
const output = process.argv.includes('--output') ? argument('--output') : resolve('public/dossie-construcel/record.bin');
if ([dossier, report, keyFile].includes(output)) throw new Error('A saída não pode substituir fontes ou chave.');
if (keyFile === resolve('.') || keyFile.startsWith(resolve('.') + '/')) throw new Error('A chave deve ficar fora do site e do Git.');
const extracted = spawnSync('python3', ['-c', `import zipfile,json,base64,sys,pathlib\nwith zipfile.ZipFile(sys.argv[1]) as z:\n names=z.namelist()\n answers=[n for n in names if n.endswith('/respostas.json') and not n.startswith('__MACOSX/')]\n assert len(answers)==1\n draft=json.loads(z.read(answers[0]))\n files=[]\n for n in names:\n  if n.startswith('__MACOSX/') or '/materiais/' not in n or n.endswith('/'): continue\n  name=pathlib.PurePosixPath(n).name\n  if name.startswith('.') or not name.lower().endswith(('.png','.webp','.jpg','.jpeg')): continue\n  assert z.getinfo(n).file_size<20*1024*1024\n  category=n.split('/materiais/',1)[1].split('/')[0]\n  files.append({'category':category,'name':name.split('-',1)[1] if len(name.split('-',1)[0])==8 else name,'size':z.getinfo(n).file_size,'content':base64.b64encode(z.read(n)).decode()})\n print(json.dumps({'draft':draft,'files':files}))\n`, dossier], { maxBuffer: 20 * 1024 * 1024 });
if (extracted.status !== 0) throw new Error('Não foi possível ler o dossiê.');
const { draft, files } = JSON.parse(extracted.stdout.toString());
const sections = steps.map(step => ({
  id: step.id, title: step.title,
  reviewed: draft.completed.includes(step.id),
  fields: step.fields.map(field => {
    const value = draft.values[`${step.id}.${field.id}`];
    return { id: `${step.id}.${field.id}`, label: field.label, provided: typeof value === 'string' && value.trim() !== '', reserved: step.id === 'acessos' && Boolean(value), value: step.id === 'acessos' && value ? 'Informação recebida. Conteúdo reservado no arquivo original; credenciais não são exibidas nesta página.' : value || 'Não informado' };
  }),
  categories: (step.categories ?? []).map(category => {
    const key = `${step.id}.${category.id}`;
    return { key, label: category.label, status: draft.categoryState[key] || 'Não informado', link: draft.links[key] || '', count: files.filter(file => file.category === key).length };
  }),
}));
const reportBytes = await readFile(report), zipBytes = await readFile(dossier);
const payload = {
  schema: 1, updatedAt: draft.updatedAt, sections, files,
  stats: { fields: Object.keys(draft.values).length, reviewed: draft.completed.length, attachments: files.length, categoryStates: Object.keys(draft.categoryState).length, links: Object.values(draft.links).filter(value => String(value).trim()).length, reserved: sections.find(section => section.id === 'acessos').fields.filter(field => field.provided).length },
  sources: { dossierName: 'construcel-dossie-onboarding.zip', reportName: 'ABUHSCA_Relatorio_Onboarding_Construcel_2026-11-10.pdf', dossierSha256: createHash('sha256').update(zipBytes).digest('hex') },
  report: { name: 'Relatorio_Onboarding_Construcel_2026-11-10.pdf', content: reportBytes.toString('base64') },
  summary: [
    ['Estrutura e história', draft.values['empresa.historia'] || 'Não informado'],
    ['Prioridades declaradas', draft.values['empresa.prioridades'] || 'Não informado'],
    ['Operação comercial', [draft.values['equipe.comercial'], draft.values['equipe.online'], draft.values['equipe.aprovacao']].filter(Boolean).join('\n\n') || 'Não informado'],
    ['Metas declaradas', draft.values['planos.metas'] || 'Não informado'],
  ],
  pending: [
    { title: 'Base de resultados', text: 'Solicitar visão agregada e autorizada de vendas, orçamentos, leads, conversão e mídia do ano e de agosto, setembro e outubro. Os campos atuais não trazem números.', owner: 'Sistema/dados + direção da Construcel' },
    { title: 'Definição das metas', text: 'Confirmar período, base atual e critérios das metas comerciais declaradas. São metas declaradas, não resultados garantidos pela agência.', owner: 'Direção da Construcel + ABUHSCA' },
    { title: 'Materiais faltantes', text: 'Conferir vídeos, fotos de interiores/equipe/produtos/produção, manual, catálogos, tabelas de preços e acervo anterior. O ZIP contém apenas uma foto e três logos.', owner: 'Marketing e responsáveis da Construcel' },
    { title: 'Marcação dos materiais', text: 'Categorias com anexos também foram marcadas “Não possui”. Preservamos a resposta original e sinalizamos os pontos para conferência.', owner: 'Construcel + ABUHSCA' },
    { title: 'Ofertas vigentes', text: 'Validar produtos, preço, estoque, validade semanal, parcelamento e frete antes da divulgação.', owner: 'Compras + comercial + aprovadoras' },
    { title: 'Atendimento e funil', text: 'Mapear tempo de resposta, repasse de contatos, acompanhamento de orçamento e atualização do CRM.', owner: 'Atendimento + vendedores + ABUHSCA' },
    { title: 'Acessos recebidos', text: 'Conferir titularidade e permissões por convite. O recebimento de informações não comprova acesso testado. As credenciais do arquivo original não foram incluídas nesta página.', owner: 'Titulares das contas + ABUHSCA' },
    { title: 'Escopo e decisões', text: 'Intenções de mudança de marca, novos canais, treinamento e expansão comercial precisam de avaliação e alinhamento. Não foram convertidos em entregas extras do SPRINT.', owner: 'Direção da Construcel + ABUHSCA' },
    { title: 'Data cadastral', text: `O campo “Data de atualização” veio preenchido com ${draft.values['empresa.atualizacao'] || 'data não informada'}. Confirmar se corresponde à fundação ou à atualização dos dados.`, owner: 'Responsável pelo cadastro' },
  ],
};
let key;
try { key = Buffer.from(JSON.parse(await readFile(keyFile, 'utf8')).key, 'base64url'); }
catch (error) { if (error.code !== 'ENOENT') throw error; key = randomBytes(32); await mkdir(dirname(keyFile), { recursive: true }); await writeFile(keyFile, JSON.stringify({ key: key.toString('base64url'), url: `https://abuhcontato-glitch.github.io/black-iqv/dossie-construcel/#k=${key.toString('base64url')}` }), { mode: 0o600, flag: 'wx' }); }
if (key.length !== 32) throw new Error('Chave privada inválida.');
const header = Buffer.from('ABUHDS01'), iv = randomBytes(12), cipher = createCipheriv('aes-256-gcm', key, iv); cipher.setAAD(header);
const encrypted = Buffer.concat([header, iv, cipher.update(Buffer.from(JSON.stringify(payload))), cipher.final(), cipher.getAuthTag()]);
await mkdir(dirname(output), { recursive: true });
await writeFile(output, encrypted);
console.log('Dossiê criptografado gerado. Chave e respostas originais não foram publicadas. Credenciais reservadas fora da página.');
