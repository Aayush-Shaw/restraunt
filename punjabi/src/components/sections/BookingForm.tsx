"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { CONTACT } from "@/data/site";

// TODO(launch): booking form is an intentional placeholder — not wired to a
// backend. To activate, replace REPLACE_FORM_ID with a real Formspree ID; the
// live-submit branch below then posts instead of showing the "call us" note.
const ACTION = "https://formspree.io/f/REPLACE_FORM_ID";

const fieldCls =
  "w-full rounded-[var(--radius-input)] border border-white/10 bg-white/[.06] px-4 py-[13px] text-cream [corner-shape:squircle] placeholder:text-muted focus:outline-2 focus:outline-offset-1 focus:outline-brand [&::-webkit-calendar-picker-indicator]:invert-[.7]";

const optionStyle = {
  background: "var(--color-surface)",
  color: "var(--color-cream)",
} as const;

export function BookingForm() {
  const [status, setStatus] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const form = e.currentTarget;
    if (ACTION.includes("REPLACE_FORM_ID")) {
      setStatus("Online booking isn't live yet — please call us to reserve.");
      return;
    }
    setStatus("Sending…");
    const res = await fetch(ACTION, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    }).catch(() => null);
    if (res && res.ok) {
      setStatus("Request sent — we'll call to confirm.");
      form.reset();
    } else {
      setStatus("Something went wrong — please call us instead.");
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      data-reveal=""
      className="flex h-full w-full min-w-0 flex-col justify-center gap-7.5 rounded-(--radius) border border-white/8 bg-surface/30 p-7.5 [corner-shape:squircle]"
    >
      <p className="mb-1.5 text-[.85rem] text-muted">
        Online booking is coming soon. To reserve now, please{" "}
        <a href={CONTACT.phoneHref} className="text-gold">
          call us
        </a>
        .
      </p>
      <input name="name" type="text" placeholder="Your name" autoComplete="name" aria-label="Your name" required className={fieldCls} />
      <input name="phone" type="tel" placeholder="Phone number" autoComplete="tel" aria-label="Phone number" required className={fieldCls} />
      <div className="flex gap-3.5">
        <input name="date" type="date" required aria-label="Date" className={fieldCls} />
        <input name="time" type="time" required aria-label="Time" className={fieldCls} />
      </div>
      <select name="guests" required aria-label="Number of guests" defaultValue="" className={`${fieldCls} invalid:text-muted`}>
        <option value="" disabled style={optionStyle}>
          Guests
        </option>
        <option style={optionStyle}>2</option>
        <option style={optionStyle}>4</option>
        <option style={optionStyle}>6</option>
        <option style={optionStyle}>8+</option>
      </select>
      <Button type="submit">Book Now</Button>
      <p className="min-h-[1.2em] text-[.9rem] text-gold" role="status" aria-live="polite">
        {status}
      </p>
    </form>
  );
}
