import { Link, useParams } from '../router';
import { CAMPAIGN } from '../data/campaign';
import { OPTION_B, OPTION_B_FILMS, optionBShot } from '../data/option-b';
import { DespertarScript } from '../components/despertar-script';
import { SiteFooter } from '../components/site-header';
import { FilmCard } from '../components/film-card';
import FilmPage from './filmes.$filmId';
import { FuneralConcept } from '../components/funeral-concept';

export function OptionB() {
  return <main className="pt-14"><section className="mx-auto max-w-7xl px-5 py-20">
    <Link to="/" className="eyebrow text-primary">← Campanha principal</Link>
    <p className="eyebrow mt-10">Opção B · ABUHSCA × E3 MARKETING · {CAMPAIGN.dates}</p>
    <h1 className="mt-4 font-display text-6xl sm:text-8xl">{OPTION_B.title}</h1>
    <p className="mt-6 max-w-2xl leading-relaxed text-muted-foreground">{OPTION_B.concept}</p>
    <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">{OPTION_B_FILMS.map(film => <FilmCard key={film.id} film={film} routeBase="/opcao-b/filmes" coverShot={optionBShot(film.id, film.id === '01' ? 4 : 1)}/>)}</div>
    <div className="mt-16 grid gap-10 border-t border-border pt-10 md:grid-cols-2"><section><h2 className="eyebrow text-primary">Direção criativa geral</h2><p className="mt-4 leading-relaxed text-muted-foreground">{OPTION_B.direction}</p></section><section><h2 className="eyebrow text-primary">Preparação de produção</h2><p className="mt-4 leading-relaxed text-muted-foreground">{OPTION_B.production}</p></section></div>
    <p className="mt-16 font-display text-3xl text-primary">{OPTION_B.signature}</p>
    <Link to="/opcao-b/referencias/o-despertar" className="mt-10 inline-block border border-border px-5 py-3 text-sm hover:border-primary">Referência anterior: O Despertar →</Link>
  </section><SiteFooter/></main>;
}

export function OptionBFilm() {
  const { filmId } = useParams();
  const film = OPTION_B_FILMS.find(item => item.id === filmId);
  if (!film) return <main className="min-h-screen px-5 pt-32"><h1 className="font-display text-4xl">Filme não encontrado.</h1><Link to="/opcao-b" className="mt-6 inline-block text-primary">Voltar à Opção B</Link></main>;
  if (film.sequences.length) return <FilmPage key={film.id} selectedFilm={film} films={OPTION_B_FILMS} routeBase="/opcao-b/filmes" optionB/>;
  return <main className="pt-14"><section className="mx-auto max-w-7xl px-5 py-20">
    <Link to="/opcao-b" className="eyebrow text-primary">← Os cinco filmes · Opção B</Link>
    <p className="eyebrow mt-10">Filme {film.number} · {film.weekday} · {film.date} · {film.stage}</p>
    <h1 className="mt-6 font-display text-5xl sm:text-8xl">{film.title}</h1>
    <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">{film.synopsis}</p>
    <div className="mt-12 max-w-2xl border-l border-primary pl-6"><h2 className="eyebrow text-primary">Conceito aprovado · roteiro pendente</h2><p className="mt-4 leading-relaxed text-muted-foreground">O texto recebido confirma este conceito como abertura da saga. O roteiro completo do Funeral ainda precisa ser enviado para fechar as falas, os tempos e a decupagem definitiva. Os estudos visuais já estão disponíveis abaixo.</p></div>
    <FuneralConcept/>
    <div className="mt-12 flex flex-wrap gap-6"><Link to="/opcao-b/filmes/02" className="border border-primary px-6 py-4 text-primary">Filme 02 — O Casting Impossível →</Link><Link to="/opcao-b/referencias/o-despertar" className="border border-border px-6 py-4">Referência anterior — O Despertar</Link></div>
  </section><SiteFooter/></main>;
}

export function DespertarReference() {
  return <main className="pt-14"><section className="mx-auto max-w-7xl px-5 py-20"><Link to="/opcao-b" className="eyebrow text-primary">← Voltar à Opção B</Link><p className="mb-12 mt-8 max-w-2xl text-muted-foreground">Referência anterior preservada. A programação atual da saga abre com O Funeral da Black Friday.</p><DespertarScript/></section><SiteFooter/></main>;
}
