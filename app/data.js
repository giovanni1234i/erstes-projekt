/* =====================================================================
 *  Seed-Daten für die Ernährungs-App (Meier G.)
 *  Zugeschnitten auf: Pasta, Reis, Lachs, Grill · kein grosser Gemüse-Fan
 *  Supplements: Whey + Kreatin · Küche: Backofen, Herd, Mixer
 *  Alle Werte sind Startwerte und in der App editierbar.
 * ===================================================================== */
window.NUTRI_DATA = {

  // ---- Standard-Ziele (aus TDEE-Schätzung, editierbar im Profil) ----
  defaults: {
    weight_current: 81, weight_goal: 85, height_cm: 190, age: 19,
    kcal_rest: 3200,  protein_rest: 170,  carbs_rest: 410,  fat_rest: 95,
    kcal_train: 3900, protein_train: 175, carbs_train: 550, fat_train: 110,
  },

  // ---- Mahlzeiten-Slots (6 kleine statt 3 grosse) ----
  slots: ["Frühstück", "Snack 1", "Mittag", "Snack 2", "Abend", "Shake"],

  // ---- Häufige Zutaten zum Anhäkeln (Vorrat) ----
  pantryQuickPick: [
    "Haferflocken","Milch","Magerquark","Hüttenkäse","Griechischer Joghurt","Eier",
    "Brot","Reis","Teigwaren","Kartoffeln","Süsskartoffeln","Toast/Wrap",
    "Hähnchenbrust","Rindshackfleisch","Lachs","Thunfisch (Dose)",
    "Olivenöl","Erdnussbutter","Honig","Banane","Datteln","Beeren (TK)",
    "Whey Protein","Gouda","Mozzarella","Parmesan","Pesto","Passata/Tomatensauce",
    "Mandeln/Cashew","Avocado","Butter","Rahm",
  ],

  // ---- Nährwerte-Referenz (Basis wie angegeben) ----
  foods: [
    { name:"Haferflocken",           kcal:370, protein:13,  carbs:60, fat:7,   basis:"100g" },
    { name:"Milch (vollfett)",       kcal:64,  protein:3.3, carbs:4.8,fat:3.5, basis:"100ml" },
    { name:"Magerquark",             kcal:67,  protein:12,  carbs:4,  fat:0.2, basis:"100g" },
    { name:"Griechischer Joghurt",   kcal:120, protein:9,   carbs:4,  fat:8,   basis:"100g" },
    { name:"Ei",                     kcal:78,  protein:6.3, carbs:0.6,fat:5.3, basis:"Stk" },
    { name:"Reis (gekocht)",         kcal:130, protein:2.7, carbs:28, fat:0.3, basis:"100g" },
    { name:"Teigwaren (gekocht)",    kcal:158, protein:6,   carbs:31, fat:1,   basis:"100g" },
    { name:"Kartoffeln",             kcal:77,  protein:2,   carbs:17, fat:0.1, basis:"100g" },
    { name:"Süsskartoffeln",         kcal:86,  protein:1.6, carbs:20, fat:0.1, basis:"100g" },
    { name:"Toast (Scheibe)",        kcal:80,  protein:3,   carbs:14, fat:1,   basis:"Stk" },
    { name:"Wrap/Tortilla",          kcal:150, protein:4,   carbs:25, fat:4,   basis:"Stk" },
    { name:"Hähnchenbrust",          kcal:165, protein:31,  carbs:0,  fat:3.6, basis:"100g" },
    { name:"Rindshackfleisch",       kcal:250, protein:26,  carbs:0,  fat:17,  basis:"100g" },
    { name:"Lachs",                  kcal:208, protein:20,  carbs:0,  fat:13,  basis:"100g" },
    { name:"Thunfisch (Dose)",       kcal:116, protein:26,  carbs:0,  fat:1,   basis:"100g" },
    { name:"Olivenöl",               kcal:884, protein:0,   carbs:0,  fat:100, basis:"100ml" },
    { name:"Butter",                 kcal:717, protein:0.9, carbs:0.7,fat:81,  basis:"100g" },
    { name:"Rahm",                   kcal:340, protein:2,   carbs:3,  fat:36,  basis:"100ml" },
    { name:"Erdnussbutter",          kcal:600, protein:25,  carbs:20, fat:50,  basis:"100g" },
    { name:"Honig",                  kcal:304, protein:0,   carbs:82, fat:0,   basis:"100g" },
    { name:"Banane",                 kcal:105, protein:1.3, carbs:27, fat:0.4, basis:"Stk" },
    { name:"Apfel",                  kcal:95,  protein:0.5, carbs:25, fat:0.3, basis:"Stk" },
    { name:"Beeren (TK)",            kcal:50,  protein:1,   carbs:10, fat:0.3, basis:"100g" },
    { name:"Datteln",                kcal:280, protein:2,   carbs:75, fat:0.4, basis:"100g" },
    { name:"Whey Protein (Portion)", kcal:120, protein:24,  carbs:3,  fat:2,   basis:"Stk" },
    { name:"Gouda",                  kcal:356, protein:25,  carbs:2,  fat:27,  basis:"100g" },
    { name:"Mozzarella",             kcal:250, protein:18,  carbs:3,  fat:19,  basis:"100g" },
    { name:"Frischkäse",             kcal:250, protein:6,   carbs:4,  fat:24,  basis:"100g" },
    { name:"Pesto",                  kcal:450, protein:5,   carbs:6,  fat:45,  basis:"100g" },
    { name:"Passata/Tomatensauce",   kcal:35,  protein:1.5, carbs:6,  fat:0.3, basis:"100g" },
    { name:"Mais (Dose)",            kcal:96,  protein:3.4, carbs:19, fat:1.5, basis:"100g" },
    { name:"Avocado",                kcal:240, protein:3,   carbs:12, fat:22,  basis:"Stk" },
    { name:"Mandeln",                kcal:580, protein:21,  carbs:20, fat:50,  basis:"100g" },
    { name:"Cashew",                 kcal:553, protein:18,  carbs:30, fat:44,  basis:"100g" },
    { name:"Hüttenkäse",             kcal:98,  protein:11,  carbs:3.4,fat:4.3, basis:"100g" },
    { name:"Brot (Scheibe)",         kcal:120, protein:4,   carbs:22, fat:1.5, basis:"Stk" },
    { name:"Parmesan",               kcal:400, protein:36,  carbs:0,  fat:28,  basis:"100g" },

    // --- Getränke (mitzählen – auch Koffein im Blick behalten) ---
    { name:"Energy Drink (250ml)",   kcal:115, protein:0,   carbs:28, fat:0,   basis:"Stk", category:"Getränk" },
    { name:"Cola (3dl)",             kcal:130, protein:0,   carbs:33, fat:0,   basis:"Stk", category:"Getränk" },
    { name:"Fruchtsaft (2.5dl)",     kcal:115, protein:0.5, carbs:27, fat:0,   basis:"Stk", category:"Getränk" },

    // --- Auswärts / Clubrestaurant (Schätzwerte pro Teller, editierbar) ---
    { name:"Auswärts: Teller normal",        kcal:850,  protein:45, carbs:85,  fat:32, basis:"Stk", category:"Auswärts" },
    { name:"Auswärts: Teller gross",         kcal:1100, protein:55, carbs:110, fat:42, basis:"Stk", category:"Auswärts" },
    { name:"Auswärts: Pasta-Teller",         kcal:1000, protein:35, carbs:130, fat:32, basis:"Stk", category:"Auswärts" },
    { name:"Auswärts: Fleisch + Beilagen",   kcal:950,  protein:55, carbs:80,  fat:38, basis:"Stk", category:"Auswärts" },
  ],

  /* ---- Rezepte ----
   * kcal/Makros sind pro Portion (bereits gerechnet, editierbar).
   * tags: "flüssig"/"kein-appetit" = für miese Appetit-Tage,
   *       "grill" = Sommer, "schnell", "meal-prep", "frühstück", "snack".
   */
  recipes: [
    { name:"Power Oats", slot:"Frühstück", prep_min:8, servings:1, is_favorite:true,
      tags:["frühstück","schnell","high-protein"],
      kcal:750, protein:40, carbs:90, fat:25,
      ingredients:[
        {name:"Haferflocken", amount:100, unit:"g"},
        {name:"Milch (vollfett)", amount:300, unit:"ml"},
        {name:"Banane", amount:1, unit:"Stk"},
        {name:"Erdnussbutter", amount:20, unit:"g"},
        {name:"Honig", amount:15, unit:"g"},
        {name:"Whey Protein (Portion)", amount:1, unit:"Stk"},
      ],
      instructions:"Haferflocken mit Milch aufkochen oder over-night einweichen. Banane, Erdnussbutter, Honig unterrühren, Whey erst zum Schluss (nicht kochen)." },

    { name:"Gainer-Shake", slot:"Shake", prep_min:3, servings:1, is_favorite:true,
      tags:["flüssig","kein-appetit","schnell"],
      kcal:400, protein:25, carbs:55, fat:10,
      ingredients:[
        {name:"Milch (vollfett)", amount:400, unit:"ml"},
        {name:"Haferflocken", amount:40, unit:"g"},
        {name:"Banane", amount:1, unit:"Stk"},
        {name:"Erdnussbutter", amount:15, unit:"g"},
        {name:"Honig", amount:10, unit:"g"},
      ],
      instructions:"Alles in den Mixer, glatt mixen. Geht auch bei null Appetit runter – notfalls eine feste Mahlzeit ersetzen." },

    { name:"Bananen-Beeren-Shake", slot:"Shake", prep_min:3, servings:1,
      tags:["flüssig","kein-appetit","schnell"],
      kcal:450, protein:30, carbs:60, fat:10,
      ingredients:[
        {name:"Milch (vollfett)", amount:350, unit:"ml"},
        {name:"Banane", amount:1, unit:"Stk"},
        {name:"Beeren (TK)", amount:100, unit:"g"},
        {name:"Whey Protein (Portion)", amount:1, unit:"Stk"},
        {name:"Honig", amount:15, unit:"g"},
      ],
      instructions:"Alles mixen. Frisch und leicht – ideal, wenn nichts Deftiges reingeht." },

    { name:"Hähnchen-Reisbowl", slot:"Mittag", prep_min:25, servings:1, is_favorite:true,
      tags:["high-protein","meal-prep"],
      kcal:900, protein:60, carbs:100, fat:22,
      ingredients:[
        {name:"Reis (gekocht)", amount:300, unit:"g"},
        {name:"Hähnchenbrust", amount:200, unit:"g"},
        {name:"Olivenöl", amount:15, unit:"ml"},
        {name:"Passata/Tomatensauce", amount:80, unit:"g"},
        {name:"Mais (Dose)", amount:80, unit:"g"},
      ],
      instructions:"Hähnchen in Öl anbraten, mit Reis, Mais und Sauce mischen. Perfekt zum Vorkochen (Mo–Do)." },

    { name:"Lachs mit Reis", slot:"Abend", prep_min:25, servings:1, is_favorite:true,
      tags:["lachs","einfach"],
      kcal:850, protein:45, carbs:85, fat:30,
      ingredients:[
        {name:"Lachs", amount:180, unit:"g"},
        {name:"Reis (gekocht)", amount:280, unit:"g"},
        {name:"Olivenöl", amount:15, unit:"ml"},
      ],
      instructions:"Lachs im Ofen ~15 Min bei 200°C, Reis dazu, mit Öl beträufeln." },

    { name:"Hackfleisch-Pasta (Bolo)", slot:"Abend", prep_min:30, servings:1, is_favorite:true,
      tags:["pasta","meal-prep"],
      kcal:850, protein:45, carbs:90, fat:30,
      ingredients:[
        {name:"Teigwaren (gekocht)", amount:300, unit:"g"},
        {name:"Rindshackfleisch", amount:150, unit:"g"},
        {name:"Passata/Tomatensauce", amount:150, unit:"g"},
        {name:"Olivenöl", amount:10, unit:"ml"},
        {name:"Gouda", amount:30, unit:"g"},
      ],
      instructions:"Hackfleisch anbraten, Passata dazu köcheln, über die Pasta, mit Käse bestreuen." },

    { name:"Pasta Pesto mit Poulet", slot:"Mittag", prep_min:20, servings:1,
      tags:["pasta","schnell"],
      kcal:900, protein:50, carbs:90, fat:35,
      ingredients:[
        {name:"Teigwaren (gekocht)", amount:300, unit:"g"},
        {name:"Hähnchenbrust", amount:150, unit:"g"},
        {name:"Pesto", amount:40, unit:"g"},
        {name:"Mozzarella", amount:60, unit:"g"},
      ],
      instructions:"Poulet anbraten, mit Pasta und Pesto mischen, Mozzarella dazu." },

    { name:"Thunfisch-Pasta", slot:"Mittag", prep_min:15, servings:1,
      tags:["pasta","schnell","günstig"],
      kcal:800, protein:45, carbs:95, fat:22,
      ingredients:[
        {name:"Teigwaren (gekocht)", amount:300, unit:"g"},
        {name:"Thunfisch (Dose)", amount:150, unit:"g"},
        {name:"Passata/Tomatensauce", amount:150, unit:"g"},
        {name:"Olivenöl", amount:12, unit:"ml"},
      ],
      instructions:"Passata mit Thunfisch erwärmen, über die Pasta, Öl dazu. Schnell & günstig." },

    { name:"Grill: Poulet + Kartoffeln", slot:"Abend", prep_min:35, servings:1,
      tags:["grill","sommer","high-protein"],
      kcal:800, protein:60, carbs:70, fat:25,
      ingredients:[
        {name:"Hähnchenbrust", amount:200, unit:"g"},
        {name:"Kartoffeln", amount:400, unit:"g"},
        {name:"Olivenöl", amount:15, unit:"ml"},
      ],
      instructions:"Poulet marinieren und grillen, Kartoffeln in Folie auf den Grill. Sommer-Klassiker." },

    { name:"Grill: Lachs + Reis", slot:"Abend", prep_min:30, servings:1,
      tags:["grill","sommer","lachs"],
      kcal:850, protein:45, carbs:80, fat:32,
      ingredients:[
        {name:"Lachs", amount:180, unit:"g"},
        {name:"Reis (gekocht)", amount:280, unit:"g"},
        {name:"Olivenöl", amount:12, unit:"ml"},
      ],
      instructions:"Lachs auf der Plank/Folie grillen, Reis dazu." },

    { name:"Süsskartoffel + Hackfleisch", slot:"Abend", prep_min:30, servings:1,
      tags:["einfach","meal-prep"],
      kcal:800, protein:45, carbs:70, fat:32,
      ingredients:[
        {name:"Süsskartoffeln", amount:350, unit:"g"},
        {name:"Rindshackfleisch", amount:150, unit:"g"},
        {name:"Olivenöl", amount:12, unit:"ml"},
      ],
      instructions:"Süsskartoffel-Würfel im Ofen ~25 Min, Hackfleisch anbraten, mischen." },

    { name:"Quark-Bowl", slot:"Snack 2", prep_min:5, servings:1,
      tags:["snack","schnell","high-protein"],
      kcal:550, protein:40, carbs:60, fat:14,
      ingredients:[
        {name:"Magerquark", amount:250, unit:"g"},
        {name:"Banane", amount:1, unit:"Stk"},
        {name:"Honig", amount:15, unit:"g"},
        {name:"Haferflocken", amount:30, unit:"g"},
        {name:"Mandeln", amount:15, unit:"g"},
      ],
      instructions:"Quark mit Banane, Honig, Oats und Nüssen verrühren." },

    { name:"Wrap mit Ei & Käse", slot:"Snack 1", prep_min:10, servings:1,
      tags:["snack","schnell"],
      kcal:550, protein:28, carbs:45, fat:28,
      ingredients:[
        {name:"Wrap/Tortilla", amount:1, unit:"Stk"},
        {name:"Ei", amount:2, unit:"Stk"},
        {name:"Gouda", amount:30, unit:"g"},
        {name:"Avocado", amount:0.5, unit:"Stk"},
      ],
      instructions:"Rührei machen, mit Käse und Avocado in den Wrap rollen." },

    { name:"Overnight Oats to go", slot:"Frühstück", prep_min:5, servings:1,
      tags:["frühstück","meal-prep","schnell"],
      kcal:600, protein:30, carbs:80, fat:16,
      ingredients:[
        {name:"Haferflocken", amount:80, unit:"g"},
        {name:"Milch (vollfett)", amount:250, unit:"ml"},
        {name:"Magerquark", amount:100, unit:"g"},
        {name:"Honig", amount:15, unit:"g"},
        {name:"Beeren (TK)", amount:60, unit:"g"},
      ],
      instructions:"Am Abend alles ins Glas, über Nacht in den Kühlschrank. Morgens mitnehmen." },

    { name:"Brot mit Hüttenkäse", slot:"Frühstück", prep_min:5, servings:1, is_favorite:true,
      tags:["frühstück","schnell","high-protein"],
      kcal:550, protein:28, carbs:70, fat:12,
      ingredients:[
        {name:"Brot (Scheibe)", amount:3, unit:"Stk"},
        {name:"Hüttenkäse", amount:180, unit:"g"},
        {name:"Honig", amount:15, unit:"g"},
        {name:"Banane", amount:1, unit:"Stk"},
      ],
      instructions:"Dein gewohntes Frühstück, etwas aufgestockt. An miesen Morgen: halbe Portion + dazu einen Shake (geht leichter runter)." },

    { name:"Safran-Risotto mit Poulet", slot:"Mittag", prep_min:30, servings:1, is_favorite:true,
      tags:["reis","favorit"],
      kcal:900, protein:50, carbs:100, fat:30,
      ingredients:[
        {name:"Arborio-Reis (roh)", amount:90, unit:"g"},
        {name:"Hähnchenbrust", amount:180, unit:"g"},
        {name:"Parmesan", amount:20, unit:"g"},
        {name:"Butter", amount:15, unit:"g"},
        {name:"Safran", amount:1, unit:"Prise"},
      ],
      instructions:"Dein Clubrestaurant-Klassiker – geht auch daheim. Reis anschwitzen, mit Brühe + Safran cremig rühren, Poulet dazu, Parmesan/Butter unterheben." },

    { name:"Pasta mit Fleischstück", slot:"Abend", prep_min:25, servings:1, is_favorite:true,
      tags:["pasta"],
      kcal:900, protein:55, carbs:90, fat:32,
      ingredients:[
        {name:"Teigwaren (gekocht)", amount:300, unit:"g"},
        {name:"Rindsplätzli / Entrecôte", amount:180, unit:"g"},
        {name:"Olivenöl", amount:12, unit:"ml"},
        {name:"Passata/Tomatensauce", amount:100, unit:"g"},
      ],
      instructions:"Dein Standard-Abendessen. Fleischstück braten, Pasta mit etwas Sauce + Öl dazu." },

    { name:"Pre-Slot-Boost (koffeinfrei)", slot:"Snack 2", prep_min:3, servings:1,
      tags:["pre-training","schnell"],
      kcal:250, protein:3, carbs:58, fat:2,
      ingredients:[
        {name:"Banane", amount:1, unit:"Stk"},
        {name:"Datteln", amount:40, unit:"g"},
        {name:"Honig", amount:15, unit:"g"},
        {name:"Kreatin", amount:5, unit:"g"},
      ],
      instructions:"Vor dem 21:00-Slot STATT Energy Drink: schnelle Kohlenhydrate für Power, KEIN Koffein → schützt den Schlaf. Kreatin-Timing ist egal." },
  ],
};
