import type { DailyDish, DailyDishCategory } from "./types";

export const DAILY_CATEGORY_ORDER: DailyDishCategory[] = [
  "polevky",
  "panozzo",
  "pasta",
  "gnocchi",
  "rizota",
  "maso",
  "pizza",
  "dezerty",
  "ostatni",
];

export const DAILY_CATEGORY_LABEL: Record<DailyDishCategory, string> = {
  polevky: "Polévky",
  panozzo: "Panozzo",
  pasta: "Těstoviny",
  gnocchi: "Gnocchi",
  rizota: "Rizota",
  maso: "Maso",
  pizza: "Pizza",
  dezerty: "Dezerty",
  ostatni: "Ostatní",
};

const CATEGORY_EMOJI: Record<DailyDishCategory, string> = {
  polevky: "🍅",
  panozzo: "🥖",
  pasta: "🍝",
  gnocchi: "🧀",
  rizota: "🍚",
  maso: "🥩",
  pizza: "🍕",
  dezerty: "🍰",
  ostatni: "",
};

export function emojiForCategory(category: DailyDishCategory): string {
  return CATEGORY_EMOJI[category] || "";
}

export function mapExcelCategory(label: string): DailyDishCategory {
  const key = label
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
  if (key.startsWith("polev")) return "polevky";
  if (key.startsWith("panozzo")) return "panozzo";
  if (key.startsWith("testovin") || key === "pasta") return "pasta";
  if (key.startsWith("gnocchi")) return "gnocchi";
  if (key.startsWith("rizot")) return "rizota";
  if (key.startsWith("maso")) return "maso";
  if (key.startsWith("pizza")) return "pizza";
  if (key.startsWith("dezert")) return "dezerty";
  return "ostatni";
}

export function inferDailyDishCategory(
  id: string,
  name: string,
): DailyDishCategory {
  const key = `${id} ${name}`
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  if (
    key.includes("crema") ||
    key.includes("minestrone") ||
    key.includes("polev") ||
    key.includes("soup")
  ) {
    return "polevky";
  }
  if (key.includes("panozzo")) return "panozzo";
  if (key.includes("gnocchi")) return "gnocchi";
  if (key.includes("risotto") || key.includes("rizoto")) return "rizota";
  if (key.includes("carne") || key.includes("maso") || key.includes("sfilacciata"))
    return "maso";
  if (
    key.includes("torta") ||
    key.includes("bunet") ||
    key.includes("dezert") ||
    key.includes("cheesecake")
  ) {
    return "dezerty";
  }
  if (key.includes("pizza")) return "pizza";
  if (
    key.includes("pasta") ||
    key.includes("spaghetti") ||
    key.includes("tagliatelle") ||
    key.includes("tagliolini") ||
    key.includes("trofie") ||
    key.includes("penne") ||
    key.includes("lasagne") ||
    key.includes("ravioli") ||
    key.includes("fusilli") ||
    key.includes("casarecce") ||
    key.includes("rigatoni") ||
    key.includes("farfalle") ||
    key.includes("insalata di pasta") ||
    key.includes("insalata di farro")
  ) {
    return "pasta";
  }
  return "ostatni";
}

export function dishCategory(dish: DailyDish): DailyDishCategory {
  if (dish.category && DAILY_CATEGORY_ORDER.includes(dish.category)) {
    return dish.category;
  }
  return inferDailyDishCategory(dish.id, dish.name);
}
