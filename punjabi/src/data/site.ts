// Shared site content pulled verbatim from the static HTML.

export const CONTACT = {
  name: "Indian Grill",
  address: "10132 104 St NW, Edmonton, AB",
  hours: "11:00 - 23:00",
  // TODO(launch): +1 (780) 555-0123 is a placeholder. Address & hours are real.
  phoneDisplay: "+1 (780) 555-0123",
  phoneHref: "tel:+17805550123",
  blurb:
    "Charcoal-fired Punjabi kitchen in Edmonton. Village recipes, overnight marinades, meat off the open flame.",
} as const;

export interface NavLink {
  label: string;
  href: string;
}

export const NAV_LINKS: readonly NavLink[] = [
  { label: "Menu", href: "/menu" },
  { label: "Story", href: "/story" },
  { label: "Reviews", href: "/reviews" },
  { label: "Contact", href: "/contact" },
];

export interface Review {
  quote: string;
  img: string;
  cite: string;
}

export const REVIEWS: readonly Review[] = [
  {
    quote: "Best butter chicken I've had outside of India. The taste is awesome.",
    img: "/images/face-1.jpg",
    cite: "Sarah M. — Toronto, ON",
  },
  {
    quote:
      "Drove up from Buffalo for the seekh kebabs. Worth the border wait, twice.",
    img: "/images/face-2.jpg",
    cite: "Jake T. — Buffalo, NY",
  },
  {
    quote:
      "Tastes like my grandmother's Sunday mutton curry. I don't say that lightly.",
    img: "/images/face-3.jpg",
    cite: "Priya & Dan — Mississauga, ON",
  },
];

export interface Social {
  label: string;
  // TODO(launch): real profile URLs (currently "#").
  href: string;
  path: string;
}

// Icon set shared by every footer (the 24×24 variant used across menu/story/reviews/contact).
export const SOCIALS: readonly Social[] = [
  {
    label: "Instagram",
    href: "#",
    path: "M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2-.1-1.2-.1-1.6-.1-4.8s0-3.6.1-4.8c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4 1.2-.1 1.6-.1 4.8-.1zm0 3.4a5.4 5.4 0 1 1 0 10.8 5.4 5.4 0 0 1 0-10.8zm0 2a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8zm5.6-2.9a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6z",
  },
  {
    label: "Facebook",
    href: "#",
    path: "M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.3-1.5 1.6-1.5h1.6V3.6c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.4H7.8V13h2.7v8h3z",
  },
  {
    label: "X (Twitter)",
    href: "#",
    path: "M17.8 3h3l-6.6 7.5L22 21h-6.1l-4.8-6.2L5.6 21h-3l7-8L2.4 3h6.3l4.3 5.7L17.8 3zm-1.1 16.2h1.7L7.7 4.7H5.9l10.8 14.5z",
  },
];
