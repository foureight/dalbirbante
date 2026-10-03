import Image from "next/image";
import Link from "next/link";
import { getContent } from "@/lib/content";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ContactForm } from "@/components/contact-form";
import { DeliveryMap } from "@/components/delivery-map";
import { FaqAccordion } from "@/components/faq-accordion";
import { PageJsonLd } from "@/components/json-ld";
import { Reveal } from "@/components/reveal";
import { FeatureIcon } from "@/components/feature-icon";
import { HeroSlideshow } from "@/components/hero-slideshow";
import { Button } from "@/components/ui/button";
import {
  getBreadcrumbSchema,
  getFaqSchema,
  getPageSchema,
} from "@/lib/schema";

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
      <PageJsonLd data={getPageSchema("home", content)} />
      <PageJsonLd
        data={getFaqSchema("https://www.dalbirbante.cz/#faq", home.faqs)}
      />
      <PageJsonLd
        data={getBreadcrumbSchema([{ name: "Domů", path: "/" }])}
      />
      <SiteHeader content={content} />
      <main className="flex-1">
        <section className="relative min-h-[70svh] overflow-hidden text-white md:min-h-[90svh]">
          <HeroSlideshow />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/20 md:from-black/55 md:via-black/25 md:to-transparent" />
          <div className="site-max relative mx-auto flex min-h-[70svh] w-full flex-col justify-end px-4 pb-10 pt-24 sm:px-5 sm:pb-14 md:min-h-[90svh] md:justify-center md:px-10 md:pb-24">
            <h1 className="animate-rise-delay max-w-4xl text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]">
              {home.introTitle}
            </h1>
            <p className="animate-rise-delay-2 mt-4 max-w-2xl text-[0.98rem] leading-relaxed text-white/90 sm:mt-6 sm:text-[1.05rem] md:mt-8 md:text-[length:var(--font-size-base)] md:leading-[var(--line-height-base)]">
              {home.introText}
            </p>
            <div className="animate-rise-delay-2 mt-6 flex w-full flex-col gap-3 sm:mt-8 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-4 md:mt-10">
              <Button asChild className="btn-brand w-full sm:w-auto">
                <a href={site.orderUrl} target="_blank" rel="noreferrer">
                  {site.orderLabel}
                </a>
              </Button>
              <Button asChild className="btn-outline-light w-full sm:w-auto">
                <Link href="/menu">{home.menuCta}</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="site-max section-pad mx-auto w-full">
          <div className="grid items-stretch gap-10 md:grid-cols-2 md:gap-20 lg:gap-24">
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
            {/* Absolute image fills the grid cell so height matches the text column */}
            <Reveal
              delay={120}
              variant="fade"
              className="relative min-h-[320px] md:min-h-0"
            >
              <div className="absolute inset-0 overflow-hidden rounded-[6.4px]">
                <Image
                  src="/images/lifestyle-01.webp"
                  alt="Pizza z\u00A0pece Dal Birbante"
                  fill
                  className="hero-pan-alt object-cover"
                  sizes="(max-width:768px) 100vw, 50vw"
                />
              </div>
            </Reveal>
          </div>
        </section>

        <section className="band-green">
          <div className="band-inner grid gap-10 md:grid-cols-3 md:gap-10 md:items-stretch">
            {[
              {
                t: home.pizzaWeekTitle,
                d: home.pizzaWeekText,
                image: home.pizzaWeekImage,
                href: "/menu#pizza",
                cta: "Pizza týdne",
                imageAlt: "Pizza týdne Dal Birbante",
              },
              {
                t: home.dailyMenuTitle,
                d: home.dailyMenuText,
                image: home.dailyMenuImage,
                href: "/denni-nabidka",
                cta: "Denní nabídka",
                imageAlt: "Denní menu Dal Birbante",
              },
              {
                t: home.glutenFreeTitle,
                d: home.glutenFreeText,
                image: home.glutenFreeImage,
                href: "/bezlepkova-pizza-vinor",
                cta: "Bezlepková nabídka",
                imageAlt: "Bezlepková pizza Dal Birbante",
              },
            ].map((block, i) => (
              <Reveal key={block.t} delay={i * 100} className="h-full">
                <article className="band-card flex h-full flex-col">
                  {block.image ? (
                    <Link
                      href={block.href}
                      className="band-card-media group relative mb-1 block overflow-hidden"
                      aria-label={block.cta}
                    >
                      <Image
                        src={block.image}
                        alt={block.imageAlt}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-[1.04]"
                        sizes="(max-width:768px) 100vw, 33vw"
                      />
                    </Link>
                  ) : null}
                  <h2 className="band-card-title">
                    <Link href={block.href} className="transition hover:opacity-90">
                      {block.t.split("\n").map((line, lineIndex) => (
                        <span key={`${block.t}-${lineIndex}`}>
                          {lineIndex > 0 ? <br /> : null}
                          {line}
                        </span>
                      ))}
                    </Link>
                  </h2>
                  <p className="band-card-text text-white/90">{block.d}</p>
                  <Link
                    href={block.href}
                    className="btn-outline-light mt-auto inline-flex w-full sm:w-fit"
                  >
                    {block.cta}
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="site-max section-pad mx-auto w-full">
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
              <h2 className="section-title text-[var(--brand-green)]">
                {home.storyTitle}
              </h2>
              <p className="section-lead">{home.storyText}</p>
            </Reveal>
          </div>
        </section>

        <section className="band-green">
          <div className="band-inner grid items-start gap-14 md:grid-cols-2 md:gap-20">
            <Reveal>
              <h2 className="section-title-light">{home.deliveryTitle}</h2>
              <p className="mt-6 text-white/85">{home.deliveryText}</p>
              <p className="mt-5 text-white/85">{home.deliveryText2}</p>
              <div className="mt-8 flex w-full flex-col gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-4">
                <Button asChild className="btn-brand w-full sm:w-auto">
                  <a href={site.orderUrl} target="_blank" rel="noreferrer">
                    {site.orderLabel}
                  </a>
                </Button>
                <Button asChild className="btn-outline-light w-full sm:w-auto">
                  <Link href="/rozvoz">{content.nav.delivery}</Link>
                </Button>
              </div>
            </Reveal>
            <Reveal delay={140} variant="fade">
              <DeliveryMap className="min-h-[320px]" />
            </Reveal>
          </div>
        </section>

        <section className="border-y border-[var(--line)] bg-[var(--paper-soft)]">
          <div className="band-inner">
            <Reveal>
              <h2 className="section-title text-left !text-[var(--brand-green)]">
                {home.featuresTitle}
              </h2>
            </Reveal>
            <div className="mt-14 grid grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2 md:grid-cols-3">
              {home.features.map((f, i) => (
                <Reveal key={f.title} delay={60 * i}>
                  <div className="feature-chip flex items-start gap-4">
                    <FeatureIcon title={f.title} />
                    <div>
                      <p className="font-semibold text-[var(--ink)]">{f.title}</p>
                      <p className="mt-2 text-[0.95rem] leading-snug text-[var(--muted)]">
                        {f.text}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section
          id="galerie"
          className="site-max section-pad mx-auto w-full scroll-mt-28"
        >
          <Reveal>
            <h2 className="section-title text-[var(--brand-green)]">
              {home.galleryTitle}
            </h2>
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

        <section
          id="faq"
          className="w-full border-t border-[var(--line)] bg-[var(--paper-soft)] px-5 py-16 md:px-10 md:py-24"
        >
          <div className="site-max mx-auto w-full">
            <Reveal className="pointer-events-auto">
              <h2 className="text-[var(--brand-green)]">{home.faqTitle}</h2>
              <FaqAccordion items={home.faqs} />
            </Reveal>
          </div>
        </section>

        <section className="border-t border-[var(--line)] bg-white">
          <div className="band-inner grid gap-14 md:grid-cols-2 md:gap-20">
            <Reveal>
              <h2 className="section-title !text-[var(--brand-green)]">
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
