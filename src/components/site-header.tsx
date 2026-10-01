"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AnnouncementBar } from "@/components/announcement-bar";
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
      <AnnouncementBar message={site.announcement} />
      <div className="border-b border-[var(--line)] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-5 md:px-10 md:py-6">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo.webp"
              alt={site.brandName}
              width={320}
              height={40}
              className="h-9 w-auto object-contain md:h-11"
              priority
            />
          </Link>

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
            <div className="ml-1 flex items-center gap-0">
              <a
                href={site.instagramUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="inline-flex size-10 items-center justify-center text-[var(--ink)] transition hover:text-[var(--brand-red)]"
              >
                <Image
                  src="/icons/instagram.svg"
                  alt=""
                  width={36}
                  height={36}
                />
              </a>
              <a
                href={site.facebookUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="inline-flex size-10 items-center justify-center text-[var(--ink)] transition hover:text-[var(--brand-red)]"
              >
                <Image
                  src="/icons/facebook.svg"
                  alt=""
                  width={36}
                  height={36}
                />
              </a>
            </div>
            <Button asChild className="btn-green !py-3 !px-5 !text-base">
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
            <div className="nav-menu flex flex-col gap-4 text-[var(--ink)]">
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
