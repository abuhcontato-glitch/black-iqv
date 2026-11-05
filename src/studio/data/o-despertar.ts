// Transcrição editorial da prancha enviada pelo cliente. Não é uma leitura da conversa vinculada.
export const despertar = {
  title: 'O Despertar',
  series: 'A Operação IQV',
  concept: 'Inspirado em O Diabo Veste Prada + Inception, O Despertar apresenta Evellyn como a arquiteta de uma grande virada. O público é convidado a entrar na mente, na rotina e na preparação de um plano que vai muito além da Black Friday.',
  objectives: ['Despertar curiosidade', 'Apresentar o tom da campanha', 'Mostrar que existe uma preparação estratégica', 'Criar expectativa para o próximo episódio'],
  lines: [
    'Senhoras… vocês acham mesmo que tudo termina na Black Friday?',
    'Eu tô aqui preparando as missões de vocês… mas tem outra coisa acontecendo.',
    'Tem tanta mulher boa no que faz… que merece aprender a mostrar e vender esse trabalho.',
    'E depois da sexta, Senhora? Como é que você vai continuar vendendo?',
    'Eu passei muito tempo construindo uma coisa que vai muito além de uma promoção.',
    'Porque eu não quero ensinar vocês a vender só numa data.',
    'Eu quero que vocês entendam como construir estratégia, conteúdo e venda de verdade.',
    'Eu já ia contar agora… mas não. Ainda não, Senhora.',
    'Amanhã eu vou dar mais uma pista. E vocês vão entender tudo isso.',
    'A Black Friday passa, Senhora… mas o que eu preparei não acaba nela.',
  ],
  scenes: [
    ['Close extremo', 'O despertar.', 'Olhos de Evellyn em destaque.'],
    ['Detalhe', 'O dia começa antes de todo mundo.', 'Relógio digital marcando 05:59.'],
    ['Contra-luz', 'Preparação.', 'Evellyn abre a cortina diante da cidade.'],
    ['Medium', 'Foco e disciplina.', 'Evellyn toma café.'],
    ['Detalhe', 'O plano ganha forma.', 'Caderno com checklist: conteúdo, posicionamento, vendas e escala.'],
    ['Travelling', 'Chegando à operação.', 'Evellyn caminha pelo corredor.'],
    ['Plano de equipe', 'Alinhamento.', 'Evellyn e equipe reunidas em torno do planejamento.'],
    ['Insert', 'O universo da beleza.', 'Notebook com referências de procedimentos de beleza.'],
    ['Close', '“E depois sexta?”', 'Evellyn encara a câmera.'],
    ['Detalhe', 'A data-chave.', 'Sexta-feira circulada no calendário.'],
    ['Bastidor', 'Gravação da metodologia.', 'Monitor de câmera com Evellyn gravando.'],
    ['Medium', 'Construção do conteúdo.', 'Evellyn trabalha no notebook.'],
    ['Detalhe', 'O método (ainda em sigilo).', 'Mãos sobre o livro da metodologia.'],
    ['Plano geral', 'Todas as peças se conectam.', 'Evellyn diante de um painel com referências e conexões.'],
    ['Close', '“Quase te conto…”', 'Expressão de cumplicidade com quem assiste.'],
    ['Ação', 'Mas ainda não.', 'Evellyn fecha o livro.'],
    ['Travelling', 'A contagem continua.', 'Caminhada pelo corredor iluminado.'],
    ['Medium', '“Amanhã eu dou uma pista.”', 'Evellyn volta o olhar para a câmera.'],
    ['Close extremo', 'A promessa.', 'Retorno ao olhar de Evellyn.'],
    ['Detalhe final', 'Continua amanhã.', 'Assinatura BLACK IQV.'],
  ],
};

export function despertarRange(index: number) {
  const format = (seconds: number) => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  return `${format(index * 4)}–${format((index + 1) * 4)}`;
}
