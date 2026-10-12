import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { ArrowRight, ArrowUpRight, Check, Loader2 } from "lucide-react";
import { Eyebrow, FadeIn, Reveal } from "@/components/ui-motions";
import { LogoMark } from "@/components/Logo";
import { WHATSAPP_URL } from "@/data/content";
import { INSTAGRAM } from "@/data/site";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const initialForm = {
  nome: "",
  email: "",
  whatsapp: "",
  empresa: "",
  mensagem: "",
  lgpd: false,
};

export default function Contato() {
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
      await axios.post(`${API}/contato`, form);
      toast.success("Mensagem recebida. Vamos entender o seu cenário e retornar em seguida.");
      setForm(initialForm);
    } catch (err) {
      toast.error("Não foi possível enviar agora. Tente pelo WhatsApp direto.");
    } finally {
      setSending(false);
    }
  };

  const inputCls =
    "w-full rounded-xl border border-white/15 bg-card2 px-4 py-3.5 text-sm text-paper placeholder:text-zinc-600 outline-none transition-colors focus:border-acid";

  return (
    <div data-testid="contato-page">
      <section className="relative overflow-hidden pb-14 pt-40 lg:pb-20 lg:pt-48">
        <div className="hero-grid absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-7">
            <FadeIn>
              <Eyebrow className="flex items-center gap-3">
                <span className="inline-block h-2 w-2 rounded-full bg-acid" />
                Contato
              </Eyebrow>
            </FadeIn>
            <h1 className="mt-7 font-display text-3xl font-extrabold uppercase tracking-tight leading-[1.02] sm:text-5xl">
              <span className="block overflow-hidden">
                <FadeIn delay={0.15}>Vamos entender o cenário</FadeIn>
              </span>
              <span className="block overflow-hidden">
                <FadeIn delay={0.3}>
                  <span>antes de propor a <span className="text-acid">solução.</span></span>
                </FadeIn>
              </span>
            </h1>
            <FadeIn delay={0.5} className="mt-7 max-w-xl">
              <p className="text-base leading-relaxed text-zinc-400 sm:text-lg">
                Explique o objetivo, o momento e o principal obstáculo. A
                conversa começa pela compreensão do cenário — não por uma
                solução pronta.
              </p>
            </FadeIn>
          </div>
          <FadeIn delay={0.35} className="lg:col-span-5">
            <div className="mx-auto flex justify-center">
              <LogoMark className="h-44 w-44 opacity-90" />
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-28 sm:px-6 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <Eyebrow>Canais</Eyebrow>
              <h2 className="mt-4 font-display text-2xl font-bold uppercase tracking-tight sm:text-3xl">
                Escolha o ponto de partida mais claro.
              </h2>
              <div className="mt-8 space-y-5">
                <div className="rounded-2xl border border-white/10 bg-card2 p-6">
                  <span className="font-mono text-xs tracking-[0.25em] text-acid">01</span>
                  <h3 className="mt-4 font-display text-lg font-bold tracking-tight">Diagnóstico</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    Para apresentar site, desafio, objetivo e capacidade de execução.
                  </p>
                  <Link to="/diagnostico" data-testid="contato-card-diagnostico" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-zinc-300 transition-colors hover:text-acid">
                    Abrir diagnóstico
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="rounded-2xl border border-white/10 bg-card2 p-6">
                  <span className="font-mono text-xs tracking-[0.25em] text-acid">02</span>
                  <h3 className="mt-4 font-display text-lg font-bold tracking-tight">Instagram</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    Canal social confirmado na identidade da marca.
                  </p>
                  <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" data-testid="contato-card-instagram" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-zinc-300 transition-colors hover:text-acid">
                    @exekuta.agencia
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
                <div className="rounded-2xl border border-white/10 bg-card2 p-6">
                  <span className="font-mono text-xs tracking-[0.25em] text-acid">03</span>
                  <h3 className="mt-4 font-display text-lg font-bold tracking-tight">WhatsApp</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    Conversa direta para entender o cenário antes do diagnóstico.
                  </p>
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" data-testid="contato-card-whatsapp" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-zinc-300 transition-colors hover:text-acid">
                    Falar com especialista
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={0.1}>
              <form onSubmit={onSubmit} data-testid="contato-form" className="rounded-2xl border border-white/10 bg-card2 p-7 sm:p-10">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="nome" className="mb-2 block font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                      Nome *
                    </label>
                    <input id="nome" required value={form.nome} onChange={set("nome")} data-testid="contato-input-nome" className={inputCls} placeholder="Seu nome" />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-2 block font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                      E-mail *
                    </label>
                    <input id="email" type="email" required value={form.email} onChange={set("email")} data-testid="contato-input-email" className={inputCls} placeholder="voce@empresa.com" />
                  </div>
                  <div>
                    <label htmlFor="whatsapp" className="mb-2 block font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                      WhatsApp *
                    </label>
                    <input id="whatsapp" type="tel" required value={form.whatsapp} onChange={set("whatsapp")} data-testid="contato-input-whatsapp" className={inputCls} placeholder="(00) 00000-0000" />
                  </div>
                  <div>
                    <label htmlFor="empresa" className="mb-2 block font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                      Empresa
                    </label>
                    <input id="empresa" value={form.empresa} onChange={set("empresa")} data-testid="contato-input-empresa" className={inputCls} placeholder="Nome da empresa" />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="mensagem" className="mb-2 block font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                      Mensagem *
                    </label>
                    <textarea id="mensagem" required rows={5} value={form.mensagem} onChange={set("mensagem")} data-testid="contato-input-mensagem" className={`${inputCls} resize-none`} placeholder="Objetivo, momento e principal obstáculo." />
                  </div>
                </div>

                <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm text-zinc-400" data-testid="contato-lgpd-label">
                  <input type="checkbox" checked={form.lgpd} onChange={set("lgpd")} data-testid="contato-input-lgpd" className="mt-0.5 h-4 w-4 shrink-0 accent-[#B7FF00]" />
                  Li a Política de Privacidade e concordo com o uso dos dados para retorno sobre esta solicitação.
                </label>

                <button
                  type="submit"
                  disabled={sending}
                  data-testid="contato-submit-button"
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-acid px-8 py-4 text-sm font-bold uppercase tracking-wide text-ink transition-all duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {sending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      Enviar mensagem
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  ["Sem promessa de primeira posição"],
                  ["Sem proposta genérica antes do cenário"],
                  ["Dados usados apenas para retorno"],
                ].map(([t]) => (
                  <p key={t} className="flex items-start gap-3 text-sm text-zinc-400">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-acid" />
                    {t}
                  </p>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
