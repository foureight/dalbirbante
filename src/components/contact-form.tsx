"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { SiteContent } from "@/lib/types";

type CaptchaState = {
  a: number;
  b: number;
  token: string;
  question: string;
};

export function ContactForm({ content }: { content: SiteContent }) {
  const { contact, site } = content;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [captcha, setCaptcha] = useState<CaptchaState | null>(null);
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  const loadCaptcha = useCallback(async () => {
    try {
      const res = await fetch("/api/captcha", { cache: "no-store" });
      const data = (await res.json()) as CaptchaState;
      setCaptcha(data);
      setCaptchaAnswer("");
    } catch {
      setCaptcha(null);
    }
  }, []);

  useEffect(() => {
    loadCaptcha();
  }, [loadCaptcha]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          website,
          captchaToken: captcha?.token,
          captchaAnswer,
          captchaA: captcha?.a,
          captchaB: captcha?.b,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };

      if (!res.ok || !data.ok) {
        setStatus("error");
        setError(data.error || "Odeslání se nepovedlo.");
        loadCaptcha();
        return;
      }

      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
      setWebsite("");
      loadCaptcha();
    } catch {
      setStatus("error");
      setError(
        "Odeslání se nepovedlo. Zkontrolujte připojení a\u00A0zkuste znovu.",
      );
      loadCaptcha();
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="relative space-y-7 rounded-[6.4px] border border-[var(--line)] bg-[var(--paper-soft)] p-6 md:space-y-8 md:p-10"
    >
      <div className="space-y-3">
        <Label htmlFor="name" className="text-base md:text-lg">
          {contact.formNameLabel}
        </Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="h-14 rounded-[6.4px] border-[var(--line)] bg-white px-4 text-[23px] leading-[38px] md:h-16 md:text-[23px]"
        />
      </div>
      <div className="space-y-3">
        <Label htmlFor="email" className="text-base md:text-lg">
          {contact.formEmailLabel}
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="h-14 rounded-[6.4px] border-[var(--line)] bg-white px-4 text-[23px] leading-[38px] md:h-16 md:text-[23px]"
        />
      </div>
      <div className="space-y-3">
        <Label htmlFor="message" className="text-base md:text-lg">
          {contact.formMessageLabel}
        </Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={8}
          className="min-h-48 rounded-[6.4px] border-[var(--line)] bg-white px-4 py-4 text-[23px] leading-[38px] md:min-h-56 md:text-[23px]"
        />
      </div>

      {/* Honeypot — skryté pro lidi */}
      <div className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden" aria-hidden>
        <Label htmlFor="website">Web</Label>
        <Input
          id="website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="captcha" className="text-base md:text-lg">
          {captcha?.question || "Kontrolní otázka"}
        </Label>
        <div className="flex flex-wrap items-center gap-3">
          <Input
            id="captcha"
            inputMode="numeric"
            autoComplete="off"
            value={captchaAnswer}
            onChange={(e) => setCaptchaAnswer(e.target.value)}
            required
            placeholder="Výsledek"
            className="h-14 w-40 rounded-[6.4px] border-[var(--line)] bg-white px-4 text-[23px] leading-[38px] md:h-16 md:text-[23px]"
          />
          <button
            type="button"
            onClick={loadCaptcha}
            className="text-sm font-semibold text-[var(--brand-green)] underline underline-offset-2"
          >
            Nová otázka
          </button>
        </div>
        <p className="text-sm text-[var(--muted)]">
          Ochrana proti spamu — spočítejte prosím výsledek.
        </p>
      </div>

      <Button
        type="submit"
        className="btn-brand"
        disabled={status === "loading" || !captcha}
      >
        {status === "loading" ? "Odesílám…" : contact.formSubmit}
      </Button>
      <p className="text-sm leading-snug text-[var(--muted)] md:text-[15px]">
        {contact.formHint}{" "}
        <a
          href={`mailto:${site.email}`}
          className="underline underline-offset-2 transition hover:text-[var(--brand-red)]"
        >
          {site.email}
        </a>
        .
      </p>
      {status === "success" && (
        <p className="text-[var(--brand-green)]">{contact.formSuccess}</p>
      )}
      {status === "error" && (
        <p className="text-[var(--brand-red)]">{error}</p>
      )}
    </form>
  );
}
