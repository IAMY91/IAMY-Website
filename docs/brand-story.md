# FLOWARDS · Brand Story

Die Startseite folgt dem StoryBrand-SB7-Modell. Die Menschen, die Veränderung in ihren Organisationen gestalten, stehen im Mittelpunkt. Ilya und FLOWARDS begleiten sie auf ihrem Weg.

| SB7-Element | Botschaft | Umsetzung auf der Website |
| --- | --- | --- |
| 1. Ein Mensch mit einem Ziel | Du willst deine Organisation weiterentwickeln, mit einem klaren Kurs und Menschen, die Veränderung mittragen. | Hero: „Damit Veränderung lebendig wird.“ |
| 2. Ein Problem | Äußerlich: konkurrierende Initiativen, Silos, geringe Nutzung neuer Werkzeuge. Innerlich: Orientierungslosigkeit und das Gefühl, trotz großer Anstrengung nicht voranzukommen. Grundüberzeugung: Veränderung sollte Menschen stärken. | „Viel Veränderung. Zu wenig Bewegung?“ mit drei konkreten Situationen. |
| 3. Eine Begleitung | Du kennst dein System. Ilya bringt eine neue Perspektive, Empathie und praktische Erfahrung mit. | Persönliche Vorstellung, vorhandene Qualifikationen und konkrete Projektbeispiele. |
| 4. Ein Plan | Verstehen → Ausrichten → Wachsen. | Drei Schritte mit einem nachvollziehbaren Ergebnis je Schritt. |
| 5. Eine Einladung zum Handeln | Direkt: ein unverbindliches Erstgespräch anfragen. Niedrigschwellig: den Weg kennenlernen oder einen bestehenden Blogimpuls lesen. | Wiederkehrende Kontaktangebote, Ablauf, Impulse und Kontaktformular. |
| 6. Vermeidbare Folgen | Ohne Orientierung und Beteiligung können Initiativen versanden und Menschen ihre Energie verlieren. | Kurzer, sachlicher Absatz beim Zukunftsbild, ohne Angstmache. |
| 7. Ein gelingendes Zukunftsbild | Ein gemeinsamer Kurs, klare Rollen, tragfähige Zusammenarbeit und neue Arbeitsweisen, die im Alltag wachsen. | „Weniger Reibung. Mehr Richtung. Raum für Potenzial.“ |

## Gestalterische Übersetzung

- Tiefgrün `#082b22` und `#05251d`, Creme `#f3f1e7`, Salbei und warmes Gold `#e6c384`.
- Eigenständig gezeichnete SVG-Blattstruktur mit Blattadern, Strömungslinien und Verzweigungen. Kein externer Bilddienst und keine neue Laufzeitabhängigkeit.
- Lokal eingebundene Urbanist-Schrift, kursive Serifenschrift als Akzent, ruhige Flächen und organische Konturen.
- Die aktuelle Startseite, der Blog und die rechtlichen Unterseiten verwenden `css/flowards.css`. Historische `index-alt*`-Varianten bleiben erhalten.
- Vorhandene Projekterfahrung, frühere Stationen, Publikationen, Qualifikationen und Methoden bleiben zugänglich. Es wurden keine Kundenzitate oder Erfolgszahlen erfunden. Bilder aus der Workshop- und Speaker-Arbeit sind entsprechend gekennzeichnet.

## Über mich: Qualifikationen und Wirkungsstationen

Die eigenständige Seite `ueber-mich.html` zeigt zwölf im Lebenslauf belegte Aus- und Weiterbildungen mit Zeitraum, Anbieter und redaktioneller Kurzbeschreibung. Darunter steht der Download-Link zum unverändert hochgeladenen `Ilya_Yacine_CV_2026.pdf`. Die Startseite behält eine kurze Vorstellung mit Link zur Über-mich-Seite. Die sieben beruflichen Stationen sind als vertikale Timeline dargestellt, absteigend nach Beginn der Tätigkeit. Zeitliche Überschneidungen bleiben erhalten.

Quelle: vom Nutzer bereitgestellter Lebenslauf `Ilya_Yacine_CV_2026.pdf`. Bei Abweichungen von den bisherigen Website-Angaben wurden die Berufs- und Bildungsdaten im Über-mich-Bereich an das PDF angepasst. Der LinkedIn-Abruf ist weiterhin durch die Netzwerkfreigabe gesperrt (CONNECT 403). Die Liste behauptet deshalb keine vollständige Übernahme der LinkedIn-Zertifikate; ExO Foundations und Führung in selbstgesteuerten Teams wurden mangels Beleg im PDF aus dieser Leiste entfernt. Die einzelnen Kursbeschreibungen sind redaktionelle Zusammenfassungen, keine Zitate aus LinkedIn.

## Kontaktverhalten

Das Formular validiert Name, E-Mail und Nachricht und erstellt einen `mailto:`-Entwurf mit lesbaren Leistungsbezeichnungen. Erst der danach angezeigte Link öffnet das E-Mail-Programm. Die Website versendet keine Nachrichten und speichert keine Formulardaten. Ein vorhandenes E-Mail-Programm ist für diesen Weg erforderlich; die direkte E-Mail-Adresse bleibt sichtbar.

## Lokal entwickeln

Im bestehenden Checkout `/workspace/IAMY-Website`:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
node --check js/main.js
```

Kein Build-Schritt und keine Paketinstallation erforderlich. Browserprüfung: mobile Navigation einschließlich Escape und Fokus, Angebotsdetails, Leistungsvorauswahl im Formular, Methoden-Popover, Projektarchiv, Formularvalidierung, E-Mail-Entwurf, lokale Links und Ressourcen sowie die bestehenden Blog- und rechtlichen Unterseiten. Bewegungseinstellungen über `prefers-reduced-motion` werden berücksichtigt.

Die verlinkte Inspirationsseite `https://robin-hotz.com/` war während der Umsetzung wegen einer Netzwerkfreigabe nicht abrufbar (CONNECT 403). Die Gestaltung basiert auf der hochgeladenen grünen, biomimetischen Referenz und den vorhandenen Website-Inhalten; eine Sichtprüfung der Inspirationsseite war nicht möglich.
