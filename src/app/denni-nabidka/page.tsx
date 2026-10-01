import type { Metadata } from "next";
import Link from "next/link";
import { getContent } from "@/lib/content";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { PageJsonLd } from "@/components/json-ld";
import { Reveal } from "@/components/reveal";
import { getPageSchema } from "@/lib/schema";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContent();
  return {
    title: content.site.pageMeta.daily.title,
    description: content.site.pageMeta.daily.description,
  };
}

export default async function DailyMenuPage() {
  const content = await getContent();
  const { site, daily } = content;

  return (
    <>
      <PageJsonLd data={getPageSchema("daily", content)} />
      <SiteHeader content={content} />
      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-5 py-24 md:px-10 md:py-36">
          <Reveal>
            <h1 className="section-title text-[var(--brand-red)]">{daily.title}</h1>
            <p className="section-lead">{daily.intro}</p>
            <p className="mt-8 text-[var(--muted)]">{daily.note}</p>
            <div className="mt-12 flex flex-wrap gap-4">
              <Button asChild className="btn-brand">
                <a href={site.phoneHref}>{site.callLabel}</a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full px-[2.2rem] py-[1.5rem] text-[1.3rem] font-extrabold uppercase"
              >
                <Link href="/menu">{content.nav.menu}</Link>
              </Button>
            </div>
          </Reveal>
        </section>
      </main>
      <SiteFooter content={content} />
    </>
  );
}
