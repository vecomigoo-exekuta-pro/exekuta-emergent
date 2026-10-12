import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Eyebrow, FadeIn, Reveal } from "@/components/ui-motions";
import PerformanceBoard from "@/components/PerformanceBoard";
import { CASES, CASE_DISCLAIMER, CASE_NOTE } from "@/data/cases";
import { CASE_CRITERIA } from "@/data/site";

export default function Cases() {
  return (
    <div data-testid="cases-page">
      <section className="relative overflow-hidden pb-14 pt-40 lg:pb-20 lg:pt-48">
        <div className="hero-grid absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-7">
            <FadeIn>
              <Eyebrow className="flex items-center gap-3">
                <span className="inline-block h-2 w-2 rounded-full bg-acid" />
                Cases e resultados
              </Eyebrow>
            </FadeIn>
            <h1 className="mt-7 font-display text-4xl font-extrabold uppercase tracking-tight leading-[0.98] sm:text-6xl">
              <span className="block overflow-hidden">
                <FadeIn delay={0.15}>Resultados só ganham valor</FadeIn>
              </span>
              <span className="block overflow-hidden">
                <FadeIn delay={0.3}>
                  <span>quando têm <span className="text-acid">contexto.</span></span>
                </FadeIn>
              </span>
            </h1>
            <FadeIn delay={0.5} className="mt-7 max-w-xl">
              <p className="text-base leading-relaxed text-zinc-400 sm:text-lg">
                Projetos autorizados informados pelo cliente como posicionados
                na primeira página do Google com técnicas de SEO de Alessandro
                Pimentel. As páginas individuais podem receber contexto,
                períodos e métricas detalhadas em uma próxima etapa.
              </p>
            </FadeIn>
            <FadeIn delay={0.65} className="mt-9 flex flex-wrap gap-4">
              <a href="#criterios" data-testid="cases-cta-criterios" className="inline-flex items-center gap-2 rounded-full bg-acid px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-ink transition-transform hover:scale-[1.04]">
                Conhecer critérios
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link to="/diagnostico" data-testid="cases-cta-diagnostico" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold transition-colors hover:border-acid hover:text-acid">
                Solicitar diagnóstico
              </Link>
            </FadeIn>
          </div>
          <FadeIn delay={0.35} className="lg:col-span-5">
            <PerformanceBoard id="cases" compact />
          </FadeIn>
        </div>
      </section>

      <section className="py-24 lg:py-32" id="criterios" data-testid="cases-criterios">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <Eyebrow>Critérios de publicação</Eyebrow>
            <h2 className="mt-4 max-w-2xl font-display text-3xl font-bold uppercase tracking-tight leading-[1.05] sm:text-4xl">
              Resultado sem contexto pode induzir à decisão errada.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {CASE_CRITERIA.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.07} className="h-full">
                <div className="flex h-full flex-col bg-ink p-7 transition-colors duration-300 hover:bg-card2">
                  <span className="text-outline font-display text-4xl font-extrabold">0{i + 1}</span>
                  <h3 className="mt-8 font-display text-lg font-bold tracking-tight">{c.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">{c.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-surface py-24 lg:py-32" data-testid="cases-grid">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <Eyebrow>Filtros e busca</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-bold uppercase tracking-tight leading-[1.05] sm:text-4xl">
              Projetos autorizados
            </h2>
            <p className="mt-5 max-w-3xl font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-zinc-600">
              {CASE_DISCLAIMER}
            </p>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {CASES.map((c, i) => (
              <Reveal key={c.slug} delay={(i % 4) * 0.07} className="h-full">
                <Link
                  to={`/cases/${c.slug}`}
                  data-testid={`case-card-${c.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink transition-all duration-300 hover:-translate-y-1 hover:border-acid/50"
                >
                  <div className="h-52 overflow-hidden border-b border-white/10 bg-surface">
                    <img
                      src={c.screenshot}
                      alt={`Captura do site ${c.name}, case real da EXEKUTA`}
                      className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <span className="w-fit rounded-full border border-acid/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-acid">
                      {c.name}
                    </span>
                    <h3 className="mt-4 font-display text-lg font-bold tracking-tight">{c.cardTitle}</h3>
                    <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-zinc-400">{c.lead}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-zinc-300 transition-colors group-hover:text-acid">
                      Ver case no portfólio
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24" data-testid="cases-cta">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <Reveal>
            <p className="max-w-2xl mx-auto font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-zinc-600">
              {CASE_NOTE}
            </p>
            <h2 className="mt-8 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-5xl">
              Seu negócio pode ser o <span className="text-acid">próximo case.</span>
            </h2>
            <Link to="/diagnostico" data-testid="cases-cta-final" className="mt-10 inline-flex items-center gap-2 rounded-full bg-acid px-8 py-4 text-sm font-bold uppercase tracking-wide text-ink transition-transform hover:scale-[1.04]">
              Solicitar diagnóstico
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
