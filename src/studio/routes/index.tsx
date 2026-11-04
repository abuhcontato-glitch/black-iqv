import { Link, useParams } from "../router";
import hero from "../assets/hero-black-iqv.jpg";
import { CAMPAIGN, FILMS } from "../data/campaign";
import { FilmCard } from "../components/film-card";
import { SiteFooter } from "../components/site-header";


const days: [string, string][] = [
  ["No domingo", "a curiosidade"],
  ["Na segunda-feira", "a antecipação"],
  ["Na terça-feira", "o spoiler"],
  ["Na quarta-feira", "a revelação"],
  ["Na quinta-feira", "o grande lançamento"],
];

export default function Index() {
  return (
    <main>
      <section className="grain relative flex min-h-[100dvh] items-end overflow-hidden">
        <img src={hero} alt="Protagonista caminhando no corredor da clínica, figurino da campanha" width={1920} height={1088} className="absolute inset-0 size-full object-cover object-[60%_center] opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/10" />
        <div className="relative mx-auto w-full max-w-7xl px-5 pb-16 pt-32 sm:pb-24">
          <p className="eyebrow animate-rise">{CAMPAIGN.phase}</p>
          <h1 className="animate-rise mt-6 font-display text-[22vw] leading-[0.85] tracking-tight sm:text-[11rem]" style={{ animationDelay: "120ms" }}>
            BLACK<br /><em className="text-primary">IQV</em>
          </h1>
          <p className="animate-rise mt-8 max-w-xl text-sm uppercase tracking-[0.25em] text-foreground/90 sm:text-base" style={{ animationDelay: "260ms" }}>
            Cinco dias. Cinco filmes. Uma grande revelação.
          </p>
          <div className="animate-rise mt-6 flex flex-wrap gap-x-8 gap-y-1 font-mono text-xs text-muted-foreground" style={{ animationDelay: "360ms" }}>
            <span>{CAMPAIGN.dates}</span>
            <span>{CAMPAIGN.partners}</span>
          </div>
          <div className="animate-rise mt-10 flex flex-wrap gap-3" style={{ animationDelay: "460ms" }}>
            <a href="#conceito" className="bg-primary px-6 py-4 font-mono text-xs uppercase tracking-[0.2em] text-primary-foreground transition hover:bg-foreground">
              Explorar a campanha
            </a>
            <Link to="/filmes" className="border border-foreground/40 px-6 py-4 font-mono text-xs uppercase tracking-[0.2em] transition hover:border-primary hover:text-primary">
              Ver os cinco filmes
            </Link>
          </div>
        </div>
      </section>

      <section id="conceito" className="mx-auto max-w-7xl px-5 py-24 sm:py-36">
        <p className="eyebrow">Conceito estratégico</p>
        <h2 className="mt-6 max-w-4xl font-display text-5xl leading-[0.95] sm:text-7xl">
          A Black passa.<br /><em className="text-primary">O método fica.</em>
        </h2>
        <div className="mt-14 grid gap-12 md:grid-cols-2">
          <div className="space-y-5 text-lg leading-relaxed text-foreground/80">
            <p>A BLACK IQV é uma campanha cinematográfica construída em cinco capítulos para revelar progressivamente a metodologia Insta Que Vende, de Evellyn Pereira.</p>
            <p>A narrativa acompanha a preparação de uma grande novidade enquanto as profissionais da beleza vivenciam a Black Friday. A cada dia, uma nova peça da história é apresentada.</p>
          </div>
          <ol className="divide-y divide-border border-y border-border">
            {days.map(([d, s], i) => (
              <li key={d} className="flex items-baseline gap-6 py-4">
                <span className="font-mono text-xs text-primary">0{i + 1}</span>
                <span className="text-muted-foreground">{d},</span>
                <span className="font-display text-2xl">{s}.</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-20 grid gap-px bg-border md:grid-cols-2">
          <div className="bg-background p-8">
            <p className="eyebrow">Etapa anterior</p>
            <h3 className="mt-3 font-display text-3xl">Desafio Black Friday — R$ 47</h3>
            <p className="mt-3 text-muted-foreground">Preparação comercial, com entrada pelo WhatsApp e missões práticas.</p>
          </div>
          <div className="bg-secondary p-8">
            <p className="eyebrow text-primary">Esta campanha</p>
            <h3 className="mt-3 font-display text-3xl">BLACK IQV — {CAMPAIGN.dates}</h3>
            <p className="mt-3 text-foreground/80">Lançamento cinematográfico da metodologia completa. Grande aulão de encerramento e abertura do carrinho do IQV em 26/11.</p>
          </div>
        </div>
      </section>

      <section className="border-t border-border px-5 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Linha do tempo</p>
              <h2 className="mt-4 font-display text-5xl">Os cinco filmes</h2>
            </div>
            <p className="hidden font-mono text-xs text-muted-foreground sm:block">{CAMPAIGN.format}</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {FILMS.map((f) => <FilmCard key={f.id} film={f} />)}
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
