"use client";

import type { Dish } from "@/data/dishes";
import { useCart } from "@/components/cart/CartProvider";

// "+ Add" on a dish card that morphs into a [ − qty + ] stepper. Reads its
// quantity straight from the shared cart, so the card and the floating island
// stay in lockstep.
const stepBtn =
  "grid h-9 w-9 place-items-center rounded-full text-[1.2rem] leading-none text-cream transition-colors hover:bg-white/[.12] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:opacity-40";

export function AddToCartButton({ dish }: { dish: Dish }) {
  const { items, addItem, incrementItem, decrementItem } = useCart();
  const quantity = items.find((i) => i.name === dish.name)?.quantity ?? 0;

  if (quantity === 0) {
    return (
      <button
        type="button"
        onClick={() => addItem(dish)}
        className="mt-5 w-full cursor-pointer rounded-full border border-brand/40 bg-brand/10 py-2.5 font-display text-[.9rem] font-medium text-cream transition-colors hover:bg-brand hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        + Add
      </button>
    );
  }

  return (
    <div className="mt-5 flex items-center justify-between rounded-full border border-brand/40 bg-brand/10 px-1.5 py-1.5">
      <button
        type="button"
        onClick={() => decrementItem(dish.name)}
        aria-label={`Remove one ${dish.name}`}
        className={stepBtn}
      >
        −
      </button>
      <span
        className="font-display text-[1rem] font-medium tabular-nums text-cream"
        aria-live="polite"
      >
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => incrementItem(dish.name)}
        aria-label={`Add one ${dish.name}`}
        className={stepBtn}
      >
        +
      </button>
    </div>
  );
}
