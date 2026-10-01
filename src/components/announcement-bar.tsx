"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "dalbirbante-announcement-dismissed";

export function AnnouncementBar({ message }: { message: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message.trim()) {
      setVisible(false);
      return;
    }
    try {
      const dismissed = window.sessionStorage.getItem(STORAGE_KEY);
      setVisible(dismissed !== message);
    } catch {
      setVisible(true);
    }
  }, [message]);

  function dismiss() {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, message);
    } catch {
      // ignore storage errors
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="relative bg-[var(--brand-green)] text-white">
      <div className="site-max mx-auto flex w-full items-center justify-center gap-4 px-5 py-3 pr-12 md:px-10 md:pr-14">
        <p className="text-center text-sm font-semibold uppercase tracking-[0.12em] md:text-base">
          {message}
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
