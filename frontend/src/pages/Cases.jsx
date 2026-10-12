import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Eyebrow, FadeIn, Reveal } from "@/components/ui-motions";
import { CASES } from "@/data/cases";
import { WHATSAPP_URL } from "@/data/content";

export default function Cases() {
  return (
    <div data-testid="cases-page">
      <section className="relative overflow-hidden pb-16 pt-40 lg:pb-24 lg:pt-48">
        <div className="hero-grid absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <Eyebrow className="flex items-center gap-3">
              <span className="inline-block h-2 w-2 rounded-full bg-acid" />
              Cases
            </Eyebrow>
          </FadeIn>
          <h1 className="mt-8 font-display text-4xl font-extrabold tracking-tighter leading-[0.98] sm:text-6xl lg:text-7xl">
            <span className="block overflow-hidden">
              <FadeIn delay={0.15}>
                <span>Posições ocupadas,</span>
              </FadeIn>
            </span>
            <span className="block overflow-hidden">
              <FadeIn delay={0.3}>
                <span className="text-acid">não promessas.</span>
              </FadeIn>
            </span>
          </h1>
          <FadeIn delay={0.5} className="mt-8 max-w-xl">
            <p className="text-base leading-relaxed text-zinc-400 sm:text-lg">
              Marcas que construíram presença orgânica com estrutura, conteúdo
              e direção — em segmentos diferentes, com o mesmo método.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-28 sm:px-6 lg:px-8" data-testid="cases-grid">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CASES.map((c, i) => (
            <Reveal key={c.slug} delay={(i % 4) * 0.08} className="h-full">
              <Link
                to={`/cases/${c.slug}`}
                data-testid={`case-card-${c.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-white/10 bg-card2 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-acid/50"
              >
                <div className="flex items-start justify-between">
                  <span className="font-display text-5xl font-extrabold tracking-tighter text-paper transition-colors duration-300 group-hover:text-acid">
                    {c.name.charAt(0)}
                  </span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition-all duration-300 group-hover:rotate-45 group-hover:border-acid group-hover:text-acid">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
                <h2 className="mt-16 font-display text-xl font-bold tracking-tight">
                  {c.name}
                </h2>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-acid">
                  {c.segment}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-zinc-400">{c.desc}</p>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-20 flex flex-col items-center gap-6 rounded-2xl border border-white/10 bg-surface p-10 text-center">
            <p className="max-w-lg font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Seu negócio pode ser o próximo case.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="cases-cta-whatsapp"
                className="inline-flex items-center gap-2 rounded-full bg-acid px-7 py-3.5 text-sm font-semibold text-ink transition-transform duration-300 hover:scale-[1.04]"
              >
                Solicitar diagnóstico
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
