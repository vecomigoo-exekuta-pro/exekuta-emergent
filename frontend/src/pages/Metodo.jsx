import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { Eyebrow, FadeIn, Reveal, SectionHead } from "@/components/ui-motions";
import PerformanceBoard from "@/components/PerformanceBoard";
import { METHOD_STEPS, GOVERNANCE, CADENCE, REPORTS } from "@/data/method";

export default function Metodo() {
  return (
    <div data-testid="metodo-page">
      <section className="relative overflow-hidden pb-14 pt-40 lg:pb-20 lg:pt-48">
        <div className="hero-grid absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-7">
            <FadeIn>
              <Eyebrow className="flex items-center gap-3">
                <span className="inline-block h-2 w-2 rounded-full bg-acid" />
                Método Exekuta
              </Eyebrow>
            </FadeIn>
            <h1 className="mt-7 font-display text-4xl font-extrabold uppercase tracking-tight leading-[0.98] sm:text-6xl">
              <span className="block overflow-hidden">
                <FadeIn delay={0.15}>Um método para analisar,</FadeIn>
              </span>
              <span className="block overflow-hidden">
                <FadeIn delay={0.3}>
                  <span>executar e <span className="text-acid">evoluir.</span></span>
                </FadeIn>
              </span>
            </h1>
            <FadeIn delay={0.5} className="mt-7 max-w-xl">
              <p className="text-base leading-relaxed text-muted sm:text-lg">
                SEO exige continuidade entre análise, decisão, entrega e
                leitura. O método organiza essas etapas para que cada ação
                tenha origem, prioridade, responsabilidade e critério de
                validação.
              </p>
            </FadeIn>
            <FadeIn delay={0.65} className="mt-9 flex flex-wrap gap-4">
              <a href="#etapas" data-testid="metodo-cta-etapas" className="inline-flex items-center gap-2 rounded-full bg-acid px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-ink transition-transform hover:scale-[1.04]">
                Ver as cinco etapas
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link to="/diagnostico" data-testid="metodo-cta-diagnostico" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold transition-colors hover:border-acid hover:text-acid">
                Iniciar diagnóstico
              </Link>
            </FadeIn>
          </div>
          <FadeIn delay={0.35} className="lg:col-span-5">
            <PerformanceBoard id="metodo" compact />
          </FadeIn>
        </div>
      </section>

      <section className="py-24 lg:py-32" data-testid="metodo-principio">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-5">
            <SectionHead eyebrow="Princípio" title={<>Estratégia sem<br />execução é apenas<br />intenção.</>} />
          </div>
          <div className="lg:col-span-7">
            <Reveal delay={0.1}>
              <p className="text-lg leading-relaxed text-muted">
                O método existe para evitar dois extremos: agir sem diagnóstico
                e analisar sem chegar à implementação.
              </p>
              <p className="mt-5 leading-relaxed text-muted">
                Cada etapa produz insumos para a próxima e registra decisões que
                permitem compreender por que o plano mudou ao longo do tempo.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-surface py-24 lg:py-32" id="etapas" data-testid="metodo-etapas">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="Cinco etapas"
            title="Um ciclo, não uma linha de produção."
          />
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-2xl text-muted">
              As etapas possuem ordem lógica, mas podem se sobrepor quando uma
              descoberta técnica, comercial ou editorial exige revisão.
            </p>
          </Reveal>
          <div className="mt-12 space-y-px overflow-hidden rounded-2xl border border-white/10 bg-white/10">
            {METHOD_STEPS.map((m, i) => (
              <Reveal key={m.num} delay={i * 0.05}>
                <div className="grid gap-6 bg-ink p-8 transition-colors duration-300 hover:bg-card2 sm:grid-cols-12 sm:items-start">
                  <span className="text-outline font-display text-5xl font-extrabold sm:col-span-2">{m.num}</span>
                  <div className="sm:col-span-10">
                    <h3 className="font-display text-2xl font-bold tracking-tight">{m.title}</h3>
                    <p className="mt-3 text-muted">{m.desc}</p>
                    <p className="mt-2 text-sm text-muted">{m.extra}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32" data-testid="metodo-governanca">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHead
                eyebrow="Governança"
                title={<>Quem decide, quem executa<br className="hidden sm:block" /> e como validamos.</>}
              />
              <Reveal delay={0.1}>
                <p className="mt-6 max-w-md text-muted">
                  Um plano perde força quando responsabilidades e dependências
                  ficam implícitas. A governança transforma recomendações em
                  compromissos observáveis.
                </p>
              </Reveal>
            </div>
            <div className="grid gap-5 lg:col-span-7">
              {GOVERNANCE.map((g, i) => (
                <Reveal key={g.num} delay={i * 0.08}>
                  <div className="flex items-start gap-6 rounded-2xl border border-white/10 bg-card2 p-7 transition-all duration-300 hover:border-acid/50">
                    <span className="font-mono text-xs tracking-[0.25em] text-acid">{g.num}</span>
                    <div>
                      <h3 className="font-display text-xl font-bold tracking-tight">{g.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{g.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-surface py-24 lg:py-32" data-testid="metodo-cadencia">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-ink p-7">
              {["Diagnóstico", "Execução", "Leitura", "Decisão"].map((t, i) => (
                <span key={t} className="flex items-center gap-3 font-display text-lg font-bold uppercase tracking-tight text-paper sm:text-xl">
                  {t}
                  {i < 3 && <ArrowRight className="h-4 w-4 text-acid" />}
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <Eyebrow>Cadência</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-bold uppercase tracking-tight leading-[1.05] sm:text-4xl">
              Acompanhamento que não confunde movimento com progresso.
            </h2>
            <p className="mt-5 text-muted">
              A cadência separa atividade, conclusão, sinal e resultado. Nem
              toda tarefa altera uma métrica imediatamente; nem toda variação
              foi causada pela última mudança.
            </p>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {CADENCE.map((c) => (
                <li key={c} className="flex items-start gap-3 text-sm text-muted">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-acid" />
                  {c}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="py-24 lg:py-32" data-testid="metodo-transparencia">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="Transparência"
            title="Um bom relatório termina em decisão."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {REPORTS.map((r, i) => (
              <Reveal key={r.title} delay={i * 0.1} className="h-full">
                <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-card2 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-acid/50">
                  <h3 className="font-display text-xl font-bold tracking-tight">{r.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{r.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 py-24" data-testid="metodo-cta">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <Reveal>
            <h2 className="font-display text-3xl font-extrabold uppercase tracking-tight sm:text-5xl">
              O melhor plano é aquele que pode ser executado e revisado.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-muted">
              Comece com um diagnóstico que considere objetivo, capacidade,
              dependências e critérios de acompanhamento.
            </p>
            <Link to="/diagnostico" data-testid="metodo-cta-final" className="mt-10 inline-flex items-center gap-2 rounded-full bg-acid px-8 py-4 text-sm font-bold uppercase tracking-wide text-ink transition-transform hover:scale-[1.04]">
              Solicitar diagnóstico
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
