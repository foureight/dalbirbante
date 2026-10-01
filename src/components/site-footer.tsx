import Link from "next/link";
import Image from "next/image";
import type { SiteContent } from "@/lib/types";

export function SiteFooter({ content }: { content: SiteContent }) {
  const { site, nav, footer } = content;

  return (
    <footer className="bg-[var(--brand-green)] text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[1.2fr_1fr_1fr] md:px-6">
        <div>
          <div className="mb-4">
            <Image
              src="/images/logo-white.webp"
              alt={site.brandName}
              width={280}
              height={35}
              className="h-9 w-auto object-contain"
            />
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-white/85">
            {footer.blurb}
          </p>
          <p className="mt-4 font-display text-2xl uppercase tracking-wide">
            {site.goodbye}
          </p>
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
            Navigace
          </p>
          <div className="flex flex-col gap-2 text-sm uppercase tracking-wide">
            <Link href="/menu" className="hover:text-white/80">
              {nav.menu}
            </Link>
            <Link href="/denni-nabidka" className="hover:text-white/80">
              {nav.daily}
            </Link>
            <Link href="/rozvoz" className="hover:text-white/80">
              {nav.delivery}
            </Link>
            <Link href="/onas" className="hover:text-white/80">
              {nav.about}
            </Link>
            <Link href="/kontakt" className="hover:text-white/80">
              {nav.contact}
            </Link>
            <Link href="/bezlepkova-pizza-vinor" className="hover:text-white/80">
              {nav.glutenFree}
            </Link>
          </div>
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
            Kontakt
          </p>
          <div className="flex flex-col gap-2 text-sm text-white/90">
            <p>{site.address}</p>
            <a href={site.phoneHref} className="hover:underline">
              {site.phone}
            </a>
            <a href={`mailto:${site.email}`} className="hover:underline">
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
      <div className="border-t border-white/20 bg-[var(--brand-green-deep)] px-4 py-5 text-center text-xs uppercase tracking-wide text-white/70 md:px-6">
        {footer.rights}
      </div>
    </footer>
  );
}
