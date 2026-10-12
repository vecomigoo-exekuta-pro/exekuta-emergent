export const LogoMark = ({ className = "h-8 w-8" }) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
    <rect width="32" height="32" rx="7" fill="#000" stroke="rgba(255,255,255,0.18)" />
    <path d="M9 9 23 23" stroke="#E2FE00" strokeWidth="3.6" strokeLinecap="square" />
    <path d="M23 9 9 23" stroke="#FFF" strokeWidth="3.6" strokeLinecap="square" />
  </svg>
);

export const Logo = ({ className = "" }) => (
  <span className={`inline-flex items-center gap-2.5 ${className}`}>
    <LogoMark className="h-8 w-8" />
    <span className="font-display text-lg font-extrabold tracking-tight text-paper">
      EXEKUTA
    </span>
  </span>
);

export default Logo;
