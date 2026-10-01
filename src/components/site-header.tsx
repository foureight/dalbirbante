"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { SiteContent } from "@/lib/types";

export function SiteHeader({ content }: { content: SiteContent }) {
  const [open, setOpen] = useState(false);
  const { site, nav } = content;

  const links = [
    { href: "/menu", label: nav.menu },
    { href: "/denni-nabidka", label: nav.daily },
    { href: "/rozvoz", label: nav.delivery },
    { href: "/onas", label: nav.about },
    { href: "/kontakt", label: nav.contact },
  ];

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-[var(--brand-green)] px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-white md:text-xs">
        {site.announcement}
      </div>
      <div className="border-b border-[var(--line)] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6 md:py-4">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo.webp"
              alt={site.brandName}
              width={320}
              height={40}
              className="h-8 w-auto object-contain md:h-10"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-5 text-sm font-semibold uppercase tracking-wide text-[var(--ink)] lg:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="transition hover:text-[var(--brand-red)]"
              >
                {l.label}
              </Link>
            ))}
            <a
              href={site.instagramUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="text-[var(--ink)] hover:text-[var(--brand-red)]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm11 1.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
              </svg>
            </a>
            <a
              href={site.facebookUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="text-[var(--ink)] hover:text-[var(--brand-red)]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.5 1.6-1.5H17V5.1C16.6 5 15.5 5 14.3 5c-2.5 0-4.2 1.5-4.2 4.3V11H7.5v3h2.6v8h3.4z" />
              </svg>
            </a>
            <Button asChild className="btn-green h-10 px-5 hover:bg-[#007a3a]">
              <a href={site.phoneHref}>{site.callLabel}</a>
            </Button>
          </nav>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center text-[var(--ink)] lg:hidden"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <div className="space-y-1.5">
              <span
                className={`block h-0.5 w-6 bg-[var(--ink)] transition ${open ? "translate-y-2 rotate-45" : ""}`}
              />
              <span
                className={`block h-0.5 w-6 bg-[var(--ink)] transition ${open ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-0.5 w-6 bg-[var(--ink)] transition ${open ? "-translate-y-2 -rotate-45" : ""}`}
              />
            </div>
          </button>
        </div>

        {open && (
          <div className="border-t border-[var(--line)] bg-white px-4 py-5 lg:hidden">
            <div className="flex flex-col gap-4 text-sm font-semibold uppercase tracking-wide text-[var(--ink)]">
              {links.map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
                  {l.label}
                </Link>
              ))}
              <a
                href={site.phoneHref}
                className="btn-green inline-flex w-fit px-4 py-2 text-xs"
              >
                {site.callLabel}
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
