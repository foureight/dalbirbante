import Image from "next/image";
import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { PageHero } from "@/components/page-hero";
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
        <PageHero
          title={menuPage.title}
          image="/images/lifestyle-08.webp"
          imageAlt="Neapolská pizza Dal Birbante"
        />

        <section className="page-wrap pb-12 pt-16 md:pb-16 md:pt-24">
          <Reveal>
            <p className="max-w-none text-justify text-[var(--muted)]">
              {menuPage.intro}
            </p>
          </Reveal>
        </section>

        <div className="page-wrap space-y-20 pb-28 md:space-y-28">
          {menuCategories.map((cat, i) => (
            <Reveal key={cat.id} delay={(i % 3) * 60}>
              <section id={cat.id}>
                <h2 className="border-b border-[var(--line)] pb-4 text-[var(--brand-green)]">
                  {cat.name}
                </h2>
                <ul className="mt-8 divide-y divide-[var(--line)]">
                  {cat.items.map((item) => (
                    <li
                      key={`${cat.id}-${item.name}`}
                      className="menu-row grid gap-4 py-8 sm:grid-cols-[auto_1fr_auto] sm:items-center"
                    >
                      {item.image ? (
                        <div className="relative h-20 w-20 sm:h-24 sm:w-24">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-contain"
                            sizes="96px"
                          />
                        </div>
                      ) : (
                        <div
                          className="h-20 w-20 shrink-0 rounded-full bg-[#d9d9d9] sm:h-24 sm:w-24"
                          aria-hidden
                        />
                      )}
                      <div>
                        <h3>{item.name}</h3>
                        {item.description ? (
                          <p className="mt-1 leading-relaxed text-[var(--muted)]">
                            {item.description}
                          </p>
                        ) : null}
                      </div>
                      <div className="flex shrink-0 flex-wrap items-center gap-8 sm:justify-end">
                        <p className="text-3xl font-black leading-none text-[var(--brand-red)] md:text-4xl">
                          {item.price}
                        </p>
                        <AddToCartButton
                          name={item.name}
                          price={item.price}
                          image={item.image}
                          categoryId={cat.id}
                        />
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
                <h2 className="text-[var(--brand-green)]">{menuPage.extrasTitle}</h2>
                <p className="mt-2 text-[var(--muted)]">{menuPage.extrasText}</p>
              </div>
              <p className="font-medium text-[var(--brand-green)]">
                {menuPage.glutenNote}
              </p>
              <div>
                <h2 className="text-[var(--brand-green)]">
                  {menuPage.allergensTitle}
                </h2>
                <p className="mt-2 text-[var(--muted)]">{menuPage.allergensText}</p>
              </div>
            </section>
          </Reveal>

          <Reveal delay={80}>
            <div className="flex flex-col items-start gap-5">
              <a
                href={site.orderUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-green"
              >
                {site.orderLabel}
              </a>
              <p className="text-[var(--muted)]">{menuPage.orderNote}</p>
            </div>
          </Reveal>
        </div>
      </main>
      <SiteFooter content={content} />
    </>
  );
}
