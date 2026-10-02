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
  "rounded-[6.4px] border border-[var(--line)] bg-[#fbfbfb] text-lg text-[var(--ink)] transition focus-visible:border-[var(--brand-green)] focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/20";

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
    <div className="space-y-2">
      <Label className="text-base font-semibold text-[var(--ink)]">{label}</Label>
      {hint ? (
        <p className="text-sm leading-snug text-[var(--muted)]">{hint}</p>
      ) : null}
      {useTextarea ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={Math.min(10, Math.max(4, Math.ceil(value.length / 55)))}
          className={`min-h-[7rem] px-4 py-3 leading-relaxed ${FIELD_CONTROL}`}
        />
      ) : (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`h-12 px-4 ${FIELD_CONTROL}`}
        />
      )}
    </div>
  );
}

function Panel({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[6.4px] border border-[var(--line)] bg-white p-5 shadow-sm md:p-7">
      <h2 className="text-2xl font-extrabold text-[var(--brand-red)]">{title}</h2>
      {hint ? (
        <div className="mt-2 text-base leading-relaxed text-[var(--muted)]">
          {hint}
        </div>
      ) : null}
      <div className="mt-6 space-y-5">{children}</div>
    </section>
  );
}

function ItemCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-4 rounded-[6.4px] border border-[var(--line)] border-l-4 border-l-[var(--brand-red)] bg-white p-5 shadow-sm">
      <p className="text-lg font-extrabold text-[var(--brand-red)]">{title}</p>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

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
  { key: "menuCategories", label: "Položky menu" },
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
  const [section, setSection] = useState<keyof SiteContent>("daily");
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sectionData = content[section];

  function updateAt(path: string[], value: string) {
    setContent((prev) => setPath(prev, path, value) as SiteContent);
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
        <div className="space-y-6">
          {content.menuCategories.map((cat, ci) => (
            <Panel key={cat.id} title={`Kategorie · ${cat.name || ci + 1}`}>
              <Field
                label="Název kategorie"
                value={cat.name}
                onChange={(v) => updateAt(["menuCategories", String(ci), "name"], v)}
              />
              <Field
                label="ID kategorie"
                value={cat.id}
                onChange={(v) => updateAt(["menuCategories", String(ci), "id"], v)}
              />
              <div className="space-y-4">
                {cat.items.map((item, ii) => (
                  <ItemCard
                    key={`${cat.id}-${ii}`}
                    title={`Položka ${ii + 1}${item.name ? ` · ${item.name}` : ""}`}
                  >
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field
                        label="Název položky"
                        value={item.name}
                        onChange={(v) =>
                          updateAt(
                            ["menuCategories", String(ci), "items", String(ii), "name"],
                            v,
                          )
                        }
                      />
                      <Field
                        label="Cena"
                        value={item.price}
                        onChange={(v) =>
                          updateAt(
                            ["menuCategories", String(ci), "items", String(ii), "price"],
                            v,
                          )
                        }
                      />
                      <div className="md:col-span-2">
                        <Field
                          label="Popis"
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
                      <div className="md:col-span-2 space-y-3 rounded-[6.4px] border border-[var(--line)] bg-white p-3">
                        <div className="flex flex-wrap items-start gap-4">
                          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-[#f3f3f3]">
                            {item.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={item.image}
                                alt=""
                                className="h-full w-full object-contain p-1"
                              />
                            ) : (
                              <span className="grid h-full place-items-center text-xs text-[var(--muted)]">
                                bez fotky
                              </span>
                            )}
                          </div>
                          <div className="min-w-0 flex-1 space-y-3">
                            <Field
                              label="Fotka (cesta nebo URL)"
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
                              hint="Např. /images/menu/lemonsoda.webp — po nahrání se vyplní samo."
                            />
                            <div className="flex flex-wrap items-center gap-2">
                              <label className="inline-flex cursor-pointer items-center rounded-full border border-[var(--line)] bg-[var(--paper-soft)] px-4 py-2 text-sm font-medium transition hover:border-[var(--brand-green)]">
                                Nahrát fotku
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
                                    const res = await fetch("/api/admin/upload", {
                                      method: "POST",
                                      body,
                                    });
                                    const data = (await res.json().catch(() => ({}))) as {
                                      path?: string;
                                      error?: string;
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
                                      "Fotka nahrána — uložte změny, aby se projevila v menu.",
                                    );
                                  }}
                                />
                              </label>
                              {item.image ? (
                                <button
                                  type="button"
                                  className="rounded-full border border-[var(--line)] px-4 py-2 text-sm text-[var(--muted)] transition hover:border-[var(--brand-red)] hover:text-[var(--brand-red)]"
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
              </div>
            </Panel>
          ))}
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
      return (
        <div className="space-y-6">
          <Panel title="Úvodní stránka — texty">
            {Object.entries(h).map(([key, value]) =>
              typeof value === "string" ? (
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

          <Panel title="Položky denního menu">
            {d.items.map((item, i) => (
              <ItemCard
                key={i}
                title={`Jídlo ${i + 1}${item.name ? ` · ${item.name}` : ""}`}
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
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[var(--brand-green)]">
              Administrace textů
            </h1>
            <p className="mt-1 text-base text-[var(--muted)]">
              Upravte texty a uložte — změny se projeví okamžitě.
            </p>
          </div>
          <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
            <Button
              asChild
              variant="outline"
              className="rounded-full text-base transition hover:border-[var(--brand-red)] hover:bg-[var(--brand-red)] hover:text-white"
            >
              <a href="/admin/objednavky">Fronta objednávek</a>
            </Button>
            <Button
              variant="outline"
              className="rounded-full text-base transition hover:border-[var(--brand-red)] hover:bg-[var(--brand-red)] hover:text-white"
              onClick={logout}
            >
              Odhlásit
            </Button>
            <Button asChild variant="ghost" className="rounded-full text-base">
              <a href="/" target="_blank" rel="noreferrer">
                Otevřít web
              </a>
            </Button>
            <Button
              onClick={save}
              disabled={saving}
              className="btn-green rounded-full text-base"
            >
              {saving ? "Ukládám…" : "Uložit změny"}
            </Button>
          </div>
        </div>
        {(status || error) && (
          <div className="border-t border-[var(--line)] px-4 py-3 text-center text-base font-semibold">
            {status && (
              <span className="text-[var(--brand-green)]">{status}</span>
            )}
            {error && <span className="text-[var(--brand-red)]">{error}</span>}
          </div>
        )}
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 md:grid-cols-[240px_1fr]">
        <aside className="flex flex-row gap-2 overflow-x-auto md:flex-col md:overflow-visible md:rounded-[6.4px] md:border md:border-[var(--line)] md:bg-white md:p-2 md:shadow-sm">
          {SECTIONS.map((s) => {
            const active = section === s.key;
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => setSection(s.key)}
                className={`whitespace-nowrap rounded-[6.4px] px-4 py-3 text-left text-base font-semibold transition ${
                  active
                    ? "bg-[var(--brand-green)] text-white shadow-sm"
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
