/* =====================================================================
 *  Ernährungs-App · UI-Logik (Phase 1, lokal)
 * ===================================================================== */
(function () {
  const D = window.NUTRI_DATA;
  const S = window.Store;

  // ---------- kleine Helfer ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const r0 = (n) => Math.round(n);
  const WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

  function todayISO() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }
  function fmtDate(iso) {
    const [y, m, d] = iso.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    const wd = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"][dt.getDay()];
    if (iso === todayISO()) return "Heute · " + wd;
    return `${wd}, ${String(d).padStart(2, "0")}.${String(m).padStart(2, "0")}.`;
  }
  function shiftDate(iso, days) {
    const [y, m, d] = iso.split("-").map(Number);
    const dt = new Date(y, m - 1, d + days);
    return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
  }

  // Zutat-/Vorrat-Namensabgleich über Wort-Überschneidung
  const STOP = new Set(["der", "die", "das", "dose", "gekocht", "vollfett", "portion", "scheibe", "tk"]);
  function words(name) {
    return String(name).toLowerCase().replace(/\(.*?\)/g, " ").split(/[^a-zäöüß]+/)
      .filter(w => w.length > 2 && !STOP.has(w));
  }
  function overlaps(a, b) {
    const wb = new Set(words(b));
    return words(a).some(w => wb.has(w));
  }
  const STAPLES = ["olivenöl", "honig", "salz", "öl", "butter"];
  function isStaple(name) { const w = words(name).join(" "); return STAPLES.some(s => w.includes(s)); }
  function missingIngredients(recipe) {
    const pantry = S.getPantry();
    return (recipe.ingredients || []).filter(ing =>
      !isStaple(ing.name) && !pantry.some(p => overlaps(p.name, ing.name))
    ).map(i => i.name);
  }

  // ---------- App-State ----------
  const state = {
    tab: "heute",
    date: todayISO(),
    rf: { fav: false, cook: false, kein: false, tag: null, q: "" },
  };

  // ---------- Root ----------
  // ---- Theme (Standard: dunkel = Whoop-Look), pro Gerät gespeichert ----
  const THEME_KEY = "ernaehrung_theme";
  function applyTheme(t) { document.documentElement.dataset.theme = t; try { localStorage.setItem(THEME_KEY, t); } catch (e) {} }
  let theme = "dark";
  try { theme = localStorage.getItem(THEME_KEY) || "dark"; } catch (e) {}
  applyTheme(theme);

  const app = document.createElement("div");
  app.className = "app";
  app.innerHTML = `
    <header class="top">
      <div>
        <h1 id="title">Heute</h1>
        <div class="sub" id="subtitle">Ernährung · Meier G. <span id="syncbadge"></span></div>
      </div>
      <div class="row" style="gap:8px">
        <button class="icon-btn" data-action="theme" id="themebtn" title="Hell / Dunkel">${theme === "dark" ? "🌙" : "☀️"}</button>
        <button class="icon-btn" data-action="profile" title="Profil & Einstellungen">⚙︎</button>
      </div>
    </header>
    <main id="view"></main>
    <nav class="tabs" id="tabs"></nav>
    <div id="modal-root"></div>`;
  document.body.appendChild(app);

  const view = $("#view", app);
  const TABS = [
    { id: "heute", label: "Heute", ic: "◎" },
    { id: "vorrat", label: "Vorrat", ic: "▤" },
    { id: "rezepte", label: "Rezepte", ic: "✦" },
    { id: "plan", label: "Plan", ic: "▦" },
    { id: "einkauf", label: "Einkauf", ic: "▣" },
    { id: "recovery", label: "Recovery", ic: "❤" },
  ];
  const ICONS = {
    heute: `<svg viewBox="0 0 24 24"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5"/></svg>`,
    vorrat: `<svg viewBox="0 0 24 24"><path d="M21 8 12 3 3 8v8l9 5 9-5V8z"/><path d="M3 8l9 5 9-5"/><path d="M12 13v8"/></svg>`,
    rezepte: `<svg viewBox="0 0 24 24"><path d="M7 3v8a2 2 0 0 1-4 0V3"/><path d="M5 11v10"/><path d="M18 3c-1.8 0-3 2-3 4.5S16.2 12 18 12"/><path d="M18 3v18"/></svg>`,
    plan: `<svg viewBox="0 0 24 24"><rect x="3" y="4.5" width="18" height="16" rx="2.5"/><path d="M3 9.5h18"/><path d="M8 2.5v4"/><path d="M16 2.5v4"/></svg>`,
    einkauf: `<svg viewBox="0 0 24 24"><path d="M6.5 8h11l-1 12.5h-9z"/><path d="M9 8a3 3 0 0 1 6 0"/></svg>`,
    recovery: `<svg viewBox="0 0 24 24"><path d="M3 12h4l2.5-6 4 12L16 12h5"/></svg>`,
  };
  function renderTabs() {
    $("#tabs", app).innerHTML = TABS.map(t =>
      `<button data-tab="${t.id}" class="${state.tab === t.id ? "on" : ""}" aria-label="${t.label}">
         <span class="ic">${ICONS[t.id] || ""}</span>${t.label}</button>`).join("");
  }

  // ====================================================================
  //  TAB: HEUTE
  // ====================================================================
  function renderHeute() {
    const date = state.date;
    const day = S.getDay(date);
    const target = S.targetFor(day.dayType);
    const tot = S.dayTotals(date);

    const macroBar = (name, val, tgt, cls) => {
      const pct = tgt ? Math.min(100, (val / tgt) * 100) : 0;
      const over = val > tgt * 1.03;
      return `<div class="mrow">
        <div class="mtop"><span class="mname">${name}</span><span class="mval">${r0(val)} / ${r0(tgt)} g</span></div>
        <div class="bar ${cls} ${over ? "over" : ""}"><i style="width:${pct}%"></i></div></div>`;
    };
    const kcalPct = target.kcal ? Math.min(1, tot.kcal / target.kcal) : 0;
    const RC = 2 * Math.PI * 54;
    const ringHtml = `<svg class="calring" viewBox="0 0 128 128" aria-hidden="true">
        <defs><linearGradient id="cg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="var(--accent)"/><stop offset="1" stop-color="var(--accent-2)"/></linearGradient></defs>
        <circle class="track" cx="64" cy="64" r="54"/>
        <circle class="prog" cx="64" cy="64" r="54" stroke="url(#cg)"
          stroke-dasharray="${RC.toFixed(1)}" stroke-dashoffset="${(RC * (1 - kcalPct)).toFixed(1)}"
          transform="rotate(-90 64 64)"/>
        <text class="rnum" x="64" y="60">${r0(tot.kcal)}</text>
        <text class="rlab" x="64" y="80">/ ${r0(target.kcal)} kcal</text>
      </svg>`;

    const slotsHtml = D.slots.map(slot => {
      const items = day.items.filter(i => i.slot === slot);
      const inner = items.length
        ? items.map(i => `<div class="item">
            <span class="n">${esc(i.name)}</span>
            <span class="row"><span class="k">${r0(i.kcal)} kcal · ${r0(i.protein)}g P</span>
            <button class="x" data-action="del-item" data-id="${i.id}" title="Entfernen">✕</button></span>
          </div>`).join("")
        : `<div class="item" style="opacity:.6"><span class="n muted small">– noch nichts –</span>
             <button class="btn sm ghost" data-action="add-food" data-slot="${esc(slot)}">+</button></div>`;
      const slotKcal = items.reduce((s, i) => s + (+i.kcal || 0), 0);
      return `<div class="slot">
        <div class="slot-h"><span class="name">${esc(slot)}${slotKcal ? " · " + r0(slotKcal) + " kcal" : ""}</span>
          <button class="btn sm ghost" data-action="add-food" data-slot="${esc(slot)}">+ Essen</button></div>
        ${inner}</div>`;
    }).join("");

    const restKcal = target.kcal - tot.kcal;

    // Whoop-Recovery für diesen Tag (falls importiert)
    const wr = S.whoopFor(date);
    let recCard = "";
    if (wr && wr.recovery != null) {
      const t = wr.recovery >= 67 ? ["good", "🟢", "Gut – heute kannst du Vollgas geben."]
        : wr.recovery >= 34 ? ["warn", "🟡", "Mittel – solide essen, Schlaf heute priorisieren."]
        : ["bad", "🔴", "Tief – gut essen zur Erholung, eher ruhiger, früh ins Bett."];
      recCard = `<div class="card" style="padding:12px 14px">
        <div class="spread">
          <span class="small"><b style="color:var(--${t[0]})">${t[1]} Recovery ${r0(wr.recovery)}%</b>
            ${wr.sleep_h != null ? ` · Schlaf ${wr.sleep_h.toFixed(1)} h` : ""} <span class="faint">· Whoop</span></span>
        </div>
        <div class="hint" style="margin-top:6px">${t[2]}</div>
      </div>`;
    }

    // Wiege-Erinnerung (1×/Woche) – nur am heutigen Tag, wenn ~7 Tage kein Eintrag
    let weighCard = "";
    if (date === todayISO()) {
      const ws = S.getWeight();
      const lastW = ws.length ? ws[ws.length - 1] : null;
      const days = lastW ? Math.floor((Date.now() - new Date(lastW.date + "T00:00:00")) / 86400000) : 999;
      if (days >= 7) {
        weighCard = `<div class="card" style="padding:12px 14px; border-color:color-mix(in srgb,var(--accent) 32%,transparent)">
          <div class="spread"><span class="small">⚖️ <b>Zeit zum Wiegen</b> – morgens, nüchtern${lastW ? ` · zuletzt vor ${days} T` : ""}</span>
          <button class="btn sm" data-action="profile">Eintragen</button></div></div>`;
      }
    }

    // Schlaf-Ziel für den Wochentag
    const wd = new Date(date + "T00:00:00").getDay();
    const sp = (D.sleepPlan || {})[wd];
    const sleepCard = sp ? `<div class="card" style="padding:14px 16px">
        <div class="card-note">Schlaf-Ziel${date === todayISO() ? " heute" : ""}</div>
        <div style="font-weight:750; font-size:17px; margin-top:3px">🌙 ${sp.bett} → ${sp.auf}
          <span class="muted" style="font-weight:600; font-size:13px">· ${sp.h} h</span></div>
        <div class="hint" style="margin-top:8px">${sp.note}</div>
      </div>` : "";

    view.innerHTML = weighCard + recCard + `
      <div class="card">
        <div class="spread" style="margin-bottom:14px">
          <button class="btn sm ghost" data-action="date" data-d="-1">‹</button>
          <div style="text-align:center">
            <div style="font-weight:700">${fmtDate(date)}</div>
            ${date !== todayISO() ? `<button class="btn sm ghost" style="margin-top:4px" data-action="date" data-d="today">→ heute</button>` : ""}
          </div>
          <button class="btn sm ghost" data-action="date" data-d="1">›</button>
        </div>
        <div class="spread" style="margin-bottom:14px">
          <div class="seg">
            <button data-action="daytype" data-t="train" class="${day.dayType === "train" ? "on" : ""}">🏒 Trainingstag</button>
            <button data-action="daytype" data-t="rest" class="${day.dayType === "rest" ? "on" : ""}">😴 Ruhetag</button>
          </div>
        </div>
        <div class="cal">
          ${ringHtml}
          <div class="macros-col">
            ${macroBar("Protein", tot.protein, target.protein, "p")}
            ${macroBar("Kohlenhydrate", tot.carbs, target.carbs, "c")}
            ${macroBar("Fett", tot.fat, target.fat, "f")}
          </div>
        </div>
        <div class="hint" style="text-align:center">${restKcal > 0
          ? `Noch <b>${r0(restKcal)} kcal</b> bis zum Ziel.`
          : `Ziel erreicht (+${r0(-restKcal)} kcal). 💪`}</div>
      </div>

      ${sleepCard}

      <div class="card">
        <div class="spread"><h2 style="margin:0">Mahlzeiten</h2>
          <button class="chip ${state.rf.kein ? "on" : ""}" data-action="kein-appetit">🥤 Kein Appetit?</button></div>
        <div style="margin-top:12px">${slotsHtml}</div>
      </div>`;
  }

  // ====================================================================
  //  TAB: VORRAT
  // ====================================================================
  function renderVorrat() {
    const pantry = S.getPantry();
    const quick = D.pantryQuickPick.map(name => {
      const on = S.hasPantry(name);
      return `<button class="chip ${on ? "on" : ""}" data-action="quick-pantry" data-name="${esc(name)}">${on ? "✓ " : "+ "}${esc(name)}</button>`;
    }).join("");

    const list = pantry.length
      ? pantry.map(p => `<div class="item">
          <span class="n">${esc(p.name)}${p.quantity ? ` <span class="muted small">· ${esc(p.quantity)} ${esc(p.unit || "")}</span>` : ""}</span>
          <button class="x" data-action="del-pantry" data-id="${p.id}">✕</button></div>`).join("")
      : `<div class="empty">Noch nichts im Vorrat. Häkle oben an, was du zuhause hast.</div>`;

    view.innerHTML = `
      <div class="card">
        <h2>Was hast du zuhause?</h2>
        <div class="chips" style="max-height:none">${quick}</div>
        <div class="row" style="margin-top:14px; gap:8px">
          <input type="text" id="pantry-free" placeholder="Etwas anderes eintippen…">
          <button class="btn" data-action="add-pantry-free">Add</button>
        </div>
      </div>
      <div class="card">
        <div class="spread"><h2 style="margin:0">Dein Vorrat (${pantry.length})</h2></div>
        <div style="margin-top:10px">${list}</div>
      </div>`;
  }

  // ====================================================================
  //  TAB: REZEPTE
  // ====================================================================
  function renderRezepte() {
    const rf = state.rf;
    let recipes = S.getRecipes().slice();

    // Filter
    if (rf.fav) recipes = recipes.filter(r => r.is_favorite);
    if (rf.kein) recipes = recipes.filter(r => (r.tags || []).includes("kein-appetit"));
    if (rf.tag) recipes = recipes.filter(r => (r.tags || []).includes(rf.tag));
    if (rf.q) {
      const q = rf.q.toLowerCase();
      recipes = recipes.filter(r => r.name.toLowerCase().includes(q) ||
        (r.tags || []).some(t => t.includes(q)) ||
        (r.ingredients || []).some(i => i.name.toLowerCase().includes(q)));
    }
    // Kochbarkeit berechnen
    recipes = recipes.map(r => ({ r, miss: missingIngredients(r) }));
    if (rf.cook) recipes = recipes.filter(x => x.miss.length <= 1);
    // Sortierung: kochbar zuerst, dann Favoriten
    recipes.sort((a, b) => (a.miss.length - b.miss.length) || (b.r.is_favorite - a.r.is_favorite));

    const allTags = ["frühstück", "to-go", "pancakes", "pasta", "italienisch", "reis", "bowl", "asia", "curry",
      "mexikanisch", "fleisch", "fisch", "kartoffel", "auflauf", "grill", "wrap", "sandwich", "pizza", "eintopf",
      "shake", "snack", "dessert", "post-workout", "budget", "lachs", "high-protein", "meal-prep", "schnell", "günstig"];
    const tagChips = allTags.map(t =>
      `<button class="chip ${rf.tag === t ? "on" : ""}" data-action="filter-tag" data-tag="${t}">${t}</button>`).join("");

    const cards = recipes.length ? recipes.map(({ r, miss }) => {
      const cook = miss.length === 0;
      const tags = (r.tags || []).map(t => {
        const cls = t === "kein-appetit" ? "kein" : t === "grill" ? "grill" : "";
        return `<span class="tag ${cls}">${esc(t)}</span>`;
      }).join("");
      return `<div class="recipe">
        <div class="rh">
          <div>
            <div class="title">${esc(r.name)}</div>
            <div class="macros">${r0(r.kcal)} kcal · ${r0(r.protein)}g P · ${r0(r.carbs)}g K · ${r0(r.fat)}g F · ⏱ ${r.prep_min || "?"}′</div>
          </div>
          <button class="fav ${r.is_favorite ? "on" : ""}" data-action="fav" data-id="${r.id}" title="Favorit">${r.is_favorite ? "★" : "☆"}</button>
        </div>
        <div class="tags">
          ${cook ? `<span class="tag can">✓ kochbar</span>` : (miss.length ? `<span class="tag">fehlt: ${esc(miss.slice(0, 2).join(", "))}${miss.length > 2 ? "…" : ""}</span>` : "")}
          ${tags}
        </div>
        <div class="acts">
          <button class="btn sm" data-action="log-recipe" data-id="${r.id}">+ Zu Heute</button>
          <button class="btn sm ghost" data-action="recipe-detail" data-id="${r.id}">Details</button>
        </div>
      </div>`;
    }).join("") : `<div class="empty">Keine Rezepte für diesen Filter.</div>`;

    view.innerHTML = `
      <div class="card">
        <input type="text" id="recipe-q" placeholder="🔎 Worauf hast du Lust? (z.B. Pasta, Lachs…)" value="${esc(rf.q)}">
        <div class="chips" style="margin-top:12px">
          <button class="chip ${rf.cook ? "on" : ""}" data-action="filter-cook">🍳 Mit Vorrat kochbar</button>
          <button class="chip ${rf.fav ? "on" : ""}" data-action="filter-fav">★ Favoriten</button>
          <button class="chip ${rf.kein ? "on" : ""}" data-action="filter-kein">🥤 Kein Appetit</button>
        </div>
        <div class="chips scroll" style="margin-top:8px">${tagChips}
          ${(rf.tag || rf.q || rf.cook || rf.fav || rf.kein) ? `<button class="chip" data-action="filter-clear">✕ Reset</button>` : ""}
        </div>
      </div>
      <div class="rlist">${cards}</div>`;

    const q = $("#recipe-q", view);
    if (q) q.addEventListener("input", (e) => { state.rf.q = e.target.value; /* live filtern ohne Fokusverlust */ debounceRerender(); });
  }
  let _t;
  function debounceRerender() { clearTimeout(_t); _t = setTimeout(() => { if (state.tab === "rezepte") { renderRezepte(); const q = $("#recipe-q", view); if (q) { q.focus(); q.setSelectionRange(q.value.length, q.value.length); } } }, 200); }

  // ====================================================================
  //  TAB: PLAN
  // ====================================================================
  function renderPlan() {
    const plan = S.getPlan();
    const head = `<tr><th>Slot</th>${WEEKDAYS.map(d => `<th>${d}</th>`).join("")}</tr>`;
    const rows = D.slots.map(slot => {
      const cells = WEEKDAYS.map(day => {
        const rid = (plan[day] || {})[slot];
        const rec = rid ? S.getRecipe(rid) : null;
        return `<td><div class="cell ${rec ? "set" : ""}" data-action="plan-cell" data-day="${day}" data-slot="${esc(slot)}">${rec ? esc(rec.name) : "+"}</div></td>`;
      }).join("");
      return `<tr><th>${esc(slot)}</th>${cells}</tr>`;
    }).join("");

    view.innerHTML = `
      <div class="card">
        <h2>Wochen-Menüplan</h2>
        <div class="hint">Tippe eine Zelle, um ein Rezept zu setzen. Danach die Einkaufsliste generieren.</div>
        <div class="plan-scroll" style="margin-top:12px"><table class="plan">${head}${rows}</table></div>
        <button class="btn block" style="margin-top:14px" data-action="load-week">🗓 Preseason-Wochenplan laden (Rezept pro Mahlzeit)</button>
        <button class="btn ghost block" style="margin-top:10px" data-action="gen-shopping">🛒 Einkaufsliste aus Plan generieren</button>
      </div>`;
  }

  function renderRecovery() {
    const data = S.getWhoop();
    if (!data.length) {
      view.innerHTML = `
        <div class="card">
          <h2>Whoop-Daten importieren</h2>
          <p class="small muted" style="margin-top:0">Exportiere in der Whoop-App: <b>Settings → Account → Data Export</b>.
            Im ZIP ist die Datei <code>physiological_cycles.csv</code> – die hier laden. Läuft komplett auf deinem Gerät.</p>
          <button class="btn block" data-action="whoop-import" style="margin-top:12px">📂 CSV wählen</button>
          <div class="hint">Nur Screenshots? Schick sie im Claude-Chat, dann werte ich sie aus.</div>
        </div>`;
      return;
    }
    const last = data[data.length - 1];
    const s14 = Whoop.stats(data, 14);
    const sAll = Whoop.stats(data);
    const spark = sparkline(data.slice(-14).map(r => r.recovery).filter(v => v != null));
    view.innerHTML = `
      <div class="card">
        <div class="spread"><h2 style="margin:0">Recovery &amp; Schlaf</h2><span class="card-note">${data.length} Tage · Whoop</span></div>
        <div class="rings" style="margin-top:12px">
          ${miniMetric("Letzte Recovery", last.recovery != null ? r0(last.recovery) + " %" : "–", Whoop.tier(last.recovery))}
          ${miniMetric("Letzter Schlaf", last.sleep_h != null ? last.sleep_h.toFixed(1) + " h" : "–")}
          ${miniMetric("Ø Recovery 14T", s14.avgRec != null ? r0(s14.avgRec) + " %" : "–")}
          ${miniMetric("Ø Schlaf 14T", s14.avgSleep != null ? s14.avgSleep.toFixed(1) + " h" : "–")}
        </div>
        <div class="card-note" style="margin-top:14px">Recovery – letzte 14 Tage</div>
        ${spark}
      </div>
      <div class="card">
        <h2>Schlaf → Recovery</h2>
        ${sAll.r != null
          ? `<p class="small" style="margin-top:0">Zusammenhang: <b>${sAll.strength(sAll.r)}</b> (r = ${sAll.r >= 0 ? "+" : ""}${sAll.r.toFixed(2)}).
             Pro Stunde weniger Schlaf ~<b>${Math.abs(r0(sAll.slope))} Recovery-Punkte</b> weniger.</p>`
          : `<p class="small muted" style="margin-top:0">Noch zu wenig Daten für eine klare Aussage (ideal: ≥ 10–14 Tage).</p>`}
        <button class="btn ghost sm" data-action="whoop-import" style="margin-top:8px">Neuen Export laden</button>
      </div>`;
  }

  function miniMetric(lab, val, tier) {
    const col = tier === "good" ? "var(--good)" : tier === "mid" ? "var(--warn)" : tier === "low" ? "var(--bad)" : "var(--ink)";
    return `<div class="metric"><div class="lab">${esc(lab)}</div><div class="val" style="color:${col}; font-size:20px">${val}</div></div>`;
  }
  function sparkline(vals) {
    if (vals.length < 2) return `<div class="hint">Zu wenig Punkte für die Kurve.</div>`;
    const w = 320, h = 60, pad = 6;
    const min = Math.min(...vals), max = Math.max(...vals), rng = (max - min) || 1;
    const X = i => pad + i / (vals.length - 1) * (w - 2 * pad);
    const Y = v => h - pad - ((v - min) / rng) * (h - 2 * pad);
    const pts = vals.map((v, i) => `${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(" ");
    const area = `M${X(0).toFixed(1)},${(h - pad).toFixed(1)} L${pts.split(" ").join(" L")} L${X(vals.length - 1).toFixed(1)},${(h - pad).toFixed(1)} Z`;
    return `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true">
      <defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="var(--accent)" stop-opacity=".38"/><stop offset="1" stop-color="var(--accent)" stop-opacity="0"/></linearGradient></defs>
      <path d="${area}" fill="url(#sg)"/>
      <polyline points="${pts}" fill="none" stroke="var(--accent)" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linejoin="round" stroke-linecap="round"/></svg>`;
  }
  function loadWeekPlan() {
    const wp = D.weekPlan || {};
    Object.keys(wp).forEach(day => Object.keys(wp[day]).forEach(slot => {
      const rec = S.getRecipes().find(r => r.name === wp[day][slot]);
      S.setPlan(day, slot, rec ? rec.id : null);
    }));
  }
  function doWhoopImport() {
    const inp = document.createElement("input"); inp.type = "file"; inp.accept = ".csv,text/csv";
    inp.onchange = () => {
      const f = inp.files[0]; if (!f) return;
      const fr = new FileReader();
      fr.onload = () => {
        try {
          const { rows } = Whoop.parse(fr.result);
          if (!rows.length) { alert("Keine Datenzeilen gefunden."); return; }
          S.setWhoop(rows);
          render();
          alert(rows.length + " Tage aus Whoop importiert.");
        } catch (e) { alert("Import fehlgeschlagen: " + e.message); }
      };
      fr.readAsText(f);
    };
    inp.click();
  }

  // ====================================================================
  //  TAB: EINKAUF
  // ====================================================================
  function renderEinkauf() {
    const list = S.getShopping();
    const items = list.length ? list.map(it => `
      <div class="shop-item ${it.checked ? "done" : ""}">
        <input type="checkbox" ${it.checked ? "checked" : ""} data-action="toggle-shop" data-id="${it.id}">
        <label>${esc(it.name)}</label>
        <span class="amt">${it.amount ? esc(it.amount) + " " + esc(it.unit || "") : ""}</span>
      </div>`).join("") : `<div class="empty">Liste ist leer. Generiere sie im Tab „Plan" oder füge unten etwas hinzu.</div>`;

    view.innerHTML = `
      <div class="card">
        <div class="spread"><h2 style="margin:0">Einkaufsliste</h2>
          ${list.some(i => i.checked) ? `<button class="btn sm ghost" data-action="clear-checked">Erledigte weg</button>` : ""}</div>
        <div style="margin-top:10px">${items}</div>
        <div class="row" style="margin-top:14px; gap:8px">
          <input type="text" id="shop-free" placeholder="Artikel hinzufügen…">
          <button class="btn" data-action="add-shop-free">Add</button>
        </div>
        <div class="hint">Tipp: „Aus Plan generieren" zieht die Zutaten deines Wochenplans ab, was schon im Vorrat ist.</div>
      </div>`;
  }

  // ====================================================================
  //  MODALS
  // ====================================================================
  function openModal(html) {
    $("#modal-root", app).innerHTML = `<div class="overlay" data-action="overlay">
      <div class="modal" role="dialog" aria-modal="true">${html}</div></div>`;
  }
  function closeModal() { $("#modal-root", app).innerHTML = ""; }

  function modalAddFood(slot) {
    const foods = S.getFoods().slice().sort((a, b) => a.name.localeCompare(b.name));
    const recipes = S.getRecipes().slice().sort((a, b) => a.name.localeCompare(b.name));
    openModal(`
      <div class="mh"><h3>Essen eintragen</h3><button class="icon-btn" data-action="close">✕</button></div>
      <div class="chips" style="margin-bottom:14px">
        <button class="chip on" data-action="mode-food" id="m-food">Lebensmittel</button>
        <button class="chip" data-action="mode-recipe" id="m-recipe">Rezept</button>
        <button class="chip" data-action="mode-est" id="m-est">🍽 Auswärts</button>
      </div>
      <label class="field"><span class="l">Slot</span>
        <select id="af-slot">${D.slots.map(s => `<option ${s === slot ? "selected" : ""}>${esc(s)}</option>`).join("")}</select></label>

      <div id="pane-food">
        <label class="field"><span class="l">Lebensmittel</span>
          <select id="af-food">${foods.map(f => `<option value="${f.id}">${esc(f.name)} (${f.kcal} kcal/${esc(f.basis)})</option>`).join("")}</select></label>
        <label class="field"><span class="l">Menge (<span id="af-unit">g</span>)</span>
          <input type="number" id="af-amount" value="100" min="0" step="10"></label>
        <div class="hint" id="af-preview"></div>
      </div>

      <div id="pane-recipe" style="display:none">
        <label class="field"><span class="l">Rezept</span>
          <select id="af-recipe">${recipes.map(r => `<option value="${r.id}">${esc(r.name)} (${r0(r.kcal)} kcal)</option>`).join("")}</select></label>
      </div>

      <div id="pane-est" style="display:none">
        <label class="field"><span class="l">Was hast du gegessen?</span>
          <input type="text" id="est-name" placeholder="z.B. Clubrestaurant: Poulet, Reis, Salat"></label>
        <label class="field"><span class="l">Kalorien (Schätzung)</span>
          <input type="number" id="est-kcal" value="900" min="0" step="50"></label>
        <div class="grid2">
          <label class="field"><span class="l">Protein g <span class="faint">(optional)</span></span><input type="number" id="est-p" placeholder="–"></label>
          <label class="field"><span class="l">Kohlenh. g <span class="faint">(optional)</span></span><input type="number" id="est-c" placeholder="–"></label>
          <label class="field"><span class="l">Fett g <span class="faint">(optional)</span></span><input type="number" id="est-f" placeholder="–"></label>
        </div>
        <div class="hint">Mittag im Clubrestaurant? Name + geschätzte kcal reichen. Oder oben ein „Auswärts"-Preset unter Lebensmittel wählen. Genauer geht's per Foto im Chat.</div>
      </div>

      <button class="btn block" data-action="save-food" style="margin-top:6px">Eintragen</button>`);

    const foodSel = $("#af-food", app), amt = $("#af-amount", app), unit = $("#af-unit", app), prev = $("#af-preview", app);
    function refresh() {
      const f = S.getFoods().find(x => x.id === foodSel.value);
      if (!f) return;
      unit.textContent = f.basis === "Stk" ? "Stk" : (f.basis === "100ml" ? "ml" : "g");
      const m = macroForFood(f, +amt.value || 0);
      prev.innerHTML = `≈ <b>${r0(m.kcal)} kcal</b> · ${r0(m.protein)}g P · ${r0(m.carbs)}g K · ${r0(m.fat)}g F`;
    }
    foodSel.addEventListener("change", refresh);
    amt.addEventListener("input", refresh);
    refresh();
  }

  function setAddMode(mode) {
    const panes = { food: "#pane-food", recipe: "#pane-recipe", est: "#pane-est" };
    const chips = { food: "#m-food", recipe: "#m-recipe", est: "#m-est" };
    Object.keys(panes).forEach(k => {
      const pane = $(panes[k], app), chip = $(chips[k], app);
      if (pane) pane.style.display = k === mode ? "" : "none";
      if (chip) chip.classList.toggle("on", k === mode);
    });
  }

  function macroForFood(f, amount) {
    const factor = f.basis === "Stk" ? amount : amount / 100;
    return { kcal: f.kcal * factor, protein: f.protein * factor, carbs: f.carbs * factor, fat: f.fat * factor };
  }

  function modalRecipeDetail(id) {
    const r = S.getRecipe(id); if (!r) return;
    const miss = missingIngredients(r);
    const ing = (r.ingredients || []).map(i => {
      const have = isStaple(i.name) || S.getPantry().some(p => overlaps(p.name, i.name));
      return `<div class="item"><span class="n">${esc(i.name)}</span>
        <span class="k">${esc(i.amount)} ${esc(i.unit)} ${have ? "✓" : "🛒"}</span></div>`;
    }).join("");
    openModal(`
      <div class="mh"><h3>${esc(r.name)}</h3><button class="icon-btn" data-action="close">✕</button></div>
      <div class="macros" style="font:600 13px var(--mono); color:var(--muted); margin-bottom:14px">
        ${r0(r.kcal)} kcal · ${r0(r.protein)}g P · ${r0(r.carbs)}g K · ${r0(r.fat)}g F · ⏱ ${r.prep_min || "?"} Min</div>
      <div class="l" style="font:600 12px var(--mono); text-transform:uppercase; color:var(--faint); margin-bottom:6px">Zutaten</div>
      ${ing}
      ${(r.instructions ? `<div class="l" style="font:600 12px var(--mono); text-transform:uppercase; color:var(--faint); margin:14px 0 6px">Zubereitung</div>
        <p class="small muted" style="margin:0">${esc(r.instructions)}</p>` : "")}
      <div class="acts" style="display:flex; gap:8px; margin-top:16px">
        <button class="btn block" data-action="log-recipe" data-id="${r.id}">+ Zu Heute (${esc(r.slot || D.slots[0])})</button>
        ${miss.length ? `<button class="btn ghost" data-action="add-missing" data-id="${r.id}">🛒 Fehlendes</button>` : ""}
      </div>`);
  }

  function modalProfile() {
    const s = S.getSettings();
    const w = S.getWeight().slice(-1)[0];
    openModal(`
      <div class="mh"><h3>Profil & Ziele</h3><button class="icon-btn" data-action="close">✕</button></div>

      <div id="sync-section"></div>

      <div class="grid2">
        <label class="field"><span class="l">Gewicht (kg)</span><input type="number" id="p-wc" value="${s.weight_current}" step="0.1"></label>
        <label class="field"><span class="l">Ziel (kg)</span><input type="number" id="p-wg" value="${s.weight_goal}" step="0.1"></label>
      </div>
      <label class="field"><span class="l">Grösse (cm)</span><input type="number" id="p-h" value="${s.height_cm}"></label>

      <div class="l" style="font:700 12px var(--mono); text-transform:uppercase; color:var(--faint); margin:6px 0 8px">🏒 Trainingstag</div>
      <div class="grid2">
        <label class="field"><span class="l">kcal</span><input type="number" id="p-kt" value="${s.kcal_train}"></label>
        <label class="field"><span class="l">Protein g</span><input type="number" id="p-pt" value="${s.protein_train}"></label>
        <label class="field"><span class="l">Kohlenh. g</span><input type="number" id="p-ct" value="${s.carbs_train}"></label>
        <label class="field"><span class="l">Fett g</span><input type="number" id="p-ft" value="${s.fat_train}"></label>
      </div>
      <div class="l" style="font:700 12px var(--mono); text-transform:uppercase; color:var(--faint); margin:6px 0 8px">😴 Ruhetag</div>
      <div class="grid2">
        <label class="field"><span class="l">kcal</span><input type="number" id="p-kr" value="${s.kcal_rest}"></label>
        <label class="field"><span class="l">Protein g</span><input type="number" id="p-pr" value="${s.protein_rest}"></label>
        <label class="field"><span class="l">Kohlenh. g</span><input type="number" id="p-cr" value="${s.carbs_rest}"></label>
        <label class="field"><span class="l">Fett g</span><input type="number" id="p-fr" value="${s.fat_rest}"></label>
      </div>
      <button class="btn block" data-action="save-profile">Speichern</button>

      <div class="l" style="font:700 12px var(--mono); text-transform:uppercase; color:var(--faint); margin:20px 0 8px">Wöchentliches Wiegen</div>
      ${w ? `<div class="hint" style="margin-top:0">Letzter Eintrag: ${esc(w.date)} · ${esc(w.weight_kg)} kg</div>` : ""}
      <div class="row" style="gap:8px; margin-top:8px">
        <input type="number" id="wl-kg" placeholder="kg (morgens, nüchtern)" step="0.1">
        <button class="btn" data-action="save-weight">Wiegen</button>
      </div>

      <div class="l" style="font:700 12px var(--mono); text-transform:uppercase; color:var(--faint); margin:20px 0 8px">Backup</div>
      <div class="row" style="gap:8px; flex-wrap:wrap">
        <button class="btn ghost sm" data-action="export">⬇︎ Export (Datei)</button>
        <button class="btn ghost sm" data-action="import">⬆︎ Import</button>
        <button class="btn ghost sm" data-action="reset" style="color:var(--bad)">Zurücksetzen</button>
      </div>`);
    renderSyncSection();
  }

  // ---------- Sync-UI ----------
  function renderSyncSection() {
    const box = $("#sync-section", app);
    if (!box) return;
    const hasSync = window.Sync && Sync.available();
    if (!hasSync) {
      box.innerHTML = `<div class="banner">🔌 Geräte-Sync nicht aktiv – die App speichert lokal auf diesem Gerät.
        Für Sync fehlt <code>app/config.local.js</code> (Supabase-URL + Key). Bis dahin: Backup nutzen.</div>`;
      return;
    }
    const st = Sync.status();
    if (st.state === "synced") {
      box.innerHTML = `<div class="banner" style="background:color-mix(in srgb,var(--good) 14%,transparent); border-color:color-mix(in srgb,var(--good) 34%,transparent); color:var(--good)">
        ✅ Sync aktiv – angemeldet als <b>${esc(st.email || "")}</b>. Deine Daten sind auf allen Geräten gleich.</div>
        <button class="btn ghost sm" data-action="sync-logout">Abmelden</button>`;
    } else if (st.state === "connecting") {
      box.innerHTML = `<div class="banner">🔄 Verbinde mit Sync…</div>`;
    } else {
      box.innerHTML = `<div class="banner">📲 Melde dich an, damit Handy &amp; Laptop dieselben Daten teilen.
        Du bekommst einen Login-Link per E-Mail (kein Passwort).</div>
        ${st.error ? `<div class="hint" style="color:var(--bad)">Fehler: ${esc(st.error)}</div>` : ""}
        <div class="row" style="gap:8px; margin-top:8px">
          <input type="email" id="sync-email" placeholder="deine@email.ch" autocomplete="email">
          <button class="btn" data-action="sync-login">Link senden</button>
        </div>
        <div class="hint" id="sync-msg"></div>
        <div class="hint">Hinweis: Login funktioniert nur über <code>http://localhost</code> oder die veröffentlichte App – nicht per Doppelklick (file://).</div>`;
    }
  }
  function renderSyncSectionIfOpen() { if ($("#sync-section", app)) renderSyncSection(); }

  function updateSyncBadge(st) {
    const b = $("#syncbadge", app); if (!b) return;
    const map = {
      synced: ["· ✓ Sync", "var(--good)"],
      connecting: ["· Sync…", "var(--muted)"],
      loggedout: ["· offline", "var(--faint)"],
      error: ["· Sync-Fehler", "var(--bad)"],
      local: ["", "var(--faint)"],
    };
    const [txt, col] = map[st.state] || ["", "var(--faint)"];
    b.textContent = txt; b.style.color = col;
  }

  async function doSignIn() {
    const inp = $("#sync-email", app); const email = ((inp && inp.value) || "").trim();
    const msg = $("#sync-msg", app);
    if (!email) { if (msg) msg.textContent = "Bitte E-Mail eingeben."; return; }
    if (msg) msg.textContent = "Sende Login-Link…";
    const res = await Sync.signIn(email);
    if (res && res.error) { if (msg) { msg.textContent = "Fehler: " + res.error; msg.style.color = "var(--bad)"; } }
    else if (msg) { msg.textContent = "✅ Link an " + email + " gesendet. Öffne ihn auf diesem Gerät."; msg.style.color = "var(--good)"; }
  }

  // ====================================================================
  //  Router
  // ====================================================================
  const RENDER = { heute: renderHeute, vorrat: renderVorrat, rezepte: renderRezepte, plan: renderPlan, einkauf: renderEinkauf, recovery: renderRecovery };
  function render() {
    renderTabs();
    $("#title", app).textContent = TABS.find(t => t.id === state.tab).label;
    (RENDER[state.tab] || renderHeute)();
    window.scrollTo({ top: 0 });
  }

  // ====================================================================
  //  Events (Delegation)
  // ====================================================================
  document.addEventListener("click", (e) => {
    const tabBtn = e.target.closest("[data-tab]");
    if (tabBtn) { state.tab = tabBtn.dataset.tab; render(); return; }

    const el = e.target.closest("[data-action]");
    if (!el) return;
    const a = el.dataset.action;
    const id = el.dataset.id;

    switch (a) {
      // Navigation / Datum
      case "date":
        state.date = el.dataset.d === "today" ? todayISO() : shiftDate(state.date, +el.dataset.d);
        renderHeute(); break;
      case "daytype": S.setDayType(state.date, el.dataset.t); renderHeute(); break;

      // Heute: Essen
      case "add-food": modalAddFood(el.dataset.slot || D.slots[0]); break;
      case "mode-food": setAddMode("food"); break;
      case "mode-recipe": setAddMode("recipe"); break;
      case "mode-est": setAddMode("est"); break;
      case "save-food": saveFoodFromModal(); break;
      case "del-item": S.removeLogItem(state.date, id); renderHeute(); break;
      case "log-recipe": logRecipe(id); break;
      case "kein-appetit": state.tab = "rezepte"; state.rf = { fav: false, cook: false, kein: true, tag: null, q: "" }; render(); break;

      // Vorrat
      case "quick-pantry": {
        const name = el.dataset.name;
        if (S.hasPantry(name)) { const p = S.getPantry().find(x => x.name.toLowerCase() === name.toLowerCase()); if (p) S.removePantry(p.id); }
        else S.addPantry({ name });
        renderVorrat(); break;
      }
      case "add-pantry-free": {
        const inp = $("#pantry-free", app); const v = (inp.value || "").trim();
        if (v) { if (!S.hasPantry(v)) S.addPantry({ name: v }); renderVorrat(); }
        break;
      }
      case "del-pantry": S.removePantry(id); renderVorrat(); break;

      // Rezepte
      case "filter-cook": state.rf.cook = !state.rf.cook; renderRezepte(); break;
      case "filter-fav": state.rf.fav = !state.rf.fav; renderRezepte(); break;
      case "filter-kein": state.rf.kein = !state.rf.kein; renderRezepte(); break;
      case "filter-tag": state.rf.tag = state.rf.tag === el.dataset.tag ? null : el.dataset.tag; renderRezepte(); break;
      case "filter-clear": state.rf = { fav: false, cook: false, kein: false, tag: null, q: "" }; renderRezepte(); break;
      case "fav": S.toggleFavorite(id); renderRezepte(); break;
      case "recipe-detail": modalRecipeDetail(id); break;
      case "add-missing": addMissingToShopping(id); closeModal(); state.tab = "einkauf"; render(); break;

      // Plan
      case "plan-cell": choosePlanRecipe(el.dataset.day, el.dataset.slot); break;
      case "gen-shopping": generateShopping(); state.tab = "einkauf"; render(); break;
      case "load-week": if (confirm("Vorgeschlagenen Preseason-Wochenplan laden? Überschreibt den aktuellen Plan.")) { loadWeekPlan(); renderPlan(); } break;

      // Recovery / Whoop
      case "whoop-import": doWhoopImport(); break;

      // Einkauf
      case "toggle-shop": S.toggleShopping(id); renderEinkauf(); break;
      case "add-shop-free": { const inp = $("#shop-free", app); const v = (inp.value || "").trim(); if (v) { S.addShopping({ name: v }); renderEinkauf(); } break; }
      case "clear-checked": S.clearCheckedShopping(); renderEinkauf(); break;

      // Profil
      case "theme": {
        theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
        applyTheme(theme);
        const tb = $("#themebtn", app); if (tb) tb.textContent = theme === "dark" ? "🌙" : "☀️";
        break;
      }
      case "profile": modalProfile(); break;
      case "save-profile": saveProfile(); break;
      case "save-weight": saveWeight(); break;
      case "export": doExport(); break;
      case "import": doImport(); break;
      case "sync-login": doSignIn(); break;
      case "sync-logout": if (window.Sync) Sync.signOut().then(renderSyncSectionIfOpen); break;
      case "reset": if (confirm("Wirklich alle Daten zurücksetzen?")) { S.reset(); closeModal(); render(); } break;

      // Modal
      case "close": closeModal(); break;
      case "overlay": if (e.target === el) closeModal(); break;
    }
  });

  // ---------- Aktionen ----------
  function saveFoodFromModal() {
    const slot = $("#af-slot", app).value;
    const recipeMode = $("#pane-recipe", app).style.display !== "none";
    const estMode = $("#pane-est", app).style.display !== "none";
    if (estMode) {
      const name = ($("#est-name", app).value || "").trim() || "Auswärts (Schätzung)";
      const kcal = +$("#est-kcal", app).value || 0;
      S.addLogItem(state.date, {
        slot, name,
        kcal, protein: +$("#est-p", app).value || 0,
        carbs: +$("#est-c", app).value || 0, fat: +$("#est-f", app).value || 0,
      });
    } else if (recipeMode) {
      const rid = $("#af-recipe", app).value;
      const r = S.getRecipe(rid); if (!r) return;
      S.addLogItem(state.date, { slot, name: r.name, kcal: r.kcal, protein: r.protein, carbs: r.carbs, fat: r.fat, recipe_id: r.id });
    } else {
      const f = S.getFoods().find(x => x.id === $("#af-food", app).value); if (!f) return;
      const amount = +$("#af-amount", app).value || 0;
      const m = macroForFood(f, amount);
      const unit = f.basis === "Stk" ? "Stk" : (f.basis === "100ml" ? "ml" : "g");
      S.addLogItem(state.date, { slot, name: `${f.name} (${amount} ${unit})`, ...m });
    }
    closeModal(); state.tab = "heute"; render();
  }

  function logRecipe(id) {
    const r = S.getRecipe(id); if (!r) return;
    const slot = r.slot && D.slots.includes(r.slot) ? r.slot : D.slots[0];
    S.addLogItem(state.date, { slot, name: r.name, kcal: r.kcal, protein: r.protein, carbs: r.carbs, fat: r.fat, recipe_id: r.id });
    closeModal(); state.tab = "heute"; render();
  }

  function choosePlanRecipe(day, slot) {
    const recipes = S.getRecipes().slice().sort((a, b) => a.name.localeCompare(b.name));
    openModal(`
      <div class="mh"><h3>${day} · ${esc(slot)}</h3><button class="icon-btn" data-action="close">✕</button></div>
      <div class="rlist">
        <button class="btn ghost block" data-action="set-plan" data-day="${day}" data-slot="${esc(slot)}" data-rid="">– leeren –</button>
        ${recipes.map(r => `<button class="btn ghost block" style="justify-content:space-between" data-action="set-plan" data-day="${day}" data-slot="${esc(slot)}" data-rid="${r.id}">
          <span>${esc(r.name)}</span><span class="faint small">${r0(r.kcal)} kcal</span></button>`).join("")}
      </div>`);
  }
  document.addEventListener("click", (e) => {
    const el = e.target.closest('[data-action="set-plan"]'); if (!el) return;
    S.setPlan(el.dataset.day, el.dataset.slot, el.dataset.rid || null);
    closeModal(); renderPlan();
  });

  function collectIngredients() {
    const plan = S.getPlan(); const agg = {};
    WEEKDAYS.forEach(day => Object.values(plan[day] || {}).forEach(rid => {
      const r = S.getRecipe(rid); if (!r) return;
      (r.ingredients || []).forEach(i => {
        const key = i.name.toLowerCase();
        if (!agg[key]) agg[key] = { name: i.name, amount: 0, unit: i.unit || "" };
        agg[key].amount += (+i.amount || 0);
      });
    }));
    return Object.values(agg);
  }
  function generateShopping() {
    const needed = collectIngredients().filter(i => !isStaple(i.name) && !S.getPantry().some(p => overlaps(p.name, i.name)));
    if (!needed.length) { alert("Nichts zu kaufen – entweder ist der Plan leer oder du hast alles im Vorrat. 🎉"); return; }
    S.setShopping(needed.map(i => ({ id: S.uid(), name: i.name, amount: i.amount || null, unit: i.unit, checked: false })));
  }
  function addMissingToShopping(id) {
    const r = S.getRecipe(id); if (!r) return;
    const miss = missingIngredients(r);
    const cur = S.getShopping();
    miss.forEach(name => {
      const ing = r.ingredients.find(i => i.name === name);
      if (!cur.some(c => c.name.toLowerCase() === name.toLowerCase()))
        S.addShopping({ name, amount: ing ? ing.amount : null, unit: ing ? ing.unit : "" });
    });
  }

  function saveProfile() {
    const num = (sel) => +$(sel, app).value || 0;
    S.saveSettings({
      weight_current: num("#p-wc"), weight_goal: num("#p-wg"), height_cm: num("#p-h"),
      kcal_train: num("#p-kt"), protein_train: num("#p-pt"), carbs_train: num("#p-ct"), fat_train: num("#p-ft"),
      kcal_rest: num("#p-kr"), protein_rest: num("#p-pr"), carbs_rest: num("#p-cr"), fat_rest: num("#p-fr"),
    });
    closeModal(); render();
  }
  function saveWeight() {
    const kg = +$("#wl-kg", app).value || 0; if (!kg) return;
    S.addWeight({ date: todayISO(), weight_kg: kg });
    S.saveSettings({ weight_current: kg });
    closeModal(); render();
  }

  function doExport() {
    const blob = new Blob([S.exportJSON()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `ernaehrung-backup-${todayISO()}.json`; a.click();
    URL.revokeObjectURL(url);
  }
  function doImport() {
    const inp = document.createElement("input"); inp.type = "file"; inp.accept = "application/json";
    inp.onchange = () => {
      const file = inp.files[0]; if (!file) return;
      const fr = new FileReader();
      fr.onload = () => { try { S.importJSON(fr.result); closeModal(); render(); alert("Backup importiert."); } catch (e) { alert("Datei konnte nicht gelesen werden."); } };
      fr.readAsText(file);
    };
    inp.click();
  }

  // ---------- Start ----------
  render();

  // Sync initialisieren (optional; App läuft auch ohne)
  if (window.Sync) {
    Sync.init(
      (st) => { updateSyncBadge(st); renderSyncSectionIfOpen(); },   // Status-Änderung
      () => { render(); }                                            // Remote-Änderung von anderem Gerät
    );
  }
})();
