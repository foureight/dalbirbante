import schemaData from "../../data/schema.json";
import type { FaqItem, SiteContent } from "@/lib/types";

type PageKey = keyof typeof schemaData.pages;

export function getRestaurantSchema(content: SiteContent) {
  const base = schemaData.restaurant;
  return {
    ...base,
    description: content.site.seoDescription,
    email: content.site.email,
    telephone: content.site.phoneHref.replace("tel:", ""),
    priceRange: content.site.priceRange || base.priceRange,
    servesCuisine: content.site.servesCuisine || base.servesCuisine,
    address: {
      "@type": "PostalAddress",
      streetAddress: content.site.geo.streetAddress,
      addressLocality: content.site.geo.addressLocality,
      postalCode: content.site.geo.postalCode,
      addressCountry: content.site.geo.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: content.site.geo.latitude,
      longitude: content.site.geo.longitude,
    },
    sameAs: [
      content.site.facebookUrl,
      content.site.instagramUrl,
      content.site.foodoraUrl,
    ].filter(Boolean),
    keywords: content.site.keywords.join(", "),
  };
}

export function getWebsiteSchema() {
  return schemaData.website;
}

export function getPageSchema(key: PageKey, content: SiteContent) {
  const page = schemaData.pages[key];
  const metaKey =
    key === "glutenFree"
      ? "glutenFree"
      : (key as keyof typeof content.site.pageMeta);
  const meta = content.site.pageMeta[metaKey];

  return {
    "@context": "https://schema.org",
    ...page,
    name: meta?.title || page.name,
    description: meta?.description || page.description,
    isPartOf: {
      "@type": "Restaurant",
      "@id": "https://www.dalbirbante.cz/#restaurant",
    },
  };
}

export function getFaqSchema(id: string, faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": id,
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };
}
