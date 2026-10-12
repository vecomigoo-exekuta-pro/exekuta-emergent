export const Logo = ({ className = "h-9 w-auto" }) => (
  <img
    src="/brand/logo-exekuta-horizontal.png"
    alt="EXEKUTA — Performance, Estratégia, Resultados"
    className={className}
    width={150}
    height={25}
  />
);

export const LogoMark = ({ className = "h-24 w-24" }) => (
  <img src="/brand/simbolo-ex-circular.png" alt="Símbolo EX. da EXEKUTA" className={className} loading="lazy" />
);

export default Logo;
