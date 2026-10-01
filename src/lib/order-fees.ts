import { parsePrice } from "@/lib/money";

export const PACKAGING_FEE = 15;

export type DeliveryZoneFee = {
  id: string;
  name: string;
  areas: string;
  areaTokens: string[];
  fee: number;
  min: number;
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

export function calcOrderFees(input: {
  itemsTotal: number;
  itemCount: number;
  fulfillment: "pickup" | "delivery";
  deliveryZoneId?: string | null;
  customerAddress?: string | null;
}) {
  const count = Math.max(0, Math.floor(input.itemCount));
  // Balení 15 Kč za každé jídlo (kus).
  const packagingFee = count > 0 ? PACKAGING_FEE * count : 0;

  // Cena dopravy se počítá výhradně z obce v adrese doručení.
  const zone =
    input.fulfillment === "delivery"
      ? detectDeliveryZoneFromAddress(input.customerAddress || "")
      : null;

  const deliveryFee = zone ? zone.fee : 0;
  const total = input.itemsTotal + packagingFee + deliveryFee;

  return {
    packagingFee,
    packagingCount: count,
    packagingUnit: PACKAGING_FEE,
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
