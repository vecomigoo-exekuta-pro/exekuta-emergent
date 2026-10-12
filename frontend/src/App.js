import { useEffect, Component } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Lenis from "lenis";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import Home from "@/pages/Home";
import Servicos from "@/pages/Servicos";
import Sobre from "@/pages/Sobre";
import Cases from "@/pages/Cases";
import CaseDetail from "@/pages/CaseDetail";
import Insights from "@/pages/Insights";
import Contato from "@/pages/Contato";

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
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollManager />
        <div className="grain" aria-hidden="true" />
        <div className="relative min-h-screen bg-ink text-paper selection:bg-acid selection:text-ink">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/servicos" element={<Servicos />} />
              <Route path="/sobre" element={<Sobre />} />
              <Route path="/cases" element={<Cases />} />
              <Route path="/cases/:slug" element={<CaseDetail />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/contato" element={<Contato />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          <Footer />
          <WhatsAppFloat />
          <Toaster position="bottom-left" theme="dark" />
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
