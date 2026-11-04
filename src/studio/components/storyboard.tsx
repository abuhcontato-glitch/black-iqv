import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { STATUS_LABEL, timecode, type Film, type ReviewStatus, type Sequence, type Shot } from "../data/campaign";
import { cn } from "../lib/utils";

export function StatusPill({ status }: { status: ReviewStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 border px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.2em]",
        status === "aprovado" && "border-primary text-primary",
        status === "em-revisao" && "border-foreground/40 text-foreground",
        status === "proposta" && "border-border text-muted-foreground",
      )}
    >
      <span className={cn("size-1.5 rounded-full", status === "aprovado" ? "bg-primary" : status === "em-revisao" ? "bg-foreground" : "bg-muted-foreground")} />
      {STATUS_LABEL[status]}
    </span>
  );
}

export function Frame({ seq, shot, className }: { seq: Sequence; shot: Shot; className?: string }) {
  const code = `${String(seq.n).padStart(2, "0")}.${shot.n}`;
  return (
    <div className={cn("grain relative aspect-[9/16] overflow-hidden border border-border bg-card", className)}>
      {shot.image ? (
        <img
          src={shot.image}
          alt={`Plano ${code} — ${shot.visual?.action ?? shot.action}`}
          loading="lazy"
          decoding="async"
          data-storyboard-panel={shot.imagePanel}
          className={shot.imagePanel === undefined ? 'size-full object-cover' : 'storyboard-panel'}
          style={shot.imagePanel === undefined ? undefined : { left: `${shot.imagePanel * -100}%` }}
        />
      ) : (
        <div className="flex size-full flex-col items-center justify-center gap-3 p-4 text-center">
          <span className="font-display text-4xl text-foreground/80">{code}</span>
          <span className="eyebrow">{shot.frame}</span>
          <span className="mt-4 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-primary">Imagem em preparação</span>
        </div>
      )}
      <span className="absolute left-2 top-2 bg-black/65 px-1.5 py-1 font-mono text-[0.6rem] text-foreground">
        {timecode(seq.n, Math.round((shot.n - 1) * 2.67))}
      </span>
    </div>
  );
}

type Item = { seq: Sequence; shot: Shot };

export function useViewer(film: Film) {
  const items: Item[] = film.sequences.flatMap((seq) => seq.shots.map((shot) => ({ seq, shot })));
  const [index, setIndex] = useState<number | null>(null);
  const open = (seq: number, shot: number) => setIndex((seq - 1) * 3 + (shot - 1));
  const viewer = <ShotViewer items={items} index={index} setIndex={setIndex} />;
  return { open, viewer };
}

function ShotViewer({ items, index, setIndex }: { items: Item[]; index: number | null; setIndex: (i: number | null) => void }) {
  const current = index === null ? null : items[index];
  const go = (d: number) => index !== null && setIndex((index + d + items.length) % items.length);

  useEffect(() => {
    if (index === null) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  });

  return (
    <Dialog open={index !== null} onOpenChange={(o) => !o && setIndex(null)}>
      <DialogContent className="max-h-[100dvh] w-full max-w-5xl gap-0 overflow-y-auto border-border bg-background p-0 sm:rounded-none [&>button]:hidden">
        {current && (
          <div className="grid md:grid-cols-[minmax(0,380px)_1fr]">
            <div className="relative bg-card p-4">
              <Frame seq={current.seq} shot={current.shot} className="mx-auto max-h-[70dvh] w-auto" />
              <div className="mt-3 flex justify-between">
                <button onClick={() => go(-1)} aria-label="Quadro anterior" className="p-2 hover:text-primary"><ChevronLeft /></button>
                <span className="eyebrow self-center">{index! + 1} / {items.length}</span>
                <button onClick={() => go(1)} aria-label="Próximo quadro" className="p-2 hover:text-primary"><ChevronRight /></button>
              </div>
            </div>
            <div className="space-y-6 p-6 md:p-10">
              <div className="flex items-start justify-between">
                <div>
                  <p className="eyebrow">Sequência {String(current.seq.n).padStart(2, "0")} · Plano {current.shot.n}</p>
                  <DialogTitle className="mt-2 font-display text-3xl font-normal">{current.shot.visual?.frame ?? current.shot.frame}</DialogTitle>
                </div>
                <button onClick={() => setIndex(null)} aria-label="Fechar" className="p-1 hover:text-primary"><X /></button>
              </div>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                <Spec k="Timecode" v={timecode(current.seq.n, Math.round((current.shot.n - 1) * 2.67))} mono />
                <Spec k="Lente sugerida" v={current.shot.visual?.lens ?? current.shot.lens} mono />
                <Spec k="Movimento" v={current.shot.movement} />
                <Spec k="Locação" v={current.seq.location} />
              </dl>
              <Spec k="Quadro visual" v={current.shot.visual?.action ?? current.shot.action} />
              {current.shot.image && <a href={current.shot.image} target="_blank" rel="noopener noreferrer" className="inline-block border border-border px-4 py-3 font-mono text-xs text-primary hover:border-primary">Abrir prancha completa ↗</a>}
              <p className="text-xs leading-relaxed text-muted-foreground">Imagem conceitual gerada por IA para pré-produção. As falas abaixo pertencem à versão do roteiro e podem ser ajustadas na revisão criativa.</p>
              <blockquote className="border-l-2 border-primary pl-4 font-display text-xl italic leading-snug">
                “{current.seq.line.text}”
                <span className="mt-2 block font-mono text-[0.6rem] not-italic uppercase tracking-[0.2em] text-muted-foreground">
                  {current.seq.line.kind === "off" ? "Narração em off" : current.seq.line.kind === "texto" ? "Texto em tela" : "Fala"}
                </span>
              </blockquote>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function Spec({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div>
      <dt className="eyebrow mb-1">{k}</dt>
      <dd className={cn("text-foreground/90", mono && "font-mono text-xs")}>{v}</dd>
    </div>
  );
}
