# Projektstand & nächste Schritte

**Stand:** Ende der Session vom 25.07.2026
**Branch:** `claude/meier-sleep-nutrition-weight-tmb0vt`

Dieses Dokument hält fest, wo wir stehen, damit du (oder ich) morgen ohne
Kontextverlust weitermachen kannst.

---

## 0. So holst du alles auf den Laptop

Ich arbeite in einer Cloud-Umgebung, nicht auf deinem Laptop – der Weg führt
über Git. Auf dem Laptop:

```bash
# Falls noch nicht geklont:
git clone https://github.com/giovanni1234i/erstes-projekt.git
cd erstes-projekt
git checkout claude/meier-sleep-nutrition-weight-tmb0vt

# Falls schon geklont:
git fetch origin
git checkout claude/meier-sleep-nutrition-weight-tmb0vt
git pull origin claude/meier-sleep-nutrition-weight-tmb0vt
```

---

## 1. Was schon fertig ist

| Bereich | Datei / Ort | Status |
|---|---|---|
| Schlafplan | `docs/01-schlafplan.md` | ✅ |
| Ernährungsplan (Basis) | `docs/02-ernaehrungsplan.md` | ✅ |
| Whoop-Auswertung (Anleitung) | `docs/03-whoop-auswertung.md` | ✅ |
| Fortschritt & Kontrolle | `docs/04-fortschritt-kontrolle.md` | ✅ |
| Whoop-Analyse-Tool | `scripts/whoop_analyse.py` | ✅ inkl. Zeitfenster (`--last`/`--since`/`--until`) |
| Tracking-Vorlagen | `tracking/*.csv` | ✅ |
| **Whoop-Dashboard** | privater Link (siehe unten) | ✅ mit deinen echten Daten |

**Whoop-Dashboard (privater Link):**
https://claude.ai/code/artifact/5da57c5e-4f2f-40be-baad-bad4c56f48f0

> Das Dashboard und deine Rohdaten enthalten persönliche Gesundheitsdaten und
> liegen **bewusst NICHT im Repo**. Der Link funktioniert auf jedem Gerät
> (auch Laptop). Die Dashboard-Datei bekommst du separat als Download.

**Kernbefund der Whoop-Daten (236 Tage):** Der Schlaf ist über die Offseason
von ~8.5 h (März) auf ~6.8 h (Juli) eingebrochen. Gleichzeitig ist die Kopplung
Schlaf→Recovery von r = 0.52 (Saison) auf r = 0.73 (letzte 30 T) / 0.86
(letzte 14 T) gestiegen – d.h. jede kurze Nacht kostet jetzt ~10–11
Recovery-Punkte. Zurück auf 8.5 h ≈ **+17 Recovery-Punkte**. Hypothese
(Schlaf → Recovery → Appetit) datenseitig bestätigt.

---

## 1b. Profil Meier G. (beantwortet 26.07.2026)

| Punkt | Antwort |
|---|---|
| Gewicht / Ziel / Grösse | 81 kg → 85 kg · 190 cm · 19 J |
| Kalorien | an Trainingstagen mehr (Ruhetag ~3200, Trainingstag ~3900) |
| Lieblingsessen | Pasta, Reis, Lachs, viel Grill im Sommer |
| No-Gos | eher kein Gemüse-Esser |
| Küche | Backofen, Herd, Mixer |
| Kochzeit werktags | 30–40 Min ok |
| Supplements | Whey + Kreatin |
| Einkauf | Migros/Coop, Wocheneinkauf, eher sparsam |
| „Kein Appetit"-Modus | ja (Schnellfilter flüssig/leicht) |

**Kalorien-Begründung (TDEE):** Grundumsatz ~1'900 kcal; Ruhetag ~×1.6 →
~3'050 + Aufbau-Überschuss ≈ **3'200 kcal**; Trainingstag ~×2.0 → ~3'800 +
Überschuss ≈ **3'900 kcal**. Schnitt ~3'550 → ~+0.3–0.4 kg/Woche.

## 2. Die neue Ernährungs-App – schon entschieden

| Punkt | Entscheidung |
|---|---|
| Plattform | Quellcode im Repo **+** echte gehostete Web-App (Vercel) als privater Handy-Link |
| Speicher / Sync | **Supabase** – Login (Magic-Link per E-Mail), Datenbank, Echtzeit-Sync über alle Geräte |
| Portionen | Nur du (1 Person) |
| Einschränkungen | Keine – isst alles |
| Vorrat-Eingabe | Schnellauswahl-Liste **+** freie Texteingabe |
| Menü-Logik | Feste High-Cal-Rezepte **+** flexible Vorschläge aus „was du hast" & „worauf du Lust hast", mit automatischen kcal/Makros |
| Kern-Funktionen | Tages-Log mit Live-kcal/Makro-Zähler · Einkaufsliste (fehlende Zutaten) · Wochen-Menüplan + Meal-Prep-Liste |

