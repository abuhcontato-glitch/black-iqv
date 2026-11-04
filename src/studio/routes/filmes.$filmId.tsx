import { Link, useParams } from "../router";
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { FILMS, getFilm, seqRange, type Film, type Sequence } from "../data/campaign";
import { Frame, Spec, StatusPill, useViewer } from "../components/storyboard";
import { SiteFooter } from "../components/site-header";
import { cn } from "../lib/utils";


const VIEWS = [
  ["sequencias", "Por sequência"],
  ["quadros", "Storyboard completo"],
  ["roteiro", "Roteiro"],
  ["tecnico", "Técnico"],
] as const;
type View = (typeof VIEWS)[number][0];

export default function FilmPage() {
  const film = getFilm(useParams().filmId ?? "")!;
  const [view, setView] = useState<View>("sequencias");
  const [active, setActive] = useState(1);
  const { open, viewer } = useViewer(film);
  const idx = FILMS.findIndex((f) => f.id === film.id);
  const prev = FILMS[idx - 1];
  const next = FILMS[idx + 1];

  return (
    <main className="pt-14" key={film.id}>
      <section className="border-b border-border px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <Link to="/filmes" className="eyebrow inline-flex items-center gap-2 hover:text-primary"><ArrowLeft className="size-3" /> Todos os filmes</Link>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <span className="eyebrow text-primary">Filme {film.number} · {film.stage}</span>
            <span className="font-mono text-xs text-muted-foreground">{film.weekday} — {film.date} · 80s · 9:16 · {film.version}</span>
            <StatusPill status={film.status} />
          </div>
          <h1 className="animate-rise mt-6 max-w-5xl font-display text-5xl leading-[0.95] sm:text-8xl">{film.title}</h1>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">Pranchas de pré-produção · imagens conceituais geradas por IA. Planejamento visual e roteiro sujeitos à revisão criativa.</p>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            <Spec k="Objetivo" v={film.objective} />
            <Spec k="Sinopse" v={film.synopsis} />
            <Spec k="Figurino" v={film.wardrobe} />
          </div>
        </div>
      </section>

      <div className="sticky top-14 z-30 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-5">
          {VIEWS.map(([k, l]) => (
            <button key={k} onClick={() => setView(k)} className={cn("eyebrow shrink-0 border-b-2 px-3 py-4 transition", view === k ? "border-primary text-foreground" : "border-transparent hover:text-foreground")}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-5 py-12">
        {view === "sequencias" && <SequenceView film={film} active={active} setActive={setActive} open={open} />}
        {view === "quadros" && <GridView film={film} open={open} />}
        {view === "roteiro" && <ScriptView film={film} />}
        {view === "tecnico" && <TechView film={film} />}
      </section>

      <section className="border-t border-border px-5 py-12">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow">Aprovação</p>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Comentários e aprovação por versão estão em configuração e ainda não estão ativos nesta sala. Nenhuma aprovação é registrada por enquanto.
          </p>
        </div>
      </section>

      <nav className="mx-auto grid max-w-7xl grid-cols-2 border-t border-border">
        {prev ? (
          <Link to="/filmes/$filmId" params={{ filmId: prev.id }} className="group p-6 hover:bg-card">
            <span className="eyebrow inline-flex items-center gap-2"><ArrowLeft className="size-3" /> Filme {prev.number}</span>
            <p className="mt-2 font-display text-lg group-hover:text-primary">{prev.title}</p>
          </Link>
        ) : <span />}
        {next ? (
          <Link to="/filmes/$filmId" params={{ filmId: next.id }} className="group p-6 text-right hover:bg-card">
            <span className="eyebrow inline-flex items-center gap-2">Filme {next.number} <ArrowRight className="size-3" /></span>
            <p className="mt-2 font-display text-lg group-hover:text-primary">{next.title}</p>
          </Link>
        ) : <span />}
      </nav>
      <SiteFooter />
      {viewer}
    </main>
  );
}

function SequenceView({ film, active, setActive, open }: { film: Film; active: number; setActive: (n: number) => void; open: (s: number, p: number) => void }) {
  const seq = film.sequences[active - 1] ?? film.sequences[0]!;
  return (
    <div>
      <div className="grid grid-cols-5 gap-px bg-border sm:grid-cols-10">
        {film.sequences.map((s) => (
          <button key={s.n} onClick={() => setActive(s.n)} className={cn("bg-background p-3 text-left transition hover:bg-card", active === s.n && "bg-secondary")}>
            <span className="font-mono text-[0.6rem] text-muted-foreground">{seqRange(s.n)}</span>
            <span className={cn("mt-1 block font-display text-xl", active === s.n && "text-primary")}>{String(s.n).padStart(2, "0")}</span>
          </button>
        ))}
      </div>
      <SequencePanel key={seq.n} seq={seq} open={open} />
    </div>
  );
}

function SequencePanel({ seq, open }: { seq: Sequence; open: (s: number, p: number) => void }) {
  return (
    <article className="animate-rise mt-10 grid gap-10 lg:grid-cols-[1fr_1.1fr]">
      <div>
        <p className="font-mono text-xs text-primary">SEQ {String(seq.n).padStart(2, "0")} · {seqRange(seq.n)}</p>
        <h2 className="mt-3 font-display text-4xl uppercase">{seq.storyboardTitle ?? seq.title}</h2>
        {seq.storyboardTitle !== seq.title && <p className="mt-3 text-xs text-muted-foreground">No roteiro: {seq.title}</p>}
        <blockquote className="mt-8 border-l-2 border-primary pl-5 font-display text-2xl italic leading-snug">
          “{seq.line.text}”
          <span className="mt-2 block font-mono text-[0.6rem] not-italic uppercase tracking-[0.2em] text-muted-foreground">
            {seq.line.kind === "off" ? "Narração em off" : seq.line.kind === "texto" ? "Texto em tela" : "Fala"}
          </span>
        </blockquote>
        <dl className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Spec k="Objetivo dramático" v={seq.objective} />
          <Spec k="Ação no roteiro" v={seq.action} />
          <Spec k="Locação" v={seq.location} />
          <Spec k="Personagens" v={seq.characters} />
          <Spec k="Iluminação" v={seq.lighting} />
          <Spec k="Som e trilha" v={seq.sound} />
          <Spec k="Transição" v={seq.transition} />
          <Spec k="Observações de produção" v={seq.notes} />
        </dl>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {seq.shots.map((sh) => (
          <button key={sh.n} onClick={() => open(seq.n, sh.n)} className="group text-left">
            <Frame seq={seq} shot={sh} className="transition group-hover:border-primary" />
            <p className="mt-3 font-mono text-[0.6rem] text-primary">P{sh.n} · {sh.visual?.lens ?? sh.lens}</p>
            <p className="mt-1 text-sm">{sh.visual?.frame ?? sh.frame}</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{sh.visual?.action ?? sh.action}</p>
            <p className="text-xs text-muted-foreground">{sh.movement}</p>
          </button>
        ))}
      </div>
    </article>
  );
}

function GridView({ film, open }: { film: Film; open: (s: number, p: number) => void }) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
      {film.sequences.flatMap((s) =>
        s.shots.map((sh) => (
          <button key={`${s.n}-${sh.n}`} onClick={() => open(s.n, sh.n)} className="group text-left">
            <Frame seq={s} shot={sh} className="transition group-hover:border-primary" />
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{sh.visual?.action ?? sh.action}</p>
          </button>
        )),
      )}
    </div>
  );
}

function ScriptView({ film }: { film: Film }) {
  return (
    <div className="mx-auto max-w-2xl space-y-12 font-mono text-sm leading-relaxed">
      {film.status === "proposta" && <p className="eyebrow text-center text-primary">Proposta criativa — sujeita à revisão</p>}
      {film.sequences.map((s) => (
        <div key={s.n}>
          <p className="font-bold uppercase">{String(s.n).padStart(2, "0")}. INT. {s.location.toUpperCase()} — {seqRange(s.n)}</p>
          <p className="mt-3 text-foreground/80">{s.action}</p>
          <div className="mx-auto mt-4 max-w-md text-center">
            <p className="uppercase">{s.line.kind === "texto" ? "TEXTO EM TELA" : `EVELLYN${s.line.kind === "off" ? " (OFF)" : ""}`}</p>
            <p className="mt-1 text-foreground/90">{s.line.text}</p>
          </div>
          <p className="mt-4 text-right uppercase text-muted-foreground">{s.transition}</p>
        </div>
      ))}
      <p className="text-center font-display text-3xl not-italic">{film.closing}</p>
    </div>
  );
}

function TechView({ film }: { film: Film }) {
  return (
    <div className="overflow-x-auto">
      <p className="mb-6 max-w-2xl text-muted-foreground">{film.photography}</p>
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="eyebrow border-b border-border">
          <tr><th className="py-3 pr-4">Plano</th><th className="pr-4">Enquadramento</th><th className="pr-4">Lente</th><th className="pr-4">Movimento</th><th className="pr-4">Ação</th><th>Locação</th></tr>
        </thead>
        <tbody>
          {film.sequences.flatMap((s) =>
            s.shots.map((sh) => (
              <tr key={`${s.n}-${sh.n}`} className="border-b border-border/60">
                <td className="py-3 pr-4 font-mono text-xs text-primary">{String(s.n).padStart(2, "0")}.{sh.n}</td>
                <td className="pr-4">{sh.visual?.frame ?? sh.frame}</td>
                <td className="pr-4 font-mono text-xs">{sh.visual?.lens ?? sh.lens}</td>
                <td className="pr-4">{sh.movement}</td>
                <td className="pr-4 text-muted-foreground">{sh.visual?.action ?? sh.action}</td>
                <td className="text-muted-foreground">{s.location}</td>
              </tr>
            )),
          )}
        </tbody>
      </table>
    </div>
  );
}
