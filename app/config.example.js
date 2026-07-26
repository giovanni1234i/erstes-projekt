/* Kopiere diese Datei als  config.local.js  und trage deine Werte ein.
 * config.local.js wird per .gitignore NICHT ins Repo gepusht.
 * Nur der PUBLISHABLE-Key (sb_publishable_…) gehört hierher – niemals der
 * geheime sb_secret_… Key. Der Schutz der Daten läuft über Row-Level-Security. */
window.APP_CONFIG = {
  SUPABASE_URL: "https://DEIN-PROJEKT.supabase.co",
  SUPABASE_KEY: "sb_publishable_...",
};
