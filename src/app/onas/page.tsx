import Image from "next/image";
import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

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
      <SiteHeader content={content} />
      <main className="flex-1">
        <section className="relative min-h-[40vh] overflow-hidden text-white">
          <Image
            src="/images/lifestyle-onas.webp"
            alt="O nás Dal Birbante"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative mx-auto flex min-h-[48vh] max-w-6xl items-end px-5 pb-16 md:px-10 md:pb-20">
            <h1 className="font-display text-5xl uppercase md:text-6xl">
              {about.title}
            </h1>
          </div>
        </section>

        <section className="page-wrap grid gap-16 py-24 md:grid-cols-[1.1fr_0.9fr] md:gap-20 md:py-36">
          <div>
            <p className="font-display text-2xl leading-snug text-[var(--brand-green)] md:text-3xl">
              {about.lead}
            </p>
            <div className="mt-10 space-y-7 text-[var(--muted)]">
              {about.paragraphs.map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[6.4px] md:mt-4">
            <Image
              src="/images/lifestyle-01.webp"
              alt="Interiér a pizza Dal Birbante"
              fill
              className="object-cover"
              sizes="(max-width:768px) 100vw, 40vw"
            />
          </div>
        </section>
      </main>
      <SiteFooter content={content} />
    </>
  );
}
