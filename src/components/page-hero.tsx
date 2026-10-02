import Image from "next/image";
import type { ReactNode } from "react";

type Props = {
  title: ReactNode;
  image: string;
  imageAlt?: string;
  children?: ReactNode;
};

export function PageHero({
  title,
  image,
  imageAlt = "",
  children,
}: Props) {
  return (
    <section className="relative min-h-[34vh] overflow-hidden text-white sm:min-h-[40vh]">
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        className="hero-pan object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/45 to-black/25" />
      <div className="site-max relative mx-auto flex min-h-[38vh] w-full flex-col justify-end px-4 pb-10 sm:min-h-[48vh] sm:px-5 sm:pb-14 md:px-10 md:pb-20">
        <h1 className="animate-rise-delay text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]">
          {title}
        </h1>
        {children ? (
          <div className="animate-rise-delay-2 mt-4 max-w-3xl text-[0.98rem] leading-relaxed text-white/90 sm:mt-6 sm:text-[length:inherit]">
            {children}
          </div>
        ) : null}
      </div>
    </section>
  );
}
