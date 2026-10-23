import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Eyebrow, FadeIn, Reveal, SectionHead } from "@/components/ui-motions";
import Seo from "@/components/Seo";

const BUILD_TYPES = [
  {
    id: "institucional",
    title: "Sites institucionais",
    desc: "A presença oficial da empresa: páginas organizadas por serviço, área de atendimento e prova, com conteúdo pensado para a busca e para a decisão de compra.",
  },
  {
    id: "landing",
    title: "Landing pages de conversão",
    desc: "Páginas focadas em uma ação de negócio: mensagem centrada, jornada curta e mensuração conectada para transformar visita em solicitação.",
  },
  {
    id: "ecommerce",
    title: "Lojas virtuais",
    desc: "E-commerce com arquitetura comercial clara, experiência de compra fluida e base técnica preparada para performance e aquisição.",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Descoberta e briefing",
    desc: "Entendemos negócio, mercado, público e objetivo. O site começa pelo que ele precisa resolver, não por um template.",
  },
  {
    num: "02",
    title: "Arquitetura e conteúdo",
    desc: "Estrutura de páginas, hierarquia de informações e textos organizados a partir da demanda real de busca e da jornada do cliente.",
  },
  {
    num: "03",
    title: "Design e desenvolvimento",
    desc: "Identidade visual da marca em experiência rápida, acessível e consistente no desktop e no mobile, com estrutura semântica correta.",
  },
  {
    num: "04",
    title: "Lançamento e evolução",
    desc: "Publicação com indexação verificada, mensuração configurada e ciclos de melhoria a partir de dados reais de uso.",
  },
];

const FAQ_LOCAL = [
  {
    q: "O site já nasce preparado para SEO?",
    a: "Sim. Estrutura semântica, performance, responsividade, indexação e organização de conteúdo fazem parte do desenvolvimento — não de um ajuste posterior.",
  },
  {
    q: "Vocês trabalham com WordPress?",
    a: "Trabalhamos com plataformas e formatos diferentes, incluindo WordPress. A tecnologia é definida conforme o objetivo, o fluxo de edição e a infraestrutura do negócio.",
  },
  {
    q: "Quanto tempo leva a criação de um site?",
    a: "Não existe um prazo universal. O cronograma depende do escopo, do volume de páginas e do conteúdo disponível. O diagnóstico inicial organiza prioridades e prazos realistas.",
  },
  {
    q: "A criação inclui acompanhamento depois do lançamento?",
    a: "O lançamento não é o fim: a operação prevê mensuração configurada e ciclos de melhoria a partir de indicadores definidos com o cliente.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_LOCAL.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "name": "Criação de Sites Profissionais",
      "serviceType": "Criação de sites e desenvolvimento web",
      "description": "Criação de sites profissionais com design estratégico, experiência mobile, desempenho e estrutura preparada para SEO e conversão.",
      "provider": { "@id": "https://www.exekuta.com.br/#org" },
      "areaServed": "Rio de Janeiro e região metropolitana",
      "url": "https://www.exekuta.com.br/criacao-de-sites",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: "https://www.exekuta.com.br/" },
        { "@type": "ListItem", position: 2, name: "Serviços", item: "https://www.exekuta.com.br/servicos" },
        { "@type": "ListItem", position: 3, name: "Criação de Sites", item: "https://www.exekuta.com.br/criacao-de-sites" },
      ],
    },
  ],
};

