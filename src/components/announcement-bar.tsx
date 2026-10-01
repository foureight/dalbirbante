"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const STORAGE_KEY = "dalbirbante-announcement-dismissed";
const CLOSED_MESSAGE =
  "Dnes je restaurace bohužel zavřená. Uvidíme se v úterý.";

function pragueWeekday(): number {
  // 0 = Sunday … 6 = Saturday in Europe/Prague
  const day = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Prague",
    weekday: "short",
  }).format(new Date());
  const map: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  return map[day] ?? new Date().getDay();
}

function isClosedDay(): boolean {
  const d = pragueWeekday();
  return d === 0 || d === 1;
}

export function AnnouncementBar({ message }: { message: string }) {
  const [visible, setVisible] = useState(false);
  const [closed, setClosed] = useState(false);
  const [activeMessage, setActiveMessage] = useState("");

  useEffect(() => {
    const showClosed = isClosedDay();
    const nextMessage = showClosed ? CLOSED_MESSAGE : message.trim();
    setClosed(showClosed);
    setActiveMessage(nextMessage);

    if (!nextMessage) {
      setVisible(false);
      return;
    }

    try {
      const dismissed = window.sessionStorage.getItem(STORAGE_KEY);
      setVisible(dismissed !== nextMessage);
    } catch {
      setVisible(true);
    }
  }, [message]);

  function dismiss() {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, activeMessage);
    } catch {
      // ignore storage errors
    }
    setVisible(false);
  }

  if (!visible || !activeMessage) return null;

  return (
    <div
      className={`relative text-white ${
        closed ? "bg-[var(--brand-red)]" : "bg-[var(--brand-green)]"
      }`}
    >
      <div className="site-max mx-auto flex w-full items-center gap-3 px-5 py-3 pr-12 md:gap-5 md:px-10 md:pr-14">
        <Image
          src="/images/logo-white.webp"
          alt="Dal Birbante"
          width={180}
          height={22}
          className="h-5 w-auto shrink-0 object-contain md:h-6"
          priority
        />
        <p className="min-w-0 flex-1 text-left text-sm font-semibold uppercase tracking-[0.12em] md:text-base">
          {activeMessage}
        </p>
      </div>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Zavřít důležité sdělení"
        className="absolute right-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-white transition hover:bg-white/15 md:right-5"
      >
        <svg
          viewBox="0 0 24 24"
          className="size-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          aria-hidden
        >
          <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
