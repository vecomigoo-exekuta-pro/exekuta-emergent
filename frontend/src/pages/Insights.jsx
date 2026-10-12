import { ArrowUpRight } from "lucide-react";
import { Eyebrow, FadeIn, Reveal } from "@/components/ui-motions";
import { INSIGHTS, IMAGES } from "@/data/content";

export default function Insights() {
  return (
    <div data-testid="insights-page">
      <section className="relative overflow-hidden pb-16 pt-40 lg:pb-24 lg:pt-48">
        <div className="hero-grid absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <Eyebrow className="flex items-center gap-3">
              <span className="inline-block h-2 w-2 rounded-full bg-acid" />
              Insights
            </Eyebrow>
          </FadeIn>
          <h1 className="mt-8 font-display text-4xl font-extrabold tracking-tighter leading-[0.98] sm:text-6xl lg:text-7xl">
            <span className="block overflow-hidden">
              <FadeIn delay={0.15}>
                <span>Leitura de cenário,</span>
              </FadeIn>
            </span>
            <span className="block overflow-hidden">
              <FadeIn delay={0.3}>
                <span className="text-acid">em texto.</span>
              </FadeIn>
            </span>
          </h1>
          <FadeIn delay={0.5} className="mt-8 max-w-xl">
            <p className="text-base leading-relaxed text-zinc-400 sm:text-lg">
              Artigos técnicos e estratégicos sobre SEO, performance e
              crescimento orgânico — direto da operação da EXEKUTA.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-28 sm:px-6 lg:px-8" data-testid="insights-list">
        <div className="border-t border-white/10">
          {INSIGHTS.map((a, i) => (
            <Reveal key={a.url} delay={i * 0.08}>
              <a
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                data-testid={`insights-artigo-${i}`}
                className="group grid items-center gap-6 border-b border-white/10 py-10 transition-colors duration-300 hover:bg-white/[0.03] sm:grid-cols-12 sm:px-4"
              >
                <span className="font-mono text-sm tracking-[0.25em] text-acid sm:col-span-1">
                  0{i + 1}
                </span>
                <div className="sm:col-span-7">
                  <h2 className="font-display text-xl font-bold tracking-tight transition-colors group-hover:text-acid sm:text-3xl">
                    {a.title}
                  </h2>
                  <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                    {a.category} · {a.author}
                  </p>
                </div>
                <div className="hidden overflow-hidden rounded-xl border border-white/10 sm:col-span-3 sm:block">
                  <img
                    src={[IMAGES.analytics2, IMAGES.analytics3, IMAGES.studio2][i % 3]}
                    alt=""
                    className="aspect-[16/9] w-full object-cover grayscale transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 transition-all duration-300 group-hover:rotate-45 group-hover:border-acid group-hover:text-acid sm:col-span-1">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
