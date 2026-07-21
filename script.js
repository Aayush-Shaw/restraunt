// food-icon spotlight texture: faint white base always; red glow follows cursor on fine pointers
const iconTile = (stroke) => `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140' fill='none' stroke='${stroke}' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'><path d='M22 46 L37 16 L54 44 Z'/><path d='M37 16 L37 45'/><circle cx='100' cy='26' r='12'/><path d='M109 34 L122 47'/><path d='M122 47 l-6 2 2 6'/><path d='M16 94 Q35 116 54 94'/><path d='M14 93 L56 93'/><path d='M26 86 Q35 92 44 86'/><path d='M30 80 q4 -5 0 -10'/><path d='M40 80 q4 -5 0 -10'/><path d='M76 116 L120 98'/><ellipse cx='86' cy='110' rx='6' ry='5' transform='rotate(-22 86 110)'/><ellipse cx='98' cy='105' rx='6' ry='5' transform='rotate(-22 98 105)'/><ellipse cx='110' cy='100' rx='6' ry='5' transform='rotate(-22 110 100)'/><ellipse cx='72' cy='64' rx='17' ry='12' transform='rotate(-16 72 64)'/><circle cx='68' cy='62' r='1.3'/><circle cx='78' cy='66' r='1.3'/><circle cx='72' cy='68' r='1.3'/></svg>")`.replace(/#/g, '%23');

const baseLayer = document.body.appendChild(document.createElement('div'));
baseLayer.className = 'icon-layer icon-layer--base';
baseLayer.style.backgroundImage = iconTile('#f4f1ea');

if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const glow = document.body.appendChild(document.createElement('div'));
  glow.className = 'icon-layer icon-layer--glow';
  glow.style.backgroundImage = iconTile('#7a1f1f');
  addEventListener('mousemove', (e) => {
    glow.style.setProperty('--mouse-x', `${e.clientX}px`);
    glow.style.setProperty('--mouse-y', `${e.clientY}px`);
  }, { passive: true });
} else {
  // touch (mobile/tablet): no cursor to follow — glow drifts on its own via CSS
  const glow = document.body.appendChild(document.createElement('div'));
  glow.className = 'icon-layer icon-layer--auto';
  glow.style.backgroundImage = iconTile('#7a1f1f');
}

// nav glass state
const nav = document.querySelector('.nav');
addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 40), { passive: true });

// mobile hamburger: inject the button, toggle the pills dropdown (CSS handles ≤640 only)
const pills = nav?.querySelector('.nav-pills');
if (pills) {
  const toggle = document.createElement('button');
  toggle.className = 'nav-toggle';
  toggle.setAttribute('aria-label', 'Menu');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.textContent = '☰';
  nav.appendChild(toggle);
  const setOpen = (open) => {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? '✕' : '☰';
  };
  toggle.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
  pills.addEventListener('click', (e) => { if (e.target.tagName === 'A') setOpen(false); });
}

// booking form (contact + home). TODO(launch): form is a placeholder — when a real
// Formspree ID replaces REPLACE_FORM_ID, the live-submit branch below activates.
const form = document.querySelector('.booking-form');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const status = form.querySelector('.form-status');
    // Placeholder form: don't POST to a dead endpoint, don't fake success — tell people to call.
    if (form.action.includes('REPLACE_FORM_ID')) {
      status.textContent = "Online booking isn't live yet — please call us to reserve.";
      return;
    }
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
}

// story image rotator (story page only), off under reduced motion
const stack = document.querySelector('.story-stack');
if (stack && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const imgs = [...stack.querySelectorAll('img')];
  let current = 0;
  setInterval(() => {
    imgs[current].classList.remove('is-active');
    current = (current + 1) % imgs.length;
    imgs[current].classList.add('is-active');
  }, 4500);
}

