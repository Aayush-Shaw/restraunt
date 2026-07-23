"use client";

import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { type Dish, priceValue } from "@/data/dishes";

// Dishes carry no id in this codebase and names are unique, so the dish name is
// the cart key throughout. CartItem is a Dish plus a quantity.
export interface CartItem extends Dish {
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (dish: Dish) => void;
  incrementItem: (name: string) => void;
  decrementItem: (name: string) => void; // drops the line when it hits 0
  removeItem: (name: string) => void;
  clearCart: () => void;
  subtotal: number;
  itemCount: number;
}

type Action =
  | { type: "add"; dish: Dish }
  | { type: "increment"; name: string }
  | { type: "decrement"; name: string }
  | { type: "remove"; name: string }
  | { type: "clear" };

function reducer(items: CartItem[], action: Action): CartItem[] {
  switch (action.type) {
    case "add": {
      const found = items.some((i) => i.name === action.dish.name);
      if (found) {
        return items.map((i) =>
          i.name === action.dish.name ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...items, { ...action.dish, quantity: 1 }];
    }
    case "increment":
      return items.map((i) =>
        i.name === action.name ? { ...i, quantity: i.quantity + 1 } : i,
      );
    case "decrement":
      return items
        .map((i) =>
          i.name === action.name ? { ...i, quantity: i.quantity - 1 } : i,
        )
        .filter((i) => i.quantity > 0);
    case "remove":
      return items.filter((i) => i.name !== action.name);
    case "clear":
      return [];
  }
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(reducer, []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      addItem: (dish) => dispatch({ type: "add", dish }),
      incrementItem: (name) => dispatch({ type: "increment", name }),
      decrementItem: (name) => dispatch({ type: "decrement", name }),
      removeItem: (name) => dispatch({ type: "remove", name }),
      clearCart: () => dispatch({ type: "clear" }),
      subtotal: items.reduce((s, i) => s + priceValue(i.price) * i.quantity, 0),
      itemCount: items.reduce((s, i) => s + i.quantity, 0),
    }),
    [items],
  );

  // React 19: a Context object is itself the provider.
  return <CartContext value={value}>{children}</CartContext>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
