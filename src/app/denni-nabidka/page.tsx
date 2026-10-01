import type { Metadata } from "next";
import Link from "next/link";
import { getContent } from "@/lib/content";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { PageHero } from "@/components/page-hero";
import { PageJsonLd } from "@/components/json-ld";
import { Reveal } from "@/components/reveal";
import { getPageSchema } from "@/lib/schema";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContent();
  return buildPageMetadata(content, {
    path: "/denni-nabidka",
    title: content.site.pageMeta.daily.title,
    description: content.site.pageMeta.daily.description,
    image: "/images/gallery/03.webp",
  });
}

export default async function DailyMenuPage() {
  const content = await getContent();
  const { site, daily } = content;

  return (
    <>
      <PageJsonLd data={getPageSchema("daily", content)} />
      <SiteHeader content={content} />
      <main className="flex-1">
        <PageHero
          title={
            <>
              {daily.title}
              <span className="mt-3 block text-white md:mt-0 md:ml-4 md:inline">
                {daily.date}
              </span>
            </>
          }
          image="/images/gallery/03.webp"
          imageAlt="Denní menu Dal Birbante"
        />

        <section className="page-wrap py-24 md:py-36">
          <Reveal>
            <p className="max-w-none text-justify text-[var(--muted)]">
              {daily.intro}
            </p>
          </Reveal>

          <ul className="mt-14 divide-y divide-[var(--line)] border-y border-[var(--line)]">
            {daily.items.map((item, i) => (
              <Reveal key={item.name} delay={(i % 3) * 50}>
                <li className="grid gap-5 py-8 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div>
                    <h2 className="text-[clamp(1.35rem,2vw,1.75rem)] normal-case tracking-normal text-[var(--ink)]">
                      <span className="font-black uppercase">{item.name}</span>
                      {item.emoji ? (
                        <span className="ml-2 font-normal" aria-hidden>
                          {item.emoji}
                        </span>
                      ) : null}
                    </h2>
                    <p className="mt-2 text-[var(--muted)]">{item.description}</p>
                    {item.note ? (
                      <p className="mt-2 text-sm text-[var(--muted)]">{item.note}</p>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-8 sm:justify-end">
                    <p className="text-3xl font-black leading-none text-[var(--brand-red)] md:text-4xl">
                      {item.price}
                    </p>
                    <AddToCartButton name={item.name} price={item.price} />
                  </div>
                </li>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={120}>
            <p className="mt-10 whitespace-nowrap text-[var(--muted)] max-md:overflow-x-auto max-md:whitespace-normal">
              {daily.note}
            </p>
            <div className="mt-12">
              <Button
                asChild
                variant="outline"
                className="rounded-full px-[2.2rem] py-[1.5rem] text-[1.3rem] font-extrabold uppercase"
              >
                <Link href="/menu">{content.nav.menu}</Link>
              </Button>
            </div>
          </Reveal>
        </section>
      </main>
      <SiteFooter content={content} />
    </>
  );
}