// ===== menu data (single source of truth) =====
// Existing 6 keep their local photos + copy verbatim. New dishes use verified
// Unsplash URLs (square-cropped, lazy-loaded) as placeholders until real photos.
const ux = (id) => `https://images.unsplash.com/photo-${id}?w=600&h=600&fit=crop&q=70`;
const DISHES = [
  // Starters
  { name: 'Amritsari Fish', category: 'Starters', price: '$15.99', img: 'images/dish-amritsari-fish.jpg', spiceLevel: 2, allergens: ['fish', 'gluten'], desc: 'Ajwain-spiked batter, fried crisp the way the street stalls of Amritsar do it. Lemon. Done.' },
  { name: 'Chicken Pakora', category: 'Starters', price: '$12.99', img: ux('1610057099431-d73a1c9d2f2f'), spiceLevel: 1, allergens: [], desc: 'Chickpea batter, carom seed, fried gold. Gone before they hit the table.' },
  { name: 'Tandoori Wings', category: 'Starters', price: '$13.99', img: ux('1685798830572-f07ff7635774'), spiceLevel: 2, allergens: ['dairy'], desc: 'Charcoal-blistered wings, yogurt overnight, brushed with chilli-ghee.' },
  // Tandoori & Grill
  { name: 'Tandoori Chicken', category: 'Tandoori & Grill', price: '$16.99', img: 'images/dish-tandoori-chicken.jpg', spiceLevel: 2, allergens: ['dairy'], desc: 'Yogurt and spice marinade overnight, then blistered over live charcoal. Smoke does the rest.' },
  { name: 'Chicken Tikka', category: 'Tandoori & Grill', price: '$15.99', img: 'images/dish-chicken-tikka.jpg', spiceLevel: 2, allergens: ['dairy'], desc: 'Boneless smoky bites, charred edges, basted in butter while they rest. They rarely get to rest.' },
  { name: 'Seekh Kebab', category: 'Tandoori & Grill', price: '$14.99', img: 'images/dish-seekh-kebab.jpg', spiceLevel: 2, allergens: [], desc: 'Hand-pressed lamb skewers straight off the smoke, with mint chutney that bites back.' },
  { name: 'Tandoori Lamb Chops', category: 'Tandoori & Grill', price: '$22.99', img: ux('1685798830572-f07ff7635774'), spiceLevel: 2, allergens: ['dairy'], desc: 'Frenched chops, day-long marinade, seared hard over open coal. Pink at the bone.' },
  { name: 'Malai Tikka', category: 'Tandoori & Grill', price: '$16.99', img: ux('1610057099431-d73a1c9d2f2f'), spiceLevel: 0, allergens: ['dairy', 'nuts'], desc: 'Chicken in a cream-and-cheese marinade, kissed by smoke, barely charred.' },
  { name: 'Tandoori Prawns', category: 'Tandoori & Grill', price: '$19.99', img: ux('1685798830572-f07ff7635774'), spiceLevel: 2, allergens: ['shellfish'], desc: 'Jumbo prawns, carom and red chilli, straight off the skewer.' },
  { name: 'Reshmi Kebab', category: 'Tandoori & Grill', price: '$15.99', img: ux('1610057099431-d73a1c9d2f2f'), spiceLevel: 1, allergens: ['dairy', 'nuts'], desc: 'Silken chicken mince, saffron and cream, grilled soft.' },
  // Curries
  { name: 'Butter Chicken', category: 'Curries', price: '$18.99', img: 'images/dish-butter-chicken.jpg', spiceLevel: 1, allergens: ['dairy', 'nuts'], desc: 'Tandoor-charred thigh folded into a slow tomato-butter gravy. The one people cross the city for.' },
  { name: 'Rara Gosht', category: 'Curries', price: '$21.99', img: 'images/dish-rara-gosht.jpg', spiceLevel: 3, allergens: ['dairy'], desc: 'Slow mutton curry doubled down with spiced mince. Dark, rich, unapologetic.' },
  { name: 'Kadai Chicken', category: 'Curries', price: '$17.99', img: ux('1585937421612-70a008356fbe'), spiceLevel: 2, allergens: [], desc: 'Bell pepper, crushed coriander seed, wok-tossed in a clinging masala.' },
  { name: 'Rogan Josh', category: 'Curries', price: '$20.99', img: ux('1585937421612-70a008356fbe'), spiceLevel: 2, allergens: [], desc: 'Kashmiri mutton, slow-braised red with fennel and dry ginger.' },
  { name: 'Palak Gosht', category: 'Curries', price: '$19.99', img: ux('1585937421612-70a008356fbe'), spiceLevel: 1, allergens: [], desc: 'Lamb sunk into iron-rich spinach, finished with a garlic tempering.' },
  { name: 'Dal Makhani', category: 'Curries', price: '$13.99', img: ux('1585937421612-70a008356fbe'), spiceLevel: 0, allergens: ['dairy'], desc: 'Black lentils simmered overnight with butter and cream. Village patience.' },
  // Biryani & Rice
  { name: 'Chicken Biryani', category: 'Biryani & Rice', price: '$17.99', img: ux('1589302168068-964664d93dc0'), spiceLevel: 2, allergens: ['dairy'], desc: 'Long-grain rice layered with saffron chicken, sealed and dum-cooked.' },
  { name: 'Mutton Biryani', category: 'Biryani & Rice', price: '$20.99', img: ux('1589302168068-964664d93dc0'), spiceLevel: 2, allergens: ['dairy'], desc: 'Tender mutton, fried onion, deep spice, cooked down under the lid.' },
  { name: 'Jeera Rice', category: 'Biryani & Rice', price: '$6.99', img: ux('1589302168068-964664d93dc0'), spiceLevel: 0, allergens: [], desc: 'Basmati tempered with cumin and ghee. The quiet partner to any curry.' },
  // Breads
  { name: 'Garlic Naan', category: 'Breads', price: '$4.99', img: ux('1697155406014-04dc649b0953'), spiceLevel: 0, allergens: ['gluten', 'dairy'], desc: 'Tandoor-blistered, brushed with garlic butter and coriander.' },
  { name: 'Butter Naan', category: 'Breads', price: '$3.99', img: ux('1697155406014-04dc649b0953'), spiceLevel: 0, allergens: ['gluten', 'dairy'], desc: 'Soft, charred at the edges, dripping with butter.' },
  // Drinks & Dessert
  { name: 'Mango Lassi', category: 'Drinks & Dessert', price: '$4.99', img: ux('1546173159-315724a31696'), spiceLevel: 0, allergens: ['dairy'], desc: 'Thick, sweet, cooling. The antidote to the heat.' },
  { name: 'Gulab Jamun', category: 'Drinks & Dessert', price: '$5.99', img: ux('1666190092159-3171cf0fbb12'), spiceLevel: 0, allergens: ['dairy', 'gluten'], desc: 'Fried milk dumplings soaked in warm rose syrup.' },
];
const DISH_BY_NAME = Object.fromEntries(DISHES.map((d) => [d.name, d]));
const SPICE_LABELS = ['Mild', 'Medium', 'Hot', 'Extra hot'];
const flame = (on) => `<svg class="flame ${on ? 'on' : 'off'}" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C9 6 7 8.3 7 12a5 5 0 0 0 10 0c0-1.7-.7-3.1-1.6-4.3-.3 1-.9 1.8-1.9 2.3.5-2.7-.6-5.6-1.5-8z"/></svg>`;
const cap = (s) => s[0].toUpperCase() + s.slice(1);

