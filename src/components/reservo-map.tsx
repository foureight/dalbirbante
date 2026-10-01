type Props = {
  src: string;
  title: string;
  className?: string;
};

export function ReservoMap({ src, title, className }: Props) {
  return (
    <div
      className={`overflow-hidden border border-[var(--line)] bg-[var(--ink)] ${className ?? ""}`}
    >
      <iframe
        src={src}
        title={title}
        className="h-[380px] w-full md:h-[460px]"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
