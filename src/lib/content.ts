import { promises as fs } from "fs";
import type { DailyDish, SiteContent } from "./types";
import {
  DAILY_CATEGORY_ORDER,
  inferDailyDishCategory,
} from "./daily-dishes";
import { applyCzechOrphansDeep } from "./typography";
import { dataFile, ensureRuntimeFile } from "./data-dir";

type GetContentOptions = {
  /** When false, return raw CMS strings (admin / API). Default true. */
  orphans?: boolean;
};

function slugifyDishId(name: string, fallback: string) {
  const base = name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return base || fallback;
}

function normalizeDish(item: DailyDish, i: number): DailyDish {
  const id = item.id || slugifyDishId(item.name, `dish-${i + 1}`);
  const name = item.name || "";
  const category =
    item.category && DAILY_CATEGORY_ORDER.includes(item.category)
      ? item.category
      : inferDailyDishCategory(id, name);
  return {
    id,
    name,
    price: item.price || "",
    emoji: item.emoji || "",
    description: item.description || "",
    note: item.note || "",
    category,
  };
}

/** Ensure daily catalog / todayIds exist and items stay in sync. */
function normalizeDaily(data: SiteContent): SiteContent {
  const daily = data.daily;
  if (!daily) return data;

  let catalog = daily.catalog;
  let todayIds = daily.todayIds;
  let items = daily.items || [];

  if (!catalog?.length) {
    catalog = items.map((item, i) => normalizeDish(item, i));
  } else {
    catalog = catalog.map((item, i) => normalizeDish(item, i));
  }

  if (!todayIds?.length) {
    todayIds = catalog.map((d) => d.id);
  }

  const byId = new Map(catalog.map((d) => [d.id, d]));
  items = todayIds
    .map((id) => byId.get(id))
    .filter((d): d is DailyDish => Boolean(d))
    .map((d) => ({ ...d }));

  return {
    ...data,
    daily: { ...daily, catalog, todayIds, items },
  };
}

async function contentPath(): Promise<string> {
  return ensureRuntimeFile("content.json");
}

export async function getContent(
  options: GetContentOptions = {},
): Promise<SiteContent> {
  const file = await contentPath();
  const raw = await fs.readFile(file, "utf8");
  const data = normalizeDaily(JSON.parse(raw) as SiteContent);
  if (options.orphans === false) return data;
  return applyCzechOrphansDeep(data);
}

export async function saveContent(content: SiteContent): Promise<void> {
  const file = dataFile("content.json");
  await fs.mkdir(dataFile(), { recursive: true });
  // Atomic write so a crash mid-save cannot leave empty content.json
  const tmp = `${file}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(content, null, 2) + "\n", "utf8");
  await fs.rename(tmp, file);
}
