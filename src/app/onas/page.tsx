import Image from "next/image";
import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageJsonLd } from "@/components/json-ld";
import { FaqAccordion } from "@/components/faq-accordion";
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
    path: "/onas",
    title: content.site.pageMeta.about.title,
    description: content.site.pageMeta.about.description,
    image: "/images/lifestyle-onas.webp",
  });
}

export default async function AboutPage() {
  const content = await getContent();
  const { about } = content;

  return (
    <>
      <PageJsonLd data={getPageSchema("about", content)} />
      <PageJsonLd
        data={getFaqSchema("https://www.dalbirbante.cz/onas#faq", about.faqs)}
      />
      <PageJsonLd
        data={getBreadcrumbSchema([
          { name: "Domů", path: "/" },
          { name: "O nás", path: "/onas" },
        ])}
      />
      <SiteHeader content={content} />
      <main className="flex-1">
        <section className="relative min-h-[34vh] overflow-hidden text-white sm:min-h-[40vh]">
          <Image
            src="/images/lifestyle-onas.webp"
            alt="O nás Dal Birbante"
            fill
            priority
            className="hero-pan object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/45 to-black/25" />
          <div className="site-max relative mx-auto flex min-h-[38vh] w-full items-end px-4 pb-10 sm:min-h-[48vh] sm:px-5 sm:pb-14 md:px-10 md:pb-20">
            <h1 className="animate-rise-delay text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]">
              {about.title}
            </h1>
          </div>
        </section>

        <section className="page-wrap grid gap-10 py-12 md:grid-cols-[1.1fr_0.9fr] md:gap-20 md:py-36">
          <Reveal>
            <h2 className="leading-snug text-[var(--brand-green)]">
              {about.lead}
            </h2>
            <div className="mt-6 space-y-5 text-base leading-relaxed text-[var(--muted)] md:mt-10 md:space-y-7 md:text-[length:inherit] md:leading-[inherit]">
              {about.paragraphs.map((p, i) => (
                <Reveal key={p.slice(0, 32)} delay={80 * (i + 1)}>
                  <p>{p}</p>
                </Reveal>
              ))}
            </div>
          </Reveal>
          <Reveal delay={140} variant="scale">
            <div className="img-zoom relative aspect-[4/5] overflow-hidden rounded-[6.4px] md:mt-4">
              <Image
                src="/images/lifestyle-01.webp"
                alt="Interiér a\u00A0pizza Dal Birbante"
                fill
                className="img-zoom-media object-cover"
                sizes="(max-width:768px) 100vw, 40vw"
              />
            </div>
          </Reveal>
        </section>

        <section
          id="faq"
          className="w-full border-t border-[var(--line)] bg-[var(--paper-soft)] px-5 py-16 md:px-10 md:py-24"
        >
          <div className="site-max mx-auto w-full">
            <Reveal className="pointer-events-auto">
              <h2 className="text-[var(--brand-green)]">{about.faqTitle}</h2>
              <FaqAccordion items={about.faqs} />
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter content={content} />
    </>
  );
}
