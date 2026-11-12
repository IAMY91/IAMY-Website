// FLOWARDS — Navigation, Kontaktanfrage und zugängliche Methoden-Popover.

document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  initActiveNavHighlight();
  initFormPlaceholders();
  initSkillTooltips();
  initServiceLinks();
});

function initNavToggle() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (!toggle || !nav) return;

  const setOpen = (isOpen) => {
    nav.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Menü schließen' : 'Menü öffnen');
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
  window.matchMedia('(min-width: 901px)').addEventListener('change', () => setOpen(false));
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

// Kein eigenes Backend: Das Formular bereitet eine E-Mail vor. Der sichtbare
// Link öffnet anschließend das E-Mail-Programm. Die Eingaben bleiben erhalten.
// TODO: Bei Bedarf durch einen echten Formular-Backend-Dienst ersetzen
// (z.B. eigenes Backend, Formspree, Netlify Forms).
const CONTACT_EMAIL = 'ilyalex.yacine@gmail.com';

const FIELD_LABELS = {
  name: 'Name',
  email: 'E-Mail',
  service: 'Leistungsart',
  date: 'Wunschtermin',
  format: 'Format',
  message: 'Nachricht',
};

function initFormPlaceholders() {
  document.querySelectorAll('form[data-demo-form]').forEach((form) => {
    const status = form.querySelector('.form-status');

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!form.reportValidity()) return;

      const data = new FormData(form);
      const senderName = (data.get('name') || '').toString().trim();
      const senderEmail = (data.get('email') || '').toString().trim();

      const bodyLines = [];
      data.forEach((value, key) => {
        const field = form.elements.namedItem(key);
        const text = field instanceof HTMLSelectElement
          ? field.selectedOptions[0]?.textContent.trim()
          : value.toString().trim();
        if (!text) return;
        bodyLines.push(`${FIELD_LABELS[key] || key}: ${text}`);
      });
      if (senderEmail) {
        bodyLines.push('', `Antwort bitte an: ${senderEmail}`);
      }

      const subject = senderName
        ? `Anfrage über AIRFLOW-Website von ${senderName}`
        : 'Anfrage über AIRFLOW-Website';
      const mailtoUrl =
        `mailto:${CONTACT_EMAIL}` +
        `?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(bodyLines.join('\n'))}`;

      if (status) {
        status.textContent =
          'Deine Anfrage ist vorbereitet. Öffne jetzt den Entwurf und sende ihn in deinem E-Mail-Programm ab: ';
        const fallback = document.createElement('a');
        fallback.href = mailtoUrl;
        fallback.textContent = 'Jetzt E-Mail-Entwurf öffnen';
        status.append(fallback);
        status.classList.add('is-visible');
      }
    });
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
