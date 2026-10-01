import Image from "next/image";
import { getContent } from "@/lib/content";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ReservoMap } from "@/components/reservo-map";
import { ContactForm } from "@/components/contact-form";

export default async function ContactPage() {
  const content = await getContent();
  const { site, contact, delivery } = content;

  return (
    <>
      <SiteHeader content={content} />
      <main className="flex-1 pt-24">
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
            <div className="absolute inset-0 bg-[var(--ink)]/65" />
          </div>
          <div className="relative mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
            <p className="text-xs uppercase tracking-[0.24em] text-white/70">
              {site.brandName}
            </p>
            <h1 className="mt-2 font-display text-5xl md:text-6xl">
              {contact.title}
            </h1>
            <p className="mt-4 max-w-xl text-white/80">{contact.lead}</p>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-12 px-4 py-16 md:grid-cols-2 md:px-6 md:py-20">
          <div className="space-y-8">
            <div>
              <h2 className="font-display text-2xl">{contact.hoursTitle}</h2>
              <p className="mt-3 text-[var(--muted)]">
                {site.hours}
                <br />
                {site.hoursClosed}
              </p>
            </div>
            <div>
              <h2 className="font-display text-2xl">Adresa</h2>
              <p className="mt-3 text-[var(--muted)]">{site.address}</p>
              <p className="mt-2">
                <a
                  href={site.phoneHref}
                  className="text-[var(--accent)] hover:underline"
                >
                  {site.phone}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${site.email}`}
                  className="text-[var(--accent)] hover:underline"
                >
                  {site.email}
                </a>
              </p>
            </div>
            <div>
              <h2 className="mb-4 font-display text-2xl">
                {contact.formTitle}
              </h2>
              <ContactForm content={content} />
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="font-display text-2xl">{contact.mapTitle}</h2>
            <ReservoMap src={site.mapEmbedUrl} title={contact.mapTitle} />
            <p className="text-sm text-[var(--muted)]">
              Mapa převzatá z Reservo – {site.address}
            </p>
          </div>
        </section>

        <section className="border-t border-[var(--line)] bg-white/40">
          <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
            <h2 className="section-title">{delivery.title}</h2>
            <p className="section-lead">{delivery.intro}</p>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--line)] text-[var(--muted)]">
                    <th className="py-3 font-medium">Zóna</th>
                    <th className="py-3 font-medium">Oblasti</th>
                    <th className="py-3 font-medium">Rozvoz</th>
                    <th className="py-3 font-medium">Min. objednávka</th>
                  </tr>
                </thead>
                <tbody>
                  {delivery.zones.map((z) => (
                    <tr key={z.name} className="border-b border-[var(--line)]">
                      <td className="py-3 font-medium">{z.name}</td>
                      <td className="py-3 text-[var(--muted)]">{z.areas}</td>
                      <td className="py-3">{z.fee}</td>
                      <td className="py-3">{z.min}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="relative mt-10 aspect-[2/1] max-w-3xl overflow-hidden border border-[var(--line)]">
              <Image
                src="/images/zony.webp"
                alt="Mapa rozvozových zón"
                fill
                className="object-contain bg-white"
                sizes="(max-width:768px) 100vw, 700px"
              />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter content={content} />
    </>
  );
}
