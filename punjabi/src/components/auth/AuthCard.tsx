"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CheckIcon, EyeIcon, EyeOffIcon } from "@/components/ui/icons";

// Dummy auth — no real provider, no session. Client-side validation gives it a
// polished feel, then it lands on a success state.
// TODO: wire to a real auth provider (email/password + Google OAuth).

export type AuthMode = "login" | "signup";

const fieldCls =
  "w-full rounded-[var(--radius-input)] border border-white/10 bg-white/[.06] px-4 py-[13px] text-cream [corner-shape:squircle] placeholder:text-muted focus:outline-2 focus:outline-offset-1 focus:outline-brand";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Red border once touched-and-wrong; gold once valid; neutral while pristine.
const borderState = (value: string, err: string, touched: boolean): string =>
  err ? (touched ? "border-brand!" : "") : value ? "border-gold/60!" : "";

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

// `onDone` is passed by AuthOverlay so the success state closes the dialog
// instead of navigating home. The standalone /login page omits it.
export function AuthCard({
  initialMode,
  onDone,
}: {
  initialMode: AuthMode;
  onDone?: () => void;
}) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [googleLoading, setGoogleLoading] = useState(false);
  const [welcome, setWelcome] = useState<string | null>(null);

  const isSignup = mode === "signup";

  // Live validation — recomputed every render so feedback shows as the user types.
  const errors: { name: string; email: string; password: string } = {
    name: isSignup && name.trim().length < 2 ? "Please enter your name." : "",
    email: EMAIL_RE.test(email) ? "" : "Enter a valid email address.",
    password: password.length < 6 ? "At least 6 characters." : "",
  };
  const valid = !errors.email && !errors.password && !errors.name;
  const markTouched = (k: string): void => setTouched((t) => ({ ...t, [k]: true }));

  const switchMode = (next: AuthMode): void => {
    setMode(next);
    setTouched({});
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!valid) {
      setTouched({ name: true, email: true, password: true }); // reveal every error
      return;
    }
    // TODO: wire to a real auth provider — this just shows a success state.
    setWelcome(isSignup ? name.trim() : email.trim());
  };

  const onGoogle = (): void => {
    setGoogleLoading(true);
    // TODO: wire to real Google OAuth — dummy loading, then a success state.
    setTimeout(() => setWelcome("your Google account"), 1000);
  };

  if (welcome) {
    return (
      <div className="w-full max-w-105 rounded-(--radius) border border-white/10 bg-surface/40 p-8 text-center [corner-shape:squircle]">
        <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-brand/15 text-brand">
          <CheckIcon className="h-7 w-7" />
        </span>
        <h1 className="font-display text-[1.6rem] font-medium">
          {isSignup ? "Account created" : "Welcome back"}
        </h1>
        <p className="mt-2 text-muted">Signed in as {welcome}.</p>
        {onDone ? (
          <Button onClick={onDone} className="mt-6 w-full">
            Done
          </Button>
        ) : (
          <Button href="/" className="mt-6 w-full">
            Back to home
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-105 rounded-(--radius) border border-white/10 bg-surface/10 shadow-2xl backdrop-blur-xl p-8 [corner-shape:squircle] max-[520px]:p-6 landscape:max-w-180">
      {/* Landscape splits into two columns: the pitch and Google on the left,
          the email form on the right. Portrait stays a single stacked column. */}
      <div className="flex flex-col landscape:flex-row landscape:gap-7">
        <div className="landscape:flex-1">
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
            className="mt-7 flex w-full cursor-pointer items-center justify-center gap-3 rounded-full border border-white/12 bg-white/4 py-3 font-display font-medium text-cream transition-colors hover:bg-white/8 disabled:opacity-60"
          >
            <GoogleMark />
            {googleLoading ? "Connecting…" : "Continue with Google"}
          </button>

          {/* Portrait-only: in two columns the border between them separates. */}
          <div className="my-6 flex items-center gap-3 text-[.8rem] text-muted landscape:hidden">
            <span className="h-px flex-1 bg-white/10" />
            or
            <span className="h-px flex-1 bg-white/10" />
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          noValidate
          className="flex flex-col gap-4 landscape:flex-1 landscape:border-l landscape:border-white/8 landscape:pl-7"
        >
          {isSignup && (
            <Field
              label="Name"
              error={touched.name ? errors.name : ""}
              valid={!errors.name && name.length > 0}
            >
              <input
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => markTouched("name")}
                className={`${fieldCls} ${borderState(name, errors.name, !!touched.name)}`}
              />
            </Field>
          )}
          <Field
            label="Email"
            error={touched.email ? errors.email : ""}
            valid={!errors.email && email.length > 0}
          >
            <input
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => markTouched("email")}
              className={`${fieldCls} ${borderState(email, errors.email, !!touched.email)}`}
            />
          </Field>
          <Field label="Password" error={touched.password ? errors.password : ""}>
            <input
              name="password"
              type={showPw ? "text" : "password"}
              autoComplete={isSignup ? "new-password" : "current-password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => markTouched("password")}
              className={`${fieldCls} pr-11! ${borderState(password, errors.password, !!touched.password)}`}
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              aria-label={showPw ? "Hide password" : "Show password"}
              className="absolute top-1/2 right-2.5 grid h-8 w-8 -translate-y-1/2 cursor-pointer place-items-center rounded-full text-muted transition-colors hover:text-cream"
            >
              {showPw ? <EyeOffIcon className="h-4.5 w-4.5" /> : <EyeIcon className="h-4.5 w-4.5" />}
            </button>
          </Field>
          <Button type="submit" className="mt-2 w-full">
            {isSignup ? "Create account" : "Log in"}
          </Button>
        </form>
      </div>

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
  valid,
  children,
}: {
  label: string;
  error?: string;
  valid?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-display text-[.82rem] tracking-[0.03em] text-muted">
        {label}
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
