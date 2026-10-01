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
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-[var(--muted)]">{label}</Label>
      {multiline || value.length > 80 ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={Math.min(8, Math.max(3, Math.ceil(value.length / 70)))}
          className="rounded-none bg-white"
        />
      ) : (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="rounded-none bg-white"
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
  const [section, setSection] = useState<keyof SiteContent>("site");
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
            <p className="text-sm font-medium">Nabídka (položky seznamu)</p>
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
            <p className="text-sm font-medium">Výhody / features</p>
            {h.features.map((item, i) => (
              <Field
                key={i}
                label={`Feature ${i + 1}`}
                value={item}
                onChange={(v) => updateAt(["home", "features", String(i)], v)}
              />
            ))}
          </div>
        </div>
      );
    }

    if (section === "daily") {
      return (
        <div className="space-y-4">
          {Object.entries(content.daily).map(([key, value]) => (
            <Field
              key={key}
              label={key}
              value={value}
              onChange={(v) => updateAt(["daily", key], v)}
              multiline={value.length > 60}
            />
          ))}
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
            <p className="text-sm font-medium">Jak připravujeme</p>
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
        <div className="space-y-4">
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
    <div className="min-h-screen bg-[var(--paper)]">
      <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-[var(--paper)]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div>
            <h1 className="font-display text-2xl">Administrace textů</h1>
            <p className="text-xs text-[var(--muted)]">
              Upravte texty a uložte — změny se projeví okamžitě.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={save}
              disabled={saving}
              className="rounded-full bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]"
            >
              {saving ? "Ukládám…" : "Uložit změny"}
            </Button>
            <Button variant="outline" className="rounded-full" onClick={logout}>
              Odhlásit
            </Button>
            <Button asChild variant="ghost" className="rounded-full">
              <a href="/" target="_blank" rel="noreferrer">
                Otevřít web
              </a>
            </Button>
          </div>
        </div>
        {(status || error) && (
          <div className="border-t border-[var(--line)] px-4 py-2 text-center text-sm">
            {status && <span className="text-[var(--forest)]">{status}</span>}
            {error && <span className="text-red-700">{error}</span>}
          </div>
        )}
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 md:grid-cols-[220px_1fr]">
        <aside className="flex flex-row gap-2 overflow-x-auto md:flex-col md:overflow-visible">
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setSection(s.key)}
              className={`whitespace-nowrap px-3 py-2 text-left text-sm transition ${
                section === s.key
                  ? "bg-[var(--forest)] text-white"
                  : "bg-white/70 text-[var(--ink)] hover:bg-white"
              }`}
            >
              {s.label}
            </button>
          ))}
        </aside>
        <div className="min-w-0">{editor}</div>
      </div>
    </div>
  );
}
