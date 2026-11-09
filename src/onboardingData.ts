import { proposal } from './config.ts';
import { sprint90 } from './sprint90.ts';

export const onboarding = {
  client: 'CONSTRUCEL', contact: 'Ana Paula', director: 'Maike Christian',
  plan: 'SPRINT — 90 DIAS', contractStatus: 'Contrato assinado',
  startDate: '2026-11-09', timeZone: 'America/Sao_Paulo',
  kickoffTime: '11:00', kickoffInstant: '2026-11-09T11:00:00-03:00',
  kickoffEndInstant: '2026-11-09T12:00:00-03:00',
  meetUrl: 'https://meet.google.com/dur-zzzs-mtj',
  monthly: proposal.sprint.monthly, total: proposal.sprint.monthly * proposal.sprint.months,
  creativesPerCycle: proposal.sprint.adCreatives, postsPerCycle: sprint90.monthlyPosts, piecesPerCycle: sprint90.monthlyPieces,
  campaignsPerPlatform: proposal.sprint.campaignsPerPlatform,
};
export type ScheduleStatus = 'confirmed' | 'proposed';
export function addDays(iso: string, days: number): string {
  const date = new Date(`${iso}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}
export function dateLabel(iso: string, year = false): string {
  if (!iso) return 'A aprovar';
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', ...(year ? { year: 'numeric' as const } : {}), timeZone: onboarding.timeZone }).format(new Date(`${iso}T12:00:00Z`));
}
export function weekdayLabel(iso: string): string {
  if (!iso) return 'Lote em produção · veiculação a alinhar';
  return new Intl.DateTimeFormat('pt-BR', { weekday: 'long', timeZone: onboarding.timeZone }).format(new Date(`${iso}T12:00:00Z`));
}
export const cycles = [
  { id: 'cycle-1', number: 1, title: 'Estruturar.', subtitle: 'Mês 1 · preparar e iniciar a operação.', start: onboarding.startDate, end: addDays(onboarding.startDate, 29), items: ['Receber acessos, acervo e dados comerciais; diagnosticar a operação.', 'Estratégia, planejamento, cronograma, landing page, WhatsApp e CRM.', 'Preparação de 09 a 23/11; primeiro lote previsto no ar em 24/11 após aprovação.'] },
  { id: 'cycle-2', number: 2, title: 'Otimizar.', subtitle: 'Mês 2 · dar continuidade e evoluir.', start: addDays(onboarding.startDate, 30), end: addDays(onboarding.startDate, 59), items: ['Continuidade de social media e tráfego pago iniciados no primeiro mês.', 'Acompanhar leads, atendimento, vendas e mensuração.', 'Otimizar públicos, criativos e ofertas com os primeiros dados.'] },
  { id: 'cycle-3', number: 3, title: 'Consolidar.', subtitle: 'Transformar os aprendizados em direção.', start: addDays(onboarding.startDate, 60), end: addDays(onboarding.startDate, 89), items: ['Priorizar as campanhas mais promissoras.', 'Revisar o funil e a evolução dos indicadores.', 'Entregar o fechamento e os próximos passos.'] },
];
export const meetings: { id: string; date: string; time: string; title: string; description: string; status: ScheduleStatus }[] = [
  { id: 'kickoff', date: onboarding.startDate, time: onboarding.kickoffTime, title: 'Nosso primeiro alinhamento', description: 'Objetivos, produtos, materiais, acessos e próximos passos. Online pelo Google Meet.', status: 'confirmed' },
  { id: 'review-2', date: cycles[1].start, time: '11:00', title: 'Revisão do segundo ciclo', description: 'Indicadores, oportunidades e prioridades para a próxima etapa. Data e horário sugeridos.', status: 'proposed' },
  { id: 'review-3', date: cycles[2].start, time: '11:00', title: 'Revisão do terceiro ciclo', description: 'O que aprendemos, o que vamos ajustar e onde concentrar os esforços. Data e horário sugeridos.', status: 'proposed' },
];
const themes = ['Produto prioritário', 'Aplicação e benefício', 'Dúvida de compra', 'Linha em destaque', 'Oferta aprovada', 'Detalhe do produto', 'Condição comercial', 'Orçamento pelo WhatsApp', 'Escolha do material', 'Produto em uso', 'Pergunta da loja', 'Próximos passos para comprar'];
// These channel quantities are an editorial proposal, not a fixed split in the contract.
export const contentDistribution = [
  { channel: 'Feed Instagram', quantity: 8, note: 'Pautas oficiais' },
  { channel: 'Reels Instagram', quantity: 4, note: 'Pautas oficiais · vídeos da cliente' },
  { channel: 'Stories Instagram', quantity: 84, note: 'Comunicação diária · participação da loja' },
  { channel: 'Google Perfil da Empresa', quantity: 4, note: 'Presença local' },
];
const publicationOffsets = [[7, 8, 10, 14, 15, 17, 18, 21, 22, 24, 25, 28], [5, 6, 8, 9, 12, 13, 15, 19, 20, 22, 26, 29], [6, 7, 10, 11, 13, 14, 17, 18, 20, 24, 25, 27]];
export const publications = cycles.flatMap((cycle, cycleIndex) => publicationOffsets[cycleIndex].map((offset, index) => ({
  id: `pauta-${cycle.number}-${index + 1}`, cycle: cycle.number, number: index + 1,
  date: cycle.number === 1 ? (['2026-11-24', '2026-11-26', '2026-11-30'][index] ?? '') : addDays(cycle.start, offset), time: cycle.number === 1 && index > 2 ? 'A definir' : index % 3 === 2 ? '18:00' : '12:00',
  channel: index % 3 === 2 ? 'Reels Instagram' : 'Feed Instagram',
  theme: themes[index], status: 'proposed' as const,
})));
export const pieceSchedule = cycles.flatMap(cycle => {
  const pieces = publications.filter(item => item.cycle === cycle.number).map(item => ({ ...item, id: `piece-${item.id}` }));
  for (let day = 0; day < 30; day++) {
    const times = day === 0 ? ['14:00', '16:00', '17:00'] : day < 24 ? ['09:00', '13:00', '17:00'] : ['09:00', '17:00'];
    for (const [index, time] of times.entries()) pieces.push({
      id: `story-${cycle.number}-${day}-${index}`, cycle: cycle.number, number: 0,
      date: cycle.number === 1 ? (day === 0 ? '2026-11-24' : '') : addDays(cycle.start, day), time: cycle.number === 1 && day > 0 ? 'A definir' : time, channel: 'Stories Instagram',
      theme: `${themes[Math.floor(day * 12 / 30)]} · desdobramento com a equipe da loja`, status: 'proposed',
    });
  }
  for (const [index, offset] of [8, 15, 22, 28].entries()) {
    let date = addDays(cycle.start, offset);
    while ([0, 6].includes(new Date(`${date}T12:00:00Z`).getUTCDay())) date = addDays(date, 1);
    pieces.push({ id: `google-${cycle.number}-${index}`, cycle: cycle.number, number: 0, date: cycle.number === 1 ? (index === 0 ? '2026-11-24' : '') : date, time: cycle.number === 1 && index > 0 ? 'A definir' : '10:00', channel: 'Google Perfil da Empresa', theme: themes[index * 3], status: 'proposed' });
  }
  return pieces.sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`)).map((piece, index) => ({ ...piece, number: index + 1 }));
});
export const milestones = [
  { date: '2026-11-13', time: '17:00', title: 'Recebimento inicial de acessos, acervo e relatórios comerciais', owner: 'Construcel · prazo proposto' },
  { date: '2026-11-16', time: '17:00', title: 'Diagnóstico dos números, estratégia e planejamento para revisão', owner: 'ABUHSCA · validação da Construcel' },
  { date: '2026-11-19', time: '17:00', title: 'Produção de 18 a 20/11: edição, primeiro lote, landing page e campanhas', owner: 'ABUHSCA · após materiais e captação acordada' },
  { date: '2026-11-23', time: '16:00', title: 'Aprovação editorial e conferência técnica para entrada no ar', owner: 'ABUHSCA + Construcel' },
  { date: '2026-11-24', time: 'A definir', title: 'Entrada no ar prevista do primeiro lote de social media e campanhas', owner: 'ABUHSCA · condicionado à liberação da operação' },
  { date: '2027-02-05', time: '16:00', title: 'Fechamento do ciclo e relatório final', owner: 'ABUHSCA' },
];
export const campaigns = [
  { id: 'meta-start', platform: 'Meta Ads', date: '2026-11-24', time: 'A definir', description: 'Primeiro lote previsto em 24/11, após planejamento, conferência técnica, acessos, verba e aprovação. Horário no calendário aprovado.', status: 'proposed' as const },
  { id: 'google-start', platform: 'Google Ads', date: '2026-11-24', time: 'A definir', description: 'Janela proposta em 24/11; horário a definir. A análise e liberação da plataforma podem afetar o início efetivo.', status: 'proposed' as const },
];
export const captureWindows = [
  { cycle: 1, date: '2026-11-17', time: 'A combinar', receipt: 'até 13/11 para acervo existente', label: 'Visita para fotos e vídeos · proposta a acordar', detail: 'ABUHSCA + Construcel: confirmar local, deslocamento, duração, roteiro, responsáveis, entregas e eventuais custos antes da visita. Não há visita já agendada nem pacote de captações recorrentes incluído por esta página.' },
  { cycle: 2, date: '2026-12-10', time: '09:00–10:00', receipt: '09 a 11/12', label: 'Complementos do segundo ciclo', detail: 'Equipe Construcel: separar e gravar materiais complementares orientados pela ABUHSCA. Não é uma nova visita presencial.' },
  { cycle: 3, date: '2027-01-12', time: '09:00–10:00', receipt: '08 a 12/01', label: 'Complementos do terceiro ciclo', detail: 'Equipe Construcel: atualizar fotos, vídeos, preços e estoque para o planejamento aprovado. Não é uma nova visita presencial.' },
];
export const accessItems = [
  { id: 'support-group', title: 'Grupo de suporte no WhatsApp', text: 'Organizar o grupo exclusivo com os responsáveis. Atendimento das 09h às 17h, Brasília.' },
  { id: 'domain', title: 'Domínio e DNS', text: 'Informar domínio, registrador, titular e responsável. Liberar a gestão necessária por usuário ou convite.' },
  { id: 'hosting', title: 'Hospedagem e site atual', text: 'Informar provedor, endereço do site, painel/CMS, responsável técnico e situação de renovação. Acesso específico para implantação e diagnóstico.' },
  { id: 'google-ads', title: 'Google Ads', text: 'Informar ID da conta, histórico de campanhas e conceder acesso à agência. Alinhar verba e pagamento.' },
  { id: 'google-profile', title: 'Google Perfil da Empresa', text: 'Convidar para a gestão do perfil e informar verificação, unidades e responsável atual.' },
  { id: 'metrics', title: 'Google Analytics, Tag Manager e Search Console', text: 'Compartilhar propriedades existentes e histórico de medição. Se não existirem, marcar como não possui.' },
  { id: 'meta', title: 'Facebook e Meta Business', text: 'Identificar página, portfólio empresarial, conta de anúncios, pixel e titular. Adicionar a agência como parceira com as permissões necessárias.' },
  { id: 'instagram', title: 'Instagram', text: 'Informar @perfil, vínculo com a página e acesso profissional pelo Meta. Conferir histórico e permissões de publicação.' },
  { id: 'whatsapp', title: 'WhatsApp Business', text: 'Informar número comercial, responsável, aparelhos conectados, catálogo e etiquetas. Vinculação autorizada em conjunto, sem enviar códigos de verificação.' },
  { id: 'tiktok', title: 'TikTok', text: 'Informar @perfil e Business Center, se houver. Acesso para diagnóstico e inventário; gestão/publicações/anúncios no TikTok dependem de escopo específico aprovado.' },
  { id: 'crm', title: 'CRM e sistema de vendas', text: 'Informar ferramentas, usuários, etapas do funil e responsáveis. Disponibilizar acesso compatível ou relatórios exportados.' },
  { id: 'drive', title: 'Pasta compartilhada do Google Drive', text: 'Reunir o acervo e os relatórios nas subpastas abaixo e compartilhar de forma restrita com o e-mail da agência.' },
];
export const driveFolders = ['01_Identidade_e_logo', '02_Fotos/Produtos', '02_Fotos/Loja_e_equipe', '03_Videos/Brutos', '03_Videos/Editados', '04_Criativos_existentes', '05_Planejamentos_anteriores', '06_Relatorios/Comercial_2026_ate_outubro', '06_Relatorios/Ultimos_3_meses_Ago_Set_Out_2026', '06_Relatorios/Marketing_e_anuncios', '07_Produtos_precos_estoque', '08_Aprovacoes'];
export const commercialRequests = [
  ['Visão do ano', 'Faturamento, pedidos/vendas e ticket médio por mês, de janeiro a outubro de 2026 (últimos meses fechados). Se disponível, incluir 2025 para comparar sazonalidade. Novembro parcial em arquivo separado.'],
  ['Últimos 3 meses fechados', 'Agosto, setembro e outubro de 2026, separados por mês: leads, orçamentos enviados, valor orçado, vendas, receita, descontos, margem disponível e motivos de perda.'],
  ['Funil e atendimento', 'Equipe, horários, canais de entrada, tempo de resposta, acompanhamento dos orçamentos, taxa de conversão com denominador e capacidade de atendimento.'],
  ['Produtos e oportunidades', 'Produtos mais vendidos, curva ABC se houver, margens, estoque, regiões, público e condições comerciais aprovadas.'],
  ['Marketing existente', 'Investimento por canal, campanhas, públicos, criativos, alcance, cliques, contatos, custo por contato e vendas atribuídas, quando houver medição.'],
];
export const materialItems = ['Logo, identidade visual e arquivos editáveis disponíveis', 'Fotos e vídeos existentes: produtos, loja, equipe e obras autorizadas', 'Criativos, planejamentos e relatórios anteriores', 'Produtos, preços, estoque, margens e condições aprovadas', 'Relatórios comerciais do ano e dos últimos 3 meses fechados', 'Responsável pelos acessos, pelos dados e pelas aprovações'];
export function handoverTemplate(): string {
  return ['CONSTRUCEL — CENTRAL DE ENTREGA', 'Conceda permissões nas plataformas; não inclua senhas, tokens ou códigos de verificação neste resumo.', '', 'PASTA GOOGLE DRIVE (restrita ao e-mail da agência):', 'Link:', 'Responsável:', '', 'ESTRUTURA DA PASTA', ...driveFolders, '', 'ACESSOS / SITUAÇÃO / RESPONSÁVEL', ...accessItems.map(item => `${item.title}: pendente / convidado / não possui / precisa recuperar — responsável:`), '', 'RELATÓRIOS SOLICITADOS', ...commercialRequests.map(([title, text]) => `${title}: ${text}`), '', 'Se não houver algum dado, informar indisponível e a fonte existente. Não inventar números. Enviar o resumo no grupo exclusivo; a agência confirma o recebimento e testa cada acesso.'].join('\n');
}
export function commercialTemplateCsv(): string {
  const rows = [['Mes', 'Faturamento_R$', 'Numero_vendas', 'Ticket_medio_R$', 'Leads', 'Orcamentos_enviados', 'Valor_orcado_R$', 'Investimento_midia_R$', 'Vendas_atribuidas_midia', 'Fonte_e_observacoes'], ...Array.from({ length: 10 }, (_, index) => [`2026-${String(index + 1).padStart(2, '0')}`, '', '', '', '', '', '', '', '', ''])];
  return '\ufeff' + rows.map(row => row.join(';')).join('\r\n');
}
export const meetingAgenda = [
  ['10 min', 'Entender as prioridades', 'Produtos, objetivos, regiões atendidas e oportunidades comerciais.'],
  ['15 min', 'Conferir materiais e acessos', 'O que já existe, o que precisa chegar e quem vai disponibilizar.'],
  ['15 min', 'Organizar o caminho do orçamento', 'WhatsApp, responsáveis, CRM e atualização das oportunidades.'],
  ['15 min', 'Alinhar campanhas e calendário', 'Ofertas, verba, conteúdos e janelas propostas de publicação.'],
  ['5 min', 'Sair com os próximos passos', 'Responsável e prazo para cada pendência inicial.'],
];
export const workflow = [
  { title: 'Atrair', text: 'Meta Ads, Google Ads e Perfil da Empresa.', owner: 'ABUHSCA' },
  { title: 'Direcionar', text: 'Landing page e contato pelo WhatsApp.', owner: 'ABUHSCA' },
  { title: 'Atender', text: 'Entender a necessidade e responder ao cliente.', owner: 'CONSTRUCEL' },
  { title: 'Organizar', text: 'Registrar o lead e o próximo passo no CRM.', owner: 'CONSTRUCEL' },
  { title: 'Orçar e acompanhar', text: 'Enviar o orçamento e dar continuidade à conversa.', owner: 'CONSTRUCEL' },
  { title: 'Medir e melhorar', text: 'Compartilhar resultados e ajustar a operação.', owner: 'EM CONJUNTO' },
];
function foldCalendarLine(line: string): string {
  const encoder = new TextEncoder();
  let result = '', current = '', bytes = 0;
  for (const char of line) {
    const size = encoder.encode(char).length;
    if (bytes + size > 75) { result += current + '\r\n'; current = ' '; bytes = 1; }
    current += char; bytes += size;
  }
  return result + current;
}
function escapeIcs(value: string): string { return value.replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;'); }
export function kickoffCalendar(stamp = new Date()): string {
  const utc = (date: Date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//ABUHSCA//Construcel Sprint//PT-BR', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT', 'UID:construcel-sprint-20261109@abuhsca', `DTSTAMP:${utc(stamp)}`, `DTSTART:${utc(new Date(onboarding.kickoffInstant))}`, `DTEND:${utc(new Date(onboarding.kickoffEndInstant))}`, `URL:${onboarding.meetUrl}`, 'SUMMARY:Onboarding Construcel — ABUHSCA', `DESCRIPTION:${escapeIcs(`Reunião inicial do SPRINT contratado. Ana Paula e Maike Christian. Das 11h às 12h, horário de Brasília. Google Meet: ${onboarding.meetUrl}`)}`, `LOCATION:${onboarding.meetUrl}`, 'STATUS:CONFIRMED', 'END:VEVENT', 'END:VCALENDAR', ''].map(foldCalendarLine).join('\r\n');
}
export function scheduleCsv(): string {
  const rows: (string | number)[][] = [
    ['Categoria', 'Data', 'Horário de Brasília', 'Atividade', 'Situação'],
    ...meetings.map(m => ['Reunião', dateLabel(m.date, true), m.time, m.title, m.status === 'confirmed' ? 'Confirmada' : 'Proposta — a confirmar']),
    ...pieceSchedule.map(p => [`Peça — ${p.channel}`, dateLabel(p.date, true), p.time, `${p.id} · Ciclo ${p.cycle} · ${p.theme}`, p.date ? 'Proposta — depende de materiais e aprovação' : 'Lote em produção — data de veiculação a alinhar; sem transferência automática de cotas']),
    ...milestones.map(m => ['Marco de entrega', dateLabel(m.date, true), m.time, m.title, 'Proposta — depende de acessos, materiais e revisão']),
    ...campaigns.map(c => ['Anúncios', dateLabel(c.date, true), c.time, c.platform, 'Proposta — depende de acessos, verba e aprovação']),
    ...captureWindows.map(c => [c.cycle === 1 ? 'Visita a acordar' : 'Gravação pela cliente', dateLabel(c.date, true), c.time, c.label, c.detail]),
  ];
  return '\ufeff' + rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(';')).join('\r\n');
}
export function downloadText(name: string, text: string, type: string): void {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = name; document.body.appendChild(anchor); anchor.click(); anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
