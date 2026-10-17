import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { ArrowUpRight, Database, ExternalLink, Loader2, LogOut } from "lucide-react";
import { Logo, LogoMark } from "@/components/Logo";
import AdminLogin from "@/admin/AdminLogin";
import FieldsEditor from "@/admin/FieldsEditor";
import FaqEditor from "@/admin/FaqEditor";
import ListEditor from "@/admin/ListEditor";
import MediaLibrary from "@/admin/MediaLibrary";
import ChatbotPanel from "@/admin/ChatbotPanel";
import { getToken, setToken, me, getCms, saveCms, getBackups, restoreBackup, cacheClear } from "@/cms/adminApi";
import { BRAND, FOOTER, HOME, ABOUT } from "@/cms/defaults";
import { FAQ } from "@/data/site";
import { SERVICES } from "@/data/services";
import { CASES } from "@/data/cases";

const TABS = [
  { id: "marca", label: "Marca" },
  { id: "rodape", label: "Rodapé" },
  { id: "home", label: "Home" },
  { id: "sobre", label: "Sobre" },
  { id: "faq", label: "FAQ" },
  { id: "servicos", label: "Serviços" },
  { id: "cases", label: "Cases" },
  { id: "chatbot", label: "Chatbot" },
  { id: "imagens", label: "Imagens" },
  { id: "backup", label: "Backup" },
];

const HOME_GROUPS = [
  {
    title: "Hero",
    fields: [
      { key: "heroEyebrow", label: "Etiqueta superior" },
      { key: "heroTitle1", label: "Título — linha 1" },
      { key: "heroTitle2", label: "Título — linha 2 (destaque verde)" },
      { key: "heroLead", label: "Subtítulo", type: "textarea" },
      { key: "heroCta1", label: "Botão 1" },
      { key: "heroCta2", label: "Botão 2" },
    ],
  },
  {
    title: "Faixas de texto",
    fields: [
      { key: "ticker", label: "Ticker do hero (separe por •)" },
      { key: "marqueeItems", label: "Letreiro grande (separe por •)", type: "textarea" },
    ],
  },
  {
    title: "Operação estratégica (showcase)",
    fields: [
      { key: "showcaseTitle", label: "Título" },
      { key: "showcaseLead", label: "Texto", type: "textarea" },
      { key: "showcaseItems", label: "Lista (1 item por linha)", type: "textarea", rows: 4 },
    ],
  },
  {
    title: "Seções de texto",
    fields: [
      { key: "outcomesTitle", label: "Outcomes — título" },
      { key: "outcomesLead", label: "Outcomes — texto", type: "textarea" },
      { key: "pilaresTitle", label: "Pilares — título" },
      { key: "pilaresLead", label: "Pilares — texto", type: "textarea" },
      { key: "servicesTitle", label: "Serviços — título" },
      { key: "servicesLead", label: "Serviços — texto", type: "textarea" },
      { key: "methodTitle", label: "Método — título" },
      { key: "diffTitle", label: "Diferenciais — título" },
      { key: "diffLead", label: "Diferenciais — texto", type: "textarea" },
      { key: "casesTitle", label: "Cases — título" },
      { key: "dashTitle", label: "Painel — título" },
      { key: "dashLead", label: "Painel — texto", type: "textarea" },
      { key: "aboutTitle", label: "Sobre (home) — título" },
      { key: "aboutLead", label: "Sobre (home) — texto", type: "textarea" },
      { key: "insightsTitle", label: "Insights — título" },
      { key: "faqTitle", label: "FAQ — título" },
      { key: "ctaTitle", label: "CTA final — título" },
      { key: "ctaLead", label: "CTA final — texto", type: "textarea" },
    ],
  },
];

const ABOUT_GROUPS = [
  {
    title: "Hero da página Sobre",
    fields: [
      { key: "sobreTitle1", label: "Título — linha 1" },
      { key: "sobreTitle2", label: "Título — linha 2 (destaque verde)" },
      { key: "sobreLead", label: "Subtítulo", type: "textarea" },
    ],
  },
  {
    title: "O nome",
    fields: [
      { key: "nomeLead1", label: "Parágrafo 1", type: "textarea" },
      { key: "nomeLead2", label: "Parágrafo 2", type: "textarea" },
    ],
  },
  {
    title: "Fundador",
    fields: [{ key: "fundadorBio", label: "Bio do fundador", type: "textarea", rows: 4 }],
  },
];

const BRAND_GROUPS = [
  {
    title: "Identidade da marca",
    fields: [
      { key: "companyName", label: "Nome da empresa" },
      { key: "tagline", label: "Assinatura curta" },
      { key: "shortDescription", label: "Descrição curta", type: "textarea", rows: 2 },
      { key: "instagramUrl", label: "Instagram (URL)" },
      { key: "logoUrl", label: "Logo principal", type: "image" },
      { key: "logoFooterUrl", label: "Logo do rodapé", type: "image" },
      { key: "faviconUrl", label: "Favicon", type: "image" },
    ],
  },
];

