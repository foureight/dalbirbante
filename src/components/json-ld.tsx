import type { SiteContent } from "@/lib/types";
import { getRestaurantSchema, getWebsiteSchema } from "@/lib/schema";

export function JsonLd({ content }: { content: SiteContent }) {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [getWebsiteSchema(), getRestaurantSchema(content)],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

export function PageJsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
