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
    <section className="relative min-h-[40vh] overflow-hidden text-white">
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        className="hero-pan object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="site-max relative mx-auto flex min-h-[48vh] w-full flex-col justify-end px-5 pb-16 md:px-10 md:pb-20">
        <h1 className="animate-rise-delay text-white">{title}</h1>
        {children ? (
          <div className="animate-rise-delay-2 mt-6 max-w-3xl text-white/90">
            {children}
          </div>
        ) : null}
      </div>
    </section>
  );
}
