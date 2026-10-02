"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AnnouncementBar } from "@/components/announcement-bar";
import { BrandLogo } from "@/components/brand-logo";
import { useCart } from "@/components/cart-provider";
import type { SiteContent } from "@/lib/types";

function CartIcon({ className = "size-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
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
  );
}

export function SiteHeader({ content }: { content: SiteContent }) {
  const [open, setOpen] = useState(false);
  const { count, setOpen: setCartOpen } = useCart();
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
        <div className="site-max mx-auto flex w-full items-center justify-between gap-2 px-4 py-3 sm:gap-4 sm:px-5 sm:py-4 md:gap-6 md:px-10 md:py-6">
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
                  alt="Instagram Dal Birbante"
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
                  alt="Facebook Dal Birbante"
                  width={48}
                  height={48}
                />
              </a>
            </div>
            <button
              type="button"
              aria-label={site.orderLabel}
              title={site.orderLabel}
              onClick={() => setCartOpen(true)}
              className="nav-cart relative inline-flex size-12 items-center justify-center text-[var(--ink)] transition hover:text-[var(--brand-green)]"
            >
              <CartIcon className="size-8" />
              {count > 0 ? (
                <span className="absolute right-0.5 top-0.5 inline-flex min-w-5 items-center justify-center rounded-full bg-[var(--brand-red)] px-1 text-[11px] font-bold leading-5 text-white">
                  {count}
                </span>
              ) : null}
            </button>
            <Button asChild className="btn-green">
              <Link href="/kontakt">{nav.contact}</Link>
            </Button>
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 lg:hidden">
            <button
              type="button"
              aria-label={site.orderLabel}
              title={site.orderLabel}
              onClick={() => setCartOpen(true)}
              className="nav-cart relative inline-flex size-10 items-center justify-center text-[var(--ink)] transition hover:text-[var(--brand-green)]"
            >
              <CartIcon className="size-7" />
              {count > 0 ? (
                <span className="absolute right-0 top-0 inline-flex min-w-5 items-center justify-center rounded-full bg-[var(--brand-red)] px-1 text-[11px] font-bold leading-5 text-white">
                  {count}
                </span>
              ) : null}
            </button>
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center text-[var(--ink)]"
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
            <div className="nav-menu flex flex-col gap-1 text-[var(--ink)]">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-[6.4px] px-2 py-3 transition hover:bg-[var(--paper-soft)]"
                >
                  {l.label}
                </Link>
              ))}
              <button
                type="button"
                className="rounded-[6.4px] px-2 py-3 text-left font-semibold text-[var(--brand-green)]"
                onClick={() => {
                  setOpen(false);
                  setCartOpen(true);
                }}
              >
                {site.orderLabel}
                {count > 0 ? ` (${count})` : ""}
              </button>
              <Link
                href="/kontakt"
                className="btn-green mt-2 inline-flex w-full justify-center"
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
