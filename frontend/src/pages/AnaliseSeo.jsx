import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import { ArrowRight, CheckCircle2, AlertTriangle, XCircle, Search, Loader2 } from "lucide-react";
import { Eyebrow, FadeIn, Reveal } from "@/components/ui-motions";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const STATUS_META = {
  ok: { icon: CheckCircle2, cls: "text-[#60FF8B]", label: "Ok" },
  warning: { icon: AlertTriangle, cls: "text-[#FFD600]", label: "Atenção" },
  critical: { icon: XCircle, cls: "text-[#FF4D67]", label: "Crítico" },
};

export default function AnaliseSeo() {
  const [params, setParams] = useSearchParams();
  const site = params.get("site") || "";
  const [input, setInput] = useState(site);
  const [state, setState] = useState({ status: "idle", result: null, error: "" });

  const analyze = async (value) => {
    if (!value.trim()) return;
    setState({ status: "loading", result: null, error: "" });
    try {
      const { data } = await axios.post(`${API}/seo/analyze`, { site: value });
      setState({ status: "done", result: data, error: "" });
    } catch (err) {
      setState({
        status: "error",
        result: null,
        error: err?.response?.data?.detail || "Não foi possível analisar o site agora. Tente novamente.",
      });
    }
  };

  useEffect(() => {
    if (site) {
      setInput(site);
      analyze(site);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [site]);

  const onSubmit = (e) => {
    e.preventDefault();
    setParams({ site: input.trim() });
  };

  const score = state.result?.score ?? 0;
  const scoreColor = score >= 80 ? "#60FF8B" : score >= 50 ? "#FFD600" : "#FF4D67";

  return (
    <div data-testid="analise-seo-page">
      <section className="relative overflow-hidden pb-14 pt-40 lg:pb-20 lg:pt-48">
        <div className="hero-grid absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
          <FadeIn>
            <Eyebrow className="flex items-center gap-3">
              <span className="inline-block h-2 w-2 rounded-full bg-acid" />
              Análise SEO gratuita
            </Eyebrow>
          </FadeIn>
          <h1 className="mt-7 font-display text-4xl font-extrabold uppercase tracking-tight leading-[0.98] sm:text-6xl">
            <span className="block overflow-hidden">
              <FadeIn delay={0.15}>Descubra o que está</FadeIn>
            </span>
            <span className="block overflow-hidden">
              <FadeIn delay={0.3}>
                <span>limitando seu <span className="text-acid">site.</span></span>
              </FadeIn>
            </span>
          </h1>
          <FadeIn delay={0.5} className="mt-7">
            <p className="max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              Análise rápida de uma página: verificação técnica, on-page e de
              indexação — relatório na hora, sem cadastro.
            </p>
          </FadeIn>
          <FadeIn delay={0.65} className="mt-9">
            <form onSubmit={onSubmit} data-testid="analise-form" className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                inputMode="url"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="exemplo.com.br"
                data-testid="analise-input"
                className="w-full rounded-xl border border-white/15 bg-card2 px-4 py-4 text-sm text-paper placeholder:text-muted outline-none transition-colors focus:border-acid"
              />
              <button
                type="submit"
                disabled={state.status === "loading"}
                data-testid="analise-submit"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-acid px-7 py-4 text-sm font-bold uppercase tracking-wide text-ink transition-transform hover:scale-[1.03] disabled:opacity-60"
              >
                {state.status === "loading" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    Analisar
                  </>
                )}
              </button>
            </form>
            {state.status === "error" && (
              <p className="mt-4 text-sm text-[#FF4D67]" data-testid="analise-error">
                {state.error}
              </p>
            )}
          </FadeIn>
        </div>
      </section>

      {state.status === "done" && state.result && (
        <section className="mx-auto max-w-7xl px-4 pb-28 sm:px-6 lg:px-8" data-testid="analise-result">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Reveal>
                <div className="rounded-2xl border border-white/10 bg-card2 p-8 text-center">
                  <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">Score on-page</p>
                  <div className="relative mx-auto mt-6 h-44 w-44">
                    <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                      <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(245,247,245,0.08)" strokeWidth="10" />
                      <circle
                        cx="60"
                        cy="60"
                        r="52"
                        fill="none"
                        stroke={scoreColor}
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={`${(score / 100) * 327} 327`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <strong className="font-display text-5xl font-extrabold" style={{ color: scoreColor }}>
                        {score}
                      </strong>
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">/ 100</span>
                    </div>
                  </div>
                  <p className="mt-6 break-all font-mono text-xs text-muted">{state.result.url}</p>
                  <Link
                    to="/diagnostico"
                    data-testid="analise-cta-diagnostico"
                    className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-acid px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-ink transition-transform hover:scale-[1.03]"
                  >
                    Solicitar diagnóstico
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <p className="mt-5 font-mono text-[10px] uppercase leading-relaxed tracking-[0.14em] text-muted">
                    Análise automatizada e inicial — não substitui diagnóstico completo.
                  </p>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-8">
              <Reveal delay={0.1}>
                <div className="overflow-hidden rounded-2xl border border-white/10">
                  {state.result.checks.map((c, i) => {
                    const meta = STATUS_META[c.status];
                    const Icon = meta.icon;
                    return (
                      <div
                        key={c.id}
                        data-testid={`analise-check-${c.id}`}
                        className={`flex items-start gap-4 bg-card2 p-5 ${i > 0 ? "border-t border-white/10" : ""}`}
                      >
                        <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${meta.cls}`} />
                        <div className="min-w-0">
                          <p className="font-display text-base font-bold tracking-tight">
                            {c.label}
                            <span className={`ml-3 font-mono text-[10px] uppercase tracking-[0.18em] ${meta.cls}`}>
                              {meta.label}
                            </span>
                          </p>
                          <p className="mt-1 truncate text-sm text-muted">{c.detail}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {state.status !== "done" && (
        <section className="mx-auto max-w-4xl px-4 pb-28 sm:px-6" data-testid="analise-placeholder">
          <Reveal>
            <div className="rounded-2xl border border-dashed border-white/15 bg-card2 p-12 text-center">
              <Search className="mx-auto h-8 w-8 text-acid" />
              <p className="mt-5 font-display text-xl font-bold tracking-tight">
                O relatório aparece aqui após a análise.
              </p>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
                Digite um domínio acima para verificar títulos, descrições,
                estrutura de headings, imagens, indexação e mais — em segundos.
              </p>
            </div>
          </Reveal>
        </section>
      )}
    </div>
  );
}
