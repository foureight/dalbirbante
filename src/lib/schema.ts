import schemaData from "../../data/schema.json";
import { DELIVERY_ZONES } from "@/lib/order-fees";
import type { FaqItem, SiteContent } from "@/lib/types";

type PageKey = keyof typeof schemaData.pages;

const SERVICE_AREAS = Array.from(
  new Set(
    DELIVERY_ZONES.flatMap((z) =>
      z.areas.split(",").map((a) => a.replace(/\s+/g, " ").trim()),
    ),
  ),
);

export function getRestaurantSchema(content: SiteContent) {
  const base = schemaData.restaurant;
  return {
    ...base,
    "@type": ["Restaurant", "LocalBusiness", "FoodEstablishment"],
    description: content.site.seoDescription,
    email: content.site.email,
    telephone: content.site.phoneHref.replace("tel:", ""),
    priceRange: content.site.priceRange || base.priceRange,
    servesCuisine: content.site.servesCuisine || base.servesCuisine,
    address: {
      "@type": "PostalAddress",
      streetAddress: content.site.geo.streetAddress,
      addressLocality: content.site.geo.addressLocality,
      addressRegion: "Praha",
      postalCode: content.site.geo.postalCode,
      addressCountry: content.site.geo.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: content.site.geo.latitude,
      longitude: content.site.geo.longitude,
    },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${content.site.geo.latitude}%2C${content.site.geo.longitude}`,
    areaServed: SERVICE_AREAS.map((name) => ({
      "@type": "Place",
      name,
    })),
    sameAs: [
      content.site.facebookUrl,
      content.site.instagramUrl,
      content.site.foodoraUrl,
    ].filter(Boolean),
    keywords: content.site.keywords.join(", "),
    potentialAction: {
      "@type": "OrderAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: content.site.orderUrl || "https://www.dalbirbante.cz/menu",
        inLanguage: "cs-CZ",
        actionPlatform: [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform",
        ],
      },
      deliveryMethod: [
        "http://purl.org/goodrelations/v1#DeliveryModeOwnFleet",
        "http://purl.org/goodrelations/v1#DeliveryModePickUp",
      ],
    },
  };
}

export function getWebsiteSchema() {
  return schemaData.website;
}

export function getPageSchema(key: PageKey, content: SiteContent) {
  const page = schemaData.pages[key];
  const metaKey =
    key === "home"
      ? null
      : key === "glutenFree"
        ? "glutenFree"
        : (key as keyof typeof content.site.pageMeta);
  const meta = metaKey ? content.site.pageMeta[metaKey] : null;

  return {
    "@context": "https://schema.org",
    ...page,
    name:
      key === "home"
        ? content.site.metaTitle
        : meta?.title || page.name,
    description:
      key === "home"
        ? content.site.metaDescription
        : meta?.description || page.description,
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

export function getBreadcrumbSchema(
  items: { name: string; path: string }[],
) {
  const base = "https://www.dalbirbante.cz";
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.path === "/" ? `${base}/` : `${base}${item.path}`,
    })),
  };
}
