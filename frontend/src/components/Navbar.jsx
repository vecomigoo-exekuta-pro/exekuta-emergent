import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { NAV } from "@/data/site";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-white/10 bg-ink/70 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
        data-testid="site-header"
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" data-testid="nav-logo-link" aria-label="EXEKUTA — página inicial">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Navegação principal">
            {NAV.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                data-testid={`nav-link-${l.label.toLowerCase().replace(" ", "-")}`}
                className={({ isActive }) =>
                  `link-underline font-mono text-[13px] uppercase tracking-[0.14em] transition-colors ${
                    isActive ? "text-acid" : "text-zinc-300 hover:text-paper"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Link
              to="/diagnostico"
              data-testid="nav-cta-diagnostico"
              className="group inline-flex items-center gap-2 rounded-full bg-acid px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-ink transition-transform duration-300 hover:scale-[1.04]"
            >
              Solicitar diagnóstico
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </nav>

          <button
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-paper lg:hidden"
            onClick={() => setOpen(true)}
            data-testid="nav-mobile-open-button"
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[80] flex flex-col bg-ink"
          >
            <div className="flex h-20 items-center justify-between px-4 sm:px-6">
              <Logo />
              <button
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-paper"
                onClick={() => setOpen(false)}
                data-testid="nav-mobile-close-button"
                aria-label="Fechar menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col justify-center gap-1.5 px-6" aria-label="Navegação mobile">
              {NAV.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.06 + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <NavLink
                    to={l.to}
                    end={l.end}
                    onClick={() => setOpen(false)}
                    data-testid={`nav-mobile-link-${l.label.toLowerCase().replace(" ", "-")}`}
                    className={({ isActive }) =>
                      `block py-1.5 font-display text-4xl font-extrabold uppercase tracking-tight ${
                        isActive ? "text-acid" : "text-paper"
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>
            <div className="px-6 pb-10">
              <Link
                to="/diagnostico"
                onClick={() => setOpen(false)}
                data-testid="nav-mobile-cta"
                className="inline-flex items-center gap-2 rounded-full bg-acid px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-ink"
              >
                Solicitar diagnóstico
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
