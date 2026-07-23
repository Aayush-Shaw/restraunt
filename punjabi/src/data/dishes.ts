// Menu data — single source of truth, ported verbatim from the static script.js.
// The original 6 keep their local photos + copy; newer dishes use the same
// verified Unsplash placeholders (square-cropped, lazy-loaded).

export type DishCategory =
  | "Starters"
  | "Tandoori & Grill"
  | "Curries"
  | "Biryani & Rice"
  | "Breads"
  | "Drinks & Dessert";

export type Allergen = "dairy" | "gluten" | "nuts" | "fish" | "shellfish";

export type SpiceLevel = 0 | 1 | 2 | 3;

export interface Dish {
  name: string;
  category: DishCategory;
  price: string;
  img: string;
  spiceLevel: SpiceLevel;
  allergens: Allergen[];
  desc: string;
}

const ux = (id: string): string =>
  `https://images.unsplash.com/photo-${id}?w=600&h=600&fit=crop&q=70`;

export const DISHES: Dish[] = [
  // Starters
  { name: "Amritsari Fish", category: "Starters", price: "$15.99", img: "/images/dish-amritsari-fish.jpg", spiceLevel: 2, allergens: ["fish", "gluten"], desc: "Ajwain-spiked batter, fried crisp the way the street stalls of Amritsar do it. Lemon. Done." },
  { name: "Chicken Pakora", category: "Starters", price: "$12.99", img: ux("1610057099431-d73a1c9d2f2f"), spiceLevel: 1, allergens: [], desc: "Chickpea batter, carom seed, fried gold. Gone before they hit the table." },
  { name: "Tandoori Wings", category: "Starters", price: "$13.99", img: ux("1685798830572-f07ff7635774"), spiceLevel: 2, allergens: ["dairy"], desc: "Charcoal-blistered wings, yogurt overnight, brushed with chilli-ghee." },
  // Tandoori & Grill
  { name: "Tandoori Chicken", category: "Tandoori & Grill", price: "$16.99", img: "/images/dish-tandoori-chicken.jpg", spiceLevel: 2, allergens: ["dairy"], desc: "Yogurt and spice marinade overnight, then blistered over live charcoal. Smoke does the rest." },
  { name: "Chicken Tikka", category: "Tandoori & Grill", price: "$15.99", img: "/images/dish-chicken-tikka.jpg", spiceLevel: 2, allergens: ["dairy"], desc: "Boneless smoky bites, charred edges, basted in butter while they rest. They rarely get to rest." },
  { name: "Seekh Kebab", category: "Tandoori & Grill", price: "$14.99", img: "/images/dish-seekh-kebab.jpg", spiceLevel: 2, allergens: [], desc: "Hand-pressed lamb skewers straight off the smoke, with mint chutney that bites back." },
  { name: "Tandoori Lamb Chops", category: "Tandoori & Grill", price: "$22.99", img: ux("1685798830572-f07ff7635774"), spiceLevel: 2, allergens: ["dairy"], desc: "Frenched chops, day-long marinade, seared hard over open coal. Pink at the bone." },
  { name: "Malai Tikka", category: "Tandoori & Grill", price: "$16.99", img: ux("1610057099431-d73a1c9d2f2f"), spiceLevel: 0, allergens: ["dairy", "nuts"], desc: "Chicken in a cream-and-cheese marinade, kissed by smoke, barely charred." },
  { name: "Tandoori Prawns", category: "Tandoori & Grill", price: "$19.99", img: ux("1685798830572-f07ff7635774"), spiceLevel: 2, allergens: ["shellfish"], desc: "Jumbo prawns, carom and red chilli, straight off the skewer." },
  { name: "Reshmi Kebab", category: "Tandoori & Grill", price: "$15.99", img: ux("1610057099431-d73a1c9d2f2f"), spiceLevel: 1, allergens: ["dairy", "nuts"], desc: "Silken chicken mince, saffron and cream, grilled soft." },
  // Curries
  { name: "Butter Chicken", category: "Curries", price: "$18.99", img: "/images/dish-butter-chicken.jpg", spiceLevel: 1, allergens: ["dairy", "nuts"], desc: "Tandoor-charred thigh folded into a slow tomato-butter gravy. The one people cross the city for." },
  { name: "Rara Gosht", category: "Curries", price: "$21.99", img: "/images/dish-rara-gosht.jpg", spiceLevel: 3, allergens: ["dairy"], desc: "Slow mutton curry doubled down with spiced mince. Dark, rich, unapologetic." },
  { name: "Kadai Chicken", category: "Curries", price: "$17.99", img: ux("1585937421612-70a008356fbe"), spiceLevel: 2, allergens: [], desc: "Bell pepper, crushed coriander seed, wok-tossed in a clinging masala." },
  { name: "Rogan Josh", category: "Curries", price: "$20.99", img: ux("1585937421612-70a008356fbe"), spiceLevel: 2, allergens: [], desc: "Kashmiri mutton, slow-braised red with fennel and dry ginger." },
  { name: "Palak Gosht", category: "Curries", price: "$19.99", img: ux("1585937421612-70a008356fbe"), spiceLevel: 1, allergens: [], desc: "Lamb sunk into iron-rich spinach, finished with a garlic tempering." },
  { name: "Dal Makhani", category: "Curries", price: "$13.99", img: ux("1585937421612-70a008356fbe"), spiceLevel: 0, allergens: ["dairy"], desc: "Black lentils simmered overnight with butter and cream. Village patience." },
  // Biryani & Rice
  { name: "Chicken Biryani", category: "Biryani & Rice", price: "$17.99", img: ux("1589302168068-964664d93dc0"), spiceLevel: 2, allergens: ["dairy"], desc: "Long-grain rice layered with saffron chicken, sealed and dum-cooked." },
  { name: "Mutton Biryani", category: "Biryani & Rice", price: "$20.99", img: ux("1589302168068-964664d93dc0"), spiceLevel: 2, allergens: ["dairy"], desc: "Tender mutton, fried onion, deep spice, cooked down under the lid." },
  { name: "Jeera Rice", category: "Biryani & Rice", price: "$6.99", img: ux("1589302168068-964664d93dc0"), spiceLevel: 0, allergens: [], desc: "Basmati tempered with cumin and ghee. The quiet partner to any curry." },
  // Breads
  { name: "Garlic Naan", category: "Breads", price: "$4.99", img: ux("1697155406014-04dc649b0953"), spiceLevel: 0, allergens: ["gluten", "dairy"], desc: "Tandoor-blistered, brushed with garlic butter and coriander." },
  { name: "Butter Naan", category: "Breads", price: "$3.99", img: ux("1697155406014-04dc649b0953"), spiceLevel: 0, allergens: ["gluten", "dairy"], desc: "Soft, charred at the edges, dripping with butter." },
  // Drinks & Dessert
  { name: "Mango Lassi", category: "Drinks & Dessert", price: "$4.99", img: ux("1546173159-315724a31696"), spiceLevel: 0, allergens: ["dairy"], desc: "Thick, sweet, cooling. The antidote to the heat." },
  { name: "Gulab Jamun", category: "Drinks & Dessert", price: "$5.99", img: ux("1666190092159-3171cf0fbb12"), spiceLevel: 0, allergens: ["dairy", "gluten"], desc: "Fried milk dumplings soaked in warm rose syrup." },
];

