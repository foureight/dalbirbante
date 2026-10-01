const NBSP = "\u00A0";

/** Czech single-letter words that must not sit alone at a line end. */
const ORPHAN_RE =
  /(^|[\s([{„"«])([AaIiKkOoSsUuVvZz]) +(?=[\p{L}\d„"«(])/gu;

function shouldSkipString(value: string): boolean {
  if (!value.includes(" ")) return true;
  if (/^https?:\/\//i.test(value)) return true;
  if (/^(mailto:|tel:)/i.test(value)) return true;
  if (value.startsWith("/") && !/\s/.test(value.slice(1, 8))) {
    // image/path-like values without prose spaces
    if (!/\s[AaIiKkOoSsUuVvZz]\s/.test(value)) return true;
  }
  return false;
}

/** Insert non-breaking spaces after Czech jednoznakovky. */
export function fixCzechOrphans(text: string): string {
  if (!text || shouldSkipString(text)) return text;
  return text.replace(ORPHAN_RE, `$1$2${NBSP}`);
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
