import { useParams, Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Eyebrow, FadeIn, Reveal } from "@/components/ui-motions";
import { useSiteData } from "@/cms/CmsContext";
import { CASE_NOTE, CASE_DISCLAIMER, CASE_RESULT } from "@/data/cases";

export default function CaseDetail() {
  const { slug } = useParams();
  const { cases } = useSiteData();
  const idx = cases.findIndex((c) => c.slug === slug);
  const c = cases[idx];

  if (!c) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 pt-20 text-center" data-testid="case-not-found">
        <Eyebrow>404</Eyebrow>
        <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight sm:text-5xl">
          Case não encontrado.
        </h1>
        <Link to="/cases" data-testid="case-not-found-back" className="inline-flex items-center gap-2 rounded-full bg-acid px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-ink">
          Ver todos os cases
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const next = cases[(idx + 1) % cases.length];

  return (
    <div data-testid="case-detail-page">
      <section className="relative overflow-hidden pb-14 pt-40 lg:pb-20 lg:pt-48">
        <div className="hero-grid absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <Link to="/cases" data-testid="case-back-link" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-zinc-400 transition-colors hover:text-acid">
              ← Todos os cases
            </Link>
          </FadeIn>
          <FadeIn delay={0.1} className="mt-10">
            <Eyebrow className="flex items-center gap-3">
              <span className="inline-block h-2 w-2 rounded-full bg-acid" />
              Case {c.domain ? `• ${c.domain}` : ""}
            </Eyebrow>
          </FadeIn>
          <h1 className="mt-6 max-w-4xl font-display text-3xl font-extrabold uppercase tracking-tight leading-[1.02] sm:text-5xl lg:text-6xl">
            <span className="block overflow-hidden">
              <FadeIn delay={0.2}>{c.h1 || `${c.name}: case de SEO.`}</FadeIn>
            </span>
          </h1>
          <FadeIn delay={0.45} className="mt-7 max-w-2xl">
            <p className="text-base leading-relaxed text-zinc-400 sm:text-lg">{c.lead}</p>
          </FadeIn>
          <FadeIn delay={0.6} className="mt-9 flex flex-wrap gap-4">
            {c.visitUrl && (
              <a href={c.visitUrl} target="_blank" rel="noopener noreferrer" data-testid="case-visit-link" className="inline-flex items-center gap-2 rounded-full bg-acid px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-ink transition-transform hover:scale-[1.04]">
                Visitar projeto
                <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
            <Link to="/cases" data-testid="case-all-link" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold transition-colors hover:border-acid hover:text-acid">
              Ver todos os cases
            </Link>
          </FadeIn>
          <FadeIn delay={0.7}>
            <p className="mt-8 max-w-2xl font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-zinc-600">
              {CASE_NOTE}
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <Reveal>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4" data-testid="case-facts">
            {[
              ["Domínio", c.domain || "—"],
              ["Segmento", c.segment],
              ["Frentes de SEO", c.frentesLabel],
              ["Resultado informado", CASE_RESULT],
            ].map(([k, v]) => (
              <div key={k} className="bg-surface px-6 py-5">
                <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">{k}</span>
                <strong className="mt-2 block font-display text-base font-bold leading-snug tracking-tight text-paper">{v}</strong>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8" data-testid="case-contexto">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <Eyebrow>01 • Contexto</Eyebrow>
              <h2 className="mt-4 font-display text-3xl font-bold uppercase tracking-tight leading-[1.05] sm:text-4xl">
                O que este projeto apresenta.
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <Reveal delay={0.1}>
              <p className="text-lg leading-relaxed text-zinc-300">{c.contexto}</p>
              <p className="mt-5 leading-relaxed text-zinc-400">{CASE_DISCLAIMER}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {c.frentes && c.frentes.length > 0 && (
        <section className="border-y border-white/10 bg-surface py-24 lg:py-32" data-testid="case-frentes">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <Eyebrow>02 • Frentes de SEO</Eyebrow>
              <h2 className="mt-4 max-w-2xl font-display text-3xl font-bold uppercase tracking-tight leading-[1.05] sm:text-4xl">
                Como a estrutura se conecta à busca e ao negócio.
              </h2>
              <p className="mt-5 max-w-2xl text-zinc-400">
                As frentes abaixo descrevem aspectos visíveis e compatíveis com o
                projeto fornecido, sem extrapolar dados de execução que ainda não
                foram documentados.
              </p>
            </Reveal>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {c.frentes.map((f, i) => (
                <Reveal key={`${f.title}-${i}`} delay={i * 0.1} className="h-full">
                  <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-ink p-8 transition-all duration-300 hover:-translate-y-1 hover:border-acid/50">
                    <span className="font-mono text-xs tracking-[0.25em] text-acid">0{i + 1}</span>
                    <h3 className="mt-10 font-display text-xl font-bold tracking-tight">{f.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-400">{f.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {c.screenshot && (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8" data-testid="case-visual">
          <Reveal>
            <figure className="overflow-hidden rounded-2xl border border-white/10 bg-card2">
              <img src={c.screenshot} alt={`Captura do site ${c.name}, projeto incluído no portfólio da EXEKUTA`} className="max-h-[560px] w-full object-cover object-top sm:object-top" loading="lazy" />
              <figcaption className="border-t border-white/10 px-6 py-4 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-600">
                Imagem do projeto fornecida para composição do portfólio. O recorte visual não representa métricas de desempenho.
              </figcaption>
            </figure>
          </Reveal>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8" data-testid="case-next">
        <Reveal>
          <Link
            to={`/cases/${next.slug}`}
            data-testid="case-next-link"
            className="group flex items-center justify-between gap-6 rounded-2xl border border-white/10 bg-card2 p-8 transition-all duration-300 hover:border-acid/50 sm:p-12"
          >
            <div>
              <Eyebrow>Próximo case</Eyebrow>
              <p className="mt-4 font-display text-3xl font-extrabold uppercase tracking-tight transition-colors group-hover:text-acid sm:text-5xl">
                {next.name}
              </p>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                {next.segment}
              </p>
            </div>
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/20 transition-all duration-300 group-hover:rotate-45 group-hover:border-acid group-hover:text-acid">
              <ArrowUpRight className="h-5 w-5" />
            </span>
          </Link>
        </Reveal>
      </section>

      <section className="border-t border-white/10 py-24" data-testid="case-cta">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <Reveal>
            <h2 className="font-display text-3xl font-extrabold uppercase tracking-tight sm:text-5xl">
              Seu negócio pode ser o <span className="text-acid">próximo case.</span>
            </h2>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link to="/diagnostico" data-testid="case-cta-diagnostico" className="inline-flex items-center gap-2 rounded-full bg-acid px-8 py-4 text-sm font-bold uppercase tracking-wide text-ink transition-transform hover:scale-[1.04]">
                Solicitar diagnóstico
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/analise-seo" data-testid="case-cta-analyzer" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-8 py-4 text-sm font-semibold transition-colors hover:border-acid hover:text-acid">
                Analisar meu site
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
