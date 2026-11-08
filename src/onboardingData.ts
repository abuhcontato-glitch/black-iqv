import { proposal } from './config.ts';

export const onboarding = {
  client: 'CONSTRUCEL', contact: 'Ana Paula', director: 'Maike Christian',
  plan: 'SPRINT — 90 DIAS', contractStatus: 'Contrato assinado',
  startDate: '2026-11-09', timeZone: 'America/Sao_Paulo',
  kickoffTime: '11:00', kickoffInstant: '2026-11-09T11:00:00-03:00',
  meetUrl: '',
  monthly: proposal.sprint.monthly, total: proposal.sprint.monthly * proposal.sprint.months,
  creativesPerCycle: proposal.sprint.adCreatives, postsPerCycle: proposal.sprint.instagramPosts,
  campaignsPerPlatform: proposal.sprint.campaignsPerPlatform,
};
export type ScheduleStatus = 'confirmed' | 'proposed';
export function addDays(iso: string, days: number): string {
  const date = new Date(`${iso}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}
export function dateLabel(iso: string, year = false): string {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', ...(year ? { year: 'numeric' as const } : {}), timeZone: onboarding.timeZone }).format(new Date(`${iso}T12:00:00Z`));
}
export function weekdayLabel(iso: string): string {
  return new Intl.DateTimeFormat('pt-BR', { weekday: 'long', timeZone: onboarding.timeZone }).format(new Date(`${iso}T12:00:00Z`));
}
export const cycles = [
  { id: 'cycle-1', number: 1, title: 'Implantar.', subtitle: 'A base para começar direito.', start: onboarding.startDate, end: addDays(onboarding.startDate, 29), items: ['Diagnóstico, acessos e prioridades comerciais.', 'Landing page inicial, WhatsApp e CRM básico.', 'Primeiras campanhas e calendário de conteúdo.'] },
  { id: 'cycle-2', number: 2, title: 'Otimizar.', subtitle: 'Aprender com cada oportunidade.', start: addDays(onboarding.startDate, 30), end: addDays(onboarding.startDate, 59), items: ['Analisar contatos e andamento dos orçamentos.', 'Ajustar públicos, criativos e ofertas.', 'Evoluir a captação e a rotina comercial.'] },
  { id: 'cycle-3', number: 3, title: 'Consolidar.', subtitle: 'Transformar os aprendizados em direção.', start: addDays(onboarding.startDate, 60), end: addDays(onboarding.startDate, 89), items: ['Priorizar as campanhas mais promissoras.', 'Revisar o funil e a evolução dos indicadores.', 'Entregar o fechamento e os próximos passos.'] },
];
export const meetings: { id: string; date: string; time: string; title: string; description: string; status: ScheduleStatus }[] = [
  { id: 'kickoff', date: onboarding.startDate, time: onboarding.kickoffTime, title: 'Nosso primeiro alinhamento', description: 'Objetivos, produtos, materiais, acessos e próximos passos. Online pelo Google Meet.', status: 'confirmed' },
  { id: 'review-2', date: cycles[1].start, time: '11:00', title: 'Revisão do segundo ciclo', description: 'Indicadores, oportunidades e prioridades para a próxima etapa. Data e horário sugeridos.', status: 'proposed' },
  { id: 'review-3', date: cycles[2].start, time: '11:00', title: 'Revisão do terceiro ciclo', description: 'O que aprendemos, o que vamos ajustar e onde concentrar os esforços. Data e horário sugeridos.', status: 'proposed' },
];
const themes = ['Produto prioritário', 'Aplicação e benefício', 'Dúvida de compra', 'Linha em destaque', 'Oferta aprovada', 'Detalhe do produto', 'Condição comercial', 'Orçamento pelo WhatsApp'];
// Eight weekday slots per cycle, after the proposed material collection windows.
const publicationOffsets = [[7, 10, 14, 17, 21, 23, 25, 28], [5, 8, 12, 15, 19, 22, 26, 29], [6, 10, 13, 17, 19, 21, 24, 27]];
export const publications = cycles.flatMap((cycle, cycleIndex) => publicationOffsets[cycleIndex].map((offset, index) => ({
  id: `post-${cycle.number}-${index + 1}`, cycle: cycle.number, number: index + 1,
  date: addDays(cycle.start, offset), time: '12:00', theme: themes[index], status: 'proposed' as const,
})));
export const milestones = [
  { date: '2026-11-10', time: '16:00', title: 'Prioridades e acessos conferidos', owner: 'ABUHSCA + Construcel' },
  { date: '2026-11-11', time: '16:00', title: 'Organização inicial do WhatsApp', owner: 'ABUHSCA + equipe de atendimento' },
  { date: '2026-11-12', time: '16:00', title: 'CRM básico em conferência', owner: 'ABUHSCA + responsáveis pelos orçamentos' },
  { date: '2026-11-13', time: '16:00', title: 'Primeira versão da landing page e primeiro lote de criativos para revisão', owner: 'ABUHSCA · revisão da Construcel' },
  { date: '2027-02-05', time: '16:00', title: 'Fechamento do ciclo e relatório final', owner: 'ABUHSCA' },
];
export const campaigns = [
  { id: 'meta-start', platform: 'Meta Ads', date: '2026-11-16', time: '09:00', description: 'Primeira janela sugerida de ativação, após revisão e aprovação.', status: 'proposed' as const },
  { id: 'google-start', platform: 'Google Ads', date: '2026-11-16', time: '09:30', description: 'Ativação condicionada a acessos, verba, criativos e destino aprovados.', status: 'proposed' as const },
];
export const captureWindows = [
  { cycle: 1, date: '2026-11-12', time: '09:00–10:00', receipt: '10 a 12/11', label: 'Primeiro lote de materiais' },
  { cycle: 2, date: '2026-12-10', time: '09:00–10:00', receipt: '09 a 11/12', label: 'Materiais do segundo ciclo' },
  { cycle: 3, date: '2027-01-12', time: '09:00–10:00', receipt: '08 a 12/01', label: 'Materiais do terceiro ciclo' },
];
export const accessItems = [
  { id: 'meta', title: 'Meta Business e Instagram', text: 'Conferir acesso à página, ao perfil e à conta de anúncios. Conceder permissão à agência por convite.' },
  { id: 'google-ads', title: 'Google Ads', text: 'Conferir conta e acesso da agência. Definir verba e forma de pagamento dos anúncios com Ana Paula.' },
  { id: 'google-profile', title: 'Google Perfil da Empresa', text: 'Compartilhar a gestão do perfil para a otimização inicial e o acompanhamento básico.' },
  { id: 'domain', title: 'Domínio e landing page', text: 'Identificar domínio, hospedagem e responsável técnico. Disponibilizar o acesso necessário à página de captação.' },
  { id: 'whatsapp', title: 'WhatsApp Business', text: 'Definir responsável pelo atendimento e conferir catálogo, mensagens rápidas e etiquetas.' },
  { id: 'crm', title: 'CRM e responsáveis', text: 'Definir a ferramenta, os usuários e quem registra os contatos e atualiza os orçamentos.' },
  { id: 'metrics', title: 'Mensuração existente', text: 'Identificar GA4, Tag Manager e outras configurações já existentes, quando aplicáveis.' },
];
export const materialItems = ['Logo e identidade visual disponíveis', 'Fotos e vídeos dos produtos e da loja', 'Produtos e categorias prioritárias', 'Preços, estoque e condições comerciais', 'Diferenciais, dúvidas frequentes e áreas atendidas', 'Responsável por aprovar conteúdos e ofertas'];
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
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//ABUHSCA//Construcel Sprint//PT-BR', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT', 'UID:construcel-sprint-20261109@abuhsca', `DTSTAMP:${utc(stamp)}`, `DTSTART:${utc(new Date(onboarding.kickoffInstant))}`, 'SUMMARY:Onboarding Construcel — ABUHSCA', `DESCRIPTION:${escapeIcs('Reunião inicial do SPRINT contratado. Ana Paula e Maike Christian. Horário de Brasília. Link do Google Meet a enviar. Duração a combinar.')}`, 'LOCATION:Online — Google Meet (link a enviar)', 'STATUS:CONFIRMED', 'END:VEVENT', 'END:VCALENDAR', ''].map(foldCalendarLine).join('\r\n');
}
export function scheduleCsv(): string {
  const rows: (string | number)[][] = [
    ['Categoria', 'Data', 'Horário de Brasília', 'Atividade', 'Situação'],
    ...meetings.map(m => ['Reunião', dateLabel(m.date, true), m.time, m.title, m.status === 'confirmed' ? 'Confirmada' : 'Proposta — a confirmar']),
    ...publications.map(p => ['Publicação Instagram', dateLabel(p.date, true), p.time, `Ciclo ${p.cycle} · ${p.theme}`, 'Proposta — depende de aprovação']),
    ...milestones.map(m => ['Marco de entrega', dateLabel(m.date, true), m.time, m.title, 'Proposta — depende de acessos, materiais e revisão']),
    ...campaigns.map(c => ['Anúncios', dateLabel(c.date, true), c.time, c.platform, 'Proposta — depende de acessos, verba e aprovação']),
    ...captureWindows.map(c => ['Gravação pela cliente', dateLabel(c.date, true), c.time, c.label, 'Proposta — equipe da Construcel; não é captação presencial da agência']),
  ];
  return '\ufeff' + rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(';')).join('\r\n');
}
export function downloadText(name: string, text: string, type: string): void {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = name; document.body.appendChild(anchor); anchor.click(); anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
