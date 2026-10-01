import type { SiteContent } from "@/lib/types";

export function JsonLd({ content }: { content: SiteContent }) {
  const { site } = content;
  const restaurant = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": "https://www.dalbirbante.cz/#restaurant",
    name: site.brandName,
    description: site.seoDescription,
    url: "https://www.dalbirbante.cz/",
    image: "https://www.dalbirbante.cz/images/logo.webp",
    telephone: "+420733572911",
    email: site.email,
    priceRange: "€€",
    servesCuisine: ["Italská", "Pizza", "Neapolitan Pizza", "Pasta"],
    acceptsReservations: true,
    hasMenu: "https://www.dalbirbante.cz/menu",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.geo.streetAddress,
      addressLocality: site.geo.addressLocality,
      postalCode: site.geo.postalCode,
      addressCountry: site.geo.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.geo.latitude,
      longitude: site.geo.longitude,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "11:00",
        closes: "20:30",
      },
    ],
    areaServed: [
      { "@type": "Place", name: "Praha 9" },
      { "@type": "Place", name: "Vinoř" },
      { "@type": "Place", name: "Kbely" },
      { "@type": "Place", name: "Satalice" },
      { "@type": "Place", name: "Letňany" },
      { "@type": "Place", name: "Čakovice" },
    ],
    sameAs: [site.facebookUrl, site.instagramUrl],
    keywords: site.keywords.join(", "),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurant) }}
    />
  );
}
