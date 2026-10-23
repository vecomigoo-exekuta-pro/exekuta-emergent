import { useParams, Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Eyebrow, FadeIn, Reveal } from "@/components/ui-motions";
import PerformanceBoard from "@/components/PerformanceBoard";
import { useSiteData } from "@/cms/CmsContext";
import { SERVICES } from "@/data/services";
import Seo from "@/components/Seo";

const SERVICE_META = {
  "estrategia-seo": {
    title: "Estratégia SEO: Diagnóstico e Priorização | EXEKUTA",
    description: "Defina onde competir e por quê: diagnóstico de SEO, pesquisa de oportunidades e um plano de prioridades executável para o seu negócio.",
  },
  "seo-tecnico": {
    title: "Otimização de Sites e SEO Técnico | EXEKUTA",
    description: "Melhore a estrutura, a velocidade, a indexação e o desempenho orgânico do seu site com uma estratégia técnica de SEO.",
  },
  "seo-on-page": {
    title: "SEO On-Page: Otimização de Páginas | EXEKUTA",
    description: "Alinhe conteúdo, estrutura semântica e intenção de busca para que cada página responda melhor ao Google e à jornada do cliente.",
  },
  "seo-local": {
    title: "SEO Local no Rio de Janeiro | EXEKUTA",
    description: "Fortaleça a presença da sua empresa nas buscas locais com estratégias de SEO local, otimização de páginas e relevância regional.",
  },
  "autoridade-digital": {
    title: "Autoridade Digital: Conteúdo e Reputação | EXEKUTA",
    description: "Construa autoridade com conteúdo relevante, reputação consistente e aquisição ética de relevância para o seu mercado.",
  },
  "analytics-performance": {
    title: "Analytics e Performance de Sites | EXEKUTA",
    description: "Monitore indicadores, entenda perdas e priorize testes: mensuração conectada a objetivos reais de crescimento.",
  },
};

export default function ServicoDetail() {
  const { slug } = useParams();
  const { services } = useSiteData();
  const s = services.find((x) => x.slug === slug);

  if (!s) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 pt-20 text-center" data-testid="servico-not-found">
        <Seo noindex title="Serviço não encontrado | EXEKUTA" description="A página de serviço solicitada não existe." path={`/servicos/${slug}`} />
        <Eyebrow>404</Eyebrow>
        <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight sm:text-5xl">
          Serviço não encontrado.
        </h1>
        <Link to="/servicos" data-testid="servico-not-found-back" className="inline-flex items-center gap-2 rounded-full bg-acid px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-ink">
          Ver todos os serviços
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const meta = SERVICE_META[s.slug] || { title: `${s.name} | EXEKUTA`, description: s.card };

  return (
    <div data-testid="servico-detail-page">
      <Seo title={meta.title} description={meta.description} path={`/servicos/${s.slug}`} />
      <section className="relative overflow-hidden pb-14 pt-40 lg:pb-20 lg:pt-48">
        <div className="hero-grid absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <Link to="/servicos" data-testid="servico-back-link" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:text-acid">
              ← Todos os serviços
            </Link>
          </FadeIn>
          <FadeIn delay={0.1} className="mt-10">
            <Eyebrow className="flex items-center gap-3">
              <span className="inline-block h-2 w-2 rounded-full bg-acid" />
              {s.tag}
            </Eyebrow>
          </FadeIn>
          <h1 className="mt-6 max-w-4xl font-display text-4xl font-extrabold uppercase tracking-tight leading-[0.98] sm:text-6xl">
            <span className="block overflow-hidden">
              <FadeIn delay={0.2}>{s.h1}</FadeIn>
            </span>
          </h1>
          <FadeIn delay={0.45} className="mt-7 max-w-2xl">
            <p className="text-base leading-relaxed text-muted sm:text-lg">{s.lead}</p>
          </FadeIn>
          <FadeIn delay={0.6} className="mt-9 flex flex-wrap gap-4">
            <Link to="/diagnostico" data-testid="servico-detail-cta" className="inline-flex items-center gap-2 rounded-full bg-acid px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-ink transition-transform hover:scale-[1.04]">
              Solicitar diagnóstico
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#problema" data-testid="servico-detail-problema-link" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold transition-colors hover:border-acid hover:text-acid">
              Entender a frente
            </a>
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <img
              src={s.image}
              alt={`Serviço ${s.name} — EXEKUTA`}
              className="h-64 w-full object-cover grayscale sm:h-80"
              loading="lazy"
            />
          </div>
        </Reveal>
      </section>

      <section className="py-24 lg:py-32" id="problema" data-testid="servico-problema">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-5">
            <Reveal>
              <Eyebrow>O problema</Eyebrow>
              <h2 className="mt-4 font-display text-3xl font-bold uppercase tracking-tight leading-[1.05] sm:text-4xl">
                Antes de otimizar, é preciso entender o que está impedindo a evolução.
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <Reveal delay={0.1}>
              <p className="text-lg leading-relaxed text-muted">{s.problemLead}</p>
              <p className="mt-5 leading-relaxed text-muted">{s.problemRest}</p>
              <div className="mt-10">
                <PerformanceBoard id={`servico-${s.slug}`} compact />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-surface py-24 lg:py-32" data-testid="servico-outros">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <Eyebrow>Outras frentes</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-bold uppercase tracking-tight leading-[1.05] sm:text-4xl">
              Cada frente resolve um tipo de barreira.
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.filter((x) => x.slug !== s.slug).map((o, i) => (
              <Reveal key={o.slug} delay={(i % 3) * 0.07} className="h-full">
                <Link
                  to={`/servicos/${o.slug}`}
                  data-testid={`servico-outro-${o.slug}`}
                  className="group flex h-full items-center justify-between gap-4 rounded-2xl border border-white/10 bg-ink p-6 transition-all duration-300 hover:-translate-y-1 hover:border-acid/50"
                >
                  <span className="font-display text-base font-bold tracking-tight transition-colors group-hover:text-acid">{o.name}</span>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 transition-all duration-300 group-hover:rotate-45 group-hover:border-acid group-hover:text-acid">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24" data-testid="servico-cta">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <Reveal>
            <h2 className="font-display text-3xl font-extrabold uppercase tracking-tight sm:text-5xl">
              Não fazemos marketing. <span className="text-acid">Executamos crescimento.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-muted">
              Comece com um diagnóstico que considere objetivo, capacidade,
              dependências e critérios de acompanhamento.
            </p>
            <Link to="/diagnostico" data-testid="servico-cta-final" className="mt-10 inline-flex items-center gap-2 rounded-full bg-acid px-8 py-4 text-sm font-bold uppercase tracking-wide text-ink transition-transform hover:scale-[1.04]">
              Solicitar diagnóstico
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
