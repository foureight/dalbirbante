import type { Metadata } from "next";
import type { SiteContent } from "@/lib/types";

const DEFAULT_IMAGE = "/images/lifestyle-01.webp";

export function siteBaseUrl(content: SiteContent) {
  return (content.site.siteUrl || "https://www.dalbirbante.cz").replace(
    /\/$/,
    "",
  );
}

export function absoluteUrl(content: SiteContent, path = "") {
  const base = siteBaseUrl(content);
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Jednotná page metadata: title, description, canonical, Open Graph, Twitter. */
export function buildPageMetadata(
  content: SiteContent,
  opts: {
    path: string;
    title: string;
    description: string;
    image?: string;
  },
): Metadata {
  const url = absoluteUrl(content, opts.path);
  const image = opts.image || DEFAULT_IMAGE;
  const canonical = opts.path || "/";

  return {
    title: opts.title,
    description: opts.description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      locale: "cs_CZ",
      type: "website",
      siteName: content.site.brandName,
      images: [
        {
          url: image,
          alt: `${content.site.brandName} – ${opts.title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      images: [image],
    },
  };
}
