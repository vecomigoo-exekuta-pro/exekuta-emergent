import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { ArrowUpRight, Check, Loader2 } from "lucide-react";
import { Eyebrow, FadeIn, Reveal } from "@/components/ui-motions";
import { WHATSAPP_URL, PHONE } from "@/data/content";

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
      toast.success("Contato recebido. Vamos entender o seu cenário e retornar em seguida.");
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
      <section className="relative overflow-hidden pb-16 pt-40 lg:pb-24 lg:pt-48">
        <div className="hero-grid absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <Eyebrow className="flex items-center gap-3">
              <span className="inline-block h-2 w-2 rounded-full bg-acid" />
              Contato
            </Eyebrow>
          </FadeIn>
          <h1 className="mt-8 font-display text-3xl font-extrabold tracking-tighter leading-[1.02] sm:text-5xl lg:text-6xl">
            <span className="block overflow-hidden">
              <FadeIn delay={0.15}>
                <span>Vamos entender o cenário</span>
              </FadeIn>
            </span>
            <span className="block overflow-hidden">
              <FadeIn delay={0.3}>
                <span>antes de propor a <span className="text-acid">solução.</span></span>
              </FadeIn>
            </span>
          </h1>
          <FadeIn delay={0.5} className="mt-8 max-w-xl">
            <p className="text-base leading-relaxed text-zinc-400 sm:text-lg">
              Conte o contexto. A resposta começa por entender problema,
              prioridade e capacidade de execução.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-28 sm:px-6 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-zinc-500">
                Canal direto
              </p>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="contato-whatsapp-button"
                className="group mt-5 inline-flex items-center gap-3 rounded-full bg-acid px-7 py-4 text-sm font-semibold text-ink transition-transform duration-300 hover:scale-[1.03]"
              >
                Falar no WhatsApp
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
              </a>
              <p className="mt-6 text-sm text-zinc-400">{PHONE}</p>
              <p className="mt-1 text-sm text-zinc-400">Rio de Janeiro · Brasil</p>

              <div className="mt-12 border-t border-white/10 pt-8">
                <p className="font-display text-lg font-bold tracking-tight">
                  O que acontece depois do envio?
                </p>
                <ul className="mt-5 space-y-4 text-sm leading-relaxed text-zinc-400">
                  <li className="flex gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-acid" />
                    Leitura do contexto que você compartilhou.
                  </li>
                  <li className="flex gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-acid" />
                    Retorno para entender problema, prioridade e capacidade de execução.
                  </li>
                  <li className="flex gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-acid" />
                    Proposta de diagnóstico alinhada ao seu cenário.
                  </li>
                </ul>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={0.1}>
              <form
                onSubmit={onSubmit}
                data-testid="contato-form"
                className="rounded-2xl border border-white/10 bg-card2 p-7 sm:p-10"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="nome" className="mb-2 block font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                      Nome *
                    </label>
                    <input
                      id="nome"
                      required
                      value={form.nome}
                      onChange={set("nome")}
                      data-testid="contato-input-nome"
                      className={inputCls}
                      placeholder="Seu nome"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-2 block font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                      E-mail *
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={set("email")}
                      data-testid="contato-input-email"
                      className={inputCls}
                      placeholder="voce@empresa.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="whatsapp" className="mb-2 block font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                      WhatsApp *
                    </label>
                    <input
                      id="whatsapp"
                      type="tel"
                      required
                      value={form.whatsapp}
                      onChange={set("whatsapp")}
                      data-testid="contato-input-whatsapp"
                      className={inputCls}
                      placeholder="+55 21 90000-0000"
                    />
                  </div>
                  <div>
                    <label htmlFor="empresa" className="mb-2 block font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                      Empresa
                    </label>
                    <input
                      id="empresa"
                      value={form.empresa}
                      onChange={set("empresa")}
                      data-testid="contato-input-empresa"
                      className={inputCls}
                      placeholder="Nome da empresa"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="mensagem" className="mb-2 block font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                      Mensagem *
                    </label>
                    <textarea
                      id="mensagem"
                      required
                      rows={5}
                      value={form.mensagem}
                      onChange={set("mensagem")}
                      data-testid="contato-input-mensagem"
                      className={`${inputCls} resize-none`}
                      placeholder="Conte o contexto: problema, prioridade e capacidade de execução."
                    />
                  </div>
                </div>

                <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm text-zinc-400" data-testid="contato-lgpd-label">
                  <input
                    type="checkbox"
                    checked={form.lgpd}
                    onChange={set("lgpd")}
                    data-testid="contato-input-lgpd"
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[#E2FE00]"
                  />
                  Li e aceito a Política de Privacidade.
                </label>

                <button
                  type="submit"
                  disabled={sending}
                  data-testid="contato-submit-button"
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-acid px-8 py-4 text-sm font-semibold text-ink transition-all duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {sending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      Enviar contato
                      <ArrowUpRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
