import { useEffect } from "react";

export const SITE_URL = "https://www.exekuta.com.br";
const DEFAULT_IMAGE = "/og-exekuta.jpg";

function upsertMeta(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/**
 * Meta por rota (title, description, canonical, robots, OG e Twitter).
 * Sem dependências: atualiza o <head> no cliente — o prerender de bots
 * no deploy captura o resultado para crawlers.
 */
export default function Seo({
  title,
  description,
  path = "/",
  image = DEFAULT_IMAGE,
  noindex = false,
  jsonLd = null,
}) {
  useEffect(() => {
    const canonical = `${SITE_URL}${path === "/" ? "" : path}`;
    document.title = title;
    upsertMeta("name", "description", description);
    upsertMeta(
      "name",
      "robots",
      noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1"
    );

    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", canonical);

    const img = image.startsWith("http") ? image : `${SITE_URL}${image}`;
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", canonical);
    upsertMeta("property", "og:image", img);
    upsertMeta("property", "og:image:alt", title);
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", img);

    const script = document.getElementById("route-jsonld");
    if (jsonLd) {
      if (script) script.remove();
      const el = document.createElement("script");
      el.type = "application/ld+json";
      el.id = "route-jsonld";
      el.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(el);
    } else if (script) {
      script.remove();
    }
  }, [title, description, path, image, noindex, jsonLd]);

  return null;
}
