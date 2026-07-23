"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { CheckIcon } from "@/components/ui/icons";

// Shared dummy payment control — used by both the cart checkout (Task 3) and the
// $10 booking fee (Task 4). Simulates a gateway round-trip, then fires onSuccess
// so the parent renders its own confirmation. No real payment processing.
// TODO: wire to a real payment provider (Stripe, etc.).
type Phase = "idle" | "processing" | "paid";

export function DummyPaymentButton({
  amount,
  label = "Pay",
  onSuccess,
  className = "",
}: {
  amount: number;
  label?: string;
  onSuccess: () => void;
  className?: string;
}) {
  const [phase, setPhase] = useState<Phase>("idle");

  const pay = (): void => {
    if (phase !== "idle") return;
    setPhase("processing");
    // TODO: replace this timeout with a real charge call.
    setTimeout(() => {
      setPhase("paid");
      onSuccess();
    }, 900);
  };

  return (
    <Button onClick={pay} disabled={phase !== "idle"} className={className}>
      {phase === "processing" ? (
        "Processing…"
      ) : phase === "paid" ? (
        <span className="inline-flex items-center gap-1.5">
          Paid
          <CheckIcon className="h-4 w-4" />
        </span>
      ) : (
        `${label} · $${amount.toFixed(2)}`
      )}
    </Button>
  );
}