// Filter bar order on the menu page (menu.html).
export const MENU_FILTERS: readonly ("all" | DishCategory)[] = [
  "all",
  "Starters",
  "Tandoori & Grill",
  "Curries",
  "Biryani & Rice",
  "Breads",
  "Drinks & Dessert",
];

// Home "Signature Fire" grid: the original 6 hardcoded cards, in order.
const HOME_DISH_NAMES: readonly string[] = [
  "Butter Chicken",
  "Chicken Pakora",
  "Tandoori Chicken",
  "Amritsari Fish",
  "Rara Gosht",
  "Seekh Kebab",
  "Chicken Tikka",
  "Gulab Jamun",
];

export const HOME_DISHES: Dish[] = HOME_DISH_NAMES.map((name) => {
  const dish = DISHES.find((d) => d.name === name);
  if (!dish) throw new Error(`Home dish not found in menu data: ${name}`);
  return dish;
});

export const SPICE_LABELS = ["Mild", "Medium", "Hot", "Extra hot"] as const;

export const spiceLabel = (level: SpiceLevel): string =>
  SPICE_LABELS[level] ?? "Mild";

// Prices are display strings ("$18.99"); the cart needs a number for subtotals.
export const priceValue = (price: string): number =>
  Number(price.replace(/[^0-9.]/g, "")) || 0;
