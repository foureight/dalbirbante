/** Known delivery towns around Vinoř with [lng, lat]. */
export const DELIVERY_TOWN_COORDS: Record<string, [number, number]> = {
  vinoř: [14.5786, 50.1432],
  vinor: [14.5786, 50.1432],
  přezletice: [14.5756, 50.155],
  prezletice: [14.5756, 50.155],
  jenštejn: [14.612, 50.152],
  jenstejn: [14.612, 50.152],
  podolanka: [14.6, 50.16],
  radonice: [14.615, 50.14],
  satalice: [14.576, 50.125],
  kbely: [14.55, 50.133],
  dřevčice: [14.64, 50.155],
  drevcice: [14.64, 50.155],
  miškovice: [14.545, 50.155],
  miskovice: [14.545, 50.155],
  dehtáry: [14.63, 50.145],
  dehtary: [14.63, 50.145],
  svémyslice: [14.65, 50.145],
  svemyslice: [14.65, 50.145],
  cvrčovice: [14.59, 50.168],
  cvrcovice: [14.59, 50.168],
  čakovice: [14.526, 50.152],
  cakovice: [14.526, 50.152],
  letňany: [14.516, 50.137],
  letnany: [14.516, 50.137],
  veleň: [14.555, 50.17],
  velen: [14.555, 50.17],
  třeboradice: [14.51, 50.16],
  treboradice: [14.51, 50.16],
  mírovice: [14.54, 50.165],
  mirovice: [14.54, 50.165],
  "brandýs n./l.": [14.663, 50.186],
  "brandys n./l.": [14.663, 50.186],
  "brandýs n. l.": [14.663, 50.186],
  "brandýs nad labem": [14.663, 50.186],
  brandýs: [14.663, 50.186],
  brandys: [14.663, 50.186],
  "stará boleslav": [14.677, 50.197],
  "stara boleslav": [14.677, 50.197],
  popovice: [14.64, 50.175],
  "horní počernice": [14.614, 50.112],
  "horni pocernice": [14.614, 50.112],
  "černý most": [14.575, 50.105],
  "cerny most": [14.575, 50.105],
  hloubětín: [14.54, 50.105],
  hloubetin: [14.54, 50.105],
  prosek: [14.5, 50.118],
  střížkov: [14.495, 50.125],
  strizkov: [14.495, 50.125],
  vysočany: [14.505, 50.11],
  vysocany: [14.505, 50.11],
  zeleneč: [14.661, 50.132],
  zelenec: [14.661, 50.132],
  "nový brázdim": [14.59, 50.18],
  "novy brazdim": [14.59, 50.18],
  "veliký brázdim": [14.585, 50.188],
  "veliky brazdim": [14.585, 50.188],
  "starý brázdim": [14.58, 50.185],
  "stary brazdim": [14.58, 50.185],
  brázdim: [14.59, 50.182],
  brazdim: [14.59, 50.182],
  zápy: [14.68, 50.17],
  zapy: [14.68, 50.17],
  ostrov: [14.67, 50.16],
  mstětice: [14.69, 50.14],
  mstetice: [14.69, 50.14],
};

const ZONE_COLORS = ["#F6E27A", "#F5B041", "#F0A15C", "#F08A8A", "#E07070"];

export type DeliveryZoneInput = {
  name: string;
  areas: string;
  fee: string;
  min?: string;
};

export type DeliveryZoneFeature = {
  type: "Feature";
  properties: {
    id: string;
    name: string;
    fee: string;
    color: string;
    areas: string;
    knownTowns: string[];
    unknownTowns: string[];
  };
  geometry: {
    type: "Polygon";
    coordinates: [number, number][][];
  };
};

