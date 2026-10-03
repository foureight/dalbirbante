import type { DailyDish, DailyDishCategory } from "./types";

export const DAILY_CATEGORY_ORDER: DailyDishCategory[] = [
  "polevky",
  "panozzo",
  "pasta",
  "gnocchi",
  "pizza",
  "ostatni",
];

export const DAILY_CATEGORY_LABEL: Record<DailyDishCategory, string> = {
  polevky: "Polévky",
  panozzo: "Panozzo",
  pasta: "Pasta",
  gnocchi: "Gnocchi",
  pizza: "Pizza",
  ostatni: "Ostatní",
};

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
    key.includes("fusilli")
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
