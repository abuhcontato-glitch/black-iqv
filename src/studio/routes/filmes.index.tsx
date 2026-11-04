import { Link, useParams } from "../router";
import { FILMS } from "../data/campaign";
import { FilmCard } from "../components/film-card";
import { SiteFooter } from "../components/site-header";


export default function Films() {
  return (
    <main className="pt-14">
      <section className="mx-auto max-w-7xl px-5 py-20">
        <p className="eyebrow">23—27 NOV 2026</p>
        <h1 className="mt-4 font-display text-6xl sm:text-8xl">Cinco atos.</h1>
        <p className="mt-6 max-w-xl text-muted-foreground">
          Cada filme tem 80 segundos, dividido em dez sequências de planejamento com três quadros de storyboard cada. Os Filmes 02 a 05 são propostas criativas para revisão.
        </p>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {FILMS.map((f) => <FilmCard key={f.id} film={f} />)}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
