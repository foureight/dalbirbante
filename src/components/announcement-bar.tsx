"use client";

import { useEffect, useState } from "react";
import {
  CLOSED_BANNER,
  isClosedDay,
} from "@/lib/opening-hours";

const STORAGE_KEY = "dalbirbante-announcement-dismissed";

export function AnnouncementBar({ message }: { message: string }) {
  const [visible, setVisible] = useState(false);
  const [closed, setClosed] = useState(false);
  const [activeMessage, setActiveMessage] = useState("");

  useEffect(() => {
    const showClosed = isClosedDay();
    const nextMessage = showClosed ? CLOSED_BANNER : message.trim();
    setClosed(showClosed);
    setActiveMessage(nextMessage);

    if (!nextMessage) {
      setVisible(false);
      return;
    }

    // Closed-day banner always stays visible — cannot dismiss
    if (showClosed) {
      setVisible(true);
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
    if (closed) return;
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
      <div className="site-max mx-auto w-full px-4 py-2.5 sm:px-5 sm:py-3 md:px-10">
        <p className="max-w-[calc(100%-2.5rem)] text-left text-[0.72rem] font-semibold uppercase leading-snug tracking-[0.03em] sm:text-sm md:text-base">
          {activeMessage}
        </p>
      </div>
      {closed ? null : (
        <button
          type="button"
          onClick={dismiss}
          aria-label="Zavřít důležité sdělení"
          className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-white transition hover:bg-white/15 sm:right-5 sm:size-9 md:right-10"
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
      )}
    </div>
  );
}
