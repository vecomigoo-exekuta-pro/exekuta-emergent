import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Copy, Loader2, Trash2, Upload } from "lucide-react";
import { getMedia, deleteMedia, uploadFile } from "@/cms/adminApi";

export default function MediaLibrary() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const load = async () => {
    try {
      const data = await getMedia();
      setItems(data.items || []);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await uploadFile(file);
      toast.success("Imagem enviada.");
      await load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const copyUrl = (url) => {
    navigator.clipboard?.writeText(`${window.location.origin}${url}`);
    toast.success("URL copiada.");
  };

  const remove = async (id) => {
    if (!window.confirm("Excluir esta imagem da biblioteca?")) return;
    try {
      await deleteMedia(id);
      toast.success("Imagem excluída.");
      await load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-card2 p-6">
        <h3 className="font-display text-lg font-bold uppercase tracking-tight">Enviar imagem</h3>
        <p className="mt-2 text-sm text-muted">
          PNG, JPG, WEBP, SVG ou GIF até 5 MB. Depois de enviar, copie a URL e cole nos campos de imagem
          (serviços, cases, marca) ou use o botão "Biblioteca".
        </p>
        <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif" onChange={onUpload} className="hidden" data-testid="admin-media-file-input" />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          data-testid="admin-media-upload-button"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-acid px-6 py-3 text-sm font-bold uppercase tracking-wide text-ink transition-transform hover:scale-[1.03] disabled:opacity-60"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          Escolher arquivo
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-muted">Carregando biblioteca...</p>
      ) : items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-white/15 p-10 text-center text-sm text-muted" data-testid="admin-media-empty">
          Nenhuma imagem na biblioteca ainda.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4" data-testid="admin-media-grid">
          {items.map((m) => (
            <div key={m.id} className="overflow-hidden rounded-2xl border border-white/10 bg-card2">
              <div className="h-32 bg-black">
                <img src={m.url} alt={m.filename} className="h-full w-full object-cover" loading="lazy" />
              </div>
              <div className="flex items-center justify-between gap-2 p-3">
                <span className="truncate font-mono text-[10px] text-muted">{m.filename}</span>
                <span className="flex shrink-0 gap-1.5">
                  <button type="button" onClick={() => copyUrl(m.url)} className="rounded-md border border-white/15 p-1.5 text-muted hover:text-acid" aria-label="Copiar URL" data-testid={`admin-media-copy-${m.id}`}>
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" onClick={() => remove(m.id)} className="rounded-md border border-white/15 p-1.5 text-muted hover:text-[#FF4D67]" aria-label="Excluir" data-testid={`admin-media-delete-${m.id}`}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
