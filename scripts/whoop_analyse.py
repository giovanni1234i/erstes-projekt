#!/usr/bin/env python3
"""Whoop-Auswertung: Schlaf <-> Recovery <-> Strain.

Liest einen Whoop-CSV-Export (physiological_cycles.csv) oder die Vorlage
tracking/whoop-daten-vorlage.csv und quantifiziert, wie stark kurze Naechte
die Recovery druecken.

Bewusst OHNE externe Pakete (nur Python-Standardbibliothek), damit es ueberall
laeuft:

    python3 scripts/whoop_analyse.py pfad/zur/physiological_cycles.csv

Spalten werden automatisch erkannt. Bei abweichenden Kopfzeilen ueberschreiben:

    python3 scripts/whoop_analyse.py daten.csv \\
        --sleep-col "Asleep duration (min)" \\
        --recovery-col "Recovery score %" \\
        --strain-col "Day Strain" \\
        --date-col "Cycle start time"
"""

from __future__ import annotations

import argparse
import csv
import math
import sys
from datetime import datetime

# Ziel-Schlafdauer aus dem Schlafplan (Stunden). Naechte darunter zaehlen als
# "unter Ziel".
SCHLAF_ZIEL_H = 8.0


# --------------------------------------------------------------------------- #
# Spaltenerkennung
# --------------------------------------------------------------------------- #

def _finde_spalte(header, *keyword_gruppen):
    """Sucht die erste Spalte, die alle Keywords einer Gruppe enthaelt.

    keyword_gruppen wird der Reihe nach probiert (erste Gruppe = beste Wahl).
    """
    lower = {h: h.lower() for h in header}
    for gruppe in keyword_gruppen:
        for spalte, klein in lower.items():
            if all(k in klein for k in gruppe):
                return spalte
    return None


def erkenne_spalten(header, args):
    """Bestimmt die relevanten Spalten (CLI-Override hat Vorrang)."""
    sleep = args.sleep_col or _finde_spalte(
        header, ("asleep", "min"), ("sleep", "duration"), ("schlaf",)
    )
    recovery = args.recovery_col or _finde_spalte(
        header, ("recovery", "%"), ("recovery",), ("erholung",)
    )
    strain = args.strain_col or _finde_spalte(
        header, ("day", "strain"), ("strain",), ("belastung",)
    )
    date = args.date_col or _finde_spalte(
        header, ("cycle", "start"), ("start", "time"), ("date",), ("datum",)
    )
    return sleep, recovery, strain, date


def _schlaf_einheit(spaltenname, override):
    """Ermittelt, ob die Schlafspalte in Minuten oder Stunden vorliegt."""
    if override:
        return override
    klein = spaltenname.lower()
    if "min" in klein:
        return "min"
    if "(h" in klein or "hour" in klein or "std" in klein:
        return "h"
    # Whoop-Default ist Minuten.
    return "min"


# --------------------------------------------------------------------------- #
# Parsing
# --------------------------------------------------------------------------- #

def _zu_float(wert):
    if wert is None:
        return None
    s = str(wert).strip().replace(",", ".")
    if s == "":
        return None
    try:
        return float(s)
    except ValueError:
        return None


def _zu_datum(wert):
    if not wert:
        return None
    s = str(wert).strip()
    for fmt in (
        "%Y-%m-%d %H:%M:%S",
        "%Y-%m-%d %H:%M",
        "%Y-%m-%dT%H:%M:%S",
        "%Y-%m-%d",
        "%d.%m.%Y %H:%M",
        "%d.%m.%Y",
    ):
        try:
            return datetime.strptime(s, fmt)
        except ValueError:
            continue
    return None


