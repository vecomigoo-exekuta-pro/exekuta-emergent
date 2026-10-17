import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Package, Plus, Settings, Trash2, ShoppingCart } from "lucide-react";
import { Area, Input, MediaPicker, SaveBar } from "@/admin/FieldsEditor";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const authFetch = async (path, options = {}) => {
  const token = localStorage.getItem("exk_admin_token");
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof data.detail === "string" ? data.detail : "Erro inesperado");
  return data;
};

const brl = (v) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v || 0);

const ORDER_STATUS = [
  { id: "novo", label: "Novo" },
  { id: "pago", label: "Pago" },
  { id: "producao", label: "Em produção" },
  { id: "entregue", label: "Entregue" },
  { id: "cancelado", label: "Cancelado" },
];

const EMPTY_PRODUCT = {
  nome: "",
  tipo: "digital",
  preco: "",
  preco_promocional: "",
  descricao: "",
  imagem: "",
  arquivo_entrega: "",
  ativo: true,
  ordem: 0,
};

function ProductForm({ initial, onDone, onCancel }) {
  const [p, setP] = useState(initial);
  const [saving, setSaving] = useState(false);
  const editing = !!initial.id;
  const set = (k) => (v) => setP((c) => ({ ...c, [k]: v }));

  const save = async () => {
    if (!p.nome.trim()) return toast.error("Informe o nome do produto.");
    if (!Number(p.preco) || Number(p.preco) <= 0) return toast.error("Informe um preço maior que zero.");
    setSaving(true);
    try {
      const body = {
        nome: p.nome,
        tipo: p.tipo,
        preco: Number(p.preco),
        preco_promocional: p.preco_promocional ? Number(p.preco_promocional) : null,
        descricao: p.descricao || "",
        imagem: p.imagem || "",
        arquivo_entrega: p.arquivo_entrega || "",
        ativo: !!p.ativo,
        ordem: Number(p.ordem) || 0,
      };
      if (editing) await authFetch(`/admin/loja/products/${p.id}`, { method: "PUT", body });
      else await authFetch("/admin/loja/products", { method: "POST", body });
      toast.success(editing ? "Produto atualizado." : "Produto criado.");
      onDone();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5 rounded-2xl border border-acid/30 bg-card2 p-6" data-testid="admin-loja-product-form">
      <h3 className="font-display text-lg font-bold uppercase tracking-tight text-paper">
        {editing ? `Editar: ${p.nome}` : "Novo produto"}
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Nome do produto" value={p.nome} onChange={set("nome")} />
        <label className="block">
          <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Tipo</span>
          <select value={p.tipo} onChange={(e) => set("tipo")(e.target.value)} data-testid="admin-loja-product-type" className="w-full rounded-lg border border-white/15 bg-black px-3 py-2.5 text-sm text-paper outline-none focus:border-acid">
            <option value="digital">Digital (download)</option>
            <option value="fisico">Impresso (entrega)</option>
          </select>
        </label>
        <Input label="Preço (R$)" type="number" value={p.preco} onChange={set("preco")} />
        <Input label="Preço promocional (R$, opcional)" type="number" value={p.preco_promocional ?? ""} onChange={set("preco_promocional")} />
        <Input label="Ordem de exibição" type="number" value={p.ordem} onChange={set("ordem")} />
        <label className="flex items-center gap-3 self-end rounded-lg border border-white/15 bg-black px-3 py-2.5">
          <input type="checkbox" checked={!!p.ativo} onChange={(e) => set("ativo")(e.target.checked)} data-testid="admin-loja-product-active" className="h-4 w-4 accent-[#B7FF00]" />
          <span className="text-sm text-paper">Ativo na loja</span>
        </label>
      </div>
      <Area label="Descrição" value={p.descricao} onChange={set("descricao")} rows={3} />
      <div>
        <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Imagem de capa</span>
        <MediaPicker label="Imagem de capa" value={p.imagem} onChange={set("imagem")} />
      </div>
      {p.tipo === "digital" && (
        <div>
          <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Arquivo de entrega (link do arquivo final, ex.: Drive/URL)</span>
          <MediaPicker label="Arquivo de entrega" value={p.arquivo_entrega} onChange={set("arquivo_entrega")} />
        </div>
      )}
      <div className="flex gap-3">
        <button type="button" onClick={save} disabled={saving} data-testid="admin-loja-product-save" className="inline-flex items-center gap-2 rounded-full bg-acid px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-ink transition-transform hover:scale-[1.03] disabled:opacity-60">
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {editing ? "Salvar alterações" : "Criar produto"}
        </button>
        <button type="button" onClick={onCancel} data-testid="admin-loja-product-cancel" className="rounded-full border border-white/20 px-6 py-2.5 text-sm font-semibold text-muted transition-colors hover:text-paper">
          Cancelar
        </button>
      </div>
    </div>
  );
}

function ProductsTab() {
  const [items, setItems] = useState(null);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    try {
      const data = await authFetch("/admin/loja/products");
      setItems(data.items || []);
    } catch (e) {
      toast.error(e.message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const del = async (p) => {
    if (!window.confirm(`Excluir o produto "${p.nome}"?`)) return;
    try {
      await authFetch(`/admin/loja/products/${p.id}`, { method: "DELETE" });
      toast.success("Produto excluído.");
      await load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <div className="space-y-6" data-testid="admin-loja-products">
      {editing ? (
        <ProductForm initial={editing} onDone={() => { setEditing(null); load(); }} onCancel={() => setEditing(null)} />
      ) : (
        <button type="button" onClick={() => setEditing({ ...EMPTY_PRODUCT })} data-testid="admin-loja-product-new" className="inline-flex items-center gap-2 rounded-full bg-acid px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-ink transition-transform hover:scale-[1.03]">
          <Plus className="h-4 w-4" />
          Novo produto
        </button>
      )}
      {items === null ? (
        <Loader2 className="h-5 w-5 animate-spin text-acid" />
      ) : items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-white/15 p-10 text-center text-sm text-muted" data-testid="admin-loja-products-empty">
          Nenhum produto ainda — clique em "Novo produto" para começar.
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((p) => (
            <div key={p.id} className="flex flex-wrap items-center gap-4 rounded-xl border border-white/10 bg-card2 p-4" data-testid={`admin-loja-product-row-${p.slug}`}>
              <img src={p.imagem || "/loja/kit-templates-instagram.svg"} alt={p.nome} className="h-14 w-20 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-paper">{p.nome}</p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                  {p.tipo === "digital" ? "Digital" : "Impresso"} · {brl(p.preco_promocional || p.preco)}
                  {p.preco_promocional ? ` (de ${brl(p.preco)})` : ""} · {p.ativo ? "Ativo" : "Inativo"}
                </p>
              </div>
              <button type="button" onClick={() => setEditing(p)} data-testid={`admin-loja-product-edit-${p.slug}`} className="rounded-full border border-acid/40 px-4 py-2 text-xs font-bold uppercase tracking-wide text-acid transition-colors hover:bg-acid hover:text-ink">
                Editar
              </button>
              <button type="button" onClick={() => del(p)} data-testid={`admin-loja-product-delete-${p.slug}`} className="rounded-full border border-white/15 p-2.5 text-muted transition-colors hover:border-[#FF4D67] hover:text-[#FF4D67]" aria-label={`Excluir ${p.nome}`}>
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function OrdersTab() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    authFetch("/admin/loja/orders").then((d) => setItems(d.items || [])).catch((e) => toast.error(e.message));
  }, []);

  const setStatus = async (o, status) => {
    try {
      await authFetch(`/admin/loja/orders/${o.id}/status`, { method: "PUT", body: { status } });
      setItems((cur) => cur.map((x) => (x.id === o.id ? { ...x, status } : x)));
      toast.success(`Pedido ${o.codigo} atualizado.`);
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <div className="space-y-4" data-testid="admin-loja-orders">
      {items === null ? (
        <Loader2 className="h-5 w-5 animate-spin text-acid" />
      ) : items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-white/15 p-10 text-center text-sm text-muted" data-testid="admin-loja-orders-empty">
          Nenhum pedido recebido ainda.
        </p>
      ) : (
        items.map((o) => (
          <div key={o.id} className="rounded-2xl border border-white/10 bg-card2 p-5" data-testid={`admin-loja-order-${o.codigo}`}>
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-sm font-bold text-acid">{o.codigo}</span>
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                {o.criado_em?.slice(0, 19).replace("T", " ")}
              </span>
              <select
                value={o.status}
                onChange={(e) => setStatus(o, e.target.value)}
                data-testid={`admin-loja-order-status-${o.codigo}`}
                className="ml-auto rounded-lg border border-white/15 bg-black px-3 py-2 text-xs text-paper outline-none focus:border-acid"
              >
                {ORDER_STATUS.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <div className="text-sm text-paper">
                <p className="font-bold">{o.cliente?.nome}</p>
                <p className="mt-1 text-xs text-muted">
                  <a href={`https://wa.me/${o.cliente?.whatsapp || ""}`} target="_blank" rel="noopener noreferrer" className="text-acid hover:underline" data-testid={`admin-loja-order-wa-${o.codigo}`}>
                    WhatsApp: {o.cliente?.whatsapp}
                  </a>
                </p>
                {o.cliente?.email && <p className="text-xs text-muted">E-mail: {o.cliente.email}</p>}
                {o.tem_fisico && o.endereco && (
                  <p className="mt-2 text-xs leading-relaxed text-muted">
                    Entrega: {o.endereco.rua}, {o.endereco.numero} — {o.endereco.bairro} · CEP {o.endereco.cep} · {o.endereco.cidade}/{o.endereco.uf}
                  </p>
                )}
              </div>
              <div className="text-xs text-muted">
                <ul className="space-y-1">
                  {(o.itens || []).map((it, i) => (
                    <li key={i} data-testid={`admin-loja-order-item-${o.codigo}-${i}`}>
                      {it.qtd}x {it.nome} — {brl(it.preco * it.qtd)}
                    </li>
                  ))}
                </ul>
                <p className="mt-2 font-display text-base font-extrabold text-paper">Total: {brl(o.subtotal)}</p>
                {o.observacoes && <p className="mt-2 italic">Obs.: {o.observacoes}</p>}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function ConfigTab() {
  const [cfg, setCfg] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    authFetch("/admin/loja/config").then((d) => setCfg(d.config || {})).catch((e) => toast.error(e.message));
  }, []);

  if (!cfg) return <Loader2 className="h-5 w-5 animate-spin text-acid" />;

  return (
    <div className="space-y-6" data-testid="admin-loja-config">
      <section className="rounded-2xl border border-white/10 bg-card2 p-6">
        <h3 className="font-display text-lg font-bold uppercase tracking-tight text-paper">Configuração da loja</h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Input label="Nome da loja" value={cfg.nome_loja} onChange={(v) => setCfg({ ...cfg, nome_loja: v })} />
          <Input label="WhatsApp de pedidos (55 + DDD + número)" value={cfg.whatsapp} onChange={(v) => setCfg({ ...cfg, whatsapp: v })} />
        </div>
        <p className="mt-3 text-xs text-muted">
          Ex.: 5521999999999. Os pedidos finalizados na loja abrem o WhatsApp deste número com o resumo completo.
        </p>
      </section>
      <SaveBar
        onSave={async () => {
          setSaving(true);
          try {
            await authFetch("/admin/loja/config", { method: "PUT", body: { data: cfg } });
            toast.success("Configuração da loja salva.");
          } catch (e) {
            toast.error(e.message);
          } finally {
            setSaving(false);
          }
        }}
        saving={saving}
      />
    </div>
  );
}

export default function LojaPanel() {
  const [sub, setSub] = useState("produtos");
  const SUBS = [
    { id: "produtos", label: "Produtos", icon: Package },
    { id: "pedidos", label: "Pedidos", icon: ShoppingCart },
    { id: "config", label: "Configuração", icon: Settings },
  ];

  return (
    <div className="space-y-6" data-testid="admin-loja-panel">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Seções da loja">
        {SUBS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={sub === id}
            onClick={() => setSub(id)}
            data-testid={`admin-loja-subtab-${id}`}
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors ${
              sub === id ? "border-acid/50 bg-card2 text-acid" : "border-white/10 text-muted hover:border-white/25"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>
      {sub === "produtos" ? <ProductsTab /> : sub === "pedidos" ? <OrdersTab /> : <ConfigTab />}
    </div>
  );
}
