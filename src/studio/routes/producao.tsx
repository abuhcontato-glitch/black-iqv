import { Link, useParams } from "../router";
import { FILMS } from "../data/campaign";
import { StatusPill } from "../components/storyboard";
import { SiteFooter } from "../components/site-header";


const pending = [
  "Fotografias autorizadas da protagonista",
  "Logotipo oficial IQV",
  "Telas reais da plataforma do curso",
  "Horário e link do grande aulão (26/11)",
  "Preço original, preço promocional e condições de pagamento",
  "Bônus confirmados e prazo real da oferta",
  "Link de compra",
  "Autorização de imagem das profissionais convidadas",
];

export default function Production() {
  return (
    <main className="pt-14">
      <section className="mx-auto max-w-7xl px-5 py-20">
        <p className="eyebrow">Plano de produção</p>
        <h1 className="mt-4 font-display text-6xl sm:text-8xl">Cronograma</h1>
        <div className="mt-14 divide-y divide-border border-y border-border">
          {FILMS.map((f) => {
            const locs = [...new Set(f.sequences.map((s) => s.location))].join(" · ");
            return (
              <Link key={f.id} to="/filmes/$filmId" params={{ filmId: f.id }} className="grid gap-3 py-6 transition hover:bg-card sm:grid-cols-[140px_1fr_auto] sm:items-center sm:px-4">
                <span className="font-mono text-xs text-primary">{f.weekday.slice(0, 3).toUpperCase()} {f.date}</span>
                <div>
                  <p className="font-display text-2xl">{f.number} — {f.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{locs}</p>
                </div>
                <StatusPill status={f.status} />
              </Link>
            );
          })}
        </div>
        <div className="mt-20 grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl">Pendências da E3</h2>
            <p className="mt-2 text-muted-foreground">Itens que ficam como espaços reservados até o envio oficial.</p>
          </div>
          <ul className="space-y-3">
            {pending.map((p) => (
              <li key={p} className="flex gap-3 border-b border-border pb-3"><span className="font-mono text-xs text-primary">—</span>{p}</li>
            ))}
          </ul>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
