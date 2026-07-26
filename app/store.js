/* =====================================================================
 *  Store: Datenhaltung mit localStorage (Phase 1, lokal).
 *  Alle Zugriffe laufen über dieses Modul, damit später der Wechsel
 *  auf Supabase-Sync ein kleiner Schritt ist (nur diese Methoden ändern).
 * ===================================================================== */
window.Store = (function () {
  const KEY = "ernaehrung_meier_v1";
  const D = window.NUTRI_DATA;

  const blank = () => ({
    settings: { ...D.defaults },
    pantry: [],                 // [{id,name,quantity,unit,category}]
    foods: D.foods.map(withId), // Nährwerte (seed, editierbar)
    recipes: D.recipes.map(withId),
    log: {},                    // { "YYYY-MM-DD": {dayType:"train|rest", items:[...] } }
    plan: {},                   // { "Mo".."So": { slot: recipeId } }
    shopping: [],               // [{id,name,amount,unit,checked}]
    weight: [],                 // [{id,date,weight_kg,appetite,sleep_h,notes}]
  });

  function uid() {
    return "id" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
  }
  function withId(o) { return { id: uid(), ...o }; }

  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) { const s = blank(); persist(s); return s; }
      const parsed = JSON.parse(raw);
      // sanfte Migration: fehlende Felder aus blank() ergänzen
      return Object.assign(blank(), parsed);
    } catch (e) {
      console.warn("Store: konnte nicht laden, starte frisch.", e);
      const s = blank(); persist(s); return s;
    }
  }
  function persist(s) {
    try { localStorage.setItem(KEY, JSON.stringify(s || state)); }
    catch (e) { console.error("Store: Speichern fehlgeschlagen (Speicher voll?)", e); }
  }

  // --- generische Helfer ---
  const api = {
    uid,
    all: () => state,

    // Settings
    getSettings: () => state.settings,
    saveSettings: (patch) => { Object.assign(state.settings, patch); persist(); },

    // Pantry
    getPantry: () => state.pantry,
    hasPantry: (name) => state.pantry.some(p => sameName(p.name, name)),
    addPantry: (item) => { state.pantry.push({ id: uid(), quantity: null, unit: "", category: "", ...item }); persist(); },
    updatePantry: (id, patch) => { const p = state.pantry.find(x => x.id === id); if (p) Object.assign(p, patch); persist(); },
    removePantry: (id) => { state.pantry = state.pantry.filter(x => x.id !== id); persist(); },

    // Foods
    getFoods: () => state.foods,
    findFood: (name) => state.foods.find(f => sameName(f.name, name)),
    addFood: (f) => { const nf = { id: uid(), basis: "100g", protein: 0, carbs: 0, fat: 0, ...f }; state.foods.push(nf); persist(); return nf; },

    // Recipes
    getRecipes: () => state.recipes,
    getRecipe: (id) => state.recipes.find(r => r.id === id),
    addRecipe: (r) => { const nr = { id: uid(), tags: [], servings: 1, ingredients: [], ...r }; state.recipes.push(nr); persist(); return nr; },
    updateRecipe: (id, patch) => { const r = state.recipes.find(x => x.id === id); if (r) Object.assign(r, patch); persist(); },
    toggleFavorite: (id) => { const r = api.getRecipe(id); if (r) { r.is_favorite = !r.is_favorite; persist(); } },

    // Log (pro Tag)
    getDay: (date) => state.log[date] || { dayType: "train", items: [] },
    setDayType: (date, dayType) => { const d = api.getDay(date); d.dayType = dayType; state.log[date] = d; persist(); },
    addLogItem: (date, item) => {
      const d = api.getDay(date);
      d.items.push({ id: uid(), slot: "", kcal: 0, protein: 0, carbs: 0, fat: 0, ...item });
      state.log[date] = d; persist();
    },
    removeLogItem: (date, id) => {
      const d = api.getDay(date); d.items = d.items.filter(x => x.id !== id);
      state.log[date] = d; persist();
    },
    dayTotals: (date) => {
      const d = api.getDay(date);
      return d.items.reduce((t, i) => ({
        kcal: t.kcal + (+i.kcal || 0), protein: t.protein + (+i.protein || 0),
        carbs: t.carbs + (+i.carbs || 0), fat: t.fat + (+i.fat || 0),
      }), { kcal: 0, protein: 0, carbs: 0, fat: 0 });
    },
    targetFor: (dayType) => {
      const s = state.settings;
      return dayType === "rest"
        ? { kcal: s.kcal_rest, protein: s.protein_rest, carbs: s.carbs_rest, fat: s.fat_rest }
        : { kcal: s.kcal_train, protein: s.protein_train, carbs: s.carbs_train, fat: s.fat_train };
    },

    // Plan (Wochentag -> slot -> recipeId)
    getPlan: () => state.plan,
    setPlan: (day, slot, recipeId) => {
      state.plan[day] = state.plan[day] || {};
      if (recipeId) state.plan[day][slot] = recipeId; else delete state.plan[day][slot];
      persist();
    },

    // Shopping
    getShopping: () => state.shopping,
    setShopping: (list) => { state.shopping = list; persist(); },
    toggleShopping: (id) => { const it = state.shopping.find(x => x.id === id); if (it) { it.checked = !it.checked; persist(); } },
    addShopping: (item) => { state.shopping.push({ id: uid(), checked: false, amount: null, unit: "", ...item }); persist(); },
    clearCheckedShopping: () => { state.shopping = state.shopping.filter(x => !x.checked); persist(); },

    // Weight
    getWeight: () => state.weight,
    addWeight: (w) => { state.weight.push({ id: uid(), ...w }); persist(); },

    // Backup
    exportJSON: () => JSON.stringify(state, null, 2),
    importJSON: (raw) => { state = Object.assign(blank(), JSON.parse(raw)); persist(); },
    reset: () => { state = blank(); persist(); },
  };

  function sameName(a, b) {
    return (a || "").trim().toLowerCase() === (b || "").trim().toLowerCase();
  }

  return api;
})();
