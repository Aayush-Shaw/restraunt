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

// booking form → Formspree, inline status (contact page only)
const form = document.querySelector('.booking-form');
if (form) {
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

// ===== motion (GSAP) =====
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

// ===== variable-weight cursor-proximity on headings =====
// Each letter morphs its 'wght' axis from FROM (rest) → TO (at cursor),
// linear by distance, exponentially eased toward target each frame.
// Fine-pointer only — useless without a hovering cursor.
if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const FROM = 400, TO = 900, REACH = 200, TAU = 0.3; // matches the resource (strength 25 → 200px, tween 0.3s)
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
