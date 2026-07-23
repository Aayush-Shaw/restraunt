"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { useCart } from "@/components/cart/CartProvider";
import { priceValue } from "@/data/dishes";
import { DummyPaymentButton } from "@/components/ui/DummyPaymentButton";

// Fixed dummy delivery address for the demo (editable field, no real geocoding).
const DUMMY_ADDRESS = "221B Jasper Ave, Edmonton, AB";

const stepBtn =
  "grid h-7 w-7 place-items-center rounded-full text-[1.1rem] leading-none text-cream transition-colors hover:bg-white/[.12]";

export function CartIsland() {
  const { items, itemCount, subtotal, incrementItem, decrementItem, clearCart } =
    useCart();
  const [expanded, setExpanded] = useState(false);
  const [paid, setPaid] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // GSAP expand: the panel grows out of the pill from the bottom-center.
  useGSAP(
    () => {
      if (!expanded || !panelRef.current) return;
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(panelRef.current, {
        y: 24,
        scale: 0.96,
        opacity: 0,
        duration: 0.4,
        ease: "power3.out",
        transformOrigin: "bottom center",
      });
    },
    { dependencies: [expanded], scope: rootRef },
  );

  // Nothing floats on screen for an empty cart. (Hooks run first, above.)
  if (itemCount === 0) return null;

  const close = (): void => {
    setExpanded(false);
    setPaid(false);
  };

  return (
    <div
      ref={rootRef}
      className="fixed bottom-6 left-1/2 z-90 -translate-x-1/2 max-[640px]:bottom-4 max-[640px]:w-[92vw]"
    >
      {expanded ? (
        <div
          ref={panelRef}
          className="flex max-h-[70vh] w-[min(92vw,420px)] flex-col overflow-hidden rounded-(--radius) border border-white/10 bg-surface/95 shadow-2xl backdrop-blur-lg [corner-shape:squircle]"
        >
          <div className="flex items-center justify-between border-b border-white/8 px-6 py-4">
            <h2 className="font-display text-[1.15rem] font-medium">Your order</h2>
            <button
              type="button"
              onClick={close}
              aria-label="Close cart"
              className="grid h-8 w-8 place-items-center rounded-full text-muted transition-colors hover:bg-white/[.08] hover:text-cream"
            >
              ✕
            </button>
          </div>

          {paid ? (
            <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-brand/15 text-[1.8rem] text-brand">
                ✓
              </span>
              <p className="font-display text-[1.25rem] font-medium">
                Payment successful
              </p>
              <p className="text-[.9rem] text-muted">
                Your order is on its way to {DUMMY_ADDRESS}.
              </p>
              <button
                type="button"
                onClick={() => {
                  clearCart();
                  close();
                }}
                className="mt-2 cursor-pointer rounded-full border border-white/15 px-6 py-2 font-display text-[.9rem] text-cream transition-colors hover:bg-white/[.08]"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              <ul className="flex-1 divide-y divide-white/6 overflow-y-auto px-6">
                {items.map((item) => (
                  <li key={item.name} className="flex items-center gap-3 py-3.5">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
                      <Image
                        src={item.img}
                        alt={item.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-[.95rem]">
                        {item.name}
                      </p>
                      <p className="text-[.82rem] text-gold">
                        ${(priceValue(item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[.05] px-1 py-0.5">
                      <button
                        type="button"
                        onClick={() => decrementItem(item.name)}
                        aria-label={`Remove one ${item.name}`}
                        className={stepBtn}
                      >
                        −
                      </button>
                      <span className="w-5 text-center font-display text-[.9rem] tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => incrementItem(item.name)}
                        aria-label={`Add one ${item.name}`}
                        className={stepBtn}
                      >
                        +
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="border-t border-white/8 px-6 py-4">
                <label className="mb-3 block">
                  <span className="mb-1.5 block font-display text-[.78rem] tracking-[0.04em] text-muted uppercase">
                    Deliver to
                  </span>
                  <input
                    type="text"
                    defaultValue={DUMMY_ADDRESS}
                    aria-label="Delivery address"
                    className="w-full rounded-[var(--radius-input)] border border-white/10 bg-white/[.06] px-3.5 py-2.5 text-[.9rem] text-cream [corner-shape:squircle] placeholder:text-muted focus:outline-2 focus:outline-offset-1 focus:outline-brand"
                  />
                </label>
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-display text-muted">Subtotal</span>
                  <span className="font-display text-[1.2rem] font-medium text-gold">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <DummyPaymentButton
                  amount={subtotal}
                  label="Pay"
                  onSuccess={() => setPaid(true)}
                  className="w-full"
                />
              </div>
            </>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="flex cursor-pointer items-center gap-3 rounded-full border border-white/10 bg-brand px-6 py-3.5 font-display font-medium text-white shadow-2xl transition-transform hover:-translate-y-0.5 max-[640px]:w-full max-[640px]:justify-center"
        >
          <span aria-hidden="true">🛒</span>
          <span className="tabular-nums">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </span>
          <span className="h-4 w-px bg-white/30" />
          <span className="tabular-nums">${subtotal.toFixed(2)}</span>
        </button>
      )}
    </div>
  );
}
