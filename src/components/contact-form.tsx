"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { SiteContent } from "@/lib/types";

export function ContactForm({ content }: { content: SiteContent }) {
  const { contact, site } = content;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`Zpráva z webu – ${name || "návštěvník"}`);
    const body = encodeURIComponent(
      `Jméno: ${name}\nE-mail: ${email}\n\n${message}`,
    );
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">{contact.formNameLabel}</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="rounded-[6.4px] border-[var(--line)] bg-white/70"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">{contact.formEmailLabel}</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="rounded-[6.4px] border-[var(--line)] bg-white/70"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">{contact.formMessageLabel}</Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={5}
          className="rounded-[6.4px] border-[var(--line)] bg-white/70"
        />
      </div>
      <Button
        type="submit"
        className="rounded-full bg-[var(--accent)] px-6 text-white hover:bg-[var(--accent-hover)]"
      >
        {contact.formSubmit}
      </Button>
      <p className="text-sm text-[var(--muted)]">{contact.formHint}</p>
      {sent && (
        <p className="text-sm text-[var(--forest)]">{contact.formSuccess}</p>
      )}
    </form>
  );
}
