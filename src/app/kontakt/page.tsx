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

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContent();
  return {
    title: content.site.pageMeta.contact.title,
    description: content.site.pageMeta.contact.description,
  };
}

export default async function ContactPage() {
  const content = await getContent();
  const { site, contact } = content;

  return (
    <>
      <PageJsonLd data={getPageSchema("contact", content)} />
      <SiteHeader content={content} />
      <main className="flex-1">
        <section className="relative min-h-[40vh] overflow-hidden text-white">
          <Image
            src="/images/kontakt-bg.webp"
            alt=""
            fill
            priority
            className="hero-pan object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="site-max relative mx-auto flex min-h-[48vh] w-full flex-col justify-end px-5 pb-16 md:px-10 md:pb-20">
            <h1 className="animate-rise-delay text-white">{contact.title}</h1>
            <p className="animate-rise-delay-2 mt-6 max-w-3xl text-white/90">
              {contact.lead}
            </p>
            <p className="animate-rise-delay-2 mt-4 max-w-3xl text-white/80">
              {contact.openText}
            </p>
          </div>
        </section>

        <section className="page-wrap py-24 md:py-36">
          <div className="grid items-start gap-16 md:grid-cols-2 md:gap-20">
            <Reveal>
              <div className="space-y-12">
                <div>
                  <h2 className="text-[var(--brand-green)]">{contact.hoursTitle}</h2>
                  <p className="mt-3 text-[var(--muted)]">
                    {site.hours}
                    <br />
                    {site.hoursClosed}
                  </p>
                </div>
                <div>
                  <h2 className="text-[var(--brand-green)]">{contact.whereTitle}</h2>
                  <p className="mt-3 text-[var(--muted)]">{site.address}</p>
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
              <div className="space-y-6 md:-mt-2">
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
            <div className="mt-20 max-w-3xl md:mt-28">
              <h2 className="mb-4 text-[var(--brand-green)]">{contact.formTitle}</h2>
              <p className="mb-8 text-[var(--muted)]">{contact.formLead}</p>
              <ContactForm content={content} />
            </div>
          </Reveal>
        </section>
      </main>
      <SiteFooter content={content} />
    </>
  );
}
