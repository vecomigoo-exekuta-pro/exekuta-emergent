import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Search } from "lucide-react";
import { Eyebrow, FadeIn, Reveal, SectionHead } from "@/components/ui-motions";
import PerformanceBoard from "@/components/PerformanceBoard";
import { useSiteData } from "@/cms/CmsContext";
import { FULL_CATALOG } from "@/data/services";
import { CHALLENGES } from "@/data/site";

export default function Servicos() {
  const { services } = useSiteData();
  return (
    <div data-testid="servicos-page">
      <section className="relative overflow-hidden pb-14 pt-40 lg:pb-20 lg:pt-48">
        <div className="hero-grid absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-7">
            <FadeIn>
              <Eyebrow className="flex items-center gap-3">
                <span className="inline-block h-2 w-2 rounded-full bg-acid" />
                Serviços de SEO
              </Eyebrow>
            </FadeIn>
            <h1 className="mt-7 font-display text-4xl font-extrabold uppercase tracking-tight leading-[0.98] sm:text-6xl">
              <span className="block overflow-hidden">
                <FadeIn delay={0.15}>SEO conectado ao seu</FadeIn>
              </span>
              <span className="block overflow-hidden">
                <FadeIn delay={0.3}>
                  <span>principal <span className="text-acid">desafio.</span></span>
                </FadeIn>
              </span>
            </h1>
            <FadeIn delay={0.5} className="mt-7 max-w-xl">
              <p className="text-base leading-relaxed text-zinc-400 sm:text-lg">
                A melhor solução não começa pelo nome do serviço. Começa pelo
                problema, pelo impacto e pela capacidade de execução. Use o
                orientador abaixo para identificar a frente mais relacionada ao
                seu cenário.
              </p>
            </FadeIn>
            <FadeIn delay={0.65} className="mt-9 flex flex-wrap gap-4">
              <a href="#orientador" data-testid="servicos-cta-orientador" className="inline-flex items-center gap-2 rounded-full bg-acid px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-ink transition-transform hover:scale-[1.04]">
                Encontrar meu ponto de partida
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link to="/diagnostico" data-testid="servicos-cta-diagnostico" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold transition-colors hover:border-acid hover:text-acid">
                Solicitar diagnóstico
              </Link>
            </FadeIn>
          </div>
          <FadeIn delay={0.35} className="lg:col-span-5">
            <PerformanceBoard id="servicos" compact />
          </FadeIn>
        </div>
      </section>

      <section className="py-24 lg:py-32" id="orientador" data-testid="servicos-orientador">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="Orientador"
            title={<>Qual é o seu<br className="hidden sm:block" /> principal desafio?</>}
          />
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-xl text-zinc-400">
              Selecione a situação mais próxima do momento atual. A recomendação
              é inicial e não substitui diagnóstico.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CHALLENGES.map((c, i) => (
              <Reveal key={c.to} delay={i * 0.06} className="h-full">
                <Link
                  to={c.to}
                  data-testid={`servicos-desafio-${i}`}
                  className="group flex h-full items-center justify-between gap-4 rounded-2xl border border-white/10 bg-card2 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-acid/50"
                >
                  <span className="font-display text-base font-bold tracking-tight transition-colors group-hover:text-acid sm:text-lg">
                    {c.label}
                  </span>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 transition-all duration-300 group-hover:rotate-45 group-hover:border-acid group-hover:text-acid">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-surface py-24 lg:py-32" data-testid="servicos-grid">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHead eyebrow="Frentes de SEO" title="Da direção estratégica à melhoria contínua." />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <Reveal key={s.slug} delay={(i % 3) * 0.08} className="h-full">
                <Link
                  to={`/servicos/${s.slug}`}
                  data-testid={`servicos-card-${s.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink p-7 transition-all duration-300 hover:-translate-y-1 hover:border-acid/50"
                >
                  <div className="-mx-7 -mt-7 mb-6 h-36 overflow-hidden border-b border-white/10">
                    <img
                      src={s.image}
                      alt={`Serviço ${s.name} — EXEKUTA`}
                      className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-xs tracking-[0.25em] text-acid">{s.num || String(i + 1).padStart(2, "0")}</span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition-all duration-300 group-hover:rotate-45 group-hover:border-acid group-hover:text-acid">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                  <h3 className="mt-8 font-display text-xl font-bold tracking-tight">{s.name}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-400">{s.card}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-zinc-300 transition-colors group-hover:text-acid">
                    Conhecer serviço
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32" data-testid="servicos-catalogo">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="Visão completa"
            title="Operação digital além do SEO."
          />
          <div className="mt-14 space-y-16">
            {FULL_CATALOG.map((cat) => (
              <div key={cat.id} className="grid gap-10 lg:grid-cols-12" data-testid={`servicos-categoria-${cat.id}`}>
                <div className="lg:col-span-4">
                  <Reveal>
                    <div className="lg:sticky lg:top-32">
                      <span className="text-outline font-display text-6xl font-extrabold">{cat.num}</span>
                      <h3 className="mt-6 font-display text-2xl font-bold tracking-tight sm:text-3xl">{cat.title}</h3>
                      <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.22em] text-acid">{cat.tagline}</p>
                      <img
                        src={cat.image}
                        alt={`Serviços de ${cat.title} — EXEKUTA`}
                        className="mt-7 h-40 w-full max-w-xs rounded-2xl border border-white/10 object-cover grayscale transition-all duration-500 hover:grayscale-0"
                        loading="lazy"
                      />
                    </div>
                  </Reveal>
                </div>
                <div className="lg:col-span-8">
                  <div className="grid gap-5 sm:grid-cols-2">
                    {cat.items.map((item, i) => (
                      <Reveal key={item.title} delay={i * 0.06} className="h-full">
                        <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-card2 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-acid/50">
                          <h4 className="font-display text-lg font-bold tracking-tight">{item.title}</h4>
                          <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-400">{item.desc}</p>
                          <Link
                            to="/diagnostico"
                            data-testid={`servicos-item-cta-${cat.id}-${i}`}
                            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-zinc-300 transition-colors hover:text-acid"
                          >
                            Solicitar proposta
                            <ArrowUpRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 py-24" data-testid="servicos-cta">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <Reveal>
            <h2 className="font-display text-3xl font-extrabold uppercase tracking-tight sm:text-5xl">
              Não sabe por onde começar?
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-zinc-400">
              O diagnóstico define onde competir, por quê e em qual ordem.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link to="/diagnostico" data-testid="servicos-cta-final" className="inline-flex items-center gap-2 rounded-full bg-acid px-8 py-4 text-sm font-bold uppercase tracking-wide text-ink transition-transform hover:scale-[1.04]">
                Solicitar diagnóstico
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/analise-seo" data-testid="servicos-cta-analyzer" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-8 py-4 text-sm font-semibold transition-colors hover:border-acid hover:text-acid">
                <Search className="h-4 w-4" />
                Analisar meu site
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
