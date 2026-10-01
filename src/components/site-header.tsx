"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AnnouncementBar } from "@/components/announcement-bar";
import { BrandLogo } from "@/components/brand-logo";
import type { SiteContent } from "@/lib/types";

export function SiteHeader({ content }: { content: SiteContent }) {
  const [open, setOpen] = useState(false);
  const { site, nav } = content;

  const links = [
    { href: "/menu", label: nav.menu },
    { href: "/denni-nabidka", label: nav.daily },
    { href: "/rozvoz", label: nav.delivery },
    { href: "/onas", label: nav.about },
  ];

  return (
    <header className="sticky top-0 z-50">
      <AnnouncementBar message={site.announcement} />
      <div className="border-b border-[var(--line)] bg-white">
        <div className="site-max mx-auto flex w-full items-center justify-between gap-6 px-5 py-5 md:px-10 md:py-6">
          <BrandLogo brandName={site.brandName} />

          <nav className="nav-menu hidden items-center gap-3 text-[var(--ink)] lg:flex xl:gap-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="transition hover:text-[var(--brand-red)]"
              >
                {l.label}
              </Link>
            ))}
            <div className="ml-1 flex items-center -space-x-4">
              <a
                href={site.instagramUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="inline-flex size-12 items-center justify-center text-[var(--ink)] transition hover:text-[var(--brand-red)]"
              >
                <Image
                  src="/icons/instagram.svg"
                  alt=""
                  width={48}
                  height={48}
                />
              </a>
              <a
                href={site.facebookUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="inline-flex size-12 items-center justify-center text-[var(--ink)] transition hover:text-[var(--brand-red)]"
              >
                <Image
                  src="/icons/facebook.svg"
                  alt=""
                  width={48}
                  height={48}
                />
              </a>
            </div>
            <a
              href={site.orderUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={site.orderLabel}
              title={site.orderLabel}
              className="nav-cart inline-flex size-12 items-center justify-center text-[var(--ink)] transition hover:text-[var(--brand-red)]"
            >
              <svg
                viewBox="0 0 24 24"
                className="size-8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <circle cx="9" cy="20" r="1.4" />
                <circle cx="17" cy="20" r="1.4" />
                <path d="M3 4h2l1.4 9.2a1.6 1.6 0 0 0 1.6 1.3h8.7a1.6 1.6 0 0 0 1.6-1.2L20 7H6.2" />
              </svg>
            </a>
            <Button asChild className="btn-green">
              <Link href="/kontakt">{nav.contact}</Link>
            </Button>
          </nav>

          <div className="flex items-center gap-1 lg:hidden">
            <a
              href={site.orderUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={site.orderLabel}
              title={site.orderLabel}
              className="nav-cart inline-flex size-10 items-center justify-center text-[var(--ink)] transition hover:text-[var(--brand-red)]"
            >
              <svg
                viewBox="0 0 24 24"
                className="size-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <circle cx="9" cy="20" r="1.4" />
                <circle cx="17" cy="20" r="1.4" />
                <path d="M3 4h2l1.4 9.2a1.6 1.6 0 0 0 1.6 1.3h8.7a1.6 1.6 0 0 0 1.6-1.2L20 7H6.2" />
              </svg>
            </a>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center text-[var(--ink)]"
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
        </div>

        {open && (
          <div className="border-t border-[var(--line)] bg-white px-4 py-5 lg:hidden">
            <div className="nav-menu flex flex-col gap-4 text-[var(--ink)]">
              {links.map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
                  {l.label}
                </Link>
              ))}
              <a
                href={site.orderUrl}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-[var(--brand-green)]"
                onClick={() => setOpen(false)}
              >
                {site.orderLabel}
              </a>
              <Link
                href="/kontakt"
                className="btn-green inline-flex w-fit"
                onClick={() => setOpen(false)}
              >
                {nav.contact}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
