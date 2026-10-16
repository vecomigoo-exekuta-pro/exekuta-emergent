import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { Eyebrow, FadeIn, Reveal, SectionHead } from "@/components/ui-motions";
import { useSiteData } from "@/cms/CmsContext";
import { VALUES, IMAGES } from "@/data/content";
import { PILLARS, INSTAGRAM } from "@/data/site";

export default function Sobre() {
  const { cms, about } = useSiteData();
  const hasOverride = !!cms.about;

  return (
    <div data-testid="sobre-page">
      <section className="relative overflow-hidden pb-14 pt-40 lg:pb-20 lg:pt-48">
        <div className="hero-grid absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-7">
            <FadeIn>
              <Eyebrow className="flex items-center gap-3">
                <span className="inline-block h-2 w-2 rounded-full bg-acid" />
                Sobre a Exekuta
              </Eyebrow>
            </FadeIn>
            <h1 className="mt-7 font-display text-4xl font-extrabold uppercase tracking-tight leading-[0.98] sm:text-6xl">
              <span className="block overflow-hidden">
                <FadeIn delay={0.15}>{about.sobreTitle1}</FadeIn>
              </span>
              <span className="block overflow-hidden">
                <FadeIn delay={0.3}>
                  {hasOverride ? (
                    <span className="text-acid">{about.sobreTitle2}</span>
                  ) : (
                    <span>
                      {about.sobreTitle2.split(" ").slice(0, -1).join(" ")}{" "}
                      <span className="text-acid">{about.sobreTitle2.split(" ").slice(-1)}</span>
                    </span>
                  )}
                </FadeIn>
              </span>
            </h1>
            <FadeIn delay={0.5} className="mt-7 max-w-xl">
              <p className="text-base leading-relaxed text-muted sm:text-lg">
                {about.sobreLead}
              </p>
            </FadeIn>
            <FadeIn delay={0.65} className="mt-9 flex flex-wrap gap-4">
              <Link to="/diagnostico" data-testid="sobre-cta-diagnostico" className="inline-flex items-center gap-2 rounded-full bg-acid px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-ink transition-transform hover:scale-[1.04]">
                Solicitar diagnóstico
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/metodo" data-testid="sobre-cta-metodo" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold transition-colors hover:border-acid hover:text-acid">
                Conhecer o método
              </Link>
            </FadeIn>
          </div>
          <FadeIn delay={0.35} className="lg:col-span-5">
            <div className="relative mx-auto max-w-sm rounded-3xl border border-white/10 bg-card2 p-10">
              <img src="/brand/logo-exekuta-angular.png" alt="Símbolo angular tridimensional da EXEKUTA" className="mx-auto w-full max-w-[260px]" />
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="py-24 lg:py-32" data-testid="sobre-nome">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-5">
            <SectionHead eyebrow="O nome" title={<>Exekuta é verbo:<br />direção que sai<br />do plano.</>} />
          </div>
          <div className="lg:col-span-7">
            <Reveal delay={0.1}>
              <p className="text-lg leading-relaxed text-muted">{about.nomeLead1}</p>
              <p className="mt-5 leading-relaxed text-muted">{about.nomeLead2}</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-surface py-24 lg:py-32" data-testid="sobre-posicionamento">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="Posicionamento"
            title={<>Visibilidade só tem valor<br className="hidden sm:block" /> quando encontra um objetivo.</>}
          />
          <Reveal delay={0.15}>
            <div className="mt-10 flex flex-wrap gap-3">
              {["Busca", "Relevância", "Experiência", "Oportunidade"].map((w) => (
                <span key={w} className="rounded-full border border-acid/35 px-6 py-3 font-display text-lg font-bold uppercase tracking-tight text-acid sm:text-xl">
                  {w}
                </span>
              ))}
            </div>
            <p className="mt-8 max-w-2xl text-muted">
              A EXEKUTA conecta SEO ao negócio. Cada página, correção ou
              conteúdo precisa ter papel definido dentro de uma arquitetura e de
              uma jornada.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-24 lg:py-32" data-testid="sobre-pilares">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHead eyebrow="Pilares" title="Estratégia, execução e resultados." />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {PILLARS.map((p, i) => (
              <Reveal key={p.num} delay={i * 0.1} className="h-full">
                <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-card2 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-acid/50">
                  <span className="text-outline font-display text-5xl font-extrabold">{p.num}</span>
                  <h3 className="mt-14 font-display text-2xl font-bold tracking-tight">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-surface py-24 lg:py-32" data-testid="sobre-valores">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHead eyebrow="Valores" title="Como a EXEKUTA opera." />
          <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 lg:grid-cols-3">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.05} className="h-full">
                <div className="flex h-full flex-col bg-ink p-8 transition-colors duration-300 hover:bg-card2">
                  <span className="font-mono text-xs tracking-[0.25em] text-acid">0{i + 1}</span>
                  <h3 className="mt-10 font-display text-xl font-bold tracking-tight sm:text-2xl">{v.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32" data-testid="sobre-ambiente">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <Eyebrow>Ambiente de trabalho</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-bold uppercase tracking-tight leading-[1.05] sm:text-4xl">
              Uma operação de SEO estruturada.
            </h2>
            <p className="mt-5 max-w-xl text-muted">
              A EXEKUTA funciona como uma operação estruturada que analisa,
              documenta, executa e acompanha — não como um template genérico de
              agência. O resultado é uma apresentação mais humana, corporativa e
              coerente com a rotina real.
            </p>
            <a
              href={INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="sobre-instagram-link"
              className="group mt-7 inline-flex items-center gap-2 text-sm font-semibold text-muted transition-colors hover:text-acid"
            >
              @exekuta.agencia
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
            </a>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <img src="/artwork/strategy-office-scene.svg" alt="Ilustração editorial de um escritório com reunião estratégica e dashboard" className="w-full" loading="lazy" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-24 lg:py-32" data-testid="sobre-fundador">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              <div className="relative overflow-hidden rounded-2xl border border-white/10">
                <img src={IMAGES.founder} alt="Alessandro Pimentel, CEO & Founder da EXEKUTA" className="aspect-[4/5] w-full object-cover grayscale" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                <p className="absolute bottom-5 left-5 font-mono text-[11px] uppercase tracking-[0.25em] text-acid">
                  CEO &amp; Founder
                </p>
              </div>
            </Reveal>
            <div className="lg:col-span-7">
              <SectionHead eyebrow="Fundador" title={<>Liderança com<br />direção de negócio.</>} />
              <Reveal delay={0.15}>
                <p className="mt-8 font-display text-2xl font-bold tracking-tight sm:text-3xl">Alessandro Pimentel</p>
                <p className="mt-2 font-mono text-xs uppercase tracking-[0.25em] text-muted">CEO &amp; Founder</p>
                <p className="mt-6 max-w-xl leading-relaxed text-muted">
                  {about.fundadorBio}
                </p>
                <div className="mt-8 space-y-3">
                  {["Diagnóstico com leitura técnica e comercial", "Execução acompanhada por indicadores", "Comunicação transparente em cada etapa"].map((item) => (
                    <p key={item} className="flex items-start gap-3 text-sm text-muted">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-acid" />
                      {item}
                    </p>
                  ))}
                </div>
                <Link to="/diagnostico" data-testid="sobre-fundador-cta" className="mt-10 inline-flex items-center gap-2 rounded-full bg-acid px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-ink transition-transform hover:scale-[1.04]">
                  Falar com a EXEKUTA
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
