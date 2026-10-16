import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useSiteData } from "@/cms/CmsContext";
import { SERVICES } from "@/data/services";

const INSTITUTIONAL = [
  { to: "/sobre", label: "Sobre" },
  { to: "/metodo", label: "Método" },
  { to: "/cases", label: "Cases" },
  { to: "/insights", label: "Insights" },
];

export default function Footer() {
  const { footer } = useSiteData();
  return (
    <footer className="border-t border-white/10 bg-ink" data-testid="site-footer">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Logo footer className="h-10 w-auto" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">
              {footer.institutionalText}
            </p>
            <p className="mt-6 font-display text-sm font-bold uppercase leading-relaxed tracking-tight text-paper">
              {footer.signatureLine1}
              <br />
              <span className="text-acid">{footer.signatureLine2}</span>
            </p>
          </div>

          <div className="md:col-span-2">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
              Institucional
            </p>
            <ul className="mt-5 space-y-3">
              {INSTITUTIONAL.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    data-testid={`footer-link-${l.label.toLowerCase()}`}
                    className="text-sm text-muted transition-colors hover:text-acid"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
              Serviços
            </p>
            <ul className="mt-5 space-y-3">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link
                    to={`/servicos/${s.slug}`}
                    data-testid={`footer-service-${s.slug}`}
                    className="text-sm text-muted transition-colors hover:text-acid"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
              Próximo passo
            </p>
            <p className="mt-5 text-sm leading-relaxed text-muted">
              Apresente o seu cenário para uma conversa inicial orientada por
              diagnóstico.
            </p>
            <Link
              to="/diagnostico"
              data-testid="footer-cta-diagnostico"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-acid px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-ink transition-transform hover:scale-[1.04]"
            >
              Iniciar diagnóstico
              <ArrowRight className="h-4 w-4" />
            </Link>
            <div className="mt-6 space-y-2 text-sm">
              <a
                href={footer.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="footer-instagram"
                className="inline-flex items-center gap-2 text-muted transition-colors hover:text-acid"
              >
                @exekuta.agencia
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
              {footer.email && (
                <a
                  href={`mailto:${footer.email}`}
                  data-testid="footer-email-link"
                  className="block text-muted transition-colors hover:text-acid"
                >
                  {footer.email}
                </a>
              )}
              <a
                href={footer.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="footer-whatsapp-link"
                className="block text-muted transition-colors hover:text-acid"
              >
                {footer.phone}
              </a>
              <p className="text-muted" data-testid="footer-address">
                {footer.address}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 select-none overflow-hidden" aria-hidden="true">
          <p className="text-outline whitespace-nowrap font-display text-[15vw] font-extrabold uppercase leading-none tracking-tight">
            EXEKUTA
          </p>
        </div>

        <div className="mt-6 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            {footer.copyright}
          </p>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            {footer.address}
          </p>
        </div>
      </div>
    </footer>
  );
}
