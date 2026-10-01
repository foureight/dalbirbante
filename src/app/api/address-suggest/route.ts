import { NextResponse } from "next/server";
import { suggestAddresses } from "@/lib/address-suggest";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = String(searchParams.get("q") || "");
  const suggestions = await suggestAddresses(q);
  return NextResponse.json({ suggestions });
}
