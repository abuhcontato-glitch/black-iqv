// Conteúdo editorial da campanha BLACK IQV 2026.
// Filme 01 segue o roteiro fornecido pela cliente; Filmes 02–05 são propostas criativas.
import storyboardPlan from './storyboard-plan.json';
import storyboardImages from './storyboard-images.json';

export type ReviewStatus = "proposta" | "em-revisao" | "aprovado";
export type LineKind = "fala" | "off" | "texto";

export interface Shot {
  n: number;
  frame: string; // enquadramento
  action: string;
  movement: string;
  lens: string;
  image?: string; // arquivo real do storyboard, quando cadastrado
  imagePanel?: number; // índice do quadro na prancha: 0, 1 ou 2
  visual?: { frame: string; action: string; lens: string };
}

export interface Sequence {
  n: number;
  title: string;
  objective: string;
  action: string;
  location: string;
  characters: string;
  line: { kind: LineKind; text: string };
  shots: [Shot, Shot, Shot];
  lighting: string;
  sound: string;
  transition: string;
  notes: string;
  storyboardTitle?: string;
}

export interface Film {
  id: string;
  number: string;
  weekday: string;
  date: string;
  stage: string;
  title: string;
  objective: string;
  synopsis: string;
  status: ReviewStatus;
  version: string;
  wardrobe: string;
  photography: string;
  closing: string;
  sequences: Sequence[];
}

export const CAMPAIGN = {
  name: "BLACK IQV — DIRECTOR'S CUT",
  subtitle: "Uma campanha cinematográfica em cinco atos.",
  dates: "23—27 NOV 2026",
  partners: "E3 MARKETING × ABUHSCA",
  phase: "PRÉ-PRODUÇÃO | APRESENTAÇÃO CRIATIVA",
  format: "Vertical 9:16 · 80s por filme · Captação preferencial 4K",
};

export const STATUS_LABEL: Record<ReviewStatus, string> = {
  proposta: "Proposta criativa",
  "em-revisao": "Em revisão",
  aprovado: "Aprovado",
};

const WARDROBE =
  "Proposta: jaqueta oversized marrom-chocolate, top creme, calça preta ampla, tênis retrô de basquete, acessórios dourados. Sujeito à aprovação.";

export function timecode(seq: number, offset = 0) {
  const s = (seq - 1) * 8 + offset;
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}
export function seqRange(n: number) {
  return `${timecode(n)}–${timecode(n + 1)}`;
}

type SeqInput = {
  title: string;
  objective: string;
  action: string;
  location: string;
  line: [LineKind, string];
  shots: [string, string, string][]; // [enquadramento, ação, movimento]
  characters?: string;
  lighting?: string;
  sound?: string;
  transition?: string;
  notes?: string;
};

const LENS: Record<string, string> = {
  Detalhe: "100mm macro",
  Insert: "85mm",
  Macro: "100mm macro",
  Close: "85mm",
  "Close extremo": "100mm macro",
  "Primeiro plano": "50mm",
  "Plano médio": "35mm",
  "Plano americano": "35mm",
  "Plano geral": "24mm",
  OTS: "50mm",
  POV: "28mm",
};

function build(list: SeqInput[], defaults: { lighting: string; sound: string }): Sequence[] {
  return list.map((s, i) => ({
    n: i + 1,
    title: s.title,
    objective: s.objective,
    action: s.action,
    location: s.location,
    characters: s.characters ?? "Evellyn Pereira",
    line: { kind: s.line[0], text: s.line[1] },
    shots: s.shots.map(([frame, action, movement], k) => ({
      n: k + 1,
      frame,
      action,
      movement,
      lens: LENS[frame] ?? "35mm",
    })) as [Shot, Shot, Shot],
    lighting: s.lighting ?? defaults.lighting,
    sound: s.sound ?? defaults.sound,
    transition: s.transition ?? (i === list.length - 1 ? "Corte seco para preto." : "Corte por movimento."),
    notes: s.notes ?? "—",
  }));
}

