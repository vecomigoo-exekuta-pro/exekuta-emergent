import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1];

export const Reveal = ({ children, delay = 0, className, y = 28, testid }) => (
  <motion.div
    data-testid={testid}
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.7, delay, ease: EASE }}
  >
    {children}
  </motion.div>
);

export const MaskedLines = ({
  lines,
  className = "",
  lineClassName = "",
  delayStep = 0.12,
  baseDelay = 0.1,
}) => (
  <span className={className}>
    {lines.map((l, i) => (
      <span key={i} className="block overflow-hidden">
        <motion.span
          className={`block ${lineClassName}`}
          initial={{ y: "112%" }}
          animate={{ y: "0%" }}
          transition={{ duration: 0.9, delay: baseDelay + i * delayStep, ease: EASE }}
        >
          {l}
        </motion.span>
      </span>
    ))}
  </span>
);

export const FadeIn = ({ children, delay = 0, className, testid }) => (
  <motion.div
    data-testid={testid}
    className={className}
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay, ease: EASE }}
  >
    {children}
  </motion.div>
);

export const Eyebrow = ({ children, className = "" }) => (
  <p
    className={`font-mono text-xs uppercase tracking-[0.25em] text-acid ${className}`}
  >
    {children}
  </p>
);

export const SectionHead = ({ eyebrow, title, className = "" }) => (
  <Reveal className={className}>
    <Eyebrow>{eyebrow}</Eyebrow>
    <h2 className="mt-4 font-display text-3xl font-bold tracking-tight leading-[1.05] sm:text-5xl">
      {title}
    </h2>
  </Reveal>
);

const Star = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-acid" fill="currentColor" aria-hidden="true">
    <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6L12 0z" />
  </svg>
);

export const Marquee = ({ items, testid }) => (
  <div
    data-testid={testid || "editorial-marquee"}
    className="marquee relative overflow-hidden border-y border-white/10 bg-ink py-5"
  >
    <div className="marquee-track flex w-max items-center">
      {[0, 1].map((copy) => (
        <div key={copy} aria-hidden={copy === 1} className="flex items-center">
          {items.map((t, i) => (
            <span
              key={`${t}-${i}-${copy}`}
              className="flex items-center gap-8 pr-8 font-display text-2xl font-bold tracking-tight text-white/90 sm:text-4xl"
            >
              {t}
              <Star />
            </span>
          ))}
        </div>
      ))}
    </div>
  </div>
);
