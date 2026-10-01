"use client";

import { useState } from "react";
import type { FaqItem } from "@/lib/types";

export function FaqAccordion({
  items,
  titleClassName = "",
}: {
  items: FaqItem[];
  titleClassName?: string;
}) {
  // První otázka je vždy otevřená; najednou je otevřená jen jedna.
  const [openKey, setOpenKey] = useState(items[0]?.q ?? "");

  return (
    <div className="relative z-[1] mt-6 divide-y divide-[var(--line)] border-y border-[var(--line)]">
      {items.map((f) => {
        const isOpen = openKey === f.q;
        return (
          <details
            key={f.q}
            className="group"
            open={isOpen}
            onToggle={(e) => {
              // Sync native toggle with React state (one open at a time).
              if (e.currentTarget.open) {
                setOpenKey(f.q);
              } else if (openKey === f.q) {
                setOpenKey("");
              }
            }}
          >
            <summary className="flex w-full cursor-pointer list-none items-start justify-between gap-4 py-5 text-left transition hover:opacity-80 [&::-webkit-details-marker]:hidden marker:content-none">
              <h3 className={`min-w-0 flex-1 pr-2 ${titleClassName}`}>{f.q}</h3>
              <span
                aria-hidden
                className="mt-1 inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-[var(--line)] text-xl leading-none text-[var(--brand-red)] transition-transform duration-300 group-open:rotate-180"
              >
                <span className="group-open:hidden">+</span>
                <span className="hidden group-open:inline">−</span>
              </span>
            </summary>
            <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out group-open:grid-rows-[1fr]">
              <div className="min-h-0 overflow-hidden">
                <p className="pb-5 text-[var(--muted)]">{f.a}</p>
              </div>
            </div>
          </details>
        );
      })}
    </div>
  );
}
