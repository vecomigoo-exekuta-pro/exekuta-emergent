import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "exk_loja_cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(raw) ? raw : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const add = (p, qtd = 1) =>
    setItems((cur) => {
      const i = cur.findIndex((x) => x.id === p.id);
      if (i >= 0) {
        const next = [...cur];
        next[i] = { ...next[i], qtd: Math.min(99, next[i].qtd + qtd) };
        return next;
      }
      return [...cur, { id: p.id, nome: p.nome, tipo: p.tipo, preco: p.preco, imagem: p.imagem, qtd }];
    });

  const setQty = (id, qtd) =>
    setItems((cur) => (qtd <= 0 ? cur.filter((x) => x.id !== id) : cur.map((x) => (x.id === id ? { ...x, qtd: Math.min(99, qtd) } : x))));

  const remove = (id) => setItems((cur) => cur.filter((x) => x.id !== id));
  const clear = () => setItems([]);

  const count = items.reduce((s, x) => s + x.qtd, 0);
  const subtotal = items.reduce((s, x) => s + x.qtd * x.preco, 0);
  const value = useMemo(() => ({ items, add, setQty, remove, clear, count, subtotal }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);

export const brl = (v) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v || 0);
