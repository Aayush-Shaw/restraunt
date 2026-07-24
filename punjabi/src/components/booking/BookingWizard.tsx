"use client";

import { useRef, useState, type FormEvent } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { Button } from "@/components/ui/Button";
import { CheckIcon } from "@/components/ui/icons";
import { MAX_PARTY, TABLES, type BookingStep, type Table } from "./tables";

// Multi-step reservation wizard — every step renders inside the one box, no
// route/modal changes. Availability is still mocked.
// TODO: wire table availability to a real backend.

const fieldCls =
  "w-full rounded-[var(--radius-input)] border border-white/10 bg-white/[.06] px-4 py-[13px] text-cream [corner-shape:squircle] placeholder:text-muted focus:outline-2 focus:outline-offset-1 focus:outline-brand";

// `!` is required: Button's base already sets px-8/py-[14px], so a plain
// override would win or lose on Tailwind's class sort order rather than reliably.
const nextCls = "px-6! py-2.5!";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Canadian numbers are +1 (fixed) + 10 national digits, shown as (XXX) XXX-XXXX.
const phoneDigits = (s: string): string => s.replace(/\D/g, "").slice(0, 10);
function formatPhone(s: string): string {
  const d = phoneDigits(s);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}
// Red border once touched-and-wrong; gold once valid; neutral while pristine.
const borderState = (value: string, err: string, touched: boolean): string =>
  err ? (touched ? "border-brand!" : "") : value ? "border-gold/60!" : "";

const ORDER: BookingStep[] = ["party-size", "table-map", "contact"];
const STEP_LABEL: Record<BookingStep, string> = {
  "party-size": "Party size",
  "table-map": "Pick a table",
  contact: "Your details",
  confirmed: "Confirmed",
};

interface Contact {
  name: string;
  phone: string;
  email: string;
}

