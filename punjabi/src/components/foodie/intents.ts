// Foodie's "intelligence": deterministic keyword/regex matching against a fixed
// set of intents. NO LLM, no network, no NLP — each intent has patterns and a
// pure-ish handler that reads REAL app data (menu, cart, booking) and returns a
// scripted reply plus optional quick-reply buttons. Add an intent by pushing to
// INTENTS; the widget never changes.

import { CONTACT } from "@/data/site";
import {
  HOME_DISHES,
  priceValue,
  spiceLabel,
  type Allergen,
  type Dish,
} from "@/data/dishes";
import { MAX_PARTY, TABLES } from "@/components/booking/tables";
import type { CartContextValue } from "@/components/cart/CartProvider";
import type {
  BookingContextValue,
  BookingPrefill,
} from "@/components/booking/BookingProvider";

export interface FoodieResponse {
  text: string;
  quickReplies?: string[];
}

export interface FoodieCtx {
  cart: CartContextValue;
  menu: Dish[];
  booking: BookingContextValue;
  /** Opens the real wizard (prefill + scroll/navigate); provided by the widget. */
  startBooking: (prefill?: BookingPrefill) => void;
}

export interface Intent {
  id: string;
  patterns: RegExp[];
  handler: (message: string, ctx: FoodieCtx) => FoodieResponse;
}

// ----- shared bits ---------------------------------------------------------

const HELP_REPLIES = [
  "See the menu",
  "Book a table",
  "What's spicy?",
  "Recommend something",
  "Hours & location",
  "Track my order",
];

const money = (n: number): string => `$${n.toFixed(2)}`;
const cap = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

function listNames(dishes: Dish[], n: number): string {
  const names = dishes.slice(0, n).map((d) => d.name);
  const extra = dishes.length - names.length;
  return names.join(", ") + (extra > 0 ? `, +${extra} more` : "");
}

function describeDish(d: Dish): string {
  const a = d.allergens.length
    ? ` Contains: ${d.allergens.join(", ")}.`
    : " No listed allergens.";
  return `${d.name} (${d.price}, ${spiceLabel(d.spiceLevel)}) — ${d.desc}${a}`;
}

const WORD_NUM: Record<string, number> = {
  a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
};

const STOP = new Set([
  "the", "and", "for", "add", "get", "want", "have", "order", "remove",
  "delete", "what", "whats", "much", "how", "price", "with", "from", "this",
  "that", "one", "two", "some", "any", "you", "your", "please", "give", "gimme",
]);

// Find menu dishes named in the message: prefer a full-name hit, else fall back
// to a keyword hit (so "naan" surfaces both naans for a disambiguation prompt).
function findDishesInMessage(menu: Dish[], msg: string): Dish[] {
  const m = msg.toLowerCase();
  const full = menu.filter((d) => m.includes(d.name.toLowerCase()));
  if (full.length) return full;
  const words = m.split(/[^a-z]+/).filter((w) => w.length >= 3 && !STOP.has(w));
  return menu.filter((d) => {
    const name = d.name.toLowerCase();
    return words.some((w) => name.includes(w));
  });
}

function parseQty(msg: string): number {
  const digit = msg.match(/\b(\d{1,2})\b/)?.[1];
  if (digit) return Math.min(20, Math.max(1, Number(digit)));
  const w = msg.toLowerCase().match(/\b(an?|one|two|three|four|five|six|seven|eight|nine|ten)\b/)?.[1];
  return w ? (WORD_NUM[w] ?? 1) : 1;
}

function parseParty(msg: string): number | null {
  const m = msg.toLowerCase();
  const digit = m.match(/\b(\d{1,2})\b/)?.[1];
  if (digit) return Math.min(MAX_PARTY, Math.max(1, Number(digit)));
  const w = m.match(/\b(one|two|three|four|five|six|seven|eight|nine|ten)\b/)?.[1];
  return w ? Math.min(MAX_PARTY, WORD_NUM[w] ?? 2) : null;
}

// ----- intent handlers -----------------------------------------------------

const greeting: Intent = {
  id: "greeting",
  patterns: [
    /^(hi|hey|hello|yo|hiya|sup|namaste|good (morning|evening|afternoon))[\s!.]*$/i,
    /^(help|what can you do|what do you do|how (does this|do you) work|who are you)/i,
  ],
  handler: () => ({
    text: "Hey! I'm Foodie. I can show you the menu, take your order, book a table, or point you to hours & location. What are you after?",
    quickReplies: HELP_REPLIES,
  }),
};