export default function CriacaoSites() {
  return (
    <div data-testid="criacao-sites-page">
      <Seo
        title="Criação de Sites Profissionais no Rio de Janeiro | EXEKUTA"
        description="Criação de sites profissionais com design estratégico, experiência mobile, desempenho e estrutura preparada para SEO e conversão."
        path="/criacao-de-sites"
        jsonLd={{ ...serviceJsonLd }}
      />

      <section className="relative overflow-hidden pb-14 pt-40 lg:pb-20 lg:pt-48">
        <div className="hero-grid absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-7">
            <FadeIn>
              <Eyebrow className="flex items-center gap-3">
                <span className="inline-block h-2 w-2 rounded-full bg-acid" />
                Desenvolvimento · EXEKUTA
              </Eyebrow>
            </FadeIn>
            <h1 className="mt-7 font-display text-4xl font-extrabold uppercase tracking-tight leading-[0.98] sm:text-6xl">
              <span className="block overflow-hidden">
                <FadeIn delay={0.15}>Criação de sites</FadeIn>
              </span>
              <span className="block overflow-hidden">
                <FadeIn delay={0.3}>
                  <span>
                    profissionais no <span className="text-acid">Rio de Janeiro.</span>
                  </span>
                </FadeIn>
              </span>
            </h1>
            <FadeIn delay={0.5} className="mt-7 max-w-xl">
              <p className="text-base leading-relaxed text-muted sm:text-lg">
                Sites institucionais, landing pages e lojas virtuais com design
                estratégico, experiência mobile e estrutura técnica preparada
                para SEO e conversão desde o lançamento.
              </p>
            </FadeIn>
            <FadeIn delay={0.65} className="mt-9 flex flex-wrap gap-4">
              <Link to="/diagnostico" data-testid="criacao-cta-diagnostico" className="inline-flex items-center gap-2 rounded-full bg-acid px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-ink transition-transform hover:scale-[1.04]">
                Solicitar diagnóstico
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/cases" data-testid="criacao-cta-cases" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold transition-colors hover:border-acid hover:text-acid">
                Ver cases
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-surface py-24 lg:py-32" data-testid="criacao-tipos">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="O que construímos"
            title="Um formato para cada objetivo de negócio."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {BUILD_TYPES.map((b, i) => (
              <Reveal key={b.id} delay={i * 0.08} className="h-full">
                <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-ink p-7 transition-all duration-300 hover:-translate-y-1 hover:border-acid/50" data-testid={`criacao-card-${b.id}`}>
                  <span className="font-mono text-xs tracking-[0.25em] text-acid">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-8 font-display text-xl font-bold tracking-tight">{b.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{b.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32" data-testid="criacao-problema">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-5">
            <Reveal>
              <Eyebrow>O problema</Eyebrow>
              <h2 className="mt-4 font-display text-3xl font-bold uppercase tracking-tight leading-[1.05] sm:text-4xl">
                Um site bonito que ninguém encontra é um cartão de visita guardado na gaveta.
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <Reveal delay={0.1}>
              <p className="text-lg leading-relaxed text-muted">
                Muitos sites travam o crescimento da empresa por nascerem sem
                estrutura: lentidão, má experiência no celular, páginas que o
                Google não indexa e mensagens que não comunicam o serviço.
              </p>
              <p className="mt-5 leading-relaxed text-muted">
                A criação da EXEKUTA resolve isso na origem: desempenho,
                arquitetura de páginas, conteúdo alinhado à demanda de busca e
                uma base técnica que sustenta as próximas etapas de otimização.
              </p>
              <ul className="mt-8 space-y-3" data-testid="criacao-para-quem">
                {[
                  "Empresas que ainda não têm site e precisam de presença profissional.",
                  "Negócios com site desatualizado que não representa mais a operação.",
                  "Operações que recebem visitas, mas não convertem em solicitações.",
                  "Marcas que pretendem investir em SEO e querem uma base técnica sólida antes de começar.",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3 text-sm leading-relaxed text-muted">
                    <span className="mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full bg-acid" />
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-surface py-24 lg:py-32" data-testid="criacao-processo">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="Como funciona"
            title="Do briefing ao lançamento, sem etapas vagas."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <Reveal key={s.num} delay={i * 0.07} className="h-full">
                <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-ink p-7 transition-all duration-300 hover:-translate-y-1 hover:border-acid/50" data-testid={`criacao-step-${i + 1}`}>
                  <span className="font-mono text-xs tracking-[0.25em] text-acid">{s.num}</span>
                  <h3 className="mt-8 font-display text-lg font-bold tracking-tight">{s.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32" id="faq" data-testid="criacao-faq">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <SectionHead
            eyebrow="Perguntas frequentes"
            title="O que costumam perguntar antes de criar um site."
          />
          <div className="mt-10 space-y-4">
            {FAQ_LOCAL.map((f, i) => (
              <Reveal key={f.q} delay={i * 0.05}>
                <details className="group rounded-2xl border border-white/10 bg-card2 p-6 transition-colors open:border-acid/40" data-testid={`criacao-faq-${i + 1}`}>
                  <summary className="flex cursor-pointer items-center justify-between gap-4 font-display text-base font-bold tracking-tight marker:content-['']">
                    {f.q}
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-muted transition-transform duration-300 group-open:rotate-45 group-open:text-acid" />
                  </summary>
                  <p className="mt-4 text-sm leading-relaxed text-muted">{f.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 py-24" data-testid="criacao-cta">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <Reveal>
            <h2 className="font-display text-3xl font-extrabold uppercase tracking-tight sm:text-5xl">
              Seu próximo site já pode nascer <span className="text-acid">preparado.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-muted">
              Conte o cenário da empresa e o objetivo do site. O diagnóstico
              organiza escopo, prioridades e o caminho de execução.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link to="/diagnostico" data-testid="criacao-cta-final" className="inline-flex items-center gap-2 rounded-full bg-acid px-8 py-4 text-sm font-bold uppercase tracking-wide text-ink transition-transform hover:scale-[1.04]">
                Solicitar diagnóstico
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/analise-seo" data-testid="criacao-cta-analise" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-8 py-4 text-sm font-semibold transition-colors hover:border-acid hover:text-acid">
                Analisar meu site
              </Link>
            </div>
            <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
              Quer entender o método antes?{" "}
              <Link to="/metodo" data-testid="criacao-link-metodo" className="text-acid transition-colors hover:text-paper">
                Conhecer os pilares
              </Link>
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
