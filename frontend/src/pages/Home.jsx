import { useRef } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { ArrowUpRight, ArrowDown, Plus } from "lucide-react";
import { useState } from "react";
import { MaskedLines, FadeIn, Eyebrow, SectionHead, Reveal, Marquee } from "@/components/ui-motions";
import { SERVICES, METHOD, FAQ, IMAGES, WHATSAPP_URL } from "@/data/content";

const EASE = [0.16, 1, 0.3, 1];

function Hero() {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 700], [0, 140]);
  const heroOpacity = useTransform(scrollY, [0, 550], [1, 0]);
  const markY = useTransform(scrollY, [0, 700], [0, -80]);

  const onMouseMove = (e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 26);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 26);
  };

  return (
    <section
      ref={ref}
      onMouseMove={onMouseMove}
      className="relative flex min-h-screen flex-col justify-center overflow-hidden"
      data-testid="home-hero"
    >
      <div className="hero-grid absolute inset-0" aria-hidden="true" />
      <div
        className="hero-glow pointer-events-none absolute -top-32 left-1/2 h-[560px] w-[860px] -translate-x-1/2"
        aria-hidden="true"
      />

      <motion.div
        style={{ y: markY, x: sx, rotate: 0.001 }}
        className="pointer-events-none absolute -right-24 top-1/2 hidden -translate-y-1/2 opacity-90 lg:block"
        aria-hidden="true"
      >
        <motion.svg
          viewBox="0 0 200 200"
          className="h-[440px] w-[440px]"
          animate={{ rotate: 360 }}
          transition={{ duration: 46, repeat: Infinity, ease: "linear" }}
        >
          <path d="M40 40 160 160" stroke="#E2FE00" strokeWidth="9" strokeLinecap="square" />
          <path d="M160 40 40 160" stroke="rgba(255,255,255,0.65)" strokeWidth="9" strokeLinecap="square" />
          <circle cx="100" cy="100" r="88" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        </motion.svg>
      </motion.div>

      <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-24 pt-36 sm:px-6 lg:px-8">
        <FadeIn delay={0.05}>
          <Eyebrow className="flex items-center gap-3">
            <span className="inline-block h-2 w-2 rounded-full bg-acid" />
            Agência de SEO orientada por dados
          </Eyebrow>
        </FadeIn>

        <h1 className="mt-8 font-display text-4xl font-extrabold tracking-tight leading-[0.98] sm:text-6xl lg:text-7xl">
          <MaskedLines
            lines={["SEO que gera", <span key="l2"><span className="text-acid">resultados</span> reais.</span>]}
            baseDelay={0.15}
            delayStep={0.16}
          />
        </h1>

        <FadeIn delay={0.55} className="mt-8 max-w-xl">
          <p className="text-base leading-relaxed text-zinc-400 sm:text-lg">
            Estratégia avançada, execução técnica e foco total em crescimento
            orgânico para marcas que não querem apenas aparecer — querem ocupar
            posições, gerar oportunidades e crescer com consistência.
          </p>
        </FadeIn>

        <FadeIn delay={0.7} className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            to="/contato"
            data-testid="hero-cta-diagnostico"
            className="group inline-flex items-center gap-2 rounded-full bg-acid px-7 py-3.5 text-sm font-semibold text-ink transition-transform duration-300 hover:scale-[1.04]"
          >
            Solicitar diagnóstico
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
          </Link>
          <Link
            to="/servicos"
            data-testid="hero-cta-servicos"
            className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-paper transition-colors duration-300 hover:border-acid hover:text-acid"
          >
            Ver serviços
          </Link>
        </FadeIn>

        <FadeIn delay={0.9} className="mt-16 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-500">
          <span>SEO &amp; Google</span>
          <span className="text-acid">/</span>
          <span>Desenvolvimento</span>
          <span className="text-acid">/</span>
          <span>Tráfego Pago</span>
          <span className="text-acid">/</span>
          <span>Automação &amp; IA</span>
        </FadeIn>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-zinc-400"
        >
          <ArrowDown className="h-4 w-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}

function Pilares() {
  const cards = [
    {
      title: "Operação Estratégica",
      desc: "Análise, planejamento e execução no mesmo fluxo. Leitura de cenário, priorização, documentação e acompanhamento contínuo em um mesmo fluxo de execução.",
    },
    {
      title: "Visibilidade com objetivo",
      desc: "SEO não é apenas posição. É crescimento com direção. O valor surge quando a presença orgânica atrai demanda relevante e contribui para uma ação de negócio.",
    },
    {
      title: "Essência Exekuta",
      desc: "Três pilares. Uma disciplina de crescimento: Estratégia, Execução, Resultados.",
    },
  ];
  return (
    <section className="py-24 lg:py-36" data-testid="home-pilares">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHead eyebrow="Essência" title={<>Três pilares. Uma<br className="hidden sm:block" /> disciplina de crescimento.</>} />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.12} className="h-full">
              <div className="group flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-card2 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-acid/50">
                <span className="font-mono text-xs tracking-[0.25em] text-acid">
                  0{i + 1}
                </span>
                <div className="mt-16">
                  <h3 className="font-display text-2xl font-bold tracking-tight">{c.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-zinc-400">{c.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicosPreview() {
  return (
    <section className="py-24 lg:py-36" data-testid="home-servicos">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead eyebrow="Serviços" title="Onde a EXEKUTA atua." />
          <Reveal delay={0.15}>
            <Link
              to="/servicos"
              data-testid="home-servicos-ver-todos"
              className="group inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-semibold transition-colors hover:border-acid hover:text-acid"
            >
              Todos os serviços
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 border-t border-white/10">
          {SERVICES.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.06}>
              <Link
                to="/servicos"
                data-testid={`home-servico-row-${s.id}`}
                className="group flex items-center justify-between gap-6 border-b border-white/10 py-7 transition-colors duration-300 hover:bg-paper sm:px-6"
              >
                <div className="flex items-baseline gap-5 sm:gap-10">
                  <span className="font-mono text-xs tracking-[0.25em] text-acid sm:text-sm">
                    {s.num}
                  </span>
                  <span className="font-display text-xl font-bold tracking-tight transition-colors group-hover:text-ink sm:text-3xl">
                    {s.title}
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="hidden max-w-xs text-right text-xs leading-relaxed text-zinc-500 transition-colors group-hover:text-zinc-600 md:block">
                    {s.tagline}
                  </span>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 transition-all duration-300 group-hover:rotate-45 group-hover:border-ink group-hover:bg-ink group-hover:text-acid">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ImageStrip() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  return (
    <section ref={ref} className="relative overflow-hidden py-10 lg:py-16" data-testid="home-image-strip">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative h-[340px] overflow-hidden rounded-2xl sm:h-[460px]">
          <motion.img
            src={IMAGES.analytics1}
            alt="Painel de dados e analytics em modo escuro"
            style={{ y }}
            className="absolute inset-0 h-[124%] w-full object-cover grayscale"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-4">
            <p className="max-w-md font-display text-xl font-bold tracking-tight sm:text-3xl">
              Dados, SEO técnico e conteúdo — no mesmo fluxo.
            </p>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-acid">
              Ler o cenário / agir com direção
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Metodo() {
  return (
    <section className="py-24 lg:py-36" data-testid="home-metodo">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHead
          eyebrow="Método Exekuta"
          title={<>Um ciclo para analisar,<br className="hidden sm:block" /> executar e evoluir.</>}
        />
        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-5">
          {METHOD.map((m, i) => (
            <Reveal key={m.num} delay={i * 0.08} className="h-full">
              <div className="flex h-full flex-col bg-ink p-7 transition-colors duration-300 hover:bg-card2">
                <span className="text-outline font-display text-5xl font-extrabold">{m.num}</span>
                <h3 className="mt-8 font-display text-lg font-bold tracking-tight">{m.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{m.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Diferenciais() {
  const points = [
    "SEO conectado ao negócio — não desconectado do mercado.",
    "Cada ação com um papel definido dentro de uma arquitetura e jornada.",
    "Análise profunda, execução técnica e acompanhamento responsável.",
  ];
  return (
    <section className="border-y border-white/10 bg-surface py-24 lg:py-36" data-testid="home-diferenciais">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <SectionHead
          eyebrow="Diferenciais"
          title={<>Não entregamos tarefas.<br />Construímos <span className="text-acid">performance.</span></>}
        />
        <div className="flex flex-col justify-center gap-6">
          {points.map((p, i) => (
            <Reveal key={p} delay={i * 0.1}>
              <div className="flex items-start gap-4 border-b border-white/10 pb-6">
                <span className="mt-1 font-mono text-xs tracking-[0.25em] text-acid">0{i + 1}</span>
                <p className="text-base leading-relaxed text-zinc-300">{p}</p>
              </div>
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
    <section className="py-24 lg:py-36" data-testid="home-faq">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-4">
          <SectionHead eyebrow="FAQ" title={<>Perguntas<br />frequentes.</>} />
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-zinc-400">
              Respostas objetivas para as dúvidas mais comuns antes de iniciar
              um projeto com a EXEKUTA.
            </p>
          </Reveal>
        </div>
        <div className="lg:col-span-8">
          {FAQ.map((f, i) => (
            <Reveal key={f.q} delay={i * 0.05}>
              <div className="border-b border-white/10">
                <button
                  onClick={() => setOpen(open === i ? -1 : i)}
                  data-testid={`home-faq-toggle-${i}`}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  aria-expanded={open === i}
                >
                  <span className="font-display text-lg font-bold tracking-tight sm:text-2xl">
                    {f.q}
                  </span>
                  <Plus
                    className={`h-5 w-5 shrink-0 text-acid transition-transform duration-300 ${
                      open === i ? "rotate-45" : ""
                    }`}
                  />
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
    <section className="relative overflow-hidden py-28 lg:py-40" data-testid="home-cta">
      <div className="hero-glow pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[820px] -translate-x-1/2 -translate-y-1/2" />
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        <Reveal>
          <Eyebrow className="justify-center">Próximo passo</Eyebrow>
          <h2 className="mt-6 font-display text-3xl font-extrabold tracking-tight leading-[1.02] sm:text-5xl lg:text-6xl">
            Vamos entender o cenário antes de propor a solução.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-zinc-400">
            Conte o contexto. A resposta começa por entender problema,
            prioridade e capacidade de execução.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contato"
              data-testid="home-cta-diagnostico"
              className="group inline-flex items-center gap-2 rounded-full bg-acid px-8 py-4 text-sm font-semibold text-ink transition-transform duration-300 hover:scale-[1.04]"
            >
              Solicitar diagnóstico
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="home-cta-whatsapp"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-8 py-4 text-sm font-semibold transition-colors hover:border-acid hover:text-acid"
            >
              WhatsApp direto
            </a>
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
      <Marquee
        items={["Estratégia", "Execução", "Resultados", "SEO & Google", "Desenvolvimento", "Tráfego Pago", "Automação & IA"]}
      />
      <Pilares />
      <ServicosPreview />
      <ImageStrip />
      <Metodo />
      <Diferenciais />
      <Faq />
      <Cta />
    </>
  );
}
