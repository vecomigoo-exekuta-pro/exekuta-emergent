import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Eyebrow, FadeIn, Reveal, SectionHead } from "@/components/ui-motions";
import { VALUES, METHOD, IMAGES } from "@/data/content";

export default function Sobre() {
  return (
    <div data-testid="sobre-page">
      <section className="relative overflow-hidden pb-16 pt-40 lg:pb-24 lg:pt-48">
        <div className="hero-grid absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <Eyebrow className="flex items-center gap-3">
              <span className="inline-block h-2 w-2 rounded-full bg-acid" />
              Sobre a EXEKUTA
            </Eyebrow>
          </FadeIn>
          <h1 className="mt-8 font-display text-4xl font-extrabold tracking-tight leading-[0.98] sm:text-6xl lg:text-7xl">
            <span className="block overflow-hidden">
              <FadeIn delay={0.15}>
                <span>Estratégia que</span>
              </FadeIn>
            </span>
            <span className="block overflow-hidden">
              <FadeIn delay={0.3}>
                <span>sai do <span className="text-acid">plano.</span></span>
              </FadeIn>
            </span>
          </h1>
          <FadeIn delay={0.5} className="mt-8 max-w-xl">
            <p className="text-base leading-relaxed text-zinc-400 sm:text-lg">
              A EXEKUTA une análise profunda, execução técnica e
              acompanhamento responsável para transformar visibilidade em
              crescimento com direção.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-24 lg:py-36" data-testid="sobre-valores">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHead eyebrow="Valores" title="Como a EXEKUTA opera." />
          <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 lg:grid-cols-3">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.06} className="h-full">
                <div className="flex h-full flex-col bg-ink p-8 transition-colors duration-300 hover:bg-card2">
                  <span className="font-mono text-xs tracking-[0.25em] text-acid">
                    0{i + 1}
                  </span>
                  <h3 className="mt-10 font-display text-xl font-bold tracking-tight sm:text-2xl">
                    {v.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-surface py-24 lg:py-36" data-testid="sobre-metodo">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionHead
                eyebrow="Método"
                title={<>Um ciclo para<br />analisar, executar<br />e evoluir.</>}
              />
              <Reveal delay={0.15}>
                <p className="mt-6 max-w-xs text-sm leading-relaxed text-zinc-400">
                  Uma sequência que organiza investigação, decisão,
                  implementação, leitura e escala — evitando esforço sem
                  direção.
                </p>
              </Reveal>
            </div>
            <div className="lg:col-span-8">
              {METHOD.map((m, i) => (
                <Reveal key={m.num} delay={i * 0.06}>
                  <div className="flex items-start gap-6 border-b border-white/10 py-8 sm:gap-10">
                    <span className="text-outline font-display text-4xl font-extrabold sm:text-5xl">
                      {m.num}
                    </span>
                    <div>
                      <h3 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
                        {m.title}
                      </h3>
                      <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-400">
                        {m.desc}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-36" data-testid="sobre-fundador">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-14 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              <div className="relative overflow-hidden rounded-2xl border border-white/10">
                <img
                  src={IMAGES.founder}
                  alt="Alessandro Pimentel, CEO & Founder da EXEKUTA"
                  className="aspect-[4/5] w-full object-cover grayscale"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-acid">
                    CEO &amp; Founder
                  </p>
                </div>
              </div>
            </Reveal>
            <div className="lg:col-span-7">
              <SectionHead eyebrow="Fundador" title={<>Liderança com<br />direção de negócio.</>} />
              <Reveal delay={0.15}>
                <p className="mt-8 font-display text-2xl font-bold tracking-tight sm:text-3xl">
                  Alessandro Pimentel
                </p>
                <p className="mt-2 font-mono text-xs uppercase tracking-[0.25em] text-zinc-500">
                  CEO &amp; Founder
                </p>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-400">
                  À frente da EXEKUTA, Alessandro une análise profunda,
                  execução técnica e acompanhamento responsável — uma
                  abordagem que conecta SEO ao negócio, garantindo que cada
                  ação tenha um papel definido dentro de uma arquitetura e
                  jornada.
                </p>
                <Link
                  to="/contato"
                  data-testid="sobre-fundador-cta"
                  className="group mt-10 inline-flex items-center gap-2 rounded-full bg-acid px-7 py-3.5 text-sm font-semibold text-ink transition-transform duration-300 hover:scale-[1.04]"
                >
                  Falar com a EXEKUTA
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
