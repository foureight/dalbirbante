import Image from "next/image";
import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ReservoMap } from "@/components/reservo-map";
import { ContactForm } from "@/components/contact-form";
import { PageJsonLd } from "@/components/json-ld";
import { Reveal } from "@/components/reveal";
import { getPageSchema } from "@/lib/schema";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContent();
  return buildPageMetadata(content, {
    path: "/kontakt",
    title: content.site.pageMeta.contact.title,
    description: content.site.pageMeta.contact.description,
  });
}

export default async function ContactPage() {
  const content = await getContent();
  const { site, contact } = content;

  return (
    <>
      <PageJsonLd data={getPageSchema("contact", content)} />
      <SiteHeader content={content} />
      <main className="flex-1">
        <section className="relative min-h-[34vh] overflow-hidden text-white sm:min-h-[40vh]">
          <Image
            src="/images/kontakt-bg.webp"
            alt=""
            fill
            priority
            className="hero-pan object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/45 to-black/25" />
          <div className="site-max relative mx-auto flex min-h-[38vh] w-full flex-col justify-end px-4 pb-10 sm:min-h-[48vh] sm:px-5 sm:pb-14 md:px-10 md:pb-20">
            <h1 className="animate-rise-delay text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]">
              {contact.title}
            </h1>
            <p className="animate-rise-delay-2 mt-3 max-w-3xl text-[0.98rem] leading-relaxed text-white/90 sm:mt-5 sm:text-[length:inherit]">
              {contact.lead}
            </p>
            <p className="animate-rise-delay-2 mt-2 max-w-3xl text-[0.92rem] leading-relaxed text-white/80 sm:mt-3 sm:text-[length:inherit]">
              {contact.openText}
            </p>
          </div>
        </section>

        <section className="page-wrap py-12 md:py-36">
          <div className="grid items-start gap-10 md:grid-cols-2 md:gap-20">
            <Reveal>
              <div className="space-y-8 md:space-y-12">
                <div>
                  <h2 className="text-[var(--brand-green)]">{contact.hoursTitle}</h2>
                  <p className="mt-3 text-base leading-relaxed text-[var(--muted)]">
                    {site.hours}
                    <br />
                    {site.hoursClosed}
                  </p>
                </div>
                <div>
                  <h2 className="text-[var(--brand-green)]">{contact.whereTitle}</h2>
                  <p className="mt-3 text-base leading-relaxed text-[var(--muted)]">
                    {site.address}
                  </p>
                  <p className="mt-2">
                    <a
                      href={site.phoneHref}
                      className="text-[var(--brand-red)] hover:underline"
                    >
                      {site.phone}
                    </a>
                  </p>
                  <p>
                    <a
                      href={`mailto:${site.email}`}
                      className="text-[var(--brand-red)] hover:underline"
                    >
                      {site.email}
                    </a>
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={120} variant="scale">
              <div className="space-y-4 md:space-y-6 md:-mt-2">
                <h2 className="text-[var(--brand-green)]">{contact.mapTitle}</h2>
                <ReservoMap
                  src={site.mapEmbedUrl}
                  title={contact.mapTitle}
                  className="rounded-[6.4px]"
                />
              </div>
            </Reveal>
          </div>

          <Reveal delay={80}>
            <div className="mt-12 max-w-3xl md:mt-28">
              <h2 className="mb-3 text-[var(--brand-green)] md:mb-4">
                {contact.formTitle}
              </h2>
              <p className="mb-6 text-base leading-relaxed text-[var(--muted)] md:mb-8">
                {contact.formLead}
              </p>
              <ContactForm content={content} />
            </div>
          </Reveal>
        </section>
      </main>
      <SiteFooter content={content} />
    </>
  );
}
