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
import NotFound from "@/pages/NotFound";
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
                <Route path="/" element={<Home />} />
                <Route path="/sobre" element={<Sobre />} />
                <Route path="/servicos" element={<Servicos />} />
                <Route path="/servicos/:slug" element={<ServicoDetail />} />
                <Route path="/metodo" element={<Metodo />} />
                <Route path="/cases" element={<Cases />} />
                <Route path="/cases/:slug" element={<CaseDetail />} />
                <Route path="/insights" element={<Insights />} />
                <Route path="/insights/:slug" element={<ArtigoDetail />} />
                <Route path="/contato" element={<Contato />} />
                <Route path="/diagnostico" element={<Diagnostico />} />
                <Route path="/analise-seo" element={<AnaliseSeo />} />
                <Route path="*" element={<NotFound />} />
              </Route>
              <Route path="/admin" element={<AdminApp />} />
            </Routes>
            <Toaster position="bottom-left" theme="dark" />
          </div>
        </BrowserRouter>
      </ErrorBoundary>
    </CmsProvider>
  );
}

export default App;
