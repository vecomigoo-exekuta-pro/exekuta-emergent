import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { ArrowRight, ArrowUpRight, Check, Plus } from "lucide-react";
import { MaskedLines, FadeIn, Eyebrow, Reveal, Marquee } from "@/components/ui-motions";
import QuickAnalyzer from "@/components/QuickAnalyzer";
import PerformanceBoard from "@/components/PerformanceBoard";
import { LogoMark } from "@/components/Logo";
import { TICKER, OUTCOMES, DIFFERENTIALS, FAQ, PILLARS, INSTAGRAM } from "@/data/site";
import { SERVICES } from "@/data/services";
import { METHOD_STEPS } from "@/data/method";
import { CASES, CASE_DISCLAIMER } from "@/data/cases";
import { INSIGHTS } from "@/data/insights";

const EASE = [0.16, 1, 0.3, 1];

function Hero() {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 700], [0, 120]);
  const heroOpacity = useTransform(scrollY, [0, 550], [1, 0]);

  const onMouseMove = (e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 22);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 22);
  };

  return (
    <section ref={ref} onMouseMove={onMouseMove} className="relative overflow-hidden pt-32 lg:pt-40" data-testid="home-hero">
      <video
        ref={(v) => {
          if (v) {
            v.play().catch(() => {});
          }
        }}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop"
        className="absolute inset-0 h-full w-full object-cover opacity-30"
        data-testid="hero-video"
        aria-hidden="true"
      >
        <source src="/videos/team-hero.webm" type="video/webm" />
        <source src="/videos/team-hero.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/55 to-ink" aria-hidden="true" />
      <div className="hero-grid absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="hero-glow pointer-events-none absolute -top-32 left-1/2 h-[560px] w-[860px] -translate-x-1/2" aria-hidden="true" />
      <motion.div style={{ x: sx, y: sy }} className="pointer-events-none absolute -right-20 top-16 hidden opacity-80 lg:block" aria-hidden="true">
        <img src="/brand/logo-exekuta-angular.png" alt="" className="h-72 w-72 opacity-40" />
      </motion.div>

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pb-16 sm:px-6 lg:grid-cols-2 lg:gap-10 lg:px-8">
        <motion.div style={{ y: heroY, opacity: heroOpacity }}>
          <FadeIn>
            <Eyebrow className="flex items-center gap-3">
              <span className="inline-block h-2 w-2 rounded-full bg-acid" />
              SEO • Performance • Crescimento
            </Eyebrow>
          </FadeIn>
          <h1 className="mt-7 font-display text-4xl font-extrabold uppercase tracking-tight leading-[0.98] sm:text-6xl lg:text-7xl">
            <MaskedLines
              lines={["SEO que gera", <strong key="l2" className="text-acid">resultados reais.</strong>]}
              baseDelay={0.15}
              delayStep={0.16}
            />
          </h1>
          <FadeIn delay={0.55} className="mt-7 max-w-xl">
            <p className="text-base leading-relaxed text-zinc-400 sm:text-lg">
              Estratégia avançada, execução técnica e foco total em crescimento
              orgânico para marcas que não querem apenas aparecer — querem
              ocupar posições, gerar oportunidades e crescer com consistência.
            </p>
          </FadeIn>
          <FadeIn delay={0.7} className="mt-9 flex flex-wrap gap-4">
            <Link
              to="/diagnostico"
              data-testid="hero-cta-diagnostico"
              className="group inline-flex items-center gap-2 rounded-full bg-acid px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-ink transition-transform duration-300 hover:scale-[1.04]"
            >
              Solicitar diagnóstico
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/cases"
              data-testid="hero-cta-cases"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-paper transition-colors duration-300 hover:border-acid hover:text-acid"
            >
              Ver cases
            </Link>
          </FadeIn>
          <FadeIn delay={0.85} className="mt-10 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
            <span>Dados antes de decisões</span>
            <span className="text-acid">/</span>
            <span>Estratégia antes da execução</span>
          </FadeIn>
        </motion.div>

        <FadeIn delay={0.4} className="lg:pt-10">
          <QuickAnalyzer />
        </FadeIn>
      </div>

      <FadeIn delay={0.9} className="relative border-t border-white/10 bg-surface/60 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-4 font-mono text-[11px] uppercase tracking-[0.24em] text-zinc-400 sm:px-6 lg:px-8">
          {TICKER.map((t, i) => (
            <span key={t} className="flex items-center gap-4">
              <span className={i === 2 ? "text-acid" : ""}>{t}</span>
              {i < TICKER.length - 1 && <ArrowRight className="h-3 w-3 text-acid" />}
            </span>
          ))}
        </div>
      </FadeIn>
    </section>
  );
}

