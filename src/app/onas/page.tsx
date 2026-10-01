import Image from "next/image";
import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageJsonLd } from "@/components/json-ld";
import { Reveal } from "@/components/reveal";
import { getPageSchema } from "@/lib/schema";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContent();
  return {
    title: content.site.pageMeta.about.title,
    description: content.site.pageMeta.about.description,
  };
}

export default async function AboutPage() {
  const content = await getContent();
  const { about } = content;

  return (
    <>
      <PageJsonLd data={getPageSchema("about", content)} />
      <SiteHeader content={content} />
      <main className="flex-1">
        <section className="relative min-h-[40vh] overflow-hidden text-white">
          <Image
            src="/images/lifestyle-onas.webp"
            alt="O nás Dal Birbante"
            fill
            priority
            className="hero-pan object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative mx-auto flex min-h-[48vh] max-w-6xl items-end px-5 pb-16 md:px-10 md:pb-20">
            <h1 className="animate-rise-delay text-white">{about.title}</h1>
          </div>
        </section>

        <section className="page-wrap grid gap-16 py-24 md:grid-cols-[1.1fr_0.9fr] md:gap-20 md:py-36">
          <Reveal>
            <h2 className="leading-snug text-[var(--brand-green)]">
              {about.lead}
            </h2>
            <div className="mt-10 space-y-7 text-[var(--muted)]">
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
      </main>
      <SiteFooter content={content} />
    </>
  );
}