def lade_daten(pfad, args):
    """Liest die CSV und gibt eine nach Datum sortierte Liste von Zeilen zurueck.

    Jede Zeile: {"datum", "schlaf_h", "recovery", "strain"} (Werte koennen None
    sein, wenn die Zelle leer/ungueltig war).
    """
    with open(pfad, newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        if reader.fieldnames is None:
            sys.exit("Fehler: Die Datei enthaelt keine Kopfzeile.")
        header = reader.fieldnames
        sleep_c, rec_c, strain_c, date_c = erkenne_spalten(header, args)

        fehlend = [
            name for name, col in (
                ("Schlafdauer", sleep_c),
                ("Recovery", rec_c),
                ("Strain", strain_c),
            ) if col is None
        ]
        if fehlend:
            sys.exit(
                "Fehler: Spalte(n) nicht gefunden: " + ", ".join(fehlend) + ".\n"
                "Vorhandene Spalten:\n  " + "\n  ".join(header) + "\n"
                "Bitte mit --sleep-col / --recovery-col / --strain-col angeben."
            )

        einheit = _schlaf_einheit(sleep_c, args.sleep_unit)
        zeilen = []
        for row in reader:
            schlaf = _zu_float(row.get(sleep_c))
            if schlaf is not None and einheit == "min":
                schlaf = schlaf / 60.0
            zeilen.append({
                "datum": _zu_datum(row.get(date_c)) if date_c else None,
                "schlaf_h": schlaf,
                "recovery": _zu_float(row.get(rec_c)),
                "strain": _zu_float(row.get(strain_c)),
            })

    # Nach Datum sortieren, falls vorhanden (wichtig fuer die Lag-Analyse).
    if all(z["datum"] is not None for z in zeilen) and zeilen:
        zeilen.sort(key=lambda z: z["datum"])
        sortiert = True
    else:
        sortiert = False

    meta = {
        "sleep_col": sleep_c, "recovery_col": rec_c, "strain_col": strain_c,
        "date_col": date_c, "einheit": einheit, "sortiert": sortiert,
    }
    return zeilen, meta


# --------------------------------------------------------------------------- #
# Statistik (Standardbibliothek)
# --------------------------------------------------------------------------- #

def _paare(zeilen, key_x, key_y):
    return [
        (z[key_x], z[key_y])
        for z in zeilen
        if z[key_x] is not None and z[key_y] is not None
    ]


def pearson(paare):
    n = len(paare)
    if n < 2:
        return None
    xs = [p[0] for p in paare]
    ys = [p[1] for p in paare]
    mx = sum(xs) / n
    my = sum(ys) / n
    sxy = sum((x - mx) * (y - my) for x, y in paare)
    sxx = sum((x - mx) ** 2 for x in xs)
    syy = sum((y - my) ** 2 for y in ys)
    if sxx == 0 or syy == 0:
        return None
    return sxy / math.sqrt(sxx * syy)


def _raenge(werte):
    """Durchschnittsraenge (Ties werden gemittelt)."""
    order = sorted(range(len(werte)), key=lambda i: werte[i])
    raenge = [0.0] * len(werte)
    i = 0
    while i < len(order):
        j = i
        while j + 1 < len(order) and werte[order[j + 1]] == werte[order[i]]:
            j += 1
        mittel = (i + j) / 2.0 + 1.0  # Raenge starten bei 1
        for k in range(i, j + 1):
            raenge[order[k]] = mittel
        i = j + 1
    return raenge


def spearman(paare):
    if len(paare) < 2:
        return None
    rx = _raenge([p[0] for p in paare])
    ry = _raenge([p[1] for p in paare])
    return pearson(list(zip(rx, ry)))


def regressions_steigung(paare):
    """Steigung b aus y = a + b*x (kleinste Quadrate)."""
    n = len(paare)
    if n < 2:
        return None
    xs = [p[0] for p in paare]
    ys = [p[1] for p in paare]
    mx = sum(xs) / n
    my = sum(ys) / n
    sxx = sum((x - mx) ** 2 for x in xs)
    if sxx == 0:
        return None
    sxy = sum((x - mx) * (y - my) for x, y in paare)
    return sxy / sxx


def staerke(r):
    a = abs(r)
    if a < 0.1:
        return "vernachlaessigbar"
    if a < 0.3:
        return "schwach"
    if a < 0.5:
        return "moderat"
    if a < 0.7:
        return "deutlich"
    return "stark"


# --------------------------------------------------------------------------- #
# Ausgabe
# --------------------------------------------------------------------------- #

def _korr_zeile(label, paare):
    r = pearson(paare)
    rho = spearman(paare)
    if r is None:
        return f"  {label:<40} zu wenig Daten (n={len(paare)})"
    return (
        f"  {label:<40} r = {r:+.2f} ({staerke(r)})"
        f"   |   Spearman = {rho:+.2f}   [n={len(paare)}]"
    )


def berichte(zeilen, meta):
    n = len(zeilen)
    print("=" * 72)
    print("  WHOOP-AUSWERTUNG  ·  Schlaf <-> Recovery <-> Strain")
    print("=" * 72)
    print(f"  Zeilen gelesen: {n}")
    print(f"  Schlafspalte:   {meta['sleep_col']}  (Einheit: {meta['einheit']})")
    print(f"  Recovery:       {meta['recovery_col']}")
    print(f"  Strain:         {meta['strain_col']}")
    print(f"  Datumsspalte:   {meta['date_col'] or '(keine gefunden)'}")
    if not meta["sortiert"]:
        print("  Hinweis: kein/unvollstaendiges Datum -> Lag-Analyse in "
              "Dateireihenfolge.")
    print()

    # ------------------------------------------------------------------ Ueberblick
    schlaf = [z["schlaf_h"] for z in zeilen if z["schlaf_h"] is not None]
    rec = [z["recovery"] for z in zeilen if z["recovery"] is not None]
    strain = [z["strain"] for z in zeilen if z["strain"] is not None]
    print("-" * 72)
    print("  UEBERBLICK")
    print("-" * 72)
    if schlaf:
        unter = sum(1 for s in schlaf if s < SCHLAF_ZIEL_H)
        print(f"  Schlaf:   Ø {sum(schlaf)/len(schlaf):.1f} h  "
              f"(min {min(schlaf):.1f} / max {max(schlaf):.1f})  ·  "
              f"{unter}/{len(schlaf)} Naechte unter {SCHLAF_ZIEL_H:.0f} h")
    if rec:
        print(f"  Recovery: Ø {sum(rec)/len(rec):.0f} %  "
              f"(min {min(rec):.0f} / max {max(rec):.0f})")
    if strain:
        print(f"  Strain:   Ø {sum(strain)/len(strain):.1f}  "
              f"(min {min(strain):.1f} / max {max(strain):.1f})")
    print()

    # ------------------------------------------------------------------ Korrelationen
    print("-" * 72)
    print("  ZUSAMMENHAENGE  (r/Spearman: +1 = starker Gleichlauf, "
          "-1 = Gegenlauf)")
    print("-" * 72)
    sr = _paare(zeilen, "schlaf_h", "recovery")
    print(_korr_zeile("Schlafdauer  ->  Recovery", sr))
    print(_korr_zeile("Schlafdauer  ->  Strain (gleicher Tag)",
                      _paare(zeilen, "schlaf_h", "strain")))

    # Lag: Strain am Vortag -> Recovery am Folgetag
    lag = []
    for i in range(len(zeilen) - 1):
        s = zeilen[i]["strain"]
        r = zeilen[i + 1]["recovery"]
        if s is not None and r is not None:
            lag.append((s, r))
    print(_korr_zeile("Strain (Vortag)  ->  Recovery (Folgetag)", lag))
    print()

    # ------------------------------------------------------------------ Kernaussage
    print("-" * 72)
    print("  KERNAUSSAGE")
    print("-" * 72)
    b = regressions_steigung(sr)
    if b is not None:
        print(f"  Pro STUNDE WENIGER Schlaf sinkt die Recovery im Schnitt um")
        print(f"  ~{abs(b):.1f} Prozentpunkte.")
        beispiel = abs(b) * 2
        print(f"  -> Von {SCHLAF_ZIEL_H:.0f} h auf {SCHLAF_ZIEL_H-2:.0f} h "
              f"(2 h weniger) ≈ {beispiel:.0f} Recovery-Punkte weniger.")
        r = pearson(sr)
        if r is not None:
            print(f"  Zusammenhang Schlaf->Recovery: {staerke(r)} "
                  f"(r = {r:+.2f}).")
            if abs(r) >= 0.5:
                print("  => Bestaetigt den Plan: Schlaf ist der Hebel. Dranbleiben.")
            elif abs(r) < 0.3:
                print("  => Schwacher Zusammenhang. Wenn der Appetit weiter fehlt,")
                print("     andere Ursachen mit Team-Arzt abklaeren.")
    else:
        print("  Zu wenig gemeinsame Datenpunkte fuer eine Aussage.")
        print("  Empfehlung: mindestens ~10-14 Tage sammeln.")
    print()
    print("  Hinweis: Korrelation != Kausalitaet, kleine Stichprobe. Die Zahlen")
    print("  sind ein Kompass, kein Urteil.")
    print("=" * 72)


# --------------------------------------------------------------------------- #

def main(argv=None):
    p = argparse.ArgumentParser(
        description="Whoop-Auswertung: Schlaf <-> Recovery <-> Strain.",
    )
    p.add_argument("csv", help="Pfad zur CSV (z. B. physiological_cycles.csv)")
    p.add_argument("--sleep-col", help="Name der Schlafdauer-Spalte")
    p.add_argument("--recovery-col", help="Name der Recovery-Spalte")
    p.add_argument("--strain-col", help="Name der Strain-Spalte")
    p.add_argument("--date-col", help="Name der Datums-/Startzeit-Spalte")
    p.add_argument("--sleep-unit", choices=["min", "h"],
                   help="Einheit der Schlafspalte (Standard: automatisch)")
    args = p.parse_args(argv)

    try:
        zeilen, meta = lade_daten(args.csv, args)
    except FileNotFoundError:
        sys.exit(f"Fehler: Datei nicht gefunden: {args.csv}")

    if not zeilen:
        sys.exit("Fehler: Keine Datenzeilen gefunden.")

    berichte(zeilen, meta)


if __name__ == "__main__":
    main()
