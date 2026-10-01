import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.dalbirbante.cz";
  const now = new Date();
  const paths = [
    "",
    "/menu",
    "/denni-nabidka",
    "/rozvoz",
    "/onas",
    "/kontakt",
    "/bezlepkova-pizza-vinor",
  ];

  return paths.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "" || path === "/menu" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.8,
  }));
}
