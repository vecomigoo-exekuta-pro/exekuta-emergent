import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Eyebrow, FadeIn, Reveal } from "@/components/ui-motions";
import PlansSection from "@/components/PlansSection";
import { useSiteData } from "@/cms/CmsContext";
import Seo from "@/components/Seo";

const SITE = "https://www.exekuta.com.br";

const toNumber = (preco) => {
  const n = parseFloat(String(preco || "").replace(/[^\d,]/g, "").replace(/\./g, "").replace(",", "."));
  return Number.isFinite(n) && n > 0 ? n : null;
};

export default function PlanosSeo() {
  const { planos } = useSiteData();
  const plans = Array.isArray(planos) ? planos : [];

  const offers = plans.map((p) => {
    const price = toNumber(p.preco);
    return {
      "@type": "Offer",
      name: `Plano ${p.nome}`,
      ...(price ? { price, priceCurrency: "BRL" } : {}),
      url: `${SITE}/planos-seo`,
      itemOffered: {
        "@type": "Service",
        name: `Gestão de sites com SEO — ${p.nome}`,
        provider: { "@id": `${SITE}/#org` },
        areaServed: "Rio de Janeiro e região metropolitana",
      },
    };
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "OfferCatalog",
        name: "Planos de Gestão de Sites com SEO",
        url: `${SITE}/planos-seo`,
        itemListElement: offers,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: "Planos de SEO", item: `${SITE}/planos-seo` },
        ],
      },
    ],
  };

  return (
    <div data-testid="planos-seo-page">
      <Seo
        title="Planos de Gestão de Sites com SEO | EXEKUTA"
        description="Planos de gestão de sites com SEO: auditoria técnica, SEO técnico, conteúdo, link building, AEO/GEO e relatórios periódicos de métricas e posicionamento."
        path="/planos-seo"
        jsonLd={jsonLd}
      />

      <section className="relative overflow-hidden pb-14 pt-40 lg:pb-20 lg:pt-48">
        <div className="hero-grid absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <Eyebrow className="flex items-center gap-3">
              <span className="inline-block h-2 w-2 rounded-full bg-acid" />
              Planos · EXEKUTA
            </Eyebrow>
          </FadeIn>
          <h1 className="mt-7 max-w-3xl font-display text-4xl font-extrabold uppercase tracking-tight leading-[0.98] sm:text-6xl">
            <span className="block overflow-hidden">
              <FadeIn delay={0.15}>Gestão de sites</FadeIn>
            </span>
            <span className="block overflow-hidden">
              <FadeIn delay={0.3}>
                <span>
                  com SEO, <span className="text-acid">plano a plano.</span>
                </span>
              </FadeIn>
            </span>
          </h1>
          <FadeIn delay={0.5} className="mt-7 max-w-2xl">
            <p className="text-base leading-relaxed text-muted sm:text-lg">
              Quatro formatos de gestão de sites com SEO — do diagnóstico
              técnico à otimização para IA e buscas generativas. Escolha o
              nível de operação e evolua conforme os resultados.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="pb-24 lg:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <PlansSection detailed />
          <Reveal>
            <p className="mt-10 max-w-3xl text-sm leading-relaxed text-muted">
              A gestão é mensal e contínua: cada ciclo combina execução técnica,
              conteúdo e mensuração. O escopo exato do seu plano é combinado na
              proposta, a partir do diagnóstico da sua operação.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-white/10 py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <Reveal>
            <h2 className="font-display text-3xl font-extrabold uppercase tracking-tight sm:text-5xl">
              Não sabe qual <span className="text-acid">plano escolher?</span>
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-muted">
              Comece pelo diagnóstico. A auditoria técnica inicial mostra onde
              o seu site perde visibilidade e indica o nível de operação adequado.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link to="/diagnostico" data-testid="planos-cta-diagnostico" className="inline-flex items-center gap-2 rounded-full bg-acid px-8 py-4 text-sm font-bold uppercase tracking-wide text-ink transition-transform hover:scale-[1.04]">
                Solicitar diagnóstico
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/analise-seo" data-testid="planos-cta-analise" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-8 py-4 text-sm font-semibold transition-colors hover:border-acid hover:text-acid">
                Analisar meu site
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
