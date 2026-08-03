// FLOWARDS — Mobile-Nav, aktive Sektion, Formular-UI (ohne Versandlogik)

document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  initActiveNavHighlight();
  initFormPlaceholders();
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

// Die Formulare (Buchung & Kontakt) haben kein eigenes Backend. Als
// pragmatischer, funktionierender Zwischenstand öffnen sie beim Absenden das
// E-Mail-Programm des Besuchers mit einer vorausgefüllten Nachricht, statt nur
// eine Erfolgsmeldung zu simulieren, ohne dass wirklich etwas ankommt.
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
        const text = value.toString().trim();
        if (!text) return;
        bodyLines.push(`${FIELD_LABELS[key] || key}: ${text}`);
      });
      if (senderEmail) {
        bodyLines.push('', `Antwort bitte an: ${senderEmail}`);
      }

      const subject = senderName
        ? `Anfrage über flowards-Website von ${senderName}`
        : 'Anfrage über flowards-Website';
      const mailtoUrl =
        `mailto:${CONTACT_EMAIL}` +
        `?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(bodyLines.join('\n'))}`;

      window.location.href = mailtoUrl;

      if (status) {
        status.textContent =
          'Dein E-Mail-Programm öffnet sich mit einer vorausgefüllten Nachricht — bitte dort absenden.';
        status.classList.add('is-visible');
      }

      form.reset();
    });
  });
}
