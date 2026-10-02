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
import { getFaqSchema, getPageSchema } from "@/lib/schema";
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
      <SiteHeader content={content} />
      <main className="flex-1">
        <PageHero
          title={menuPage.title}
          image="/images/lifestyle-08.webp"
          imageAlt="Neapolská pizza Dal Birbante"
        />

        <section className="page-wrap pb-12 pt-16 md:pb-16 md:pt-24">
          <Reveal>
            <p className="max-w-none text-justify text-xl leading-relaxed text-[var(--muted)] md:text-2xl md:leading-relaxed">
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
                  {cat.items.map((item) => {
                    const drinkPlaceholder =
                      cat.id === "drinks" ? "/images/menu/drink-can.svg" : null;
                    const imageSrc = item.image || drinkPlaceholder;
                    return (
                    <li
                      key={`${cat.id}-${item.name}`}
                      className="menu-row grid gap-4 py-8 sm:grid-cols-[auto_1fr_auto] sm:items-center"
                    >
                      {imageSrc ? (
                        <div
                          className={`relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full sm:h-28 sm:w-28 ${
                            item.image ? "bg-[#f3f3f3]" : "bg-[#d9d9d9]"
                          }`}
                        >
                          {item.image ? (
                            <Image
                              src={imageSrc}
                              alt={item.name}
                              fill
                              className="object-cover"
                              sizes="112px"
                            />
                          ) : (
                            <Image
                              src="/images/menu/drink-can.svg"
                              alt=""
                              width={88}
                              height={88}
                              className="pointer-events-none h-[78%] w-[78%] select-none object-contain sm:h-[82%] sm:w-[82%]"
                              aria-hidden
                            />
                          )}
                        </div>
                      ) : (
                        <div
                          className="h-24 w-24 shrink-0 rounded-full bg-[#d9d9d9] sm:h-28 sm:w-28"
                          aria-hidden
                        />
                      )}
                      <div>
                        <h3 className="text-[1.85rem] leading-tight md:text-[2.35rem]">
                          {item.name}
                        </h3>
                        {item.description ? (
                          <p className="mt-2 text-xl leading-relaxed text-[var(--muted)] md:text-2xl">
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
            <section className="space-y-6 rounded-[6.4px] border border-[var(--line)] bg-[var(--paper-soft)] p-6 md:p-8">
              <div>
                <h2 className="text-[var(--brand-green)]">{menuPage.extrasTitle}</h2>
                <p className="mt-2 text-xl leading-relaxed text-[var(--muted)] md:text-2xl">
                  {menuPage.extrasText}
                </p>
              </div>
              <p className="text-xl font-medium text-[var(--brand-green)] md:text-2xl">
                {menuPage.glutenNote}
              </p>
              <div>
                <h2 className="text-[var(--brand-green)]">
                  {menuPage.allergensTitle}
                </h2>
                <p className="mt-2 text-xl leading-relaxed text-[var(--muted)] md:text-2xl">
                  {menuPage.allergensText}
                </p>
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
              <p className="text-xl text-[var(--muted)] md:text-2xl">
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
