import { useState } from "react";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, ChevronDown, Plus, Trash2 } from "lucide-react";
import { Area, Input, MediaPicker, SaveBar } from "@/admin/FieldsEditor";

const slugify = (s) =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || `item-${Date.now()}`;

export default function ListEditor({ items, onChange, onSave, saving, kind }) {
  const isCase = kind === "cases";
  const [expanded, setExpanded] = useState(-1);

  const update = (i, key, val) => {
    const next = items.map((it, idx) => {
      if (idx !== i) return it;
      const item = { ...it, [key]: val };
      if (key === "name" && !it.slug) item.slug = slugify(val);
      return item;
    });
    onChange(next);
  };
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next.map((it, idx) => ({ ...it, order: idx + 1 })));
  };
  const addItem = () => {
    const item = isCase
      ? {
          slug: `novo-case-${items.length + 1}`,
          name: "Novo case",
          domain: "",
          visitUrl: "",
          segment: "",
          cardTitle: "",
          screenshot: "",
          h1: "",
          lead: "",
          frentesLabel: "",
          contexto: "",
          frentes: [
            { title: "Frente 1", desc: "" },
            { title: "Frente 2", desc: "" },
            { title: "Frente 3", desc: "" },
          ],
          active: true,
          order: items.length + 1,
        }
      : {
          slug: `novo-servico-${items.length + 1}`,
          name: "Novo serviço",
          num: String(items.length + 1).padStart(2, "0"),
          tag: "",
          card: "",
          h1: "",
          lead: "",
          problemLead: "",
          problemRest: "",
          image: "",
          active: true,
          order: items.length + 1,
        };
    onChange([...items, item]);
    setExpanded(items.length);
  };

  const inputCls =
    "w-full rounded-lg border border-white/15 bg-black px-3 py-2.5 text-sm text-paper outline-none focus:border-acid";
  const labelCls = "mb-1.5 block font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-500";

  return (
    <div className="space-y-4">
      {items.map((it, i) => (
        <div key={it.slug || i} className="rounded-2xl border border-white/10 bg-card2">
          <div className="flex items-center gap-2 p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black font-mono text-xs text-acid">
              {it.order ?? i + 1}
            </span>
            <button type="button" onClick={() => setExpanded(expanded === i ? -1 : i)} className="flex flex-1 items-center gap-2 text-left" data-testid={`admin-${kind}-toggle-${i}`}>
              <span className="font-display text-base font-bold tracking-tight">{it.name || "(sem nome)"}</span>
              {it.active === false && (
                <span className="rounded-full border border-white/20 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-zinc-500">
                  inativo
                </span>
              )}
              <ChevronDown className={`ml-auto h-4 w-4 text-zinc-500 transition-transform ${expanded === i ? "rotate-180" : ""}`} />
            </button>
            <button type="button" onClick={() => move(i, -1)} className="rounded-md border border-white/15 p-1.5 text-zinc-400 hover:text-acid" aria-label="Mover para cima"><ArrowUp className="h-3.5 w-3.5" /></button>
            <button type="button" onClick={() => move(i, 1)} className="rounded-md border border-white/15 p-1.5 text-zinc-400 hover:text-acid" aria-label="Mover para baixo"><ArrowDown className="h-3.5 w-3.5" /></button>
            <button type="button" onClick={() => remove(i)} className="rounded-md border border-white/15 p-1.5 text-zinc-400 hover:text-[#FF4D67]" aria-label="Remover" data-testid={`admin-${kind}-remove-${i}`}><Trash2 className="h-3.5 w-3.5" /></button>
          </div>

          {expanded === i && (
            <div className="grid gap-4 border-t border-white/10 p-5 sm:grid-cols-2">
              <Input label="Nome" value={it.name} onChange={(v) => update(i, "name", v)} />
              <Input label="Slug (URL)" value={it.slug} onChange={(v) => update(i, "slug", v)} />
              {isCase ? (
                <>
                  <Input label="Domínio" value={it.domain} onChange={(v) => update(i, "domain", v)} />
                  <Input label="Link do projeto" value={it.visitUrl} onChange={(v) => update(i, "visitUrl", v)} />
                  <Input label="Segmento" value={it.segment} onChange={(v) => update(i, "segment", v)} />
                  <Input label="Título no card" value={it.cardTitle} onChange={(v) => update(i, "cardTitle", v)} />
                  <Input label="Título da página (H1)" value={it.h1} onChange={(v) => update(i, "h1", v)} />
                  <Input label="Frentes de SEO (resumo)" value={it.frentesLabel} onChange={(v) => update(i, "frentesLabel", v)} />
                  <div className="sm:col-span-2">
                    <span className={labelCls}>Imagem do case</span>
                    <MediaPicker value={it.screenshot} onChange={(v) => update(i, "screenshot", v)} />
                  </div>
                  <Area label="Chamada do card (lead)" value={it.lead} onChange={(v) => update(i, "lead", v)} />
                  <Area label="Contexto" value={it.contexto} onChange={(v) => update(i, "contexto", v)} />
                  {(it.frentes || []).map((f, fi) => (
                    <div key={fi} className="rounded-xl border border-white/10 bg-black p-4">
                      <Input label={`Frente ${fi + 1} — título`} value={f.title} onChange={(v) => update(i, "frentes", it.frentes.map((x, xi) => (xi === fi ? { ...x, title: v } : x)))} />
                      <div className="mt-3">
                        <Area label={`Frente ${fi + 1} — descrição`} value={f.desc} onChange={(v) => update(i, "frentes", it.frentes.map((x, xi) => (xi === fi ? { ...x, desc: v } : x)))} rows={2} />
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <Input label="Etiqueta (tag)" value={it.tag} onChange={(v) => update(i, "tag", v)} />
                  <Input label="Título da página (H1)" value={it.h1} onChange={(v) => update(i, "h1", v)} />
                  <div className="sm:col-span-2">
                    <span className={labelCls}>Imagem do serviço</span>
                    <MediaPicker value={it.image} onChange={(v) => update(i, "image", v)} />
                  </div>
                  <Area label="Descrição do card" value={it.card} onChange={(v) => update(i, "card", v)} />
                  <Area label="Chamada da página (lead)" value={it.lead} onChange={(v) => update(i, "lead", v)} />
                  <Area label="O problema — 1º parágrafo" value={it.problemLead} onChange={(v) => update(i, "problemLead", v)} />
                  <Area label="O problema — 2º parágrafo" value={it.problemRest} onChange={(v) => update(i, "problemRest", v)} />
                </>
              )}
              <div className="flex items-center gap-3 sm:col-span-2">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
                  <input
                    type="checkbox"
                    checked={it.active !== false}
                    onChange={(e) => update(i, "active", e.target.checked)}
                    data-testid={`admin-${kind}-active-${i}`}
                    className="h-4 w-4 accent-[#B7FF00]"
                  />
                  Ativo (exibir no site)
                </label>
                <label className="ml-auto flex items-center gap-2 text-sm text-zinc-400">
                  Ordem
                  <input
                    type="number"
                    value={it.order ?? i + 1}
                    onChange={(e) => update(i, "order", Number(e.target.value) || 0)}
                    className="w-20 rounded-lg border border-white/15 bg-black px-3 py-2 text-sm text-paper outline-none focus:border-acid"
                    data-testid={`admin-${kind}-order-${i}`}
                  />
                </label>
              </div>
            </div>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={addItem}
        data-testid={`admin-${kind}-add`}
        className="inline-flex items-center gap-2 rounded-full border border-acid/40 px-5 py-2.5 text-sm font-semibold text-acid"
      >
        <Plus className="h-4 w-4" />
        {isCase ? "Criar novo case" : "Adicionar serviço"}
      </button>

      <SaveBar
        onSave={onSave}
        saving={saving}
        extra={
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(JSON.stringify(items, null, 2));
              toast.success("JSON copiado");
            }}
            className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-zinc-300"
          >
            Copiar JSON
          </button>
        }
      />
    </div>
  );
}
