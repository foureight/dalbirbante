"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export type HeroSlide = {
  src: string;
  alt: string;
};

const INTERVAL_MS = 5500;

const FALLBACK_SLIDES: HeroSlide[] = [
  {
    src: "/images/lifestyle-08.webp",
    alt: "Neapolská pizza Dal Birbante Praha Vinoř",
  },
];

export function HeroSlideshow({ slides }: { slides?: HeroSlide[] }) {
  const items =
    slides?.filter((s) => s.src?.trim())?.length
      ? slides.filter((s) => s.src?.trim())
      : FALLBACK_SLIDES;
  const [active, setActive] = useState(0);

  useEffect(() => {
    setActive(0);
  }, [items.length]);

  useEffect(() => {
    if (items.length <= 1) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % items.length);
    }, INTERVAL_MS);

    return () => window.clearInterval(id);
  }, [items.length]);

  return (
    <div className="hero-slideshow absolute inset-0">
      {items.map((slide, i) => (
        <Image
          key={`${slide.src}-${i}`}
          src={slide.src}
          alt={slide.alt || "Dal Birbante"}
          fill
          priority={i === 0}
          sizes="100vw"
          className={`hero-slideshow__slide object-cover ${
            i === active ? "is-active" : ""
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-black/45" />
    </div>
  );
}
