import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { SaveBar } from "@/admin/FieldsEditor";

export default function PlanosEditor({ values, onChange, onSave, saving }) {
  const items = Array.isArray(values) ? values : [];
  const [expanded, setExpanded] = useState(-1);

  const update = (i, key, val) =>
    onChange(items.map((it, idx) => (idx === i ? { ...it, [key]: val } : it)));

  return (
    <div className="space-y-4" data-testid="admin-planos">
      <p className="text-xs leading-relaxed text-muted">
        Nome, preço e entregas de cada plano. As entregas são uma linha por item.
        As alterações aparecem na Home (resumo) e na página /planos-seo (detalhes).
      </p>
      {items.map((p, i) => (
        <div key={p.id || i} className="rounded-2xl border border-white/10 bg-card2 p-5">
          <button
            type="button"
            onClick={() => setExpanded(expanded === i ? -1 : i)}
            className="flex w-full items-center gap-2 text-left"
            data-testid={`admin-planos-toggle-${i}`}
          >
            <span className="flex-1 font-display text-base font-bold tracking-tight text-paper">
              {i + 1}. {p.nome || "(sem nome)"} {p.preco ? `— ${p.preco}` : ""}
            </span>
            {expanded === i ? <ChevronUp className="h-4 w-4 text-muted" /> : <ChevronDown className="h-4 w-4 text-muted" />}
          </button>

          {expanded === i && (
            <div className="mt-4 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Nome do plano</span>
                  <input
                    value={p.nome ?? ""}
                    onChange={(e) => update(i, "nome", e.target.value)}
                    data-testid={`admin-planos-nome-${i}`}
                    className="w-full rounded-lg border border-white/15 bg-black px-3 py-2.5 text-sm text-paper outline-none focus:border-acid"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Preço exibido (ex.: R$ 890/mês ou Sob consulta)</span>
                  <input
                    value={p.preco ?? ""}
                    onChange={(e) => update(i, "preco", e.target.value)}
                    data-testid={`admin-planos-preco-${i}`}
                    className="w-full rounded-lg border border-white/15 bg-black px-3 py-2.5 text-sm text-paper outline-none focus:border-acid"
                  />
                </label>
              </div>
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={!!p.destaque}
                  onChange={(e) => update(i, "destaque", e.target.checked)}
                  data-testid={`admin-planos-destaque-${i}`}
                  className="h-4 w-4 accent-[#B7FF00]"
                />
                <span className="text-sm text-paper">Plano em destaque (borda verde e selo)</span>
              </label>
              <label className="block">
                <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Entregas (uma por linha)</span>
                <textarea
                  rows={6}
                  value={(p.entregas || []).join("\n")}
                  onChange={(e) => update(i, "entregas", e.target.value.split("\n").filter((x) => x.trim()))}
                  data-testid={`admin-planos-entregas-${i}`}
                  className="w-full resize-y rounded-lg border border-white/15 bg-black px-3 py-2.5 text-sm leading-relaxed text-paper outline-none focus:border-acid"
                />
              </label>
            </div>
          )}
        </div>
      ))}

      <SaveBar onSave={onSave} saving={saving} />
    </div>
  );
}
