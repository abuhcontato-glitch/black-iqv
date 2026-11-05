import { useEffect, useState } from 'react';
import { Link, useParams } from '../router';
import { CAMPAIGN, FILMS } from '../data/campaign';
import { despertar, despertarRange } from '../data/o-despertar';
import { DespertarScript } from '../components/despertar-script';
import { SiteFooter } from '../components/site-header';
import { cn } from '../lib/utils';

export function OptionB() {
  return <main className="pt-14"><section className="mx-auto max-w-7xl px-5 py-20">
    <Link to="/" className="eyebrow text-primary">← Campanha principal</Link>
    <p className="eyebrow mt-10">Opção B · {CAMPAIGN.dates}</p>
    <h1 className="mt-4 font-display text-6xl sm:text-8xl">A Operação IQV</h1>
    <p className="mt-6 max-w-2xl leading-relaxed text-muted-foreground">Uma segunda ideia para os cinco filmes cinematográficos. {despertar.concept}</p>
    <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">{FILMS.map((film, index) => <Link key={film.id} to={`/opcao-b/filmes/${film.id}`} className="group flex aspect-[9/14] flex-col justify-between border border-border bg-card p-5 transition hover:-translate-y-1 hover:border-primary">
      <span className="font-mono text-xs text-muted-foreground">{film.weekday} — {film.date}</span>
      <span className="font-display text-8xl text-primary/40">{film.number}</span>
      <div><p className="eyebrow text-primary">Opção B · Filme {film.number}</p><h2 className="mt-3 font-display text-2xl">{index === 0 ? despertar.title : `Filme ${film.number}`}</h2><p className="mt-4 text-sm text-muted-foreground">{index === 0 ? '80s · 20 cenas · Roteiro adicionado' : 'Aguardando roteiro desta segunda ideia'}</p></div>
    </Link>)}</div>
  </section><SiteFooter/></main>;
}

const views = [['sequencias', 'Por sequência'], ['quadros', 'Storyboard completo'], ['roteiro', 'Roteiro'], ['tecnico', 'Técnico']] as const;
export function OptionBFilm() {
  const { filmId } = useParams();
  const film = FILMS.find(item => item.id === filmId);
  const [view, setView] = useState('sequencias');
  const [active, setActive] = useState(0);
  useEffect(() => { setView('sequencias'); setActive(0); }, [filmId]);
  if (!film) return <main className="px-5 pt-32"><Link to="/opcao-b">Voltar à Opção B</Link></main>;
  const ready = film.id === '01';
  const scene = despertar.scenes[active];
  return <main className="pt-14">
    <section className="border-b border-border px-5 py-16 sm:py-24"><div className="mx-auto max-w-7xl">
      <Link to="/opcao-b" className="eyebrow text-primary">← Os cinco filmes · Opção B</Link>
      <p className="eyebrow mt-10 text-primary">A Operação IQV · Filme {film.number}</p>
      <p className="mt-4 font-mono text-xs text-muted-foreground">{film.weekday} — {film.date}{ready ? ' · 80s · 9:16 · 20 cenas' : ''}</p>
      <h1 className="mt-6 font-display text-5xl sm:text-8xl">{ready ? despertar.title : `Filme ${film.number}`}</h1>
      <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">{ready ? despertar.concept : 'O roteiro deste capítulo da Opção B ainda precisa ser enviado. Este espaço pertence à segunda ideia.'}</p>
    </div></section>
    {ready ? <><div className="sticky top-14 z-30 border-b border-border bg-background/90 backdrop-blur"><div className="mx-auto flex max-w-7xl overflow-x-auto px-5">{views.map(([key, title]) => <button key={key} onClick={() => setView(key)} className={cn('eyebrow shrink-0 border-b-2 px-3 py-4', view === key ? 'border-primary text-foreground' : 'border-transparent')}>{title}</button>)}</div></div>
      <section className="mx-auto max-w-7xl px-5 py-12">
        {view === 'roteiro' && <DespertarScript/>}
        {view === 'sequencias' && <><div className="grid grid-cols-5 gap-px bg-border sm:grid-cols-10">{despertar.scenes.map((_, index) => <button key={index} onClick={() => setActive(index)} className={cn('bg-background p-3 text-left', active === index && 'text-primary')}><span className="block font-mono text-[0.6rem]">{despertarRange(index)}</span><span className="font-display text-xl">{String(index + 1).padStart(2, '0')}</span></button>)}</div><article className="mt-10 max-w-3xl"><p className="eyebrow text-primary">Cena {active + 1} · {despertarRange(active)}</p><h2 className="mt-4 font-display text-4xl">{scene[1]}</h2><p className="mt-5 text-muted-foreground">{scene[0]} · {scene[2]}</p></article></>}
        {view === 'quadros' && <><p className="mb-8 text-sm text-muted-foreground">Decupagem textual da prancha enviada. A imagem original ainda não está disponível como arquivo na plataforma.</p><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{despertar.scenes.map(([frame, title, action], index) => <article key={index} className="border border-border bg-card p-5"><p className="font-mono text-xs text-primary">{String(index + 1).padStart(2, '0')} · {despertarRange(index)}</p><p className="eyebrow mt-5">{frame}</p><h2 className="mt-3 font-display text-2xl">{title}</h2><p className="mt-4 text-sm text-muted-foreground">{action}</p></article>)}</div></>}
        {view === 'tecnico' && <div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left text-sm"><thead><tr className="eyebrow border-b border-border">{['Cena', 'Tempo', 'Enquadramento', 'Ação'].map(label => <th key={label} className="p-3">{label}</th>)}</tr></thead><tbody>{despertar.scenes.map(([frame, , action], index) => <tr key={index} className="border-b border-border"><td className="p-3 text-primary">{index + 1}</td><td className="p-3 font-mono text-xs">{despertarRange(index)}</td><td className="p-3">{frame}</td><td className="p-3 text-muted-foreground">{action}</td></tr>)}</tbody></table></div>}
      </section></> : <section className="mx-auto max-w-7xl px-5 py-16"><p className="text-muted-foreground">Aguardando conteúdo para preencher roteiro, sequências, storyboard e ficha técnica.</p></section>}
    <nav className="mx-auto flex max-w-7xl flex-wrap justify-between gap-6 border-t border-border p-6">{Number(film.id) > 1 ? <Link to={`/opcao-b/filmes/${String(Number(film.id) - 1).padStart(2, '0')}`}>← Filme anterior</Link> : <Link to="/opcao-b">Todos os filmes</Link>}{Number(film.id) < 5 && <Link to={`/opcao-b/filmes/${String(Number(film.id) + 1).padStart(2, '0')}`}>Próximo filme →</Link>}</nav>
    <SiteFooter/>
  </main>;
}
