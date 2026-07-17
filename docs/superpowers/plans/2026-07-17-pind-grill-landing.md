# Pind Grill Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page dark editorial landing site for Pind Grill (non-veg Punjabi restaurant, Canada) that makes visitors hungry and drives table bookings.

**Architecture:** Static site, no build step: one `index.html`, one `styles.css`, one `script.js`, one `images/` folder. GSAP + ScrollTrigger from CDN drive all motion. Booking form POSTs to Formspree. Google Maps free iframe, CSS-filtered dark.

**Tech Stack:** HTML5, vanilla CSS, vanilla JS, GSAP 3.12.x (CDN), Google Fonts (Jost), Formspree, Google Maps embed.

## Global Constraints

- No build step, no npm, no local JS dependencies — GSAP only via CDN `https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/` with the SRI `integrity` hashes given in Task 2 (do not change the version without recomputing them)
- Brand tokens (exact): bg `#0a0a0a`, surface `#151515`, text `#f4f1ea`, muted `#98938a`, red `#e6392e`, gold `#d9a441`, font `'Jost', sans-serif`
- Everything fake-for-now carries an HTML comment containing the word `REPLACE` (address, phone, map URL, Formspree ID)
- `prefers-reduced-motion: reduce` must disable ALL animation (handled via `gsap.matchMedia`)
- All images below the fold use `loading="lazy"`
- Testing = open page in browser + check DevTools console is error-free (static page, no unit test framework)
- Serve locally with `python -m http.server 8000` from repo root (or open `index.html` directly) for checks

---

### Task 1: Acquire dish photography

**Files:**
- Create: `images/hero-tandoori.jpg`, `images/hero-curry.jpg`, `images/hero-kebab.jpg`
- Create: `images/dish-butter-chicken.jpg`, `images/dish-tandoori-chicken.jpg`, `images/dish-amritsari-fish.jpg`, `images/dish-rara-gosht.jpg`, `images/dish-seekh-kebab.jpg`, `images/dish-chicken-tikka.jpg`
- Create: `images/story-fire.jpg`

**Interfaces:**
- Produces: the ten exact filenames above. Later tasks reference them verbatim in `<img src>`.

- [ ] **Step 1: Download 10 free stock photos**

Source: Unsplash or Pexels (both free-license, no attribution required). Use WebSearch/WebFetch to find a direct image URL for each subject, then download at ~1600px width:

| File | Subject to search |
|---|---|
| hero-tandoori.jpg | "tandoori chicken dark background top view" |
| hero-curry.jpg | "butter chicken curry bowl dark" |
| hero-kebab.jpg | "seekh kebab skewers dark plate" |
| dish-butter-chicken.jpg | "butter chicken bowl" |
| dish-tandoori-chicken.jpg | "tandoori chicken plate" |
| dish-amritsari-fish.jpg | "fried fish indian pakora" |
| dish-rara-gosht.jpg | "mutton curry dark bowl" |
| dish-seekh-kebab.jpg | "kebab skewers grill" |
| dish-chicken-tikka.jpg | "chicken tikka skewer charred" |
| story-fire.jpg | "tandoor oven flames chef" (landscape) |

Download each, e.g.:
```powershell
New-Item -ItemType Directory -Force images
curl.exe -L -o images/hero-tandoori.jpg "<direct-image-url>"
```

Prefer photos on dark/moody backgrounds (they sit on `#0a0a0a`). Hero + dish photos should crop well to a circle (dish centered).

- [ ] **Step 2: Verify all 10 files are real images**

Run:
```powershell
Get-ChildItem images | Where-Object Length -lt 30kb
```
Expected: no output (every file ≥ 30 KB). Also open 2-3 in a viewer to confirm they're actual food photos, not HTML error pages.

- [ ] **Step 3: Commit**

```powershell
git add images; git commit -m "feat: add stock dish photography (placeholder until real shoot)"
```

---

### Task 2: Page scaffold, design tokens, nav, hero (static)

**Files:**
- Create: `index.html`
- Create: `styles.css`