// Full menu page: render every dish from data into the grid. Index keeps its
// own 6 hardcoded cards (grid marker absent there → nothing rendered).
const menuGrid = document.querySelector('[data-menu-grid]');
if (menuGrid) {
  DISHES.forEach((d) => {
    const art = document.createElement('article');
    art.className = 'dish';
    art.dataset.category = d.category;
    art.setAttribute('data-reveal', '');
    art.innerHTML =
      `<img src="${d.img}" alt="${d.name}" loading="lazy">` +
      `<h3>${d.name}</h3><p>${d.desc}</p><span class="price">${d.price}</span>`;
    menuGrid.appendChild(art);
  });
}

// Spice + allergen meta on every .dish (index's hardcoded cards + menu's rendered
// cards). Guard skips any card already tagged.
document.querySelectorAll('.dish').forEach((card) => {
  if (card.querySelector('.dish-meta')) return;
  const name = card.querySelector('h3')?.textContent.trim();
  const info = DISH_BY_NAME[name];
  if (!info) return;
  const meter = [0, 1, 2].map((i) => flame(i < info.spiceLevel)).join('');
  const allergens = info.allergens.length
    ? `<span class="sr-only">Contains: ${info.allergens.join(', ')}</span>` +
      info.allergens.map((a) => `<span class="allergen" aria-hidden="true">${cap(a)}</span>`).join('')
    : `<span class="sr-only">No major allergens</span><span class="allergen allergen--none" aria-hidden="true">No major allergens</span>`;
  const meta = document.createElement('div');
  meta.className = 'dish-meta';
  meta.innerHTML =
    `<span class="spice" role="img" aria-label="Spice level: ${SPICE_LABELS[info.spiceLevel]}">${meter}</span>` +
    `<span class="allergens">${allergens}</span>`;
  card.appendChild(meta);
});

// Category filter (menu page only). Client-side show/hide, no reload.
const filterBar = document.querySelector('.menu-filters');
if (filterBar && menuGrid) {
  const cards = [...menuGrid.querySelectorAll('.dish')];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  filterBar.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-pill');
    if (!btn) return;
    const cat = btn.dataset.filter;
    filterBar.querySelectorAll('.filter-pill').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    const shown = [];
    cards.forEach((card) => {
      const match = cat === 'all' || card.dataset.category === cat;
      card.style.display = match ? '' : 'none';
      if (match) shown.push(card);
    });
    // Re-fade the shown set (overwrite:true so it can't fight the scroll reveal),
    // then refresh ScrollTrigger so positions recalc after the layout change.
    if (!reduce && window.gsap) {
      gsap.fromTo(shown, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.04, ease: 'power2.out', overwrite: true });
    } else {
      shown.forEach((c) => { c.style.opacity = ''; c.style.transform = ''; });
    }
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  });
}

