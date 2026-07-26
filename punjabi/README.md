<p align="center">
  <img src="public/images/og-image.png" alt="Indian Grill – Charcoal-Fired Punjabi Kitchen" width="600" />
</p>

<h1 align="center">🔥 Indian Grill</h1>

<p align="center">
  <strong>Charcoal-Fired Punjabi Kitchen — Edmonton, AB</strong><br/>
  <em>A modern, performant restaurant website built with Next.js 16, React 19, Tailwind CSS 4 &amp; GSAP.</em>
</p>

<p align="center">
  <a href="https://indiangrill.vercel.app">🌐 Live Site</a> &nbsp;·&nbsp;
  <a href="#-getting-started">🚀 Getting Started</a> &nbsp;·&nbsp;
  <a href="#-tech-stack">⚡ Tech Stack</a> &nbsp;·&nbsp;
  <a href="#-project-structure">📂 Structure</a>
</p>

---

## 📖 About

**Indian Grill** is a full-featured restaurant website for a charcoal-fired Punjabi kitchen in Edmonton, Canada. The site showcases the menu, the restaurant's story, customer reviews, table booking, and authentication — all wrapped in a premium dark-themed UI with rich animations and micro-interactions.

### ✨ Highlights

- 🍗 **Interactive Menu** — filter dishes by course (tandoori, curries, biryani, breads) with smooth transitions
- 📖 **Our Story** — immersive storytelling section with a 3D tilt image stack and duotone-to-color reveal
- ⭐ **Reviews Carousel** — testimonials with face avatars and elegant scroll animations
- 🪑 **Table Booking** — reservation form with date/time picker and party size
- 🛒 **Cart System** — add-to-cart with a floating cart island and order summary
- 🔐 **Auth Flow** — login/signup card with smooth mode toggling
- 🤖 **Foodie AI Chat** — an interactive chatbot assistant (Foodie)
- 🎆 **Premium Animations** — GSAP-powered reveals, magnetic CTA button with cursor-tracking sweep, icon spotlight texture
- 🌑 **Dark Mode First** — charcoal background with cream text, brand-red accents, gold highlights
- ♿ **Accessible** — semantic HTML, `prefers-reduced-motion` support, proper heading hierarchy

---

## ⚡ Tech Stack

