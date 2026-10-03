import type { MetadataRoute } from "next";

/**
 * Allow search + AI crawlers (GEO / AIO). Squarespace previously blocked
 * GPTBot / ClaudeBot / Google-Extended — the new site intentionally does not.
 */
const AI_AGENTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "anthropic-ai",
  "PerplexityBot",
  "Google-Extended",
  "GoogleOther",
  "Bingbot",
  "Applebot",
  "Applebot-Extended",
  "Amazonbot",
  "Bytespider",
  "CCBot",
  "cohere-ai",
  "FacebookBot",
  "meta-externalagent",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/api/public/"],
        disallow: ["/admin", "/admin/", "/api/content", "/api/admin"],
      },
      ...AI_AGENTS.map((userAgent) => ({
        userAgent,
        allow: ["/", "/api/public/"],
        disallow: ["/admin", "/admin/", "/api/content", "/api/admin"],
      })),
    ],
    sitemap: "https://www.dalbirbante.cz/sitemap.xml",
    host: "https://www.dalbirbante.cz",
  };
}
