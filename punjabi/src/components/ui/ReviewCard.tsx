import Image from "next/image";
import type { Review } from "@/data/site";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <blockquote data-reveal="" className="flex flex-col gap-3.5">
      <div className="tracking-[0.2em] text-gold" aria-label="5 out of 5 stars">
        ★★★★★
      </div>
      <p className="text-[1.3rem] italic leading-[1.45]">{review.quote}</p>
      <div className="mt-1 flex items-center gap-3">
        {/* TODO(launch): stock portraits — swap for real guest photos (with consent). */}
        <Image
          src={review.img}
          alt=""
          width={44}
          height={44}
          className="h-11 w-11 rounded-full border-2 border-white/15 object-cover"
        />
        <cite className="text-[.95rem] not-italic text-muted">{review.cite}</cite>
      </div>
    </blockquote>
  );
}
