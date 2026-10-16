import { useParams, Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Eyebrow, FadeIn, Reveal } from "@/components/ui-motions";
import { INSIGHTS } from "@/data/insights";

export default function ArtigoDetail() {
  const { slug } = useParams();
  const idx = INSIGHTS.findIndex((a) => a.slug === slug);
  const a = INSIGHTS[idx];

  if (!a) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 pt-20 text-center" data-testid="artigo-not-found">
        <Eyebrow>404</Eyebrow>
        <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight sm:text-5xl">
          Artigo não encontrado.
        </h1>
        <Link to="/insights" data-testid="artigo-not-found-back" className="inline-flex items-center gap-2 rounded-full bg-acid px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-ink">
          Ver todos os insights
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const related = INSIGHTS.filter((x) => x.slug !== a.slug);

  return (
    <div data-testid="artigo-page">
      <header className="relative overflow-hidden pb-14 pt-40 lg:pt-48">
        <div className="hero-grid absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
          <FadeIn>
            <Link to="/insights" data-testid="artigo-back-link" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:text-acid">
              ← Insights
            </Link>
          </FadeIn>
          <FadeIn delay={0.1} className="mt-10">
            <Eyebrow>{a.category}</Eyebrow>
          </FadeIn>
          <h1 className="mt-6 font-display text-3xl font-extrabold uppercase tracking-tight leading-[1.05] sm:text-5xl">
            <span className="block overflow-hidden">
              <FadeIn delay={0.2}>{a.title}</FadeIn>
            </span>
          </h1>
          <FadeIn delay={0.45} className="mt-7">
            <p className="text-lg leading-relaxed text-muted">{a.lead}</p>
          </FadeIn>
          <FadeIn delay={0.55} className="mt-6 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            <span>Por EXEKUTA</span>
            <span className="text-acid">/</span>
            <span>{a.date}</span>
            <span className="text-acid">/</span>
            <span>{a.readTime}</span>
          </FadeIn>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-20 sm:px-6 lg:grid-cols-12 lg:px-8">
        <aside className="lg:col-span-4">
          <Reveal>
            <div className="rounded-2xl border border-white/10 bg-card2 p-7 lg:sticky lg:top-32">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-acid">Sumário</p>
              <ol className="mt-5 space-y-3">
                {a.sections.map((s, i) => (
                  <li key={s.id} className="flex gap-3 text-sm text-muted">
                    <span className="font-mono text-xs text-acid">{String(i + 1).padStart(2, "0")}</span>
                    <a href={`#${s.id}`} className="transition-colors hover:text-acid">
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
              <Link
                to="/diagnostico"
                data-testid="artigo-toc-cta"
                className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-acid px-6 py-3 text-sm font-bold uppercase tracking-wide text-ink transition-transform hover:scale-[1.03]"
              >
                Solicitar diagnóstico
              </Link>
            </div>
          </Reveal>
        </aside>

        <div className="lg:col-span-8">
          {a.sections.map((s) => (
            <Reveal key={s.id}>
              <section id={s.id} className="scroll-mt-28 border-t border-white/10 py-10 first:border-t-0 first:pt-2" data-testid={`artigo-secao-${s.id}`}>
                <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{s.title}</h2>
                {s.paras.map((p, i) => (
                  <p key={i} className={`mt-5 leading-relaxed ${i === 0 ? "text-muted" : "text-muted"}`}>
                    {p}
                  </p>
                ))}
              </section>
            </Reveal>
          ))}

          <Reveal>
            <div className="mt-6 rounded-2xl border border-acid/25 bg-card2 p-8">
              <Eyebrow>Aplicação responsável</Eyebrow>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                As recomendações dependem de contexto, acesso, capacidade de
                implementação e dados. Nenhum conteúdo deste site representa
                garantia de posição ou resultado.
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      <section className="border-t border-white/10 bg-surface py-20" data-testid="artigo-relacionados">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <Eyebrow>Leituras relacionadas</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">
              Continue a investigação.
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {related.map((r, i) => (
              <Reveal key={r.slug} delay={i * 0.08} className="h-full">
                <Link
                  to={`/insights/${r.slug}`}
                  data-testid={`artigo-relacionado-${r.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-white/10 bg-ink p-7 transition-all duration-300 hover:-translate-y-1 hover:border-acid/50"
                >
                  <span className="w-fit rounded-full border border-white/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                    {r.category}
                  </span>
                  <h3 className="mt-5 font-display text-xl font-bold leading-snug tracking-tight transition-colors group-hover:text-acid">
                    {r.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{r.excerpt}</p>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.15}>
            <Link to="/diagnostico" data-testid="artigo-cta" className="mt-12 inline-flex items-center gap-2 rounded-full bg-acid px-8 py-4 text-sm font-bold uppercase tracking-wide text-ink transition-transform hover:scale-[1.04]">
              Transformar conceito em um plano para o seu cenário
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
