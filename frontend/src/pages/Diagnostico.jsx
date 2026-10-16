import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { ArrowRight, Loader2, ShieldCheck, Search, PlugZap } from "lucide-react";
import { Eyebrow, FadeIn, Reveal } from "@/components/ui-motions";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const CHALLENGE_OPTIONS = [
  "Baixa visibilidade orgânica",
  "Problemas técnicos",
  "Tráfego com pouca conversão",
  "Presença local",
  "Conteúdo e autoridade",
  "Mensuração e performance",
  "Outro cenário",
];

const SERVICE_OPTIONS = [
  { value: "", label: "Ainda não sei" },
  { value: "estrategia-seo", label: "Estratégia SEO" },
  { value: "seo-tecnico", label: "SEO Técnico" },
  { value: "seo-on-page", label: "SEO On-Page" },
  { value: "seo-local", label: "SEO Local" },
  { value: "autoridade-digital", label: "Autoridade Digital" },
  { value: "analytics-performance", label: "Analytics e Performance" },
];

const INVESTMENT_OPTIONS = [
  { value: "", label: "Selecione" },
  { value: "not-defined", label: "Ainda não defini" },
  { value: "conversation", label: "Prefiro alinhar em conversa" },
  { value: "project", label: "Projeto pontual — valor a confirmar" },
  { value: "continuous", label: "Acompanhamento contínuo — valor a confirmar" },
];

const initialForm = {
  nome: "",
  empresa: "",
  cargo: "",
  website: "",
  whatsapp: "",
  email: "",
  desafio: "",
  servico: "",
  investimento: "",
  mensagem: "",
  lgpd: false,
};

