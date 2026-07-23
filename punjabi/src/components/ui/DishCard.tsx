import Image from "next/image";
import type { Dish } from "@/data/dishes";
import { spiceLabel } from "@/data/dishes";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

const cap = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

function Flame({ on }: { on: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={
        on
          ? "h-4 w-4 fill-brand"
          : "h-4 w-4 fill-none stroke-white/20 stroke-[1.6]"
      }
    >
      <path d="M12 2C9 6 7 8.3 7 12a5 5 0 0 0 10 0c0-1.7-.7-3.1-1.6-4.3-.3 1-.9 1.8-1.9 2.3.5-2.7-.6-5.6-1.5-8z" />
    </svg>
  );
}

export function DishCard({ dish, hidden = false }: { dish: Dish; hidden?: boolean }) {
  const { name, desc, price, img, spiceLevel, allergens } = dish;
  return (
    <article
      data-dish=""
      data-reveal=""
      hidden={hidden}
      className="dish-card relative rounded-(--radius) [corner-shape:squircle] border border-white/8 bg-surface/30 p-6 max-[640px]:p-4"
    >
      <div className="relative mx-auto mb-6 aspect-square w-[min(240px,80%)] overflow-hidden rounded-full max-[640px]:mb-4 max-[640px]:w-[min(150px,72%)]">
        <Image src={img} alt={name} fill sizes="240px" className="object-cover" />
      </div>
      <h3 className="font-display text-[1.5rem] font-medium max-[640px]:text-balance max-[640px]:text-[1.05rem] max-[640px]:leading-tight">
        {name}
      </h3>
      <p className="mt-2 mb-3 text-muted max-[640px]:mt-1.5 max-[640px]:mb-2.5 max-[640px]:line-clamp-2 max-[640px]:text-[.82rem] max-[640px]:leading-[1.45]">
        {desc}
      </p>
      <span className="font-display font-medium tracking-[0.03em] text-[1.1rem] text-gold max-[640px]:text-base">
        {price}
      </span>

      <div className="mt-3.5 flex flex-wrap items-center gap-x-3 gap-y-2 max-[640px]:mt-2.5 max-[640px]:gap-x-2.5 max-[640px]:gap-y-1.5">
        <span
          className="inline-flex gap-0.75"
          role="img"
          aria-label={`Spice level: ${spiceLabel(spiceLevel)}`}
        >
          {[0, 1, 2].map((i) => (
            <Flame key={i} on={i < spiceLevel} />
          ))}
        </span>
        <span className="inline-flex flex-wrap gap-1.5">
          {allergens.length > 0 ? (
            <>
              <span className="sr-only">Contains: {allergens.join(", ")}</span>
              {allergens.map((a) => (
                <span
                  key={a}
                  aria-hidden="true"
                  className="whitespace-nowrap rounded-full border border-white/10 bg-white/6 px-2.5 py-1 font-display text-[.72rem] tracking-[0.04em] text-muted"
                >
                  {cap(a)}
                </span>
              ))}
            </>
          ) : (
            <>
              <span className="sr-only">No major allergens</span>
              <span
                aria-hidden="true"
                className="whitespace-nowrap rounded-full border border-white/10 bg-white/6 px-2.5 py-1 font-display text-[.72rem] italic tracking-[0.04em] text-muted"
              >
                No major allergens
              </span>
            </>
          )}
        </span>
      </div>

      <AddToCartButton dish={dish} />
    </article>
  );
}
