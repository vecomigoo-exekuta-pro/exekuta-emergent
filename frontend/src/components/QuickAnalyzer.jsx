import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const DOMAIN_RE = /^(?!-)[a-z0-9-]+(\.[a-z0-9-]+)+$/i;

export default function QuickAnalyzer({ compact = false }) {
  const navigate = useNavigate();
  const [site, setSite] = useState("");
  const [error, setError] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    let value = site.trim().replace(/^https?:\/\//i, "").replace(/\/.*$/, "");
    if (!DOMAIN_RE.test(value)) {
      setError(true);
      return;
    }
    setError(false);
    navigate(`/analise-seo?site=${encodeURIComponent(value)}`);
  };

  return (
    <div
      className={`rounded-2xl border border-acid/25 bg-card2 backdrop-blur-xl ${
        compact ? "p-6" : "p-7 sm:p-9"
      }`}
      data-testid="quick-analyzer"
    >
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-acid">Análise SEO gratuita</p>
      {!compact && (
        <h2 className="mt-4 font-display text-2xl font-bold tracking-tight leading-tight sm:text-3xl">
          Descubra o que está limitando seu site no Google.
        </h2>
      )}
      <form onSubmit={onSubmit} className="mt-6" data-testid="quick-analyzer-form">
        <label htmlFor="analyzer-site" className="mb-2 block font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          Digite seu domínio
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="analyzer-site"
            type="text"
            inputMode="url"
            autoComplete="url"
            value={site}
            onChange={(e) => {
              setSite(e.target.value);
              setError(false);
            }}
            placeholder="exemplo.com.br"
            data-testid="quick-analyzer-input"
            className="w-full rounded-xl border border-white/15 bg-ink px-4 py-3.5 text-sm text-paper placeholder:text-muted outline-none transition-colors focus:border-acid"
          />
          <button
            type="submit"
            data-testid="quick-analyzer-submit"
            className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-acid px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-ink transition-transform duration-300 hover:scale-[1.03]"
          >
            Analisar meu site
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        </div>
        {error && (
          <p className="mt-3 text-sm text-[#FF4D67]" data-testid="quick-analyzer-error">
            Informe um domínio ou URL HTTP/HTTPS válido.
          </p>
        )}
      </form>
      <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
        Análise rápida • 1 página • técnico + on-page • sem cadastro
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {["Técnica", "Conteúdo", "Arquitetura", "Indexação"].map((c) => (
          <span
            key={c}
            className="rounded-full border border-acid/30 px-3 py-1.5 text-xs font-semibold text-acid"
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}
