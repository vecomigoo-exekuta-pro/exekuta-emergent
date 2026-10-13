import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { SaveBar } from "@/admin/FieldsEditor";

export default function FaqEditor({ values, onChange, onSave, saving }) {
  const items = Array.isArray(values) ? values : [];
  const [expanded, setExpanded] = useState(0);

  const update = (i, key, val) => {
    const next = items.map((it, idx) => (idx === i ? { ...it, [key]: val } : it));
    onChange(next);
  };
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="space-y-4">
      {items.map((f, i) => (
        <div key={i} className="rounded-2xl border border-white/10 bg-card2 p-5">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setExpanded(expanded === i ? -1 : i)} className="flex-1 text-left font-display text-base font-bold tracking-tight" data-testid={`admin-faq-toggle-${i}`}>
              {i + 1}. {f.q || "(sem pergunta)"}
            </button>
            <button type="button" onClick={() => move(i, -1)} className="rounded-md border border-white/15 p-1.5 text-zinc-400 hover:text-acid" aria-label="Mover para cima"><ArrowUp className="h-3.5 w-3.5" /></button>
            <button type="button" onClick={() => move(i, 1)} className="rounded-md border border-white/15 p-1.5 text-zinc-400 hover:text-acid" aria-label="Mover para baixo"><ArrowDown className="h-3.5 w-3.5" /></button>
            <button type="button" onClick={() => remove(i)} className="rounded-md border border-white/15 p-1.5 text-zinc-400 hover:text-[#FF4D67]" aria-label="Remover" data-testid={`admin-faq-remove-${i}`}><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
          {expanded === i && (
            <div className="mt-4 space-y-3">
              <label className="block">
                <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-500">Pergunta</span>
                <input value={f.q ?? ""} onChange={(e) => update(i, "q", e.target.value)} data-testid={`admin-faq-q-${i}`} className="w-full rounded-lg border border-white/15 bg-black px-3 py-2.5 text-sm text-paper outline-none focus:border-acid" />
              </label>
              <label className="block">
                <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-500">Resposta</span>
                <textarea rows={3} value={f.a ?? ""} onChange={(e) => update(i, "a", e.target.value)} data-testid={`admin-faq-a-${i}`} className="w-full resize-y rounded-lg border border-white/15 bg-black px-3 py-2.5 text-sm leading-relaxed text-paper outline-none focus:border-acid" />
              </label>
            </div>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={() => {
          onChange([...items, { q: "Nova pergunta?", a: "Resposta." }]);
          setExpanded(items.length);
        }}
        data-testid="admin-faq-add"
        className="inline-flex items-center gap-2 rounded-full border border-acid/40 px-5 py-2.5 text-sm font-semibold text-acid"
      >
        <Plus className="h-4 w-4" />
        Adicionar pergunta
      </button>

      <SaveBar onSave={onSave} saving={saving} />
    </div>
  );
}
