"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { SiteContent } from "@/lib/types";

type Props = {
  initial: SiteContent;
  authenticated: boolean;
};

function setPath(obj: unknown, path: string[], value: string): unknown {
  if (path.length === 0) return value;
  const [head, ...rest] = path;
  if (Array.isArray(obj)) {
    const copy = [...obj];
    const idx = Number(head);
    copy[idx] = setPath(copy[idx], rest, value);
    return copy;
  }
  const record = { ...(obj as Record<string, unknown>) };
  record[head] = setPath(record[head], rest, value);
  return record;
}

const FIELD_CONTROL =
  "rounded-[6.4px] border border-[var(--line)] bg-[#fbfbfb] text-xl text-[var(--ink)] transition focus-visible:border-[var(--brand-green)] focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/20";

function Field({
  label,
  value,
  onChange,
  multiline,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  hint?: string;
  /** @deprecated kept for call-site compat; visual treatment is now uniform */
  emphasize?: boolean;
}) {
  const useTextarea = multiline || value.length > 80;
  return (
    <div className="space-y-2.5">
      <Label className="text-lg font-bold text-[var(--ink)]">{label}</Label>
      {hint ? (
        <p className="text-base leading-snug text-[var(--muted)]">{hint}</p>
      ) : null}
      {useTextarea ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={Math.min(10, Math.max(4, Math.ceil(value.length / 55)))}
          className={`min-h-[8rem] px-4 py-3.5 text-xl leading-relaxed ${FIELD_CONTROL}`}
        />
      ) : (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`h-14 px-4 text-xl ${FIELD_CONTROL}`}
        />
      )}
    </div>
  );
}

function Panel({
  title,
  badge,
  hint,
  children,
}: {
  title: string;
  badge?: string;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[8px] border border-[var(--line)] bg-white p-5 shadow-sm md:p-8">
      <div className="flex flex-wrap items-center gap-3">
        {badge ? (
          <span className="rounded-full bg-[var(--brand-green)] px-3.5 py-1 text-sm font-extrabold uppercase tracking-wide text-white">
            {badge}
          </span>
        ) : null}
        <h2 className="text-3xl font-extrabold leading-tight text-[var(--brand-red)] md:text-4xl">
          {title}
        </h2>
      </div>
      {hint ? (
        <div className="mt-3 text-lg leading-relaxed text-[var(--muted)]">
          {hint}
        </div>
      ) : null}
      <div className="mt-7 space-y-6">{children}</div>
    </section>
  );
}

