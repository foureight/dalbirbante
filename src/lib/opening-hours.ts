/** Opening hours helpers — Europe/Prague, open Tue–Sat. */

export function pragueWeekday(date = new Date()): number {
  // 0 = Sunday … 6 = Saturday
  const day = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Prague",
    weekday: "short",
  }).format(date);
  const map: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  return map[day] ?? date.getDay();
}

/** Closed Sunday and Monday. */
export function isClosedDay(date = new Date()): boolean {
  const d = pragueWeekday(date);
  return d === 0 || d === 1;
}

/** Czech date for the website, e.g. "3. 10. 2026". */
export function formatPragueDate(date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Prague",
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).formatToParts(date);
  const day = parts.find((p) => p.type === "day")?.value ?? "";
  const month = parts.find((p) => p.type === "month")?.value ?? "";
  const year = parts.find((p) => p.type === "year")?.value ?? "";
  return `${Number(day)}. ${Number(month)}. ${year}`;
}

export const CLOSED_BANNER =
  "DNES JE ZAVŘENO — otevřeno zase v úterý.";
