import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Bot, Download, Loader2, Search, Trash2 } from "lucide-react";
import { Area, Input, SaveBar } from "@/admin/FieldsEditor";
import { getBackups } from "@/cms/adminApi";

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

const MODE_LABEL = { auto: "Automático", semiauto: "Semiautomático", manual: "Manual" };
const STATUS_STYLE = {
  qualificado: "text-[#60FF8B] border-[#60FF8B]/40",
  nao_qualificado: "text-[#FF4D67] border-[#FF4D67]/40",
  atendimento_humano: "text-acid border-acid/40",
  novo: "text-muted border-white/20",
};

function ConversationDetail({ id, onBack }) {
  const [detail, setDetail] = useState(null);
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      setDetail(await authFetch(`/admin/chat/conversations/${id}`));
    } catch (e) {
      toast.error(e.message);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (!detail) return <Loader2 className="h-5 w-5 animate-spin text-acid" />;

  const act = async (fn, msg) => {
    setBusy(true);
    try {
      await fn();
      toast.success(msg);
      await load();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  const lead = detail.lead || {};

  return (
    <div className="space-y-5" data-testid="admin-chat-detail">
      <button type="button" onClick={onBack} className="font-mono text-xs uppercase tracking-[0.18em] text-muted hover:text-acid">
        ← Voltar às conversas
      </button>

      <div className="grid gap-3 rounded-2xl border border-white/10 bg-card2 p-5 sm:grid-cols-2">
        {[["Nome", lead.nome], ["Empresa", lead.empresa], ["Site", lead.site], ["E-mail", lead.email], ["Telefone/WhatsApp", lead.telefone], ["Serviço", lead.servico], ["Objetivo", lead.objetivo], ["Dificuldade", lead.dificuldade], ["Prazo", lead.prazo], ["LGPD", lead.consent ? "Consentimento dado" : "Sem consentimento registrado"]].map(([k, v]) => (
          <div key={k}>
            <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{k}</span>
            <strong className="block text-sm font-semibold text-paper">{v || "—"}</strong>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Modo:</span>
        {["auto", "semiauto", "manual"].map((m) => (
          <button
            key={m}
            type="button"
            disabled={busy}
            onClick={() => act(() => authFetch(`/admin/chat/conversations/${id}/mode`, { method: "POST", body: { mode: m } }), `Modo alterado para ${MODE_LABEL[m]}.`)}
            data-testid={`admin-chat-mode-${m}`}
            className={`rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wide ${detail.mode === m ? "border-acid bg-acid text-ink" : "border-white/20 text-muted"}`}
          >
            {MODE_LABEL[m]}
          </button>
        ))}
        <span className="ml-auto flex gap-2">
          <button type="button" disabled={busy} onClick={() => act(() => authFetch(`/admin/chat/conversations/${id}/qualify`, { method: "POST", body: { status: "qualificado" } }), "Lead marcado como qualificado.")} data-testid="admin-chat-qualify-yes" className="rounded-full border border-[#60FF8B]/40 px-4 py-1.5 text-xs font-bold uppercase text-[#60FF8B]">Qualificado</button>
          <button type="button" disabled={busy} onClick={() => act(() => authFetch(`/admin/chat/conversations/${id}/qualify`, { method: "POST", body: { status: "nao_qualificado" } }), "Lead marcado como não qualificado.")} data-testid="admin-chat-qualify-no" className="rounded-full border border-[#FF4D67]/40 px-4 py-1.5 text-xs font-bold uppercase text-[#FF4D67]">Não qualificado</button>
        </span>
      </div>

      <div className="max-h-80 space-y-3 overflow-y-auto rounded-2xl border border-white/10 bg-card2 p-4" data-testid="admin-chat-thread">
        {detail.messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-start" : "justify-end"}`}>
            <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${m.role === "user" ? "bg-black text-paper" : m.role === "admin" ? "bg-acid/15 text-paper" : "bg-surface text-paper"}`}>
              <span className="mb-0.5 block font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
                {m.role === "user" ? "Visitante" : m.role === "admin" ? "Especialista" : "Assistente"} · {(m.at || "").slice(11, 16)}
              </span>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Responder como especialista (assumir conversa)..."
          data-testid="admin-chat-reply-input"
          className="w-full rounded-full border border-white/15 bg-black px-4 py-3 text-sm text-paper placeholder:text-zinc-600 outline-none focus:border-acid"
        />
        <button
          type="button"
          disabled={busy || !reply.trim()}
          onClick={() =>
            act(async () => {
              await authFetch(`/admin/chat/conversations/${id}/reply`, { method: "POST", body: { text: reply } });
              setReply("");
            }, "Resposta enviada ao visitante.")
          }
          data-testid="admin-chat-reply-send"
          className="shrink-0 rounded-full bg-acid px-6 py-3 text-sm font-bold uppercase tracking-wide text-ink disabled:opacity-60"
        >
          Responder
        </button>
      </div>
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
        Responder assume a conversa (modo Manual). Para devolver ao chatbot, selecione Semiautomático acima.
      </p>
    </div>
  );
}

function ConversasTab() {
  const [items, setItems] = useState(null);
  const [openId, setOpenId] = useState(null);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    try {
      const data = await authFetch("/admin/chat/conversations");
      setItems(data.items || []);
    } catch (e) {
      toast.error(e.message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (openId) return <ConversationDetail id={openId} onBack={() => setOpenId(null)} />;

  const filtered = (items || []).filter(
    (c) =>
      !search.trim() ||
      `${c.lead?.nome || ""} ${c.lead?.empresa || ""} ${c.lead?.site || ""} ${c.lead?.email || ""} ${c.lead?.telefone || ""}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-52">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, empresa, site ou contato"
            data-testid="admin-chat-search"
            className="w-full rounded-full border border-white/15 bg-black py-2.5 pl-10 pr-4 text-sm text-paper placeholder:text-zinc-600 outline-none focus:border-acid"
          />
        </div>
        <button type="button" onClick={load} className="rounded-full border border-white/20 px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-muted">Atualizar</button>
      </div>

      {items === null ? (
        <Loader2 className="h-5 w-5 animate-spin text-acid" />
      ) : filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-white/15 p-10 text-center text-sm text-muted" data-testid="admin-chat-empty">
          Nenhuma conversa ainda. Elas aparecem aqui assim que um visitante iniciar o chat.
        </p>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setOpenId(c.id)}
              data-testid={`admin-chat-conv-${c.id}`}
              className="flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-card2 p-5 text-left transition-colors hover:border-acid/50"
            >
              <Bot className={`h-5 w-5 shrink-0 ${c.needs_human ? "text-acid" : "text-muted"}`} />
              <div className="min-w-0 flex-1">
                <p className="font-display text-sm font-bold tracking-tight">
                  {c.lead?.nome || "Visitante"} {c.lead?.empresa ? `· ${c.lead.empresa}` : ""}
                  {c.needs_human && (
                    <span className="ml-2 rounded-full border border-acid/40 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide text-acid">
                      precisa de humano
                    </span>
                  )}
                </p>
                <p className="truncate text-sm text-muted">{c.last_message || "—"}</p>
              </div>
              <span className="hidden shrink-0 font-mono text-[10px] uppercase tracking-wide text-muted sm:block">
                {MODE_LABEL[c.mode] || c.mode}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function LeadsTab() {
  const [items, setItems] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [servico, setServico] = useState("");

  const load = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (status) params.set("status", status);
      if (servico) params.set("servico", servico);
      const data = await authFetch(`/admin/chat/leads?${params.toString()}`);
      setItems(data.items || []);
    } catch (e) {
      toast.error(e.message);
    }
  }, [search, status, servico]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const remove = async (id) => {
    if (!window.confirm("Excluir os dados pessoais deste lead? O histórico será anonimizado.")) return;
    try {
      await authFetch(`/admin/chat/leads/${id}`, { method: "DELETE" });
      toast.success("Dados pessoais excluídos.");
      await load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const exportCsv = async () => {
    try {
      const token = localStorage.getItem("exk_admin_token");
      const res = await fetch(`${API}/admin/chat/leads/export`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("Falha ao exportar");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "leads-exekuta.csv";
      a.click();
      URL.revokeObjectURL(url);
      toast.success("CSV exportado.");
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-card2 p-4">
        <div className="relative min-w-52 flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar nome, empresa, site, e-mail ou telefone" data-testid="admin-leads-search" className="w-full rounded-full border border-white/15 bg-black py-2.5 pl-10 pr-4 text-sm text-paper placeholder:text-zinc-600 outline-none focus:border-acid" />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} data-testid="admin-leads-filter-status" className="rounded-full border border-white/15 bg-black px-4 py-2.5 text-sm text-paper outline-none focus:border-acid">
          <option value="">Todos os status</option>
          <option value="novo">Novo</option>
          <option value="qualificado">Qualificado</option>
          <option value="nao_qualificado">Não qualificado</option>
          <option value="atendimento_humano">Atendimento humano</option>
        </select>
        <select value={servico} onChange={(e) => setServico(e.target.value)} data-testid="admin-leads-filter-servico" className="rounded-full border border-white/15 bg-black px-4 py-2.5 text-sm text-paper outline-none focus:border-acid">
          <option value="">Todos os serviços</option>
          <option value="SEO">SEO</option>
          <option value="Tráfego">Tráfego</option>
          <option value="Conteúdo">Conteúdo</option>
          <option value="Análise">Análise / dados</option>
          <option value="Automação">Automação</option>
        </select>
        <button type="button" onClick={exportCsv} data-testid="admin-leads-export" className="inline-flex items-center gap-2 rounded-full border border-acid/40 px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-acid">
          <Download className="h-3.5 w-3.5" />
          Exportar CSV
        </button>
      </div>

      {items === null ? (
        <Loader2 className="h-5 w-5 animate-spin text-acid" />
      ) : items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-white/15 p-10 text-center text-sm text-muted" data-testid="admin-leads-empty">
          Nenhum lead capturado ainda.
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((l) => (
            <div key={l.id} className="rounded-2xl border border-white/10 bg-card2 p-5" data-testid={`admin-lead-${l.id}`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-display text-base font-bold tracking-tight">
                    {l.nome || "(sem nome)"} <span className="text-muted">· {l.empresa || "—"}</span>
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {[l.email, l.telefone, l.site].filter(Boolean).join(" · ") || "sem contato"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-wide ${STATUS_STYLE[l.status] || STATUS_STYLE.novo}`}>
                    {l.status}
                  </span>
                  <button type="button" onClick={() => remove(l.id)} className="rounded-md border border-white/15 p-2 text-muted hover:text-[#FF4D67]" aria-label="Excluir dados pessoais" data-testid={`admin-lead-delete-${l.id}`}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div className="mt-4 grid gap-2 text-xs text-muted sm:grid-cols-2">
                <p><strong className="text-paper">Interesse:</strong> {l.servico || "—"}</p>
                <p><strong className="text-paper">Prazo:</strong> {l.prazo || "—"}</p>
                <p className="sm:col-span-2"><strong className="text-paper">Objetivo:</strong> {l.objetivo || "—"}</p>
                <p className="sm:col-span-2"><strong className="text-paper">Dificuldade:</strong> {l.dificuldade || "—"}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ConfigTab() {
  const [config, setConfig] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await authFetch("/admin/chat/config");
      setConfig(data.config);
    } catch (e) {
      toast.error(e.message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (!config) return <Loader2 className="h-5 w-5 animate-spin text-acid" />;

  return (
    <div className="space-y-8" data-testid="admin-chat-config">
      <section className="rounded-2xl border border-white/10 bg-card2 p-6">
        <h3 className="font-display text-lg font-bold uppercase tracking-tight">Modo de operação</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { id: "auto", label: "Automático", desc: "Responde FAQs e conduz a qualificação." },
            { id: "semiauto", label: "Semiautomático", desc: "Responde rotina e sinaliza decisões para você." },
            { id: "manual", label: "Manual", desc: "Pausa o chatbot; só o especialista responde." },
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setConfig({ ...config, mode: m.id })}
              data-testid={`admin-chat-config-mode-${m.id}`}
              className={`rounded-xl border p-4 text-left transition-colors ${config.mode === m.id ? "border-acid bg-acid/10" : "border-white/15 hover:border-white/30"}`}
            >
              <strong className="block font-display text-sm font-bold uppercase tracking-tight">{m.label}</strong>
              <span className="mt-1 block text-xs text-muted">{m.desc}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-card2 p-6">
        <h3 className="font-display text-lg font-bold uppercase tracking-tight">Mensagem inicial</h3>
        <Area label="" value={config.welcome} onChange={(v) => setConfig({ ...config, welcome: v })} rows={4} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-card2 p-6">
        <h3 className="font-display text-lg font-bold uppercase tracking-tight">Perguntas frequentes e respostas aprovadas</h3>
        <p className="mt-2 text-sm text-muted">O chatbot usa estas respostas para as opções rápidas e para perguntas parecidas.</p>
        <div className="mt-5 space-y-3">
          {(config.faqs || []).map((f, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-black p-4">
              <Input label={`Pergunta ${i + 1}`} value={f.q} onChange={(v) => setConfig({ ...config, faqs: config.faqs.map((x, xi) => (xi === i ? { ...x, q: v } : x)) })} />
              <div className="mt-3">
                <Area label="Resposta aprovada" value={f.a} onChange={(v) => setConfig({ ...config, faqs: config.faqs.map((x, xi) => (xi === i ? { ...x, a: v } : x)) })} rows={2} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <SaveBar
        onSave={async () => {
          setSaving(true);
          try {
            await authFetch("/admin/chat/config", { method: "PUT", body: { data: config } });
            toast.success("Configuração do chatbot salva.");
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

export default function ChatbotPanel() {
  const [tab, setTab] = useState("conversas");
  return (
    <div className="space-y-6" data-testid="admin-chatbot-panel">
      <div className="flex flex-wrap gap-2">
        {[
          ["conversas", "Conversas"],
          ["leads", "Leads"],
          ["config", "Configuração"],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            data-testid={`admin-chatbot-tab-${id}`}
            className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors ${tab === id ? "border-acid/50 bg-card2 text-acid" : "border-white/10 text-muted hover:border-white/25"}`}
          >
            {label}
          </button>
        ))}
      </div>
      {tab === "conversas" ? <ConversasTab /> : tab === "leads" ? <LeadsTab /> : <ConfigTab />}
    </div>
  );
}
