import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { JsonLd } from "@/components/json-ld";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContent();
  return {
    title: content.site.metaTitle,
    description: content.site.metaDescription,
    keywords: content.site.keywords,
    icons: { icon: "/favicon.png" },
    metadataBase: new URL(content.site.siteUrl || "https://www.dalbirbante.cz"),
    openGraph: {
      title: content.site.metaTitle,
      description: content.site.metaDescription,
      locale: "cs_CZ",
      type: "website",
      url: content.site.siteUrl || "https://www.dalbirbante.cz",
      images: ["/images/lifestyle-01.webp"],
    },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const content = await getContent();
  return (
    <html lang="cs" className="h-full antialiased">
      <head>
        <link
          rel="preload"
          href="/fonts/omnes-regular.woff"
          as="font"
          type="font/woff"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/omnes-black.woff"
          as="font"
          type="font/woff"
          crossOrigin="anonymous"
        />
        <JsonLd content={content} />
      </head>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
