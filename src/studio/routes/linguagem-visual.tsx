import { Link, useParams } from "../router";
import { SiteFooter } from "../components/site-header";


const blocks = [
  ["A", "Personagem e styling", "Evellyn Pereira. Figurino-base proposto: jaqueta oversized marrom-chocolate, top creme, calça preta ampla, tênis retrô de basquete, acessórios dourados. Proposta sujeita à aprovação. Imagens da protagonista: somente fotos autorizadas enviadas pela equipe."],
  ["B", "Locações", "Clínica de estética, sala criativa, estúdio de gravação e ambientes profissionais de beleza."],
  ["C", "Fotografia", "Planos gerais, planos médios, planos americanos, closes, macros, inserts, POV e OTS."],
  ["D", "Composição e câmera", "Travelling, dolly-in, tracking lateral, câmera na mão controlada, rack focus e cortes por movimento. Formato vertical 9:16."],
  ["E", "Iluminação", "Práticos quentes em bronze, sombras longas, contraste progressivo ao longo da semana — a luz se abre na revelação."],
  ["F", "Direção de arte", "Preto profundo, grafite, chocolate, bronze e creme. Superfícies foscas, metais dourados, materiais didáticos reais."],
  ["G", "Montagem e som", "Corte seco para preto ao fim de cada filme. Trilha eletrônica minimalista que cresce até o tema completo no Filme 05."],
];

const swatches = [
  ["Preto", "bg-background"],
  ["Grafite", "bg-graphite"],
  ["Chocolate", "bg-chocolate"],
  ["Bronze", "bg-bronze"],
  ["Creme", "bg-cream"],
];

export default function Visual() {
  return (
    <main className="pt-14">
      <section className="mx-auto max-w-7xl px-5 py-20">
        <p className="eyebrow">Direção de arte e fotografia</p>
        <h1 className="mt-4 font-display text-6xl sm:text-8xl">Visual <em className="text-primary">Language</em></h1>
        <div className="mt-14 grid grid-cols-5 border border-border">
          {swatches.map(([n, c]) => (
            <div key={n}>
              <div className={`${c} h-32 sm:h-48`} />
              <p className="eyebrow p-3">{n}</p>
            </div>
          ))}
        </div>
        <div className="mt-20 grid gap-px bg-border md:grid-cols-2">
          {blocks.map(([l, t, d]) => (
            <div key={l} className="bg-background p-8">
              <span className="font-display text-5xl text-primary">{l}</span>
              <h2 className="mt-4 font-display text-2xl">{t}</h2>
              <p className="mt-3 text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