const lookup: Intent = {
  id: "lookup",
  patterns: [
    /what('?s| is) in my (cart|order|basket)/i,
    /\bmy (cart|order|basket|booking|reservation|table)\b/i,
    /what did i (order|book|reserve)/i,
    /where('?s| is) my order/i,
    /(order|booking|reservation) (status|details|summary)/i,
    /track my order/i,
  ],
  handler: (message, ctx) => {
    const m = message.toLowerCase();
    if (/book|reserv|table/.test(m) && !/cart|order|basket/.test(m)) {
      return bookingSummary(ctx);
    }
    const { items, subtotal, itemCount } = ctx.cart;
    if (!items.length) {
      return {
        text: "Your cart's empty right now. Hungry? I can add something.",
        quickReplies: ["What's spicy?", "Recommend something"],
      };
    }
    const lines = items
      .map((i) => `${i.quantity} × ${i.name} (${money(priceValue(i.price) * i.quantity)})`)
      .join("; ");
    return {
      text: `You've got ${itemCount} item${itemCount === 1 ? "" : "s"}: ${lines}. Subtotal ${money(subtotal)}.`,
      quickReplies: ["Add a naan", "Recommend something"],
    };
  },
};

function bookingSummary(ctx: FoodieCtx): FoodieResponse {
  const { party, date, time, selectedId, contact } = ctx.booking;
  const table = TABLES.find((t) => t.id === selectedId);
  const started = Boolean(table || contact.name || date || time);
  if (!started) {
    return {
      text: "You haven't started a booking yet. Want to reserve a table?",
      quickReplies: ["Book a table", "Book for 4"],
    };
  }
  const bits = [`party of ${party}`];
  if (date) bits.push(date);
  if (time) bits.push(time);
  if (table) bits.push(`table ${table.label} (${table.seats} seats)`);
  if (contact.name) bits.push(`under ${contact.name}`);
  return {
    text: `So far your booking is: ${bits.join(", ")}. Finish it in the form.`,
    quickReplies: ["Book a table"],
  };
}

const order: Intent = {
  id: "order",
  patterns: [
    // "i want" is intentionally NOT here — it collides with recommendation
    // phrasing ("I want something spicy"); "add"/"order"/"get me" are unambiguous.
    /\b(add|order|get me|gimme|give me|i'?ll have|throw in|put in)\b/i,
    /\b(remove|delete|take out|drop)\b/i,
  ],
  handler: (message, ctx) => {
    const remove = /\b(remove|delete|take out|drop)\b/i.test(message);
    const dishes = findDishesInMessage(ctx.menu, message);

    if (dishes.length === 0) {
      return {
        text: "I couldn't find that dish on our menu. Try a name like “Butter Chicken” or “Garlic Naan”.",
        quickReplies: ["See the menu", "What's spicy?"],
      };
    }
    if (dishes.length > 1) {
      const verb = remove ? "remove" : "add";
      return {
        text: `Which one did you mean — ${listNames(dishes, 4)}?`,
        quickReplies: dishes.slice(0, 4).map((d) => `${verb} ${d.name}`),
      };
    }

    const dish = dishes[0];
    if (!dish) return fallbackResponse();
    if (remove) {
      const inCart = ctx.cart.items.find((i) => i.name === dish.name);
      if (!inCart) {
        return {
          text: `${dish.name} isn't in your cart.`,
          quickReplies: ["What's in my cart?"],
        };
      }
      ctx.cart.removeItem(dish.name);
      const after = ctx.cart.subtotal - priceValue(dish.price) * inCart.quantity;
      return {
        text: `Removed ${dish.name}. Cart total is now ${money(after)}.`,
        quickReplies: ["What's in my cart?", "Recommend something"],
      };
    }

    const qty = parseQty(message);
    ctx.cart.addItem(dish);
    for (let i = 1; i < qty; i++) ctx.cart.incrementItem(dish.name);
    const afterSubtotal = ctx.cart.subtotal + priceValue(dish.price) * qty;
    const afterCount = ctx.cart.itemCount + qty;
    return {
      text: `Added ${qty} × ${dish.name} (${dish.price}). That's ${afterCount} item${afterCount === 1 ? "" : "s"}, ${money(afterSubtotal)} so far — your cart's at the bottom of the screen.`,
      quickReplies: ["What's in my cart?", "Add a garlic naan", "Recommend a drink"],
    };
  },
};

const booking: Intent = {
  id: "booking",
  patterns: [/\bbook(ing)?\b/i, /\breserv(e|ation)/i, /\btable for\b/i, /\bget a table\b/i],
  handler: (message, ctx) => {
    const party = parseParty(message);
    ctx.startBooking(party != null ? { party } : undefined);
    if (party == null) {
      return {
        text: "Opening the booking form for you — how many guests?",
        quickReplies: ["Book for 2", "Book for 4", "Book for 6"],
      };
    }
    return {
      text: `Opening the booking form for ${party} — pick your date, time and table there.`,
      quickReplies: ["What did I book?"],
    };
  },
};

const recommend: Intent = {
  id: "recommend",
  patterns: [
    /recommend|suggest|what should i|i (like|love|want|prefer|feel like)|in the mood|surprise me|popular|best[- ]?seller|favou?rite|signature|what'?s good/i,
  ],
  handler: (message, ctx) => {
    const m = message.toLowerCase();
    const byCat = (cat: Dish["category"]): Dish[] => ctx.menu.filter((d) => d.category === cat);

    if (/biryani|rice/.test(m)) return recReply(byCat("Biryani & Rice"), "the biryani & rice");
    if (/curry|gravy|masala/.test(m)) return recReply(byCat("Curries"), "a curry");
    if (/tandoor|grill|kebab|tikka|char/.test(m)) return recReply(byCat("Tandoori & Grill"), "off the grill");
    if (/starter|appetiz|snack/.test(m)) return recReply(byCat("Starters"), "a starter");
    if (/bread|naan|roti/.test(m)) return recReply(byCat("Breads"), "some bread");
    if (/dessert|sweet|drink|lassi|gulab/.test(m)) return recReply(byCat("Drinks & Dessert"), "to finish");
    if (/spic|hot|fiery/.test(m)) return recReply(ctx.menu.filter((d) => d.spiceLevel >= 2), "something with heat");
    if (/mild|not spicy/.test(m)) return recReply(ctx.menu.filter((d) => d.spiceLevel <= 1), "something mild");
    if (/chicken/.test(m)) return recReply(ctx.menu.filter((d) => /chicken/i.test(d.name)), "chicken");
    if (/lamb|mutton|gosht/.test(m)) return recReply(ctx.menu.filter((d) => /lamb|mutton|gosht/i.test(`${d.name} ${d.desc}`)), "lamb & mutton");
    if (/prawn|shrimp|fish|seafood/.test(m)) return recReply(ctx.menu.filter((d) => /prawn|fish/i.test(d.name)), "seafood");

    // No stated preference → lead with the signature/popular set.
    return {
      text: `Can't go wrong with our signatures: ${listNames(HOME_DISHES, 4)}. Butter Chicken is the one people cross the city for.`,
      quickReplies: ["Add Butter Chicken", "What's spicy?", "Book a table"],
    };
  },
};

function recReply(dishes: Dish[], phrase: string): FoodieResponse {
  if (!dishes.length) {
    return {
      text: `Nothing jumped out for that — try our signatures: ${listNames(HOME_DISHES, 3)}.`,
      quickReplies: ["See the menu"],
    };
  }
  const top = dishes.slice(0, 3);
  return {
    text: `For ${phrase}, try ${listNames(top, 3)}. Want me to add one?`,
    quickReplies: top.map((d) => `Add ${d.name}`),
  };
}

const menu: Intent = {
  id: "menu",
  patterns: [
    /\bspic|\bhot\b|fiery|heat|mild|not spicy/i,
    /vegan|vegetarian|veggie/i,
    /what('?s| is)?\s+in\b/i,
    /\bhow much|price|cost\b/i,
    /\bmenu\b|what do you (have|serve|offer)|what'?s (on|good)|options/i,
    /gluten[- ]?free|dairy[- ]?free|nut[- ]?free|without (gluten|dairy|nuts)|no (gluten|dairy|nuts)/i,
  ],
  handler: (message, ctx) => {
    const m = message.toLowerCase();
    const dishes = findDishesInMessage(ctx.menu, message);

    if (/vegan|vegetarian|veggie/.test(m)) {
      return {
        text: "We're a charcoal non-veg kitchen, so there's no vegan menu — dishes aren't tagged that way. A few skip the meat though, like Dal Makhani and Jeera Rice. Want what's mild or dairy-free instead?",
        quickReplies: ["What's mild?", "Dairy-free options", "See the menu"],
      };
    }
    if (/gluten[- ]?free|without gluten|no gluten/.test(m)) return allergenFree(ctx.menu, "gluten", "gluten-free");
    if (/dairy[- ]?free|without dairy|no dairy/.test(m)) return allergenFree(ctx.menu, "dairy", "dairy-free");
    if (/nut[- ]?free|without nuts|no nuts/.test(m)) return allergenFree(ctx.menu, "nuts", "nut-free");
    if (/mild|not spicy|no spice|less spic/.test(m)) return spiceReply("mild", ctx.menu.filter((d) => d.spiceLevel <= 1));
    if (/spic|hot|fiery|heat/.test(m)) return spiceReply("spicy", ctx.menu.filter((d) => d.spiceLevel >= 2));

    const first = dishes[0];
    if (/how much|price|cost/.test(m) && first) {
      return { text: `${first.name} is ${first.price}.`, quickReplies: [`Add ${first.name}`, "See the menu"] };
    }
    if (dishes.length === 1 && first) {
      return {
        text: describeDish(first),
        quickReplies: [`Add ${first.name}`, "Recommend something"],
      };
    }
    if (dishes.length > 1) {
      return {
        text: `Which did you mean — ${listNames(dishes, 4)}?`,
        quickReplies: dishes.slice(0, 4).map((d) => `What's in ${d.name}`),
      };
    }
    return {
      text: "Our menu runs starters, tandoori & grill, curries, biryani & rice, breads, and drinks & dessert — mains about $13–$23. Ask “what's spicy”, “what's in butter chicken”, or say “add a garlic naan”. Full list is on the Menu page.",
      quickReplies: ["What's spicy?", "Recommend something", "Book a table"],
    };
  },
};

function spiceReply(kind: string, dishes: Dish[]): FoodieResponse {
  const head = dishes[0];
  return {
    text: `${cap(kind)} picks: ${listNames(dishes, 5)}.`,
    quickReplies: head ? [`Add ${head.name}`, "Recommend something"] : ["See the menu"],
  };
}

function allergenFree(menuData: Dish[], al: Allergen, label: string): FoodieResponse {
  const list = menuData.filter((d) => !d.allergens.includes(al));
  return {
    text: `${cap(label)} dishes include: ${listNames(list, 6)}. Always double-check with staff for cross-contact.`,
    quickReplies: ["See the menu", "Recommend something"],
  };
}

// Static Q&A — answers pulled from real site data (CONTACT + the FAQ section +
// the cart's delivery fee). Nothing invented; unknowns point to the phone line.
const FAQ: { patterns: RegExp[]; answer: string }[] = [
  { patterns: [/hour|open|clos(e|ing)|timing|what time/i], answer: `We're open daily, 11:00 AM to 11:00 PM.` },
  { patterns: [/where|location|address|located|direction|find (you|it)/i], answer: `We're at ${CONTACT.address}.` },
  { patterns: [/phone|call|contact|reach|number/i], answer: `Give us a call at ${CONTACT.phoneDisplay}.` },
  { patterns: [/park/i], answer: `I don't have parking details on hand — best to call us at ${CONTACT.phoneDisplay}.` },
  { patterns: [/deliver|take[- ]?out|take[- ]?away|pick[- ]?up/i], answer: `You can build an order right here and check out — delivery is a flat $2.99 fee at checkout.` },
  { patterns: [/allergen|allergy|allergic/i], answer: `Every dish is labelled with common allergens — dairy, gluten, nuts, fish, shellfish. Tell our staff about any dietary needs before you order.` },
  { patterns: [/walk[- ]?in|reservation|without (a )?booking|do i need/i], answer: `Reservations are quickest by phone (${CONTACT.phoneDisplay}) or the booking form here. Friday and Saturday nights fill fast, so book ahead for those.` },
  { patterns: [/how spicy|spice level|adjust (the )?spice/i], answer: `Every dish is marked mild to extra hot, and the kitchen can tone it up or down where it can — just ask.` },
  { patterns: [/price range|expensive|cheap|cost range/i], answer: `Most mains run about $13 to $23; starters, breads, rice and drinks are less.` },
];

const faq: Intent = {
  id: "faq",
  patterns: FAQ.flatMap((f) => f.patterns),
  handler: (message) => {
    const entry = FAQ.find((f) => f.patterns.some((p) => p.test(message)));
    return {
      text: entry?.answer ?? `Give us a call at ${CONTACT.phoneDisplay} and we'll help.`,
      quickReplies: ["Book a table", "See the menu"],
    };
  },
};

// ----- engine --------------------------------------------------------------

// First match wins, so order matters: greetings and lookups ("what did I book")
// are checked before the verbs (order/booking) that share their keywords.
export const INTENTS: Intent[] = [greeting, lookup, order, booking, recommend, menu, faq];

export function fallbackResponse(): FoodieResponse {
  return {
    text: "I didn't quite catch that. I can help with the menu, orders, table bookings, hours, and recommendations — try one of these:",
    quickReplies: HELP_REPLIES,
  };
}

export function runFoodie(message: string, ctx: FoodieCtx): FoodieResponse {
  const msg = message.trim();
  if (!msg) return fallbackResponse();
  for (const intent of INTENTS) {
    if (intent.patterns.some((p) => p.test(msg))) return intent.handler(msg, ctx);
  }
  return fallbackResponse();
}

export const GREETING: FoodieResponse = {
  text: "Hi, I'm Foodie — your table-side helper. Ask me about the menu, add dishes to your cart, or book a table.",
  quickReplies: ["See the menu", "Book a table", "Track my order"],
};