**Wichtiger technischer Hinweis:** Ein Claude-„Artifact" (wie das Dashboard)
darf aus Sicherheitsgründen keine Netzwerkaufrufe zu fremden Servern machen –
Supabase wäre blockiert. Deshalb wird die App eine **richtig gehostete
Web-App** (Deploy auf Vercel o. Ä.), nicht ein Artifact.

---

## 3. Offene Fragen – bitte morgen beantworten

Damit die Rezept-Sammlung und die Ziele wirklich zu dir passen:

**Körper & Ziele**
1. Aktuelles **Gewicht**, **Zielgewicht**, **Grösse**? (für kcal-/Protein-Ziele; Protein sonst ~2 g/kg)
2. Kalorien an **Trainingstagen höher** als an freien Tagen, oder fix ~3'750 jeden Tag?

**Essen**
3. **Lieblingsgerichte** (3–6), die sicher rein sollen? Und **No-Gos** (isst du nicht, auch ohne Allergie)?
4. **Küche/Ausstattung**: Mixer (für Shakes)? Backofen? Airfryer? Mikrowelle? Herd?
5. **Werktags-Kochzeit** realistisch: „nur aufwärmen/5 Min" · „15–20 Min" · „auch mal 30–40 Min"?

**Drumherum**
6. **Supplements** vorhanden/gewünscht: Whey, Casein, Creatin, Maltodextrin/Gainer-Pulver?
7. **Einkauf**: wo (Migros/Coop/Denner/Aldi/Lidl…), wie oft, Budget knapp oder egal?
8. **„Kein Appetit"-Schnellfilter** (flüssig/leicht für miese Tage) trotzdem einbauen? (passt zu deinem Ausgangsproblem)

---

## 4. Supabase einrichten (5 Min, wenn du bereit bist)

1. Auf **supabase.com** gratis registrieren → **New Project** (Region Frankfurt/EU).
2. Warten bis fertig, dann **Settings → API**.
3. Mir **zwei** Werte geben: **Project URL** und **anon public key**.

⚠️ Den **`service_role`-Key NICHT** weitergeben (geheim!). Der `anon`-Key ist
dafür gemacht, im App-Code zu stehen; die Daten werden zusätzlich per
Row-Level-Security abgesichert. Das SQL für die Tabellen liefere ich fertig.

Die Keys können auch später kommen – die App läuft zuerst lokal und schaltet
Sync an, sobald die Keys da sind.

---

## 5. Bauplan (Phasen)

- **✅ Phase 1 – Gerüst & Kern (lokal lauffähig):** ERLEDIGT. Liegt in
  [`app/`](app/README.md). Vorrat, Rezepte (auf deine Vorlieben zugeschnitten),
  Menü-Vorschläge + „kochbar mit Vorrat", Tages-Log mit kcal/Makro-Zähler,
  Wochen-Menüplan, automatische Einkaufsliste, Profil/Ziele, Backup. Läuft
  lokal (localStorage), Light/Dark, Handy-tauglich.
  Start: `cd app && python3 -m http.server 8000` → http://localhost:8000
- **🟡 Phase 2 – Supabase-Sync:** Code ist FERTIG eingebaut (`app/sync.js`,
  Login per E-Mail-Magic-Link, ganzer Zustand als JSON in Tabelle `app_state`,
  Realtime + Pull beim Öffnen). **Wartet auf deinen Login-Test** auf dem Gerät
  (aus Claudes Cloud ist supabase.co gesperrt). To-dos: `schema.sql` erneut
  ausführen (enthält jetzt `app_state`), in Supabase die Redirect-URLs setzen,
  `app/config.local.js` anlegen – Details in [`supabase/SETUP.md`](supabase/SETUP.md).
- **Phase 3 – Feinschliff:** Menüplan an deine Trainingszeiten koppeln,
  Meal-Prep-Liste (So ~60 Min), Rezepte-Editor, mehr Nährwerte.
- **Phase 3b – Foto-Analyse in der App:** Foto von Quittung/Teller →
  automatische Erkennung von Lebensmitteln/kcal. Braucht einen kleinen
  Backend-Endpunkt (Vercel-Function) + einen **Anthropic-API-Key** (als
  Server-Env-Variable, nicht im Client; Kosten pro Analyse gering). Bis dahin:
  Fotos **im Chat** an Claude schicken → Analyse + Meals kommen zurück.
- **Phase 4 – Deploy:** als private Web-App hosten (Vercel) → dein Handy-Link,
  Homescreen- und offline-fähig.

### Bereits berücksichtigt
- **Clubrestaurant-Mittag:** In der App gibt es beim Eintragen den Modus
  „🍽 Auswärts" (Name + geschätzte kcal, Makros optional) plus „Auswärts"-
  Presets. So wird der Mittag nicht als Koch-Rezept geplant.
- **Meals generieren:** Claude kann dir jederzeit Wochenpläne/Rezepte bauen
  (im Chat) – rund um deinen Clubrestaurant-Mittag.

**Geplanter Stack:** schlanke Single-Page-App (HTML/JS) · Supabase-JS-Client ·
Deploy auf Vercel · Nährwerte aus einer eingebauten Lebensmittel-Tabelle
(erweiterbar).
