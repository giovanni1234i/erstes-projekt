# Projektkontext & Arbeitsstil

## Arbeitsstil (ausdrücklicher Wunsch des Nutzers)
- **Proaktiv ausfragen.** Vor UND während der Arbeit gezielte Rückfragen
  stellen, bis das Bild klar ist. Der Nutzer will lieber mehr gefragt werden –
  je mehr Kontext, desto besser das Ergebnis. Format: kurze Auswahl-Fragen
  (Chips/Optionen) plus ein paar offene Fragen.
- Ehrlich über Machbarkeit sein; nichts versprechen, das technisch nicht geht.
- Nach Änderungen: committen + pushen, dann live nachziehen.

## Projekt
- Ernährungs-/Performance-App für Eishockeyspieler „Meier G." (Ziel: Gewicht/
  Muskel aufbauen; Ausgangsproblem Schlafmangel → Appetitverlust).
- **Live:** https://ernaehrung-meier.vercel.app (Vercel, Konto giovanni1234i).
- **Branch:** `claude/meier-sleep-nutrition-weight-tmb0vt`.
- **Stack:** statische SPA in `app/`, Supabase (Sync über Tabelle `app_state`,
  Login per E-Mail-Magic-Link). Deploy: `index.html` lädt die App-Dateien via
  jsDelivr, gepinnt auf einen Commit-SHA → auf Vercel deployt.
- **Deploy-Ablauf nach Änderungen:** commit + push → neuen Commit-SHA holen →
  `deploy_to_vercel` mit `index.html`, das auf den neuen SHA zeigt.
- Profil, offene Punkte, Setup: siehe `NAECHSTE-SCHRITTE.md`.

## Datenschutz
- Repo ist ÖFFENTLICH. Keine echten Geheimnisse committen – nur der Supabase
  **publishable** Key steht im Code (RLS schützt die Daten). Whoop-Rohdaten und
  Backups bleiben draussen (`.gitignore`).
