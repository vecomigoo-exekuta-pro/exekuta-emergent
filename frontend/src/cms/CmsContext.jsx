import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { BRAND, FOOTER, HOME, ABOUT } from "@/cms/defaults";
import { FAQ } from "@/data/site";
import { SERVICES } from "@/data/services";
import { CASES } from "@/data/cases";

const CmsContext = createContext({ cms: {} });
const CACHE_KEY = "exk_cms_v1";
const TTL = 5 * 60 * 1000;

function readCache() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { at, data } = JSON.parse(raw);
    if (Date.now() - at > TTL) return null;
    return data || null;
  } catch {
    return null;
  }
}

export function CmsProvider({ children }) {
  const [cms, setCms] = useState(() => readCache() || {});

  useEffect(() => {
    let alive = true;
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/cms/public`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!alive || !data) return;
        setCms(data);
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data }));
        } catch (e) {
          /* storage cheio — segue sem cache */
        }
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const fav = cms.brand?.faviconUrl;
    if (fav) {
      const link = document.querySelector("link[rel='icon']");
      if (link) link.href = fav;
    }
  }, [cms.brand?.faviconUrl]);

  const value = useMemo(() => ({ cms }), [cms]);
  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}

export const useCms = () => useContext(CmsContext);

export function useSiteData() {
  const { cms } = useCms();
  return useMemo(() => {
    const activeSorted = (list, fallback) =>
      list && list.length
        ? list
            .filter((x) => x.active !== false)
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        : fallback;
    return {
      cms,
      brand: { ...BRAND, ...(cms.brand || {}) },
      footer: { ...FOOTER, ...(cms.footer || {}) },
      home: { ...HOME, ...(cms.home || {}) },
      about: { ...ABOUT, ...(cms.about || {}) },
      faq: cms.faq?.length ? cms.faq : FAQ,
      services: activeSorted(cms.services, SERVICES),
      cases: activeSorted(cms.cases, CASES),
    };
  }, [cms]);
}
