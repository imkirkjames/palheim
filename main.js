const toggle = document.querySelector('.nav-toggle');
const mobile = document.getElementById('mobile-nav');

function setMenu(open) {
  if (!toggle || !mobile) return;
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  mobile.hidden = !open;
  mobile.classList.toggle('is-open', open);
}

if (toggle && mobile) {
  setMenu(false);
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    setMenu(!open);
  });
  mobile.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setMenu(false);
  });
  window.addEventListener('resize', () => {
    if (window.matchMedia('(min-width: 900px)').matches) setMenu(false);
  });
}

const form = document.getElementById('waitlist-form');
const status = document.getElementById('form-status');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    if (!email || !email.includes('@')) {
      status.textContent = 'Enter a valid email.';
      return;
    }
    const list = JSON.parse(localStorage.getItem('palheim-waitlist') || '[]');
    if (!list.includes(email)) list.push(email);
    localStorage.setItem('palheim-waitlist', JSON.stringify(list));
    status.textContent = "You're on the list (local stub). Real invites come later.";
    form.reset();
  });
}
