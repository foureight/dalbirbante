"use client";

import { useEffect, useState } from "react";

type Cat = { id: string; name: string };

export function MenuCategoryNav({ categories }: { categories: Cat[] }) {
  const [active, setActive] = useState(categories[0]?.id ?? "");

  useEffect(() => {
    const sections = categories
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) setActive(visible[0].target.id);
      },
      {
        rootMargin: "-30% 0px -55% 0px",
        threshold: [0, 0.25, 0.5, 1],
      },
    );

    for (const el of sections) observer.observe(el);
    return () => observer.disconnect();
  }, [categories]);

  return (
    <nav
      className="menu-cat-nav sticky z-40 border-b border-[var(--line)] bg-[var(--paper)]/95 backdrop-blur-md"
      aria-label="Kategorie menu"
    >
      <div className="page-wrap flex gap-2 overflow-x-auto py-3 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((cat) => {
          const isActive = active === cat.id;
          return (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold tracking-wide transition touch-manipulation sm:text-base ${
                isActive
                  ? "bg-[var(--brand-green)] text-white"
                  : "bg-[var(--paper-soft)] text-[var(--ink)] hover:bg-[var(--brand-green)]/12"
              }`}
              onClick={() => setActive(cat.id)}
            >
              {cat.name}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
