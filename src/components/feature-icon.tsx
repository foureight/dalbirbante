const icons = {
  delivery: (
    <>
      <path
        d="M3 11.5h1.4l1.8-4.2A1.6 1.6 0 0 1 7.7 6.2h6.6c.6 0 1.1.3 1.4.9L17.6 11H20a1 1 0 0 1 1 1v4.2a1 1 0 0 1-1 1h-1.1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 11.5V16a1 1 0 0 0 1 1h1.2M7.8 11.5h8.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="7.2"
        cy="17"
        r="1.7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle
        cx="17.2"
        cy="17"
        r="1.7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </>
  ),
  card: (
    <>
      <rect
        x="3"
        y="6"
        width="18"
        height="12"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M3 10h18" stroke="currentColor" strokeWidth="1.8" />
    </>
  ),
  voucher: (
    <>
      <path
        d="M4 8h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4V8z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M12 8v10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeDasharray="2 2"
      />
    </>
  ),
  ingredients: (
    <>
      <path
        d="M12 21c4-3.2 6.5-6.2 6.5-9.2A4.5 4.5 0 0 0 12 7.5 4.5 4.5 0 0 0 5.5 11.8C5.5 14.8 8 17.8 12 21z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M12 7.5V4.5M10 5.5c1.2.6 2.8.6 4 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </>
  ),
  wifi: (
    <>
      <path
        d="M5 10.5a10 10 0 0 1 14 0M8 13.5a6 6 0 0 1 8 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="12" cy="17.5" r="1.4" fill="currentColor" />
    </>
  ),
  pets: (
    <>
      <circle cx="7.5" cy="8" r="1.5" fill="currentColor" />
      <circle cx="16.5" cy="8" r="1.5" fill="currentColor" />
      <circle cx="5.5" cy="12.5" r="1.4" fill="currentColor" />
      <circle cx="18.5" cy="12.5" r="1.4" fill="currentColor" />
      <ellipse cx="12" cy="16" rx="4.2" ry="3.4" fill="currentColor" />
    </>
  ),
} as const;

export type FeatureIconName = keyof typeof icons;

const byTitle: Record<string, FeatureIconName> = {
  "Rozvážíme": "delivery",
  Platba: "card",
  "Bereme stravenky": "voucher",
  "Italské suroviny": "ingredients",
  "Bezplatná wi-fi": "wifi",
  "Mazlíčci vítáni": "pets",
};

export function FeatureIcon({ title }: { title: string }) {
  const name = byTitle[title] ?? "delivery";
  return (
    <span
      className="inline-flex size-16 shrink-0 items-center justify-center rounded-full bg-[var(--brand-red)] text-white md:size-[4.5rem]"
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="size-8 md:size-9" fill="none">
        {icons[name]}
      </svg>
    </span>
  );
}
