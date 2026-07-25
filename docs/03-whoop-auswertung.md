# Whoop-Auswertung: Schlaf ↔ Recovery ↔ Strain

## Warum

Die zentrale Frage lautet: **Wie stark drücken kurze Nächte die Recovery?**
Wenn wir das quantifizieren, sieht man schwarz auf weiss, was ein 6-Stunden-Night
kostet – und kann Trainings- und Essenszeiten entsprechend anpassen.

## Datenbeschaffung (manueller Weg)

Es gibt **keinen Whoop-Connector** im Claude-Verzeichnis. Zwei Optionen:

1. **CSV-Export (empfohlen):** Whoop App → **Settings → Account → Data Export**.
   Whoop schickt ein ZIP per Mail. Relevant ist darin die Datei
   **`physiological_cycles.csv`**.
2. **Screenshots:** Sleep / Recovery / Strain der **letzten 2 Wochen**. Damit
   lässt sich die Vorlage `tracking/whoop-daten-vorlage.csv` von Hand füllen.

Für eine aussagekräftige Korrelation braucht es mindestens **~10–14 Tage**.

## Auswertung starten

```bash
python3 scripts/whoop_analyse.py pfad/zu/physiological_cycles.csv
```

- **Keine Pakete nötig** (nur Python 3.8+, reine Standardbibliothek).
- Das Skript erkennt die Whoop-Spalten automatisch. Falls die Kopfzeilen
  abweichen, lassen sie sich überschreiben:

```bash
python3 scripts/whoop_analyse.py daten.csv \
  --sleep-col "Asleep duration (min)" \
  --recovery-col "Recovery score %" \
  --strain-col "Day Strain" \
  --date-col "Cycle start time"
```

Test ohne echte Daten:

```bash
python3 scripts/whoop_analyse.py tracking/whoop-daten-vorlage.csv
```

## Was das Skript rechnet

| Kennzahl | Frage, die sie beantwortet |
|---|---|
| **Schlaf ↔ Recovery** (Korrelation) | Bringt mehr Schlaf messbar mehr Recovery? |
| **Regressions-Steigung** | Wie viele Recovery-Prozentpunkte kostet **eine Stunde weniger Schlaf**? |
| **Strain (Vortag) ↔ Recovery** | Drückt ein harter Tag die Recovery am Folgetag? |
| **Schlaf ↔ Strain (gleicher Tag)** | Nach kurzen Nächten weniger Belastbarkeit? |
| **Ø Schlaf & Nächte unter Ziel** | Wie oft wurde das 8-h-Ziel verfehlt? |

Es werden sowohl **Pearson** (linearer Zusammenhang) als auch **Spearman**
(Rang-Zusammenhang, robuster gegen Ausreisser) ausgegeben, dazu eine
Einordnung der Stärke (schwach / moderat / deutlich / stark).

## Interpretation (Faustregeln)

- **Steigung z. B. +5 %/h:** Jede Stunde weniger Schlaf ≈ 5 Recovery-Punkte
  weniger. Von 8 h auf 6 h wären das ~10 Punkte – das ist der Unterschied
  zwischen grüner und gelber Recovery.
- Ist die Korrelation Schlaf↔Recovery **deutlich/stark**, bestätigt das den Plan:
  der Schlaf ist der Hebel, konsequent dranbleiben.
- Ist sie **schwach**, obwohl der Appetit weiter fehlt → andere Ursachen mit
  Team-Arzt abklären (siehe [`04-fortschritt-kontrolle.md`](04-fortschritt-kontrolle.md)).

> Korrelation ist kein Beweis für Kausalität, und ~2 Wochen sind eine kleine
> Stichprobe. Die Zahlen sind ein **Kompass**, kein Urteil.
