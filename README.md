# AIRFLOW · Ilya Alexander Yacine

Statische Website für Organisationsentwicklung, Leadership Coaching und Facilitation. Die aktuelle Gestaltung nutzt tiefe Petrolflächen, cremefarbene Serifentitel, türkisfarbene Verbindungslinien und zurückhaltende goldene Akzente. Die Startseite verbindet Flow Science, Biomimicry und KI mit Organisationsentwicklung und konkreten Anwendungen.

## Lokal starten

Im Repository:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Python 3 genügt für den Entwicklungsserver. Die statischen Seiten benötigen weder Paketinstallation noch Build-Schritt. Der optionale Kontaktversand nutzt eine separat konfigurierte Vercel-Funktion. Schriften und Gestaltungselemente liegen lokal im Repository.

## Aufbau

- `index.html`: aktuelle Startseite.
- `referenzen.html`: acht Projektkacheln, 24 Logo-Kacheln und acht Fallbeispiele.
- `docs/logo-sources-a.json` / `docs/logo-sources-b.json`: recherchierte Original-Logoquellen.
- `docs/reference-content.md`: Inhaltseinordnung, Logoherkunft und Designhinweise.
- `ueber-mich.html`: eigenständige Vorstellung mit Qualifikationen, Lebenslauf-Download und beruflicher Timeline.
- `css/flowards.css`: bestehende Layout- und Komponentenbasis.
- `css/airflow.css`: gemeinsames AIRFLOW-Design für alle veröffentlichten Seiten.
- `assets/brand/personal-mark.svg`: Vektorfassung des vom Nutzer bereitgestellten Originalemblems.
- `assets/brand/airflow-network.svg`: dekorative, organische Verbindungslinien.
- `js/main.js`: Navigation, Kontaktentwurf, Angebotsauswahl und Methoden-Popover.
- `assets/brand/flow-botanical.svg`: eigenständige biomimetische Liniengrafik.
- `blog/`: vorhandene Artikel im gemeinsamen Design.
- [Brand Story](docs/brand-story.md): SB7-Zuordnung, Gestaltung und Kontaktverhalten.

Die historischen `index-alt*`- und `index-original.html`-Entwürfe bleiben erhalten.

## Prüfen

```sh
node --check js/main.js
node tests/smoke.cjs
```

Für den Browsertest muss der lokale Server laufen. Er verwendet das in der vorbereiteten Cloud-Umgebung verfügbare Playwright und Chromium. Außerhalb dieser Umgebung müssen diese separat vorhanden sein. Optional lassen sich `SITE_URL` und `CHROMIUM_PATH` setzen.

Der Test prüft die responsive Darstellung von 320 bis 1440 Pixeln, Navigation und Fokus, aufklappbare Inhalte, Formularvalidierung, den erzeugten E-Mail-Entwurf sowie Seiten, Links und Ressourcen. Er öffnet keinen E-Mail-Entwurf und versendet keine Nachricht.

## Kontaktformular

`api/contact.js` implements a Vercel contact endpoint using server-side email delivery. Direct sending is disabled by default; visitors see a single-click email link. The form appears only when the endpoint confirms configured readiness. See `docs/contact-setup.md` for activation and `docs/legal-details-needed.md` for missing owner information.

Run `node --test tests/contact-api.cjs` for mocked delivery, readiness, validation and failure checks. No email is sent by the tests.

## Languages and perspective model

The original German pages remain at the root; complete English versions live under `en/`, including the About page, project references, three articles and the existing legal drafts. The DE / ENG selector links to the matching page and preserves the current section when JavaScript is available. The existing CV and external German articles remain in their original language and are labelled accordingly in English.

Reviewed English copy lives in `translations/en.json`. After editing the German sources, update that mapping and run `python3 scripts/build-english.py`. Both languages share the same CSS, JavaScript, original hero photograph and personal emblem. Contact form labels, menu labels, email subject and draft status follow the selected document language.

The homepage uses four overlapping, linked circles for Biomimicry, Flow Science, AI and Organizational Development, centered on Regenerative Organizations. The same anchors link each circle to a readable explanation. The original workshop photograph is restored beside the hero with responsive CSS fade masks.

Run `python3 tests/bilingual-static.py` to check all 18 pages, matching language links and anchors, page structure and local assets.
