import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Eyebrow, FadeIn, Reveal } from "@/components/ui-motions";
import { SERVICES, WHATSAPP_URL } from "@/data/content";

export default function Servicos() {
  return (
    <div data-testid="servicos-page">
      <section className="relative overflow-hidden pb-16 pt-40 lg:pb-24 lg:pt-48">
        <div className="hero-grid absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <Eyebrow className="flex items-center gap-3">
              <span className="inline-block h-2 w-2 rounded-full bg-acid" />
              Serviços
            </Eyebrow>
          </FadeIn>
          <h1 className="mt-8 font-display text-4xl font-extrabold tracking-tighter leading-[0.98] sm:text-6xl lg:text-7xl">
            <span className="block overflow-hidden">
              <FadeIn delay={0.15}>
                <span>Toda a operação,</span>
              </FadeIn>
            </span>
            <span className="block overflow-hidden">
              <FadeIn delay={0.3}>
                <span className="text-acid">um só fluxo.</span>
              </FadeIn>
            </span>
          </h1>
          <FadeIn delay={0.5} className="mt-8 max-w-xl">
            <p className="text-base leading-relaxed text-zinc-400 sm:text-lg">
              Desenvolvimento, marketing, SEO, automação e infraestrutura —
              organizados em cinco pilares que operam juntos, com direção.
            </p>
          </FadeIn>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-24 px-4 pb-28 sm:px-6 lg:px-8">
        {SERVICES.map((cat) => (
          <section key={cat.id} className="grid gap-10 lg:grid-cols-12" data-testid={`servicos-categoria-${cat.id}`}>
            <div className="lg:col-span-4">
              <Reveal>
                <div className="lg:sticky lg:top-32">
                  <span className="text-outline font-display text-6xl font-extrabold">{cat.num}</span>
                  <h2 className="mt-6 font-display text-3xl font-bold tracking-tight">{cat.title}</h2>
                  <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.22em] text-acid">
                    {cat.tagline}
                  </p>
                </div>
              </Reveal>
            </div>
            <div className="lg:col-span-8">
              <div className="grid gap-5 sm:grid-cols-2">
                {cat.items.map((item, i) => (
                  <Reveal key={item.title} delay={i * 0.08} className="h-full">
                    <div className="group flex h-full flex-col rounded-2xl border border-white/10 bg-card2 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-acid/50">
                      <h3 className="font-display text-xl font-bold tracking-tight">{item.title}</h3>
                      <p className="mt-4 text-sm leading-relaxed text-zinc-400">{item.desc}</p>
                      <Link
                        to="/contato"
                        data-testid={`servicos-item-cta-${cat.id}-${i}`}
                        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-zinc-300 transition-colors group-hover:text-acid"
                      >
                        Solicitar proposta
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>

      <section className="border-t border-white/10 py-24" data-testid="servicos-cta">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <Reveal>
            <h2 className="font-display text-3xl font-extrabold tracking-tighter sm:text-5xl">
              Não sabe por onde começar?
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-zinc-400">
              O diagnóstico define onde competir, por quê e em qual ordem.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/contato"
                data-testid="servicos-cta-diagnostico"
                className="inline-flex items-center gap-2 rounded-full bg-acid px-8 py-4 text-sm font-semibold text-ink transition-transform duration-300 hover:scale-[1.04]"
              >
                Solicitar diagnóstico
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="servicos-cta-whatsapp"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-8 py-4 text-sm font-semibold transition-colors hover:border-acid hover:text-acid"
              >
                WhatsApp direto
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
