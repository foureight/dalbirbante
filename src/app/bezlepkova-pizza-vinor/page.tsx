import Image from "next/image";
import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { PageJsonLd } from "@/components/json-ld";
import { FaqAccordion } from "@/components/faq-accordion";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import {
  getBreadcrumbSchema,
  getFaqSchema,
  getPageSchema,
} from "@/lib/schema";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContent();
  return buildPageMetadata(content, {
    path: "/bezlepkova-pizza-vinor",
    title: content.site.pageMeta.glutenFree.title,
    description: content.site.pageMeta.glutenFree.description,
  });
}

export default async function GlutenFreePage() {
  const content = await getContent();
  const { site, glutenFree } = content;

  return (
    <>
      <PageJsonLd data={getPageSchema("glutenFree", content)} />
      <PageJsonLd
        data={getBreadcrumbSchema([
          { name: "Domů", path: "/" },
          {
            name: "Bezlepková nabídka",
            path: "/bezlepkova-pizza-vinor",
          },
        ])}
      />
      <PageJsonLd
        data={getFaqSchema(
          "https://www.dalbirbante.cz/bezlepkova-pizza-vinor#faq",
          glutenFree.faqs,
        )}
      />
      <SiteHeader content={content} />
      <main className="flex-1">
        <PageHero
          title={glutenFree.title}
          image="/images/burrata.webp"
          imageAlt="Bezlepková pizza, pasta a gnocchi Dal Birbante Vinoř"
        />

        <section className="page-wrap grid gap-10 py-12 md:grid-cols-[1.1fr_0.9fr] md:gap-20 md:py-36">
          <Reveal>
            <p className="max-w-none text-left leading-relaxed text-[var(--muted)]">
              {glutenFree.intro}
            </p>
            <p className="mt-4 max-w-none text-left leading-relaxed text-[var(--muted)] md:mt-6">
              {glutenFree.intro2}
            </p>

            <h2 className="mt-10 text-[var(--brand-green)] md:mt-14">
              {glutenFree.productsTitle}
            </h2>
            <ul className="mt-5 space-y-3 md:mt-6 md:space-y-4">
              {glutenFree.products.map((item, i) => (
                <Reveal key={item} delay={60 * (i + 1)}>
                  <li className="flex gap-3 leading-relaxed text-[var(--ink)] sm:gap-4">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand-red)] sm:mt-4" />
                    <span>{item}</span>
                  </li>
                </Reveal>
              ))}
            </ul>
            <p className="mt-5 font-bold leading-relaxed text-[var(--brand-green)]">
              {glutenFree.productsNote}
            </p>

            <h2 className="mt-10 text-[var(--brand-green)] md:mt-14">
              {glutenFree.howTitle}
            </h2>
            <ul className="mt-5 space-y-3 md:mt-6 md:space-y-4">
              {glutenFree.howItems.map((item, i) => (
                <Reveal key={item} delay={70 * (i + 1)}>
                  <li className="flex gap-3 leading-relaxed text-[var(--ink)] sm:gap-4">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand-red)] sm:mt-4" />
                    <span>{item}</span>
                  </li>
                </Reveal>
              ))}
            </ul>

            <div className="mt-8 flex w-full flex-col gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-4">
              <Button asChild className="btn-brand w-full sm:w-auto">
                <a href={site.phoneHref}>{site.callLabel}</a>
              </Button>
              <Button asChild className="btn-green w-full sm:w-auto">
                <a href="/menu">Celé menu</a>
              </Button>
            </div>
          </Reveal>
          <Reveal delay={140} variant="scale">
            <div className="img-zoom relative aspect-square overflow-hidden rounded-[6.4px] bg-[var(--paper-soft)]">
              <Image
                src="/images/burrata.webp"
                alt="Bezlepková pizza, pasta a gnocchi Dal Birbante Vinoř"
                fill
                className="img-zoom-media object-contain"
                sizes="(max-width:768px) 100vw, 40vw"
              />
            </div>
          </Reveal>
        </section>

        <section className="border-t border-[var(--line)] bg-[var(--paper-soft)]">
          <div className="page-wrap space-y-10 py-24 md:py-32">
            <Reveal className="pointer-events-auto">
              <h2 className="text-[var(--brand-green)]">{glutenFree.faqTitle}</h2>
              <FaqAccordion
                items={glutenFree.faqs}
                titleClassName="text-[var(--brand-red)]"
              />
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter content={content} />
    </>
  );
}
