import Image from "next/image";
import Link from "next/link";
import { getContent } from "@/lib/content";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
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
        <section className="relative min-h-[100svh] overflow-hidden text-white">
          <div className="absolute inset-0">
            <Image
              src="/images/lifestyle-08.webp"
              alt="Neapolská pizza Dal Birbante"
              fill
              priority
              className="hero-pan object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(22,20,15,0.78)_0%,rgba(22,20,15,0.45)_45%,rgba(31,61,48,0.35)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(201,72,32,0.22),transparent_40%)]" />
          </div>

          <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-4 pb-16 pt-28 md:justify-center md:px-6 md:pb-24 md:pt-20">
            <p className="animate-rise mb-4 text-xs uppercase tracking-[0.28em] text-white/75">
              {home.heroEyebrow}
            </p>
            <h1 className="animate-rise-delay font-display max-w-3xl text-5xl leading-[0.95] md:text-7xl lg:text-8xl">
              {site.brandName}
            </h1>
            <p className="animate-rise-delay mt-3 max-w-xl font-display text-2xl text-white/90 md:text-3xl">
              {home.heroHeadline}
            </p>
            <p className="animate-rise-delay-2 mt-5 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
              {home.heroSub}
            </p>
            <div className="animate-rise-delay-2 mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                className="rounded-none bg-[var(--accent)] px-6 text-white hover:bg-[var(--accent-hover)]"
              >
                <a href={site.orderUrl} target="_blank" rel="noreferrer">
                  {home.heroCtaPrimary}
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-none border-white/40 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/menu">{home.heroCtaSecondary}</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="section-pad mx-auto max-w-6xl">
          <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
            <div>
              <h2 className="section-title">{home.introTitle}</h2>
              <p className="section-lead">{home.introText}</p>
              <h3 className="mt-10 font-display text-2xl text-[var(--forest)]">
                {home.offerTitle}
              </h3>
              <ul className="mt-4 space-y-2 text-[var(--ink)]">
                {home.offerItems.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-[var(--accent)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/images/lifestyle-01.webp"
                alt="Pizza z pece"
                fill
                className="object-cover"
                sizes="(max-width:768px) 100vw, 50vw"
              />
            </div>
          </div>
        </section>

        <section className="border-y border-[var(--line)] bg-[var(--forest)] text-[var(--paper)]">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 md:grid-cols-3 md:px-6 md:py-16">
            {[
              { t: home.pizzaWeekTitle, d: home.pizzaWeekText },
              { t: home.dailyMenuTitle, d: home.dailyMenuText },
              { t: home.glutenFreeTitle, d: home.glutenFreeText },
            ].map((block, i) => (
              <div
                key={block.t}
                className="animate-rise border-t border-white/20 pt-5"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <h3 className="font-display text-2xl">{block.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/75">
                  {block.d}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="section-pad mx-auto max-w-6xl">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div className="relative aspect-[5/4] overflow-hidden">
              <Image
                src="/images/panozzo.webp"
                alt="Panozzo"
                fill
                className="object-cover"
                sizes="(max-width:768px) 100vw, 50vw"
              />
            </div>
            <div>
              <h2 className="section-title">{home.deliveryTitle}</h2>
              <p className="section-lead">{home.deliveryText}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  asChild
                  className="rounded-none bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]"
                >
                  <a href={site.orderUrl} target="_blank" rel="noreferrer">
                    {site.orderLabel}
                  </a>
                </Button>
                <Button asChild variant="outline" className="rounded-none">
                  <Link href="/kontakt">Rozvozové zóny</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-[var(--line)] bg-white/40">
          <div className="mx-auto max-w-6xl px-4 py-14 md:px-6">
            <h2 className="section-title text-center">{home.featuresTitle}</h2>
            <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-4">
              {home.features.map((f) => (
                <p
                  key={f}
                  className="border-l-2 border-[var(--accent)] pl-3 text-sm md:text-base"
                >
                  {f}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section id="galerie" className="section-pad mx-auto max-w-6xl scroll-mt-20">
          <h2 className="section-title">{home.galleryTitle}</h2>
          <p className="section-lead">{home.gallerySubtitle}</p>
          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {gallery.map((src, i) => (
              <div
                key={src}
                className={`relative overflow-hidden ${i === 0 || i === 5 ? "md:col-span-2 md:row-span-2 aspect-square" : "aspect-square"}`}
              >
                <Image
                  src={src}
                  alt={`Galerie ${i + 1}`}
                  fill
                  className="object-cover transition duration-700 hover:scale-105"
                  sizes="(max-width:768px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/lifestyle-onas.webp"
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-[var(--ink)]/75" />
          </div>
          <div className="relative mx-auto max-w-3xl px-4 py-20 text-center text-white md:py-28">
            <h2 className="font-display text-3xl md:text-5xl">{home.ctaTitle}</h2>
            <p className="mx-auto mt-5 max-w-xl text-white/80">{home.ctaText}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button
                asChild
                className="rounded-none bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]"
              >
                <a href={site.orderUrl} target="_blank" rel="noreferrer">
                  {site.orderLabel}
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-none border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <a href={site.phoneHref}>{site.phone}</a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter content={content} />
    </>
  );
}
