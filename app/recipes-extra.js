/* =====================================================================
 *  Erweiterte Rezept-Bibliothek – viele Kategorien für grosse Auswahl.
 *  Ergänzt NUTRI_DATA (muss NACH data.js, VOR store.js geladen werden).
 *  Alle Werte pro Portion, editierbar. Makros sind solide Schätzungen.
 * ===================================================================== */
(function () {
  const D = window.NUTRI_DATA;

  // ---- zusätzliche Lebensmittel ----
  D.foods.push(
    { name:"Schinken",            kcal:145, protein:21, carbs:1,  fat:6,  basis:"100g" },
    { name:"Räucherlachs",        kcal:180, protein:22, carbs:0,  fat:10, basis:"100g" },
    { name:"Pouletschenkel",      kcal:210, protein:24, carbs:0,  fat:13, basis:"100g" },
    { name:"Schnitzel (paniert)", kcal:250, protein:20, carbs:12, fat:14, basis:"100g" },
    { name:"Gnocchi (gekocht)",   kcal:150, protein:4,  carbs:30, fat:2,  basis:"100g" },
    { name:"Pommes (Ofen)",       kcal:190, protein:3,  carbs:28, fat:8,  basis:"100g" },
    { name:"Kokosmilch",          kcal:200, protein:2,  carbs:3,  fat:20, basis:"100ml" },
    { name:"Kidneybohnen (Dose)", kcal:110, protein:8,  carbs:16, fat:0.5,basis:"100g" },
    { name:"Müesli",              kcal:400, protein:9,  carbs:65, fat:10, basis:"100g" },
    { name:"Grieß",               kcal:350, protein:12, carbs:70, fat:1,  basis:"100g" },
    { name:"Milchreis (roh)",     kcal:350, protein:7,  carbs:78, fat:1,  basis:"100g" },
    { name:"Mango",               kcal:60,  protein:0.8,carbs:15, fat:0.4,basis:"100g" },
    { name:"Bagel",               kcal:250, protein:10, carbs:48, fat:1.5,basis:"Stk" },
    { name:"Fladenbrot/Pita",     kcal:250, protein:8,  carbs:45, fat:3,  basis:"Stk" }
  );
  D.pantryQuickPick.push("Schinken","Gnocchi","Pommes (TK)","Müesli","Räucherlachs");

  const R = (name, slot, prep, kcal, p, c, f, tags, ingredients, instructions) =>
    ({ name, slot, prep_min: prep, servings: 1, tags, kcal, protein: p, carbs: c, fat: f, ingredients, instructions });
  const i = (name, amount, unit) => ({ name, amount, unit });

  D.recipes.push(
    // ===== Wraps & Sandwiches =====
    R("Poulet-Wrap", "Mittag", 15, 700, 45, 65, 25, ["wrap","schnell","high-protein"],
      [i("Wrap/Tortilla",1,"Stk"),i("Hähnchenbrust",150,"g"),i("Gouda",30,"g"),i("Frischkäse",30,"g")],
      "Poulet braten, mit Käse und etwas Sauce in den Wrap rollen."),
    R("Thunfisch-Wrap", "Mittag", 10, 650, 40, 60, 22, ["wrap","schnell","günstig","fisch"],
      [i("Wrap/Tortilla",1,"Stk"),i("Thunfisch (Dose)",120,"g"),i("Mais (Dose)",60,"g"),i("Frischkäse",30,"g")],
      "Thunfisch mit Mais und Frischkäse mischen, einrollen."),
    R("Steak-Sandwich", "Mittag", 20, 800, 45, 70, 32, ["sandwich","fleisch"],
      [i("Brot (Scheibe)",3,"Stk"),i("Rindssteak",150,"g"),i("Gouda",30,"g"),i("Avocado",0.5,"Stk")],
      "Steak in Streifen, mit Käse und Avocado zwischen Brot."),
    R("Croque (Käse-Schinken-Toast)", "Snack 1", 12, 600, 30, 45, 32, ["sandwich","snack","schnell"],
      [i("Brot (Scheibe)",4,"Stk"),i("Schinken",60,"g"),i("Gouda",60,"g"),i("Butter",10,"g")],
      "Belegen, in der Pfanne/im Ofen goldbraun überbacken."),
    R("Bagel mit Frischkäse & Lachs", "Frühstück", 10, 600, 35, 55, 26, ["frühstück","fisch"],
      [i("Bagel",1,"Stk"),i("Frischkäse",40,"g"),i("Räucherlachs",80,"g")],
      "Bagel toasten, Frischkäse und Lachs drauf."),

    // ===== Asia / Curry =====
    R("Chicken-Curry mit Reis", "Abend", 30, 900, 50, 100, 28, ["asia","curry","reis"],
      [i("Reis (gekocht)",300,"g"),i("Hähnchenbrust",180,"g"),i("Kokosmilch",100,"ml"),i("Currypaste",20,"g")],
      "Poulet anbraten, Currypaste + Kokosmilch dazu, köcheln, Reis servieren."),
    R("Bami-Nudeln mit Rind", "Abend", 25, 900, 45, 95, 32, ["asia","fleisch"],
      [i("Eiernudeln (gekocht)",300,"g"),i("Rindssteak",150,"g"),i("Sojasauce",25,"ml"),i("Ei",1,"Stk")],
      "Nudeln mit Rind, Ei und Sojasauce in der Pfanne schwenken."),
    R("Reispfanne mit Poulet & Ei", "Mittag", 20, 850, 45, 95, 25, ["asia","reis","meal-prep"],
      [i("Reis (gekocht)",300,"g"),i("Hähnchenbrust",120,"g"),i("Ei",2,"Stk"),i("Sojasauce",20,"ml")],
      "Gebratener Reis mit Poulet, Ei, Sojasauce – Reste-Klassiker."),
    R("Thai-Basilikum-Hack mit Reis", "Abend", 20, 880, 45, 95, 30, ["asia","reis"],
      [i("Reis (gekocht)",300,"g"),i("Rindshackfleisch",150,"g"),i("Sojasauce",20,"ml"),i("Ei",1,"Stk")],
      "Hack scharf anbraten, mit Sojasauce, dazu Reis und Spiegelei."),

    // ===== Bowls =====
    R("Burrito-Bowl", "Mittag", 25, 950, 50, 100, 32, ["bowl","reis","meal-prep"],
      [i("Reis (gekocht)",250,"g"),i("Rindshackfleisch",150,"g"),i("Kidneybohnen (Dose)",80,"g"),i("Gouda",40,"g"),i("Mais (Dose)",60,"g")],
      "Reis, gewürztes Hack, Bohnen, Mais und Käse schichten."),
    R("Poke-Bowl (Lachs)", "Mittag", 20, 850, 42, 95, 28, ["bowl","reis","lachs","fisch"],
      [i("Reis (gekocht)",280,"g"),i("Lachs",150,"g"),i("Avocado",0.5,"Stk"),i("Sojasauce",20,"ml")],
      "Reis mit rohem/gebratenem Lachs, Avocado, Sojasauce."),

    // ===== Kartoffel =====
    R("Gnocchi mit Poulet & Rahm", "Abend", 20, 950, 45, 100, 38, ["kartoffel"],
      [i("Gnocchi (gekocht)",300,"g"),i("Hähnchenbrust",150,"g"),i("Rahm",100,"ml"),i("Parmesan",20,"g")],
      "Gnocchi anbraten, Poulet + Rahm dazu, Parmesan drüber."),
    R("Rösti mit Ei & Käse", "Abend", 25, 750, 25, 70, 40, ["kartoffel","frühstück"],
      [i("Kartoffeln",350,"g"),i("Ei",2,"Stk"),i("Gouda",40,"g"),i("Butter",15,"g")],
      "Rösti in Butter knusprig braten, mit Spiegelei und Käse."),
    R("Kartoffelstock mit Hackbällchen", "Abend", 30, 900, 50, 80, 38, ["kartoffel","fleisch"],
      [i("Kartoffeln",400,"g"),i("Rindshackfleisch",150,"g"),i("Milch (vollfett)",80,"ml"),i("Butter",15,"g")],
      "Kartoffelstock stampfen, Hackbällchen dazu."),
    R("Ofen-Pommes mit Chicken", "Abend", 30, 900, 50, 90, 35, ["kartoffel","einfach"],
      [i("Pommes (Ofen)",300,"g"),i("Hähnchenbrust",180,"g"),i("Olivenöl",10,"ml")],
      "Pommes und Poulet im Ofen – schnell und sättigend."),

    // ===== Auflauf / Ofen =====
    R("Pasta-Auflauf (Hack & Käse)", "Abend", 40, 950, 50, 90, 40, ["auflauf","pasta","meal-prep"],
      [i("Teigwaren (gekocht)",250,"g"),i("Rindshackfleisch",150,"g"),i("Passata/Tomatensauce",150,"g"),i("Gouda",60,"g")],
      "Pasta + Hack + Sauce in Form, Käse drüber, überbacken."),
    R("Kartoffel-Hack-Auflauf", "Abend", 45, 900, 45, 80, 40, ["auflauf","kartoffel","meal-prep"],
      [i("Kartoffeln",400,"g"),i("Rindshackfleisch",150,"g"),i("Rahm",100,"ml"),i("Gouda",50,"g")],
      "Kartoffelscheiben mit Hack schichten, Rahm + Käse, überbacken."),
    R("Lachs-Auflauf mit Kartoffeln", "Abend", 40, 880, 45, 75, 40, ["auflauf","lachs","fisch"],
      [i("Kartoffeln",350,"g"),i("Lachs",150,"g"),i("Rahm",100,"ml"),i("Gouda",40,"g")],
      "Kartoffeln + Lachs, Rahm drüber, mit Käse überbacken."),

    // ===== Fleisch =====
    R("Pouletschenkel mit Reis", "Abend", 35, 900, 55, 85, 32, ["fleisch","reis"],
      [i("Reis (gekocht)",300,"g"),i("Pouletschenkel",250,"g"),i("Olivenöl",10,"ml")],
      "Schenkel im Ofen knusprig, dazu Reis."),
    R("Schnitzel mit Pommes", "Abend", 30, 1000, 50, 95, 42, ["fleisch","kartoffel"],
      [i("Schnitzel (paniert)",180,"g"),i("Pommes (Ofen)",300,"g")],
      "Schnitzel braten, Pommes aus dem Ofen."),
    R("Hackbraten mit Kartoffeln", "Abend", 45, 900, 50, 70, 42, ["fleisch","kartoffel","meal-prep"],
      [i("Rindshackfleisch",200,"g"),i("Kartoffeln",350,"g"),i("Ei",1,"Stk")],
      "Hackbraten formen, im Ofen backen, dazu Kartoffeln."),
    R("Döner-Teller (homemade)", "Abend", 25, 900, 55, 70, 40, ["fleisch","schnell"],
      [i("Hähnchenbrust",200,"g"),i("Fladenbrot/Pita",1,"Stk"),i("Griechischer Joghurt",80,"g")],
      "Poulet würzen und braten, mit Fladenbrot und Joghurtsauce."),

    // ===== Fisch =====
    R("Fischknusperli mit Kartoffelstock", "Abend", 25, 850, 40, 80, 35, ["fisch","kartoffel"],
      [i("Lachs",180,"g"),i("Kartoffeln",350,"g"),i("Butter",15,"g")],
      "Panierten Fisch braten, dazu cremiger Kartoffelstock."),
    R("Thunfisch-Reis (schnell)", "Mittag", 12, 750, 45, 90, 18, ["fisch","reis","schnell","günstig"],
      [i("Reis (gekocht)",300,"g"),i("Thunfisch (Dose)",120,"g"),i("Mais (Dose)",60,"g"),i("Olivenöl",10,"ml")],
      "Reis mit Thunfisch, Mais und Öl mischen – in 12 Min fertig."),

    // ===== Pizza =====
    R("Protein-Pizza (Poulet)", "Abend", 30, 950, 55, 90, 35, ["pizza"],
      [i("Fladenbrot/Pita",1,"Stk"),i("Passata/Tomatensauce",80,"g"),i("Mozzarella",80,"g"),i("Hähnchenbrust",120,"g")],
      "Fladen/Teig mit Sauce, Käse, Poulet belegen und backen."),

    // ===== Frühstück extra =====
    R("French Toast", "Frühstück", 15, 650, 28, 70, 28, ["frühstück"],
      [i("Brot (Scheibe)",3,"Stk"),i("Ei",2,"Stk"),i("Milch (vollfett)",100,"ml"),i("Honig",15,"g")],
      "Brot in Ei-Milch tunken, goldbraun braten, mit Honig."),
    R("Bircher-Müesli", "Frühstück", 5, 550, 20, 80, 16, ["frühstück","meal-prep"],
      [i("Haferflocken",70,"g"),i("Griechischer Joghurt",150,"g"),i("Apfel",1,"Stk"),i("Mandeln",20,"g")],
      "Am Vorabend Haferflocken mit Joghurt/Milch, Apfel + Nüsse einweichen."),
    R("Müesli mit Milch & Banane", "Frühstück", 3, 600, 22, 90, 16, ["frühstück","schnell"],
      [i("Müesli",90,"g"),i("Milch (vollfett)",300,"ml"),i("Banane",1,"Stk")],
      "Müesli mit Milch und Bananenscheiben – 3 Minuten."),
    R("Grießbrei mit Honig", "Frühstück", 10, 600, 22, 95, 14, ["frühstück"],
      [i("Grieß",80,"g"),i("Milch (vollfett)",400,"ml"),i("Honig",20,"g")],
      "Grieß in Milch einkochen, mit Honig süssen."),
    R("Egg-Muffins (Meal-Prep)", "Snack 1", 25, 400, 30, 6, 28, ["frühstück","snack","meal-prep","high-protein"],
      [i("Ei",6,"Stk"),i("Gouda",50,"g"),i("Schinken",60,"g")],
      "Ei mit Käse/Schinken in Muffinform, ~20 Min backen. Werte je ~halbe Form."),
    R("Overnight Oats Schoko-PB", "Frühstück", 5, 650, 32, 75, 22, ["frühstück","meal-prep"],
      [i("Haferflocken",80,"g"),i("Milch (vollfett)",250,"ml"),i("Whey Protein (Portion)",1,"Stk"),i("Erdnussbutter",15,"g")],
      "Abends anrühren (mit Kakao), morgens direkt löffeln."),

    // ===== Snacks extra =====
    R("Studentenfutter", "Snack 1", 2, 400, 10, 35, 26, ["snack","schnell"],
      [i("Mandeln",30,"g"),i("Cashew",20,"g"),i("Datteln",30,"g")],
      "Nüsse + Trockenfrüchte mischen – Kalorien für unterwegs."),
    R("Hüttenkäse-Toast", "Snack 1", 5, 450, 28, 45, 15, ["snack","high-protein","schnell"],
      [i("Brot (Scheibe)",2,"Stk"),i("Hüttenkäse",150,"g"),i("Honig",15,"g")],
      "Toast mit Hüttenkäse und Honig – schnell und proteinreich."),
    R("Quark mit Nüssen & Honig", "Snack 2", 3, 450, 35, 30, 20, ["snack","high-protein","schnell"],
      [i("Magerquark",250,"g"),i("Mandeln",25,"g"),i("Honig",15,"g")],
      "Quark mit Nüssen und Honig verrühren."),
    R("Protein-Riegel (selfmade)", "Snack 2", 15, 250, 15, 25, 10, ["snack","meal-prep","high-protein"],
      [i("Haferflocken",30,"g"),i("Whey Protein (Portion)",0.5,"Stk"),i("Erdnussbutter",15,"g"),i("Honig",10,"g")],
      "Masse kneten, in Form pressen, kühlen, schneiden. Werte je Riegel."),

    // ===== Shakes extra =====
    R("Vanille-Hafer-Shake", "Shake", 3, 600, 35, 70, 16, ["shake","flüssig","kein-appetit"],
      [i("Milch (vollfett)",400,"ml"),i("Haferflocken",50,"g"),i("Whey Protein (Portion)",1,"Stk"),i("Banane",1,"Stk")],
      "Alles mixen – sättigender Kalorien-Shake."),
    R("Beeren-Skyr-Smoothie", "Shake", 3, 400, 30, 50, 6, ["shake","high-protein","kein-appetit"],
      [i("Skyr",200,"g"),i("Milch (vollfett)",200,"ml"),i("Beeren (TK)",100,"g"),i("Honig",15,"g")],
      "Mixen – leicht und proteinreich."),
    R("Mango-Hafer-Shake", "Shake", 3, 550, 30, 80, 12, ["shake","flüssig","kein-appetit"],
      [i("Milch (vollfett)",350,"ml"),i("Mango",120,"g"),i("Haferflocken",40,"g"),i("Whey Protein (Portion)",1,"Stk")],
      "Fruchtig-sättigend – gut für miese Appetit-Tage."),
    R("Kaffee-Protein-Shake", "Shake", 3, 350, 30, 25, 12, ["shake","high-protein"],
      [i("Milch (vollfett)",300,"ml"),i("Whey Protein (Portion)",1,"Stk"),i("Banane",1,"Stk")],
      "Mit kaltem Kaffee mixen. ⚠️ Enthält Koffein – nur morgens/früh, NICHT vor dem Abend-Slot."),

    // ===== Eintopf / Klassiker =====
    R("Chili con Carne mit Reis", "Abend", 40, 900, 50, 95, 28, ["eintopf","reis","meal-prep"],
      [i("Rindshackfleisch",150,"g"),i("Kidneybohnen (Dose)",120,"g"),i("Passata/Tomatensauce",150,"g"),i("Reis (gekocht)",200,"g")],
      "Hack + Bohnen + Passata köcheln, mit Reis. Ideal zum Vorkochen."),
    R("Ghackets mit Hörnli", "Abend", 25, 900, 45, 90, 35, ["eintopf","pasta","meal-prep"],
      [i("Teigwaren (gekocht)",250,"g"),i("Rindshackfleisch",150,"g"),i("Passata/Tomatensauce",80,"g"),i("Gouda",30,"g")],
      "Schweizer Klassiker: Hörnli + Hackfleisch, dazu Apfelmus."),
    R("Linseneintopf mit Wurst", "Abend", 30, 800, 40, 80, 30, ["eintopf","meal-prep"],
      [i("Kidneybohnen (Dose)",120,"g"),i("Kartoffeln",250,"g"),i("Schinken",100,"g")],
      "Deftiger Eintopf mit Linsen/Bohnen, Kartoffeln und Wurst/Schinken."),

    // ===== Dessert / High-Cal =====
    R("Milchreis mit Zimt & Zucker", "Snack 2", 25, 600, 18, 100, 12, ["dessert"],
      [i("Milchreis (roh)",90,"g"),i("Milch (vollfett)",500,"ml"),i("Honig",20,"g")],
      "Milchreis in Milch weich kochen, mit Zimt/Honig."),
    R("Quark-Dessert mit Beeren", "Snack 2", 5, 400, 35, 40, 8, ["dessert","high-protein","schnell"],
      [i("Magerquark",250,"g"),i("Beeren (TK)",100,"g"),i("Honig",15,"g")],
      "Quark mit Beeren und Honig – süss, aber proteinreich.")
  );
})();
