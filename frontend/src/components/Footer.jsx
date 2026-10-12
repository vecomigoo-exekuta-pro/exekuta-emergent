import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { SERVICES, WHATSAPP_URL, PHONE } from "@/data/content";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/servicos", label: "Serviços" },
  { to: "/sobre", label: "Sobre" },
  { to: "/cases", label: "Cases" },
  { to: "/insights", label: "Insights" },
  { to: "/contato", label: "Contato" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink" data-testid="footer">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-zinc-400">
              Agência de SEO orientada por dados. Estratégia, execução técnica e
              acompanhamento responsável para transformar visibilidade em
              crescimento com direção.
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="footer-whatsapp-link"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:border-acid hover:text-acid"
            >
              {PHONE}
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          <div className="md:col-span-3">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-zinc-500">
              Navegação
            </p>
            <ul className="mt-5 space-y-3">
              {NAV.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    data-testid={`footer-link-${l.label.toLowerCase().replace(" ", "-")}`}
                    className="text-sm text-zinc-300 transition-colors hover:text-acid"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-zinc-500">
              Serviços
            </p>
            <ul className="mt-5 space-y-3">
              {SERVICES.map((s) => (
                <li key={s.id}>
                  <Link
                    to="/servicos"
                    data-testid={`footer-service-${s.id}`}
                    className="text-sm text-zinc-300 transition-colors hover:text-acid"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 select-none overflow-hidden" aria-hidden="true">
          <p className="text-outline whitespace-nowrap font-display text-[16vw] font-extrabold leading-none tracking-tighter">
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
