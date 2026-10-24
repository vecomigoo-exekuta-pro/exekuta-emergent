import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { Reveal, SectionHead } from "@/components/ui-motions";
import { useSiteData } from "@/cms/CmsContext";

function PlanCard({ plan, detailed }) {
  const items = Array.isArray(plan.entregas) ? plan.entregas : [];
  const visible = detailed ? items : items.slice(0, 3);
  const rest = items.length - visible.length;

  return (
    <Reveal className="h-full">
      <div
        className={`flex h-full flex-col rounded-3xl border p-7 transition-all duration-300 hover:-translate-y-1 ${
          plan.destaque
            ? "border-acid/60 bg-card2 shadow-[0_0_40px_rgba(183,255,0,0.12)]"
            : "border-white/10 bg-card2 hover:border-acid/35"
        }`}
        data-testid={`plan-card-${plan.id}`}
      >
        {plan.destaque && (
          <span className="mb-4 inline-flex w-fit items-center rounded-full bg-acid px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink" data-testid={`plan-destaque-${plan.id}`}>
            Destaque
          </span>
        )}
        <h3 className="font-display text-2xl font-extrabold uppercase tracking-tight text-paper">{plan.nome}</h3>
        <p className="mt-2 font-display text-xl font-bold text-acid" data-testid={`plan-price-${plan.id}`}>{plan.preco}</p>

        <ul className="mt-6 flex-1 space-y-3" data-testid={`plan-deliverables-${plan.id}`}>
          {visible.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-muted">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-acid" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {!detailed && rest > 0 && (
          <Link to="/planos-seo" className="mt-4 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-acid transition-colors hover:text-paper" data-testid={`plan-more-${plan.id}`}>
            + {rest} {rest === 1 ? "entrega" : "entregas"} no plano completo
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}

        <Link
          to="/contato"
          data-testid={`plan-cta-${plan.id}`}
          className={`mt-7 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold uppercase tracking-wide transition-transform hover:scale-[1.03] ${
            plan.destaque ? "bg-acid text-ink" : "border border-white/25 text-paper hover:border-acid hover:text-acid"
          }`}
        >
          Solicitar proposta
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </Reveal>
  );
}

export default function PlansSection({ detailed = false }) {
  const { planos } = useSiteData();
  const plans = Array.isArray(planos) ? planos : [];

  if (plans.length === 0) return null;

  return (
    <div data-testid={detailed ? "planos-detailed" : "planos-resumo"}>
      {!detailed && (
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead
            eyebrow="Planos · Gestão de sites com SEO"
            title="Planos de gestão de sites com SEO."
          />
          <Reveal>
            <Link
              to="/planos-seo"
              data-testid="planos-ver-detalhes"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-semibold transition-colors hover:border-acid hover:text-acid"
            >
              Ver detalhes
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      )}
      <div className={`mt-12 ${detailed ? "grid gap-6 sm:grid-cols-2" : "grid gap-5 sm:grid-cols-2 lg:grid-cols-4"}`}>
        {plans.map((p) => (
          <PlanCard key={p.id || p.nome} plan={p} detailed={detailed} />
        ))}
      </div>
    </div>
  );
}
