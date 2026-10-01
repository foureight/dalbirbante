import { createHmac, timingSafeEqual } from "crypto";

const TTL_MS = 1000 * 60 * 20; // 20 minut

function secret() {
  return (
    process.env.CAPTCHA_SECRET ||
    process.env.ADMIN_SECRET ||
    "dal-birbante-captcha-dev-secret"
  );
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

export type CaptchaChallenge = {
  a: number;
  b: number;
  token: string;
  question: string;
};

/** Jednoduchá matematická captcha podepsaná HMAC (bez externí služby). */
export function createMathCaptcha(): CaptchaChallenge {
  const a = 2 + Math.floor(Math.random() * 8); // 2–9
  const b = 1 + Math.floor(Math.random() * 8); // 1–8
  const exp = Date.now() + TTL_MS;
  const answer = a + b;
  const payload = `${a}:${b}:${answer}:${exp}`;
  const token = `${exp}.${sign(payload)}`;
  return {
    a,
    b,
    token,
    question: `Kolik je ${a} + ${b}?`,
  };
}

export function verifyMathCaptcha(input: {
  token?: string;
  answer?: string | number;
  a?: number;
  b?: number;
}) {
  const token = String(input.token || "");
  const answerRaw = String(input.answer ?? "").trim();
  const a = Number(input.a);
  const b = Number(input.b);

  if (!token || !answerRaw || Number.isNaN(a) || Number.isNaN(b)) {
    return { ok: false as const, error: "Vyplňte kontrolní otázku." };
  }

  const answer = Number(answerRaw.replace(",", "."));
  if (!Number.isFinite(answer)) {
    return { ok: false as const, error: "Neplatná odpověď na kontrolní otázku." };
  }

  const [expStr, sig] = token.split(".");
  const exp = Number(expStr);
  if (!expStr || !sig || Number.isNaN(exp)) {
    return { ok: false as const, error: "Neplatná captcha. Obnovte stránku." };
  }
  if (Date.now() > exp) {
    return {
      ok: false as const,
      error: "Captcha vypršela. Obnovte stránku a zkuste znovu.",
    };
  }

  const expectedAnswer = a + b;
  const payload = `${a}:${b}:${expectedAnswer}:${exp}`;
  const expectedSig = sign(payload);
  const left = Buffer.from(sig);
  const right = Buffer.from(expectedSig);
  if (left.length !== right.length || !timingSafeEqual(left, right)) {
    return { ok: false as const, error: "Neplatná captcha. Obnovte stránku." };
  }

  if (answer !== expectedAnswer) {
    return { ok: false as const, error: "Špatná odpověď na kontrolní otázku." };
  }

  return { ok: true as const };
}
