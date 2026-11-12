# AIRFLOW · Ilya Alexander Yacine

Statische Website für Organisationsentwicklung, Leadership Coaching und Facilitation. Die aktuelle Gestaltung nutzt tiefe Petrolflächen, cremefarbene Serifentitel, türkisfarbene Verbindungslinien und zurückhaltende goldene Akzente. Die Startseite verbindet Flow Science, Biomimicry und KI mit Organisationsentwicklung und konkreten Anwendungen.

## Lokal starten

Im Repository:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Python 3 genügt für den Entwicklungsserver. Die Website benötigt weder Paketinstallation noch Build-Schritt oder Backend. Schriften und Gestaltungselemente liegen lokal im Repository.

## Aufbau

- `index.html`: aktuelle Startseite.
- `referenzen.html`: acht Projektkacheln, 24 Logo-Kacheln und acht Fallbeispiele.
- `docs/logo-sources-a.json` / `docs/logo-sources-b.json`: recherchierte Original-Logoquellen.
- `docs/reference-content.md`: Inhaltseinordnung, Logoherkunft und Designhinweise.
- `ueber-mich.html`: eigenständige Vorstellung mit Qualifikationen, Lebenslauf-Download und beruflicher Timeline.
- `css/flowards.css`: bestehende Layout- und Komponentenbasis.
- `css/airflow.css`: gemeinsames AIRFLOW-Design für alle veröffentlichten Seiten.
- `assets/brand/personal-mark.svg`: Originalemblem aus dem bereitgestellten LinkedIn-Banner, über einen SVG-Ausschnitt eingebunden.
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

Das Formular bereitet eine E-Mail vor. Ein anschließend angezeigter Link öffnet den Entwurf im E-Mail-Programm. Erst dort kann die Nachricht versendet werden. Es gibt keinen serverseitigen Versand und keine Speicherung der Formulardaten auf der Website.
