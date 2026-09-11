const toggle = document.querySelector('.nav-toggle');
const mobile = document.getElementById('mobile-nav');
if (toggle && mobile) {
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    mobile.hidden = open;
  });
  mobile.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
    toggle.setAttribute('aria-expanded', 'false');
    mobile.hidden = true;
  }));
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
