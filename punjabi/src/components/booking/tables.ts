// Booking wizard domain types + mocked floor plan. Typed so it's a drop-in swap
// for real availability later.
// TODO: replace TABLES with live availability from a booking backend.

export type BookingStep =
  | "party-size"
  | "table-map"
  | "contact"
  | "confirmed";

export interface Table {
  id: string;
  label: string; // e.g. "6S-1", "2S-3", "4S-5"
  seats: 2 | 4 | 6;
  status: "available" | "booked" | "selected";
}

// Largest table seats 6 → party size caps here.
export const MAX_PARTY = 6;

// 5 tables per seat-size; bookedIdx marks which are already taken.
const column = (
  prefix: string,
  seats: 2 | 4 | 6,
  bookedIdx: readonly number[],
): Table[] =>
  Array.from({ length: 5 }, (_, i) => ({
    id: `${prefix}-${i + 1}`,
    label: `${prefix}-${i + 1}`,
    seats,
    status: bookedIdx.includes(i) ? "booked" : "available",
  }));

// Column order matches the map layout: 6-seat | 2-seat | 4-seat.
export const TABLES: readonly Table[] = [
  ...column("6S", 6, [1, 3]),
  ...column("2S", 2, [0]),
  ...column("4S", 4, [2, 4]),
];