const F1 = build(
  [
    { title: "O dia não acabou", objective: "Quebrar a expectativa: a Black Friday não é o fim.", action: "Evellyn chega à clínica, finaliza uma gravação e olha para a câmera.", location: "Clínica de estética", line: ["fala", "Senhoras... vocês acham mesmo que tudo termina na Black Friday?"], shots: [["Detalhe", "Tênis entrando na clínica.", "Tracking baixo"], ["Plano médio", "Gravação no celular.", "Câmera na mão controlada"], ["Primeiro plano", "O olhar para a lente.", "Dolly-in lento"]] },
    { title: "A outra tela", objective: "Plantar o mistério de um segundo projeto.", action: "Evellyn trabalha em materiais de um projeto ainda não revelado.", location: "Sala criativa", line: ["off", "Eu tô aqui preparando as missões de vocês... mas também tem outra coisa acontecendo."], shots: [["OTS", "Sobre o ombro, notebook com tela desfocada.", "Rack focus"], ["Insert", "Mãos organizando materiais.", "Fixa"], ["Close", "Close lateral do olhar.", "Travelling lateral sutil"]], notes: "Conteúdo da tela sempre ilegível — nada do IQV visível." },
    { title: "O universo da beleza", objective: "Conectar com a profissional que assiste.", action: "Montagem de profissionais trabalhando.", location: "Ambientes profissionais de beleza", characters: "Profissionais da beleza (elenco a confirmar)", line: ["off", "Tem tanta mulher boa no que faz... que merece aprender a mostrar e vender esse trabalho."], shots: [["Macro", "Materiais de micropigmentação.", "Slide lento"], ["Plano médio", "Nail designer trabalhando.", "Fixa"], ["Macro", "Materiais de extensão de cílios.", "Rack focus"]], notes: "Autorização de imagem das profissionais necessária." },
    { title: "E depois da sexta?", objective: "Lançar a pergunta central do filme.", action: "Evellyn analisa seu planejamento e faz uma pergunta.", location: "Sala criativa", line: ["fala", "E depois da sexta, Senhora? Como é que você vai continuar vendendo?"], shots: [["Insert", "Planejamento sobre a mesa.", "Plongée fixa"], ["Plano médio", "Evellyn de perfil, pensativa.", "Travelling lateral"], ["Primeiro plano", "Frontal, pergunta direta.", "Fixa"]] },
    { title: "O que ninguém vê", objective: "Revelar o esforço invisível.", action: "Bastidores da gravação de uma metodologia.", location: "Estúdio de gravação", line: ["off", "Eu passei muito tempo construindo uma coisa que vai muito além de uma promoção."], shots: [["Detalhe", "Câmera de gravação, luz tally acesa.", "Dolly-in"], ["Plano médio", "Evellyn gravando uma aula.", "Fixa"], ["OTS", "Evellyn conferindo o monitor.", "Rack focus"]] },
    { title: "A Evellyn de verdade", objective: "Presença e autoridade da protagonista.", action: "Caminhada fashion e fala direta.", location: "Corredor da clínica", line: ["fala", "Porque eu não quero ensinar vocês a vender só numa data."], shots: [["Detalhe", "Tênis no piso polido.", "Tracking baixo"], ["Plano americano", "Caminhada em direção à câmera.", "Travelling para trás"], ["Close", "Fala direta para a lente.", "Fixa"]] },
    { title: "Um método por trás", objective: "Insinuar uma estrutura de ensino.", action: "Pistas de uma estrutura de ensino.", location: "Estúdio de gravação", line: ["off", "Eu quero que vocês entendam como construir estratégia, conteúdo e venda de verdade."], shots: [["Plano geral", "O estúdio montado.", "Dolly lateral"], ["OTS", "Sobre o ombro no notebook.", "Fixa"], ["Insert", "Materiais educacionais.", "Slide lento"]] },
    { title: "Ela quase revela", objective: "Tensão e cumplicidade com a audiência.", action: "Evellyn quase conta a novidade.", location: "Sala criativa", line: ["fala", "Eu já ia contar agora... mas não. Ainda não, Senhora."], shots: [["Plano médio", "Ela inclina-se para contar.", "Dolly-in"], ["Close", "Sorriso cúmplice.", "Fixa"], ["Close extremo", "Os olhos.", "Fixa"]] },
    { title: "A promessa de amanhã", objective: "Criar compromisso com o próximo filme.", action: "Evellyn encerra uma gravação.", location: "Estúdio de gravação", line: ["fala", "Amanhã eu vou dar mais uma pista. E vocês vão entender tudo isso."], shots: [["Plano geral", "Estúdio, fim de gravação.", "Fixa"], ["Insert", "Mão desligando a gravação.", "Fixa"], ["Plano médio", "Olhando para a lente.", "Dolly-in lento"]] },
    { title: "O gancho final", objective: "Encerrar com mistério.", action: "Evellyn deixa a sala e encerra a mensagem.", location: "Estúdio de gravação", line: ["fala", "A Black Friday passa, Senhora... mas o que eu preparei não acaba nela."], shots: [["Plano geral", "Saída do estúdio.", "Fixa"], ["Insert", "Mão reduzindo a luz.", "Fixa"], ["Close", "Close final.", "Dolly-in"]], transition: "Corte seco para preto. Texto editorial: “CONTINUA AMANHÃ.”" },
  ],
  { lighting: "Luz natural difusa + práticos quentes em bronze; contraste médio.", sound: "Trilha eletrônica minimalista, pulso grave; som ambiente da clínica." },
);

