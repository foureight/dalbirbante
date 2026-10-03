import { NextResponse } from "next/server";
import { getContent } from "@/lib/content";
import { formatPragueDate, isClosedDay } from "@/lib/opening-hours";

export const dynamic = "force-dynamic";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept",
  "Cache-Control": "public, max-age=60, s-maxage=60",
};

/** CORS preflight for other websites reading the feed. */
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

/**
 * Public JSON feed for other websites / tools.
 * GET https://…/api/public/daily
 */
export async function GET() {
  const content = await getContent({ orphans: true });
  const { site, daily, nav } = content;

  return NextResponse.json(
    {
      brand: site.brandName,
      siteUrl: site.siteUrl,
      phone: site.phone,
      hours: site.hours,
      hoursClosed: site.hoursClosed,
      closedToday: isClosedDay(),
      date: formatPragueDate(),
      servingHours: daily.hours,
      title: daily.title,
      intro: daily.intro,
      note: daily.note,
      pageUrl: `${site.siteUrl.replace(/\/$/, "")}/denni-nabidka`,
      items: (daily.items || []).map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        description: item.description,
        note: item.note,
        emoji: item.emoji,
        category: item.category,
      })),
      links: {
        menu: `${site.siteUrl.replace(/\/$/, "")}/menu`,
        daily: `${site.siteUrl.replace(/\/$/, "")}/denni-nabidka`,
        order: site.orderUrl,
        nav,
      },
    },
    { headers: corsHeaders },
  );
}
