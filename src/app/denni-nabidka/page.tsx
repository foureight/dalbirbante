import type { Metadata } from "next";
import Link from "next/link";
import { getContent } from "@/lib/content";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";

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
      <SiteHeader content={content} />
      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
          <h1 className="section-title text-[var(--brand-red)]">{daily.title}</h1>
          <p className="section-lead">{daily.intro}</p>
          <p className="mt-6 text-[var(--muted)]">{daily.note}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button
              asChild
              className="btn-brand h-11 px-6 hover:bg-[var(--brand-red-hover)]"
            >
              <a href={site.phoneHref}>{site.callLabel}</a>
            </Button>
            <Button asChild variant="outline" className="h-11 rounded-[6.4px]">
              <Link href="/menu">{content.nav.menu}</Link>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter content={content} />
    </>
  );
}
