import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, MessageCircle, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart, brl } from "@/loja/CartContext";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const EMPTY_FORM = {
  nome: "",
  whatsapp: "",
  email: "",
  cep: "",
  rua: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  uf: "",
  observacoes: "",
  lgpd: false,
};

const inputCls =
  "w-full rounded-lg border border-white/15 bg-black px-3 py-2.5 text-sm text-paper placeholder:text-zinc-600 outline-none transition-colors focus:border-acid";

const CHECKER_BG = "repeating-conic-gradient(#1c2224 0% 25%, #101415 0% 50%) 50% / 12px 12px";

function Field({ label, children, testid }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.16em] text-muted">{label}</span>
      {children}
    </label>
  );
}

export default function CartDrawer({ open, onClose }) {
  const { items, setQty, remove, subtotal, clear } = useCart();
  const [step, setStep] = useState("cart");
  const [form, setForm] = useState(EMPTY_FORM);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(null);

  useEffect(() => {
    if (open) setError("");
  }, [open]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target ? e.target.value : e }));
  const temFisico = items.some((i) => i.tipo === "fisico");

  const submit = async () => {
    setError("");
    if (!form.nome.trim()) return setError("Informe seu nome.");
    if (form.whatsapp.replace(/\D/g, "").length < 10) return setError("Informe um WhatsApp válido com DDD.");
    if (temFisico && (!form.cep.trim() || !form.rua.trim() || !form.numero.trim() || !form.cidade.trim() || !form.uf.trim()))
      return setError("Preencha o endereço de entrega completo.");
    if (!form.lgpd) return setError("É necessário aceitar o uso dos dados para concluir o pedido.");
    setBusy(true);
    try {
      const tinhaDigital = items.some((i) => i.tipo === "digital");
      const res = await fetch(`${API}/loja/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: form.nome,
          whatsapp: form.whatsapp,
          email: form.email,
          observacoes: form.observacoes,
          lgpd: form.lgpd,
          endereco: {
            cep: form.cep, rua: form.rua, numero: form.numero,
            complemento: form.complemento, bairro: form.bairro, cidade: form.cidade, uf: form.uf,
          },
          itens: items.map((i) => ({ produto_id: i.id, qtd: i.qtd })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(typeof data.detail === "string" ? data.detail : "Erro ao finalizar o pedido. Tente novamente.");
      setDone({ ...data, tinhaDigital });
      setStep("success");
      clear();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const close = () => {
    onClose();
    if (step === "success") {
      setTimeout(() => {
        setStep("cart");
        setForm(EMPTY_FORM);
        setDone(null);
      }, 300);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[85] bg-black/70 backdrop-blur-sm" onClick={close} data-testid="loja-cart-overlay">
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="flex h-full w-full max-w-md flex-col border-l border-white/10 bg-ink"
            data-testid="loja-cart-drawer"
          >
            <header className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <h2 className="font-display text-lg font-extrabold uppercase tracking-tight text-paper">
                {step === "cart" ? "Seu carrinho" : step === "checkout" ? "Finalizar pedido" : "Pedido confirmado"}
              </h2>
              <button type="button" onClick={close} aria-label="Fechar carrinho" data-testid="loja-cart-close" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-paper transition-colors hover:text-acid">
                <X className="h-5 w-5" />
              </button>
            </header>

            {step === "cart" && (
              <div className="flex flex-1 flex-col overflow-y-auto px-6 py-6">
                {items.length === 0 ? (
                  <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center" data-testid="loja-cart-empty">
                    <ShoppingBag className="h-10 w-10 text-muted" />
                    <p className="text-sm text-muted">Seu carrinho está vazio. Explore as artes da loja e adicione o que precisar.</p>
                  </div>
                ) : (
                  <>
                    <ul className="flex-1 space-y-4">
                      {items.map((i, idx) => (
                        <li key={i.id} className="flex gap-4 rounded-xl border border-white/10 bg-card2 p-4" data-testid={`loja-cart-item-${idx}`}>
                          <img src={i.imagem || "/loja/kit-templates-instagram.svg"} alt={i.nome} className="h-16 w-20 shrink-0 rounded-lg object-cover" style={{ background: CHECKER_BG }} />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold text-paper">{i.nome}</p>
                            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">{i.tipo === "digital" ? "Digital" : "Impresso"} · {brl(i.preco)}</p>
                            <div className="mt-2 flex items-center gap-3">
                              <button type="button" onClick={() => setQty(i.id, i.qtd - 1)} aria-label="Diminuir" data-testid={`loja-qty-minus-${idx}`} className="text-muted transition-colors hover:text-acid"><Minus className="h-3.5 w-3.5" /></button>
                              <span className="font-mono text-sm text-paper" data-testid={`loja-cart-item-qty-${idx}`}>{i.qtd}</span>
                              <button type="button" onClick={() => setQty(i.id, i.qtd + 1)} aria-label="Aumentar" data-testid={`loja-qty-plus-${idx}`} className="text-muted transition-colors hover:text-acid"><Plus className="h-3.5 w-3.5" /></button>
                              <button type="button" onClick={() => remove(i.id)} aria-label="Remover item" data-testid={`loja-remove-${idx}`} className="ml-auto text-muted transition-colors hover:text-[#FF4D67]"><Trash2 className="h-4 w-4" /></button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="sticky bottom-0 space-y-4 border-t border-white/10 bg-ink pt-4">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Subtotal</span>
                        <span className="font-display text-xl font-extrabold text-paper" data-testid="loja-cart-subtotal">{brl(subtotal)}</span>
                      </div>
                      <button type="button" onClick={() => setStep("checkout")} data-testid="loja-checkout-button" className="w-full rounded-full bg-acid py-3.5 text-sm font-bold uppercase tracking-wide text-ink transition-transform duration-300 hover:scale-[1.02]">
                        Finalizar pedido
                      </button>
                      <p className="text-center font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Pedido enviado pelo WhatsApp · pagamento combinado lá</p>
                    </div>
                  </>
                )}
              </div>
            )}

            {step === "checkout" && (
              <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
                <Field label="Seu nome *">
                  <input value={form.nome} onChange={set("nome")} placeholder="Nome completo" data-testid="loja-checkout-name" className={inputCls} />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="WhatsApp *">
                    <input value={form.whatsapp} onChange={set("whatsapp")} placeholder="(21) 99999-9999" data-testid="loja-checkout-whatsapp" className={inputCls} />
                  </Field>
                  <Field label="E-mail">
                    <input value={form.email} onChange={set("email")} type="email" placeholder="voce@empresa.com" data-testid="loja-checkout-email" className={inputCls} />
                  </Field>
                </div>

                {temFisico && (
                  <div className="space-y-4 rounded-xl border border-white/10 bg-card2 p-4" data-testid="loja-checkout-address">
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-acid">Endereço de entrega — há impressos no pedido</p>
                    <div className="grid grid-cols-3 gap-3">
                      <Field label="CEP *"><input value={form.cep} onChange={set("cep")} placeholder="00000-000" data-testid="loja-checkout-cep" className={inputCls} /></Field>
                      <Field label="Cidade *"><input value={form.cidade} onChange={set("cidade")} data-testid="loja-checkout-cidade" className={inputCls} /></Field>
                      <Field label="UF *"><input value={form.uf} onChange={set("uf")} maxLength={2} placeholder="RJ" data-testid="loja-checkout-uf" className={inputCls} /></Field>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-2"><Field label="Rua *"><input value={form.rua} onChange={set("rua")} data-testid="loja-checkout-rua" className={inputCls} /></Field></div>
                      <Field label="Nº *"><input value={form.numero} onChange={set("numero")} data-testid="loja-checkout-numero" className={inputCls} /></Field>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Complemento"><input value={form.complemento} onChange={set("complemento")} data-testid="loja-checkout-complemento" className={inputCls} /></Field>
                      <Field label="Bairro"><input value={form.bairro} onChange={set("bairro")} data-testid="loja-checkout-bairro" className={inputCls} /></Field>
                    </div>
                  </div>
                )}

                <Field label="Observações">
                  <textarea value={form.observacoes} onChange={set("observacoes")} rows={3} placeholder="Cores, textos, referências..." data-testid="loja-checkout-observacoes" className={`${inputCls} resize-y`} />
                </Field>

                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-card2 p-4">
                  <input type="checkbox" checked={form.lgpd} onChange={(e) => setForm((f) => ({ ...f, lgpd: e.target.checked }))} data-testid="loja-lgpd-checkbox" className="mt-0.5 h-4 w-4 accent-[#B7FF00]" />
                  <span className="text-xs leading-relaxed text-muted">
                    Autorizo o uso dos meus dados apenas para processar este pedido, conforme a LGPD.
                  </span>
                </label>

                {error && <p className="rounded-lg border border-[#FF4D67]/40 bg-[#FF4D67]/10 p-3 text-xs text-[#FF4D67]" data-testid="loja-checkout-error">{error}</p>}

                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Total</span>
                  <span className="font-display text-xl font-extrabold text-acid" data-testid="loja-checkout-total">{brl(subtotal)}</span>
                </div>
                <button type="button" onClick={submit} disabled={busy} data-testid="loja-checkout-submit" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-acid py-3.5 text-sm font-bold uppercase tracking-wide text-ink transition-transform duration-300 hover:scale-[1.02] disabled:opacity-60">
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />}
                  Enviar pedido no WhatsApp
                </button>
                <button type="button" onClick={() => setStep("cart")} data-testid="loja-back-to-cart" className="w-full text-center font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-paper">
                  Voltar ao carrinho
                </button>
              </div>
            )}

            {step === "success" && done && (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 py-10 text-center" data-testid="loja-order-success">
                <CheckCircle2 className="h-14 w-14 text-acid" />
                <h3 className="font-display text-2xl font-extrabold uppercase tracking-tight text-paper">
                  Pedido <span className="text-acid" data-testid="loja-order-code">{done.codigo}</span> registrado!
                </h3>
                <p className="text-sm leading-relaxed text-muted">
                  Falta um passo: envie o resumo pelo WhatsApp para nosso time confirmar disponibilidade,
                  pagamento e entrega.
                </p>
                {done.tinhaDigital && (
                  <p className="w-full rounded-xl border border-white/10 bg-card2 p-4 text-xs leading-relaxed text-muted">
                    Os arquivos digitais são enviados pelo WhatsApp e e-mail após a confirmação do pagamento.
                  </p>
                )}
                {done.temFisico && (
                  <p className="w-full rounded-xl border border-white/10 bg-card2 p-4 text-xs leading-relaxed text-muted">
                    Os impressos entram em produção após a confirmação. Frete e prazo combinados no WhatsApp.
                  </p>
                )}
                <a
                  href={done.whatsapp_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="loja-whatsapp-send"
                  className="inline-flex items-center gap-2 rounded-full bg-acid px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-ink transition-transform duration-300 hover:scale-[1.04]"
                >
                  <MessageCircle className="h-4 w-4" />
                  Enviar pedido no WhatsApp
                </a>
                <button type="button" onClick={close} data-testid="loja-success-close" className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-paper">
                  Continuar navegando
                </button>
              </div>
            )}
          </motion.aside>
        </motion.div>
      )}
      </AnimatePresence>
    );
  }
