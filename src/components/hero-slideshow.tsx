"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const SLIDES = [
  {
    src: "/images/lifestyle-08.webp",
    alt: "Neapolská pizza Dal Birbante Praha Vinoř",
  },
  {
    src: "/images/lifestyle-01.webp",
    alt: "Pizza z pece Dal Birbante",
  },
  {
    src: "/images/gallery/01.webp",
    alt: "Italská pizza Dal Birbante",
  },
  {
    src: "/images/gallery/03.webp",
    alt: "Čerstvá pizza Dal Birbante",
  },
  {
    src: "/images/gallery/05.webp",
    alt: "Neapolská pizza z pece",
  },
  {
    src: "/images/panozzo.webp",
    alt: "Panozzo a italské speciality Dal Birbante",
  },
];

const INTERVAL_MS = 5500;

export function HeroSlideshow() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % SLIDES.length);
    }, INTERVAL_MS);

    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="hero-slideshow absolute inset-0">
      {SLIDES.map((slide, i) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
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
