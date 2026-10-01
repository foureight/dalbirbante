import Image from "next/image";
import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ReservoMap } from "@/components/reservo-map";
import { ContactForm } from "@/components/contact-form";

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
      <SiteHeader content={content} />
      <main className="flex-1">
        <section className="relative overflow-hidden text-white">
          <div className="absolute inset-0">
            <Image
              src="/images/kontakt-bg.webp"
              alt=""
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/60" />
          </div>
          <div className="relative mx-auto max-w-6xl px-5 py-24 md:px-10 md:py-36">
            <h1 className="text-white">{contact.title}</h1>
            <p className="mt-8 max-w-xl text-white/90">{contact.lead}</p>
            <p className="mt-5 max-w-xl text-white/80">{contact.openText}</p>
          </div>
        </section>

        <section className="page-wrap py-24 md:py-36">
          <div className="grid items-start gap-16 md:grid-cols-2 md:gap-20">
            <div className="space-y-12">
              <div>
                <h2 className="text-[var(--brand-red)]">{contact.hoursTitle}</h2>
                <p className="mt-3 text-[var(--muted)]">
                  {site.hours}
                  <br />
                  {site.hoursClosed}
                </p>
              </div>
              <div>
                <h2 className="text-[var(--brand-red)]">{contact.whereTitle}</h2>
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

            <div className="space-y-6 md:-mt-2">
              <h2 className="text-[var(--brand-red)]">{contact.mapTitle}</h2>
              <ReservoMap
                src={site.mapEmbedUrl}
                title={contact.mapTitle}
                className="rounded-[6.4px]"
              />
            </div>
          </div>

          <div className="mt-20 max-w-3xl md:mt-28">
            <h2 className="mb-4 text-[var(--brand-red)]">{contact.formTitle}</h2>
            <p className="mb-8 text-[var(--muted)]">{contact.formLead}</p>
            <ContactForm content={content} />
          </div>
        </section>
      </main>
      <SiteFooter content={content} />
    </>
  );
}