export function BookingWizard() {
  const [step, setStep] = useState<BookingStep>("party-size");
  const [party, setParty] = useState(2);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [contact, setContact] = useState<Contact>({ name: "", phone: "", email: "" });
  const [touched, setTouched] = useState<Record<keyof Contact, boolean>>({
    name: false,
    phone: false,
    email: false,
  });

  // Live validation — recomputed every render so feedback shows as the user types.
  const errors: Record<keyof Contact, string> = {
    name: contact.name.trim().length < 2 ? "Please enter your name." : "",
    phone: phoneDigits(contact.phone).length === 10 ? "" : "Enter a 10-digit phone number.",
    email: EMAIL_RE.test(contact.email) ? "" : "Enter a valid email address.",
  };
  const contactValid = !errors.name && !errors.phone && !errors.email;
  const markTouched = (k: keyof Contact): void => setTouched((t) => ({ ...t, [k]: true }));

  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  const selected = TABLES.find((t) => t.id === selectedId) ?? null;

  // Slide each step's content in when the step changes (skip first paint — the
  // scroll-reveal driver already handles the box's entrance).
  useGSAP(
    () => {
      if (first.current) {
        first.current = false;
        return;
      }
      if (!contentRef.current) return;
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, x: 24 },
        { opacity: 1, x: 0, duration: 0.4, ease: "power3.out" },
      );
    },
    { dependencies: [step], scope: rootRef },
  );

  const goBack = (): void => {
    const prev = ORDER[ORDER.indexOf(step) - 1];
    if (prev) setStep(prev);
  };

  // Called by both the form's onSubmit (Enter key) and the footer Next button.
  const tryAdvanceContact = (): void => {
    if (contactValid) setStep("confirmed");
    else setTouched({ name: true, phone: true, email: true }); // reveal every error
  };
  const onContactSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    tryAdvanceContact();
  };

  const reset = (): void => {
    setStep("party-size");
    setParty(2);
    setDate("");
    setTime("");
    setSelectedId(null);
    setContact({ name: "", phone: "", email: "" });
    setTouched({ name: false, phone: false, email: false });
  };

  return (
    <div
      ref={rootRef}
      data-reveal=""
      className="flex h-full w-full min-w-0 flex-col rounded-(--radius) border border-white/8 bg-surface/30 p-7.5 [corner-shape:squircle] max-[640px]:p-6"
    >
      {step !== "confirmed" && (
        <div className="mb-6 flex items-center justify-between">
          <span className="font-display text-[.82rem] tracking-wider text-muted uppercase">
            Step {ORDER.indexOf(step) + 1} of {ORDER.length} · {STEP_LABEL[step]}
          </span>
          <div className="flex gap-1.5">
            {ORDER.map((s, i) => (
              <span
                key={s}
                className={`h-1.5 w-6 rounded-full transition-colors ${
                  i <= ORDER.indexOf(step) ? "bg-brand" : "bg-white/12"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      <div ref={contentRef} className="flex-1">
        {step === "party-size" && (
          <PartyStep
            value={party}
            onChange={setParty}
            date={date}
            time={time}
            onDate={setDate}
            onTime={setTime}
          />
        )}

        {step === "table-map" && (
          <TableMap party={party} selectedId={selectedId} onSelect={setSelectedId} />
        )}

        {step === "contact" && (
          <form onSubmit={onContactSubmit} noValidate className="flex flex-col gap-4">
            <Field
              label="Name"
              required
              error={touched.name ? errors.name : ""}
              valid={!errors.name && contact.name.length > 0}
            >
              <input
                type="text"
                autoComplete="name"
                placeholder="Your name"
                value={contact.name}
                onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))}
                onBlur={() => markTouched("name")}
                className={`${fieldCls} ${borderState(contact.name, errors.name, touched.name)}`}
              />
            </Field>
            <Field
              label="Phone"
              required
              error={touched.phone ? errors.phone : ""}
              valid={!errors.phone}
            >
              <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted select-none">
                +1
              </span>
              <input
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                placeholder="(555) 123-4567"
                value={contact.phone}
                onChange={(e) => setContact((c) => ({ ...c, phone: formatPhone(e.target.value) }))}
                onBlur={() => markTouched("phone")}
                className={`${fieldCls} pl-11! ${borderState(contact.phone, errors.phone, touched.phone)}`}
              />
            </Field>
            <Field
              label="Email"
              required
              error={touched.email ? errors.email : ""}
              valid={!errors.email && contact.email.length > 0}
            >
              <input
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={contact.email}
                onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
                onBlur={() => markTouched("email")}
                className={`${fieldCls} ${borderState(contact.email, errors.email, touched.email)}`}
              />
            </Field>
          </form>
        )}

        {step === "confirmed" && (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-brand/15 text-brand">
              <CheckIcon className="h-8 w-8" />
            </span>
            <h3 className="font-display text-[1.6rem] font-medium">Table booked</h3>
            <p className="max-w-[34ch] text-muted">
              {contact.name}, your table for {party} {party === 1 ? "guest" : "guests"} is
              confirmed — {selected?.label} ({selected?.seats} seats) on {fmtWhen(date, time)}.
              See you soon.
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-3 cursor-pointer rounded-full border border-white/15 px-6 py-2.5 font-display text-[.9rem] text-cream transition-colors hover:bg-white/8"
            >
              Book another table
            </button>
          </div>
        )}
      </div>

      {/* Footer nav — the confirmed screen has its own controls. */}
      {step !== "confirmed" && (
        <div className="mt-7 flex items-center justify-between gap-3">
          {ORDER.indexOf(step) > 0 ? (
            <button
              type="button"
              onClick={goBack}
              className="cursor-pointer rounded-full border border-white/10 px-6 py-2.5 font-display text-[.9rem] text-cream transition-colors hover:bg-white/5"
            >
              Back
            </button>
          ) : (
            <span />
          )}

          {step === "party-size" && (
            <Button className={nextCls} onClick={() => setStep("table-map")} disabled={!date || !time}>
              Next
            </Button>
          )}
          {step === "table-map" && (
            <Button className={nextCls} onClick={() => setStep("contact")} disabled={!selectedId}>
              Next
            </Button>
          )}
          {step === "contact" && (
            <Button className={nextCls} onClick={tryAdvanceContact}>
              Confirm booking
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function PartyStep({
  value,
  onChange,
  date,
  time,
  onDate,
  onTime,
}: {
  value: number;
  onChange: (n: number) => void;
  date: string;
  time: string;
  onDate: (v: string) => void;
  onTime: (v: string) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-6 py-6">
      <p className="text-muted">How many guests?</p>
      <div className="flex items-center gap-6">
        <RoundBtn label="Fewer guests" disabled={value <= 1} onClick={() => onChange(Math.max(1, value - 1))}>
          −
        </RoundBtn>
        <span className="w-16 text-center font-display text-[3rem] font-medium tabular-nums text-cream">
          {value}
        </span>
        <RoundBtn
          label="More guests"
          disabled={value >= MAX_PARTY}
          onClick={() => onChange(Math.min(MAX_PARTY, value + 1))}
        >
          +
        </RoundBtn>
      </div>
      <p className="text-[.85rem] text-muted">Tables seat up to {MAX_PARTY}.</p>

      <div className="grid w-full max-w-sm grid-cols-2 gap-3 max-[380px]:grid-cols-1">
        <Field label="Date" required>
          <input
            type="date"
            min={localToday()}
            value={date}
            onChange={(e) => onDate(e.target.value)}
            className={`${fieldCls} scheme-dark`}
          />
        </Field>
        <Field label="Time" required>
          <input
            type="time"
            value={time}
            onChange={(e) => onTime(e.target.value)}
            className={`${fieldCls} scheme-dark`}
          />
        </Field>
      </div>
    </div>
  );
}

// Local (not UTC) YYYY-MM-DD so the date picker's min never blocks "today".
const localToday = (): string => new Date().toLocaleDateString("en-CA");

// "2026-07-25" + "19:30" → "Sat, Jul 25 · 7:30 PM". Falls back to raw if unset.
function fmtWhen(date: string, time: string): string {
  if (!date || !time) return "—";
  const d = new Date(`${date}T${time}`);
  if (Number.isNaN(d.getTime())) return `${date} ${time}`;
  return `${d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  })} · ${d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}`;
}

function RoundBtn({
  children,
  onClick,
  disabled,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="grid h-12 w-12 cursor-pointer place-items-center rounded-full border border-white/15 bg-white/5 text-[1.6rem] leading-none text-cream transition-colors hover:border-brand/60 hover:bg-brand/10 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function TableMap({
  party,
  selectedId,
  onSelect,
}: {
  party: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const columns: { seats: 2 | 4 | 6 }[] = [{ seats: 6 }, { seats: 2 }, { seats: 4 }];
  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-x-4 gap-y-2 text-[.78rem] text-muted">
        <Legend className="border-white/12 bg-white/5">Available</Legend>
        <Legend className="border-brand bg-brand/20">Selected</Legend>
        <Legend className="border-white/8 bg-white/3 opacity-50">Booked</Legend>
      </div>
      <div className="grid grid-cols-3 gap-2.5 max-[380px]:gap-1.5">
        {columns.map(({ seats }) => (
          <div key={seats} className="flex flex-col gap-2.5 max-[380px]:gap-1.5">
            <span className="text-center font-display text-[.8rem] tracking-[0.04em] text-muted">
              {seats} seats
            </span>
            {TABLES.filter((t) => t.seats === seats).map((t) => (
              <TableCell
                key={t.id}
                table={t}
                selected={t.id === selectedId}
                fits={t.status === "available" && t.seats >= party}
                onSelect={onSelect}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function TableCell({
  table,
  selected,
  fits,
  onSelect,
}: {
  table: Table;
  selected: boolean;
  fits: boolean;
  onSelect: (id: string) => void;
}) {
  const booked = table.status === "booked";
  const base =
    "flex flex-col items-center rounded-2xl border px-2 py-3 text-center transition-colors [corner-shape:squircle]";
  const state = booked
    ? "border-white/8 bg-white/[.03] opacity-50 cursor-not-allowed"
    : selected
      ? "border-brand bg-brand/20 text-cream cursor-pointer"
      : `border-white/12 bg-white/[.05] hover:border-brand/60 hover:bg-brand/10 cursor-pointer ${
          fits ? "ring-1 ring-gold/40" : ""
        }`;
  return (
    <button
      type="button"
      disabled={booked}
      aria-pressed={selected}
      aria-label={`Table ${table.label}, ${table.seats} seats, ${booked ? "booked" : selected ? "selected" : "available"}`}
      onClick={() => onSelect(table.id)}
      className={`${base} ${state}`}
    >
      <span className="font-display text-[.9rem] font-medium">{table.label}</span>
      <span className="text-[.72rem] text-muted">{table.seats} seats</span>
    </button>
  );
}

function Legend({ children, className }: { children: React.ReactNode; className: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`inline-block h-3 w-3 rounded-full border ${className}`} />
      {children}
    </span>
  );
}

function Field({
  label,
  required,
  error,
  valid,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  valid?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-display text-[.82rem] tracking-[0.03em] text-muted">
        {label}
        {required && <span className="text-brand"> *</span>}
      </span>
      <div className="relative">
        {children}
        {valid && (
          <CheckIcon className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-gold" />
        )}
      </div>
      {error && (
        <span className="mt-1 block text-[.8rem] text-brand" role="alert">
          {error}
        </span>
      )}
    </label>
  );
}
