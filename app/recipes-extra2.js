/* =====================================================================
 *  Rezept-Bibliothek Teil 2 – Nischen: Mexikanisch, Italienisch,
 *  Frühstück-to-go, Post-Workout-schnell, Budget-Woche.
 *  Nach recipes-extra.js, vor store.js laden.
 * ===================================================================== */
(function () {
  const D = window.NUTRI_DATA;

  D.foods.push(
    { name:"Tortilla-Chips",        kcal:500, protein:7, carbs:60, fat:26, basis:"100g" },
    { name:"Tortellini (gekocht)",  kcal:170, protein:7, carbs:28, fat:4,  basis:"100g" },
    { name:"Linsen (gekocht)",      kcal:116, protein:9, carbs:20, fat:0.4,basis:"100g" },
    { name:"Salsa",                 kcal:40,  protein:1, carbs:8,  fat:0.3,basis:"100g" }
  );
  D.pantryQuickPick.push("Linsen","Tortilla-Chips","Salsa");

  const R = (name, slot, prep, kcal, p, c, f, tags, ingredients, instructions) =>
    ({ name, slot, prep_min: prep, servings: 1, tags, kcal, protein: p, carbs: c, fat: f, ingredients, instructions });
  const i = (name, amount, unit) => ({ name, amount, unit });

  D.recipes.push(
    // ===== Mexikanisch =====
    R("Quesadilla mit Poulet & Käse", "Mittag", 15, 800, 45, 65, 35, ["mexikanisch","wrap"],
      [i("Wrap/Tortilla",2,"Stk"),i("Hähnchenbrust",130,"g"),i("Gouda",60,"g"),i("Kidneybohnen (Dose)",60,"g")],
      "Wrap mit Poulet, Bohnen und Käse füllen, in der Pfanne knusprig braten, halbieren."),
    R("Rindstacos (3 Stück)", "Abend", 20, 850, 45, 70, 38, ["mexikanisch"],
      [i("Wrap/Tortilla",3,"Stk"),i("Rindshackfleisch",150,"g"),i("Gouda",40,"g"),i("Salsa",40,"g")],
      "Hack würzen und braten, in Tortillas mit Käse und Salsa füllen."),
    R("Chicken-Fajitas", "Abend", 25, 880, 50, 80, 32, ["mexikanisch","wrap"],
      [i("Wrap/Tortilla",2,"Stk"),i("Hähnchenbrust",180,"g"),i("Salsa",40,"g"),i("Gouda",40,"g")],
      "Poulet mit Paprika/Zwiebel scharf anbraten, in Wraps mit Käse und Salsa."),
    R("Nachos überbacken", "Snack 2", 20, 900, 35, 80, 48, ["mexikanisch","snack"],
      [i("Tortilla-Chips",100,"g"),i("Rindshackfleisch",120,"g"),i("Gouda",60,"g"),i("Kidneybohnen (Dose)",80,"g")],
      "Chips mit Hack, Bohnen und Käse überbacken, mit Salsa."),
    R("Burrito (gross)", "Mittag", 20, 950, 45, 105, 32, ["mexikanisch","wrap","reis"],
      [i("Wrap/Tortilla",1,"Stk"),i("Reis (gekocht)",150,"g"),i("Rindshackfleisch",130,"g"),i("Kidneybohnen (Dose)",60,"g"),i("Gouda",40,"g")],
      "Grosser Wrap mit Reis, Hack, Bohnen, Käse – fest einrollen."),
    R("Enchiladas (Meal-Prep)", "Abend", 45, 900, 50, 85, 38, ["mexikanisch","auflauf","meal-prep"],
      [i("Wrap/Tortilla",2,"Stk"),i("Rindshackfleisch",150,"g"),i("Passata/Tomatensauce",120,"g"),i("Gouda",60,"g")],
      "Gefüllte Wraps in die Form, mit Sauce + Käse überbacken."),

    // ===== Italienisch-Klassiker =====
    R("Spaghetti Bolognese", "Abend", 30, 900, 45, 95, 32, ["italienisch","pasta","meal-prep"],
      [i("Teigwaren (gekocht)",300,"g"),i("Rindshackfleisch",150,"g"),i("Passata/Tomatensauce",150,"g"),i("Parmesan",20,"g")],
      "Klassische Bolo lange köcheln, über Spaghetti, Parmesan drüber."),
    R("Lasagne", "Abend", 60, 950, 50, 85, 42, ["italienisch","auflauf","meal-prep"],
      [i("Rindshackfleisch",150,"g"),i("Passata/Tomatensauce",150,"g"),i("Rahm",100,"ml"),i("Gouda",60,"g")],
      "Schichten aus Bolo, Béchamel und Lasagneblättern, überbacken."),
    R("Penne Arrabbiata mit Poulet", "Mittag", 20, 850, 48, 90, 25, ["italienisch","pasta"],
      [i("Teigwaren (gekocht)",300,"g"),i("Hähnchenbrust",150,"g"),i("Passata/Tomatensauce",150,"g")],
      "Scharfe Tomatensauce mit Poulet, über Penne."),
    R("Gnocchi al Pomodoro", "Abend", 20, 800, 25, 100, 28, ["italienisch","kartoffel"],
      [i("Gnocchi (gekocht)",300,"g"),i("Passata/Tomatensauce",150,"g"),i("Mozzarella",60,"g"),i("Parmesan",15,"g")],
      "Gnocchi in Tomatensauce, mit Mozzarella und Parmesan."),
    R("Tortellini panna e prosciutto", "Mittag", 15, 900, 40, 85, 42, ["italienisch","pasta","schnell"],
      [i("Tortellini (gekocht)",250,"g"),i("Rahm",120,"ml"),i("Schinken",80,"g"),i("Parmesan",20,"g")],
      "Tortellini in Rahmsauce mit Schinken und Parmesan."),
    R("Piccata Milanese mit Spaghetti", "Abend", 30, 950, 55, 85, 40, ["italienisch","fleisch","pasta"],
      [i("Schnitzel (paniert)",180,"g"),i("Teigwaren (gekocht)",250,"g"),i("Passata/Tomatensauce",120,"g"),i("Parmesan",20,"g")],
      "Poulet/Kalb in Ei-Parmesan-Panade braten, mit Spaghetti in Tomatensauce."),
    R("Risotto mit Poulet & Erbsen", "Mittag", 30, 880, 48, 100, 26, ["italienisch","reis"],
      [i("Arborio-Reis (roh)",90,"g"),i("Hähnchenbrust",150,"g"),i("Parmesan",20,"g"),i("Butter",15,"g")],
      "Risotto cremig rühren, Poulet und Erbsen dazu."),

    // ===== Frühstück-to-go =====
    R("Frühstücks-Shake to-go", "Frühstück", 3, 550, 35, 65, 14, ["frühstück","to-go","shake","schnell","kein-appetit"],
      [i("Milch (vollfett)",350,"ml"),i("Haferflocken",50,"g"),i("Whey Protein (Portion)",1,"Stk"),i("Banane",1,"Stk")],
      "Mixen, in die Flasche – ideal für den appetitlosen Morgen unterwegs."),
    R("Protein-Muffins (Meal-Prep)", "Frühstück", 30, 300, 18, 30, 12, ["frühstück","to-go","meal-prep","snack"],
      [i("Haferflocken",40,"g"),i("Whey Protein (Portion)",0.5,"Stk"),i("Ei",1,"Stk"),i("Banane",0.5,"Stk")],
      "Teig in Muffinform, ~20 Min backen. Werte je Muffin – Vorrat für die Woche."),
    R("Egg-Wrap to-go", "Frühstück", 8, 500, 28, 35, 26, ["frühstück","to-go","wrap","schnell"],
      [i("Wrap/Tortilla",1,"Stk"),i("Ei",3,"Stk"),i("Gouda",30,"g")],
      "Rührei mit Käse in den Wrap, einrollen, mitnehmen."),
    R("Skyr-Becher mit Granola (to-go)", "Frühstück", 3, 450, 30, 55, 10, ["frühstück","to-go","snack","schnell","high-protein"],
      [i("Skyr",250,"g"),i("Granola",50,"g"),i("Honig",15,"g")],
      "Skyr, Granola und Honig in einen Becher schichten."),
    R("Overnight Oats Apfel-Zimt", "Frühstück", 5, 600, 25, 85, 15, ["frühstück","to-go","meal-prep"],
      [i("Haferflocken",80,"g"),i("Milch (vollfett)",250,"ml"),i("Griechischer Joghurt",80,"g"),i("Apfel",1,"Stk")],
      "Abends anrühren mit Zimt, morgens direkt mitnehmen."),

    // ===== Post-Workout schnell =====
    R("Reis + Poulet + Soja (10 Min)", "Mittag", 10, 750, 50, 90, 15, ["post-workout","reis","schnell","high-protein"],
      [i("Reis (gekocht)",300,"g"),i("Hähnchenbrust",150,"g"),i("Sojasauce",20,"ml")],
      "Vorgekochten Reis + Poulet in der Pfanne, Sojasauce – in 10 Min essfertig."),
    R("Schneller Recovery-Shake", "Shake", 3, 450, 40, 50, 8, ["post-workout","shake","schnell","high-protein","kein-appetit"],
      [i("Milch (vollfett)",300,"ml"),i("Whey Protein (Portion)",2,"Stk"),i("Banane",1,"Stk"),i("Honig",10,"g")],
      "Direkt nach dem Training: viel Protein + schnelle Kohlenhydrate."),
    R("Bagel mit Ei & Käse", "Snack 1", 8, 550, 28, 50, 26, ["post-workout","snack","schnell"],
      [i("Bagel",1,"Stk"),i("Ei",2,"Stk"),i("Gouda",30,"g")],
      "Bagel toasten, mit Spiegelei und Käse belegen."),
    R("Quark + Honig + Oats (2 Min)", "Snack 2", 2, 450, 35, 55, 8, ["post-workout","snack","schnell","high-protein"],
      [i("Magerquark",250,"g"),i("Honig",15,"g"),i("Haferflocken",40,"g"),i("Banane",1,"Stk")],
      "Alles verrühren – der schnellste Protein-Snack überhaupt."),
    R("Thunfisch-Reis-Box (schnell)", "Mittag", 8, 700, 45, 85, 15, ["post-workout","reis","schnell","günstig","fisch"],
      [i("Reis (gekocht)",280,"g"),i("Thunfisch (Dose)",120,"g"),i("Mais (Dose)",60,"g")],
      "Reis, Thunfisch, Mais mischen – kalt oder warm, perfekt als Box."),

    // ===== Budget-Woche (günstig) =====
    R("Eier-Reis (günstig)", "Abend", 15, 700, 30, 90, 22, ["budget","günstig","reis","schnell"],
      [i("Reis (gekocht)",300,"g"),i("Ei",3,"Stk"),i("Sojasauce",20,"ml"),i("Mais (Dose)",60,"g")],
      "Gebratener Reis mit Ei – super günstig und schnell."),
    R("Linsen-Reis (Dal-Style)", "Abend", 25, 750, 35, 110, 12, ["budget","günstig","reis","meal-prep"],
      [i("Linsen (gekocht)",150,"g"),i("Reis (gekocht)",200,"g"),i("Passata/Tomatensauce",80,"g")],
      "Linsen mit Gewürzen und Tomaten, dazu Reis. Billig, sättigend, prep-bar."),
    R("Haferflocken-Bulk (Porridge XL)", "Frühstück", 8, 700, 30, 100, 18, ["budget","günstig","frühstück"],
      [i("Haferflocken",120,"g"),i("Milch (vollfett)",400,"ml"),i("Banane",1,"Stk"),i("Honig",15,"g")],
      "Grosse Portion Porridge – die günstigste Kalorienquelle."),
    R("Pasta mit Tomatensauce & Ei", "Abend", 15, 750, 28, 100, 22, ["budget","günstig","pasta","schnell"],
      [i("Teigwaren (gekocht)",300,"g"),i("Passata/Tomatensauce",150,"g"),i("Ei",2,"Stk"),i("Olivenöl",10,"ml")],
      "Pasta mit Tomatensauce, ein/zwei Eier untermischen – Studentenklassiker."),
    R("Kartoffeln mit Hackfleisch (günstig)", "Abend", 30, 800, 40, 75, 35, ["budget","günstig","kartoffel","meal-prep"],
      [i("Kartoffeln",400,"g"),i("Rindshackfleisch",150,"g"),i("Olivenöl",10,"ml")],
      "Bratkartoffeln mit Hackfleisch – günstig und macht satt."),
    R("Brot mit Ei & Käse (günstig)", "Snack 1", 8, 500, 25, 40, 26, ["budget","günstig","snack","schnell"],
      [i("Brot (Scheibe)",3,"Stk"),i("Ei",2,"Stk"),i("Gouda",40,"g")],
      "Spiegelei auf Brot mit Käse – schnell, billig, proteinreich.")
  );
})();
