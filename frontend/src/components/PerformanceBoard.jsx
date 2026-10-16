export default function PerformanceBoard({ id = "board", compact = false }) {
  return (
    <figure
      className={`overflow-hidden rounded-2xl border border-white/10 bg-surface ${compact ? "" : ""}`}
      data-testid={`performance-board-${id}`}
      aria-label="Painel de performance — visualização conceitual"
    >
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-acid opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-acid" />
          </span>
          <strong className="font-display text-sm font-bold tracking-tight">Painel de performance</strong>
        </div>
        <span className="rounded-full border border-white/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
          Visualização conceitual
        </span>
      </div>
      <div className="px-5 py-4">
        <svg viewBox="0 0 640 260" className="h-auto w-full" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#B7FF00" stopOpacity=".24" />
              <stop offset="1" stopColor="#B7FF00" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0 52h640M0 104h640M0 156h640M0 208h640M128 0v260M256 0v260M384 0v260M512 0v260"
            stroke="rgba(245,247,245,0.07)"
            strokeWidth="1"
            fill="none"
          />
          <path
            fill={`url(#${id}-fill)`}
            d="M0 222C85 216 90 190 160 194s88-64 160-50 104-76 176-54 92-54 144-72V260H0Z"
          />
          <path
            d="M0 222C85 216 90 190 160 194s88-64 160-50 104-76 176-54 92-54 144-72"
            stroke="#B7FF00"
            strokeWidth="2.5"
            fill="none"
          />
          <circle cx="160" cy="194" r="5" fill="#B7FF00" />
          <circle cx="320" cy="144" r="5" fill="#B7FF00" />
          <circle cx="496" cy="90" r="5" fill="#B7FF00" />
          <circle cx="640" cy="18" r="5" fill="#B7FF00" />
        </svg>
      </div>
      <div className="grid grid-cols-2 gap-px border-t border-white/10 bg-white/10 sm:grid-cols-4">
        {[
          ["Visibilidade orgânica", "Mapear"],
          ["Páginas estratégicas", "Priorizar"],
          ["Saúde técnica", "Executar"],
          ["Conversões", "Medir"],
        ].map(([k, v]) => (
          <div key={k} className="bg-surface px-4 py-3.5">
            <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-muted">{k}</span>
            <strong className="mt-1 block font-display text-sm font-bold text-acid">{v}</strong>
          </div>
        ))}
      </div>
      <figcaption className="border-t border-white/10 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
        Estrutura demonstrativa preparada para receber dados reais e períodos validados.
      </figcaption>
    </figure>
  );
}
