import { NextResponse } from "next/server";
import { isSmtpConfigured, sendContactEmail } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      message?: string;
    };

    const name = body.name?.trim() || "";
    const email = body.email?.trim() || "";
    const message = body.message?.trim() || "";

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Vyplňte všechna pole." },
        { status: 400 },
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Zadejte platný e-mail." },
        { status: 400 },
      );
    }

    if (!isSmtpConfigured()) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "SMTP zatím není nastavené. Doplňte SMTP_HOST, SMTP_USER, SMTP_PASS a CONTACT_TO v .env.local.",
        },
        { status: 503 },
      );
    }

    await sendContactEmail({ name, email, message });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("contact form error", error);
    return NextResponse.json(
      { ok: false, error: "Odeslání se nepovedlo. Zkuste to prosím znovu." },
      { status: 500 },
    );
  }
}
