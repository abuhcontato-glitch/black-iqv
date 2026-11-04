import { Link } from "../router";
import type { Film } from "../data/campaign";
import { StatusPill } from "./storyboard";

export function FilmCard({ film }: { film: Film }) {
  const cover = film.sequences[0]?.shots[1];
  return (
    <Link
      to="/filmes/$filmId"
      params={{ filmId: film.id }}
      className="group grain relative flex aspect-[9/14] flex-col justify-between overflow-hidden border border-border bg-card p-5 transition duration-500 hover:-translate-y-1 hover:border-primary"
    >
      {cover?.image && <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <img src={cover.image} alt="" loading="lazy" decoding="async" className="storyboard-panel opacity-55" style={{ left: '-100%' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />
      </div>}
      <div className="relative flex items-start justify-between">
        <span className="font-mono text-[0.65rem] text-muted-foreground">{film.weekday} — {film.date}</span>
      </div>
      <span className="pointer-events-none absolute -right-4 top-10 font-display text-[9rem] leading-none text-foreground/5 transition group-hover:text-primary/15">
        {film.number}
      </span>
      <div className="relative">
        <p className="eyebrow text-primary">Filme {film.number} · {film.stage}</p>
        <h3 className="mt-3 font-display text-2xl leading-tight">{film.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{film.objective}</p>
        <div className="mt-5"><StatusPill status={film.status} /></div>
      </div>
    </Link>
  );
}
