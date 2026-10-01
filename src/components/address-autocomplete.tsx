"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Suggestion = {
  label: string;
  city: string;
};

type Props = {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  label?: string;
  hint?: string;
  placeholder?: string;
};

export function AddressAutocomplete({
  value,
  onChange,
  required,
  label = "Adresa",
  hint,
  placeholder = "Začněte psát ulici nebo obec…",
}: Props) {
  const listId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const q = value.trim();
    if (!open) return;

    const ctrl = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/address-suggest?q=${encodeURIComponent(q)}`,
          { signal: ctrl.signal },
        );
        const data = await res.json();
        setSuggestions(data.suggestions || []);
        setActive(-1);
      } catch {
        if (!ctrl.signal.aborted) setSuggestions([]);
      } finally {
        if (!ctrl.signal.aborted) setLoading(false);
      }
    }, 220);

    return () => {
      ctrl.abort();
      window.clearTimeout(timer);
    };
  }, [value, open]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function pick(item: Suggestion) {
    onChange(item.label);
    setOpen(false);
    setSuggestions([]);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || !suggestions.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter" && active >= 0) {
      e.preventDefault();
      pick(suggestions[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="space-y-1.5" ref={wrapRef}>
      <Label htmlFor={listId}>{label}</Label>
      <div className="relative">
        <Input
          id={listId}
          required={required}
          value={value}
          autoComplete="street-address"
          placeholder={placeholder}
          className="rounded-none"
          role="combobox"
          aria-expanded={open}
          aria-controls={`${listId}-list`}
          aria-autocomplete="list"
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onKeyDown={onKeyDown}
        />
        {open && (suggestions.length > 0 || loading) ? (
          <ul
            id={`${listId}-list`}
            role="listbox"
            className="absolute z-20 mt-1 max-h-56 w-full overflow-auto border border-[var(--line)] bg-white shadow-sm"
          >
            {loading && suggestions.length === 0 ? (
              <li className="px-3 py-2 text-sm text-[var(--muted)]">
                Hledám adresy…
              </li>
            ) : (
              suggestions.map((item, index) => (
                <li key={`${item.label}-${index}`} role="option">
                  <button
                    type="button"
                    className={`block w-full px-3 py-2 text-left text-sm hover:bg-[var(--paper-soft)] ${
                      index === active ? "bg-[var(--paper-soft)]" : ""
                    }`}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => pick(item)}
                  >
                    {item.label}
                  </button>
                </li>
              ))
            )}
          </ul>
        ) : null}
      </div>
      {hint ? <p className="text-sm text-[var(--muted)]">{hint}</p> : null}
    </div>
  );
}
