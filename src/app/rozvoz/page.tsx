import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { PageJsonLd } from "@/components/json-ld";
import { FaqAccordion } from "@/components/faq-accordion";
import { DeliveryMap } from "@/components/delivery-map";
import { Reveal } from "@/components/reveal";
import { getFaqSchema, getPageSchema } from "@/lib/schema";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContent();
  return {
    title: content.site.pageMeta.delivery.title,
    description: content.site.pageMeta.delivery.description,
  };
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
      <SiteHeader content={content} />
      <main className="flex-1">
        <section className="page-wrap py-24 md:py-36">
          <Reveal>
            <h1 className="section-title text-[var(--brand-red)]">
              {delivery.title}
            </h1>
            <p className="section-lead">{delivery.intro}</p>
            <p className="mt-6 max-w-3xl text-[var(--muted)]">{delivery.intro2}</p>
          </Reveal>

          <Reveal delay={80}>
            <h2 className="mt-16 text-[var(--brand-green)]">
              {delivery.pricesTitle}
            </h2>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[560px] text-left">
                <thead>
                  <tr className="border-b border-[var(--line)] text-[var(--muted)]">
                    <th className="py-3 font-medium">Zóna</th>
                    <th className="py-3 font-medium">Oblasti</th>
                    <th className="py-3 font-medium">Rozvoz</th>
                    <th className="py-3 font-medium">Min. objednávka</th>
                  </tr>
                </thead>
                <tbody>
                  {delivery.zones.map((z) => (
                    <tr key={z.name} className="border-b border-[var(--line)]">
                      <td className="py-3 font-medium">{z.name}</td>
                      <td className="py-3 text-[var(--muted)]">{z.areas}</td>
                      <td className="py-3">{z.fee}</td>
                      <td className="py-3">{z.min}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          <Reveal delay={120} variant="scale">
            <div className="mt-10 w-full">
              <DeliveryMap />
            </div>
          </Reveal>

          <Reveal delay={160}>
            <Button asChild className="btn-brand mt-8">
              <a href={site.orderUrl} target="_blank" rel="noreferrer">
                {site.orderLabel}
              </a>
            </Button>
          </Reveal>
        </section>

        <section className="w-full border-t border-[var(--line)] bg-[var(--paper-soft)] px-5 py-16 md:px-10 md:py-24">
          <div className="site-max mx-auto w-full">
            <Reveal className="pointer-events-auto">
              <h2 className="text-[var(--brand-red)]">{delivery.faqTitle}</h2>
              <FaqAccordion items={delivery.faqs} />
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter content={content} />
    </>
  );
}
