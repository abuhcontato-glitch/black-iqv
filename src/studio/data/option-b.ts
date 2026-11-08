import scripts from './option-b-scripts.json';
import { FILMS, type Film, type Sequence } from './campaign';

export const OPTION_B = {
  title: 'A Saga dos 5 Filmes',
  concept: 'Cinco situações cinematográficas conectadas, com Evellyn entrando para desmontar crenças sobre vendas. Histórias com começo, conflito, virada e gancho, unidas pelo humor inteligente e pela mesma protagonista.',
  signature: 'A BLACK PASSA. O MÉTODO FICA.',
  direction: 'Figurino consistente da Evellyn e direção de arte em marrom, preto, creme e bronze. Cenários adaptados e elenco de apoio recorrente. Casting, palco, coletiva e tapete vermelho podem compartilhar um espaço com cenografia modular.',
  production: 'Versões criativas para aprovação. Ensaiar e cronometrar as falas antes da decupagem definitiva. Confirmar locações, elenco e materiais reais do IQV. Preço, condições e link de compra dependem de aprovação; o Filme 05 só deve ser publicado após a abertura efetiva do carrinho.',
};

export function optionBShot(filmId: string, index: number) {
  const wide = filmId === '02' || filmId === '05';
  return { n: 1, frame: 'Quadro conceitual', action: 'Estudo visual da cena', movement: 'Conforme decupagem', lens: 'A definir', image: `${import.meta.env.BASE_URL}media/black-iqv/opcao-b/F${filmId}.png`, imageGrid: { columns: 5, rows: 2, index, width: wide ? 2172 : 1983, height: wide ? 724 : 793 } };
}

export const OPTION_B_FILMS: Film[] = FILMS.map(original => {
  const source = scripts.find(item => item.id === original.id);
  if (!source) return {
    ...original,
    title: 'O Funeral da Black Friday',
    version: 'B · conceito',
    objective: 'Apresentar a dor de vender apenas quando existe promoção.',
    synopsis: 'Profissionais lamentam o fim das vendas. Evellyn chega para questionar por que vender deveria acabar depois da promoção.',
    status: 'em-revisao',
    photography: 'Conceito aprovado conforme o texto enviado. Roteiro completo e decupagem ainda não recebidos nesta sala.',
    sequences: [],
  };
  return {
    ...original,
    title: source.title.toLocaleLowerCase('pt-BR').replace(/^./, char => char.toUpperCase()),
    version: 'B · v1.0',
    status: 'em-revisao',
    objective: source.concept,
    synopsis: source.reference,
    wardrobe: 'Look marrom-chocolate da Evellyn, com acessórios e tênis retrô consistentes ao longo da campanha. Paleta: marrom, preto, creme e bronze.',
    photography: source.direction,
    closing: source.scenes[9].lettering,
    sequences: source.scenes.map(scene => ({
      n: scene.n,
      title: scene.title,
      objective: `Etapa ${scene.n} da narrativa: ${scene.title.toLocaleLowerCase('pt-BR')}.`,
      action: scene.action,
      location: scene.title,
      characters: [...new Set(scene.dialogue.map(line => line.speaker.replace(' (OFF)', '')))].join(' · ') || 'Elenco e cenário da cena',
      line: { kind: 'fala', speaker: 'Diálogo do roteiro', text: scene.dialogue.map(line => `${line.speaker}: ${line.text}`).join('\n\n') || 'Cena sem fala indicada no roteiro.' },
      literaryScript: scene.script,
      // Decupagem sugerida, separada do texto literário do cliente. Não reutiliza imagens da Opção A.
      shots: [
        { ...optionBShot(original.id, scene.n - 1), frame: 'Plano de referência', action: scene.action, lens: '24mm sugerida' },
        { n: 2, frame: 'Plano médio', action: 'Cobertura da ação principal e das falas desta cena.', movement: 'A definir no ensaio', lens: '35mm sugerida' },
        { n: 3, frame: 'Close / detalhe', action: 'Reação ou detalhe de apoio à virada desta cena.', movement: 'A definir no ensaio', lens: '85mm sugerida' },
      ],
      lighting: 'Marrom, preto, creme e bronze; desenho de luz a confirmar na visita técnica.',
      sound: 'Trilha e sons diegéticos conforme roteiro; desenho sonoro final a definir.',
      transition: scene.lettering ? `Lettering: ${scene.lettering}` : 'Montagem a definir na decupagem definitiva.',
      notes: `${source.direction} Enquadramentos e lentes são sugestões de pré-produção; falas e ações seguem o roteiro recebido.${original.id === '03' || original.id === '04' || original.id === '05' ? ' Usar apenas materiais reais ou aprovados do IQV.' : ''}${original.id === '05' ? ' Publicar após abertura efetiva do carrinho. Inserir apenas preço, condições e link aprovados.' : ''}`,
    })) as Sequence[],
  };
});
