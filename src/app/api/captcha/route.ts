import { NextResponse } from "next/server";
import { createMathCaptcha } from "@/lib/captcha";

export const dynamic = "force-dynamic";

export async function GET() {
  const challenge = createMathCaptcha();
  return NextResponse.json({
    a: challenge.a,
    b: challenge.b,
    token: challenge.token,
    question: challenge.question,
  });
}
