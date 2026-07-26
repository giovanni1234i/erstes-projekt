# Ernährungs-App – Meier G. (Phase 1)

Voll funktionsfähige, **lokal laufende** Ernährungs-App: Vorrat, Rezepte,
Menü-Vorschläge, Tages-Log mit kcal/Makro-Zähler, Wochen-Menüplan und
Einkaufsliste. Zugeschnitten auf Pasta/Reis/Lachs/Grill, Whey + Kreatin,
Trainings-/Ruhetag-Ziele.

## Starten (lokal, ohne Installation)

Am einfachsten mit einem kleinen Webserver (nötig, damit später Supabase/
Login sauber läuft):

```bash
cd app
python3 -m http.server 8000
# dann im Browser: http://localhost:8000
```

Zum schnellen Ausprobieren reicht auch: `app/index.html` direkt im Browser
öffnen (Doppelklick). Der lokale Speicher (localStorage) funktioniert so.

Auf dem Handy zum Homescreen hinzufügen → verhält sich wie eine App.

## Was drin ist

| Tab | Funktion |
|---|---|
| **Heute** | Trainings-/Ruhetag umschalten, kcal + Protein/Kohlenhydrate/Fett gegen dein Ziel, Mahlzeiten pro Slot loggen, „Kein Appetit?"-Shortcut |
| **Vorrat** | Häufige Zutaten anhäkeln + Freitext – Basis für „kochbar mit Vorrat" |
| **Rezepte** | Suche „worauf hast du Lust", Filter (kochbar / Favoriten / kein-Appetit / Tags), Makros, Details, „+ Zu Heute" |
| **Plan** | Wochen-Menüplan (Mo–So × Slots) |
| **Einkauf** | Automatische Liste aus dem Plan (minus Vorrat) + manuelle Artikel |
| **⚙︎ Profil** | Ziele bearbeiten, wöchentliches Wiegen, Backup (Export/Import) |

## Daten & Speicher

- **Phase 1:** alles lokal im Browser (`localStorage`). Kein Konto nötig.
  Sichere deine Daten über **Profil → Export**.
- **Phase 2 (Sync):** eingebaut in `sync.js`. Login per E-Mail-Magic-Link,
  der ganze Zustand wird als JSON in der Supabase-Tabelle `app_state`
  synchronisiert (Realtime + Pull beim Öffnen). Aktivieren: `app/config.local.js`
  anlegen (Vorlage `config.example.js`) und die Schritte in
  [`../supabase/SETUP.md`](../supabase/SETUP.md) befolgen. Ohne Config/Login
  läuft die App normal lokal weiter.

## Aufbau (Sync)

```
app/
  vendor/supabase.js  – Supabase-Client (vendored, kein CDN nötig)
  config.local.js     – deine Supabase-URL + Key (NICHT im Repo)
  sync.js             – Auth + Geräte-Sync über app_state
```

## Aufbau

```
app/
  index.html   – Einstieg, lädt die Skripte
  style.css    – Design (Light/Dark, Mobile-first)
  data.js      – Seed: Nährwerte, Rezepte, Vorrat-Schnellauswahl, Ziele
  store.js     – Datenhaltung (localStorage; Austauschpunkt für Supabase)
  app.js       – UI, Navigation, Logik
```