const F2 = build(
  [
    { title: "Ontem eu disse", objective: "Retomar o gancho do Filme 01.", action: "Evellyn revê o vídeo de ontem no celular, sorri.", location: "Sala criativa", line: ["fala", "Ontem eu falei que tinha outra coisa acontecendo. Hoje eu vou te contar um pouco mais."], shots: [["Insert", "Celular exibindo o Filme 01.", "Fixa"], ["Plano médio", "Ela baixa o celular.", "Dolly-in"], ["Primeiro plano", "Fala direta.", "Fixa"]] },
    { title: "Quadro de planejamento", objective: "Mostrar a escala do trabalho.", action: "Parede com post-its e cronograma — conteúdo desfocado.", location: "Sala criativa", line: ["off", "Isso aqui não começou essa semana."], shots: [["Plano geral", "A parede de planejamento.", "Travelling lateral"], ["Detalhe", "Post-it sendo colado.", "Fixa"], ["OTS", "Evellyn observa o quadro.", "Rack focus"]], notes: "Não exibir prazos ou datas não confirmadas." },
    { title: "Horas de gravação", objective: "Evidenciar o trabalho invisível.", action: "Montagem rápida de takes, claquete, ajustes de luz.", location: "Estúdio de gravação", characters: "Evellyn Pereira, equipe técnica", line: ["off", "Foram muitas horas gravando, regravando, ajustando cada detalhe."], shots: [["Detalhe", "Claquete batendo.", "Fixa"], ["Plano médio", "Equipe ajustando a luz.", "Câmera na mão controlada"], ["Close", "Evellyn concentrada.", "Fixa"]] },
    { title: "Para quem é", objective: "Reforçar identificação com a profissional.", action: "Evellyn atende uma cliente na clínica.", location: "Clínica de estética", characters: "Evellyn Pereira, cliente (elenco a confirmar)", line: ["off", "Eu pensei em cada profissional que atende o dia inteiro e ainda precisa vender."], shots: [["Plano médio", "Atendimento em curso.", "Fixa"], ["Insert", "Mãos em procedimento.", "Slide lento"], ["Close", "Evellyn olha para a câmera entre um gesto e outro.", "Rack focus"]] },
    { title: "Não é sorte", objective: "Quebrar a crença de sorte nas vendas.", action: "Evellyn caminha entre as salas.", location: "Corredor da clínica", line: ["fala", "Vender no Instagram não é sorte, Senhora. Tem caminho."], shots: [["Detalhe", "Tênis no corredor.", "Tracking baixo"], ["Plano americano", "Caminhada.", "Travelling para trás"], ["Close", "Fala direta.", "Fixa"]] },
    { title: "Caixas fechadas", objective: "Elevar o mistério com objetos.", action: "Caixas e materiais embalados sobre a mesa.", location: "Sala criativa", line: ["off", "Tá quase tudo pronto."], shots: [["Plano geral", "Mesa com caixas.", "Dolly-in"], ["Insert", "Mão sobre a tampa.", "Fixa"], ["Close", "Expressão de expectativa.", "Fixa"]] },
    { title: "A tela que apaga", objective: "Tensão de revelação interrompida.", action: "Ela fecha o notebook quando a câmera se aproxima.", location: "Sala criativa", line: ["fala", "Opa. Isso aqui você ainda não pode ver."], shots: [["OTS", "Tela desfocada.", "Dolly-in"], ["Insert", "Notebook fechando.", "Fixa"], ["Primeiro plano", "Sorriso.", "Fixa"]] },
    { title: "O que muda", objective: "Prometer transformação sem números.", action: "Evellyn sentada no estúdio, tom íntimo.", location: "Estúdio de gravação", line: ["fala", "Eu quero que você saia dessa semana com outra visão sobre o seu perfil."], shots: [["Plano médio", "Evellyn sentada.", "Fixa"], ["Close", "Fala íntima.", "Dolly-in lento"], ["Detalhe", "Mãos gesticulando.", "Fixa"]] },
    { title: "Amanhã, um pedacinho", objective: "Ancorar o spoiler do Filme 03.", action: "Ela aponta para a lente.", location: "Estúdio de gravação", line: ["fala", "Amanhã eu vou te mostrar um pedacinho. Só um."], shots: [["Plano médio", "Aponta para a lente.", "Fixa"], ["Close", "Piscadela.", "Fixa"], ["Detalhe", "Luz se apagando.", "Fixa"]] },
    { title: "Você não faz ideia", objective: "Fechamento de antecipação.", action: "Silhueta contra a luz bronze.", location: "Estúdio de gravação", line: ["fala", "Você não faz ideia do que vem aí."], shots: [["Plano geral", "Silhueta.", "Fixa"], ["Primeiro plano", "Contraluz.", "Dolly-in"], ["Close extremo", "Olhar final.", "Fixa"]], transition: "Corte seco para preto. Texto: “AMANHÃ, UM SPOILER.” CTA: comentar ‘EU QUERO’." },
  ],
  { lighting: "Mais contraste que o Filme 01; janelas recortadas, sombras longas.", sound: "Trilha com pulso crescente; respiração e silêncios marcados." },
);

