// nav glass state
const nav = document.querySelector('.nav');
addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 40), { passive: true });

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
