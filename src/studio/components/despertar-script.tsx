import { despertar, despertarRange } from '../data/o-despertar';

export function DespertarScript() {
  return (
    <article className="space-y-12" aria-label="Novo roteiro — O Despertar">
      <header className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="eyebrow text-primary">Filme 01 · Série: {despertar.series}</p>
          <h2 className="mt-4 font-display text-5xl sm:text-7xl">{despertar.title}</h2>
          <p className="mt-5 font-mono text-xs text-primary">80 segundos · Vertical 9:16 · 20 cenas · Cinematográfico</p>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">Opção B · Conteúdo da prancha enviada para esta segunda ideia.</p>
        </div>
        <div className="border-l border-primary pl-6">
          <h3 className="eyebrow">Conceito criativo</h3>
          <p className="mt-4 text-sm leading-relaxed">{despertar.concept}</p>
          <ul className="mt-5 space-y-2 text-sm text-muted-foreground">{despertar.objectives.map(objective => <li key={objective}>• {objective}</li>)}</ul>
        </div>
      </header>
      <section>
        <h3 className="eyebrow text-primary">Roteiro · Falas da Evellyn</h3>
        <ol className="mt-6 grid gap-px bg-border md:grid-cols-2">
          {despertar.lines.map((line, index) => <li key={line} className="flex gap-5 bg-background p-5 sm:p-7"><span className="font-mono text-xs text-primary">{String(index + 1).padStart(2, '0')}</span><p className="font-display text-xl leading-relaxed">“{line}”</p></li>)}
        </ol>
      </section>
      <section>
        <h3 className="eyebrow text-primary">Decupagem · 20 cenas</h3>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">Ordem e tempos da prancha. As dez falas são apresentadas integralmente acima; sua distribuição entre as cenas será definida na montagem.</p>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {despertar.scenes.map(([frame, title, action], index) => <li key={title} className="border border-border bg-card p-5"><p className="font-mono text-xs text-primary">{String(index + 1).padStart(2, '0')} · {despertarRange(index)}</p><p className="mt-5 text-xs uppercase tracking-wider text-muted-foreground">{frame}</p><h4 className="mt-2 font-display text-2xl">{title}</h4><p className="mt-4 text-sm leading-relaxed text-muted-foreground">{action}</p></li>)}
        </ol>
      </section>
      <p className="border-t border-border pt-8 text-center font-display text-3xl">CONTINUA AMANHÃ.</p>
    </article>
  );
}
