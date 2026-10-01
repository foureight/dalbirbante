"use client";

import { useState } from "react";

type Props = {
  href: string;
  label?: string;
  className?: string;
};

export function OrderButton({
  href,
  label = "Objednat",
  className = "",
}: Props) {
  const [ordered, setOrdered] = useState(false);

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={() => setOrdered(true)}
      className={`btn-order ${ordered ? "is-ordered" : ""} ${className}`}
    >
      {label}
    </a>
  );
}