| Layer              | Technology                                                                 |
| ------------------ | -------------------------------------------------------------------------- |
| **Framework**      | [Next.js 16](https://nextjs.org/) (App Router, Server Components)          |
| **UI Library**     | [React 19](https://react.dev/)                                             |
| **Styling**        | [Tailwind CSS 4](https://tailwindcss.com/) + custom design tokens          |
| **Animations**     | [GSAP 3](https://gsap.com/) + `@gsap/react`                               |
| **Typography**     | [Jost](https://fonts.google.com/specimen/Jost) (display) + [Lora](https://fonts.google.com/specimen/Lora) (body) via `next/font` |
| **Language**       | TypeScript 5                                                               |
| **Linting**        | ESLint 9 + `eslint-config-next`                                           |
| **Deployment**     | [Vercel](https://vercel.com/)                                              |

---

## 📂 Project Structure

```
punjabi/
├── public/
│   └── images/              # Static assets (dish photos, hero images, OG image)
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── layout.tsx       # Root layout (fonts, providers, navbar, footer, JSON-LD)
│   │   ├── page.tsx         # Home page (hero, dishes, story, reviews, booking)
│   │   ├── globals.css      # Tailwind v4 + design tokens + custom component styles
│   │   ├── menu/            # /menu — full filterable menu
│   │   ├── story/           # /story — restaurant backstory
│   │   ├── reviews/         # /reviews — customer testimonials
│   │   ├── contact/         # /contact — booking form + FAQ
│   │   ├── login/           # /login — auth (login/signup toggle)
│   │   ├── robots.ts        # SEO: robots.txt generation
│   │   └── sitemap.ts       # SEO: XML sitemap generation
│   ├── components/
│   │   ├── auth/            # AuthCard (login/signup form)
│   │   ├── booking/         # BookingProvider + booking form
│   │   ├── cart/            # CartProvider, CartIsland (floating cart)
│   │   ├── foodie/          # Foodie AI chatbot
│   │   ├── fx/              # Visual effects (IconSpotlight, HeadingWeight, MotionProvider)
│   │   ├── layout/          # Navbar, Footer
│   │   ├── sections/        # Page sections (Hero, Dishes, Story, Reviews, BookSection, Faq, MenuFilters)
│   │   └── ui/              # Reusable primitives (Section, Container, SectionHeading)
│   ├── data/
│   │   ├── site.ts          # Shared constants (contact, nav links, reviews, socials)
│   │   └── dishes.ts        # Menu data (dish names, prices, images, categories)
│   └── lib/
│       ├── metadata.ts      # Per-page OG/Twitter metadata builder
│       └── gsap.ts          # GSAP registration helper
├── next.config.ts           # Next.js config (image domains, dev origins)
├── tailwind.config.*        # Tailwind v4 (configured via globals.css @theme)
├── tsconfig.json            # TypeScript config with path aliases (@/*)
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 20.x (LTS recommended)
- **npm** ≥ 10.x (or pnpm / yarn / bun)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Aayush-Shaw/restraunt.git
cd restraunt/punjabi

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Available Scripts

| Command          | Description                                |
| ---------------- | ------------------------------------------ |
| `npm run dev`    | Start the development server (hot reload)  |
| `npm run build`  | Create a production build                  |
| `npm run start`  | Serve the production build locally         |
| `npm run lint`   | Run ESLint checks                          |

---

## 🔍 SEO & Social Preview

This project is built with **search engine optimization** and **social media discoverability** as first-class concerns:

| Feature                        | Implementation                                                    |
| ------------------------------ | ----------------------------------------------------------------- |
| **Open Graph (OG) Tags**       | Root layout sets default OG title, description, image (1200×630)  |
| **Twitter Cards**              | `summary_large_image` card with full preview on every page        |
| **JSON-LD Structured Data**    | `Restaurant` schema injected in `<head>` for Google rich results  |
| **Dynamic Sitemap**            | Auto-generated `sitemap.xml` with priorities per route            |
| **Robots.txt**                 | Programmatic `robots.txt` allowing all crawlers                   |
| **Canonical URLs**             | Set per-page via `buildMetadata()` helper                         |
| **GEO / Local SEO**            | `GeoCoordinates`, `PostalAddress`, `OpeningHoursSpecification`    |
| **Per-Page Meta**              | Every route exports its own `metadata` with unique title + desc   |
| **Apple Touch Icon**           | Configured for iOS home screen bookmarks                          |
| **Theme Color**                | `#0a0a0a` for browser chrome and PWA splash screens               |

### Social Media Preview

When you share any page link on WhatsApp, Twitter/X, Facebook, LinkedIn, Slack, or Discord, a rich preview card appears with:

- **Title** — e.g. "Indian Grill — Charcoal-Fired Punjabi Kitchen, Edmonton"
- **Description** — Context-appropriate text for the shared page
- **Image** — The 1200×630 OG image (`/images/og-image.png`)

---

## 🏗️ Architecture Decisions

- **Server Components by Default** — pages use React Server Components; interactivity is pushed to leaf client components (cart, booking, auth, animations)
- **Tailwind v4 `@theme` Tokens** — design system colors (`charcoal`, `cream`, `brand`, `gold`, `muted`, `surface`) and font families defined via CSS custom properties
- **Squircle Progressive Enhancement** — browsers supporting `corner-shape: squircle` get premium rounded corners; others fall back gracefully
- **GSAP for Complex Motion** — scroll-triggered reveals and magnetic cursor effects use GSAP; simple transitions stay in CSS
- **Single Metadata Builder** — `buildMetadata()` in `src/lib/metadata.ts` keeps OG, Twitter, and canonical URL in sync across all routes

---

## 🚢 Deployment

The site is deployed on **Vercel** with zero configuration:

```bash
# Deploy via Vercel CLI
npx vercel --prod
```

Or connect the GitHub repository to [Vercel Dashboard](https://vercel.com/new) for automatic deployments on every push.

### Environment Variables

No environment variables are required for the base site. If you add backend features (database, auth provider), create a `.env.local` file:

```bash
# Example (not currently used)
# DATABASE_URL=postgres://...
# NEXTAUTH_SECRET=...
```

> **Note:** `.env*` files are gitignored by default.

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feat/your-feature`
3. **Commit** your changes: `git commit -m "feat: add amazing feature"`
4. **Push** to the branch: `git push origin feat/your-feature`
5. **Open** a Pull Request

Please follow the existing code style and ensure `npm run lint` passes before submitting.

---

## 📄 License

This project is private and not currently licensed for public redistribution.

---

<p align="center">
  Built with 🔥 by <a href="https://github.com/Aayush-Shaw">Aayush Shaw</a>
</p>
