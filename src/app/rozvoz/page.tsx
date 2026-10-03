import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { PageJsonLd } from "@/components/json-ld";
import { FaqAccordion } from "@/components/faq-accordion";
import { DeliveryMap } from "@/components/delivery-map";
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
    path: "/rozvoz",
    title: content.site.pageMeta.delivery.title,
    description: content.site.pageMeta.delivery.description,
    image: "/images/panozzo.webp",
  });
}

export default async function DeliveryPage() {
  const content = await getContent();
  const { site, delivery } = content;

  return (
    <>
      <PageJsonLd data={getPageSchema("delivery", content)} />
      <PageJsonLd
        data={getFaqSchema(
          "https://www.dalbirbante.cz/rozvoz#faq",
          delivery.faqs,
        )}
      />
      <PageJsonLd
        data={getBreadcrumbSchema([
          { name: "Domů", path: "/" },
          { name: "Rozvoz", path: "/rozvoz" },
        ])}
      />
      <SiteHeader content={content} />
      <main className="flex-1">
        <PageHero
          title={delivery.title}
          image="/images/panozzo.webp"
          imageAlt="Rozvoz jídla Dal Birbante"
        />

        <section className="page-wrap py-12 md:py-36">
          <Reveal>
            <p className="max-w-none text-left text-base leading-relaxed text-[var(--muted)] md:text-[length:inherit] md:leading-[inherit]">
              {delivery.intro}
            </p>
            <p className="mt-4 max-w-none text-left text-base leading-relaxed text-[var(--muted)] md:mt-6 md:text-[length:inherit] md:leading-[inherit]">
              {delivery.intro2}
            </p>
          </Reveal>

          <Reveal delay={80}>
            <h2 className="mt-10 text-[var(--brand-green)] md:mt-16">
              {delivery.pricesTitle}
            </h2>

            <ul className="mt-5 space-y-3 md:hidden">
              {delivery.zones.map((z) => (
                <li
                  key={z.name}
                  className="rounded-[6.4px] border border-[var(--line)] bg-white px-4 py-4"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-extrabold uppercase tracking-wide text-[var(--ink)]">
                      {z.name}
                    </p>
                    <p className="shrink-0 font-black text-[var(--brand-red)]">
                      {z.fee}
                    </p>
                  </div>
                  <p className="mt-2 text-sm leading-snug text-[var(--muted)]">
                    {z.areas}
                  </p>
                  <p className="mt-2 text-sm text-[var(--ink)]">
                    Min. objednávka:{" "}
                    <span className="font-semibold">{z.min}</span>
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-8 hidden overflow-x-auto md:block">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[var(--line)] text-[var(--ink)]">
                    <th className="py-3 font-bold">Zóna</th>
                    <th className="py-3 font-bold">Oblasti</th>
                    <th className="py-3 text-right font-bold">Rozvoz</th>
                    <th className="py-3 text-right font-bold">Min. objednávka</th>
                  </tr>
                </thead>
                <tbody>
                  {delivery.zones.map((z) => (
                    <tr key={z.name} className="border-b border-[var(--line)]">
                      <td className="py-3 font-medium">{z.name}</td>
                      <td className="py-3 text-[var(--muted)]">{z.areas}</td>
                      <td className="py-3 text-right">{z.fee}</td>
                      <td className="py-3 text-right">{z.min}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          <Reveal delay={120} variant="scale">
            <div className="mt-8 w-full md:mt-10">
              <DeliveryMap zones={delivery.zones} />
            </div>
          </Reveal>

          <Reveal delay={160}>
            <Button asChild className="btn-brand mt-8 w-full sm:w-auto">
              <a href={site.orderUrl} target="_blank" rel="noreferrer">
                {site.orderLabel}
              </a>
            </Button>
          </Reveal>
        </section>

        <section className="w-full border-t border-[var(--line)] bg-[var(--paper-soft)] px-5 py-16 md:px-10 md:py-24">
          <div className="site-max mx-auto w-full">
            <Reveal className="pointer-events-auto">
              <h2 className="text-[var(--brand-green)]">{delivery.faqTitle}</h2>
              <FaqAccordion items={delivery.faqs} />
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter content={content} />
    </>
  );
}
