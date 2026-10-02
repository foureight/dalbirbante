import Image from "next/image";
import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { PageHero } from "@/components/page-hero";
import { PageJsonLd } from "@/components/json-ld";
import { FaqAccordion } from "@/components/faq-accordion";
import { Reveal } from "@/components/reveal";
import {
  getBreadcrumbSchema,
  getFaqSchema,
  getPageSchema,
} from "@/lib/schema";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContent();
  return buildPageMetadata(content, {
    path: "/menu",
    title: content.site.pageMeta.menu.title,
    description: content.site.pageMeta.menu.description,
    image: "/images/lifestyle-08.webp",
  });
}

export default async function MenuPage() {
  const content = await getContent();
  const { site, menuPage, menuCategories } = content;

  return (
    <>
      <PageJsonLd data={getPageSchema("menu", content)} />
      <PageJsonLd
        data={getFaqSchema(
          "https://www.dalbirbante.cz/menu#faq",
          menuPage.faqs,
        )}
      />
      <PageJsonLd
        data={getBreadcrumbSchema([
          { name: "Domů", path: "/" },
          { name: "Menu", path: "/menu" },
        ])}
      />
      <SiteHeader content={content} />
      <main className="flex-1">
        <PageHero
          title={menuPage.title}
          image="/images/lifestyle-08.webp"
          imageAlt="Neapolská pizza Dal Birbante"
        />

        <section className="page-wrap space-y-5 pb-8 pt-10 md:space-y-6 md:pb-16 md:pt-24">
          <Reveal>
            <p className="max-w-none text-left text-base leading-relaxed text-[var(--muted)] sm:text-lg md:text-2xl md:leading-relaxed">
              {menuPage.intro}
            </p>
          </Reveal>
          <Reveal delay={60}>
            <p className="rounded-[6.4px] border border-[var(--brand-green)]/25 bg-[var(--brand-green)]/8 px-4 py-3 text-left text-base font-medium leading-relaxed text-[var(--brand-green-deep)] sm:px-5 sm:py-4 sm:text-lg md:text-xl">
              {menuPage.doughChoiceNote}{" "}
              <a
                href="/bezlepkova-pizza-vinor"
                className="underline decoration-[var(--brand-green)] underline-offset-4 transition hover:opacity-80"
              >
                Více o bezlepkové nabídce
              </a>
            </p>
          </Reveal>
        </section>

        <div className="page-wrap space-y-14 pb-20 md:space-y-28 md:pb-28">
          {menuCategories.map((cat, i) => (
            <Reveal key={cat.id} delay={(i % 3) * 60}>
              <section id={cat.id}>
                <h2 className="border-b border-[var(--line)] pb-3 text-[var(--brand-green)] md:pb-4">
                  {cat.name}
                </h2>
                <ul className="mt-5 divide-y divide-[var(--line)] md:mt-8">
                  {cat.items.map((item) => {
                    const drinkPlaceholder =
                      cat.id === "drinks" ? "/images/menu/drink-can.svg" : null;
                    const imageSrc = item.image || drinkPlaceholder;
                    return (
                    <li
                      key={`${cat.id}-${item.name}`}
                      className="menu-row grid grid-cols-[4.5rem_1fr] items-start gap-x-3 gap-y-3 py-5 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-4 sm:py-8"
                    >
                      {imageSrc ? (
                        <div
                          className={`relative col-start-1 row-span-2 flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center overflow-hidden rounded-full sm:row-span-1 sm:h-28 sm:w-28 ${
                            item.image ? "bg-[#f3f3f3]" : "bg-[#d9d9d9]"
                          }`}
                        >
                          {item.image ? (
                            <Image
                              src={imageSrc}
                              alt={item.name}
                              fill
                              className={
                                cat.id === "drinks"
                                  ? "object-contain p-2 sm:p-3"
                                  : "object-cover"
                              }
                              sizes="112px"
                            />
                          ) : (
                            <Image
                              src="/images/menu/drink-can.svg"
                              alt=""
                              fill
                              className="object-contain p-4 sm:p-6"
                              sizes="112px"
                              aria-hidden
                            />
                          )}
                        </div>
                      ) : (
                        <div
                          className="col-start-1 row-span-2 h-[4.5rem] w-[4.5rem] shrink-0 rounded-full bg-[#d9d9d9] sm:row-span-1 sm:h-28 sm:w-28"
                          aria-hidden
                        />
                      )}
                      <div className="min-w-0 col-start-2">
                        <h3 className="text-[1.35rem] leading-tight sm:text-[1.85rem] md:text-[2.35rem]">
                          {item.name}
                        </h3>
                        {item.description ? (
                          <p className="mt-1 text-sm leading-snug text-[var(--muted)] sm:mt-2 sm:text-xl sm:leading-relaxed md:text-2xl">
                            {item.description}
                          </p>
                        ) : null}
                      </div>
                      <div className="col-span-2 flex items-center justify-between gap-3 sm:col-span-1 sm:col-start-3 sm:justify-end sm:gap-8">
                        <p className="text-2xl font-black leading-none text-[var(--brand-red)] sm:text-3xl md:text-4xl">
                          {item.price}
                        </p>
                        <AddToCartButton
                          name={item.name}
                          price={item.price}
                          image={item.image || drinkPlaceholder || undefined}
                          categoryId={cat.id}
                        />
                      </div>
                    </li>
                    );
                  })}
                </ul>
              </section>
            </Reveal>
          ))}

          <Reveal>
            <section className="space-y-5 rounded-[6.4px] border border-[var(--line)] bg-[var(--paper-soft)] p-4 sm:p-6 md:space-y-6 md:p-8">
              <div>
                <h2 className="text-[var(--brand-green)]">{menuPage.extrasTitle}</h2>
                <p className="mt-2 text-base leading-relaxed text-[var(--muted)] md:text-2xl">
                  {menuPage.extrasText}
                </p>
              </div>
              <p className="text-base font-medium leading-relaxed text-[var(--brand-green)] md:text-2xl">
                {menuPage.glutenNote}
              </p>
              <div>
                <h2 className="text-[var(--brand-green)]">
                  {menuPage.allergensTitle}
                </h2>
                <p className="mt-2 text-base leading-relaxed text-[var(--muted)] md:text-2xl">
                  {menuPage.allergensText}
                </p>
              </div>
            </section>
          </Reveal>

          <Reveal delay={80}>
            <div className="flex flex-col items-stretch gap-4 sm:items-start sm:gap-5">
              <a
                href={site.orderUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-green w-full sm:w-auto"
              >
                {site.orderLabel}
              </a>
              <p className="text-base leading-relaxed text-[var(--muted)] md:text-2xl">
                {menuPage.orderNote}
              </p>
            </div>
          </Reveal>
        </div>

        <section
          id="faq"
          className="w-full border-t border-[var(--line)] bg-[var(--paper-soft)] px-5 py-16 md:px-10 md:py-24"
        >
          <div className="site-max mx-auto w-full">
            <Reveal className="pointer-events-auto">
              <h2 className="text-[var(--brand-green)]">{menuPage.faqTitle}</h2>
              <FaqAccordion items={menuPage.faqs} />
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter content={content} />
    </>
  );
}
