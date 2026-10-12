import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Search } from "lucide-react";
import { Eyebrow, FadeIn, Reveal } from "@/components/ui-motions";
import PerformanceBoard from "@/components/PerformanceBoard";
import { INSIGHTS } from "@/data/insights";

const FILTERS = ["Todos", "Estratégia SEO", "SEO Técnico", "SEO Local"];

export default function Insights() {
  const [filter, setFilter] = useState("Todos");
  const [query, setQuery] = useState("");

  const list = INSIGHTS.filter((a) => {
    const byCat = filter === "Todos" || a.category === filter;
    const byQuery =
      !query.trim() ||
      `${a.title} ${a.excerpt} ${a.category}`.toLowerCase().includes(query.toLowerCase());
    return byCat && byQuery;
  });

  return (
    <div data-testid="insights-page">
      <section className="relative overflow-hidden pb-14 pt-40 lg:pb-20 lg:pt-48">
        <div className="hero-grid absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-7">
            <FadeIn>
              <Eyebrow className="flex items-center gap-3">
                <span className="inline-block h-2 w-2 rounded-full bg-acid" />
                Insights Exekuta
              </Eyebrow>
            </FadeIn>
            <h1 className="mt-7 font-display text-4xl font-extrabold uppercase tracking-tight leading-[0.98] sm:text-6xl">
              <span className="block overflow-hidden">
                <FadeIn delay={0.15}>Conteúdo para decidir</FadeIn>
              </span>
              <span className="block overflow-hidden">
                <FadeIn delay={0.3}>
                  <span>e executar <span className="text-acid">melhor.</span></span>
                </FadeIn>
              </span>
            </h1>
            <FadeIn delay={0.5} className="mt-7 max-w-xl">
              <p className="text-base leading-relaxed text-zinc-400 sm:text-lg">
                Análises e guias para equipes que precisam tomar decisões
                melhores sobre estratégia, técnica, conteúdo, presença local e
                mensuração.
              </p>
            </FadeIn>
            <FadeIn delay={0.65} className="mt-9">
              <Link to="/diagnostico" data-testid="insights-cta-diagnostico" className="inline-flex items-center gap-2 rounded-full bg-acid px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-ink transition-transform hover:scale-[1.04]">
                Solicitar diagnóstico
                <ArrowRight className="h-4 w-4" />
              </Link>
            </FadeIn>
          </div>
          <FadeIn delay={0.35} className="lg:col-span-5">
            <PerformanceBoard id="insights" compact />
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-28 sm:px-6 lg:px-8" id="conteudos" data-testid="insights-list">
        <Reveal>
          <div className="flex flex-col gap-6 border-y border-white/10 py-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Eyebrow>Biblioteca</Eyebrow>
              <h2 className="mt-3 font-display text-2xl font-bold uppercase tracking-tight sm:text-3xl">
                Busque por tema ou problema.
              </h2>
            </div>
            <div className="relative w-full max-w-sm">
              <label htmlFor="insight-search" className="mb-2 block font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                Buscar nos insights
              </label>
              <Search className="pointer-events-none absolute bottom-3.5 left-4 h-4 w-4 text-zinc-600" />
              <input
                id="insight-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ex.: rastreamento, estratégia, local"
                data-testid="insights-search-input"
                className="w-full rounded-xl border border-white/15 bg-card2 py-3.5 pl-11 pr-4 text-sm text-paper placeholder:text-zinc-600 outline-none transition-colors focus:border-acid"
              />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-8 flex flex-wrap gap-3" role="group" aria-label="Filtrar artigos por categoria">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                data-testid={`insights-filter-${f.toLowerCase().replace(/\s+/g, "-")}`}
                aria-pressed={filter === f}
                className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                  filter === f
                    ? "border-acid bg-acid text-ink"
                    : "border-white/20 text-zinc-300 hover:border-acid hover:text-acid"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </Reveal>

        {list.length === 0 ? (
          <p className="mt-16 text-center text-zinc-500" data-testid="insights-empty">
            Nenhum insight encontrado para essa busca.
          </p>
        ) : (
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {list.map((a, i) => (
              <Reveal key={a.slug} delay={(i % 3) * 0.08} className="h-full">
                <Link
                  to={`/insights/${a.slug}`}
                  data-testid={`insights-card-${a.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-white/10 bg-card2 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-acid/50"
                >
                  <span className="w-fit rounded-full border border-acid/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-acid">
                    {a.category}
                  </span>
                  <h3 className="mt-5 font-display text-xl font-bold leading-snug tracking-tight transition-colors group-hover:text-acid">
                    {a.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-400">{a.excerpt}</p>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-600">
                      {a.readTime}
                    </span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 transition-all duration-300 group-hover:rotate-45 group-hover:border-acid group-hover:text-acid">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