function ItemCard({
  title,
  typeLabel,
  meta,
  accent = "red",
  children,
}: {
  title: string;
  typeLabel?: string;
  meta?: string;
  accent?: "red" | "green";
  children: ReactNode;
}) {
  const accentBorder =
    accent === "green" ? "border-l-[var(--brand-green)]" : "border-l-[var(--brand-red)]";
  const typeBg =
    accent === "green"
      ? "bg-[var(--brand-green)]/12 text-[var(--brand-green-deep)]"
      : "bg-[var(--brand-red)]/10 text-[var(--brand-red)]";
  return (
    <div
      className={`space-y-5 rounded-[8px] border border-[var(--line)] border-l-[6px] ${accentBorder} bg-white p-5 shadow-sm md:p-6`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 space-y-2">
          {typeLabel ? (
            <span
              className={`inline-flex rounded-full px-3 py-1 text-sm font-extrabold uppercase tracking-wide ${typeBg}`}
            >
              {typeLabel}
            </span>
          ) : null}
          <p className="text-2xl font-extrabold leading-tight text-[var(--ink)] md:text-3xl">
            {title}
          </p>
          {meta ? (
            <p className="text-lg font-bold text-[var(--brand-red)]">{meta}</p>
          ) : null}
        </div>
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

function categoryTypeLabel(catId: string, catName: string): string {
  const id = catId.toLowerCase();
  const name = catName.toLowerCase();
  if (id === "pizza" || name.includes("pizza")) return "Pizza";
  if (id === "pasta" || name.includes("pasta")) return "Pasta";
  if (id === "drinks" || name.includes("nápoj") || name.includes("napoj"))
    return "Nápoj";
  if (id.includes("panozzo") || name.includes("panozzo")) return "Panozzo";
  return catName || "Produkt";
}

function isPizzaCategory(catId: string, catName: string): boolean {
  return categoryTypeLabel(catId, catName) === "Pizza";
}

function AdminImageField({
  label,
  value,
  onChange,
  onStatus,
  onError,
  hint = "PNG/JPG se při nahrání převedou do WebP.",
}: {
  label: string;
  value: string;
  onChange: (path: string) => void;
  onStatus: (msg: string) => void;
  onError: (msg: string | null) => void;
  hint?: string;
}) {
  return (
    <div className="space-y-3 rounded-[8px] border border-[var(--line)] bg-[var(--paper-soft)] p-4">
      <p className="text-lg font-bold text-[var(--ink)]">{label}</p>
      <div className="flex flex-wrap items-start gap-4">
        <div className="relative h-24 w-36 shrink-0 overflow-hidden rounded-[6.4px] bg-white">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="grid h-full place-items-center text-sm text-[var(--muted)]">
              bez fotky
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-3">
          <Field
            label="Cesta k fotce"
            value={value}
            onChange={onChange}
            hint={hint}
          />
          <div className="flex flex-wrap gap-2">
            <label className="inline-flex cursor-pointer items-center rounded-full border border-[var(--line)] bg-white px-5 py-2.5 text-base font-semibold transition hover:border-[var(--brand-green)]">
              Nahrát fotku (→ WebP)
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="sr-only"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  if (!file) return;
                  onError(null);
                  const body = new FormData();
                  body.append("file", file);
                  const res = await fetch("/api/admin/upload", {
                    method: "POST",
                    body,
                  });
                  const data = (await res.json().catch(() => ({}))) as {
                    path?: string;
                    error?: string;
                    converted?: boolean;
                  };
                  if (!res.ok || !data.path) {
                    onError(data.error || "Nahrání fotky selhalo.");
                    return;
                  }
                  onChange(data.path);
                  onStatus(
                    data.converted
                      ? "Fotka převedena do WebP — uložte změny."
                      : "Fotka nahrána — uložte změny.",
                  );
                }}
              />
            </label>
            {value ? (
              <button
                type="button"
                className="rounded-full border border-[var(--line)] px-5 py-2.5 text-base font-semibold text-[var(--muted)] transition hover:border-[var(--brand-red)] hover:text-[var(--brand-red)]"
                onClick={() => onChange("")}
              >
                Odebrat fotku
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

const HOME_SPOTLIGHT_KEYS = new Set([
  "pizzaWeekTitle",
  "pizzaWeekText",
  "pizzaWeekImage",
  "dailyMenuTitle",
  "dailyMenuText",
  "dailyMenuImage",
  "glutenFreeTitle",
  "glutenFreeText",
  "glutenFreeImage",
]);

const NAV_LABELS: Record<string, string> = {
  menu: "Menu",
  daily: "Denní nabídka",
  delivery: "Rozvoz",
  about: "O nás",
  contact: "Kontakt",
  glutenFree: "Bezlepková pizza",
};

const SECTIONS: { key: keyof SiteContent; label: string }[] = [
  { key: "site", label: "Základní údaje" },
  { key: "nav", label: "Navigace" },
  { key: "home", label: "Úvodní stránka" },
  { key: "about", label: "O nás" },
  { key: "menuPage", label: "Stránka menu" },
  { key: "menuCategories", label: "Menu · pizzy a produkty" },
  { key: "daily", label: "Denní nabídka" },
  { key: "delivery", label: "Rozvoz" },
  { key: "glutenFree", label: "Bezlepková" },
  { key: "contact", label: "Kontakt" },
  { key: "footer", label: "Patička" },
];

export function AdminClient({ initial, authenticated }: Props) {
  const router = useRouter();
  const [authed, setAuthed] = useState(authenticated);
  const [password, setPassword] = useState("");
  const [content, setContent] = useState(initial);
  const [section, setSection] = useState<keyof SiteContent>("menuCategories");
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sectionData = content[section];

  function updateAt(path: string[], value: string) {
    setContent((prev) => setPath(prev, path, value) as SiteContent);
  }

  function addMenuItem(categoryIndex: number) {
    setContent((prev) => {
      const menuCategories = prev.menuCategories.map((cat, i) =>
        i === categoryIndex
          ? {
              ...cat,
              items: [
                ...cat.items,
                { name: "", description: "", price: "", image: "", badge: "" },
              ],
            }
          : cat,
      );
      return { ...prev, menuCategories };
    });
    setStatus("Přidána nová položka — vyplňte údaje a uložte změny.");
    setError(null);
  }

  function removeMenuItem(categoryIndex: number, itemIndex: number) {
    setContent((prev) => {
      const cat = prev.menuCategories[categoryIndex];
      if (!cat || cat.items.length <= 1) return prev;
      const menuCategories = prev.menuCategories.map((c, i) =>
        i === categoryIndex
          ? { ...c, items: c.items.filter((_, ii) => ii !== itemIndex) }
          : c,
      );
      return { ...prev, menuCategories };
    });
    setStatus("Položka odebrána — uložte změny, aby zmizela z menu.");
    setError(null);
  }

  function moveMenuItem(
    categoryIndex: number,
    itemIndex: number,
    direction: -1 | 1,
  ) {
    setContent((prev) => {
      const cat = prev.menuCategories[categoryIndex];
      if (!cat) return prev;
      const target = itemIndex + direction;
      if (target < 0 || target >= cat.items.length) return prev;
      const items = [...cat.items];
      const [row] = items.splice(itemIndex, 1);
      items.splice(target, 0, row);
      const menuCategories = prev.menuCategories.map((c, i) =>
        i === categoryIndex ? { ...c, items } : c,
      );
      return { ...prev, menuCategories };
    });
  }

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      setError("Špatné heslo.");
      return;
    }
    setAuthed(true);
    router.refresh();
  }

  async function logout() {
    await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    setAuthed(false);
    router.refresh();
  }

  async function save() {
    setSaving(true);
    setStatus(null);
    setError(null);
    const res = await fetch("/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    setSaving(false);
    if (!res.ok) {
      setError("Uložení selhalo. Zkontrolujte přihlášení.");
      return;
    }
    setStatus("Uloženo. Změny jsou hned vidět na webu.");
    router.refresh();
  }

  const editor = useMemo(() => {
    if (section === "menuCategories") {
      return (
        <div className="space-y-8">
          <div className="rounded-[8px] border border-[var(--brand-green)]/25 bg-[var(--brand-green)]/8 px-5 py-4 md:px-6 md:py-5">
            <p className="text-xl font-extrabold text-[var(--brand-green-deep)] md:text-2xl">
              Menu · pizzy a produkty
            </p>
            <p className="mt-1 text-lg leading-relaxed text-[var(--muted)]">
              Každá karta má typ (Pizza, Pasta…). Upravte název a cenu, pak uložte
              změny nahoře.
            </p>
          </div>
          {content.menuCategories.map((cat, ci) => {
            const typeLabel = categoryTypeLabel(cat.id, cat.name);
            const pizza = isPizzaCategory(cat.id, cat.name);
            const addLabel = pizza
              ? "+ Přidat pizzu"
              : `+ Přidat ${typeLabel.toLowerCase()}`;
            return (
              <Panel
                key={cat.id}
                badge={typeLabel}
                title={cat.name || `Kategorie ${ci + 1}`}
                hint={
                  pizza
                    ? `${cat.items.length}× pizza v nabídce. Štítek „Pizza týdne“ nastavíte u konkrétní pizzy.`
                    : `${cat.items.length} položek v kategorii ${typeLabel}.`
                }
              >
                <details className="rounded-[8px] border border-[var(--line)] bg-[var(--paper-soft)] px-4 py-3">
                  <summary className="cursor-pointer text-lg font-bold text-[var(--ink)]">
                    Nastavení kategorie
                  </summary>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <Field
                      label="Název kategorie (zobrazený na webu)"
                      value={cat.name}
                      onChange={(v) =>
                        updateAt(["menuCategories", String(ci), "name"], v)
                      }
                    />
                    <Field
                      label="Technické ID"
                      value={cat.id}
                      onChange={(v) =>
                        updateAt(["menuCategories", String(ci), "id"], v)
                      }
                      hint="Neměňte, pokud nevíte k čemu slouží (odkaz v menu)."
                    />
                  </div>
                </details>
                <div className="space-y-5">
                  {cat.items.map((item, ii) => (
                    <ItemCard
                      key={`${cat.id}-${ii}`}
                      typeLabel={typeLabel}
                      title={item.name?.trim() || `Nová ${typeLabel.toLowerCase()}`}
                      meta={
                        [
                          item.price ? item.price : null,
                          item.badge ? `Štítek: ${item.badge}` : null,
                          `#${ii + 1}`,
                        ]
                          .filter(Boolean)
                          .join(" · ")
                      }
                      accent={pizza ? "green" : "red"}
                    >
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          className="rounded-full border border-[var(--line)] px-4 py-2 text-base font-semibold transition hover:border-[var(--brand-green)] disabled:opacity-40"
                          disabled={ii === 0}
                          onClick={() => moveMenuItem(ci, ii, -1)}
                        >
                          Nahoru
                        </button>
                        <button
                          type="button"
                          className="rounded-full border border-[var(--line)] px-4 py-2 text-base font-semibold transition hover:border-[var(--brand-green)] disabled:opacity-40"
                          disabled={ii >= cat.items.length - 1}
                          onClick={() => moveMenuItem(ci, ii, 1)}
                        >
                          Dolů
                        </button>
                        <button
                          type="button"
                          className="rounded-full border border-[var(--line)] px-4 py-2 text-base font-semibold text-[var(--muted)] transition hover:border-[var(--brand-red)] hover:text-[var(--brand-red)] disabled:opacity-40"
                          disabled={cat.items.length <= 1}
                          onClick={() => removeMenuItem(ci, ii)}
                        >
                          Smazat
                        </button>
                      </div>
                      <div className="grid gap-5 md:grid-cols-2">
                        <Field
                          label={pizza ? "Název pizzy" : "Název"}
                          value={item.name}
                          onChange={(v) =>
                            updateAt(
                              [
                                "menuCategories",
                                String(ci),
                                "items",
                                String(ii),
                                "name",
                              ],
                              v,
                            )
                          }
                        />
                        <Field
                          label="Cena"
                          value={item.price}
                          onChange={(v) =>
                            updateAt(
                              [
                                "menuCategories",
                                String(ci),
                                "items",
                                String(ii),
                                "price",
                              ],
                              v,
                            )
                          }
                        />
                        <Field
                          label="Štítek na webu (volitelné)"
                          value={item.badge || ""}
                          onChange={(v) =>
                            updateAt(
                              [
                                "menuCategories",
                                String(ci),
                                "items",
                                String(ii),
                                "badge",
                              ],
                              v,
                            )
                          }
                          hint={
                            pizza
                              ? 'Např. „Pizza týdne“ nebo „Pizza speciale“.'
                              : "Volitelný štítek nad názvem. Prázdné = bez štítku."
                          }
                        />
                        <div className="md:col-span-2">
                          <Field
                            label={pizza ? "Složení / popis" : "Popis"}
                            value={item.description}
                            onChange={(v) =>
                              updateAt(
                                [
                                  "menuCategories",
                                  String(ci),
                                  "items",
                                  String(ii),
                                  "description",
                                ],
                                v,
                              )
                            }
                            multiline
                          />
                        </div>
                        <div className="md:col-span-2 space-y-3 rounded-[8px] border border-[var(--line)] bg-[var(--paper-soft)] p-4">
                          <p className="text-lg font-bold text-[var(--ink)]">
                            Fotka {pizza ? "pizzy" : "produktu"}
                          </p>
                          <div className="flex flex-wrap items-start gap-4">
                            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full bg-white">
                              {item.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={item.image}
                                  alt=""
                                  className="h-full w-full object-contain p-1"
                                />
                              ) : (
                                <span className="grid h-full place-items-center text-sm text-[var(--muted)]">
                                  bez fotky
                                </span>
                              )}
                            </div>
                            <div className="min-w-0 flex-1 space-y-3">
                              <Field
                                label="Cesta k fotce"
                                value={item.image || ""}
                                onChange={(v) =>
                                  updateAt(
                                    [
                                      "menuCategories",
                                      String(ci),
                                      "items",
                                      String(ii),
                                      "image",
                                    ],
                                    v,
                                  )
                                }
                                hint="PNG/JPG se při nahrání automaticky převedou do WebP."
                              />
                              <div className="flex flex-wrap items-center gap-2">
                                <label className="inline-flex cursor-pointer items-center rounded-full border border-[var(--line)] bg-white px-5 py-2.5 text-base font-semibold transition hover:border-[var(--brand-green)]">
                                  Nahrát fotku (→ WebP)
                                  <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,image/gif"
                                    className="sr-only"
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0];
                                      e.target.value = "";
                                      if (!file) return;
                                      setError(null);
                                      const body = new FormData();
                                      body.append("file", file);
                                      const res = await fetch(
                                        "/api/admin/upload",
                                        {
                                          method: "POST",
                                          body,
                                        },
                                      );
                                      const data = (await res
                                        .json()
                                        .catch(() => ({}))) as {
                                        path?: string;
                                        error?: string;
                                        converted?: boolean;
                                      };
                                      if (!res.ok || !data.path) {
                                        setError(
                                          data.error || "Nahrání fotky selhalo.",
                                        );
                                        return;
                                      }
                                      updateAt(
                                        [
                                          "menuCategories",
                                          String(ci),
                                          "items",
                                          String(ii),
                                          "image",
                                        ],
                                        data.path,
                                      );
                                      setStatus(
                                        data.converted
                                          ? "Fotka převedena do WebP — uložte změny."
                                          : "Fotka nahrána jako WebP — uložte změny.",
                                      );
                                    }}
                                  />
                                </label>
                                {item.image ? (
                                  <button
                                    type="button"
                                    className="rounded-full border border-[var(--line)] px-5 py-2.5 text-base font-semibold text-[var(--muted)] transition hover:border-[var(--brand-red)] hover:text-[var(--brand-red)]"
                                    onClick={() =>
                                      updateAt(
                                        [
                                          "menuCategories",
                                          String(ci),
                                          "items",
                                          String(ii),
                                          "image",
                                        ],
                                        "",
                                      )
                                    }
                                  >
                                    Odebrat fotku
                                  </button>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </ItemCard>
                  ))}
                  <Button
                    type="button"
                    className="h-14 rounded-full bg-[var(--brand-green)] px-8 text-lg font-extrabold text-white hover:opacity-90"
                    onClick={() => addMenuItem(ci)}
                  >
                    {addLabel}
                  </Button>
                </div>
              </Panel>
            );
          })}
        </div>
      );
    }

    if (section === "delivery") {
      return (
        <div className="space-y-6">
          <Panel title="Rozvoz — texty stránky">
            <Field
              label="Titulek"
              value={content.delivery.title}
              onChange={(v) => updateAt(["delivery", "title"], v)}
            />
            <Field
              label="Úvod"
              value={content.delivery.intro}
              onChange={(v) => updateAt(["delivery", "intro"], v)}
              multiline
            />
          </Panel>
          <div className="space-y-4">
            {content.delivery.zones.map((z, i) => (
              <ItemCard key={i} title={z.name || `Zóna ${i + 1}`}>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    label="Zóna"
                    value={z.name}
                    onChange={(v) =>
                      updateAt(["delivery", "zones", String(i), "name"], v)
                    }
                  />
                  <Field
                    label="Poplatek"
                    value={z.fee}
                    onChange={(v) =>
                      updateAt(["delivery", "zones", String(i), "fee"], v)
                    }
                  />
                  <Field
                    label="Oblasti"
                    value={z.areas}
                    onChange={(v) =>
                      updateAt(["delivery", "zones", String(i), "areas"], v)
                    }
                    multiline
                  />
                  <Field
                    label="Min. objednávka"
                    value={z.min}
                    onChange={(v) =>
                      updateAt(["delivery", "zones", String(i), "min"], v)
                    }
                  />
                </div>
              </ItemCard>
            ))}
          </div>
        </div>
      );
    }

    if (section === "home") {
      const h = content.home;
      const spotlights = [
        {
          key: "pizzaWeek",
          typeLabel: "Aktualita",
          title: "Pizza týdne",
          titlePath: "pizzaWeekTitle",
          textPath: "pizzaWeekText",
          imagePath: "pizzaWeekImage",
          titleValue: h.pizzaWeekTitle,
          textValue: h.pizzaWeekText,
          imageValue: h.pizzaWeekImage || "",
        },
        {
          key: "dailyMenu",
          typeLabel: "Aktualita",
          title: "Denní menu",
          titlePath: "dailyMenuTitle",
          textPath: "dailyMenuText",
          imagePath: "dailyMenuImage",
          titleValue: h.dailyMenuTitle,
          textValue: h.dailyMenuText,
          imageValue: h.dailyMenuImage || "",
        },
        {
          key: "glutenFree",
          typeLabel: "Aktualita",
          title: "Bezlepková nabídka",
          titlePath: "glutenFreeTitle",
          textPath: "glutenFreeText",
          imagePath: "glutenFreeImage",
          titleValue: h.glutenFreeTitle,
          textValue: h.glutenFreeText,
          imageValue: h.glutenFreeImage || "",
        },
      ] as const;
      return (
        <div className="space-y-6">
          <Panel
            badge="Zelený pruh"
            title="Aktuality na úvodní stránce"
            hint="Tři karty v zeleném pruhu — fotka nahoře, pod ní nadpis a text (jako krátká aktualita). Po úpravě uložte změny."
          >
            {spotlights.map((item) => (
              <ItemCard
                key={item.key}
                typeLabel={item.typeLabel}
                title={item.title}
                accent="green"
              >
                <AdminImageField
                  label="Fotka nad textem"
                  value={item.imageValue}
                  onChange={(v) => updateAt(["home", item.imagePath], v)}
                  onStatus={setStatus}
                  onError={setError}
                />
                <Field
                  label="Nadpis"
                  value={item.titleValue}
                  onChange={(v) => updateAt(["home", item.titlePath], v)}
                  multiline
                  hint="Enter = nový řádek v nadpisu (např. NABÍDKA PIZZA / TÝDNE)."
                />
                <Field
                  label="Text aktuality"
                  value={item.textValue}
                  onChange={(v) => updateAt(["home", item.textPath], v)}
                  multiline
                />
              </ItemCard>
            ))}
          </Panel>
          <Panel title="Úvodní stránka — ostatní texty">
            {Object.entries(h).map(([key, value]) =>
              typeof value === "string" && !HOME_SPOTLIGHT_KEYS.has(key) ? (
                <Field
                  key={key}
                  label={key}
                  value={value}
                  onChange={(v) => updateAt(["home", key], v)}
                  multiline={value.length > 60}
                />
              ) : null,
            )}
          </Panel>
          <Panel title="Nabídka (položky seznamu)">
            {h.offerItems.map((item, i) => (
              <Field
                key={i}
                label={`Položka ${i + 1}`}
                value={item}
                onChange={(v) => updateAt(["home", "offerItems", String(i)], v)}
              />
            ))}
          </Panel>
          <Panel title="Výhody / features">
            {h.features.map((item, i) => (
              <ItemCard key={i} title={`Výhoda ${i + 1}`}>
                <Field
                  label="Název"
                  value={item.title}
                  onChange={(v) =>
                    updateAt(["home", "features", String(i), "title"], v)
                  }
                />
                <Field
                  label="Text"
                  value={item.text}
                  onChange={(v) =>
                    updateAt(["home", "features", String(i), "text"], v)
                  }
                />
              </ItemCard>
            ))}
          </Panel>
          <Panel title="FAQ">
            <Field
              label="Nadpis FAQ"
              value={h.faqTitle}
              onChange={(v) => updateAt(["home", "faqTitle"], v)}
            />
            {h.faqs.map((f, i) => (
              <ItemCard key={i} title={`Otázka ${i + 1}`}>
                <Field
                  label="Otázka"
                  value={f.q}
                  onChange={(v) =>
                    updateAt(["home", "faqs", String(i), "q"], v)
                  }
                />
                <Field
                  label="Odpověď"
                  value={f.a}
                  onChange={(v) =>
                    updateAt(["home", "faqs", String(i), "a"], v)
                  }
                  multiline
                />
              </ItemCard>
            ))}
          </Panel>
        </div>
      );
    }

    if (section === "daily") {
      const d = content.daily;
      return (
        <div className="space-y-6">
          <Panel
            title="Denní nabídka — texty stránky"
            hint={
              <>
                Tyto texty se zobrazují na{" "}
                <a
                  href="/denni-nabidka"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-[var(--brand-red)] underline"
                >
                  /denni-nabidka
                </a>
                . Intro pište srozumitelně — nemusí začínat „Každý den“.
              </>
            }
          >
            <Field
              label="Nadpis stránky"
              value={d.title}
              onChange={(v) => updateAt(["daily", "title"], v)}
            />
            <Field
              label="Úvodní text (intro)"
              value={d.intro}
              onChange={(v) => updateAt(["daily", "intro"], v)}
              multiline
              hint="Hlavní odstavec pod fotkou — měňte podle aktuální nabídky."
            />
            <Field
              label="Poznámka pod nabídkou"
              value={d.note}
              onChange={(v) => updateAt(["daily", "note"], v)}
              multiline
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Datum"
                value={d.date}
                onChange={(v) => updateAt(["daily", "date"], v)}
                hint="Zobrazí se vedle nadpisu (např. 1. 10. 2026)."
              />
              <Field
                label="Čas podávání"
                value={d.hours}
                onChange={(v) => updateAt(["daily", "hours"], v)}
              />
            </div>
          </Panel>

          <Panel
            badge="Denní"
            title="Položky denního menu"
            hint="Aktuální jídla na denní nabídce."
          >
            {d.items.map((item, i) => (
              <ItemCard
                key={i}
                typeLabel="Denní menu"
                title={item.name?.trim() || `Jídlo ${i + 1}`}
                meta={item.price || undefined}
              >
                <div className="grid gap-4 sm:grid-cols-[1fr_auto_auto]">
                  <Field
                    label="Název"
                    value={item.name}
                    onChange={(v) =>
                      updateAt(["daily", "items", String(i), "name"], v)
                    }
                  />
                  <Field
                    label="Cena"
                    value={item.price}
                    onChange={(v) =>
                      updateAt(["daily", "items", String(i), "price"], v)
                    }
                  />
                  <Field
                    label="Emoji"
                    value={item.emoji}
                    onChange={(v) =>
                      updateAt(["daily", "items", String(i), "emoji"], v)
                    }
                  />
                </div>
                <Field
                  label="Popis"
                  value={item.description}
                  onChange={(v) =>
                    updateAt(["daily", "items", String(i), "description"], v)
                  }
                  multiline
                />
                <Field
                  label="Poznámka"
                  value={item.note}
                  onChange={(v) =>
                    updateAt(["daily", "items", String(i), "note"], v)
                  }
                />
              </ItemCard>
            ))}
          </Panel>

          <Panel
            title="Text na úvodní stránce"
            hint="Krátký text u dlaždice „Denní menu přes poledne“ v zeleném pruhu."
          >
            <Field
              label="Text dlaždice (home)"
              value={content.home.dailyMenuText}
              onChange={(v) => updateAt(["home", "dailyMenuText"], v)}
              multiline
              hint="Měl by být jiný než intro na stránce denní nabídky."
            />
          </Panel>
        </div>
      );
    }

    if (section === "glutenFree") {
      return (
        <div className="space-y-6">
          <Panel title="Bezlepková — texty stránky">
            {Object.entries(content.glutenFree).map(([key, value]) =>
              typeof value === "string" ? (
                <Field
                  key={key}
                  label={key}
                  value={value}
                  onChange={(v) => updateAt(["glutenFree", key], v)}
                  multiline={value.length > 60}
                />
              ) : null,
            )}
          </Panel>
          <Panel title="Bezlepkové produkty">
            {(content.glutenFree.products || []).map((item, i) => (
              <Field
                key={i}
                label={`Produkt ${i + 1}`}
                value={item}
                onChange={(v) =>
                  updateAt(["glutenFree", "products", String(i)], v)
                }
              />
            ))}
          </Panel>
          <Panel title="Jak připravujeme">
            {content.glutenFree.howItems.map((item, i) => (
              <Field
                key={i}
                label={`Bod ${i + 1}`}
                value={item}
                onChange={(v) =>
                  updateAt(["glutenFree", "howItems", String(i)], v)
                }
              />
            ))}
          </Panel>
          <Panel title="FAQ">
            {content.glutenFree.faqs.map((f, i) => (
              <ItemCard key={i} title={`Otázka ${i + 1}`}>
                <Field
                  label="Otázka"
                  value={f.q}
                  onChange={(v) =>
                    updateAt(["glutenFree", "faqs", String(i), "q"], v)
                  }
                />
                <Field
                  label="Odpověď"
                  value={f.a}
                  onChange={(v) =>
                    updateAt(["glutenFree", "faqs", String(i), "a"], v)
                  }
                  multiline
                />
              </ItemCard>
            ))}
          </Panel>
        </div>
      );
    }

    if (section === "about") {
      return (
        <div className="space-y-6">
          <Panel title="O nás — texty stránky">
            <Field
              label="Titulek"
              value={content.about.title}
              onChange={(v) => updateAt(["about", "title"], v)}
            />
            <Field
              label="Lead"
              value={content.about.lead}
              onChange={(v) => updateAt(["about", "lead"], v)}
              multiline
            />
            {content.about.paragraphs.map((p, i) => (
              <Field
                key={i}
                label={`Odstavec ${i + 1}`}
                value={p}
                onChange={(v) =>
                  updateAt(["about", "paragraphs", String(i)], v)
                }
                multiline
              />
            ))}
          </Panel>
          <Panel title="FAQ">
            <Field
              label="Nadpis FAQ"
              value={content.about.faqTitle}
              onChange={(v) => updateAt(["about", "faqTitle"], v)}
            />
            {content.about.faqs.map((f, i) => (
              <ItemCard key={i} title={`Otázka ${i + 1}`}>
                <Field
                  label="Otázka"
                  value={f.q}
                  onChange={(v) =>
                    updateAt(["about", "faqs", String(i), "q"], v)
                  }
                />
                <Field
                  label="Odpověď"
                  value={f.a}
                  onChange={(v) =>
                    updateAt(["about", "faqs", String(i), "a"], v)
                  }
                  multiline
                />
              </ItemCard>
            ))}
          </Panel>
        </div>
      );
    }

    if (section === "menuPage") {
      const m = content.menuPage;
      return (
        <div className="space-y-6">
          <Panel title="Stránka menu — texty">
            {(
              [
                ["title", "Titulek"],
                ["intro", "Úvod"],
                ["doughChoiceNote", "Poznámka klasická / bezlepková"],
                ["extrasTitle", "Nadpis přísad navíc"],
                ["extrasText", "Text přísad navíc"],
                ["glutenNote", "Poznámka bez lepku"],
                ["allergensTitle", "Nadpis alergenů"],
                ["allergensText", "Text alergenů"],
                ["orderNote", "Poznámka k objednávce"],
              ] as const
            ).map(([key, label]) => (
              <Field
                key={key}
                label={label}
                value={m[key]}
                onChange={(v) => updateAt(["menuPage", key], v)}
                multiline={m[key].length > 60}
              />
            ))}
          </Panel>
          <Panel title="FAQ">
            <Field
              label="Nadpis FAQ"
              value={m.faqTitle}
              onChange={(v) => updateAt(["menuPage", "faqTitle"], v)}
            />
            {m.faqs.map((f, i) => (
              <ItemCard key={i} title={`Otázka ${i + 1}`}>
                <Field
                  label="Otázka"
                  value={f.q}
                  onChange={(v) =>
                    updateAt(["menuPage", "faqs", String(i), "q"], v)
                  }
                />
                <Field
                  label="Odpověď"
                  value={f.a}
                  onChange={(v) =>
                    updateAt(["menuPage", "faqs", String(i), "a"], v)
                  }
                  multiline
                />
              </ItemCard>
            ))}
          </Panel>
        </div>
      );
    }

    if (section === "nav") {
      const data = content.nav as Record<string, string>;
      return (
        <Panel
          title="Navigace"
          hint="Popisky v horním menu a v patičce. Po uložení se projeví hned na celém webu."
        >
          {Object.entries(data).map(([key, value]) =>
            typeof value === "string" ? (
              <Field
                key={key}
                label={NAV_LABELS[key] || key}
                value={value}
                onChange={(v) => updateAt(["nav", key], v)}
              />
            ) : null,
          )}
        </Panel>
      );
    }

    // Generic object of strings (site, contact, footer, …)
    const data = sectionData as Record<string, string>;
    const sectionLabel =
      SECTIONS.find((s) => s.key === section)?.label || String(section);
    return (
      <Panel title={sectionLabel}>
        {Object.entries(data).map(([key, value]) =>
          typeof value === "string" ? (
            <Field
              key={key}
              label={key}
              value={value}
              onChange={(v) => updateAt([section, key], v)}
              multiline={value.length > 70}
            />
          ) : null,
        )}
      </Panel>
    );
  }, [section, content, sectionData]);

  if (!authed) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
        <h1 className="font-display text-3xl">Administrace</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Přihlaste se pro editaci textů na webu Dal Birbante.
        </p>
        <form onSubmit={login} className="mt-8 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Heslo</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-none"
              autoFocus
            />
          </div>
          {error && <p className="text-sm text-red-700">{error}</p>}
          <Button
            type="submit"
            className="rounded-full bg-[var(--forest)] text-white"
          >
            Přihlásit
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--paper-soft)]">
      <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-5">
          <div>
            <h1 className="text-3xl font-extrabold text-[var(--brand-green)] md:text-4xl">
              Administrace
            </h1>
            <p className="mt-1 text-lg text-[var(--muted)]">
              Upravte menu a texty — po uložení jsou hned na webu.
            </p>
          </div>
          <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
            <Button
              asChild
              variant="outline"
              className="h-12 rounded-full px-5 text-lg transition hover:border-[var(--brand-red)] hover:bg-[var(--brand-red)] hover:text-white"
            >
              <a href="/admin/objednavky">Fronta objednávek</a>
            </Button>
            <Button
              variant="outline"
              className="h-12 rounded-full px-5 text-lg transition hover:border-[var(--brand-red)] hover:bg-[var(--brand-red)] hover:text-white"
              onClick={logout}
            >
              Odhlásit
            </Button>
            <Button asChild variant="ghost" className="h-12 rounded-full px-5 text-lg">
              <a href="/" target="_blank" rel="noreferrer">
                Otevřít web
              </a>
            </Button>
            <Button
              onClick={save}
              disabled={saving}
              className="btn-green h-12 rounded-full px-6 text-lg font-extrabold"
            >
              {saving ? "Ukládám…" : "Uložit změny"}
            </Button>
          </div>
        </div>
        {(status || error) && (
          <div className="border-t border-[var(--line)] px-4 py-3.5 text-center text-lg font-semibold">
            {status && (
              <span className="text-[var(--brand-green)]">{status}</span>
            )}
            {error && <span className="text-[var(--brand-red)]">{error}</span>}
          </div>
        )}
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 md:grid-cols-[280px_1fr]">
        <aside className="flex flex-row gap-2 overflow-x-auto md:sticky md:top-28 md:flex-col md:self-start md:overflow-visible md:rounded-[8px] md:border md:border-[var(--line)] md:bg-white md:p-3 md:shadow-sm">
          <p className="mb-1 hidden px-3 pt-1 text-sm font-extrabold uppercase tracking-wide text-[var(--muted)] md:block">
            Sekce
          </p>
          {SECTIONS.map((s) => {
            const active = section === s.key;
            const isMenu = s.key === "menuCategories";
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => setSection(s.key)}
                className={`whitespace-nowrap rounded-[8px] px-4 py-3.5 text-left text-lg font-bold transition ${
                  active
                    ? "bg-[var(--brand-green)] text-white shadow-sm"
                    : isMenu
                      ? "bg-[var(--brand-green)]/10 text-[var(--brand-green-deep)] hover:bg-[var(--brand-green)]/15 md:bg-[var(--brand-green)]/10"
                      : "bg-white text-[var(--ink)] hover:bg-[#eef8f1] hover:text-[var(--brand-green)] md:bg-transparent"
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </aside>
        <div className="min-w-0">{editor}</div>
      </div>
    </div>
  );
}