**Interfaces:**
- Consumes: `images/hero-*.jpg` from Task 1.
- Produces: CSS utilities used by every later task: `.container`, `.btn`, `.btn-red`, `.pill`, `.glass`, `h2` display style with `.accent` span, `section` spacing. HTML anchor ids `#dishes`, `#story`, `#reviews`, `#book` (nav links target them; later tasks must use these exact ids). Attribute convention `data-reveal` (Task 6 animates every `[data-reveal]` element).

- [ ] **Step 1: Create index.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pind Grill — Charcoal-Fired Punjabi Kitchen, Brampton</title>
  <meta name="description" content="Authentic non-veg Punjabi food in Canada. Tandoori chicken, butter chicken, kebabs — straight off the charcoal. Book a table at Pind Grill, Brampton.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header class="nav" id="top">
    <a class="logo" href="#top">PIND<span>GRILL</span></a>
    <nav class="nav-pills">
      <a href="#dishes">Menu</a>
      <a href="#story">Story</a>
      <a href="#reviews">Reviews</a>
      <a href="#book">Contact</a>
    </nav>
    <a class="btn btn-red" href="#book">Book a Table</a>
  </header>

  <main>
    <section class="hero">
      <div class="hero-text">
        <h1><span class="line-white">PIND</span><span class="line-red">GRILL</span></h1>
        <p class="tagline">Charcoal-fired Punjabi kitchen. Overnight marinades, slow curries, meat off the open flame — village recipes, now in Canada.</p>
        <a class="btn btn-red btn-lg" href="#book">Book a Table</a>
      </div>
      <div class="hero-plates" aria-hidden="false">
        <figure class="plate" data-depth="1">
          <img src="images/hero-tandoori.jpg" alt="Charred tandoori chicken on a black plate">
          <figcaption class="pill"><i></i>Charcoal Tandoor</figcaption>
        </figure>
        <figure class="plate" data-depth="2">
          <img src="images/hero-curry.jpg" alt="Butter chicken in a dark bowl">
          <figcaption class="pill"><i></i>Slow-Cooked Curries</figcaption>
        </figure>
        <figure class="plate" data-depth="3">
          <img src="images/hero-kebab.jpg" alt="Seekh kebabs fresh off the skewer">
          <figcaption class="pill"><i></i>Fresh Off the Skewer</figcaption>
        </figure>
      </div>
    </section>
  </main>

  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js" integrity="sha384-g4NTh/Iv5PPU4xPyhEWqPcwtNXOvdaDI8LLnyYfyNZOjKJeYQyjzQ9X5275eBjpt" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js" integrity="sha384-Z3REaz79l2IaAZqJsSABtTbhjgOUYyV3p90XNnAPCSHg3EMTz1fouunq9WZRtj3d" crossorigin="anonymous"></script>
  <script src="script.js"></script>
