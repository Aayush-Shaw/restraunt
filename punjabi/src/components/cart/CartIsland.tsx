"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { useCart } from "@/components/cart/CartProvider";
import { priceValue } from "@/data/dishes";
import { DummyPaymentButton } from "@/components/ui/DummyPaymentButton";
import { BagIcon, CheckIcon, CloseIcon } from "@/components/ui/icons";

// Fixed dummy delivery address for the demo (editable field, no real geocoding).
const DUMMY_ADDRESS = "221B Jasper Ave, Edmonton, AB";
const DELIVERY_FEE = 2.99; // flat dummy fee for the payment breakdown

const stepBtn =
  "grid h-7 w-7 place-items-center rounded-full text-[1.1rem] leading-none text-cream transition-colors hover:bg-white/[.12]";

export function CartIsland() {
  const { items, itemCount, subtotal, incrementItem, decrementItem, clearCart } =
    useCart();
  const [expanded, setExpanded] = useState(false);
  const [paid, setPaid] = useState(false);
  const [rendered, setRendered] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const hasItems = itemCount > 0;

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

  // Island spring: the pill rises from below the screen when the cart first fills
  // (back.out overshoots for the spring). GSAP owns `transform` here while the
  // Tailwind `-translate-x-1/2` centering owns `translate` — never the same prop.
  useGSAP(
    () => {
      if (!rendered || !rootRef.current) return;
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(rootRef.current, { y: 140, duration: 0.6, ease: "back.out(1.6)" });
    },
    { dependencies: [rendered], scope: rootRef },
  );

  // Exit: when the cart empties, spring the island back down, then unmount once
  // the tween finishes. The only setState here is inside onComplete (a callback,
  // not the effect body) — mounting is handled during render below.
  useEffect(() => {
    if (hasItems || !rendered) return;
    const el = rootRef.current;
    if (!el) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tween = gsap.to(el, {
      y: 140,
      duration: reduce ? 0 : 0.4,
      ease: "back.in(1.4)",
      onComplete: () => setRendered(false),
    });
    return () => {
      tween.kill();
    };
  }, [hasItems, rendered]);

  // Collapse (reverse the grow, then unmount) + click-away — both live only while
  // expanded. closeRef exposes the animated close to the header X button. Ref
  // access stays inside the effect, never during render.
  const closeRef = useRef<() => void>(() => {});
  useEffect(() => {
    if (!expanded) return;
    const el = panelRef.current;
    const done = (): void => {
      setExpanded(false);
      setPaid(false);
    };
    const doClose = (): void => {
      if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) {
        done();
        return;
      }
      gsap.to(el, {
        y: 24,
        scale: 0.96,
        opacity: 0,
        duration: 0.3,
        ease: "power3.in",
        transformOrigin: "bottom center",
        onComplete: done,
      });
    };
    closeRef.current = doClose;
    const onDown = (e: PointerEvent): void => {
      if (!el?.contains(e.target as Node)) doClose();
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [expanded]);

  // Mount as soon as the cart has items. React allows this convergent, conditional
  // setState during render — it keeps mount-sync out of an effect. Then stay
  // mounted through the exit spring (the effect above unmounts when it finishes).
  if (hasItems && !rendered) setRendered(true);
  if (!rendered) return null;

  const total = subtotal + DELIVERY_FEE;

  return (
    <div
      ref={rootRef}
      className="fixed bottom-6 left-1/2 z-90 -translate-x-1/2 max-[640px]:bottom-4 max-[640px]:w-[92vw]"
    >
      {expanded ? (
        <div
          ref={panelRef}
          className="flex max-h-[70vh] w-[min(92vw,420px)] flex-col overflow-hidden rounded-(--radius) border border-white/10 bg-surface/10 shadow-2xl backdrop-blur-lg [corner-shape:squircle] landscape:w-[min(94vw,720px)]"
        >
          <div className="flex items-center justify-between border-b border-white/8 px-6 py-4">
            <h2 className="font-display text-[1.15rem] font-medium">Your order</h2>
            <button
              type="button"
              onClick={() => closeRef.current()}
              aria-label="Close cart"
              className="grid h-8 w-8 place-items-center rounded-full text-muted transition-colors hover:bg-surface hover:text-cream"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>

          {paid ? (
            <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-brand/15 text-brand">
                <CheckIcon className="h-7 w-7" />
              </span>
              <p className="font-display text-[1.25rem] font-medium">
                Payment successful
              </p>
              <p className="text-[.9rem] text-muted">
                Your order is on its way to {DUMMY_ADDRESS}.
              </p>
              <button
                type="button"
                onClick={clearCart}
                className="mt-2 cursor-pointer rounded-full border border-white/15 px-6 py-2 font-display text-[.9rem] text-cream transition-colors hover:bg-white/8"
              >
                Done
              </button>
            </div>
          ) : (
            // Landscape splits into two columns: items on the left, delivery +
            // payment on the right. Portrait stays a single stacked column.
            <div className="flex min-h-0 flex-1 flex-col landscape:flex-row">
              <ul className="min-h-0 flex-1 divide-y divide-white/6 overflow-y-auto px-6 landscape:basis-1/2">
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
                    <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-transparent px-0.5 py-0.5">
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

              <div className="flex flex-col border-t border-white/8 px-6 py-4 landscape:basis-1/2 landscape:overflow-y-auto landscape:border-t-0 landscape:border-l">
                <label className="mb-3 block">
                  <span className="mb-1.5 block font-display text-[.78rem] tracking-[0.04em] text-muted uppercase">
                    Deliver to
                  </span>
                  <input
                    type="text"
                    defaultValue={DUMMY_ADDRESS}
                    aria-label="Delivery address"
                    className="w-full rounded-(--radius-input) border border-white/10 bg-transparent px-3 py-2 text-[.9rem] text-cream [corner-shape:squircle] placeholder:text-muted focus:outline-2 focus:outline-offset-1 focus:outline-brand"
                  />
                </label>

                {/* Payment breakdown */}
                <div className="mt-4 space-y-2 landscape:mt-auto">
                  <div className="flex items-center justify-between text-[.9rem]">
                    <span className="text-muted">Subtotal</span>
                    <span className="tabular-nums text-cream">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[.9rem]">
                    <span className="text-muted">Delivery</span>
                    <span className="tabular-nums text-cream">${DELIVERY_FEE.toFixed(2)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between border-t border-white/8 pt-2.5">
                    <span className="font-display font-medium">Total</span>
                    <span className="font-display text-[1.2rem] font-medium tabular-nums text-gold">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <DummyPaymentButton
                  amount={total}
                  label="Pay"
                  onSuccess={() => setPaid(true)}
                  className="mt-4 w-full"
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="flex cursor-pointer items-center gap-3 rounded-full border border-white/10 bg-brand px-6 py-3.5 font-display font-medium text-white shadow-2xl transition-transform hover:-translate-y-0.5 max-[640px]:w-full max-[640px]:justify-center"
        >
          <BagIcon className="h-4.5 w-4.5" />
          {hasItems && (
            <>
              <span className="tabular-nums">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </span>
              <span className="h-4 w-px bg-white/30" />
              <span className="tabular-nums">${subtotal.toFixed(2)}</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
