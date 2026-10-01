import { parsePrice } from "@/lib/money";

export const PACKAGING_FEE = 15;

export type DeliveryZoneFee = {
  id: string;
  name: string;
  areas: string;
  fee: number;
  min: number;
};

export const DELIVERY_ZONES: DeliveryZoneFee[] = [
  {
    id: "zone-1",
    name: "Zóna 1",
    areas: "Vinoř",
    fee: 19,
    min: 199,
  },
  {
    id: "zone-2",
    name: "Zóna 2",
    areas: "Satalice, Kbely, Podolanka, Radonice, Jenštejn",
    fee: 29,
    min: 199,
  },
  {
    id: "zone-3",
    name: "Zóna 3",
    areas: "Dehtáry, Svémyslice, Dřevčice, Miškovice, Přezletice",
    fee: 39,
    min: 299,
  },
  {
    id: "zone-4",
    name: "Zóna 4",
    areas: "Čakovice, Letňany, Veleň, Třeboradice, Mírovice",
    fee: 49,
    min: 299,
  },
  {
    id: "zone-6",
    name: "Zóna 6",
    areas: "Černý Most, Prosek, Horní Počernice, Nový Brázdim, Brandýs n./L., Hloubětín",
    fee: 69,
    min: 399,
  },
];

export function getDeliveryZone(id: string | undefined | null) {
  if (!id) return null;
  return DELIVERY_ZONES.find((z) => z.id === id) ?? null;
}

export function calcOrderFees(input: {
  itemsTotal: number;
  fulfillment: "pickup" | "delivery";
  deliveryZoneId?: string | null;
}) {
  const packagingFee = input.itemsTotal > 0 ? PACKAGING_FEE : 0;
  const zone =
    input.fulfillment === "delivery"
      ? getDeliveryZone(input.deliveryZoneId)
      : null;
  const deliveryFee = zone ? zone.fee : 0;
  const total = input.itemsTotal + packagingFee + deliveryFee;

  return {
    packagingFee,
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
