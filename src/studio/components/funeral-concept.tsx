import { useState } from 'react';
import { optionBShot } from '../data/option-b';
import { SheetImage } from './storyboard';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';

const frames = ['O fim da promoção', 'Flores para as vendas', 'As profissionais e o silêncio', 'O planejamento interrompido', 'A chegada de Evellyn', 'A entrada em cena', 'Uma nova presença', 'A pergunta que muda tudo', 'A reação das profissionais', 'O olhar para o futuro'];

export function FuneralConcept() {
  const [active, setActive] = useState<number | null>(null);
  return <section className="mt-14 border-t border-border pt-10">
    <h2 className="font-display text-4xl">Storyboard de conceito</h2>
    <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">Dez estudos visuais gerados por IA para o conceito do Funeral. São referências de cenário, figurino e atmosfera; a ordem definitiva e as falas dependem do roteiro completo.</p>
    <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">{frames.map((title, index) => <button key={title} onClick={() => setActive(index)} className="group text-left"><SheetImage shot={optionBShot('01', index)} label={title} className="aspect-square w-full border border-border transition group-hover:border-primary"/><p className="mt-3 font-mono text-xs text-primary">ESTUDO {String(index + 1).padStart(2, '0')}</p><p className="mt-2 text-sm">{title}</p></button>)}</div>
    <a href={optionBShot('01', 0).image} target="_blank" rel="noopener noreferrer" className="mt-8 inline-block border border-border px-5 py-3 text-sm text-primary hover:border-primary">Abrir prancha completa ↗</a>
    <Dialog open={active !== null} onOpenChange={open => !open && setActive(null)}><DialogContent className="max-h-[95dvh] overflow-y-auto border-border bg-background sm:max-w-3xl">{active !== null && <><DialogTitle className="pr-8 font-display text-2xl">{frames[active]}</DialogTitle><SheetImage shot={optionBShot('01', active)} label={frames[active]} className="aspect-square max-h-[65dvh] w-full"/><div className="flex items-center justify-between gap-4 text-sm"><button onClick={() => setActive((active + 9) % 10)}>← Anterior</button><span className="font-mono text-primary">{active + 1} / 10</span><button onClick={() => setActive((active + 1) % 10)}>Próximo →</button></div></>}</DialogContent></Dialog>
  </section>;
}
