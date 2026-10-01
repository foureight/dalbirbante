import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  createSessionToken,
  getAdminPassword,
  isAdminAuthenticated,
} from "@/lib/auth";
import { getContent, saveContent } from "@/lib/content";
import type { SiteContent } from "@/lib/types";

export async function GET() {
  const content = await getContent({ orphans: false });
  return NextResponse.json(content);
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Nejste přihlášeni." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as SiteContent;
    if (!body?.site?.brandName) {
      return NextResponse.json({ error: "Neplatný obsah." }, { status: 400 });
    }
    await saveContent(body);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Uložení selhalo." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = (await request.json()) as { password?: string; action?: string };

  if (body.action === "logout") {
    const res = NextResponse.json({ ok: true });
    res.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
    return res;
  }

  if (body.password !== getAdminPassword()) {
    return NextResponse.json({ error: "Špatné heslo." }, { status: 401 });
  }

  const token = await createSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
