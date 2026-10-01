import Image from "next/image";
import Link from "next/link";
import { getContent } from "@/lib/content";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ContactForm } from "@/components/contact-form";
import { DeliveryMap } from "@/components/delivery-map";
import { Reveal } from "@/components/reveal";
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
        <section className="relative min-h-[75svh] overflow-hidden text-white md:min-h-[90svh]">
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
          <div className="relative mx-auto flex min-h-[75svh] max-w-6xl flex-col justify-end px-5 pb-20 pt-28 md:min-h-[90svh] md:justify-center md:px-10 md:pb-28">
            <h1 className="animate-rise-delay max-w-4xl text-white">
              {home.introTitle}
            </h1>
            <p className="animate-rise-delay-2 mt-8 max-w-2xl text-white/90">
              {home.introText}
            </p>
            <div className="animate-rise-delay-2 mt-10 flex flex-wrap gap-4">
              <Button asChild className="btn-brand">
                <a href={site.orderUrl} target="_blank" rel="noreferrer">
                  {site.orderLabel}
                </a>
              </Button>
              <Button asChild className="btn-outline-light">
                <Link href="/menu">{home.menuCta}</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="section-pad mx-auto max-w-6xl">
          <div className="grid items-center gap-14 md:grid-cols-2 md:gap-20 lg:gap-24">
            <Reveal>
              <h2 className="text-[var(--brand-red)]">{home.offerTitle}</h2>
              <ul className="mt-8 space-y-4 text-[var(--ink)]">
                {home.offerItems.map((item, i) => (
                  <Reveal key={item} delay={80 * (i + 1)}>
                    <li className="flex gap-4">
                      <span className="mt-4 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand-red)]" />
                      <span>{item}</span>
                    </li>
                  </Reveal>
                ))}
              </ul>
              <p className="mt-8 text-[var(--muted)]">{home.wineText}</p>
              <p className="mt-6 text-[var(--ink)]">{home.ctaLine1}</p>
              <p className="mt-3 text-[var(--ink)]">{home.ctaLine2}</p>
            </Reveal>
            <Reveal delay={120} variant="scale">
              <div className="img-zoom relative aspect-[4/5] overflow-hidden rounded-[6.4px]">
                <Image
                  src="/images/lifestyle-01.webp"
                  alt="Pizza z\u00A0pece Dal Birbante"
                  fill
                  className="img-zoom-media object-cover"
                  sizes="(max-width:768px) 100vw, 50vw"
                />
              </div>
            </Reveal>
          </div>
        </section>

        <section className="band-black">
          <div className="band-inner grid gap-14 md:grid-cols-3 md:gap-12">
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
            ].map((block, i) => (
              <Reveal key={block.t} delay={i * 100}>
                <div className="border-t border-white/25 pt-8">
                  <h2>{block.t}</h2>
                  <p className="mt-5 text-white/80">{block.d}</p>
                  <Link
                    href={block.href}
                    className="band-link mt-6 inline-block font-semibold uppercase tracking-wide text-[var(--brand-red)] hover:underline"
                  >
                    Více
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="section-pad mx-auto max-w-6xl">
          <div className="grid items-center gap-14 md:grid-cols-2 md:gap-20">
            <Reveal variant="scale">
              <div className="img-zoom relative aspect-[5/4] overflow-hidden rounded-[6.4px]">
                <Image
                  src="/images/panozzo.webp"
                  alt="Panozzo Dal Birbante"
                  fill
                  className="img-zoom-media object-cover"
                  sizes="(max-width:768px) 100vw, 50vw"
                />
              </div>
            </Reveal>
            <Reveal delay={120}>
              <h2 className="section-title text-[var(--brand-red)]">
                {home.storyTitle}
              </h2>
              <p className="section-lead">{home.storyText}</p>
            </Reveal>
          </div>
        </section>

        <section className="band-black">
          <div className="band-inner grid items-center gap-14 md:grid-cols-2 md:gap-20">
            <Reveal>
              <h2 className="section-title-light">{home.deliveryTitle}</h2>
              <p className="mt-6 text-white/85">{home.deliveryText}</p>
              <p className="mt-5 text-white/85">{home.deliveryText2}</p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Button asChild className="btn-brand">
                  <a href={site.orderUrl} target="_blank" rel="noreferrer">
                    {site.orderLabel}
                  </a>
                </Button>
                <Button asChild className="btn-outline-light">
                  <Link href="/rozvoz">{content.nav.delivery}</Link>
                </Button>
              </div>
            </Reveal>
            <Reveal delay={140} variant="scale">
              <DeliveryMap className="min-h-[320px]" />
            </Reveal>
          </div>
        </section>

        <section className="border-y border-[var(--line)] bg-[var(--paper-soft)]">
          <div className="band-inner">
            <Reveal>
              <h2 className="section-title text-center">{home.featuresTitle}</h2>
            </Reveal>
            <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 md:grid-cols-4">
              {home.features.map((f, i) => (
                <Reveal key={f} delay={60 * i}>
                  <p className="feature-chip border-l-2 border-[var(--brand-red)] pl-5">
                    {f}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section
          id="galerie"
          className="section-pad mx-auto max-w-6xl scroll-mt-28"
        >
          <Reveal>
            <h2 className="section-title">{home.galleryTitle}</h2>
            <p className="section-lead">{home.gallerySubtitle}</p>
          </Reveal>
          <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {gallery.map((src, i) => (
              <Reveal
                key={src}
                delay={(i % 4) * 70}
                variant="scale"
                className={
                  i === 0 || i === 5
                    ? "md:col-span-2 md:row-span-2"
                    : undefined
                }
              >
                <div className="img-zoom relative aspect-square overflow-hidden rounded-[6.4px]">
                  <Image
                    src={src}
                    alt={`Fotogalerie Dal Birbante ${i + 1}`}
                    fill
                    className="img-zoom-media object-cover"
                    sizes="(max-width:768px) 50vw, 25vw"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="border-t border-[var(--line)] bg-white">
          <div className="band-inner grid gap-14 md:grid-cols-2 md:gap-20">
            <Reveal>
              <h2 className="section-title text-[var(--brand-red)]">
                {home.contactTitle}
              </h2>
              <p className="section-lead">{home.contactText}</p>
              <div className="mt-12 space-y-8">
                <div>
                  <h3 className="text-[var(--brand-red)]">{home.hoursTitle}</h3>
                  <p className="mt-3 text-[var(--muted)]">
                    {site.hours}
                    <br />
                    {site.hoursClosed}
                  </p>
                </div>
                <div>
                  <h3 className="text-[var(--brand-red)]">{home.whereTitle}</h3>
                  <p className="mt-3 text-[var(--muted)]">
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
            </Reveal>
            <Reveal delay={120}>
              <ContactForm content={content} />
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter content={content} />
    </>
  );
}