const F3 = build(
  [
    { title: "Prometi um pedacinho", objective: "Cumprir a promessa do Filme 02.", action: "Evellyn abre o notebook para a câmera.", location: "Sala criativa", line: ["fala", "Eu prometi um pedacinho. Então presta atenção."], shots: [["Primeiro plano", "Fala direta.", "Fixa"], ["Insert", "Notebook abrindo.", "Fixa"], ["OTS", "Tela ainda fora de foco.", "Rack focus"]] },
    { title: "Mentalidade", objective: "Primeiro fragmento: mentalidade.", action: "Evellyn grava trecho de aula sobre mentalidade.", location: "Estúdio de gravação", line: ["fala", "Antes de qualquer estratégia, tem a forma como você enxerga o seu próprio trabalho."], shots: [["Plano médio", "Gravação da aula.", "Fixa"], ["Close", "Ênfase.", "Dolly-in"], ["Detalhe", "Monitor com o take.", "Fixa"]] },
    { title: "Conteúdo", objective: "Segundo fragmento: conteúdo.", action: "Materiais didáticos sobre conteúdo na mesa.", location: "Sala criativa", line: ["off", "Conteúdo não é postar por postar. É mostrar o valor do que você faz."], shots: [["Insert", "Material didático.", "Slide lento"], ["OTS", "Evellyn anotando.", "Fixa"], ["Macro", "Caneta no papel.", "Fixa"]], notes: "Usar apenas materiais reais aprovados pela E3." },
    { title: "Posicionamento", objective: "Terceiro fragmento: posicionamento.", action: "Evellyn diante do espelho da clínica.", location: "Clínica de estética", line: ["fala", "Posicionamento é a cliente entender por que tem que ser você."], shots: [["Plano americano", "Reflexo no espelho.", "Travelling lateral"], ["Close", "Fala ao espelho.", "Fixa"], ["Primeiro plano", "Vira para a câmera.", "Fixa"]] },
    { title: "Vendas nos Stories", objective: "Quarto fragmento: Stories.", action: "Gravação de Stories no celular, em POV.", location: "Clínica de estética", line: ["off", "E os Stories... é ali que a conversa vira venda."], shots: [["POV", "Tela do celular gravando.", "Câmera na mão controlada"], ["Plano médio", "Evellyn gravando Stories.", "Fixa"], ["Insert", "Polegar no botão.", "Fixa"]] },
    { title: "Comunicação comercial", objective: "Quinto fragmento: comunicação.", action: "Evellyn simula uma conversa de venda.", location: "Sala criativa", line: ["fala", "Saber o que falar, como falar e a hora de falar. Isso muda tudo."], shots: [["Plano médio", "Conversa simulada.", "Fixa"], ["Close", "Gesto de explicação.", "Dolly-in"], ["Detalhe", "Anotações.", "Fixa"]] },
    { title: "As peças juntas", objective: "Mostrar que é um método integrado.", action: "Cinco cartões sobre a mesa, alinhados.", location: "Sala criativa", line: ["off", "Mentalidade, conteúdo, posicionamento, Stories, comunicação. Tudo conectado."], shots: [["Plano geral", "Mesa com os cinco temas.", "Plongée com dolly"], ["Insert", "Mão alinhando cartões.", "Fixa"], ["Close", "Satisfação.", "Fixa"]] },
    { title: "Não é uma aula solta", objective: "Diferenciar de conteúdo avulso.", action: "Caminhada no estúdio entre equipamentos.", location: "Estúdio de gravação", line: ["fala", "Não é uma aula solta. É um método."], shots: [["Detalhe", "Tênis entre cabos.", "Tracking baixo"], ["Plano americano", "Caminhada.", "Travelling para trás"], ["Close", "Fala direta.", "Fixa"]] },
    { title: "Amanhã tem nome", objective: "Ancorar a revelação do Filme 04.", action: "Ela cobre a tela com a mão.", location: "Sala criativa", line: ["fala", "E amanhã eu vou falar o nome."], shots: [["OTS", "Mão cobrindo a tela.", "Fixa"], ["Primeiro plano", "Sorriso.", "Fixa"], ["Close extremo", "Olhar.", "Fixa"]] },
    { title: "Foi só um pedacinho", objective: "Fechamento do spoiler.", action: "Evellyn fecha o notebook e sai.", location: "Sala criativa", line: ["fala", "Isso foi só um pedacinho, Senhora."], shots: [["Insert", "Notebook fechando.", "Fixa"], ["Plano geral", "Saída.", "Fixa"], ["Detalhe", "Luz apagando.", "Fixa"]], transition: "Corte seco para preto. Texto: “AMANHÃ, A REVELAÇÃO.” CTA: salvar o vídeo." },
  ],
  { lighting: "Luz de aula: key suave frontal, fundo em bronze; inserts com luz dura lateral.", sound: "Trilha com motivo melódico; sons de papel, caneta e teclado em destaque." },
);

