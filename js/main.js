const IS_EN = document.documentElement.lang === 'en';

// FLOWARDS — Navigation, Kontaktanfrage und zugängliche Methoden-Popover.

document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  initActiveNavHighlight();
  initFormPlaceholders();
  initSkillTooltips();
  initServiceLinks();
  initLanguageLinks();
});

function initNavToggle() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (!toggle || !nav) return;

  const setOpen = (isOpen) => {
    nav.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', IS_EN ? (isOpen ? 'Close menu' : 'Open menu') : (isOpen ? 'Menü schließen' : 'Menü öffnen'));
    toggle.textContent = isOpen ? '✕' : '☰';
  };

  toggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) {
      setOpen(false);
      toggle.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (!nav.contains(event.target) && !toggle.contains(event.target)) setOpen(false);
  });
  window.matchMedia('(min-width: 1101px)').addEventListener('change', () => setOpen(false));
}

function initActiveNavHighlight() {
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
        });
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

// Enable direct sending only when the deployed endpoint reports readiness.
async function initFormPlaceholders() {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;
  const fallback = document.querySelector('[data-contact-fallback]');
  try {
    const response = await fetch('/api/contact', { signal: AbortSignal.timeout(5000) });
    if (!response.ok || !(await response.json()).ready) return;
    form.hidden = false;
    fallback.hidden = true;
  } catch { return; }
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const status = form.querySelector('.form-status');
    const button = form.querySelector('[type="submit"]');
    const data = Object.fromEntries(new FormData(form));
    data.service = form.querySelector('select').selectedOptions[0].textContent.trim();
    button.disabled = true;
    form.setAttribute('aria-busy', 'true');
    status.dataset.state = 'pending';
    status.textContent = IS_EN ? 'Sending your message…' : 'Deine Nachricht wird gesendet…';
    try {
      const response = await fetch('/api/contact', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),signal:AbortSignal.timeout(15000)});
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error('delivery');
      status.dataset.state = 'success';
      status.textContent = IS_EN ? 'Thank you. Your message has been sent to Ilya.' : 'Danke. Deine Nachricht wurde an Ilya gesendet.';
      form.reset();
    } catch {
      status.dataset.state = 'error';
      status.textContent = IS_EN ? 'Your message could not be confirmed. Your entries are still here. Please try again or email Ilya directly.' : 'Der Versand konnte nicht bestätigt werden. Deine Eingaben bleiben erhalten. Bitte versuche es erneut oder schreibe Ilya direkt per E-Mail.';
      fallback.hidden = false;
    } finally { button.disabled = false; form.removeAttribute('aria-busy'); }
  });
}

// Skill-Tree-Kompetenzen: Info-Popover erscheint per CSS bei Hover/Focus.
// Zusätzlich per Klick offen halten (u.a. für Touch-Geräte ohne Hover) und
// beim Klick außerhalb wieder schließen.
function initSkillTooltips() {
  const wraps = document.querySelectorAll('.skill-leaf-wrap');
  if (!wraps.length) return;

  const closeAll = (except) => {
    wraps.forEach((wrap) => {
      if (wrap === except) return;
      wrap.classList.remove('is-open');
      wrap.querySelector('.skill-leaf')?.setAttribute('aria-expanded', 'false');
    });
  };

  wraps.forEach((wrap) => {
    const button = wrap.querySelector('.skill-leaf');
    if (!button) return;

    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const isOpen = wrap.classList.toggle('is-open');
      button.setAttribute('aria-expanded', String(isOpen));
      closeAll(wrap);
    });
  });

  document.addEventListener('click', () => closeAll(null));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeAll(null);
  });
}

function initServiceLinks() {
  const service = document.querySelector('#booking-service');
  if (!service) return;
  document.querySelectorAll('a[data-service]').forEach((link) => {
    link.addEventListener('click', () => {
      service.value = link.dataset.service;
    });
  });
}

// Matching static language pages keep the current section, including without JS.
function initLanguageLinks() {
  const updateLinks = () => {
    document.querySelectorAll('[data-language-link]').forEach((link) => {
      const target = new URL(link.href, location.href);
      target.hash = location.hash;
      link.href = target.href;
    });
  };
  updateLinks();
  window.addEventListener('hashchange', updateLinks);
}
