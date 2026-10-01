import { promises as fs } from "fs";
import path from "path";
import type { SiteContent } from "./types";
import { applyCzechOrphansDeep } from "./typography";

const contentPath = path.join(process.cwd(), "data", "content.json");

type GetContentOptions = {
  /** When false, return raw CMS strings (admin / API). Default true. */
  orphans?: boolean;
};

export async function getContent(
  options: GetContentOptions = {},
): Promise<SiteContent> {
  const raw = await fs.readFile(contentPath, "utf8");
  const data = JSON.parse(raw) as SiteContent;
  if (options.orphans === false) return data;
  return applyCzechOrphansDeep(data);
}

export async function saveContent(content: SiteContent): Promise<void> {
  await fs.writeFile(contentPath, JSON.stringify(content, null, 2) + "\n", "utf8");
}
