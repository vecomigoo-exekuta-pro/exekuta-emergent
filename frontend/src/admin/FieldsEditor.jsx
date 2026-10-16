import { useRef, useState } from "react";
import { toast } from "sonner";
import { Loader2, Save, Upload } from "lucide-react";
import { getMedia, uploadFile } from "@/cms/adminApi";

export const Input = ({ label, value, onChange, type = "text" }) => (
  <label className="block">
    <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.16em] text-muted">{label}</span>
    <input
      type={type}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-white/15 bg-black px-3 py-2.5 text-sm text-paper outline-none focus:border-acid"
      data-testid={`admin-input-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 30)}`}
    />
  </label>
);

export const Area = ({ label, value, onChange, rows = 3 }) => (
  <label className="block sm:col-span-2">
    <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.16em] text-muted">{label}</span>
    <textarea
      rows={rows}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full resize-y rounded-lg border border-white/15 bg-black px-3 py-2.5 text-sm leading-relaxed text-paper outline-none focus:border-acid"
    />
  </label>
);

export const SaveBar = ({ onSave, saving, extra }) => (
  <div className="sticky bottom-4 mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-acid/25 bg-card2/95 p-3 backdrop-blur">
    <button
      type="button"
      onClick={onSave}
      disabled={saving}
      data-testid="admin-save-button"
      className="inline-flex items-center gap-2 rounded-full bg-acid px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-ink transition-transform hover:scale-[1.03] disabled:opacity-60"
    >
      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
      Salvar alterações
    </button>
    {extra}
    <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
      Um backup da versão anterior é criado a cada salvamento
    </span>
  </div>
);

// fundo xadrez para visualizar imagens com fundo transparente (PNG/SVG)
const CHECKER =
  "repeating-conic-gradient(#1c2224 0% 25%, #101415 0% 50%) 50% / 12px 12px";

export function MediaPicker({ value, onChange, label = "imagem" }) {
  const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 24);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const load = async () => {
    try {
      const data = await getMedia();
      setItems(data.items || []);
    } catch (e) {
      setItems([]);
    }
  };

  const onUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const data = await uploadFile(file);
      onChange(data.url);
      toast.success("Imagem enviada e aplicada.");
      setOpen(true);
      await load();
    } catch (err) {
      toast.error(err.message || "Falha no upload da imagem.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div>
      {/* opção 1 — colar URL */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Cole a URL da imagem (https://...)"
          data-testid={`admin-image-url-${slug}`}
          className="w-full rounded-lg border border-white/15 bg-black px-3 py-2.5 text-sm text-paper placeholder:text-zinc-600 outline-none focus:border-acid"
        />
        {/* opção 2 — upload do computador */}
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
          onChange={onUpload}
          className="hidden"
          data-testid={`admin-image-file-${slug}`}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          data-testid={`admin-image-upload-${slug}`}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-acid px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-ink transition-transform hover:scale-[1.03] disabled:opacity-60"
        >
          {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
          Enviar do computador
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(!open);
            if (!open) load();
          }}
          data-testid={`admin-image-library-${slug}`}
          className="shrink-0 rounded-lg border border-acid/40 px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-acid"
        >
          Biblioteca
        </button>
      </div>

      <span className="mt-1.5 block font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
        PNG, JPG ou SVG — até 5 MB — fundo transparente suportado
      </span>

      {value && (
        <div className="mt-2 inline-flex items-center gap-3 rounded-lg border border-white/10 p-2">
          <img
            src={value}
            alt={`Pré-visualização de ${label}`}
            className="h-20 w-32 rounded-md object-contain"
            style={{ background: CHECKER }}
            onError={(e) => {
              e.currentTarget.style.outline = "1px solid #FF4D67";
            }}
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="rounded-md border border-white/15 px-3 py-1.5 text-xs font-semibold text-muted hover:text-[#FF4D67]"
            data-testid={`admin-image-clear-${slug}`}
          >
            Remover
          </button>
        </div>
      )}

      {open && (
        <div className="mt-3 grid max-h-56 grid-cols-3 gap-2 overflow-y-auto rounded-lg border border-white/10 bg-black p-2 sm:grid-cols-5">
          {items.length === 0 && (
            <p className="col-span-full p-3 text-center text-xs text-muted">
              Biblioteca vazia — envie uma imagem do computador.
            </p>
          )}
          {items.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                onChange(m.url);
                setOpen(false);
              }}
              className="group relative overflow-hidden rounded-md border border-white/10"
              data-testid={`admin-media-pick-${m.id}`}
            >
              <img src={m.url} alt={m.filename} className="h-16 w-full object-contain" style={{ background: CHECKER }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function FieldsEditor({ groups, values, onChange, onSave, saving }) {
  return (
    <div className="space-y-8">
      {groups.map((g) => (
        <section key={g.title} className="rounded-2xl border border-white/10 bg-card2 p-6">
          <h3 className="font-display text-lg font-bold uppercase tracking-tight text-paper">{g.title}</h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {g.fields.map((f) =>
              f.type === "textarea" ? (
                <Area key={f.key} label={f.label} value={values?.[f.key]} onChange={(v) => onChange(f.key, v)} rows={f.rows || 3} />
              ) : f.type === "image" ? (
                <div key={f.key} className="sm:col-span-2">
                  <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.16em] text-muted">{f.label}</span>
                  <MediaPicker label={f.label} value={values?.[f.key]} onChange={(v) => onChange(f.key, v)} />
                </div>
              ) : (
                <Input key={f.key} label={f.label} type={f.type || "text"} value={values?.[f.key]} onChange={(v) => onChange(f.key, v)} />
              )
            )}
          </div>
        </section>
      ))}
      <SaveBar onSave={onSave} saving={saving} />
    </div>
  );
}
