import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Eyebrow, FadeIn, Reveal } from "@/components/ui-motions";
import { CASES } from "@/data/cases";
import { WHATSAPP_URL } from "@/data/content";

function Block({ num, title, children }) {
  return (
    <Reveal>
      <div className="grid gap-8 border-t border-white/10 py-12 lg:grid-cols-12 lg:py-16">
        <div className="lg:col-span-3">
          <span className="text-outline font-display text-5xl font-extrabold">{num}</span>
          <h2 className="mt-4 font-display text-2xl font-bold tracking-tight">{title}</h2>
        </div>
        <div className="lg:col-span-8 lg:col-start-5">{children}</div>
      </div>
    </Reveal>
  );
}

export default function CaseDetail() {
  const { slug } = useParams();
  const idx = CASES.findIndex((c) => c.slug === slug);
  const c = CASES[idx];

  if (!c) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 pt-20 text-center" data-testid="case-not-found">
        <Eyebrow>404</Eyebrow>
        <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-5xl">
          Case não encontrado.
        </h1>
        <Link
          to="/cases"
          data-testid="case-not-found-back"
          className="inline-flex items-center gap-2 rounded-full bg-acid px-7 py-3.5 text-sm font-semibold text-ink"
        >
          Ver todos os cases
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const next = CASES[(idx + 1) % CASES.length];
  const num = String(idx + 1).padStart(2, "0");

  return (
    <div data-testid="case-detail-page">
      <section className="relative overflow-hidden pb-14 pt-40 lg:pb-20 lg:pt-48">
        <div className="hero-grid absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <Link
              to="/cases"
              data-testid="case-back-link"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-zinc-400 transition-colors hover:text-acid"
            >
              <ArrowLeft className="h-4 w-4" />
              Todos os cases
            </Link>
          </FadeIn>

          <div className="mt-10 flex flex-wrap items-end justify-between gap-6">
            <div>
              <FadeIn delay={0.1}>
                <Eyebrow className="flex items-center gap-3">
                  <span className="inline-block h-2 w-2 rounded-full bg-acid" />
                  Case {num} — {c.segment}
                </Eyebrow>
              </FadeIn>
              <h1 className="mt-6 font-display text-5xl font-extrabold tracking-tight leading-[0.95] sm:text-7xl">
                <span className="block overflow-hidden">
                  <FadeIn delay={0.2}>{c.name}</FadeIn>
                </span>
              </h1>
            </div>
            <span
              aria-hidden="true"
              className="text-outline hidden font-display text-8xl font-extrabold leading-none sm:block"
            >
              {num}
            </span>
          </div>

          <FadeIn delay={0.4} className="mt-8 max-w-2xl">
            <p className="text-base leading-relaxed text-zinc-400 sm:text-lg">{c.desc}</p>
          </FadeIn>

          <FadeIn delay={0.55} className="mt-8 flex flex-wrap gap-2.5">
            {c.servicos.map((s) => (
              <span
                key={s}
                className="rounded-full border border-white/15 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-300"
              >
                {s}
              </span>
            ))}
            {c.domain && (
              <span className="rounded-full border border-acid/40 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-acid">
                {c.domain}
              </span>
            )}
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8" data-testid="case-body">
        <Block num="01" title="Desafio">
          <p className="text-base leading-relaxed text-zinc-300 sm:text-lg">{c.desafio}</p>
        </Block>

        <Block num="02" title="Solução">
          <p className="text-base leading-relaxed text-zinc-300 sm:text-lg">{c.solucao}</p>
          <p className="mt-6 border-l-2 border-acid pl-5 text-sm leading-relaxed text-zinc-400">
            {c.execucao}
          </p>
        </Block>

        <Block num="03" title="Resultados">
          <p className="font-display text-2xl font-bold tracking-tight leading-tight sm:text-4xl">
            {c.resultado.split("primeira página do Google")[0]}
            <span className="text-acid">primeira página do Google</span>
            {c.resultado.split("primeira página do Google")[1]}
          </p>
          <p className="mt-6 text-sm leading-relaxed text-zinc-500">
            Métricas publicadas somente quando autorizadas pelo cliente — com
            fonte, período e contexto suficientes para verificação.
          </p>
          <a
            href={c.url}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="case-original-link"
            className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-zinc-300 transition-colors hover:text-acid"
          >
            Ver publicação original
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
          </a>
        </Block>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8" data-testid="case-next">
        <Reveal>
          <Link
            to={`/cases/${next.slug}`}
            data-testid="case-next-link"
            className="group flex items-center justify-between gap-6 rounded-2xl border border-white/10 bg-card2 p-8 transition-all duration-300 hover:border-acid/50 sm:p-12"
          >
            <div>
              <Eyebrow>Próximo case</Eyebrow>
              <p className="mt-4 font-display text-3xl font-extrabold tracking-tight transition-colors group-hover:text-acid sm:text-5xl">
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
            <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-5xl">
              Seu negócio pode ser<br className="hidden sm:block" /> o próximo <span className="text-acid">case.</span>
            </h2>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/contato"
                data-testid="case-cta-diagnostico"
                className="inline-flex items-center gap-2 rounded-full bg-acid px-8 py-4 text-sm font-semibold text-ink transition-transform duration-300 hover:scale-[1.04]"
              >
                Solicitar diagnóstico
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="case-cta-whatsapp"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-8 py-4 text-sm font-semibold transition-colors hover:border-acid hover:text-acid"
              >
                WhatsApp direto
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