function Showcase() {
  return (
    <section className="py-24 lg:py-32" data-testid="home-showcase">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <img src="/artwork/seo-office-workspace.svg" alt="Ambiente de escritório com painéis de análise e planejamento estratégico de SEO" className="w-full" loading="lazy" />
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <Eyebrow>Operação estratégica</Eyebrow>
          <h2 className="mt-4 font-display text-3xl font-bold uppercase tracking-tight leading-[1.05] sm:text-4xl">
            Análise, planejamento e execução no mesmo fluxo.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-400">
            O trabalho de SEO precisa sair da abstração: leitura de cenário,
            priorização, documentação e acompanhamento contínuo em um mesmo
            fluxo de execução.
          </p>
          <ul className="mt-7 space-y-3.5">
            {[
              "Diagnóstico com leitura técnica e comercial",
              "Planejamento com prioridades documentadas",
              "Execução acompanhada por indicadores e contexto",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-zinc-300">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-acid" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

function Outcomes() {
  return (
    <section className="border-y border-white/10 bg-surface py-24 lg:py-32" data-testid="home-outcomes">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <Eyebrow>Visibilidade com objetivo</Eyebrow>
          <h2 className="mt-4 max-w-2xl font-display text-3xl font-bold uppercase tracking-tight leading-[1.05] sm:text-4xl">
            SEO não é apenas posição. É crescimento com direção.
          </h2>
          <p className="mt-5 max-w-xl text-zinc-400">
            Aparecer é um sinal. O valor surge quando a presença orgânica atrai
            demanda relevante, sustenta uma experiência clara e contribui para
            uma ação de negócio.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {OUTCOMES.map((o, i) => (
            <Reveal key={o.tag} delay={i * 0.1} className="h-full">
              <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-ink p-8 transition-all duration-300 hover:-translate-y-1 hover:border-acid/50">
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-acid">{o.tag}</span>
                <h3 className="mt-8 font-display text-xl font-bold tracking-tight">{o.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{o.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pillars() {
  return (
    <section className="py-24 lg:py-32" data-testid="home-pilares">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <Eyebrow>Essência Exekuta</Eyebrow>
          <h2 className="mt-4 max-w-2xl font-display text-3xl font-bold uppercase tracking-tight leading-[1.05] sm:text-4xl">
            Três pilares. Uma disciplina de crescimento.
          </h2>
          <p className="mt-5 max-w-xl text-zinc-400">
            A estratégia define a direção. A execução transforma prioridade em
            entrega. Os resultados realimentam o próximo ciclo.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {PILLARS.map((p, i) => (
            <Reveal key={p.num} delay={i * 0.1} className="h-full">
              <div className="group flex h-full flex-col rounded-2xl border border-white/10 bg-card2 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-acid/50">
                <span className="text-outline font-display text-5xl font-extrabold">{p.num}</span>
                <h3 className="mt-14 font-display text-2xl font-bold tracking-tight">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{p.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section className="border-y border-white/10 bg-surface py-24 lg:py-32" data-testid="home-servicos">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <Eyebrow>Serviços</Eyebrow>
          <h2 className="mt-4 max-w-2xl font-display text-3xl font-bold uppercase tracking-tight leading-[1.05] sm:text-4xl">
            Da direção estratégica à melhoria contínua.
          </h2>
          <p className="mt-5 max-w-xl text-zinc-400">
            Cada frente resolve um tipo de barreira. O diagnóstico mostra quais
            delas realmente merecem prioridade.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 3) * 0.08} className="h-full">
              <Link
                to={`/servicos/${s.slug}`}
                data-testid={`home-service-card-${s.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink p-7 transition-all duration-300 hover:-translate-y-1 hover:border-acid/50"
              >
                <div className="-mx-7 -mt-7 mb-6 h-36 overflow-hidden border-b border-white/10">
                  <img
                    src={s.image}
                    alt={`Serviço ${s.name} — EXEKUTA`}
                    className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
                    loading="lazy"
                  />
                </div>
                <div className="flex items-start justify-between">
                  <span className="font-mono text-xs tracking-[0.25em] text-acid">{s.num}</span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition-all duration-300 group-hover:rotate-45 group-hover:border-acid group-hover:text-acid">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
                <h3 className="mt-12 font-display text-xl font-bold tracking-tight">{s.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{s.card}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-zinc-300 transition-colors group-hover:text-acid">
                  Conhecer serviço
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Method() {
  return (
    <section className="py-24 lg:py-32" data-testid="home-metodo">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <Eyebrow>Método Exekuta</Eyebrow>
          <h2 className="mt-4 max-w-2xl font-display text-3xl font-bold uppercase tracking-tight leading-[1.05] sm:text-4xl">
            Um processo que reduz ruído e aumenta clareza.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-5">
          {METHOD_STEPS.map((m, i) => (
            <Reveal key={m.num} delay={i * 0.07} className="h-full">
              <div className="flex h-full flex-col bg-ink p-7 transition-colors duration-300 hover:bg-card2">
                <span className="text-outline font-display text-5xl font-extrabold">{m.num}</span>
                <h3 className="mt-8 font-display text-lg font-bold tracking-tight">{m.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{m.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2}>
          <Link
            to="/metodo"
            data-testid="home-metodo-link"
            className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-zinc-300 transition-colors hover:text-acid"
          >
            Conhecer o método em detalhe
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

function Differentials() {
  return (
    <section className="border-y border-white/10 bg-surface py-24 lg:py-32" data-testid="home-diferenciais">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <Reveal>
          <Eyebrow>Diferenciais</Eyebrow>
          <h2 className="mt-4 font-display text-3xl font-bold uppercase tracking-tight leading-[1.05] sm:text-4xl">
            Não entregamos tarefas. Construímos <span className="text-acid">performance.</span>
          </h2>
          <p className="mt-5 max-w-md text-zinc-400">
            O trabalho precisa indicar por que uma ação existe, como será
            validada e qual decisão pode surgir depois dela.
          </p>
        </Reveal>
        <div className="grid gap-x-8 sm:grid-cols-2">
          {DIFFERENTIALS.map((d, i) => (
            <Reveal key={d} delay={i * 0.06}>
              <div className="flex items-start gap-3 border-b border-white/10 py-4 text-sm text-zinc-300">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-acid" />
                {d}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CasesPreview() {
  return (
    <section className="py-24 lg:py-32" data-testid="home-cases">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <Eyebrow>Cases</Eyebrow>
          <h2 className="mt-4 max-w-2xl font-display text-3xl font-bold uppercase tracking-tight leading-[1.05] sm:text-4xl">
            Projetos reais já cadastrados no portfólio.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CASES.slice(0, 4).map((c, i) => (
            <Reveal key={c.slug} delay={(i % 4) * 0.08} className="h-full">
              <Link
                to={`/cases/${c.slug}`}
                data-testid={`home-case-card-${c.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-card2 transition-all duration-300 hover:-translate-y-1 hover:border-acid/50"
              >
                <div className="h-52 overflow-hidden border-b border-white/10 bg-surface">
                  <img
                    src={c.screenshot}
                    alt={`Captura do site ${c.name}, case real da EXEKUTA`}
                    className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <span className="w-fit rounded-full border border-acid/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-acid">
                    {c.name}
                  </span>
                  <h3 className="mt-4 font-display text-lg font-bold tracking-tight">{c.cardTitle}</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-zinc-400">{c.lead}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.15}>
          <p className="mt-8 max-w-3xl font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-zinc-600">
            {CASE_DISCLAIMER}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function DashboardSection() {
  return (
    <section className="border-y border-white/10 bg-surface py-24 lg:py-32" data-testid="home-dashboard">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <Reveal>
          <Eyebrow>Painel de performance</Eyebrow>
          <h2 className="mt-4 font-display text-3xl font-bold uppercase tracking-tight leading-[1.05] sm:text-4xl">
            Menos vaidade. Mais sinal para decidir.
          </h2>
          <p className="mt-5 max-w-xl text-zinc-400">
            Visibilidade, páginas estratégicas, saúde técnica e conversões
            precisam ser lidas em conjunto. O painel demonstra a arquitetura
            visual sem usar dados de clientes.
          </p>
        </Reveal>
        <Reveal delay={0.12}>
          <PerformanceBoard id="home" />
        </Reveal>
      </div>
    </section>
  );
}

function AboutPreview() {
  return (
    <section className="py-24 lg:py-32" data-testid="home-sobre">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <Reveal>
          <div className="relative mx-auto flex h-64 w-64 items-center justify-center">
            <span className="absolute inset-0 rounded-full border border-acid/25" aria-hidden="true" />
            <span className="absolute inset-6 rounded-full border border-white/10" aria-hidden="true" />
            <LogoMark className="h-32 w-32" />
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <Eyebrow>Sobre a Exekuta</Eyebrow>
          <h2 className="mt-4 font-display text-3xl font-bold uppercase tracking-tight leading-[1.05] sm:text-4xl">
            Precisão na análise. Disciplina na execução.
          </h2>
          <p className="mt-5 max-w-xl text-zinc-400">
            A EXEKUTA traduz mecanismos de busca, dados e estratégia digital em
            uma operação de crescimento orgânico. Um compromisso simples: dar
            direção ao esforço e contexto aos resultados.
          </p>
          <div className="founder-line mt-7 flex items-center gap-4 border-l-2 border-acid pl-4">
            <div>
              <span className="block font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">Fundador</span>
              <strong className="font-display text-lg font-bold tracking-tight">Alessandro Pimentel</strong>
              <span className="block text-sm text-acid">CEO &amp; Founder</span>
            </div>
          </div>
          <Link
            to="/sobre"
            data-testid="home-sobre-link"
            className="group mt-7 inline-flex items-center gap-2 text-sm font-semibold text-zinc-300 transition-colors hover:text-acid"
          >
            Conhecer posicionamento e manifesto
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

function Insights() {
  return (
    <section className="border-y border-white/10 bg-surface py-24 lg:py-32" data-testid="home-insights">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <Eyebrow>Insights</Eyebrow>
          <h2 className="mt-4 max-w-2xl font-display text-3xl font-bold uppercase tracking-tight leading-[1.05] sm:text-4xl">
            Conhecimento que melhora a próxima decisão.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {INSIGHTS.map((a, i) => (
            <Reveal key={a.slug} delay={i * 0.1} className="h-full">
              <Link
                to={`/insights/${a.slug}`}
                data-testid={`home-insight-card-${a.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-white/10 bg-ink p-7 transition-all duration-300 hover:-translate-y-1 hover:border-acid/50"
              >
                <span className="w-fit rounded-full border border-white/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-400">
                  {a.category}
                </span>
                <h3 className="mt-5 font-display text-lg font-bold leading-snug tracking-tight transition-colors group-hover:text-acid">
                  {a.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-400">{a.excerpt}</p>
                <span className="mt-5 font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-600">
                  {a.readTime}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="py-24 lg:py-32" data-testid="home-faq">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-4">
          <Reveal>
            <Eyebrow>FAQ</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-bold uppercase tracking-tight leading-[1.05] sm:text-4xl">
              Respostas claras para decisões responsáveis.
            </h2>
          </Reveal>
        </div>
        <div className="lg:col-span-8">
          {FAQ.map((f, i) => (
            <Reveal key={f.q} delay={i * 0.04}>
              <div className="border-b border-white/10">
                <button
                  onClick={() => setOpen(open === i ? -1 : i)}
                  data-testid={`home-faq-toggle-${i}`}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  aria-expanded={open === i}
                >
                  <span className="font-display text-lg font-bold tracking-tight sm:text-xl">{f.q}</span>
                  <Plus className={`h-5 w-5 shrink-0 text-acid transition-transform duration-300 ${open === i ? "rotate-45" : ""}`} />
                </button>
                {open === i && (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="max-w-2xl overflow-hidden pb-6 text-sm leading-relaxed text-zinc-400 sm:text-base"
                  >
                    {f.a}
                  </motion.p>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Cta() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32" data-testid="home-cta">
      <div className="hero-glow pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[820px] -translate-x-1/2 -translate-y-1/2" />
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
        <Reveal>
          <div className="rounded-3xl border border-acid/25 bg-card2 p-10 text-center sm:p-16">
            <Eyebrow className="justify-center text-center">Próximo passo</Eyebrow>
            <h2 className="mt-6 font-display text-3xl font-extrabold uppercase tracking-tight leading-[1.02] sm:text-5xl">
              Não fazemos marketing. <span className="text-acid">Executamos crescimento.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-zinc-400">
              Descubra onde sua empresa está perdendo visibilidade e quais
              oportunidades podem ser transformadas em crescimento.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/diagnostico"
                data-testid="home-cta-diagnostico"
                className="inline-flex items-center gap-2 rounded-full bg-acid px-8 py-4 text-sm font-bold uppercase tracking-wide text-ink transition-transform duration-300 hover:scale-[1.04]"
              >
                Solicitar diagnóstico
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contato"
                data-testid="home-cta-contato"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-8 py-4 text-sm font-semibold transition-colors hover:border-acid hover:text-acid"
              >
                Falar sobre o cenário
              </Link>
            </div>
            <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-600">
              Instagram <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="text-acid hover:underline" data-testid="home-instagram-link">@exekuta.agencia</a>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee items={["Não fazemos marketing", "Executamos crescimento", "Estratégia", "Execução", "Resultados"]} />
      <Showcase />
      <Outcomes />
      <Pillars />
      <Services />
      <Method />
      <Differentials />
      <CasesPreview />
      <DashboardSection />
      <AboutPreview />
      <Insights />
      <Faq />
      <Cta />
    </>
  );
}
