"use client";

import { useEffect, useState } from "react";

const WAVES = Array.from({ length: 24 }, () => "〰");

export function FooterGoodbye({
  czech,
  italian,
}: {
  czech: string;
  italian: string;
}) {
  const [showItalian, setShowItalian] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => {
      setShowItalian((v) => !v);
    }, 3200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="mb-10 flex flex-col items-center text-center md:mb-14">
      <div className="footer-wave-marquee mb-2 w-full max-w-md overflow-hidden text-white md:max-w-lg">
        <div className="footer-wave-track" aria-hidden>
          <span className="footer-wave-text">{WAVES.join("")}</span>
          <span className="footer-wave-text">{WAVES.join("")}</span>
        </div>
      </div>

      <div className="relative flex h-[clamp(2.8rem,7vw,4.2rem)] items-center justify-center">
        <p
          className={`absolute inset-x-0 whitespace-nowrap font-display text-[clamp(1.75rem,5.5vw,3.75rem)] font-black uppercase leading-none tracking-wide text-white transition-all duration-700 ${
            showItalian
              ? "translate-y-2 opacity-0"
              : "translate-y-0 opacity-100"
          }`}
        >
          {czech}
        </p>
        <p
          className={`absolute inset-x-0 whitespace-nowrap font-display text-[clamp(1.75rem,5.5vw,3.75rem)] font-black uppercase leading-none tracking-wide text-white transition-all duration-700 ${
            showItalian
              ? "translate-y-0 opacity-100"
              : "-translate-y-2 opacity-0"
          }`}
          aria-hidden={!showItalian}
        >
          {italian}
        </p>
      </div>
    </div>
  );
}