</body>
</html>
```

Note: `script.js` doesn't exist until Task 5/6 — a 404 in console for it is expected until then (the two GSAP CDN scripts must load clean).

- [ ] **Step 2: Create styles.css (tokens + base + nav + hero)**

```css
/* ===== tokens & base ===== */
:root {
  --bg: #0a0a0a;
  --surface: #151515;
  --text: #f4f1ea;
  --muted: #98938a;
  --red: #e6392e;
  --gold: #d9a441;
  --radius: 20px;
}
* { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  background: var(--bg);
  color: var(--text);
  font-family: 'Jost', sans-serif;
  font-weight: 300;
  line-height: 1.6;
  overflow-x: hidden;
}
img { max-width: 100%; display: block; }
a { color: inherit; text-decoration: none; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
section { padding: 120px 0; }
h2 {
  font-size: clamp(3rem, 8vw, 5.5rem);
  line-height: 1.02;
  font-weight: 500;
  text-transform: uppercase;
}
h2 .accent { color: var(--red); display: block; }
.section-sub { color: var(--muted); max-width: 46ch; margin-top: 20px; font-size: 1.05rem; }

.btn {
  display: inline-block;
  padding: 14px 32px;
  border: 0;
  border-radius: 999px;
  font: inherit;
  font-weight: 500;
  cursor: pointer;
  transition: transform .2s ease, filter .2s ease;
}
.btn-red { background: var(--red); color: #fff; }
.btn-red:hover { transform: translateY(-2px); filter: brightness(1.1); }
.btn-lg { padding: 18px 44px; font-size: 1.05rem; }

.pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  border-radius: 999px;
  background: rgba(255, 255, 255, .06);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  font-size: .85rem;
  white-space: nowrap;
}
.pill i { width: 8px; height: 8px; border-radius: 50%; background: var(--red); }

.glass {
  background: rgba(21, 21, 21, .55);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border: 1px solid rgba(255, 255, 255, .08);
  border-radius: var(--radius);
}

/* ===== nav ===== */
.nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 40px;
  transition: background .3s ease;
}
.nav.scrolled {
  background: rgba(10, 10, 10, .7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}
.logo { font-size: 1.25rem; font-weight: 600; letter-spacing: .05em; }
.logo span { color: var(--red); }
.nav-pills {
  display: flex;
  gap: 4px;
  padding: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, .05);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
.nav-pills a { padding: 8px 20px; border-radius: 999px; font-size: .9rem; color: var(--muted); transition: color .2s, background .2s; }
.nav-pills a:hover { color: var(--text); background: rgba(255, 255, 255, .07); }

/* ===== hero ===== */
.hero {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  align-items: center;
  gap: 40px;
  padding: 150px 40px 80px;
}
.hero h1 {
  font-size: clamp(4.5rem, 12vw, 10rem);
  line-height: .95;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: -.01em;
  overflow: hidden;
}
.hero h1 span { display: block; }
.line-red { color: var(--red); }
.tagline { max-width: 42ch; margin: 28px 0 36px; color: var(--muted); font-size: 1.1rem; }
.hero-plates { position: relative; height: 620px; }
.plate { position: absolute; width: min(320px, 58%); }
.plate img {
  border-radius: 50%;
  aspect-ratio: 1;
  object-fit: cover;
  box-shadow: 0 40px 80px rgba(0, 0, 0, .65);
}
.plate .pill { position: absolute; top: 14px; left: -20px; }
.plate:nth-child(1) { top: 0; right: 0; }
.plate:nth-child(2) { top: 34%; left: 0; }
.plate:nth-child(3) { bottom: 0; right: 8%; }

@media (max-width: 900px) {
  .nav { padding: 14px 20px; }
  .nav-pills { display: none; }
  .hero { grid-template-columns: 1fr; padding: 130px 24px 60px; }
  .hero-plates { height: 440px; }
  .plate { width: min(240px, 62%); }
}
```

- [ ] **Step 3: Verify in browser**

Run: `python -m http.server 8000` then open `http://localhost:8000`.
Expected: black page; fixed nav with logo, pill links, red button; giant PIND (white) / GRILL (red) headline; three circular overlapping plates on the right with glass label pills. Console shows only the expected `script.js` 404, nothing else. Narrow the window below 900px: single column, pills hidden, plates smaller.

- [ ] **Step 4: Commit**

```powershell
git add index.html styles.css; git commit -m "feat: scaffold, design tokens, nav and hero"
```

---

### Task 3: Signature dishes section

**Files:**
- Modify: `index.html` (insert before `</main>`)
- Modify: `styles.css` (append)

**Interfaces:**
- Consumes: `.container`, `h2`/`.accent`, `.section-sub`, `data-reveal` convention, `images/dish-*.jpg` from Task 1.
- Produces: section `id="dishes"` (nav already links to it).

- [ ] **Step 1: Add dishes markup before `</main>` in index.html**

```html
    <section class="dishes" id="dishes">
      <div class="container">
        <h2 data-reveal>Signature <span class="accent">Fire</span></h2>
        <p class="section-sub" data-reveal>Six dishes off the charcoal we'd put against anyone's. Marinated overnight, cooked over live flame, finished with ghee.</p>
        <div class="dish-grid">
          <article class="dish" data-reveal>
            <img src="images/dish-butter-chicken.jpg" alt="Butter chicken in a copper bowl" loading="lazy">
            <h3>Butter Chicken</h3>
            <p>Tandoor-charred thigh folded into a slow tomato-butter gravy. The one people cross the city for.</p>
            <span class="price">$18.99</span>
          </article>
          <article class="dish" data-reveal>
            <img src="images/dish-tandoori-chicken.jpg" alt="Tandoori chicken with charred edges" loading="lazy">
            <h3>Tandoori Chicken</h3>
            <p>Yogurt and spice marinade overnight, then blistered over live charcoal. Smoke does the rest.</p>
            <span class="price">$16.99</span>
          </article>
          <article class="dish" data-reveal>
            <img src="images/dish-amritsari-fish.jpg" alt="Crispy Amritsari fried fish" loading="lazy">
            <h3>Amritsari Fish</h3>
            <p>Ajwain-spiked batter, fried crisp the way the street stalls of Amritsar do it. Lemon. Done.</p>
            <span class="price">$15.99</span>
          </article>
          <article class="dish" data-reveal>
            <img src="images/dish-rara-gosht.jpg" alt="Rara gosht mutton curry" loading="lazy">
            <h3>Rara Gosht</h3>
            <p>Slow mutton curry doubled down with spiced mince. Dark, rich, unapologetic.</p>
            <span class="price">$21.99</span>
          </article>
          <article class="dish" data-reveal>
            <img src="images/dish-seekh-kebab.jpg" alt="Seekh kebabs on skewers" loading="lazy">
            <h3>Seekh Kebab</h3>
            <p>Hand-pressed lamb skewers straight off the smoke, with mint chutney that bites back.</p>
            <span class="price">$14.99</span>
          </article>
          <article class="dish" data-reveal>
            <img src="images/dish-chicken-tikka.jpg" alt="Charred chicken tikka pieces" loading="lazy">
            <h3>Chicken Tikka</h3>
            <p>Boneless smoky bites, charred edges, basted in butter while they rest. They rarely get to rest.</p>
            <span class="price">$15.99</span>
          </article>
        </div>
      </div>
    </section>
```

- [ ] **Step 2: Append dishes styles to styles.css**

```css
/* ===== dishes ===== */
.dish-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 56px 40px;
  margin-top: 72px;
}
.dish img {
  border-radius: 50%;
  aspect-ratio: 1;
  object-fit: cover;
  width: min(240px, 80%);
  margin-bottom: 24px;
  box-shadow: 0 24px 48px rgba(0, 0, 0, .55);
}
.dish h3 { font-size: 1.5rem; font-weight: 500; }
.dish p { color: var(--muted); margin: 8px 0 12px; }
.price { color: var(--gold); font-weight: 500; font-size: 1.1rem; letter-spacing: .03em; }

@media (max-width: 900px) {
  .dish-grid { grid-template-columns: 1fr; gap: 48px; }
  .dish { text-align: center; }
  .dish img { margin-inline: auto; }
}
```

- [ ] **Step 3: Verify in browser**

Reload `http://localhost:8000`. Expected: "SIGNATURE / FIRE" headline (FIRE in red), 3×2 grid of round dish photos with names, muted descriptions, gold prices. Mobile width: single centered column. Console: no new errors.

- [ ] **Step 4: Commit**

```powershell
git add index.html styles.css; git commit -m "feat: signature dishes section"
```

---

### Task 4: Story strip and reviews

**Files:**
- Modify: `index.html` (insert before `</main>`)
- Modify: `styles.css` (append)

**Interfaces:**
- Consumes: `.container`, `h2`/`.accent`, `data-reveal`, `images/story-fire.jpg`, `--gold` token.
- Produces: sections `id="story"` and `id="reviews"`.

- [ ] **Step 1: Add story + reviews markup before `</main>`**

```html
    <section class="story" id="story">
      <div class="container story-grid">
        <div data-reveal>
          <h2>From the <span class="accent">Pind</span></h2>
          <p class="section-sub">"Pind" means village. Our recipes come from one — handed down through three generations of cooks who never wrote anything down. We brought the marinades, the patience, and the fire to Canada. The tandoor is clay, the charcoal is real, and nothing leaves the kitchen until it would pass at a Punjabi wedding.</p>
        </div>
        <img src="images/story-fire.jpg" alt="Flames inside a clay tandoor oven" loading="lazy" data-reveal>
      </div>
    </section>

    <section class="reviews" id="reviews">
      <div class="container">
        <h2 data-reveal>Guests <span class="accent">Say</span></h2>
        <div class="review-grid">
          <blockquote class="review" data-reveal>
            <div class="stars">★★★★★</div>
            <p>"Best butter chicken I've had outside of India. Period."</p>
            <cite>Sarah M. — Toronto, ON</cite>
          </blockquote>
          <blockquote class="review" data-reveal>
            <div class="stars">★★★★★</div>
            <p>"Drove up from Buffalo for the seekh kebabs. Worth the border wait, twice."</p>
            <cite>Jake T. — Buffalo, NY</cite>
          </blockquote>
          <blockquote class="review" data-reveal>
            <div class="stars">★★★★★</div>
            <p>"Tastes like my grandmother's Sunday mutton curry. I don't say that lightly."</p>
            <cite>Priya &amp; Dan — Mississauga, ON</cite>
          </blockquote>
        </div>
      </div>
    </section>
```

- [ ] **Step 2: Append story + reviews styles**

```css
/* ===== story ===== */
.story-grid {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 64px;
  align-items: center;
}
.story-grid img {
  border-radius: var(--radius);
  aspect-ratio: 4 / 3;
  object-fit: cover;
  box-shadow: 0 32px 64px rgba(0, 0, 0, .55);
}

/* ===== reviews ===== */
.review-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  margin-top: 72px;
}
.review { display: flex; flex-direction: column; gap: 14px; }
.stars { color: var(--gold); letter-spacing: .2em; }
.review p { font-size: 1.35rem; font-weight: 400; line-height: 1.4; }
.review cite { color: var(--muted); font-style: normal; font-size: .95rem; }

@media (max-width: 900px) {
  .story-grid { grid-template-columns: 1fr; gap: 40px; }
  .review-grid { grid-template-columns: 1fr; gap: 48px; }
}
```

- [ ] **Step 3: Verify in browser**

Reload. Expected: story text beside fire image; three big quotes with gold stars and name/city credits. Mobile: stacked. Console clean (except script.js 404).

- [ ] **Step 4: Commit**

```powershell
git add index.html styles.css; git commit -m "feat: story strip and reviews sections"
```

---

### Task 5: Booking + map section, footer, form submit JS

**Files:**
- Modify: `index.html` (insert before `</main>`, and footer after `</main>`)
- Modify: `styles.css` (append)
- Create: `script.js` (nav scroll state + form handler; GSAP animation comes in Task 6)

**Interfaces:**
- Consumes: `.glass`, `.btn`, `.btn-red`, `h2`/`.accent`, `data-reveal`.
- Produces: section `id="book"`; `form.booking-form` with `.form-status` element; `.nav.scrolled` class toggled on scroll (CSS for it exists from Task 2). Task 6 appends to this `script.js` — do not wrap file in an IIFE.

- [ ] **Step 1: Add booking markup before `</main>` and footer after `</main>`**

Before `</main>`:
```html
    <section class="book" id="book">
      <div class="container">
        <h2 data-reveal>Book a <span class="accent">Table</span></h2>
        <p class="section-sub" data-reveal>Friday and Saturday nights go fast. Leave your details — we'll call to confirm within the hour.</p>
      </div>
      <div class="map-wrap" data-reveal>
        <!-- REPLACE: swap q= with your real address for the correct pin -->
        <iframe src="https://www.google.com/maps?q=Brampton,+ON,+Canada&output=embed" loading="lazy" title="Pind Grill location on Google Maps"></iframe>
        <!-- REPLACE: get a free form ID at formspree.io and swap REPLACE_FORM_ID -->
        <form class="glass booking-form" action="https://formspree.io/f/REPLACE_FORM_ID" method="POST">
          <input name="name" type="text" placeholder="Your name" autocomplete="name" required>
          <input name="phone" type="tel" placeholder="Phone number" autocomplete="tel" required>
          <div class="form-row">
            <input name="date" type="date" required aria-label="Date">
            <input name="time" type="time" required aria-label="Time">
          </div>
          <select name="guests" required aria-label="Number of guests">
            <option value="" disabled selected>Guests</option>
            <option>2</option>
            <option>4</option>
            <option>6</option>
            <option>8+</option>
          </select>
          <button class="btn btn-red" type="submit">Book Now</button>
          <p class="form-status" role="status" aria-live="polite"></p>
        </form>
        <div class="glass address-card">
          <strong>Pind Grill</strong>
          <!-- REPLACE: real address & phone before launch -->
          <p>123 Main St N, Brampton, ON</p>
          <p>Open daily 11:00 – 23:00</p>
          <p><a href="tel:+19055550123">+1 (905) 555-0123</a></p>
        </div>
      </div>
    </section>
```

After `</main>`:
```html
  <footer class="footer">
    <div class="container footer-grid">
      <a class="logo" href="#top">PIND<span>GRILL</span></a>
      <nav class="footer-nav">
        <a href="#dishes">Menu</a>
        <a href="#story">Story</a>
        <a href="#reviews">Reviews</a>
        <a href="#book">Contact</a>
      </nav>
      <p class="footer-meta">Open daily 11:00 – 23:00 · <a href="tel:+19055550123">+1 (905) 555-0123</a></p>
    </div>
    <p class="copyright">© 2026 Pind Grill. All rights reserved.</p>
  </footer>
```

- [ ] **Step 2: Append booking + footer styles**

```css
/* ===== booking + map ===== */
.book { padding-bottom: 0; }
.map-wrap { position: relative; height: 680px; margin-top: 64px; }
.map-wrap iframe {
  width: 100%;
  height: 100%;
  border: 0;
  filter: grayscale(1) invert(.92) contrast(.85);
}
.booking-form {
  position: absolute;
  top: 50%;
  left: 6%;
  transform: translateY(-50%);
  width: min(360px, 88%);
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.booking-form input,
.booking-form select {
  background: rgba(255, 255, 255, .06);
  border: 1px solid rgba(255, 255, 255, .1);
  border-radius: 12px;
  padding: 13px 16px;
  color: var(--text);
  font: inherit;
  width: 100%;
}
.booking-form input::placeholder { color: var(--muted); }
.booking-form input:focus, .booking-form select:focus { outline: 2px solid var(--red); outline-offset: 1px; }
.booking-form select:invalid { color: var(--muted); }
.booking-form option { background: var(--surface); color: var(--text); }
.form-row { display: flex; gap: 14px; }
.form-status { min-height: 1.2em; font-size: .9rem; color: var(--gold); }
.booking-form input[type="date"]::-webkit-calendar-picker-indicator,
.booking-form input[type="time"]::-webkit-calendar-picker-indicator { filter: invert(.7); }
.address-card {
  position: absolute;
  top: 18%;
  right: 8%;
  padding: 24px 28px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.address-card strong { font-size: 1.1rem; font-weight: 600; }
.address-card p { color: var(--muted); font-size: .95rem; }

/* ===== footer ===== */
.footer { padding: 64px 0 24px; border-top: 1px solid rgba(255, 255, 255, .07); }
.footer-grid { display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
.footer-nav { display: flex; gap: 28px; }
.footer-nav a { color: var(--muted); font-size: .95rem; }
.footer-nav a:hover { color: var(--text); }
.footer-meta { color: var(--muted); font-size: .95rem; }
.copyright { text-align: center; color: var(--muted); font-size: .8rem; margin-top: 40px; opacity: .6; }

@media (max-width: 900px) {
  .map-wrap { height: auto; padding: 24px 24px 40px; background: var(--surface); }
  .map-wrap iframe { height: 320px; }
  .booking-form, .address-card { position: static; transform: none; width: 100%; margin-top: 20px; }
  .footer-grid { flex-direction: column; text-align: center; }
}
```

- [ ] **Step 3: Create script.js with nav state + form handler**

```js
// nav glass state
const nav = document.querySelector('.nav');
addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 40), { passive: true });

// booking form → Formspree, inline status
const form = document.querySelector('.booking-form');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const status = form.querySelector('.form-status');
  status.textContent = 'Sending…';
  const res = await fetch(form.action, {
    method: 'POST',
    body: new FormData(form),
    headers: { Accept: 'application/json' },
  }).catch(() => null);
  if (res && res.ok) {
    status.textContent = "Request sent — we'll call to confirm.";
    form.reset();
  } else {
    status.textContent = 'Something went wrong — please call us instead.';
  }
});
```

- [ ] **Step 4: Verify in browser**

Reload. Expected: dark-tinted map full width; glass booking form floating left; glass address card upper right; footer with logo, links, hours. Scroll down then up: nav gains/loses blurred background. Submit the empty form: browser blocks on required fields. Fill and submit: status line shows the error message (expected — REPLACE_FORM_ID isn't a real endpoint yet). Console: no errors other than the failed Formspree POST.

- [ ] **Step 5: Commit**

```powershell
git add index.html styles.css script.js; git commit -m "feat: booking form over dark map, footer, form submit handler"
```

---

### Task 6: GSAP motion + final verification

**Files:**
- Modify: `script.js` (append)

**Interfaces:**
- Consumes: `.hero h1 span`, `.tagline`, `.hero .btn-lg`, `.plate` (+ `data-depth`), `[data-reveal]` elements from Tasks 2–5; GSAP + ScrollTrigger globals from the CDN scripts.

- [ ] **Step 1: Append animation code to script.js**

```js
// ===== motion (GSAP) =====
gsap.registerPlugin(ScrollTrigger);

const mm = gsap.matchMedia();
mm.add('(prefers-reduced-motion: no-preference)', () => {
  // hero entrance
  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .from('.hero h1 span', { yPercent: 110, duration: 1, stagger: 0.12 })
    .from('.tagline, .hero .btn-lg', { y: 30, opacity: 0, duration: 0.7, stagger: 0.1 }, '-=0.5')
    .from('.plate', { y: 80, opacity: 0, rotate: 8, duration: 1, stagger: 0.15 }, '-=0.6');

  // idle float on plates
  gsap.utils.toArray('.plate').forEach((p, i) => {
    gsap.to(p, { y: '+=14', duration: 2.4 + i * 0.4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  });

  // hero parallax on scroll (depth-scaled)
  gsap.utils.toArray('.plate').forEach((p) => {
    gsap.to(p, {
      yPercent: -8 * (Number(p.dataset.depth) || 1),
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });
  });

  // section reveals
  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    gsap.from(el, {
      y: 48,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
  });
});
```

- [ ] **Step 2: Verify motion in browser**

Reload with cache disabled. Expected:
- On load: headline lines slide up (masked by the h1), tagline/CTA fade up, plates drift in with slight rotation, then float gently forever.
- Scrolling: plates parallax upward at different speeds; every section's headline/cards/quotes fade-slide in once as they enter the viewport.
- Console: zero errors.

- [ ] **Step 3: Verify reduced motion**

DevTools → Rendering → "Emulate CSS media feature prefers-reduced-motion: reduce" → reload. Expected: page appears fully static, all content visible immediately, no animation at all.

- [ ] **Step 4: Full-page final check (verify skill)**

Use the `verify` skill: drive the page end to end at desktop and ~390px mobile width — nav anchors scroll to the right sections, images all load, form validates, no horizontal scrollbar at any width, console clean.

- [ ] **Step 5: Commit**

```powershell
git add script.js; git commit -m "feat: GSAP hero entrance, parallax and scroll reveals with reduced-motion opt-out"
```
