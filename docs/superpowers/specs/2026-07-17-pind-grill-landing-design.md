# PIND GRILL — Landing Page Design Spec

Date: 2026-07-17
Status: Approved by user

## Overview

Single-page dark-themed landing site for **Pind Grill**, a non-veg Punjabi
restaurant in Canada targeting Canadian/American diners. Goal: make visitors
hungry and get them to book a table.

Visual direction: Ember Kitchen editorial style (see reference screenshots in
project root) — pure black background, giant two-line typography, floating
dish plates, generous whitespace.

## Brand

- **Name**: PIND GRILL ("pind" = village in Punjabi)
- **Background**: near-black (#0a0a0a range)
- **Type**: white primary; second headline line in accent red
- **Accent**: deep chili red (primary accent — headlines, CTAs)
- **Gold**: touches only — prices, star ratings, small dividers
- **Typography**: large editorial sans (e.g. a geometric/grotesk Google Font),
  huge headline scale, wide tracking on labels

## Stack

- Static site, no build step: `index.html`, `styles.css`, `script.js`, `images/`
- GSAP + ScrollTrigger via CDN
- Booking form posts to Formspree (free tier) → owner's email
- Google Maps free embed iframe, CSS-filtered (invert/hue-rotate) to dark
- Dish photos: free stock (Unsplash/Pexels), dark backgrounds, to be replaced
  with real photography before launch
- Location/contact and Formspree form ID: placeholders marked `<!-- REPLACE -->`
  in the HTML for swap before launch (Formspree ID comes from the owner's free
  account at formspree.io)

## Sections

1. **Nav** — "PG" logotype left; center pill nav with anchor links
   (Menu · Story · Reviews · Contact); red "Book a Table" button right.
   Transparent at top, glass blur after scroll.

2. **Hero** — `PIND` huge white / `GRILL` huge chili red, stacked. Right side:
   three overlapping dish plates with small label pills ("Charcoal Tandoor",
   "Slow-cooked Curries", "Fresh Off the Skewer"). Short tagline about
   authentic Punjabi non-veg in Canada. One CTA → scrolls to booking.
   Entrance timeline: headline slides up, plates drift in with slight
   rotation, then slow idle float.

3. **Signature Dishes** — six editorial cards (round plate photo, name, short
   seductive description, gold price): Butter Chicken, Tandoori Chicken,
   Amritsari Fish, Rara Gosht, Seekh Kebab, Chicken Tikka. Staggered
   scroll-triggered reveal; gentle parallax on plate images. No filter tabs.

4. **Story strip** — one editorial paragraph (village recipes, open fire,
   generations) beside one atmospheric kitchen/fire image. Short.

5. **Reviews** — three large editorial pull-quotes, gold five-star rows,
   names/cities mixing Canadian and American guests. Scroll reveal.

6. **Booking + Map (combined)** — full-width dark map embed with:
   - glassmorphism booking form floating over it: name, phone, date, time,
     guests → POST to Formspree
   - glass address card near the map marker: address, hours, phone
   Native HTML inputs (`type="date"`, `type="time"`, `type="tel"`); required
   fields validated by the browser.

7. **Footer** — minimal: logo, hours, phone, social icons, tiny nav, copyright.

## Motion rules

- GSAP CDN + ScrollTrigger only; no smooth-scroll library
- Hero entrance timeline; per-section reveals; plate parallax; nav glass state
- `prefers-reduced-motion: reduce` disables all animation
- Native anchor scrolling with `scroll-behavior: smooth`

## Explicitly out of scope (add later if needed)

Menu filter tabs, chef/team section, video modal, today's-special banner,
multi-page menu, online ordering, backend of any kind.

## Skills for implementation

`gsap-core`, `gsap-scrolltrigger`, `gsap-timeline`, `frontend-design`,
`verify` before completion.

## Success criteria

- Page renders correctly on desktop and mobile (single column stack on mobile)
- Scroll animations fire once per section, no jank, none on reduced motion
- Booking form submits to Formspree and shows a success state
- Lighthouse-reasonable: images sized/compressed, lazy-loaded below the fold
