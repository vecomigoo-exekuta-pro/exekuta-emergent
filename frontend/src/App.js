import { useEffect, Component } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation, Outlet } from "react-router-dom";
import Lenis from "lenis";
import { Toaster } from "sonner";
import { CmsProvider } from "@/cms/CmsContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import Home from "@/pages/Home";
import Sobre from "@/pages/Sobre";
import Servicos from "@/pages/Servicos";
import ServicoDetail from "@/pages/ServicoDetail";
import Metodo from "@/pages/Metodo";
import Cases from "@/pages/Cases";
import CaseDetail from "@/pages/CaseDetail";
import Insights from "@/pages/Insights";
import ArtigoDetail from "@/pages/ArtigoDetail";
import Contato from "@/pages/Contato";
import Diagnostico from "@/pages/Diagnostico";
import AnaliseSeo from "@/pages/AnaliseSeo";
import LojaPage from "@/loja/LojaPage";
import CriacaoSites from "@/pages/CriacaoSites";
import NotFound from "@/pages/NotFound";
import Seo from "@/components/Seo";
import { FAQ } from "@/data/site";

// Metadados por rota — cada página indexável tem title, description e canonical próprios.
function Meta({ seo, children }) {
  return (
    <>
      <Seo {...seo} />
      {children}
    </>
  );
}

const HOME_SEO = {
  title: "Agência de SEO no Rio de Janeiro | EXEKUTA",
  description:
    "Agência de SEO especializada em otimização de sites, SEO técnico e estratégias de crescimento orgânico para empresas.",
  path: "/",
  jsonLd: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  },
};

const SOBRE_SEO = {
  title: "Sobre a EXEKUTA | Agência de SEO",
  description:
    "Conheça a EXEKUTA, sua metodologia de análise, planejamento e execução de estratégias de SEO e crescimento digital.",
  path: "/sobre",
};

const SERVICOS_SEO = {
  title: "Serviços de SEO e Marketing Digital | EXEKUTA",
  description:
    "Conheça os serviços da EXEKUTA: SEO técnico, otimização de sites, criação de sites, SEO local e estratégias de marketing digital.",
  path: "/servicos",
};

const METODO_SEO = {
  title: "Método de SEO da EXEKUTA | Pilares e Execução",
  description:
    "Conheça o método EXEKUTA: análise, planejamento, execução e mensuração organizados em ciclos contínuos de melhoria de SEO.",
  path: "/metodo",
};

const CASES_SEO = {
  title: "Cases de SEO | Projetos Autorizados | EXEKUTA",
  description:
    "Projetos autorizados com cenário, execução e critérios de verificação apresentados antes de qualquer métrica ser comunicada.",
  path: "/cases",
};

const INSIGHTS_SEO = {
  title: "Insights de SEO e Marketing Digital | EXEKUTA",
  description:
    "Artigos e análises sobre SEO, busca e desempenho digital, escritos para quem decide estratégia e acompanha a execução.",
  path: "/insights",
};

const CONTATO_SEO = {
  title: "Contato | EXEKUTA — Agência de SEO no Rio de Janeiro",
  description:
    "Apresente seu cenário, site e objetivo. A EXEKUTA responde com o próximo passo adequado: diagnóstico, auditoria ou proposta.",
  path: "/contato",
};

const DIAGNOSTICO_SEO = {
  title: "Diagnóstico de SEO para Empresas | EXEKUTA",
  description:
    "Apresente contexto, site e objetivo: o diagnóstico organiza o cenário para definir o próximo passo com clareza e critério.",
  path: "/diagnostico",
};

const ANALISESEO_SEO = {
  title: "Análise SEO Gratuita de Site | EXEKUTA",
  description:
    "Analise os aspectos técnicos e on-page do seu site e identifique oportunidades de melhoria para sua presença orgânica no Google.",
  path: "/analise-seo",
};

const LOJA_SEO = {
  title: "Loja de Artes Gráficas | EXEKUTA",
  description:
    "Templates, logos e materiais gráficos em formato digital e impresso. Monte o carrinho e finalize o pedido pelo WhatsApp.",
  path: "/loja",
};
import AdminApp from "@/admin/AdminApp";
import ChatbotPanel from "@/admin/ChatbotPanel";
import ChatWidget from "@/components/ChatWidget";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { err: null };
  }
  static getDerivedStateFromError(e) {
    return { err: e };
  }
  render() {
    if (this.state.err) {
      return (
        <div className="min-h-screen bg-ink text-paper flex flex-col items-center justify-center gap-4 p-8 text-center">
          <p className="font-display text-2xl font-bold">Algo saiu do lugar.</p>
          <button
            data-testid="error-reload-button"
            onClick={() => window.location.reload()}
            className="rounded-full bg-acid px-6 py-3 font-semibold text-ink"
          >
            Recarregar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function ScrollManager() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PublicLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloat />
      <ChatWidget />
    </>
  );
}

function App() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    window.__lenis = lenis;
    let raf;
    const loop = (t) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  return (
    <CmsProvider>
      <ErrorBoundary>
        <BrowserRouter>
          <ScrollManager />
          <div className="grain" aria-hidden="true" />
          <div className="relative min-h-screen bg-ink text-paper selection:bg-acid selection:text-ink">
            <Routes>
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Meta seo={HOME_SEO}><Home /></Meta>} />
                <Route path="/sobre" element={<Meta seo={SOBRE_SEO}><Sobre /></Meta>} />
                <Route path="/servicos" element={<Meta seo={SERVICOS_SEO}><Servicos /></Meta>} />
                <Route path="/servicos/:slug" element={<ServicoDetail />} />
                <Route path="/metodo" element={<Meta seo={METODO_SEO}><Metodo /></Meta>} />
                <Route path="/cases" element={<Meta seo={CASES_SEO}><Cases /></Meta>} />
                <Route path="/cases/:slug" element={<CaseDetail />} />
                <Route path="/insights" element={<Meta seo={INSIGHTS_SEO}><Insights /></Meta>} />
                <Route path="/insights/:slug" element={<ArtigoDetail />} />
                <Route path="/contato" element={<Meta seo={CONTATO_SEO}><Contato /></Meta>} />
                <Route path="/diagnostico" element={<Meta seo={DIAGNOSTICO_SEO}><Diagnostico /></Meta>} />
                <Route path="/analise-seo" element={<Meta seo={ANALISESEO_SEO}><AnaliseSeo /></Meta>} />
                <Route path="/loja" element={<Meta seo={LOJA_SEO}><LojaPage /></Meta>} />
                <Route path="/criacao-de-sites" element={<CriacaoSites />} />
                <Route path="*" element={<NotFound />} />
              </Route>
              <Route path="/admin" element={<><Seo title="Painel Administrativo | EXEKUTA" description="Acesso restrito ao painel de gestão de conteúdo." noindex /><AdminApp /></>} />
            </Routes>
            <Toaster position="bottom-left" theme="dark" />
          </div>
        </BrowserRouter>
      </ErrorBoundary>
    </CmsProvider>
  );
}

export default App;
