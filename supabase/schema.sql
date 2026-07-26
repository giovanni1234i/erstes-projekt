-- =====================================================================
--  Ernährungs-App · Datenbank-Schema für Supabase (PostgreSQL)
--  Anwenden: Supabase-Dashboard → SQL Editor → New query →
--            diesen ganzen Inhalt einfügen → RUN.
--  Idempotent: kann bei Änderungen erneut ausgeführt werden.
-- =====================================================================

-- ---------- Einstellungen / Ziele (1 Zeile pro Nutzer) ----------
create table if not exists app_settings (
  user_id            uuid primary key references auth.users(id) on delete cascade,
  kcal_target        int  not null default 3750,
  protein_target     int  not null default 180,
  carbs_target       int,
  fat_target         int,
  training_day_bonus int  not null default 0,   -- extra kcal an Trainingstagen
  weight_current     numeric(5,1),
  weight_goal        numeric(5,1),
  height_cm          int,
  updated_at         timestamptz not null default now()
);

-- ---------- Vorrat (was zuhause ist) ----------
create table if not exists pantry (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade default auth.uid(),
  name       text not null,
  quantity   numeric,
  unit       text,          -- g, ml, Stk, Pkg ...
  category   text,          -- Kühlschrank, Vorrat, Tiefkühler ...
  updated_at timestamptz not null default now()
);

-- ---------- Lebensmittel-Nährwerte (Referenz) ----------
-- Globale Einträge (user_id = null) sind für alle Angemeldeten lesbar;
-- eigene Einträge gehören dir und sind voll bearbeitbar.
create table if not exists food_db (
  id       uuid primary key default gen_random_uuid(),
  user_id  uuid references auth.users(id) on delete cascade,  -- null = global
  name     text    not null,
  kcal     numeric not null,
  protein  numeric not null default 0,
  carbs    numeric not null default 0,
  fat      numeric not null default 0,
  basis    text    not null default '100g',   -- 100g | 100ml | Stk
  category text
);

-- ---------- Rezepte ----------
create table if not exists recipes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade default auth.uid(),
  name        text not null,
  description text,
  servings    int  not null default 1,
  prep_min    int,
  tags        text[] default '{}',   -- z.B. {schnell, high-protein, flüssig}
  instructions text,
  is_favorite boolean not null default false,
  created_at  timestamptz not null default now()
);

create table if not exists recipe_ingredients (
  id        uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references recipes(id) on delete cascade,
  food_id   uuid references food_db(id) on delete set null,
  name      text,        -- Freitext, falls kein food_db-Bezug
  amount    numeric,
  unit      text
);

-- ---------- Tages-Log (was gegessen wurde) ----------
create table if not exists meal_log (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade default auth.uid(),
  log_date   date not null default current_date,
  meal_slot  text,        -- Frühstück, Snack1, Mittag, Snack2, Abend, Shake
  item_name  text not null,
  recipe_id  uuid references recipes(id) on delete set null,
  kcal       numeric not null default 0,
  protein    numeric not null default 0,
  carbs      numeric not null default 0,
  fat        numeric not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- Wochen-Menüplan ----------
create table if not exists menu_plan (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid not null references auth.users(id) on delete cascade default auth.uid(),
  plan_date date not null,
  meal_slot text not null,
  recipe_id uuid references recipes(id) on delete set null,
  note      text
);

-- ---------- Einkaufsliste ----------
create table if not exists shopping_list (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade default auth.uid(),
  name       text not null,
  amount     numeric,
  unit       text,
  checked    boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- Gewicht / Appetit / Schlaf ----------
create table if not exists weight_log (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid not null references auth.users(id) on delete cascade default auth.uid(),
  log_date  date not null default current_date,
  weight_kg numeric(5,1),
  appetite  int,          -- 1..5
  sleep_h   numeric(3,1),
  notes     text
);

-- =====================================================================
--  Row-Level-Security: jeder sieht/ändert ausschliesslich eigene Daten
-- =====================================================================
alter table app_settings      enable row level security;
alter table pantry            enable row level security;
alter table food_db           enable row level security;
alter table recipes           enable row level security;
alter table recipe_ingredients enable row level security;
alter table meal_log          enable row level security;
alter table menu_plan         enable row level security;
alter table shopping_list     enable row level security;
alter table weight_log        enable row level security;

-- Hilfsmakro-Ersatz: eine "own rows"-Policy pro nutzereigener Tabelle.
do $$
declare t text;
begin
  foreach t in array array[
    'app_settings','pantry','recipes','meal_log',
    'menu_plan','shopping_list','weight_log'
  ] loop
    execute format('drop policy if exists own_rows on %I', t);
    execute format(
      'create policy own_rows on %I for all
         using (auth.uid() = user_id)
         with check (auth.uid() = user_id)', t);
  end loop;
end $$;

-- recipe_ingredients: über das zugehörige Rezept absichern.
drop policy if exists own_via_recipe on recipe_ingredients;
create policy own_via_recipe on recipe_ingredients for all
  using      (exists (select 1 from recipes r where r.id = recipe_id and r.user_id = auth.uid()))
  with check (exists (select 1 from recipes r where r.id = recipe_id and r.user_id = auth.uid()));

-- food_db: globale Einträge lesbar für alle Angemeldeten, eigene voll bearbeitbar.
drop policy if exists food_read  on food_db;
drop policy if exists food_write on food_db;
drop policy if exists food_upd   on food_db;
drop policy if exists food_del   on food_db;
create policy food_read  on food_db for select using (user_id is null or auth.uid() = user_id);
create policy food_write on food_db for insert with check (auth.uid() = user_id);
create policy food_upd   on food_db for update using (auth.uid() = user_id);
create policy food_del   on food_db for delete using (auth.uid() = user_id);

-- =====================================================================
--  Fertig. Nährwert-Basisdaten und Start-Rezepte werden später von der
--  App befüllt (sobald deine Antworten da sind).
-- =====================================================================
