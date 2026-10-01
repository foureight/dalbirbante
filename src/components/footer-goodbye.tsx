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
    }, 3800);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="mb-10 flex w-full flex-col items-center justify-center text-center md:mb-14">
      <div className="footer-wave-marquee mb-3 w-full max-w-md overflow-hidden text-white md:max-w-lg">
        <div className="footer-wave-track" aria-hidden>
          <span className="footer-wave-text">{WAVES.join("")}</span>
          <span className="footer-wave-text">{WAVES.join("")}</span>
        </div>
      </div>

      <div className="relative mx-auto flex h-[clamp(2.8rem,7vw,4.5rem)] w-full items-center justify-center overflow-visible">
        <p
          className={`footer-goodbye-line ${
            showItalian ? "is-exit" : "is-active"
          }`}
        >
          {czech}
        </p>
        <p
          className={`footer-goodbye-line ${
            showItalian ? "is-active" : "is-enter"
          }`}
          aria-hidden={!showItalian}
        >
          {italian}
        </p>
      </div>
    </div>
  );
}
