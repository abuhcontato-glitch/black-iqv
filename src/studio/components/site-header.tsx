import { Link } from "../router";

const nav = [
  { to: "/", label: "Campanha" },
  { to: "/filmes", label: "Filmes" },
  { to: "/linguagem-visual", label: "Visual" },
  { to: "/producao", label: "Produção" },
] as const;

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5">
        <Link to="/" className="font-display text-sm tracking-[0.3em]">
          BLACK IQV
        </Link>
        <nav className="flex gap-4 sm:gap-8">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="eyebrow transition-colors hover:text-foreground data-[status=active]:text-primary"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border px-5 py-12">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 sm:flex-row">
        <p className="font-display text-lg">BLACK IQV — DIRECTOR'S CUT</p>
        <p className="eyebrow">Uma produção ABUHSCA para E3 Marketing</p>
      </div>
    </footer>
  );
}