const F4 = build(
  [
    { title: "Chegou a hora", objective: "Abertura solene da revelação.", action: "Evellyn caminha para o estúdio iluminado.", location: "Corredor da clínica", line: ["fala", "Chegou a hora de eu contar o que eu preparei para vocês."], shots: [["Detalhe", "Tênis.", "Tracking baixo"], ["Plano americano", "Caminhada.", "Travelling para trás"], ["Primeiro plano", "Fala direta.", "Fixa"]] },
    { title: "O nome", objective: "Revelar IQV — Insta Que Vende.", action: "O nome aparece em tipografia sobre a imagem.", location: "Estúdio de gravação", line: ["fala", "IQV. Insta Que Vende."], shots: [["Close", "Ela pronuncia o nome.", "Dolly-in"], ["Plano geral", "Estúdio com luz plena.", "Fixa"], ["Insert", "Logotipo IQV em material impresso.", "Rack focus"]], notes: "Logotipo oficial IQV a ser enviado pela E3." },
    { title: "Por que eu criei", objective: "Propósito do curso.", action: "Evellyn sentada, tom de confissão.", location: "Estúdio de gravação", line: ["fala", "Eu criei o IQV porque eu vi muita profissional incrível sem saber vender o próprio trabalho."], shots: [["Plano médio", "Sentada.", "Fixa"], ["Close", "Emoção contida.", "Dolly-in lento"], ["Detalhe", "Mãos.", "Fixa"]] },
    { title: "O que é", objective: "Proposta do curso.", action: "Montagem da plataforma e materiais.", location: "Sala criativa", line: ["off", "É a metodologia completa para você usar o Instagram como ferramenta de venda."], shots: [["OTS", "Plataforma no notebook.", "Rack focus"], ["Insert", "Materiais.", "Slide lento"], ["Plano médio", "Evellyn navegando.", "Fixa"]], notes: "Exibir apenas telas reais da plataforma." },
    { title: "Os pilares", objective: "Retomar os temas do spoiler.", action: "Os cinco cartões do Filme 03 reaparecem.", location: "Sala criativa", line: ["off", "Mentalidade. Conteúdo. Posicionamento. Stories. Comunicação comercial."], shots: [["Plano geral", "Mesa com cartões.", "Plongée"], ["Insert", "Cartão a cartão.", "Corte por movimento"], ["Close", "Evellyn.", "Fixa"]] },
    { title: "Para quem é o IQV", objective: "Identificação.", action: "Montagem com profissionais da beleza.", location: "Ambientes profissionais de beleza", characters: "Profissionais da beleza (elenco a confirmar)", line: ["off", "Para a profissional da beleza que quer vender todos os dias, não só numa data."], shots: [["Plano médio", "Nail designer.", "Fixa"], ["Macro", "Cílios.", "Rack focus"], ["Plano médio", "Micropigmentadora.", "Fixa"]] },
    { title: "O valor do método", objective: "Valor percebido sem preço.", action: "Evellyn diante da câmera, firme.", location: "Estúdio de gravação", line: ["fala", "O que você aprende aqui continua com você depois da Black."], shots: [["Primeiro plano", "Fala firme.", "Fixa"], ["Close", "Ênfase.", "Dolly-in"], ["Plano médio", "Pausa.", "Fixa"]] },
    { title: "Ainda não é hoje", objective: "Segurar a abertura do carrinho.", action: "Ela levanta a mão, gesto de espera.", location: "Estúdio de gravação", line: ["fala", "E não, Senhora, ainda não abriu. Calma."], shots: [["Plano médio", "Gesto de espera.", "Fixa"], ["Close", "Sorriso.", "Fixa"], ["Detalhe", "Relógio/acessório dourado.", "Fixa"]] },
    { title: "O aulão", objective: "Conduzir para o aulão de 27/11.", action: "Texto do aulão sobre imagem do estúdio.", location: "Estúdio de gravação", line: ["fala", "Amanhã, 27, no grande aulão, eu conto tudo. E abro as portas."], shots: [["Plano geral", "Estúdio preparado.", "Dolly lateral"], ["Insert", "Cadeira vazia esperando.", "Fixa"], ["Primeiro plano", "Convite.", "Fixa"]], notes: "Horário e link do aulão: [PLACEHOLDER — a confirmar]." },
    { title: "O que eu preparei", objective: "Fechamento da revelação.", action: "Evellyn sorri e a luz bronze sobe.", location: "Estúdio de gravação", line: ["fala", "Isso é o que eu preparei para vocês."], shots: [["Close", "Sorriso.", "Dolly-in"], ["Plano geral", "Luz subindo.", "Fixa"], ["Close extremo", "Olhar final.", "Fixa"]], transition: "Fade para preto. Texto: “IQV — INSTA QUE VENDE. AMANHÃ, NO AULÃO.” CTA: ativar lembrete." },
  ],
  { lighting: "Luz mais aberta e quente — a revelação ‘acende’ o universo da campanha.", sound: "Trilha em crescendo, primeira aparição do tema completo." },
);

