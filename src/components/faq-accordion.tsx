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
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mt-6 divide-y divide-[var(--line)] border-y border-[var(--line)]">
      {items.map((f, i) => {
        const open = openIndex === i;
        return (
          <div key={f.q}>
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : i)}
              aria-expanded={open}
              className="flex w-full items-start justify-between gap-4 py-5 text-left transition hover:opacity-80"
            >
              <h3 className={`pr-2 ${titleClassName}`}>{f.q}</h3>
              <span
                aria-hidden
                className="mt-1 inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-[var(--line)] text-xl leading-none text-[var(--brand-red)]"
              >
                {open ? "−" : "+"}
              </span>
            </button>
            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p className="pb-5 text-[var(--muted)]">{f.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
