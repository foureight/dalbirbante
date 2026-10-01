import Image from "next/image";
import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";

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

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: glutenFree.faqs.map((f) => ({
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
        <section className="page-wrap grid gap-14 py-24 md:grid-cols-2 md:gap-20 md:py-36">
          <div>
            <h1 className="section-title text-[var(--brand-red)]">
              {glutenFree.title}
            </h1>
            <p className="section-lead">{glutenFree.intro}</p>
            <p className="mt-6 text-[var(--muted)]">{glutenFree.intro2}</p>

            <h2 className="mt-14 font-display text-2xl uppercase text-[var(--brand-green)] md:text-3xl">
              {glutenFree.howTitle}
            </h2>
            <ul className="mt-6 space-y-4">
              {glutenFree.howItems.map((item) => (
                <li key={item} className="flex gap-4 text-[var(--ink)]">
                  <span className="mt-4 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand-red)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <Button
              asChild
              className="btn-brand mt-10 h-12 px-8 hover:bg-[var(--brand-red-hover)]"
            >
              <a href={site.phoneHref}>{site.callLabel}</a>
            </Button>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[6.4px]">
            <Image
              src="/images/burrata.webp"
              alt="Bezlepková pizza Dal Birbante Vinoř"
              fill
              className="object-cover"
              sizes="(max-width:768px) 100vw, 50vw"
            />
          </div>
        </section>

        <section className="border-t border-[var(--line)] bg-[var(--paper-soft)]">
          <div className="page-wrap space-y-10 py-24 md:py-32">
            {glutenFree.faqs.map((f) => (
              <div key={f.q} className="border-b border-[var(--line)] pb-8">
                <h2 className="font-display text-xl uppercase text-[var(--brand-red)] md:text-2xl">
                  {f.q}
                </h2>
                <p className="mt-4 text-[var(--muted)]">{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter content={content} />
    </>
  );
}
