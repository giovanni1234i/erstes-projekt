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

## 5. Geplanter Bauplan (Phasen)

- **Phase 1 – Gerüst & Kern (lokal lauffähig):** Vorrat-Verwaltung,
  Rezept-/Nährwert-Datenmodell, Menü-Vorschläge aus Vorrat + Lust,
  Tages-Log mit kcal/Makro-Zähler gegen dein Ziel. Speichert erst lokal.
- **Phase 2 – Supabase:** Login, Datenbank, Echtzeit-Sync über Geräte (sobald Keys da).
- **Phase 3 – Menüplan & Einkauf:** Wochenplan an deinen Trainingszeiten,
  Meal-Prep-Liste (So ~60 Min), automatische Einkaufsliste (Vorrat vs. Plan).
- **Phase 4 – Deploy:** Als private Web-App hosten → dein Handy-Link,
  Homescreen-fähig, offline-tauglich.

**Geplanter Stack:** schlanke Single-Page-App (HTML/JS) · Supabase-JS-Client ·
Deploy auf Vercel · Nährwerte aus einer eingebauten Lebensmittel-Tabelle
(erweiterbar).
