import { parsePrice } from "@/lib/money";

/** Krabice (pizza, pasta, denní menu…) */
export const BOX_FEE = 10;
/** Sáček na panozzo */
export const PANOZZO_BAG_FEE = 5;

/** @deprecated use BOX_FEE / PANOZZO_BAG_FEE */
export const PACKAGING_FEE = BOX_FEE;

export type DeliveryZoneFee = {
  id: string;
  name: string;
  areas: string;
  areaTokens: string[];
  fee: number;
  min: number;
};

export type PackagingItem = {
  name?: string;
  categoryId?: string | null;
  qty: number;
};

function normalizePlace(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\./g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export const DELIVERY_ZONES: DeliveryZoneFee[] = [
  {
    id: "zone-1",
    name: "Zóna 1",
    areas: "Vinoř",
    areaTokens: ["vinor"],
    fee: 19,
    min: 199,
  },
  {
    id: "zone-2",
    name: "Zóna 2",
    areas: "Satalice, Kbely, Podolanka, Radonice, Jenštejn",
    areaTokens: ["satalice", "kbely", "podolanka", "radonice", "jenstejn"],
    fee: 29,
    min: 199,
  },
  {
    id: "zone-3",
    name: "Zóna 3",
    areas: "Dehtáry, Svémyslice, Dřevčice, Miškovice, Přezletice",
    areaTokens: [
      "dehtary",
      "svemyslice",
      "drevcice",
      "miskovice",
      "prezletice",
    ],
    fee: 39,
    min: 299,
  },
  {
    id: "zone-4",
    name: "Zóna 4",
    areas: "Čakovice, Letňany, Veleň, Třeboradice, Mírovice",
    areaTokens: ["cakovice", "letnany", "velen", "treboradice", "mirovice"],
    fee: 49,
    min: 299,
  },
  {
    id: "zone-6",
    name: "Zóna 6",
    areas:
      "Černý Most, Prosek, Horní Počernice, Nový Brázdim, Brandýs n./L., Hloubětín",
    areaTokens: [
      "cerny most",
      "prosek",
      "horni pocernice",
      "novy brazdim",
      "brandys",
      "hloubetin",
    ],
    fee: 69,
    min: 399,
  },
];

export function getDeliveryZone(id: string | undefined | null) {
  if (!id) return null;
  return DELIVERY_ZONES.find((z) => z.id === id) ?? null;
}

/** Najde zónu podle textu adresy (obec / čtvrť). */
export function detectDeliveryZoneFromAddress(address: string) {
  const normalized = normalizePlace(address);
  if (!normalized) return null;

  let best: DeliveryZoneFee | null = null;
  let bestScore = 0;

  for (const zone of DELIVERY_ZONES) {
    for (const token of zone.areaTokens) {
      if (normalized.includes(token) && token.length > bestScore) {
        best = zone;
        bestScore = token.length;
      }
    }
  }

  return best;
}

export function isPanozzoItem(item: {
  name?: string;
  categoryId?: string | null;
}) {
  const cat = (item.categoryId || "").toLowerCase();
  if (cat === "panozzo") return true;
  const name = (item.name || "").toLowerCase();
  return name.includes("panozzo");
}

export function packagingUnitForItem(item: {
  name?: string;
  categoryId?: string | null;
}) {
  return isPanozzoItem(item) ? PANOZZO_BAG_FEE : BOX_FEE;
}

export function calcOrderFees(input: {
  itemsTotal: number;
  /** Preferované — balení podle typu jídla */
  items?: PackagingItem[];
  /** Fallback, když chybí items (vše jako krabice) */
  itemCount?: number;
  fulfillment: "pickup" | "delivery";
  deliveryZoneId?: string | null;
  customerAddress?: string | null;
}) {
  let packagingFee = 0;
  let boxCount = 0;
  let bagCount = 0;

  if (input.items?.length) {
    for (const item of input.items) {
      const qty = Math.max(0, Math.floor(item.qty));
      if (qty < 1) continue;
      if (isPanozzoItem(item)) {
        bagCount += qty;
        packagingFee += PANOZZO_BAG_FEE * qty;
      } else {
        boxCount += qty;
        packagingFee += BOX_FEE * qty;
      }
    }
  } else {
    const count = Math.max(0, Math.floor(input.itemCount || 0));
    boxCount = count;
    packagingFee = count > 0 ? BOX_FEE * count : 0;
  }

  // Cena dopravy se počítá výhradně z obce v adrese doručení.
  const zone =
    input.fulfillment === "delivery"
      ? detectDeliveryZoneFromAddress(input.customerAddress || "")
      : null;

  const deliveryFee = zone ? zone.fee : 0;
  const total = input.itemsTotal + packagingFee + deliveryFee;
  const packagingCount = boxCount + bagCount;

  return {
    packagingFee,
    packagingCount,
    packagingBoxCount: boxCount,
    packagingBagCount: bagCount,
    packagingBoxUnit: BOX_FEE,
    packagingBagUnit: PANOZZO_BAG_FEE,
    /** @deprecated průměr / krabice — pro starší UI */
    packagingUnit: BOX_FEE,
    deliveryFee,
    deliveryZone: zone,
    total,
    minOrder: zone?.min ?? 0,
    meetsMinOrder: !zone || input.itemsTotal >= zone.min,
  };
}

export function zoneFromContentFee(fee: string, min: string) {
  return { fee: parsePrice(fee), min: parsePrice(min) };
}