function normalizeTownKey(raw: string): string {
  return raw
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/** Split "A, B, C" area lists into town names (keep n./L. abbreviations intact). */
export function parseAreaTowns(areas: string): string[] {
  return areas
    .split(/[,;|]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function resolveTownCoords(
  town: string,
): { key: string; coords: [number, number] } | null {
  const raw = town.trim();
  if (!raw) return null;
  const direct = raw.toLowerCase();
  if (DELIVERY_TOWN_COORDS[direct]) {
    return { key: direct, coords: DELIVERY_TOWN_COORDS[direct] };
  }
  const ascii = normalizeTownKey(raw);
  if (DELIVERY_TOWN_COORDS[ascii]) {
    return { key: ascii, coords: DELIVERY_TOWN_COORDS[ascii] };
  }
  // Fuzzy: try without punctuation
  const loose = ascii.replace(/[./]/g, " ").replace(/\s+/g, " ").trim();
  for (const [key, coords] of Object.entries(DELIVERY_TOWN_COORDS)) {
    const k = normalizeTownKey(key);
    if (k === loose || k.includes(loose) || loose.includes(k)) {
      return { key, coords };
    }
  }
  // Brandýs shortcuts
  if (loose.startsWith("brandys")) {
    return { key: "brandýs", coords: DELIVERY_TOWN_COORDS["brandýs"] };
  }
  return null;
}

/** Andrew's monotone chain convex hull. Points as [lng, lat]. */
function convexHull(points: [number, number][]): [number, number][] {
  const pts = [...points]
    .map(([x, y]) => [x, y] as [number, number])
    .sort((a, b) => (a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]));
  if (pts.length <= 2) return pts;

  const cross = (
    o: [number, number],
    a: [number, number],
    b: [number, number],
  ) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);

  const lower: [number, number][] = [];
  for (const p of pts) {
    while (
      lower.length >= 2 &&
      cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0
    ) {
      lower.pop();
    }
    lower.push(p);
  }
  const upper: [number, number][] = [];
  for (let i = pts.length - 1; i >= 0; i--) {
    const p = pts[i];
    while (
      upper.length >= 2 &&
      cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0
    ) {
      upper.pop();
    }
    upper.push(p);
  }
  lower.pop();
  upper.pop();
  return lower.concat(upper);
}

/** Expand a ring outward from its centroid by ~bufferKm. */
function inflateRing(
  ring: [number, number][],
  bufferKm: number,
): [number, number][] {
  if (ring.length === 0) return ring;
  const cx = ring.reduce((s, p) => s + p[0], 0) / ring.length;
  const cy = ring.reduce((s, p) => s + p[1], 0) / ring.length;
  const latScale = 1 / 111;
  const lngScale = 1 / (111 * Math.max(0.55, Math.cos((cy * Math.PI) / 180)));
  return ring.map(([lng, lat]) => {
    const dx = lng - cx;
    const dy = lat - cy;
    const dist = Math.hypot(dx / lngScale, dy / latScale) || 0.001;
    const factor = (dist + bufferKm) / dist;
    return [cx + dx * factor, cy + dy * factor] as [number, number];
  });
}

function circlePolygon(
  center: [number, number],
  radiusKm: number,
  steps = 32,
): [number, number][] {
  const [lng, lat] = center;
  const latScale = 1 / 111;
  const lngScale = 1 / (111 * Math.max(0.55, Math.cos((lat * Math.PI) / 180)));
  const ring: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    ring.push([
      lng + Math.cos(a) * radiusKm * lngScale,
      lat + Math.sin(a) * radiusKm * latScale,
    ]);
  }
  return ring;
}

function polygonFromTowns(
  coords: [number, number][],
  bufferKm = 1.35,
): [number, number][] {
  if (coords.length === 0) return [];
  if (coords.length === 1) {
    return circlePolygon(coords[0], bufferKm + 0.4);
  }
  if (coords.length === 2) {
    const mid: [number, number] = [
      (coords[0][0] + coords[1][0]) / 2,
      (coords[0][1] + coords[1][1]) / 2,
    ];
    const hull = convexHull([...coords, mid]);
    const inflated = inflateRing(hull, bufferKm);
    if (
      inflated.length &&
      (inflated[0][0] !== inflated[inflated.length - 1][0] ||
        inflated[0][1] !== inflated[inflated.length - 1][1])
    ) {
      inflated.push(inflated[0]);
    }
    return inflated;
  }
  const hull = convexHull(coords);
  const inflated = inflateRing(hull, bufferKm);
  if (
    inflated.length &&
    (inflated[0][0] !== inflated[inflated.length - 1][0] ||
      inflated[0][1] !== inflated[inflated.length - 1][1])
  ) {
    inflated.push(inflated[0]);
  }
  return inflated;
}

/**
 * Build nested zone polygons from CMS zone area lists.
 * Outer zones include all towns from inner zones (concentric look).
 */
export function buildDeliveryZoneFeatures(
  zones: DeliveryZoneInput[],
): { type: "FeatureCollection"; features: DeliveryZoneFeature[] } {
  const accumulated: [number, number][] = [];
  const features: DeliveryZoneFeature[] = [];

  zones.forEach((zone, index) => {
    const towns = parseAreaTowns(zone.areas);
    const knownTowns: string[] = [];
    const unknownTowns: string[] = [];
    for (const town of towns) {
      const resolved = resolveTownCoords(town);
      if (resolved) {
        knownTowns.push(town);
        accumulated.push(resolved.coords);
      } else {
        unknownTowns.push(town);
      }
    }

    // Deduplicate accumulated points roughly
    const unique = new Map<string, [number, number]>();
    for (const [lng, lat] of accumulated) {
      unique.set(`${lng.toFixed(5)},${lat.toFixed(5)}`, [lng, lat]);
    }
    const points = [...unique.values()];
    const ring =
      points.length > 0
        ? polygonFromTowns(points, 1.25 + index * 0.08)
        : circlePolygon([14.5786, 50.1432], 1.5);

    features.push({
      type: "Feature",
      properties: {
        id: String(index + 1),
        name: zone.name,
        fee: zone.fee,
        color: ZONE_COLORS[index % ZONE_COLORS.length],
        areas: zone.areas,
        knownTowns,
        unknownTowns,
      },
      geometry: {
        type: "Polygon",
        coordinates: [ring],
      },
    });
  });

  return { type: "FeatureCollection", features };
}

export function listKnownDeliveryTowns(): string[] {
  const seen = new Set<string>();
  const labels: string[] = [];
  for (const key of Object.keys(DELIVERY_TOWN_COORDS)) {
    // Prefer accented labels
    if (/[áéěíýóúůřžščňďť]/i.test(key) || !seen.has(normalizeTownKey(key))) {
      const label = key
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      const nk = normalizeTownKey(key);
      if (!seen.has(nk)) {
        seen.add(nk);
        labels.push(label);
      }
    }
  }
  return labels.sort((a, b) => a.localeCompare(b, "cs"));
}
