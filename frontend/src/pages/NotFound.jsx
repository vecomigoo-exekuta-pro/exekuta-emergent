import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/ui-motions";
import Seo from "@/components/Seo";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[80vh] flex-col items-center justify-center gap-6 px-6 pt-20 text-center" data-testid="not-found-page">
      <Seo title="Página não encontrada | EXEKUTA" description="A página solicitada não existe ou foi movida." path="/404" noindex />
      <Eyebrow>404</Eyebrow>
      <h1 className="font-display text-4xl font-extrabold uppercase tracking-tight sm:text-6xl">
        Página não <span className="text-acid">encontrada.</span>
      </h1>
      <p className="max-w-md text-muted">
        O endereço não existe ou foi movido. Volte ao início ou fale com a
        EXEKUTA sobre o seu cenário.
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
        <Link to="/" data-testid="not-found-home" className="inline-flex items-center gap-2 rounded-full bg-acid px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-ink transition-transform hover:scale-[1.04]">
          Voltar ao início
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link to="/contato" data-testid="not-found-contato" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold transition-colors hover:border-acid hover:text-acid">
          Falar com a EXEKUTA
        </Link>
      </div>
    </div>
  );
}
