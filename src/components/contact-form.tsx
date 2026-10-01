"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { SiteContent } from "@/lib/types";

export function ContactForm({ content }: { content: SiteContent }) {
  const { contact } = content;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };

      if (!res.ok || !data.ok) {
        setStatus("error");
        setError(data.error || "Odeslání se nepovedlo.");
        return;
      }

      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
      setError("Odeslání se nepovedlo. Zkontrolujte připojení a zkuste znovu.");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-7 rounded-[6.4px] border border-[var(--line)] bg-[var(--paper-soft)] p-6 md:space-y-8 md:p-10"
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
      <Button
        type="submit"
        className="btn-brand"
        disabled={status === "loading"}
      >
        {status === "loading" ? "Odesílám…" : contact.formSubmit}
      </Button>
      <p className="text-[var(--muted)]">{contact.formHint}</p>
      {status === "success" && (
        <p className="text-[var(--brand-green)]">{contact.formSuccess}</p>
      )}
      {status === "error" && (
        <p className="text-[var(--brand-red)]">{error}</p>
      )}
    </form>
  );
}
