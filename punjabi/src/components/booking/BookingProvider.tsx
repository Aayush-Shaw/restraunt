"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import type { BookingStep } from "./tables";

// Shared booking state, lifted out of BookingWizard so Foodie (mounted globally in
// layout) drives and reads the SAME reservation the on-page wizard shows — no
// parallel booking store. The wizard consumes every field; Foodie writes via
// requestOpen (prefill + a nonce the wizard watches to scroll itself into view)
// and reads party/table/contact for the "what did I book" lookup.

export interface Contact {
  name: string;
  phone: string;
  email: string;
}

export interface BookingPrefill {
  party?: number;
}

export interface BookingContextValue {
  step: BookingStep;
  setStep: (s: BookingStep) => void;
  party: number;
  setParty: (n: number) => void;
  date: string;
  setDate: (s: string) => void;
  time: string;
  setTime: (s: string) => void;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  contact: Contact;
  setContact: Dispatch<SetStateAction<Contact>>;
  reset: () => void;
  /** >0 when Foodie has asked to open the wizard; the wizard scrolls, then consumes it. */
  pendingOpen: number;
  requestOpen: (prefill?: BookingPrefill) => void;
  consumeOpen: () => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

const EMPTY_CONTACT: Contact = { name: "", phone: "", email: "" };

export function BookingProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState<BookingStep>("party-size");
  const [party, setParty] = useState(2);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [contact, setContact] = useState<Contact>(EMPTY_CONTACT);
  const [pendingOpen, setPendingOpen] = useState(0);

  const reset = useCallback((): void => {
    setStep("party-size");
    setParty(2);
    setDate("");
    setTime("");
    setSelectedId(null);
    setContact(EMPTY_CONTACT);
  }, []);

  const requestOpen = useCallback((prefill?: BookingPrefill): void => {
    if (prefill?.party != null) {
      setParty(prefill.party);
      setStep("party-size");
    }
    setPendingOpen((n) => n + 1);
  }, []);

  const consumeOpen = useCallback((): void => setPendingOpen(0), []);

  const value = useMemo<BookingContextValue>(
    () => ({
      step,
      setStep,
      party,
      setParty,
      date,
      setDate,
      time,
      setTime,
      selectedId,
      setSelectedId,
      contact,
      setContact,
      reset,
      pendingOpen,
      requestOpen,
      consumeOpen,
    }),
    [step, party, date, time, selectedId, contact, reset, pendingOpen, requestOpen, consumeOpen],
  );

  // React 19: a Context object is itself the provider.
  return <BookingContext value={value}>{children}</BookingContext>;
}

export function useBooking(): BookingContextValue {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}
