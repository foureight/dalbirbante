"use client";

import { useMemo, useState } from "react";
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

function Field({
  label,
  value,
  onChange,
  multiline,
  hint,
  emphasize,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  hint?: string;
  emphasize?: boolean;
}) {
  const useTextarea = multiline || value.length > 80;
  return (
    <div
      className={
        emphasize
          ? "space-y-2 rounded-[6.4px] border-2 border-[var(--brand-green)] bg-[#eef8f1] p-4"
          : "space-y-2"
      }
    >
      <Label
        className={
          emphasize
            ? "text-base font-bold text-[var(--brand-green)]"
            : "text-base font-semibold text-[var(--ink)]"
        }
      >
        {label}
      </Label>
      {hint ? (
        <p className="text-sm leading-snug text-[var(--muted)]">{hint}</p>
      ) : null}
      {useTextarea ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={Math.min(10, Math.max(4, Math.ceil(value.length / 55)))}
          className="min-h-[7rem] rounded-[6.4px] border-[var(--line)] bg-white px-4 py-3 text-lg leading-relaxed text-[var(--ink)]"
        />
      ) : (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 rounded-[6.4px] border-[var(--line)] bg-white px-4 text-lg text-[var(--ink)]"
        />
      )}
    </div>
  );
}

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
        <div className="space-y-10">
          {content.menuCategories.map((cat, ci) => (
            <div key={cat.id} className="space-y-4 border border-[var(--line)] bg-white/60 p-4">
              <Field
                label={`Kategorie ${ci + 1} – název`}
                value={cat.name}
                onChange={(v) => updateAt(["menuCategories", String(ci), "name"], v)}
              />
              <Field
                label="ID kategorie"
                value={cat.id}
                onChange={(v) => updateAt(["menuCategories", String(ci), "id"], v)}
              />
              <div className="space-y-6">
                {cat.items.map((item, ii) => (
                  <div
                    key={`${cat.id}-${ii}`}
                    className="grid gap-3 border-t border-[var(--line)] pt-4 md:grid-cols-2"
                  >
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
                    {"image" in item && item.image !== undefined ? (
                      <div className="md:col-span-2">
                        <Field
                          label="Cesta k obrázku"
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
                        />
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (section === "delivery") {
      return (
        <div className="space-y-6">
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
          {content.delivery.zones.map((z, i) => (
            <div
              key={i}
              className="grid gap-3 border border-[var(--line)] bg-white/60 p-4 md:grid-cols-2"
            >
              <Field
                label="Zóna"
                value={z.name}
                onChange={(v) => updateAt(["delivery", "zones", String(i), "name"], v)}
              />
              <Field
                label="Poplatek"
                value={z.fee}
                onChange={(v) => updateAt(["delivery", "zones", String(i), "fee"], v)}
              />
              <Field
                label="Oblasti"
                value={z.areas}
                onChange={(v) => updateAt(["delivery", "zones", String(i), "areas"], v)}
                multiline
              />
              <Field
                label="Min. objednávka"
                value={z.min}
                onChange={(v) => updateAt(["delivery", "zones", String(i), "min"], v)}
              />
            </div>
          ))}
        </div>
      );
    }

    if (section === "home") {
      const h = content.home;
      return (
        <div className="space-y-4">
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
          <div className="space-y-3 border border-[var(--line)] bg-white/60 p-4">
            <p className="text-base font-extrabold text-[var(--brand-red)]">
              Nabídka (položky seznamu)
            </p>
            {h.offerItems.map((item, i) => (
              <Field
                key={i}
                label={`Položka ${i + 1}`}
                value={item}
                onChange={(v) => updateAt(["home", "offerItems", String(i)], v)}
              />
            ))}
          </div>
          <div className="space-y-3 border border-[var(--line)] bg-white/60 p-4">
            <p className="text-base font-extrabold text-[var(--brand-red)]">
              Výhody / features
            </p>
            {h.features.map((item, i) => (
              <div key={i} className="space-y-2 border-t border-[var(--line)] pt-3">
                <Field
                  label={`Název ${i + 1}`}
                  value={item.title}
                  onChange={(v) =>
                    updateAt(["home", "features", String(i), "title"], v)
                  }
                />
                <Field
                  label={`Text ${i + 1}`}
                  value={item.text}
                  onChange={(v) =>
                    updateAt(["home", "features", String(i), "text"], v)
                  }
                />
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (section === "daily") {
      const d = content.daily;
      return (
        <div className="space-y-8">
          <div className="rounded-[6.4px] border border-[var(--brand-green)]/30 bg-white p-5 shadow-sm md:p-7">
            <h2 className="text-2xl font-extrabold text-[var(--brand-red)]">
              Denní nabídka — texty stránky
            </h2>
            <p className="mt-2 text-base text-[var(--muted)]">
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
            </p>
            <div className="mt-6 space-y-5">
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
                emphasize
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
                  emphasize
                  hint="Zobrazí se vedle nadpisu (např. 1. 10. 2026)."
                />
                <Field
                  label="Čas podávání"
                  value={d.hours}
                  onChange={(v) => updateAt(["daily", "hours"], v)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <h2 className="text-2xl font-extrabold text-[var(--brand-red)]">
              Položky denního menu
            </h2>
            {d.items.map((item, i) => (
              <div
                key={i}
                className="space-y-4 rounded-[6.4px] border border-[var(--line)] border-l-4 border-l-[var(--brand-red)] bg-white p-5 shadow-sm"
              >
                <p className="text-lg font-extrabold text-[var(--brand-red)]">
                  Jídlo {i + 1}
                  {item.name ? ` · ${item.name}` : ""}
                </p>
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
              </div>
            ))}
          </div>

          <div className="rounded-[6.4px] border border-[var(--line)] bg-[var(--paper-soft)] p-5">
            <h2 className="text-xl font-extrabold text-[var(--brand-red)]">
              Text na úvodní stránce
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Krátký text u dlaždice „Denní menu přes poledne“ v zeleném pruhu.
            </p>
            <div className="mt-4">
              <Field
                label="Text dlaždice (home)"
                value={content.home.dailyMenuText}
                onChange={(v) => updateAt(["home", "dailyMenuText"], v)}
                multiline
                emphasize
                hint="Měl by být jiný než intro na stránce denní nabídky."
              />
            </div>
          </div>
        </div>
      );
    }

    if (section === "glutenFree") {
      return (
        <div className="space-y-4">
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
          <div className="space-y-3 border border-[var(--line)] bg-white/60 p-4">
            <p className="text-base font-extrabold text-[var(--brand-red)]">
              Jak připravujeme
            </p>
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
          </div>
          {content.glutenFree.faqs.map((f, i) => (
            <div
              key={i}
              className="space-y-3 border border-[var(--line)] bg-white/60 p-4"
            >
              <Field
                label={`FAQ ${i + 1} – otázka`}
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
            </div>
          ))}
        </div>
      );
    }

    if (section === "about") {
      return (
        <div className="space-y-6">
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
              onChange={(v) => updateAt(["about", "paragraphs", String(i)], v)}
              multiline
            />
          ))}
          <div className="space-y-4 rounded-[6.4px] border border-[var(--line)] bg-white p-5">
            <p className="text-base font-extrabold text-[var(--brand-red)]">
              FAQ
            </p>
            <Field
              label="Nadpis FAQ"
              value={content.about.faqTitle}
              onChange={(v) => updateAt(["about", "faqTitle"], v)}
            />
            {content.about.faqs.map((f, i) => (
              <div
                key={i}
                className="space-y-3 border-t border-[var(--line)] pt-4"
              >
                <Field
                  label={`Otázka ${i + 1}`}
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
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (section === "menuPage") {
      const m = content.menuPage;
      return (
        <div className="space-y-6">
          {(
            [
              ["title", "Titulek"],
              ["intro", "Úvod"],
              ["extrasTitle", "Nadpis přídavků"],
              ["extrasText", "Text přídavků"],
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
          <div className="space-y-4 rounded-[6.4px] border border-[var(--line)] bg-white p-5">
            <p className="text-base font-extrabold text-[var(--brand-red)]">
              FAQ
            </p>
            <Field
              label="Nadpis FAQ"
              value={m.faqTitle}
              onChange={(v) => updateAt(["menuPage", "faqTitle"], v)}
            />
            {m.faqs.map((f, i) => (
              <div
                key={i}
                className="space-y-3 border-t border-[var(--line)] pt-4"
              >
                <Field
                  label={`Otázka ${i + 1}`}
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
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Generic object of strings
    const data = sectionData as Record<string, string>;
    return (
      <div className="space-y-4">
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
      </div>
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
        <aside className="flex flex-row gap-2 overflow-x-auto md:flex-col md:overflow-visible">
          {SECTIONS.map((s) => {
            const active = section === s.key;
            const isDaily = s.key === "daily";
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => setSection(s.key)}
                className={`whitespace-nowrap rounded-[6.4px] px-4 py-3 text-left text-base font-semibold transition ${
                  active
                    ? "bg-[var(--brand-green)] text-white shadow-sm"
                    : isDaily
                      ? "border border-[var(--brand-green)] bg-[#eef8f1] text-[var(--brand-green)] hover:bg-[#dff3e6]"
                      : "bg-white text-[var(--ink)] hover:bg-white"
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
