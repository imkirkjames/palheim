const header = document.getElementById('site-header');
const toggle = document.querySelector('.nav-toggle');
const mobile = document.getElementById('mobile-nav');

function setMenu(open) {
  if (!header || !toggle) return;
  header.classList.toggle('is-menu-open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}

setMenu(false);

if (toggle) {
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = header.classList.contains('is-menu-open');
    setMenu(!open);
  });
}

if (mobile) {
  mobile.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => setMenu(false));
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') setMenu(false);
});

document.addEventListener('click', (e) => {
  if (!header) return;
  if (!header.contains(e.target)) setMenu(false);
});

window.addEventListener('resize', () => {
  if (window.matchMedia('(min-width: 900px)').matches) setMenu(false);
});

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