// ===== motion (GSAP) =====
// Guarded: if the GSAP/ScrollTrigger CDN is blocked or slow, skip all animation.
// [data-reveal] elements have no opacity set without this, so content stays fully visible.
if (window.gsap && window.ScrollTrigger) {
gsap.registerPlugin(ScrollTrigger);

const mm = gsap.matchMedia();
mm.add('(prefers-reduced-motion: no-preference)', () => {
  // hero entrance (home page only)
  if (document.querySelector('.hero')) {
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .from('.hero h1 > span', { yPercent: 110, duration: 1, stagger: 0.12 })
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
  }

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
}

// ===== variable-weight cursor-proximity on headings =====
// Each letter morphs its 'wght' axis from FROM (rest) → TO (at cursor),
// linear by distance, exponentially eased toward target each frame.
// Fine-pointer only — useless without a hovering cursor.
if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const FROM = 600, TO = 900, REACH = 200, TAU = 0.3; // matches the resource (strength 25 → 200px, tween 0.3s)
  const letters = [];

  // Split each heading's text into per-letter spans, grouped into
  // nowrap word-wrappers so words never break mid-letter. Nested markup
  // (e.g. hero's colored line-spans, .accent) is walked and preserved.
  const splitText = (textNode) => {
    const frag = document.createDocumentFragment();
    for (const part of textNode.textContent.split(/(\s+)/)) {
      if (!part) continue;
      if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); continue; }
      const word = document.createElement('span');
      word.style.display = 'inline-block';
      word.style.whiteSpace = 'nowrap';
      for (const ch of part) {
        const s = document.createElement('span');
        s.textContent = ch;
        s.style.display = 'inline-block';
        s.style.fontVariationSettings = `'wght' ${FROM}`;
        word.appendChild(s);
        letters.push(s);
      }
      frag.appendChild(word);
    }
    textNode.parentNode.replaceChild(frag, textNode);
  };

  document.querySelectorAll('h1, h2, h3, h4').forEach((h) => {
    h.setAttribute('aria-label', h.textContent.trim()); // clean text for screen readers
    const texts = [];
    (function walk(n) {
      n.childNodes.forEach((c) => {
        if (c.nodeType === 3 && c.textContent.trim()) texts.push(c);
        else if (c.nodeType === 1) walk(c);
      });
    })(h);
    texts.forEach(splitText);
  });

  if (letters.length) {
    // Letter centers in DOCUMENT coords, measured only on load/resize/font-ready
    // (not per frame or per scroll) — no layout thrash in the rAF loop.
    // Measured via the offset chain, which is immune to CSS transforms, so
    // GSAP's entrance/reveal translates can't corrupt the resting positions.
    let centers = [];
    const measure = () => {
      centers = letters.map((el) => {
        let x = 0, y = 0;
        for (let n = el; n; n = n.offsetParent) { x += n.offsetLeft; y += n.offsetTop; }
        return { x: x + el.offsetWidth / 2, y: y + el.offsetHeight / 2 };
      });
    };
    measure();
    addEventListener('resize', measure, { passive: true });
    if (document.fonts?.ready) document.fonts.ready.then(measure);

    const factors = new Float32Array(letters.length);
    const lastW = new Int16Array(letters.length);
    let cx = -1e5, cy = -1e5, lastT = 0;
    addEventListener('mousemove', (e) => { cx = e.clientX; cy = e.clientY; }, { passive: true });

    requestAnimationFrame(function frame(now) {
      const dt = Math.min(0.1, (now - (lastT || now)) / 1000);
      lastT = now;
      const a = 1 - Math.exp(-dt / TAU); // exponential smoothing toward target
      const mx = cx + scrollX, my = cy + scrollY;
      for (let i = 0; i < letters.length; i++) {
        const c = centers[i];
        if (!c) continue;
        const dx = mx - c.x, dy = my - c.y;
        const target = Math.min(Math.max(1 - Math.hypot(dx, dy) / REACH, 0), 1);
        const f = factors[i] + (target - factors[i]) * a;
        factors[i] = f;
        const w = Math.round(FROM + (TO - FROM) * f);
        if (w !== lastW[i]) { // skip restyle when unchanged
          letters[i].style.fontVariationSettings = `'wght' ${w}`;
          lastW[i] = w;
        }
      }
      requestAnimationFrame(frame);
    });
  }
}