const FOOTER_GROUPS = [
  {
    title: "Contato e redes",
    fields: [
      { key: "address", label: "Endereço / cidade" },
      { key: "phone", label: "Telefone" },
      { key: "whatsappUrl", label: "WhatsApp (link wa.me)" },
      { key: "email", label: "E-mail" },
      { key: "instagramUrl", label: "Instagram (URL)" },
    ],
  },
  {
    title: "Textos",
    fields: [
      { key: "institutionalText", label: "Texto institucional", type: "textarea" },
      { key: "signatureLine1", label: "Assinatura — linha 1" },
      { key: "signatureLine2", label: "Assinatura — linha 2 (verde)" },
      { key: "copyright", label: "Copyright" },
    ],
  },
];

export default function AdminApp() {
  const [authed, setAuthed] = useState(!!getToken());
  const [checking, setChecking] = useState(!!getToken());
  const [content, setContent] = useState({});
  const [tab, setTab] = useState("marca");
  const [saving, setSaving] = useState(false);

  const loadContent = async () => {
    try {
      const data = await getCms();
      setContent(data.content || {});
    } catch (e) {
      toast.error(e.message);
    }
  };

  useEffect(() => {
    if (!authed) return;
    me()
      .then(() => loadContent())
      .catch(() => setAuthed(false))
      .finally(() => setChecking(false));
  }, [authed]);

  if (!authed) {
    return checking ? (
      <div className="flex min-h-screen items-center justify-center bg-ink">
        <Loader2 className="h-6 w-6 animate-spin text-acid" />
      </div>
    ) : (
      <AdminLogin onLogin={() => setAuthed(true)} />
    );
  }

  const saveScope = async (scope, data) => {
    setSaving(true);
    try {
      await saveCms(scope, data);
      toast.success("Conteúdo salvo. Backup da versão anterior criado.");
      await loadContent();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const merged = (scope, staticValue) =>
    content[scope] !== undefined ? content[scope] : staticValue;

  const TAB_TITLE = {
    marca: "Identidade da marca",
    rodape: "Rodapé do site",
    home: "Textos da Home",
    sobre: "Textos da página Sobre",
    faq: "Perguntas frequentes",
    servicos: "Serviços",
    cases: "Cases",
    chatbot: "Chatbot de captação de leads",
    imagens: "Biblioteca de imagens",
    backup: "Backups por seção",
  };

  return (
    <div className="min-h-screen bg-ink text-paper" data-testid="admin-panel">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:px-8">
        <aside className="lg:w-60 lg:shrink-0">
          <div className="flex items-center justify-between">
            <Logo />
            <button
              type="button"
              onClick={() => {
                setToken(null);
                setAuthed(false);
              }}
              data-testid="admin-logout"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted transition-colors hover:border-[#FF4D67] hover:text-[#FF4D67]"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sair
            </button>
          </div>

          <nav className="mt-8 flex flex-wrap gap-2 lg:flex-col" aria-label="Seções do CMS">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                data-testid={`admin-tab-${t.id}`}
                className={`rounded-xl border px-4 py-2.5 text-left text-sm font-semibold transition-colors ${
                  tab === t.id
                    ? "border-acid/50 bg-card2 text-acid"
                    : "border-white/10 text-muted hover:border-white/25"
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>

          <div className="mt-8 hidden rounded-2xl border border-white/10 bg-card2 p-5 lg:block">
            <LogoMark className="h-14 w-14" />
            <p className="mt-4 text-xs leading-relaxed text-muted">
              Alterações aparecem no site assim que novos visitantes abrirem
              cada página. Sem conteúdo salvo no banco, o site usa os textos
              atuais como padrão. Use "Publicar atualizações" para reforçar a
              renovação do cache.
            </p>
            <Link to="/" className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-acid" data-testid="admin-view-site">
              Ver site
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-acid">CMS Exekuta</p>
              <h1 className="mt-2 font-display text-2xl font-extrabold uppercase tracking-tight sm:text-3xl">
                {TAB_TITLE[tab]}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  cacheClear()
                    .then(() => toast.success("Publicado — visitantes já recebem o conteúdo atualizado."))
                    .catch((e) => toast.error(e.message))
                }
                data-testid="admin-publish-button"
                className="inline-flex items-center gap-2 rounded-full border border-acid/50 px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-acid transition-colors hover:bg-acid hover:text-ink"
              >
                Publicar atualizações
              </button>
              <ArrowUpRight className="hidden h-6 w-6 text-muted sm:block" />
            </div>
          </header>

          {tab === "imagens" ? (
            <MediaLibrary />
          ) : tab === "chatbot" ? (
            <ChatbotPanel />
          ) : tab === "backup" ? (
            <BackupPanel />
          ) : tab === "faq" ? (
            <FaqEditor
              values={merged("faq", FAQ)}
              onChange={(d) => setContent((c) => ({ ...c, faq: d }))}
              onSave={() => saveScope("faq", content.faq ?? FAQ)}
              saving={saving}
            />
          ) : tab === "servicos" ? (
            <ListEditor
              kind="servicos"
              items={merged("services", SERVICES.map((s, i) => ({ ...s, order: i + 1 })))}
              onChange={(d) => setContent((c) => ({ ...c, services: d }))}
              onSave={() => saveScope("services", content.services ?? SERVICES)}
              saving={saving}
            />
          ) : tab === "cases" ? (
            <ListEditor
              kind="cases"
              items={merged("cases", CASES.map((c, i) => ({ ...c, order: i + 1, active: true })))}
              onChange={(d) => setContent((c) => ({ ...c, cases: d }))}
              onSave={() => saveScope("cases", content.cases ?? CASES)}
              saving={saving}
            />
          ) : tab === "home" ? (
            <FieldsEditor
              groups={HOME_GROUPS}
              values={{ ...HOME, ...(content.home || {}) }}
              onChange={(key, val) => setContent((c) => ({ ...c, home: { ...(c.home || {}), [key]: val } }))}
              onSave={() => saveScope("home", { ...HOME, ...(content.home || {}) })}
              saving={saving}
            />
          ) : tab === "sobre" ? (
            <FieldsEditor
              groups={ABOUT_GROUPS}
              values={{ ...ABOUT, ...(content.about || {}) }}
              onChange={(key, val) => setContent((c) => ({ ...c, about: { ...(c.about || {}), [key]: val } }))}
              onSave={() => saveScope("about", { ...ABOUT, ...(content.about || {}) })}
              saving={saving}
            />
          ) : tab === "marca" ? (
            <FieldsEditor
              groups={BRAND_GROUPS}
              values={{ ...BRAND, ...(content.brand || {}) }}
              onChange={(key, val) => setContent((c) => ({ ...c, brand: { ...(c.brand || {}), [key]: val } }))}
              onSave={() => saveScope("brand", { ...BRAND, ...(content.brand || {}) })}
              saving={saving}
            />
          ) : (
            <FieldsEditor
              groups={FOOTER_GROUPS}
              values={{ ...FOOTER, ...(content.footer || {}) }}
              onChange={(key, val) => setContent((c) => ({ ...c, footer: { ...(c.footer || {}), [key]: val } }))}
              onSave={() => saveScope("footer", { ...FOOTER, ...(content.footer || {}) })}
              saving={saving}
            />
          )}
        </main>
      </div>
    </div>
  );
}

function BackupPanel() {
  const [scope, setScope] = useState("home");
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async (s = scope) => {
    setLoading(true);
    try {
      const data = await getBackups(s);
      setBackups(data.backups || []);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(scope);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope]);

  const restore = async (id) => {
    if (!window.confirm("Restaurar este backup? A versão atual será salva como novo backup.")) return;
    try {
      await restoreBackup(scope, id);
      toast.success("Backup restaurado.");
      await load(scope);
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <div className="space-y-6" data-testid="admin-backup-panel">
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-card2 p-5">
        <Database className="h-5 w-5 text-acid" />
        <span className="text-sm text-muted">Seção:</span>
        <select
          value={scope}
          onChange={(e) => setScope(e.target.value)}
          data-testid="admin-backup-scope-select"
          className="rounded-lg border border-white/15 bg-black px-3 py-2 text-sm text-paper outline-none focus:border-acid"
        >
          {["brand", "footer", "home", "about", "faq", "services", "cases"].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          Backup da versão anterior é criado automaticamente a cada salvamento
        </span>
      </div>

      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin text-acid" />
      ) : backups.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-white/15 p-10 text-center text-sm text-muted" data-testid="admin-backup-empty">
          Nenhum backup desta seção ainda — ele é criado na primeira alteração salva.
        </p>
      ) : (
        <div className="space-y-3">
          {backups.map((b) => (
            <div key={b.id} className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-card2 p-4">
              <div className="min-w-0">
                <p className="font-mono text-xs text-acid">{b.backup_at?.slice(0, 19).replace("T", " ")}</p>
                <p className="mt-1 truncate text-sm text-muted">
                  {typeof b.data === "string"
                    ? b.data.slice(0, 80)
                    : JSON.stringify(b.data).slice(0, 90)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => restore(b.id)}
                data-testid={`admin-backup-restore-${b.id}`}
                className="shrink-0 rounded-full border border-acid/40 px-4 py-2 text-xs font-bold uppercase tracking-wide text-acid"
              >
                Restaurar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
