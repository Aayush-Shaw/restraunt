"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap, useGSAP } from "@/lib/gsap";
import { useCart } from "@/components/cart/CartProvider";
import { useBooking, type BookingPrefill } from "@/components/booking/BookingProvider";
import { CloseIcon } from "@/components/ui/icons";
import { DISHES } from "@/data/dishes";
import { BotFace } from "./BotFace";
import { GREETING, runFoodie, type FoodieCtx } from "./intents";

// Foodie: a rule-based chat widget. It owns only its own chat transcript — every
// action (add to cart, open booking) drives the REAL shared state via context.
// Launcher sits bottom-right so it clears the bottom-center cart pill.

// Pages that actually render the BookingWizard; elsewhere we route home to it.
const PAGES_WITH_BOOKING = ["/", "/contact"];

interface Msg {
  id: number;
  from: "user" | "foodie";
  text: string;
  quickReplies?: string[];
}

const reduceMotion = (): boolean =>
  matchMedia("(prefers-reduced-motion: reduce)").matches;

export function Foodie() {
  const cart = useCart();
  const booking = useBooking();
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");

  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);
  const nextId = (): number => ++idRef.current;

  const startBooking = (prefill?: BookingPrefill): void => {
    booking.requestOpen(prefill);
    if (!PAGES_WITH_BOOKING.includes(pathname)) router.push("/#book");
  };

  const send = (raw: string): void => {
    const text = raw.trim();
    if (!text) return;
    const ctx: FoodieCtx = { cart, menu: DISHES, booking, startBooking };
    const res = runFoodie(text, ctx);
    setMessages((prev) => [
      ...prev,
      { id: nextId(), from: "user", text },
      { id: nextId(), from: "foodie", text: res.text, quickReplies: res.quickReplies },
    ]);
    setInput("");
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    send(input);
  };

  const openPanel = (): void => {
    setOpen(true);
    setMessages((prev) =>
      prev.length
        ? prev
        : [{ id: nextId(), from: "foodie", text: GREETING.text, quickReplies: GREETING.quickReplies }],
    );
  };

  const closePanel = useCallback((): void => {
    const el = panelRef.current;
    if (!el || reduceMotion()) {
      setOpen(false);
      return;
    }
    gsap.to(el, {
      y: 20,
      scale: 0.96,
      opacity: 0,
      duration: 0.25,
      ease: "power3.in",
      transformOrigin: "bottom right",
      onComplete: () => setOpen(false),
    });
  }, []);

  // Tap/click outside the panel closes it (pointerdown so it beats other handlers).
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent): void => {
      if (!panelRef.current?.contains(e.target as Node)) closePanel();
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open, closePanel]);

  // Panel grows out of the launcher corner on open.
  useGSAP(
    () => {
      if (!open || !panelRef.current || reduceMotion()) return;
      gsap.from(panelRef.current, {
        y: 20,
        scale: 0.96,
        opacity: 0,
        duration: 0.35,
        ease: "power3.out",
        transformOrigin: "bottom right",
      });
    },
    { dependencies: [open], scope: rootRef },
  );

  // New messages: slide the latest in and keep the list pinned to the bottom.
  useGSAP(
    () => {
      const list = listRef.current;
      if (!list) return;
      const last = list.lastElementChild;
      if (last && !reduceMotion()) {
        gsap.from(last, { y: 10, opacity: 0, duration: 0.3, ease: "power2.out" });
      }
      list.scrollTop = list.scrollHeight;
    },
    { dependencies: [messages.length], scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      // On mobile the cart pill is a full-width bar at the bottom, so lift Foodie
      // above it whenever the cart has items. Desktop keeps it in the corner (the
      // pill is centered and narrow there — no collision).
      className={`fixed right-6 bottom-6 z-90 max-[640px]:right-4 ${
        cart.itemCount > 0 ? "max-[640px]:bottom-24" : "max-[640px]:bottom-4"
      }`}
    >
      {open ? (
        <div
          ref={panelRef}
          // The panel hugs its content and grows upward as the chat fills, capped
          // at these maxes (then the message list scrolls). Desktop: up to just
          // below the nav pill → 100dvh − 7rem. Phones (≤900px): portrait caps at
          // 70% of the screen, landscape near-full — orientation variants are
          // mutually exclusive so they never fight, and the width guard leaves
          // desktop alone.
          className="relative flex max-h-[calc(100dvh-5.5rem)] w-[min(92vw,380px)] flex-col overflow-hidden rounded-(--radius) border border-white/10 bg-surface/10 shadow-2xl backdrop-blur-lg [corner-shape:squircle] max-[900px]:portrait:max-h-[70dvh] max-[900px]:landscape:max-h-[92dvh]"
        >
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-white/8 px-5 py-4">
            <div className="flex items-center gap-2.5">
              <BotFace className="h-9 w-9 shrink-0" />
              <div className="leading-tight">
                <p className="font-display font-medium">Foodie</p>
                <p className="text-[.72rem] text-muted">Menu · orders · bookings</p>
              </div>
            </div>
            <button
              type="button"
              onClick={closePanel}
              aria-label="Close chat"
              className="grid h-8 w-8 cursor-pointer place-items-center rounded-full text-muted transition-colors hover:bg-surface hover:text-cream"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={listRef}
            role="log"
            aria-live="polite"
            className="flex min-h-0 flex-auto flex-col gap-3 overflow-y-auto overscroll-contain px-4 pt-4 pb-20 scrollbar-none [&::-webkit-scrollbar]:hidden"
          >
            {messages.map((msg) => (
              <div key={msg.id} className="flex flex-col gap-2">
                <div
                  className={
                    msg.from === "user"
                      ? "max-w-[85%] self-end rounded-2xl rounded-br-md bg-brand px-3.5 py-2 text-[.9rem] text-white [corner-shape:squircle]"
                      : "max-w-[85%] self-start rounded-2xl rounded-bl-md border border-white/10 bg-white/5 px-3.5 py-2 text-[.9rem] text-cream [corner-shape:squircle]"
                  }
                >
                  {msg.text}
                </div>
                {msg.quickReplies && msg.quickReplies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {msg.quickReplies.map((qr) => (
                      <button
                        key={qr}
                        type="button"
                        onClick={() => send(qr)}
                        className="cursor-pointer rounded-full border border-gold/40 bg-gold/5 px-3 py-1 font-display text-[.78rem] text-gold transition-colors hover:bg-gold/15"
                      >
                        {qr}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input — floats over the message list; messages scroll behind it and
              fade out under the gradient. */}
          <form
            onSubmit={onSubmit}
            className="absolute inset-x-0 bottom-0 z-10 flex items-center gap-2 bg-linear-to-t from-surface/90 via-surface/70 to-transparent px-3 pt-8 pb-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Foodie…"
              aria-label="Message Foodie"
              className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/6 px-4 py-2.5 text-[.9rem] text-cream [corner-shape:squircle] placeholder:text-muted focus:outline-2 focus:outline-offset-1 focus:outline-brand"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              aria-label="Send message"
              className="grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-full bg-brand text-white transition-[transform,opacity] hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <SendIcon className="h-4.5 w-4.5" />
            </button>
          </form>
        </div>
      ) : (
        <button
          type="button"
          onClick={openPanel}
          aria-label="Open Foodie chat"
          className="h-14 w-14 cursor-pointer drop-shadow-xl transition-transform hover:-translate-y-0.5"
        >
          <BotFace className="h-full w-full" />
        </button>
      )}
    </div>
  );
}

function SendIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}