const F5 = build(
  [
    { title: "Começou", objective: "Anunciar a abertura.", action: "Evellyn entra no estúdio em plena luz.", location: "Estúdio de gravação", line: ["fala", "A Black IQV começou."], shots: [["Detalhe", "Tênis cruzando a porta.", "Tracking baixo"], ["Plano americano", "Entrada.", "Travelling para trás"], ["Primeiro plano", "Anúncio.", "Fixa"]] },
    { title: "As portas abertas", objective: "Carrinho aberto.", action: "Ela abre as portas do estúdio — metáfora.", location: "Estúdio de gravação", line: ["off", "O carrinho do IQV está aberto."], shots: [["Plano geral", "Portas abrindo.", "Dolly-in"], ["Close", "Expressão.", "Fixa"], ["Insert", "Luz invadindo.", "Fixa"]] },
    { title: "O curso", objective: "Mostrar o curso.", action: "Navegação pela plataforma.", location: "Sala criativa", line: ["off", "Aqui dentro está a metodologia completa do Insta Que Vende."], shots: [["OTS", "Plataforma.", "Rack focus"], ["Insert", "Aulas listadas.", "Slide lento"], ["Plano médio", "Evellyn apresentando.", "Fixa"]], notes: "Somente telas reais e conteúdos confirmados." },
    { title: "Os materiais", objective: "Mostrar materiais reais.", action: "Materiais didáticos dispostos.", location: "Sala criativa", line: ["off", "Materiais pensados para você aplicar no seu perfil."], shots: [["Plano geral", "Mesa com materiais.", "Plongée"], ["Macro", "Detalhe impresso.", "Fixa"], ["Insert", "Mão folheando.", "Fixa"]] },
    { title: "A condição", objective: "Apresentar a condição aprovada.", action: "Tipografia sobre preto com valores.", location: "Gráfico", characters: "—", line: ["texto", "De [PREÇO ORIGINAL] por [PREÇO PROMOCIONAL] · [CONDIÇÕES DE PAGAMENTO]"], shots: [["Plano geral", "Tela tipográfica.", "Fixa"], ["Close", "Evellyn reage.", "Fixa"], ["Insert", "Valores.", "Fixa"]], notes: "Valores somente após liberação no aulão. Não inventar números." },
    { title: "Bônus confirmados", objective: "Listar bônus aprovados.", action: "Lista tipográfica.", location: "Gráfico", characters: "—", line: ["texto", "[BÔNUS CONFIRMADOS — a preencher pela E3]"], shots: [["Plano geral", "Lista.", "Fixa"], ["Insert", "Item a item.", "Corte por movimento"], ["Close", "Evellyn.", "Fixa"]], notes: "Se não houver bônus aprovado, remover sequência." },
    { title: "Por tempo limitado", objective: "Prazo real.", action: "Evellyn olha o relógio.", location: "Estúdio de gravação", line: ["fala", "Essa condição vale até [PRAZO REAL DA OFERTA]."], shots: [["Detalhe", "Acessório dourado.", "Fixa"], ["Primeiro plano", "Fala.", "Fixa"], ["Plano médio", "Postura firme.", "Dolly-in"]] },
    { title: "A Black passa", objective: "Assinatura conceitual.", action: "Caminhada final pela clínica.", location: "Corredor da clínica", line: ["fala", "A Black passa, Senhora. O método fica."], shots: [["Detalhe", "Tênis.", "Tracking baixo"], ["Plano americano", "Caminhada.", "Travelling"], ["Close", "Fala.", "Fixa"]] },
    { title: "O convite", objective: "CTA direto.", action: "Evellyn aponta para baixo (link).", location: "Estúdio de gravação", line: ["fala", "Clica no link e vem comigo."], shots: [["Primeiro plano", "Convite.", "Fixa"], ["Insert", "Gesto apontando.", "Fixa"], ["Plano médio", "Sorriso.", "Fixa"]], notes: "Link de compra: [LINK — a confirmar]." },
    { title: "Insta Que Vende", objective: "Encerramento da campanha.", action: "Logotipo IQV sobre preto.", location: "Gráfico", line: ["texto", "IQV — INSTA QUE VENDE. Carrinho aberto."], shots: [["Close", "Último olhar.", "Dolly-in"], ["Plano geral", "Estúdio iluminado.", "Fixa"], ["Insert", "Logotipo.", "Fixa"]], transition: "Fade para preto. Assinatura E3 × ABUHSCA." },
  ],
  { lighting: "Luz plena e celebrativa; bronze e creme dominantes.", sound: "Tema completo da campanha, energia máxima." },
);

