"use client";

import Link from "next/link";
import Image from "next/image";

type Props = {
  brandName: string;
};

export function BrandLogo({ brandName }: Props) {
  return (
    <Link href="/" className="brand-logo" aria-label={brandName}>
      <Image
        src="/images/logo-wordmark-v2.webp"
        alt={brandName}
        width={287}
        height={40}
        className="brand-logo__word"
        priority
        unoptimized
      />
      <span className="brand-logo__flag" aria-hidden="true">
        <span className="brand-logo__stripe brand-logo__stripe--green" />
        <span className="brand-logo__stripe brand-logo__stripe--red" />
      </span>
    </Link>
  );
}
