/* Supabase-Zugang für die App.
 *
 * Enthält NUR den PUBLISHABLE-Key (sb_publishable_…). Dieser ist dafür gemacht,
 * im Client-Code / im veröffentlichten Bundle zu stehen – der Schutz der Daten
 * läuft über Row-Level-Security (siehe supabase/schema.sql). Der geheime
 * sb_secret_… Key steht NIE hier. Publishable-Key jederzeit in Supabase
 * (Settings → API) rotierbar.
 *
 * config.local.js (falls vorhanden) überschreibt diese Werte lokal. */
window.APP_CONFIG = window.APP_CONFIG || {
  SUPABASE_URL: "https://ftchnrovkhmamvnjqlvm.supabase.co",
  SUPABASE_KEY: "sb_publishable_Iu7N086zHIZaSBn3MmfnKw_SqvpgrY1",
};
