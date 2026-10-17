import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Loader2, Minus, Plus, Printer, ShoppingBag, X } from "lucide-react";
import { CartProvider, useCart, brl } from "@/loja/CartContext";
import CartDrawer from "@/loja/CartDrawer";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const CHECKER = "repeating-conic-gradient(#1c2224 0% 25%, #101415 0% 50%) 50% / 16px 16px";

const TYPE_CHIP = {
  digital: { label: "Digital", icon: Download, cls: "border-acid/50 text-acid" },
  fisico: { label: "Impresso", icon: Printer, cls: "border-white/25 text-muted" },
};

function TypeChip({ tipo }) {
  const t = TYPE_CHIP[tipo] || TYPE_CHIP.digital;
  const Icon = t.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] ${t.cls}`} data-testid={`loja-type-${tipo}`}>
      <Icon className="h-3 w-3" />
      {t.label}
    </span>
  );
}

function priceInfo(p) {
  if (p.preco_promocional && p.preco_promocional < p.preco) {
    return { main: p.preco_promocional, old: p.preco };
  }
  return { main: p.preco, old: null };
}

function ProductCard({ p, onOpen }) {
  const { main, old } = priceInfo(p);
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-card2 transition-colors hover:border-acid/40"
      data-testid={`loja-product-card-${p.slug}`}
    >
      <button type="button" onClick={() => onOpen(p)} className="relative block w-full overflow-hidden" aria-label={`Ver ${p.nome}`}>
        <img src={p.imagem || "/loja/kit-templates-instagram.svg"} alt={p.nome} loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" style={{ background: CHECKER }} />
      </button>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <TypeChip tipo={p.tipo} />
        <h3 className="font-display text-lg font-bold uppercase leading-tight tracking-tight text-paper">{p.nome}</h3>
        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <div>
            {old && <span className="block text-xs text-muted line-through">{brl(old)}</span>}
            <span className="font-display text-xl font-extrabold text-paper" data-testid={`loja-price-${p.slug}`}>{brl(main)}</span>
          </div>
          <button
            type="button"
            onClick={() => onOpen(p)}
            data-testid={`loja-product-add-${p.slug}`}
            className="inline-flex items-center gap-2 rounded-full bg-acid px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-ink transition-transform duration-300 hover:scale-[1.05]"
          >
            <Plus className="h-3.5 w-3.5" />
            Comprar
          </button>
        </div>
      </div>
    </motion.article>
  );
}

function ProductModal({ p, onClose }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const { main, old } = priceInfo(p);
  const digital = p.tipo === "digital";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-6" onClick={onClose} data-testid="loja-product-modal">
      <motion.div
        initial={{ y: 48, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 48, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl border border-white/10 bg-ink sm:rounded-3xl"
        data-testid="loja-product-modal-card"
      >
        <div className="relative">
          <img src={p.imagem || "/loja/kit-templates-instagram.svg"} alt={p.nome} className="aspect-[16/9] w-full object-cover" style={{ background: CHECKER }} />
          <button type="button" onClick={onClose} aria-label="Fechar" data-testid="loja-modal-close" className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-ink/80 text-paper backdrop-blur transition-colors hover:text-acid">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-5 p-6 sm:p-8">
          <TypeChip tipo={p.tipo} />
          <h3 className="font-display text-2xl font-extrabold uppercase tracking-tight text-paper sm:text-3xl" data-testid="loja-modal-title">{p.nome}</h3>
          <p className="text-sm leading-relaxed text-muted">{p.descricao}</p>
          <p className="rounded-xl border border-white/10 bg-card2 p-4 text-xs leading-relaxed text-muted" data-testid="loja-modal-delivery-note">
            {digital
              ? "Arquivo digital enviado pelo WhatsApp e e-mail após a confirmação do pagamento."
              : "Impresso produzido sob demanda. Frete e prazo de entrega combinados no WhatsApp."}
          </p>
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
            <div>
              {old && <span className="mr-2 text-sm text-muted line-through">{brl(old)}</span>}
              <span className="font-display text-2xl font-extrabold text-acid" data-testid="loja-modal-price">{brl(main * qty)}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 rounded-full border border-white/15 px-3 py-2">
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Diminuir quantidade" data-testid="loja-qty-dec" className="text-muted transition-colors hover:text-acid">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-6 text-center font-mono text-sm text-paper" data-testid="loja-modal-qty">{qty}</span>
                <button type="button" onClick={() => setQty((q) => Math.min(99, q + 1))} aria-label="Aumentar quantidade" data-testid="loja-qty-inc" className="text-muted transition-colors hover:text-acid">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  add(p, qty);
                  onClose();
                }}
                data-testid="loja-modal-add"
                className="inline-flex items-center gap-2 rounded-full bg-acid px-6 py-3 text-sm font-bold uppercase tracking-wide text-ink transition-transform duration-300 hover:scale-[1.04]"
              >
                <ShoppingBag className="h-4 w-4" />
                Adicionar ao carrinho
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

const FILTERS = [
  { id: "todos", label: "Todos" },
  { id: "digital", label: "Digitais" },
  { id: "fisico", label: "Impressos" },
];

function Store() {
  const [products, setProducts] = useState(null);
  const [filter, setFilter] = useState("todos");
  const [selected, setSelected] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const { count, subtotal } = useCart();

  useEffect(() => {
    fetch(`${API}/loja/products`)
      .then((r) => r.json())
      .then((d) => setProducts(d.items || []))
      .catch(() => setProducts([]));
  }, []);

  const visible = useMemo(() => (products || []).filter((p) => filter === "todos" || p.tipo === filter), [products, filter]);

  return (
    <div className="pt-28 sm:pt-32" data-testid="loja-page">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-acid">Loja Exekuta · Artes Gráficas</p>
        <h1 className="mt-4 max-w-4xl font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tight text-paper sm:text-6xl">
          Artes prontas para <span className="text-acid">elevar sua marca.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
          Downloads digitais e impressos com acabamento profissional. Escolha os itens, monte o carrinho
          e finalize o pedido direto no WhatsApp — sem cadastro, sem burocracia.
        </p>

        <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Filtrar produtos">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={filter === f.id}
              onClick={() => setFilter(f.id)}
              data-testid={`loja-filter-${f.id}`}
              className={`rounded-full border px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${
                filter === f.id ? "border-acid bg-acid/10 text-acid" : "border-white/15 text-muted hover:border-white/30 hover:text-paper"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-28 pt-10 sm:px-6 lg:px-8">
        {products === null ? (
          <div className="flex justify-center py-24">
            <Loader2 className="h-6 w-6 animate-spin text-acid" />
          </div>
        ) : visible.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-white/15 p-14 text-center text-sm text-muted" data-testid="loja-empty">
            Nenhum produto nesta categoria por enquanto — fale com a gente pelo WhatsApp para um pedido sob medida.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((p) => (
              <ProductCard key={p.id} p={p} onOpen={setSelected} />
            ))}
          </div>
        )}
      </section>

      <AnimatePresence>
        {count > 0 && !cartOpen && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => setCartOpen(true)}
            data-testid="loja-cart-open"
            className="fixed bottom-6 left-6 z-[70] flex items-center gap-3 rounded-full bg-acid py-3 pl-5 pr-4 font-bold text-ink shadow-[0_8px_32px_rgba(183,255,0,0.35)] transition-transform duration-300 hover:scale-[1.05]"
            aria-label={`Abrir carrinho com ${count} ${count === 1 ? "item" : "itens"}`}
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="text-xs uppercase tracking-wide" data-testid="loja-cart-count">{count}</span>
            <span className="hidden text-xs uppercase tracking-wide sm:block">· {brl(subtotal)}</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>{selected && <ProductModal p={selected} onClose={() => setSelected(null)} />}</AnimatePresence>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

export default function LojaPage() {
  return (
    <CartProvider>
      <Store />
    </CartProvider>
  );
}
