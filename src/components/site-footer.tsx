import Link from "next/link";
import Image from "next/image";
import type { SiteContent } from "@/lib/types";

export function SiteFooter({ content }: { content: SiteContent }) {
  const { site, nav, footer } = content;

  return (
    <footer className="relative overflow-hidden bg-[var(--ink)] text-[var(--paper)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,87,42,0.18),transparent_50%)]" />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[1.2fr_1fr_1fr] md:px-6">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <Image
              src="/images/logo.webp"
              alt=""
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
            />
            <span className="font-display text-2xl">{site.brandName}</span>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-white/70">
            {footer.blurb}
          </p>
        </div>
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-white/50">
            Navigace
          </p>
          <div className="flex flex-col gap-2 text-sm">
            <Link href="/" className="hover:text-white">
              {nav.home}
            </Link>
            <Link href="/menu" className="hover:text-white">
              {nav.menu}
            </Link>
            <Link href="/onas" className="hover:text-white">
              {nav.about}
            </Link>
            <Link href="/kontakt" className="hover:text-white">
              {nav.contact}
            </Link>
          </div>
        </div>
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-white/50">
            Kontakt
          </p>
          <div className="flex flex-col gap-2 text-sm text-white/80">
            <p>{site.address}</p>
            <a href={site.phoneHref} className="hover:text-white">
              {site.phone}
            </a>
            <a href={`mailto:${site.email}`} className="hover:text-white">
              {site.email}
            </a>
            <p>
              {site.hours}
              <br />
              {site.hoursClosed}
            </p>
          </div>
        </div>
      </div>
      <div className="relative border-t border-white/10 px-4 py-5 text-center text-xs text-white/45 md:px-6">
        {footer.rights}
      </div>
    </footer>
  );
}
