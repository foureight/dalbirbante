import { DELIVERY_ZONES } from "@/lib/order-fees";

export type AddressSuggestion = {
  label: string;
  city: string;
};

const LOCAL_PLACES: AddressSuggestion[] = DELIVERY_ZONES.flatMap((zone) =>
  zone.areas.split(",").map((part) => {
    const city = part.trim();
    return { label: city, city };
  }),
);

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function localSuggestions(query: string): AddressSuggestion[] {
  const q = normalize(query);
  if (!q) return LOCAL_PLACES.slice(0, 8);

  return LOCAL_PLACES.filter((place) => normalize(place.label).includes(q)).slice(
    0,
    8,
  );
}

type PhotonFeature = {
  properties?: {
    name?: string;
    street?: string;
    housenumber?: string;
    city?: string;
    district?: string;
    locality?: string;
    town?: string;
    village?: string;
    suburb?: string;
    state?: string;
    countrycode?: string;
    type?: string;
  };
};

function formatPhoton(feature: PhotonFeature): AddressSuggestion | null {
  const p = feature.properties;
  if (!p) return null;
  if (p.countrycode && p.countrycode.toLowerCase() !== "cz") return null;

  const city =
    p.city ||
    p.town ||
    p.village ||
    p.locality ||
    "";
  const district = (p.district || p.suburb || "").replace(/^Praha-?/i, "").trim();

  // Pro Prahu preferujeme čtvrť (Vinoř, Kbely…) — podle ní počítáme zónu.
  const place =
    city.toLowerCase() === "praha" && district
      ? district
      : city || district;

  const streetParts = [p.street || p.name, p.housenumber].filter(Boolean);
  const street = streetParts.join(" ");

  const label = [street || p.name, place].filter(Boolean).join(", ");
  if (!label) return null;

  return { label, city: place || label };
}

/** Našeptávač adres: lokální obce rozvozu + Photon (ulice). */
export async function suggestAddresses(query: string): Promise<AddressSuggestion[]> {
  const trimmed = query.trim();
  const local = localSuggestions(trimmed);
  if (trimmed.length < 2) return local;

  try {
    const url = new URL("https://photon.komoot.io/api/");
    url.searchParams.set("q", trimmed);
    url.searchParams.set("lang", "default");
    url.searchParams.set("limit", "8");
    // Vinoř / Praha 9 – bias výsledků
    url.searchParams.set("lat", "50.147");
    url.searchParams.set("lon", "14.578");

    const res = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
      next: { revalidate: 0 },
    });
    if (!res.ok) return local;

    const data = (await res.json()) as { features?: PhotonFeature[] };
    const remote = (data.features || [])
      .map(formatPhoton)
      .filter((x): x is AddressSuggestion => Boolean(x));

    const seen = new Set<string>();
    const merged: AddressSuggestion[] = [];
    for (const item of [...local, ...remote]) {
      const key = normalize(item.label);
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(item);
      if (merged.length >= 8) break;
    }
    return merged;
  } catch {
    return local;
  }
}
