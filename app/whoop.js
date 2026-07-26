/* =====================================================================
 *  Whoop-Import: liest den CSV-Export (physiological_cycles.csv) direkt
 *  im Browser ein – dieselbe Logik wie scripts/whoop_analyse.py.
 * ===================================================================== */
window.Whoop = (function () {

  // Minimaler CSV-Parser (behandelt Anführungszeichen).
  function parseCSV(text) {
    const rows = []; let field = "", row = [], inQ = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (inQ) {
        if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else inQ = false; }
        else field += c;
      } else {
        if (c === '"') inQ = true;
        else if (c === ",") { row.push(field); field = ""; }
        else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
        else if (c === "\r") { /* skip */ }
        else field += c;
      }
    }
    if (field.length || row.length) { row.push(field); rows.push(row); }
    return rows;
  }

  function findCol(header, ...groups) {
    const low = header.map(h => (h || "").toLowerCase());
    for (const g of groups) {
      for (let j = 0; j < low.length; j++) if (g.every(k => low[j].includes(k))) return j;
    }
    return -1;
  }

  function toNum(s) { const v = parseFloat(String(s == null ? "" : s).replace(",", ".")); return isFinite(v) ? v : null; }
  function toDate(s) { const m = String(s || "").match(/(\d{4})-(\d{2})-(\d{2})/); return m ? `${m[1]}-${m[2]}-${m[3]}` : null; }

  // Gibt {rows:[{date,sleep_h,recovery,strain}], meta} zurück – oder wirft Fehler.
  function parse(text) {
    const grid = parseCSV(text).filter(r => r.length > 1);
    if (!grid.length) throw new Error("Leere Datei.");
    const header = grid[0];
    const iSleep = findCol(header, ["asleep", "min"], ["sleep", "duration"]);
    const iRec = findCol(header, ["recovery", "%"], ["recovery"]);
    const iStrain = findCol(header, ["day", "strain"], ["strain"]);
    const iDate = findCol(header, ["cycle", "start"], ["start", "time"], ["date"]);
    if (iSleep < 0 && iRec < 0) throw new Error("Keine Whoop-Spalten erkannt. Ist das die physiological_cycles.csv?");

    const rows = [];
    for (let r = 1; r < grid.length; r++) {
      const line = grid[r];
      const sleepMin = iSleep >= 0 ? toNum(line[iSleep]) : null;
      const rec = iRec >= 0 ? toNum(line[iRec]) : null;
      const strain = iStrain >= 0 ? toNum(line[iStrain]) : null;
      const date = iDate >= 0 ? toDate(line[iDate]) : null;
      if (sleepMin == null && rec == null && strain == null) continue;
      rows.push({ date, sleep_h: sleepMin != null ? +(sleepMin / 60).toFixed(2) : null, recovery: rec, strain });
    }
    rows.sort((a, b) => (a.date || "").localeCompare(b.date || ""));
    return { rows, meta: { count: rows.length } };
  }

  // --- Statistik ---
  const mean = a => a.length ? a.reduce((s, x) => s + x, 0) / a.length : null;
  function pearson(pairs) {
    const n = pairs.length; if (n < 2) return null;
    const mx = mean(pairs.map(p => p[0])), my = mean(pairs.map(p => p[1]));
    let sxy = 0, sxx = 0, syy = 0;
    for (const [x, y] of pairs) { sxy += (x - mx) * (y - my); sxx += (x - mx) ** 2; syy += (y - my) ** 2; }
    return (sxx && syy) ? sxy / Math.sqrt(sxx * syy) : null;
  }
  function slope(pairs) {
    const n = pairs.length; if (n < 2) return null;
    const mx = mean(pairs.map(p => p[0])), my = mean(pairs.map(p => p[1]));
    let sxy = 0, sxx = 0;
    for (const [x, y] of pairs) { sxy += (x - mx) * (y - my); sxx += (x - mx) ** 2; }
    return sxx ? sxy / sxx : null;
  }
  function strength(r) {
    const a = Math.abs(r);
    return a < 0.1 ? "vernachlässigbar" : a < 0.3 ? "schwach" : a < 0.5 ? "moderat" : a < 0.7 ? "deutlich" : "stark";
  }

  // Kennzahlen über die (optional letzten n) Tage.
  function stats(rows, lastN) {
    const data = lastN ? rows.slice(-lastN) : rows;
    const sleep = data.map(r => r.sleep_h).filter(v => v != null);
    const rec = data.map(r => r.recovery).filter(v => v != null);
    const strain = data.map(r => r.strain).filter(v => v != null);
    const pairs = data.filter(r => r.sleep_h != null && r.recovery != null).map(r => [r.sleep_h, r.recovery]);
    return {
      n: data.length,
      avgSleep: mean(sleep), avgRec: mean(rec), avgStrain: mean(strain),
      r: pearson(pairs), slope: slope(pairs), strength: (r) => strength(r),
    };
  }

  return { parse, stats, pearson, slope, strength, tier: v => v >= 67 ? "good" : v >= 34 ? "mid" : "low" };
})();
