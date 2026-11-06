# Validierung der Petrol-Gold-Überarbeitung

- JavaScript-Syntax: `node --check js/main.js` erfolgreich.
- Statische Prüfung aller aktiven HTML-Seiten: lokale Ressourcen, interne Ziele, seitenübergreifende Anker und eindeutige IDs erfolgreich. Alle referenzierten SVG-Dateien parsebar.
- Browserprüfung der Startseite und Referenzseite: Porträt-Fade, Projektkacheln, Logoübersicht, acht Fallbeispiele. 24 Logo-Kacheln vorhanden; keine als fehlgeschlagen gemeldeten Bilder.
- Responsive Browserprüfung in 390- und 320-Pixel-Frames: Slogan und Porträt lesbar, Referenzraster in zwei Spalten. Mobiles Menü öffnet; Referenz-Link führt zur richtigen Seite.
- Tastaturfokus auf einer Logo-Kachel: Originalfarben nach Übergang sichtbar (`filter: none`, `opacity: 1`). Hover und Fokus verwenden dieselbe CSS-Regel. Reduzierte Bewegung und Touch-Darstellung berücksichtigt.
- Der vorhandene Playwright-Smoke-Test wurde nicht ausgeführt. Die Browserprüfung erfolgte mit der verfügbaren Browsersteuerung.
