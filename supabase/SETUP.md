# Supabase einrichten (~5 Minuten)

Damit die Ernährungs-App über alle Geräte synchronisiert, braucht sie einen
Supabase-Backend. Das Konto/Projekt kann nur **du** anlegen (Login + E-Mail-
Bestätigung). Alles andere ist hier vorbereitet.

## Schritt für Schritt

1. **Registrieren:** auf [supabase.com](https://supabase.com) mit GitHub oder
   E-Mail anmelden (gratis).
2. **Projekt erstellen:** *New Project*
   - Name: z.B. `ernaehrung-meier`
   - **Database Password:** ein starkes Passwort setzen und **dir merken**
     (brauchst du für die DB, NICHT für die App – nicht an mich schicken).
   - **Region: Frankfurt (EU Central)** wählen (näher = schneller, DSGVO).
   - *Create new project* → ~1–2 Min warten, bis es bereit ist.
3. **Tabellen anlegen:** links **SQL Editor** → *New query* →
   den ganzen Inhalt von [`schema.sql`](schema.sql) einfügen → **RUN**.
   Es sollte „Success. No rows returned" erscheinen.
4. **Zugangsdaten holen:** links **Project Settings → API**. Dort findest du:
   - **Project URL** (z.B. `https://abcdxyz.supabase.co`)
   - **Project API keys → `anon` `public`**
5. **Diese ZWEI Werte an mich schicken:** *Project URL* + *anon public key*.

## ⚠️ Sicherheit

- Der **`anon` public key** ist dafür gemacht, im App-Code zu stehen – er ist
  ungefährlich, weil die Daten zusätzlich per Row-Level-Security (siehe
  `schema.sql`) geschützt sind. **Den darfst du mir geben.**
- Den **`service_role`-Key** (steht direkt darunter, „secret") und das
  **Database Password** **NIE weitergeben** – die umgehen alle Schutzregeln.

## Was danach passiert

Sobald deine zwei Werte da sind, trage ich sie in die App ein
(Vorlage: [`config.example.json`](config.example.json)), aktiviere den
E-Mail-Login (Magic-Link) und schalte den Geräte-Sync scharf. Die echten
Zugangsdaten kommen in eine lokale Datei, die per `.gitignore` **nicht**
ins Repo gepusht wird.
