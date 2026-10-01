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
import { getFaqSchema, getPageSchema } from "@/lib/schema";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContent();
  return {
    title: content.site.pageMeta.glutenFree.title,
    description: content.site.pageMeta.glutenFree.description,
  };
}

export default async function GlutenFreePage() {
  const content = await getContent();
  const { site, glutenFree } = content;

  return (
    <>
      <PageJsonLd data={getPageSchema("glutenFree", content)} />
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
          imageAlt="Bezlepková pizza Dal Birbante Vinoř"
        />

        <section className="page-wrap grid gap-14 py-24 md:grid-cols-[1.1fr_0.9fr] md:gap-20 md:py-36">
          <Reveal>
            <p className="max-w-none text-justify text-[var(--muted)]">
              {glutenFree.intro}
            </p>
            <p className="mt-6 max-w-none text-justify text-[var(--muted)]">
              {glutenFree.intro2}
            </p>

            <h2 className="mt-14 text-[var(--brand-green)]">
              {glutenFree.howTitle}
            </h2>
            <ul className="mt-6 space-y-4">
              {glutenFree.howItems.map((item, i) => (
                <Reveal key={item} delay={70 * (i + 1)}>
                  <li className="flex gap-4 text-[var(--ink)]">
                    <span className="mt-4 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand-red)]" />
                    <span>{item}</span>
                  </li>
                </Reveal>
              ))}
            </ul>

            <Button asChild className="btn-brand mt-10">
              <a href={site.phoneHref}>{site.callLabel}</a>
            </Button>
          </Reveal>
          <Reveal delay={140} variant="scale">
            <div className="img-zoom relative aspect-square overflow-hidden rounded-[6.4px] bg-[var(--paper-soft)]">
              <Image
                src="/images/burrata.webp"
                alt="Bezlepková pizza Dal Birbante Vinoř"
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
