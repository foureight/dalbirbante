const icons = {
  delivery: (
    <path
      d="M3 7h11v8H3V7zm11 2h3.2L20 13.2V15h-1.1a2.2 2.2 0 0 1-4.2 0H9.3a2.2 2.2 0 0 1-4.2 0H3"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
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
  access: (
    <>
      <circle cx="12" cy="5" r="2" fill="currentColor" />
      <path
        d="M8 21v-6l-2-5h12l-2 5v6M10 10v11M14 10v11"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
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
  "Platba kartou": "card",
  "Bereme stravenky": "voucher",
  Bezbariérové: "access",
  "Bezplatná wi-fi": "wifi",
  "Mazlíčci vítáni": "pets",
};

export function FeatureIcon({ title }: { title: string }) {
  const name = byTitle[title] ?? "delivery";
  return (
    <span
      className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-[var(--brand-red)] text-white"
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="size-6" fill="none">
        {icons[name]}
      </svg>
    </span>
  );
}
