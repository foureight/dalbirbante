const NBSP = "\u00A0";

/** Czech single-letter words that must not sit alone at a line end. */
const ORPHAN_RE =
  /(^|[\s([{„"«])([AaIiKkOoSsUuVvZz]) +(?=[\p{L}\d„"«(])/gu;

/** Keep amount + Kč together (99 Kč → 99\u00A0Kč). */
const PRICE_KC_RE = /(\d) +Kč/g;

function shouldSkipOrphans(value: string): boolean {
  if (!value.includes(" ")) return true;
  if (/^https?:\/\//i.test(value)) return true;
  if (/^(mailto:|tel:)/i.test(value)) return true;
  if (value.startsWith("/") && !/\s[AaIiKkOoSsUuVvZz]\s/.test(value)) {
    return true;
  }
  return false;
}

/** Insert non-breaking spaces after Czech jednoznakovky and before Kč. */
export function fixCzechOrphans(text: string): string {
  if (!text) return text;
  // Always glue prices — even in short strings like "99 Kč"
  let out = text.replace(PRICE_KC_RE, `$1${NBSP}Kč`);
  if (shouldSkipOrphans(out)) return out;
  return out.replace(ORPHAN_RE, `$1$2${NBSP}`);
}

export function applyCzechOrphansDeep<T>(value: T): T {
  if (typeof value === "string") {
    return fixCzechOrphans(value) as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => applyCzechOrphansDeep(item)) as T;
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
      out[key] = applyCzechOrphansDeep(child);
    }
    return out as T;
  }
  return value;
}
