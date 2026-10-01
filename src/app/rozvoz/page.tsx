import Image from "next/image";
import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";

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

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: delivery.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <SiteHeader content={content} />
      <main className="flex-1">
        <section className="page-wrap py-24 md:py-36">
          <h1 className="section-title text-[var(--brand-red)]">{delivery.title}</h1>
          <p className="section-lead">{delivery.intro}</p>
          <p className="mt-6 max-w-3xl text-[var(--muted)]">{delivery.intro2}</p>

          <h2 className="mt-16 font-display text-2xl uppercase text-[var(--brand-green)] md:text-3xl">
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

          <div className="relative mt-10 aspect-[2/1] max-w-3xl overflow-hidden rounded-[6.4px] border border-[var(--line)]">
            <Image
              src="/images/zony.webp"
              alt="Mapa rozvozových zón Dal Birbante"
              fill
              className="object-contain bg-white"
              sizes="(max-width:768px) 100vw, 700px"
            />
          </div>

          <Button
            asChild
            className="btn-brand mt-8 h-11 px-6 hover:bg-[var(--brand-red-hover)]"
          >
            <a href={site.orderUrl} target="_blank" rel="noreferrer">
              {site.orderLabel}
            </a>
          </Button>

          <h2 className="mt-16 font-display text-2xl uppercase text-[var(--brand-red)]">
            {delivery.faqTitle}
          </h2>
          <div className="mt-6 space-y-6">
            {delivery.faqs.map((f) => (
              <div key={f.q} className="border-b border-[var(--line)] pb-5">
                <h3 className="font-display text-lg uppercase">{f.q}</h3>
                <p className="mt-2 text-[var(--muted)]">{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter content={content} />
    </>
  );
}