export const FILMS: Film[] = [
  { id: "01", number: "01", weekday: "Segunda-feira", date: "23/11", stage: "Curiosidade", title: "Tem alguma coisa acontecendo…", objective: "Despertar curiosidade e gerar comentários sem revelar o curso.", synopsis: "Em meio às missões da Black Friday, Evellyn deixa escapar que existe outro projeto em andamento — e se recusa a contar qual.", status: "em-revisao", version: "v1.0", wardrobe: WARDROBE, photography: "Câmera observacional, dolly-ins lentos nas falas diretas.", closing: "CONTINUA AMANHÃ.", sequences: F1 },
  { id: "02", number: "02", weekday: "Terça-feira", date: "24/11", stage: "Antecipação", title: "Você não faz ideia do que vem aí.", objective: "Construir expectativa, desejo e percepção de que Evellyn está preparando uma entrega especial.", synopsis: "O trabalho invisível por trás da novidade: planejamento, gravações e preparação — sem revelar o nome.", status: "proposta", version: "v0.1", wardrobe: WARDROBE, photography: "Mais contraste e movimento; montagem rítmica de bastidores.", closing: "AMANHÃ, UM SPOILER.", sequences: F2 },
  { id: "03", number: "03", weekday: "Quarta-feira", date: "25/11", stage: "Spoiler", title: "Vou te mostrar um pedacinho.", objective: "Mostrar pistas concretas das aulas, materiais, estrutura e metodologia do IQV.", synopsis: "Cinco fragmentos da metodologia: mentalidade, conteúdo, posicionamento, Stories e comunicação comercial.", status: "proposta", version: "v0.1", wardrobe: WARDROBE, photography: "Inserts didáticos com macro; linguagem de aula.", closing: "AMANHÃ, A REVELAÇÃO.", sequences: F3 },
  { id: "04", number: "04", weekday: "Quinta-feira", date: "26/11", stage: "Revelação", title: "O que eu preparei para vocês.", objective: "Apresentar o IQV e seu propósito, sem antecipar a abertura do carrinho.", synopsis: "O nome é revelado: IQV — Insta Que Vende. O propósito, os pilares e o convite para o grande aulão.", status: "proposta", version: "v0.1", wardrobe: WARDROBE, photography: "Luz se abre; composições simétricas e solenes.", closing: "AMANHÃ, NO AULÃO.", sequences: F4 },
  { id: "05", number: "05", weekday: "Sexta-feira", date: "27/11", stage: "Lançamento", title: "A Black IQV começou.", objective: "Anunciar a abertura do carrinho e apresentar a condição promocional após sua liberação no aulão.", synopsis: "Portas abertas. O curso, os materiais e a condição aprovada — publicado após o aulão.", status: "proposta", version: "v0.1", wardrobe: WARDROBE, photography: "Energia máxima, luz plena, movimentos amplos.", closing: "CARRINHO ABERTO.", sequences: F5 },
];

export function getFilm(id: string) {
  return FILMS.find((f) => f.id === id);
}

// O roteiro e suas falas são preservados. O planejamento visual enviado depois
// possui títulos/enquadramentos próprios, apresentados separadamente na página.
for (const film of FILMS) {
  for (const sequence of film.sequences) {
    const plan = storyboardPlan.find((item) => item.film === Number(film.id) && item.sequence === sequence.n);
    if (!plan) continue;
    sequence.storyboardTitle = plan.title;
    const key = `F${film.id}-S${String(sequence.n).padStart(2, '0')}`;
    const file = (storyboardImages as Record<string, string>)[key];
    for (const [index, shot] of sequence.shots.entries()) {
      shot.visual = plan.shots[index];
      if (file) {
        shot.image = `${import.meta.env.BASE_URL}${file}`;
        shot.imagePanel = index;
      }
    }
  }
}
