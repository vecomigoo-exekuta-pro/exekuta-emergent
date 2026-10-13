import { useCms } from "@/cms/CmsContext";
import { BRAND } from "@/cms/defaults";

export const Logo = ({ className = "h-9 w-auto", footer = false }) => {
  const { cms } = useCms();
  const brand = { ...BRAND, ...(cms.brand || {}) };
  const src = footer ? brand.logoFooterUrl || brand.logoUrl : brand.logoUrl;
  return (
    <img
      src={src}
      alt={`${brand.companyName} — ${brand.tagline}`}
      className={className}
      width={150}
      height={25}
    />
  );
};

export const LogoMark = ({ className = "h-24 w-24" }) => {
  const { cms } = useCms();
  const brand = { ...BRAND, ...(cms.brand || {}) };
  return <img src={brand.faviconUrl || "/favicon.svg"} alt={`Símbolo ${brand.companyName}`} className={className} loading="lazy" />;
};

export default Logo;
