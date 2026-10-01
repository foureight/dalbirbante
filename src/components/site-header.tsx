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
    { href: "/", label: nav.home },
    { href: "/menu", label: nav.menu },
    { href: "/onas", label: nav.about },
    { href: "/#galerie", label: nav.gallery },
    { href: "/kontakt", label: nav.contact },
  ];

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5 md:px-6">
        <Link href="/" className="flex items-center gap-3 text-white">
          <Image
            src="/images/logo.webp"
            alt={site.brandName}
            width={48}
            height={48}
            className="h-11 w-11 rounded-full object-cover ring-2 ring-white/30"
            priority
          />
          <span className="font-display text-xl tracking-wide md:text-2xl">
            {site.brandName}
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-white/90 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="transition hover:text-white"
            >
              {l.label}
            </Link>
          ))}
          <Button
            asChild
            className="rounded-none bg-[var(--accent)] px-5 text-white hover:bg-[var(--accent-hover)]"
          >
            <a href={site.orderUrl} target="_blank" rel="noreferrer">
              {site.orderLabel}
            </a>
          </Button>
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center text-white md:hidden"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <div className="space-y-1.5">
            <span className={`block h-0.5 w-6 bg-white transition ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-6 bg-white transition ${open ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-6 bg-white transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </div>
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-[var(--ink)]/95 px-4 py-6 backdrop-blur md:hidden">
          <div className="flex flex-col gap-4 text-base text-white">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <a
              href={site.orderUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-fit bg-[var(--accent)] px-4 py-2 text-sm font-medium"
            >
              {site.orderLabel}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
