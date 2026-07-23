"use client";

import { useEffect, useRef } from "react";
import { AuthCard, type AuthMode } from "@/components/auth/AuthCard";
import { CloseIcon } from "@/components/ui/icons";

// Native <dialog>: Escape-to-close, focus trapping, the inert background and the
// ::backdrop all come from the platform, so none of it is hand-rolled here.
export function AuthOverlay({
  initialMode,
  onClose,
}: {
  initialMode: AuthMode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    ref.current?.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      // A click on the backdrop targets the dialog itself, never its contents.
      onClick={(e) => {
        if (e.target === ref.current) ref.current?.close();
      }}
      aria-label={initialMode === "signup" ? "Create account" : "Log in"}
      className="m-auto max-h-none max-w-none border-0 bg-transparent p-4 text-cream backdrop:backdrop-blur-xl"
    >
      {/* Width tracks AuthCard's own max-w at both orientations, so the close
          button anchors to the card's edge instead of floating past it. */}
      <div className="relative max-h-[92svh] w-[92vw] max-w-105 overflow-y-auto landscape:w-[94vw] landscape:max-w-180">
        <button
          type="button"
          onClick={() => ref.current?.close()}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 grid h-8 w-8 cursor-pointer place-items-center rounded-full text-muted transition-colors hover:bg-surface hover:text-cream"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
        <AuthCard initialMode={initialMode} onDone={() => ref.current?.close()} />
      </div>
    </dialog>
  );
}
