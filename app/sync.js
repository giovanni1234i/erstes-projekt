/* =====================================================================
 *  Sync: Geräte-übergreifende Synchronisation über Supabase.
 *  Modell: der gesamte App-Zustand liegt als eine JSON-Zeile pro Nutzer
 *  in der Tabelle app_state. Last-Write-Wins über _updatedAt.
 *
 *  Die App funktioniert IMMER lokal (localStorage). Sync ist ein
 *  optionaler Aufsatz: ist keine Config/Anmeldung da, läuft alles lokal.
 * ===================================================================== */
window.Sync = (function () {
  const cfg = window.APP_CONFIG || null;
  let client = null, user = null, channel = null, pushTimer = null;
  let statusCb = null, onRemote = null, applying = false;
  const status = { state: "local", email: null, error: null }; // local|loggedout|connecting|synced|error

  function available() {
    return !!(cfg && cfg.SUPABASE_URL && cfg.SUPABASE_KEY &&
      !/DEIN-PROJEKT|\.\.\.$/.test(cfg.SUPABASE_URL + cfg.SUPABASE_KEY) &&
      window.supabase && window.supabase.createClient);
  }
  function setStatus(s, extra) {
    status.state = s; status.error = (extra && extra.error) || null;
    if (extra && "email" in extra) status.email = extra.email;
    if (statusCb) statusCb(status);
  }

  async function init(onStatusChange, onRemoteChange) {
    statusCb = onStatusChange; onRemote = onRemoteChange;
    if (!available()) { setStatus("local"); return; }
    try {
      client = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_KEY, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
      });
    } catch (e) { setStatus("error", { error: "Init fehlgeschlagen: " + e.message }); return; }

    // Lokale Änderungen -> (debounced) hochladen
    if (window.Store && Store.onChange) Store.onChange(() => { if (!applying) schedulePush(); });

    client.auth.onAuthStateChange((_ev, session) => handleSession(session));
    try {
      const { data } = await client.auth.getSession();
      await handleSession(data && data.session);
    } catch (e) { setStatus("loggedout"); }

    // Beim Zurückkommen auf die App frische Daten holen
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && user) pull();
    });
  }

  async function handleSession(session) {
    if (session && session.user) {
      user = session.user;
      setStatus("connecting", { email: user.email });
      await pull();
      subscribe();
      setStatus("synced", { email: user.email });
    } else {
      user = null;
      if (channel && client) { client.removeChannel(channel); channel = null; }
      setStatus(available() ? "loggedout" : "local", { email: null });
    }
  }

  async function signIn(email) {
    if (!client) return { error: "Sync ist nicht konfiguriert." };
    const redirect = location.origin + location.pathname;
    try {
      const { error } = await client.auth.signInWithOtp({ email, options: { emailRedirectTo: redirect } });
      return { error: error ? error.message : null };
    } catch (e) { return { error: e.message }; }
  }
  async function signOut() { if (client) { try { await client.auth.signOut(); } catch (e) {} } }

  async function pull() {
    if (!client || !user) return;
    try {
      const { data, error } = await client.from("app_state")
        .select("data").eq("user_id", user.id).maybeSingle();
      if (error) { console.warn("pull:", error.message); return; }
      if (data && data.data && Object.keys(data.data).length) {
        const remote = data.data;
        const rTs = remote._updatedAt || 0, lTs = (Store.stamp && Store.stamp()) || 0;
        if (rTs >= lTs) { applyRemote(remote); }
        else { await push(true); }   // lokal ist neuer -> hochladen
      } else {
        await push(true);            // nichts remote -> lokalen Stand hochladen
      }
    } catch (e) { console.warn("pull failed:", e.message); }
  }

  function applyRemote(remote) {
    applying = true;
    try { Store.applyRemote(remote); } finally { applying = false; }
    if (onRemote) onRemote();
  }

  function schedulePush() { clearTimeout(pushTimer); pushTimer = setTimeout(() => push(), 1200); }
  async function push(force) {
    if (!client || !user) return;
    try {
      const snap = Store.snapshot();
      const { error } = await client.from("app_state").upsert(
        { user_id: user.id, data: snap, updated_at: new Date().toISOString() },
        { onConflict: "user_id" });
      if (error) setStatus("error", { error: error.message, email: user.email });
      else if (status.state !== "synced") setStatus("synced", { email: user.email });
    } catch (e) { /* offline: bleibt lokal gespeichert, nächste Änderung pusht erneut */ }
  }

  function subscribe() {
    if (!client) return;
    if (channel) client.removeChannel(channel);
    channel = client.channel("app_state_" + user.id)
      .on("postgres_changes",
        { event: "*", schema: "public", table: "app_state", filter: "user_id=eq." + user.id },
        (payload) => {
          const remote = payload.new && payload.new.data;
          if (remote) {
            const rTs = remote._updatedAt || 0, lTs = (Store.stamp && Store.stamp()) || 0;
            if (rTs > lTs) applyRemote(remote);
          }
        })
      .subscribe();
  }

  return { init, signIn, signOut, available, status: () => status };
})();
