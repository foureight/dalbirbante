import type { Metadata, Viewport } from "next";
import { getContent } from "@/lib/content";
import { JsonLd } from "@/components/json-ld";
import { Providers } from "@/components/providers";
import { buildPageMetadata, siteBaseUrl } from "@/lib/seo";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#009246",
};

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContent();
  return {
    ...buildPageMetadata(content, {
      path: "/",
      title: content.site.metaTitle,
      description: content.site.metaDescription,
    }),
    icons: {
      icon: "/favicon.png",
      apple: "/apple-touch-icon.png",
    },
    manifest: "/site.webmanifest",
    metadataBase: new URL(siteBaseUrl(content)),
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
      <body className="min-h-full flex flex-col font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
