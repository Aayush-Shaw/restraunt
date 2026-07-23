"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

// Dummy auth — no real provider, no session. Client-side validation gives it a
// polished feel, then it lands on a success state.
// TODO: wire to a real auth provider (email/password + Google OAuth).

export type AuthMode = "login" | "signup";

const fieldCls =
  "w-full rounded-[var(--radius-input)] border border-white/10 bg-white/[.06] px-4 py-[13px] text-cream [corner-shape:squircle] placeholder:text-muted focus:outline-2 focus:outline-offset-1 focus:outline-brand";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z" />
      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-3l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.3a12 12 0 0 0 0 10.8l4-3.1z" />
      <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1c.9-2.9 3.6-5 6.7-5z" />
    </svg>
  );
}

export function AuthCard({ initialMode }: { initialMode: AuthMode }) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [googleLoading, setGoogleLoading] = useState(false);
  const [welcome, setWelcome] = useState<string | null>(null);

  const isSignup = mode === "signup";

  const switchMode = (next: AuthMode): void => {
    setMode(next);
    setErrors({});
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");

    const next: Record<string, string> = {};
    if (isSignup && name.length < 2) next.name = "Please enter your name.";
    if (!EMAIL_RE.test(email)) next.email = "Enter a valid email address.";
    if (password.length < 6) next.password = "At least 6 characters.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    // TODO: wire to a real auth provider — this just shows a success state.
    setWelcome(isSignup ? name : email);
  };

  const onGoogle = (): void => {
    setGoogleLoading(true);
    // TODO: wire to real Google OAuth — dummy loading, then a success state.
    setTimeout(() => setWelcome("your Google account"), 1000);
  };

  if (welcome) {
    return (
      <div className="w-full max-w-[420px] rounded-(--radius) border border-white/8 bg-surface/40 p-8 text-center [corner-shape:squircle]">
        <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-brand/15 text-[1.8rem] text-brand">
          ✓
        </span>
        <h1 className="font-display text-[1.6rem] font-medium">
          {isSignup ? "Account created" : "Welcome back"}
        </h1>
        <p className="mt-2 text-muted">Signed in as {welcome}.</p>
        <Button href="/" className="mt-6 w-full">
          Back to home
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[420px] rounded-(--radius) border border-white/8 bg-surface/40 p-8 [corner-shape:squircle] max-[520px]:p-6">
      <h1 className="font-display text-[1.9rem] font-medium">
        {isSignup ? "Create account" : "Welcome back"}
      </h1>
      <p className="mt-1.5 text-[.95rem] text-muted">
        {isSignup
          ? "Join the table — reserve, order, come back for more."
          : "Sign in to pick up where you left off."}
      </p>

      <button
        type="button"
        onClick={onGoogle}
        disabled={googleLoading}
        className="mt-7 flex w-full cursor-pointer items-center justify-center gap-3 rounded-full border border-white/12 bg-white/[.04] py-3 font-display font-medium text-cream transition-colors hover:bg-white/[.08] disabled:opacity-60"
      >
        <GoogleMark />
        {googleLoading ? "Connecting…" : "Continue with Google"}
      </button>

      <div className="my-6 flex items-center gap-3 text-[.8rem] text-muted">
        <span className="h-px flex-1 bg-white/10" />
        or
        <span className="h-px flex-1 bg-white/10" />
      </div>

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        {isSignup && (
          <Field label="Name" error={errors.name}>
            <input name="name" type="text" autoComplete="name" placeholder="Your name" className={fieldCls} />
          </Field>
        )}
        <Field label="Email" error={errors.email}>
          <input name="email" type="email" autoComplete="email" placeholder="you@example.com" className={fieldCls} />
        </Field>
        <Field label="Password" error={errors.password}>
          <input
            name="password"
            type="password"
            autoComplete={isSignup ? "new-password" : "current-password"}
            placeholder="••••••••"
            className={fieldCls}
          />
        </Field>
        <Button type="submit" className="mt-2 w-full">
          {isSignup ? "Create account" : "Log in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-[.9rem] text-muted">
        {isSignup ? "Already have an account? " : "New here? "}
        <button
          type="button"
          onClick={() => switchMode(isSignup ? "login" : "signup")}
          className="cursor-pointer font-medium text-gold hover:underline"
        >
          {isSignup ? "Log in" : "Create one"}
        </button>
      </p>
      <p className="mt-4 text-center text-[.78rem] text-muted/70">
        Demo only — no real account is created.{" "}
        <Link href="/" className="hover:text-cream">
          Skip
        </Link>
      </p>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-display text-[.82rem] tracking-[0.03em] text-muted">
        {label}
      </span>
      {children}
      {error && (
        <span className="mt-1 block text-[.8rem] text-brand" role="alert">
          {error}
        </span>
      )}
    </label>
  );
}
