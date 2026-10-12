import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { SERVICES } from "@/data/services";
import { INSTAGRAM } from "@/data/site";
import { WHATSAPP_URL, PHONE } from "@/data/content";

const INSTITUTIONAL = [
  { to: "/sobre", label: "Sobre" },
  { to: "/metodo", label: "Método" },
  { to: "/cases", label: "Cases" },
  { to: "/insights", label: "Insights" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink" data-testid="site-footer">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Logo className="h-10 w-auto" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-zinc-400">
              Estratégia de SEO, execução técnica e crescimento orientado por
              dados.
            </p>
            <p className="mt-6 font-display text-sm font-bold uppercase leading-relaxed tracking-tight text-paper">
              Não fazemos marketing.
              <br />
              <span className="text-acid">Executamos crescimento.</span>
            </p>
          </div>

          <div className="md:col-span-2">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-zinc-500">
              Institucional
            </p>
            <ul className="mt-5 space-y-3">
              {INSTITUTIONAL.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    data-testid={`footer-link-${l.label.toLowerCase()}`}
                    className="text-sm text-zinc-300 transition-colors hover:text-acid"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-zinc-500">
              Serviços
            </p>
            <ul className="mt-5 space-y-3">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link
                    to={`/servicos/${s.slug}`}
                    data-testid={`footer-service-${s.slug}`}
                    className="text-sm text-zinc-300 transition-colors hover:text-acid"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-zinc-500">
              Próximo passo
            </p>
            <p className="mt-5 text-sm leading-relaxed text-zinc-400">
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
                href={INSTAGRAM}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="footer-instagram"
                className="inline-flex items-center gap-2 text-zinc-300 transition-colors hover:text-acid"
              >
                @exekuta.agencia
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="footer-whatsapp-link"
                className="block text-zinc-300 transition-colors hover:text-acid"
              >
                {PHONE}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 select-none overflow-hidden" aria-hidden="true">
          <p className="text-outline whitespace-nowrap font-display text-[15vw] font-extrabold uppercase leading-none tracking-tight">
            EXEKUTA
          </p>
        </div>

        <div className="mt-6 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">
            © EXEKUTA — Todos os direitos reservados
          </p>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">
            Rio de Janeiro · Brasil
          </p>
        </div>
      </div>
    </footer>
  );
}
