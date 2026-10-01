import Image from "next/image";
import type { Metadata } from "next";
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
    title: content.site.pageMeta.menu.title,
    description: content.site.pageMeta.menu.description,
  };
}

export default async function MenuPage() {
  const content = await getContent();
  const { site, menuPage, menuCategories } = content;

  return (
    <>
      <PageJsonLd data={getPageSchema("menu", content)} />
      <SiteHeader content={content} />
      <main className="flex-1">
        <section className="page-wrap pb-12 pt-16 md:pb-16 md:pt-24">
          <Reveal>
            <h1 className="section-title text-[var(--brand-red)]">
              {menuPage.title}
            </h1>
            <p className="section-lead">{menuPage.intro}</p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button asChild className="btn-green">
                <a href={site.orderUrl} target="_blank" rel="noreferrer">
                  {site.orderLabel}
                </a>
              </Button>
              <p className="text-[var(--muted)]">{menuPage.orderNote}</p>
            </div>
          </Reveal>
        </section>

        <div className="page-wrap space-y-20 pb-28 md:space-y-28">
          {menuCategories.map((cat, i) => (
            <Reveal key={cat.id} delay={(i % 3) * 60}>
              <section id={cat.id}>
                <h2 className="border-b border-[var(--line)] pb-4 text-[var(--brand-red)]">
                  {cat.name}
                </h2>
                <ul className="mt-8 divide-y divide-[var(--line)]">
                  {cat.items.map((item) => (
                    <li
                      key={`${cat.id}-${item.name}`}
                      className="menu-row grid gap-4 py-8 sm:grid-cols-[auto_1fr_auto] sm:items-center"
                    >
                      {item.image ? (
                        <div className="img-zoom relative h-20 w-20 overflow-hidden rounded-[6.4px] sm:h-24 sm:w-24">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="img-zoom-media object-cover"
                            sizes="96px"
                          />
                        </div>
                      ) : (
                        <div className="hidden h-24 w-24 sm:block" />
                      )}
                      <div>
                        <h3>{item.name}</h3>
                        {item.description ? (
                          <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
                            {item.description}
                          </p>
                        ) : null}
                      </div>
                      <div className="flex shrink-0 flex-wrap items-center gap-8 sm:justify-end">
                        <p className="text-3xl font-black leading-none text-[var(--brand-red)] md:text-4xl">
                          {item.price}
                        </p>
                        <Button asChild className="btn-green">
                          <a
                            href={site.orderUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Objednat
                          </a>
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>
          ))}

          <Reveal>
            <section className="space-y-6 rounded-[6.4px] border border-[var(--line)] bg-[var(--paper-soft)] p-6 md:p-8">
              <div>
                <h2 className="text-[var(--brand-red)]">{menuPage.extrasTitle}</h2>
                <p className="mt-2 text-[var(--muted)]">{menuPage.extrasText}</p>
              </div>
              <p className="font-medium text-[var(--brand-green)]">
                {menuPage.glutenNote}
              </p>
              <div>
                <h2 className="text-[var(--brand-red)]">
                  {menuPage.allergensTitle}
                </h2>
                <p className="mt-2 text-[var(--muted)]">{menuPage.allergensText}</p>
              </div>
            </section>
          </Reveal>
        </div>
      </main>
      <SiteFooter content={content} />
    </>
  );
}
