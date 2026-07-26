# App veröffentlichen (Handy-Link) – ohne Terminal

Ziel: die App als private Web-App im Netz, die du auf Handy & Laptop nutzt und
die über Supabase synchronisiert. Alles im Browser, kein Python, kein Clone.

## 1. Auf Vercel deployen (~3 Min)

1. Gehe auf **[vercel.com](https://vercel.com)** → **Sign Up** →
   **Continue with GitHub** (dasselbe GitHub-Konto wie das Repo).
2. Oben rechts **Add New… → Project**.
3. In der Liste **`erstes-projekt`** suchen → **Import**.
4. **Wichtig – Root Directory:** auf **Edit** klicken und den Ordner **`app`**
   auswählen.
5. Framework Preset: **Other** (wird meist automatisch erkannt). Build- und
   Output-Felder leer lassen.
6. **Deploy** klicken → ~1 Min warten. Du bekommst eine URL wie
   `https://erstes-projekt-xxxx.vercel.app`. **Diese URL kopieren.**

> Bonus: Vercel ist jetzt mit dem Repo verbunden – wenn ich später etwas
> verbessere und pushe, aktualisiert sich deine App automatisch.

## 2. Supabase für den Login vorbereiten (~2 Min)

1. Supabase → **SQL Editor** → Inhalt von [`supabase/schema.sql`](supabase/schema.sql)
   einfügen → **RUN** (falls noch nicht gemacht; doppelt ist ok).
2. Supabase → **Authentication → URL Configuration**:
   - **Site URL:** deine Vercel-URL (aus Schritt 1.6)
   - **Redirect URLs:** dieselbe Vercel-URL **hinzufügen**
   - Speichern. (Ohne das funktioniert der Login-Link nicht.)

## 3. Nutzen

1. Vercel-URL auf **Handy und Laptop** öffnen.
2. **⚙︎ Profil → E-Mail eingeben → „Link senden"** → Mail öffnen → Link
   anklicken → oben steht **„✓ Sync"**.
3. Auf dem Handy: Browser-Menü → **„Zum Startbildschirm hinzufügen"** → fühlt
   sich an wie eine echte App.
4. Auf beiden Geräten mit **derselben E-Mail** einloggen → gleiche Daten,
   automatisch synchron.

## Sicherheit

Im Repo steht nur der **publishable** Supabase-Key (dafür gemacht, im Client zu
stehen; Daten sind über Row-Level-Security geschützt). Der geheime
`service_role`-Key ist nirgends im Code. Den publishable Key kannst du in
Supabase jederzeit rotieren.
