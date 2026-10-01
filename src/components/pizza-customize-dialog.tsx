"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useCart } from "@/components/cart-provider";
import {
  GLUTEN_FREE_PIZZA_SURCHARGE,
  PIZZA_EXTRAS,
  type PizzaExtra,
} from "@/lib/pizza-options";
import { formatPrice } from "@/lib/money";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onClose: () => void;
  name: string;
  basePrice: number;
  image?: string;
};

export function PizzaCustomizeDialog({
  open,
  onClose,
  name,
  basePrice,
  image,
}: Props) {
  const { addItem } = useCart();
  const [dough, setDough] = useState<"classic" | "glutenFree">("classic");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);
  const [canDismiss, setCanDismiss] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      setCanDismiss(false);
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const id = window.setTimeout(() => setCanDismiss(true), 120);
    return () => {
      document.body.style.overflow = prev;
      window.clearTimeout(id);
    };
  }, [open]);

  const extras = useMemo(
    () => PIZZA_EXTRAS.filter((e) => selected[e.id]),
    [selected],
  );

  const extrasTotal = extras.reduce((s, e) => s + e.price, 0);
  const doughExtra = dough === "glutenFree" ? GLUTEN_FREE_PIZZA_SURCHARGE : 0;
  const unitPrice = basePrice + doughExtra + extrasTotal;

  function toggle(extra: PizzaExtra) {
    setSelected((prev) => ({ ...prev, [extra.id]: !prev[extra.id] }));
  }

  function reset() {
    setDough("classic");
    setSelected({});
  }

  function handleClose() {
    if (!canDismiss) return;
    reset();
    onClose();
  }

  function continueToCart() {
    const parts: string[] = [];
    if (dough === "glutenFree") parts.push("bezlepková");
    if (extras.length) parts.push(extras.map((e) => e.name).join(", "));
    const label = parts.length ? `${name} (${parts.join(" · ")})` : name;

    addItem({
      name: label,
      unitPrice,
      image,
      detail: {
        baseName: name,
        glutenFree: dough === "glutenFree",
        extras: extras.map((e) => e.name),
      },
    });
    reset();
    onClose();
  }

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center md:items-center md:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Upravit pizzu ${name}`}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Zavřít"
        onClick={handleClose}
      />
      <div
        className="relative z-10 flex max-h-[92svh] w-full max-w-xl flex-col overflow-hidden rounded-t-[12px] bg-white shadow-2xl md:rounded-[10px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[var(--line)] px-5 py-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[var(--brand-green)]">
              Upravit pizzu
            </p>
            <h2 className="mt-1 text-2xl font-extrabold text-[var(--ink)]">
              {name}
            </h2>
          </div>
          <button
            type="button"
            className="text-sm font-semibold uppercase text-[var(--muted)]"
            onClick={handleClose}
          >
            Zavřít
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-8 overflow-y-auto px-5 py-6">
          <section>
            <h3 className="mb-3 text-lg font-extrabold text-[var(--brand-green)]">
              1. Těsto
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <label
                className={`flex cursor-pointer flex-col gap-1 border px-4 py-4 transition ${
                  dough === "classic"
                    ? "border-[var(--brand-green)] bg-[var(--paper-soft)]"
                    : "border-[var(--line)]"
                }`}
              >
                <span className="flex items-center gap-2 font-semibold">
                  <input
                    type="radio"
                    name={`dough-${name}`}
                    checked={dough === "classic"}
                    onChange={() => setDough("classic")}
                  />
                  Klasická
                </span>
                <span className="pl-6 text-sm text-[var(--muted)]">
                  Neapolské těsto
                </span>
              </label>
              <label
                className={`flex cursor-pointer flex-col gap-1 border px-4 py-4 transition ${
                  dough === "glutenFree"
                    ? "border-[var(--brand-green)] bg-[var(--paper-soft)]"
                    : "border-[var(--line)]"
                }`}
              >
                <span className="flex items-center gap-2 font-semibold">
                  <input
                    type="radio"
                    name={`dough-${name}`}
                    checked={dough === "glutenFree"}
                    onChange={() => setDough("glutenFree")}
                  />
                  Bezlepková
                </span>
                <span className="pl-6 text-sm text-[var(--brand-red)]">
                  +{formatPrice(GLUTEN_FREE_PIZZA_SURCHARGE)}
                </span>
              </label>
            </div>
          </section>

          <section>
            <h3 className="mb-1 text-lg font-extrabold text-[var(--brand-green)]">
              2. Přísady navíc
            </h3>
            <p className="mb-4 text-sm text-[var(--muted)]">
              Zaškrtněte, co chcete přidat. Pak pokračujte do košíku.
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {PIZZA_EXTRAS.map((extra) => (
                <label
                  key={extra.id}
                  className={`flex cursor-pointer items-center justify-between gap-3 border px-3 py-2.5 text-sm transition ${
                    selected[extra.id]
                      ? "border-[var(--brand-green)] bg-[var(--paper-soft)]"
                      : "border-[var(--line)]"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={Boolean(selected[extra.id])}
                      onChange={() => toggle(extra)}
                    />
                    <span>{extra.name}</span>
                  </span>
                  <span className="shrink-0 font-semibold text-[var(--brand-red)]">
                    +{formatPrice(extra.price)}
                  </span>
                </label>
              ))}
            </div>
          </section>
        </div>

        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] bg-white px-5 py-4">
          <div>
            <p className="text-sm text-[var(--muted)]">Cena celkem</p>
            <p className="text-2xl font-black text-[var(--brand-red)]">
              {formatPrice(unitPrice)}
            </p>
          </div>
          <Button type="button" className="btn-green" onClick={continueToCart}>
            Pokračovat do košíku
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