export default function Diagnostico() {
  const [form, setForm] = useState(initialForm);
  const [sending, setSending] = useState(false);

  const set = (key) => (e) =>
    setForm((f) => ({
      ...f,
      [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.lgpd) {
      toast.error("É necessário aceitar a Política de Privacidade.");
      return;
    }
    setSending(true);
    try {
      await axios.post(`${API}/diagnostico`, form);
      toast.success("Diagnóstico recebido. Vamos avaliar o cenário e indicar o próximo passo adequado.");
      setForm(initialForm);
    } catch (err) {
      toast.error("Não foi possível enviar agora. Tente novamente ou fale pelo WhatsApp.");
    } finally {
      setSending(false);
    }
  };

  const inputCls =
    "w-full rounded-xl border border-white/15 bg-card2 px-4 py-3.5 text-sm text-paper placeholder:text-muted outline-none transition-colors focus:border-acid";
  const labelCls = "mb-2 block font-mono text-[11px] uppercase tracking-[0.2em] text-muted";

  return (
    <div data-testid="diagnostico-page">
      <section className="relative overflow-hidden pb-14 pt-40 lg:pb-20 lg:pt-48">
        <div className="hero-grid absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <Eyebrow className="flex items-center gap-3">
              <span className="inline-block h-2 w-2 rounded-full bg-acid" />
              Diagnóstico SEO Exekuta
            </Eyebrow>
          </FadeIn>
          <h1 className="mt-7 font-display text-4xl font-extrabold uppercase tracking-tight leading-[0.98] sm:text-6xl">
            <span className="block overflow-hidden">
              <FadeIn delay={0.15}>Diagnóstico antes</FadeIn>
            </span>
            <span className="block overflow-hidden">
              <FadeIn delay={0.3}>
                <span>de <span className="text-acid">proposta.</span></span>
              </FadeIn>
            </span>
          </h1>
          <FadeIn delay={0.5} className="mt-7 max-w-xl">
            <p className="text-base leading-relaxed text-muted sm:text-lg">
              Compartilhe contexto suficiente para orientar uma conversa inicial
              sobre visibilidade, técnica, conteúdo, conversão e mensuração.
            </p>
          </FadeIn>
          <FadeIn delay={0.65} className="mt-8 space-y-3">
            {[
              "Sem promessa de primeira posição",
              "Sem proposta genérica antes do cenário",
              "Dados usados apenas para retorno e qualificação",
            ].map((t) => (
              <p key={t} className="flex items-start gap-3 text-sm text-muted">
                <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-acid" />
                {t}
              </p>
            ))}
          </FadeIn>
          <FadeIn delay={0.8} className="mt-8 max-w-xl rounded-2xl border border-acid/25 bg-card2 p-6">
            <strong className="font-display text-base font-bold tracking-tight text-acid">O que acontece depois?</strong>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              As informações ajudam a avaliar aderência, pontos que precisam de
              esclarecimento e o próximo passo adequado.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <Reveal>
          <form onSubmit={onSubmit} data-testid="diagnostico-form" className="rounded-2xl border border-white/10 bg-card2 p-7 sm:p-10">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="d-nome" className={labelCls}>Nome *</label>
                <input id="d-nome" required minLength={2} value={form.nome} onChange={set("nome")} data-testid="diagnostico-input-nome" className={inputCls} placeholder="Seu nome" />
              </div>
              <div>
                <label htmlFor="d-empresa" className={labelCls}>Empresa *</label>
                <input id="d-empresa" required minLength={2} value={form.empresa} onChange={set("empresa")} data-testid="diagnostico-input-empresa" className={inputCls} placeholder="Nome da empresa" />
              </div>
              <div>
                <label htmlFor="d-cargo" className={labelCls}>Cargo ou função *</label>
                <input id="d-cargo" required minLength={2} value={form.cargo} onChange={set("cargo")} data-testid="diagnostico-input-cargo" className={inputCls} placeholder="Ex.: Diretor, Marketing" />
              </div>
              <div>
                <label htmlFor="d-website" className={labelCls}>Website *</label>
                <input id="d-website" type="url" required value={form.website} onChange={set("website")} data-testid="diagnostico-input-website" className={inputCls} placeholder="https://" />
              </div>
              <div>
                <label htmlFor="d-whatsapp" className={labelCls}>WhatsApp *</label>
                <input id="d-whatsapp" type="tel" required value={form.whatsapp} onChange={set("whatsapp")} data-testid="diagnostico-input-whatsapp" className={inputCls} placeholder="(00) 00000-0000" />
              </div>
              <div>
                <label htmlFor="d-email" className={labelCls}>E-mail *</label>
                <input id="d-email" type="email" required value={form.email} onChange={set("email")} data-testid="diagnostico-input-email" className={inputCls} placeholder="voce@empresa.com" />
              </div>
              <div>
                <label htmlFor="d-desafio" className={labelCls}>Principal desafio *</label>
                <select id="d-desafio" required value={form.desafio} onChange={set("desafio")} data-testid="diagnostico-select-desafio" className={inputCls}>
                  <option value="">Selecione</option>
                  {CHALLENGE_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="d-servico" className={labelCls}>Serviço de interesse</label>
                <select id="d-servico" value={form.servico} onChange={set("servico")} data-testid="diagnostico-select-servico" className={inputCls}>
                  {SERVICE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="d-investimento" className={labelCls}>Faixa de investimento</label>
                <select id="d-investimento" value={form.investimento} onChange={set("investimento")} data-testid="diagnostico-select-investimento" className={inputCls}>
                  {INVESTMENT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="d-mensagem" className={labelCls}>Mensagem *</label>
                <textarea id="d-mensagem" required minLength={20} maxLength={2000} rows={6} value={form.mensagem} onChange={set("mensagem")} data-testid="diagnostico-input-mensagem" className={`${inputCls} resize-none`} placeholder="Inclua contexto, objetivo e principais limitações. Máximo de 2.000 caracteres." />
              </div>
            </div>

            <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm text-muted" data-testid="diagnostico-lgpd-label">
              <input type="checkbox" checked={form.lgpd} onChange={set("lgpd")} data-testid="diagnostico-input-lgpd" className="mt-0.5 h-4 w-4 shrink-0 accent-[#B7FF00]" />
              Li a Política de Privacidade e concordo com o uso dos dados para retorno sobre esta solicitação. *
            </label>

            <button
              type="submit"
              disabled={sending}
              data-testid="diagnostico-submit-button"
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-acid px-8 py-4 text-sm font-bold uppercase tracking-wide text-ink transition-all duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {sending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  Enviar diagnóstico
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </Reveal>
      </section>

      <section className="border-t border-white/10 bg-surface py-20" data-testid="diagnostico-trust">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          {[
            { icon: ShieldCheck, title: "Privacidade", desc: "Consentimento explícito, política acessível e nenhuma credencial exposta no front-end." },
            { icon: Search, title: "Diagnóstico", desc: "O formulário qualifica contexto; não representa auditoria concluída ou proposta automática." },
            { icon: PlugZap, title: "Integração real", desc: "O envio grava sua solicitação no sistema e a equipe retorna com o próximo passo." },
          ].map(({ icon: Icon, title, desc }, i) => (
            <Reveal key={title} delay={i * 0.08} className="h-full">
              <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-ink p-8 transition-all duration-300 hover:border-acid/50">
                <Icon className="h-6 w-6 text-acid" />
                <h2 className="mt-6 font-display text-xl font-bold tracking-tight">{title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
