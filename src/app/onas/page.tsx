import Image from "next/image";
import { getContent } from "@/lib/content";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default async function AboutPage() {
  const content = await getContent();
  const { site, about } = content;

  return (
    <>
      <SiteHeader content={content} />
      <main className="flex-1 pt-24">
        <section className="relative min-h-[42vh] overflow-hidden text-white">
          <Image
            src="/images/lifestyle-onas.webp"
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[var(--ink)]/55" />
          <div className="relative mx-auto flex min-h-[42vh] max-w-6xl items-end px-4 pb-12 md:px-6">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-white/70">
                {site.brandName}
              </p>
              <h1 className="mt-2 font-display text-5xl md:text-6xl">
                {about.title}
              </h1>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-12 px-4 py-16 md:grid-cols-[1.1fr_0.9fr] md:px-6 md:py-24">
          <div>
            <p className="font-display text-2xl leading-snug text-[var(--forest)] md:text-3xl">
              {about.lead}
            </p>
            <div className="mt-8 space-y-5 text-base leading-relaxed text-[var(--muted)] md:text-lg">
              {about.paragraphs.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden md:mt-8">
            <Image
              src="/images/lifestyle-01.webp"
              alt="Interiér a pizza"
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
