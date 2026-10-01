import Image from "next/image";
import Link from "next/link";
import { getContent } from "@/lib/content";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ContactForm } from "@/components/contact-form";
import { Button } from "@/components/ui/button";

const gallery = [
  "/images/gallery/01.webp",
  "/images/gallery/02.webp",
  "/images/gallery/03.webp",
  "/images/gallery/04.webp",
  "/images/gallery/05.webp",
  "/images/gallery/06.webp",
  "/images/gallery/07.webp",
  "/images/gallery/08.webp",
];

export default async function HomePage() {
  const content = await getContent();
  const { site, home } = content;

  return (
    <>
      <SiteHeader content={content} />
      <main className="flex-1">
        <section className="relative min-h-[70svh] overflow-hidden text-white md:min-h-[85svh]">
          <div className="absolute inset-0">
            <Image
              src="/images/lifestyle-08.webp"
              alt="Neapolská pizza Dal Birbante Praha Vinoř"
              fill
              priority
              className="hero-pan object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/45" />
          </div>
          <div className="relative mx-auto flex min-h-[70svh] max-w-6xl flex-col justify-end px-4 pb-14 pt-24 md:min-h-[85svh] md:justify-center md:px-6 md:pb-20">
            <Image
              src="/images/logo-white.webp"
              alt={site.brandName}
              width={420}
              height={52}
              className="animate-rise mb-6 h-10 w-auto md:h-14"
              priority
            />
            <h1 className="animate-rise-delay font-display max-w-4xl text-3xl uppercase leading-tight md:text-5xl lg:text-6xl">
              {home.introTitle}
            </h1>
            <p className="animate-rise-delay-2 mt-5 max-w-2xl text-base leading-relaxed text-white/90 md:text-lg">
              {home.introText}
            </p>
            <div className="animate-rise-delay-2 mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                className="btn-brand h-11 px-6 hover:bg-[var(--brand-red-hover)]"
              >
                <a href={site.orderUrl} target="_blank" rel="noreferrer">
                  {site.orderLabel}
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-11 rounded-[6.4px] border-white/50 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/menu">{home.menuCta}</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="section-pad mx-auto max-w-6xl">
          <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
            <div>
              <h2 className="font-display text-2xl uppercase text-[var(--brand-red)] md:text-3xl">
                {home.offerTitle}
              </h2>
              <ul className="mt-5 space-y-2 text-[var(--ink)]">
                {home.offerItems.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand-red)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-[var(--muted)]">{home.wineText}</p>
              <p className="mt-4 text-[var(--ink)]">{home.ctaLine1}</p>
              <p className="mt-2 text-[var(--ink)]">{home.ctaLine2}</p>
            </div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[6.4px]">
              <Image
                src="/images/lifestyle-01.webp"
                alt="Pizza z pece Dal Birbante"
                fill
                className="object-cover"
                sizes="(max-width:768px) 100vw, 50vw"
              />
            </div>
          </div>
        </section>

        <section className="band-black">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-3 md:px-6 md:py-20">
            {[
              {
                t: home.pizzaWeekTitle,
                d: home.pizzaWeekText,
                href: "/menu",
              },
              {
                t: home.dailyMenuTitle,
                d: home.dailyMenuText,
                href: "/denni-nabidka",
              },
              {
                t: home.glutenFreeTitle,
                d: home.glutenFreeText,
                href: "/bezlepkova-pizza-vinor",
              },
            ].map((block) => (
              <div key={block.t} className="border-t border-white/25 pt-5">
                <h2 className="font-display text-2xl uppercase md:text-3xl">
                  {block.t}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-white/75">
                  {block.d}
                </p>
                <Link
                  href={block.href}
                  className="mt-4 inline-block text-sm font-semibold uppercase tracking-wide text-[var(--brand-red)] hover:underline"
                >
                  Více
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="section-pad mx-auto max-w-6xl">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div className="relative aspect-[5/4] overflow-hidden rounded-[6.4px]">
              <Image
                src="/images/panozzo.webp"
                alt="Panozzo Dal Birbante"
                fill
                className="object-cover"
                sizes="(max-width:768px) 100vw, 50vw"
              />
            </div>
            <div>
              <h2 className="section-title text-[var(--brand-red)]">
                {home.storyTitle}
              </h2>
              <p className="section-lead">{home.storyText}</p>
            </div>
          </div>
        </section>

        <section className="band-black">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-6 md:py-20">
            <div>
              <h2 className="section-title-light">{home.deliveryTitle}</h2>
              <p className="mt-4 text-white/80">{home.deliveryText}</p>
              <p className="mt-3 text-white/80">{home.deliveryText2}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  asChild
                  className="btn-brand h-11 px-6 hover:bg-[var(--brand-red-hover)]"
                >
                  <a href={site.orderUrl} target="_blank" rel="noreferrer">
                    {site.orderLabel}
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-11 rounded-[6.4px] border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                  <Link href="/rozvoz">{content.nav.delivery}</Link>
                </Button>
              </div>
            </div>
            <div className="relative aspect-[5/4] overflow-hidden rounded-[6.4px]">
              <Image
                src="/images/zony.webp"
                alt="Rozvozové zóny Dal Birbante"
                fill
                className="object-contain bg-white"
                sizes="(max-width:768px) 100vw, 50vw"
              />
            </div>
          </div>
        </section>

        <section className="border-y border-[var(--line)] bg-[var(--paper-soft)]">
          <div className="mx-auto max-w-6xl px-4 py-14 md:px-6">
            <h2 className="section-title text-center">{home.featuresTitle}</h2>
            <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-4">
              {home.features.map((f) => (
                <p
                  key={f}
                  className="border-l-2 border-[var(--brand-red)] pl-3 text-sm md:text-base"
                >
                  {f}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section id="galerie" className="section-pad mx-auto max-w-6xl scroll-mt-24">
          <h2 className="section-title">{home.galleryTitle}</h2>
          <p className="section-lead">{home.gallerySubtitle}</p>
          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {gallery.map((src, i) => (
              <div
                key={src}
                className={`relative overflow-hidden rounded-[6.4px] ${i === 0 || i === 5 ? "md:col-span-2 md:row-span-2 aspect-square" : "aspect-square"}`}
              >
                <Image
                  src={src}
                  alt={`Fotogalerie Dal Birbante ${i + 1}`}
                  fill
                  className="object-cover transition duration-700 hover:scale-105"
                  sizes="(max-width:768px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-[var(--line)] bg-white">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:px-6 md:py-20">
            <div>
              <h2 className="section-title">{home.contactTitle}</h2>
              <p className="section-lead">{home.contactText}</p>
              <div className="mt-8 space-y-4">
                <div>
                  <h3 className="font-display text-lg uppercase text-[var(--brand-red)]">
                    {home.hoursTitle}
                  </h3>
                  <p className="mt-1 text-[var(--muted)]">
                    {site.hours}
                    <br />
                    {site.hoursClosed}
                  </p>
                </div>
                <div>
                  <h3 className="font-display text-lg uppercase text-[var(--brand-red)]">
                    {home.whereTitle}
                  </h3>
                  <p className="mt-1 text-[var(--muted)]">
                    {site.addressShort}
                    <br />
                    <a href={site.phoneHref} className="text-[var(--brand-red)]">
                      {site.phone}
                    </a>
                    <br />
                    <a
                      href={`mailto:${site.email}`}
                      className="text-[var(--brand-red)]"
                    >
                      {site.email}
                    </a>
                  </p>
                </div>
              </div>
            </div>
            <ContactForm content={content} />
          </div>
        </section>
      </main>
      <SiteFooter content={content} />
    </>
  );
}
