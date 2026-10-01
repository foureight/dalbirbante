import Link from "next/link";
import type { SiteContent } from "@/lib/types";
import { FooterGoodbye } from "@/components/footer-goodbye";

function FacebookIcon() {
  return (
    <svg viewBox="0 0 64 64" className="size-5 fill-current" aria-hidden>
      <path d="M34.1,47V33.3h4.6l0.7-5.3h-5.3v-3.4c0-1.5,0.4-2.6,2.6-2.6l2.8,0v-4.8c-0.5-0.1-2.2-0.2-4.1-0.2 c-4.1,0-6.9,2.5-6.9,7V28H24v5.3h4.6V47H34.1z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 64 64" className="size-5 fill-current" aria-hidden>
      <path d="M46.91,25.816c-0.073-1.597-0.326-2.687-0.697-3.641c-0.383-0.986-0.896-1.823-1.73-2.657c-0.834-0.834-1.67-1.347-2.657-1.73c-0.954-0.371-2.045-0.624-3.641-0.697C36.585,17.017,36.074,17,32,17s-4.585,0.017-6.184,0.09c-1.597,0.073-2.687,0.326-3.641,0.697c-0.986,0.383-1.823,0.896-2.657,1.73c-0.834,0.834-1.347,1.67-1.73,2.657c-0.371,0.954-0.624,2.045-0.697,3.641C17.017,27.415,17,27.926,17,32c0,4.074,0.017,4.585,0.09,6.184c0.073,1.597,0.326,2.687,0.697,3.641c0.383,0.986,0.896,1.823,1.73,2.657c0.834,0.834,1.67,1.347,2.657,1.73c0.954,0.371,2.045,0.624,3.641,0.697C27.415,46.983,27.926,47,32,47s4.585-0.017,6.184-0.09c1.597-0.073,2.687-0.326,3.641-0.697c0.986-0.383,1.823-0.896,2.657-1.73c0.834-0.834,1.347-1.67,1.73-2.657c0.371-0.954,0.624-2.045,0.697-3.641C46.983,36.585,47,36.074,47,32S46.983,27.415,46.91,25.816z M44.21,38.061c-0.067,1.462-0.311,2.257-0.516,2.785c-0.272,0.7-0.597,1.2-1.122,1.725c-0.525,0.525-1.025,0.85-1.725,1.122c-0.529,0.205-1.323,0.45-2.785,0.516c-1.581,0.072-2.056,0.087-6.061,0.087s-4.48-0.015-6.061-0.087c-1.462-0.067-2.257-0.311-2.785-0.516c-0.7-0.272-1.2-0.597-1.725-1.122c-0.525-0.525-0.85-1.025-1.122-1.725c-0.205-0.529-0.45-1.323-0.516-2.785c-0.072-1.582-0.087-2.056-0.087-6.061s0.015-4.48,0.087-6.061c0.067-1.462,0.311-2.257,0.516-2.785c0.272-0.7,0.597-1.2,1.122-1.725c0.525-0.525,1.025-0.85,1.725-1.122c0.529-0.205,1.323-0.45,2.785-0.516c1.582-0.072,2.056-0.087,6.061-0.087s4.48,0.015,6.061,0.087c1.462,0.067,2.257,0.311,2.785,0.516c0.7,0.272,1.2,0.597,1.725,1.122c0.525,0.525,0.85,1.025,1.122,1.725c0.205,0.529,0.45,1.323,0.516,2.785c0.072,1.582,0.087,2.056,0.087,6.061S44.282,36.48,44.21,38.061z M32,24.297c-4.254,0-7.703,3.449-7.703,7.703c0,4.254,3.449,7.703,7.703,7.703c4.254,0,7.703-3.449,7.703-7.703C39.703,27.746,36.254,24.297,32,24.297z M32,37c-2.761,0-5-2.239-5-5c0-2.761,2.239-5,5-5s5,2.239,5,5C37,34.761,34.761,37,32,37z M40.007,22.193c-0.994,0-1.8,0.806-1.8,1.8c0,0.994,0.806,1.8,1.8,1.8c0.994,0,1.8-0.806,1.8-1.8C41.807,22.999,41.001,22.193,40.007,22.193z" />
    </svg>
  );
}

export function SiteFooter({ content }: { content: SiteContent }) {
  const { site, nav, contact } = content;

  const sitemap = [
    { href: "/menu", label: nav.menu },
    { href: "/denni-nabidka", label: nav.daily },
    { href: "/rozvoz", label: nav.delivery },
    { href: "/onas", label: nav.about },
    { href: "/kontakt", label: nav.contact },
  ];

  return (
    <footer className="bg-[var(--brand-green)] text-white">
      <div className="mx-auto max-w-5xl px-4 pb-14 pt-12 md:px-6 md:pb-16 md:pt-14">
        <FooterGoodbye
          czech={site.goodbye}
          italian={site.goodbyeIt || "BUON APPETITO!"}
        />

        <div className="grid gap-10 text-center md:grid-cols-3 md:items-start md:gap-8">
          <div>
            <h3 className="mb-4 font-display text-2xl font-black uppercase tracking-wide text-black md:text-[1.7rem]">
              Sitemap
            </h3>
            <nav className="flex flex-col items-center gap-1.5 text-base text-white md:text-lg">
              {sitemap.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="underline decoration-white/90 underline-offset-4 transition hover:opacity-80"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="mb-4 font-display text-2xl font-black uppercase tracking-wide text-black md:text-[1.7rem]">
              {contact.whereTitle}
            </h3>
            <div className="flex flex-col items-center gap-1.5 text-base leading-relaxed text-white md:text-lg">
              <p>{site.addressShort}</p>
              <p>
                volejte{" "}
                <a
                  href={site.phoneHref}
                  className="underline decoration-white/90 underline-offset-4 transition hover:opacity-80"
                >
                  {site.phone}
                </a>
              </p>
              <a
                href={`mailto:${site.email}`}
                className="underline decoration-white/90 underline-offset-4 transition hover:opacity-80"
              >
                {site.email}
              </a>
              <div className="mt-4 flex items-center justify-center gap-3">
                <a
                  href={site.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="inline-flex size-11 items-center justify-center rounded-full bg-white text-[var(--brand-green)] transition hover:opacity-90"
                >
                  <FacebookIcon />
                </a>
                <a
                  href={site.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="inline-flex size-11 items-center justify-center rounded-full bg-white text-[var(--brand-green)] transition hover:opacity-90"
                >
                  <InstagramIcon />
                </a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-display text-2xl font-black uppercase tracking-wide text-black md:text-[1.7rem]">
              {contact.hoursTitle}
            </h3>
            <div className="flex flex-col items-center gap-1.5 text-base leading-relaxed text-white md:text-lg">
              <p>{site.hours}</p>
              <p>{site.hoursClosed}</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
