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
