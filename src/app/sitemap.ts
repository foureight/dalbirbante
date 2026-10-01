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

  return paths.map((path) => {
    let changeFrequency: "daily" | "weekly" | "monthly" = "monthly";
    if (path === "" || path === "/menu") changeFrequency = "weekly";
    if (path === "/denni-nabidka") changeFrequency = "daily";

    return {
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency,
      priority: path === "" ? 1 : path === "/menu" || path === "/rozvoz" ? 0.9 : 0.8,
    };
  });
}
