/**
 * ═══════════════════════════════════════════════════
 * NIVELLMEDICAL AG — Shared Site Integration
 * nivell-site.js · Version 5.0 · Mai 2026
 * Smart Assistant · KB + AI · Promo-Codes · Navigation
 * ═══════════════════════════════════════════════════
 */

// ── ASSISTANT API ENDPOINT ──
// Set to '/api/chat' (or '/.netlify/functions/chat') when backend is deployed
// When unreachable, the system falls back to the local KB below
const NIVELL_CHAT_API = '/.netlify/functions/chat';
const NIVELL_CHAT_API_TIMEOUT_MS = 8000;

// ── EXPANDED KNOWLEDGE BASE — Smart Fallback ──
// Topics cover: products, prices, clinical indications, treatment workflow,
// patient questions, complications, edge cases. Multilingual (DE primary, EN secondary).
const NIVELLIPSO_KNOWLEDGE = [
 // ═══ PREISE & ANGEBOTE ═══
 { keywords: ['preis','kosten','chf','gebühr','gebuehr','tarif','price','cost','wie teuer','kostet'],
   de:"Unsere Preise (gültig ab 01.07.2026, exkl. MWSt.):\n\n• Single Arch: CHF 710 – CHF 1'380\n• Dual Arch: CHF 1'100 – CHF 2'100 (Premium)\n• Touch-Up: CHF 470 / CHF 650\n• Retainer: ab CHF 140\n\nMit persönlichem Promo-Code aus dem Honor & Reward Programm zusätzlich vergünstigt. Details: albin.brkic@nivellipso.com",
   en: "Our prices (valid from 01.07.2026, excl. VAT):\n\n• Single Arch: CHF 710 – CHF 1'380\n• Dual Arch: CHF 1'100 – CHF 2'100 (Premium)\n• Touch-Up: CHF 470 / CHF 650\n• Retainer: from CHF 140\n\nAdditional discounts with your personal Promo Code from the Honor & Reward Program. Details: albin.brkic@nivellipso.com" },
 { keywords: ['promo','rabatt','discount','code','honor','reward','bonus','punkte','st tropez','reise','incentive'],
   de:"Das nivellipso® Honor & Reward Programm:\n\n• Jeder aktive Nivellipso-Arzt erhält einen persönlichen Promo-Code\n• Discount bis −25% auf Schienen-Bestellungen\n• Brackets mit bis −30% für Nivellipso-Mitglieder\n• Anniversary-Boni und Volume-Rewards\n• Top-Tier: Incentive-Reise (z.B. St. Tropez)\n\nIhr persönlicher Code: albin.brkic@nivellipso.com anfragen.",
   en: "The nivellipso® Honor & Reward Program:\n\n• Every active Nivellipso doctor receives a personal Promo Code\n• Discount up to −25% on aligner orders\n• Brackets with up to −30% for Nivellipso members\n• Anniversary bonuses and Volume Rewards\n• Top-Tier: incentive travel (e.g. St. Tropez)\n\nYour personal code: contact albin.brkic@nivellipso.com" },
 { keywords: ['loyalität','loyalty','treue','jahresbonus','jahrestreue','10%'],
   de:"Loyalty-Programm — einfach gehalten:\n\nAb einem Jahr als Nivellipso-Kunde erhalten Sie automatisch 10% Rabatt auf jede Bestellung ab CHF 650. Keine Tier-Pyramiden, keine Punkte. Weitere Aktionen via Newsletter.\n\nLoyalität zahlt sich aus.",
   en: "Loyalty Program — kept simple:\n\nAfter one year as a Nivellipso customer, you automatically receive a 10% discount on every order over CHF 650. No tier pyramids, no points. More offers via newsletter.\n\nLoyalty pays off." },

 // ═══ DAS SYSTEM ═══
 { keywords: ['soft','regular','intense','phase','system','three','3-aligner','drei aligner','drei schienen','3-schienen','three-aligner','three-schienen'],
   de:"Das nivellipso® Three-Schienen-System hat drei Phasen:\n\n• SOFT: Sanfter Behandlungsstart, Gewebeanpassung (Phase 01)\n• REGULAR: Aktive Zahnbewegung, optimale Balance (Phase 02)\n• INTENSE: Finale Stabilisierung, keine Rezidive (Phase 03)\n\nDrei differenzierte Materialien pro Stufe (Wandstärken 0,50/0,65/0,75 mm). Biomechanisch überlegen, klinisch validiert.",
   en: "The nivellipso® Three-Aligner System has three phases:\n\n• SOFT: Gentle treatment start, tissue adaptation (Phase 01)\n• REGULAR: Active tooth movement, optimal balance (Phase 02)\n• INTENSE: Final stabilization, no relapse (Phase 03)\n\nThree differentiated materials per stage (wall thicknesses 0.50/0.65/0.75 mm). Biomechanically superior, clinically validated." },
 { keywords: ['material','pet-g','pet g','kunststoff','biokompatibel','wandstärke','wandstaerke','stärke','staerke','0.75','0.85','1.0'],
   de:"Material:\n\n• Biokompatibles PET-G (medizinisch zugelassen)\n• Drei Wandstärken pro Stufe: 0,50 mm · 0,65 mm · 0,75 mm\n• Klar, geruchsneutral, BPA-frei\n• Hergestellt in der Schweiz\n• Vollständige Rückverfolgbarkeit jeder Charge\n\nMaterialwahl erfolgt phasenbasiert für optimale Kraft-Komfort-Balance.",
   en: "Material:\n\n• Biocompatible PET-G (medically approved)\n• Three wall thicknesses per stage: 0.50 mm · 0.65 mm · 0.75 mm\n• Clear, odor-neutral, BPA-free\n• Made in Switzerland\n• Full traceability of every batch\n\nMaterial selection is phase-based for optimal force-comfort balance." },
 { keywords: ['single','einzel','einfach','simple','einfache fälle','einfache faelle'],
   de:"Single-Schiene für einfache Fälle:\n\nFür leichte Korrekturen, finale Feineinstellungen oder Touch-Ups nach Rezidiven steht unser Single-Schienen-System zur Verfügung. Auf Anfrage planbar.\n\nKlinische Empfehlung für Standardfälle bleibt das Three-Schienen-System wegen der überlegenen Biomechanik.",
   en: "Single Aligner for simple cases:\n\nFor minor corrections, final fine adjustments, or Touch-Ups after relapse, our single aligner system is available. Plannable on request.\n\nClinical recommendation for standard cases remains the Three-Aligner System due to superior biomechanics." },

 // ═══ INDIKATIONEN ═══
 { keywords: ['indikation','wann','geeignet','wofür','wofuer','indication','case selection','fallselektion'],
   de:"Indikationen für nivellipso® Schienen:\n\n• Leichter bis mittelschwerer Engstand (Crowding)\n• Lückenschluss (Spacing)\n• Klasse-I-Korrekturen\n• Tiefbiss-Reduktion bis moderate Grade\n• Post-orthodontische Retention\n• Ästhetische Frontzahnkorrekturen\n\nGrenzen: ausgeprägte skelettale Diskrepanzen, schwere Klasse II/III Fälle — hier empfiehlt sich Brackets oder kombinierte Therapie.",
   en: "Indications for nivellipso® aligners:\n\n• Mild to moderate crowding\n• Space closure (spacing)\n• Class I corrections\n• Deep bite reduction up to moderate levels\n• Post-orthodontic retention\n• Aesthetic anterior tooth corrections\n\nLimitations: pronounced skeletal discrepancies, severe Class II/III cases — here brackets or combined therapy is recommended." },
 { keywords: ['klasse i','klasse 1','class i','class 1'],
   de:"Klasse-I-Fälle:\n\nDas Three-Schienen-System ist ideal für Klasse-I-Korrekturen — Engstand, Spacing, leichte Rotationen, Niveauausgleich. Vorhersehbare Ergebnisse mit klinisch validierter Biomechanik.",
   en: "Class I cases:\n\nThe Three-Aligner System is ideal for Class I corrections — crowding, spacing, mild rotations, level equalization. Predictable results with clinically validated biomechanics." },
 { keywords: ['klasse ii','klasse 2','class ii','overjet','distalbiss'],
   de:"Klasse-II-Fälle:\n\nLeichte bis moderate Klasse-II-Korrekturen sind mit nivellipso® machbar (mit Attachments, ggf. Elastics). Bei ausgeprägter skelettaler Klasse II empfehlen wir Brackets-Therapie oder Kombinationsbehandlung.\n\nWir beraten Sie gerne im Einzelfall: albin.brkic@nivellipso.com",
   en: "Class II cases:\n\nMild to moderate Class II corrections are possible with nivellipso® (with attachments, possibly elastics). For pronounced skeletal Class II, we recommend bracket therapy or combination treatment.\n\nWe are happy to advise on individual cases: albin.brkic@nivellipso.com" },
 { keywords: ['klasse iii','klasse 3','class iii','mesialbiss','progenie'],
   de:"Klasse-III-Fälle:\n\nLeichte dentoalveoläre Klasse-III-Korrekturen sind aligner-basiert möglich. Bei skelettaler Klasse III ist eine chirurgisch-kombinierte Behandlung oft erforderlich.\n\nIndividuelle Falleinschätzung gerne via albin.brkic@nivellipso.com",
   en: "Class III cases:\n\nMild dentoalveolar Class III corrections are possible with aligners. For skeletal Class III, a surgically combined treatment is often required.\n\nIndividual case assessment gladly provided via albin.brkic@nivellipso.com" },
 { keywords: ['engstand','crowding','platzmangel'],
   de:"Engstand (Crowding):\n\nLeichter bis mittelschwerer Engstand (bis ~5 mm pro Kiefer) ist ein klassischer Schienen-Fall. Bei ausgeprägtem Engstand >5 mm kann eine IPR (interproximale Reduktion) oder Extraktion erforderlich werden — wird im Treatment-Plan vorgeschlagen.",
   en: "Crowding:\n\nMild to moderate crowding (up to ~5 mm per jaw) is a classic aligner case. With severe crowding >5 mm, IPR (interproximal reduction) or extraction may be required — suggested in the treatment plan." },
 { keywords: ['lücke','luecke','spacing','spalt','diastema','lückenschluss','lueckenschluss'],
   de:"Lückenschluss (Spacing/Diastema):\n\nKlassische Indikation für nivellipso® Schienen. Diastema mediale oder generelles Spacing lassen sich vorhersehbar schließen. Attachments unterstützen die Bewegung bei Bedarf.",
   en: "Space closure (Spacing/Diastema):\n\nClassic indication for nivellipso® aligners. Midline diastema or general spacing can be predictably closed. Attachments support the movement when needed." },
 { keywords: ['tiefbiss','deep bite','deepbite','overbite'],
   de:"Tiefbiss (Deep Bite):\n\nLeichte bis mittlere Tiefbisse lassen sich aligner-basiert reduzieren (Bite Ramps, Intrusion der Frontzähne). Schwere Tiefbisse mit skelettaler Komponente erfordern oft kombinierte Therapie.",
   en: "Deep Bite:\n\nMild to moderate deep bites can be reduced with aligners (bite ramps, intrusion of anterior teeth). Severe deep bites with a skeletal component often require combined therapy." },
 { keywords: ['kreuzbiss','crossbite','seitlicher kreuzbiss','frontaler kreuzbiss'],
   de:"Kreuzbiss (Crossbite):\n\nDentoalveolärer Kreuzbiss ist mit nivellipso® korrigierbar — die Schiene expandiert in der gewünschten Ebene. Bei skelettalem Kreuzbiss ist evtl. eine Gaumennahterweiterung vorab nötig.\n\nDetails im individuellen Treatment-Plan.",
   en: "Crossbite:\n\nDentoalveolar crossbite is correctable with nivellipso® — the aligner expands in the desired plane. For skeletal crossbite, palatal expansion may be needed beforehand.\n\nDetails in the individual treatment plan." },
 { keywords: ['offener biss','open bite','frontoffener'],
   de:"Offener Biss:\n\nDentaler offener Biss ist eine anspruchsvolle, aber machbare Indikation — durch Extrusion der Frontzähne und/oder Intrusion der Seitenzähne. Erfolgsfaktoren: Compliance + Habit-Kontrolle (Zungenposition).\n\nKlinische Beratung gerne via albin.brkic@nivellipso.com",
   en: "Open Bite:\n\nDental open bite is a demanding but feasible indication — through extrusion of anterior teeth and/or intrusion of posterior teeth. Success factors: compliance + habit control (tongue position).\n\nClinical consultation gladly via albin.brkic@nivellipso.com" },

 // ═══ ATTACHMENTS & TOOLS ═══
 { keywords: ['attachment','attachments','bonding','komposit'],
   de:"Attachments (Komposit-Aufbauten):\n\nWerden bei komplexeren Bewegungen am Zahn angeklebt — geben der Schiene Griffflächen für rotationen, Extrusionen, distalisationen.\n\n• Material: Standard Komposit (lichthärtend)\n• Form/Position: im Treatment-Plan exakt spezifiziert\n• Klebetemplate wird mitgeliefert\n• Entfernung am Ende der Behandlung: schmerzfrei, ohne Schmelzschaden",
   en: "Attachments (composite build-ups):\n\nBonded to the tooth for complex movements — give the aligner grip surfaces for rotations, extrusions, distalizations.\n\n• Material: standard composite (light-curing)\n• Shape/position: precisely specified in the treatment plan\n• Bonding template included\n• Removal at end of treatment: pain-free, without enamel damage" },
 { keywords: ['ipr','interproximal','interproximale reduktion','strip','schmelzreduktion'],
   de:"IPR (Interproximale Reduktion):\n\nBei Engstand >3 mm pro Kiefer wird im Treatment-Plan IPR vorgeschlagen — Streifen oder Bohrer reduzieren minimal interproximalen Schmelz (0,2–0,5 mm pro Kontakt).\n\nSicher bei korrekter Anwendung. Plan zeigt: welche Zähne, welche Stufe, wie viel mm.",
   en: "IPR (Interproximal Reduction):\n\nFor crowding >3 mm per jaw, IPR is suggested in the treatment plan — strips or a burr minimally reduce interproximal enamel (0.2–0.5 mm per contact).\n\nSafe when correctly applied. The plan shows: which teeth, which stage, how many mm." },
 { keywords: ['elastic','gummiband','klasse ii elastics','intermaxillär','rubber band'],
   de:"Elastics (Gummizüge):\n\nFür Klasse-II/III-Korrekturen, Mittellinien-Korrekturen oder vertikale Komponenten werden intermaxilläre Elastics eingesetzt. Patient klipst sie an Schienen-Buttons oder Attachments.\n\nCompliance-relevant — VISIBAL hilft beim Tracking.",
   en: "Elastics (rubber bands):\n\nFor Class II/III corrections, midline corrections, or vertical components, intermaxillary elastics are used. The patient clips them to aligner buttons or attachments.\n\nCompliance-relevant — VISIBAL helps with tracking." },

 // ═══ BEHANDLUNGSDAUER & WORKFLOW ═══
 { keywords: ['dauer','wie lange behandlung','behandlungsdauer','wie viele monate','monate','duration'],
   de:"Behandlungsdauer (Richtwerte):\n\n• Leichte Korrekturen (bis 5 Stufen): 3–4 Monate\n• Mittlere Komplexität (8–14 Stufen): 4–7 Monate\n• Komplexe Fälle (15–21 Stufen): 7–11 Monate\n\nStufenwechsel typisch alle 2 Wochen. Schnellerer Wechsel (7–10 Tage) bei guter Compliance möglich.",
   en: "Treatment duration (guidelines):\n\n• Mild corrections (up to 5 stages): 3–4 months\n• Moderate complexity (8–14 stages): 4–7 months\n• Complex cases (15–21 stages): 7–11 months\n\nStage change typically every 2 weeks. Faster change (7–10 days) possible with good compliance." },
 { keywords: ['wechsel','stufenwechsel','wann wechseln','wie oft wechseln'],
   de:"Stufenwechsel:\n\nStandard: alle 14 Tage neue Schiene einsetzen. Bei guter Compliance (22+h Tragezeit, kein Druckgefühl mehr) ist Wechsel nach 10 Tagen möglich.\n\nNicht früher wechseln — die Zähne brauchen Zeit für die biomechanische Antwort.",
   en: "Stage change:\n\nStandard: insert new aligner every 14 days. With good compliance (22+ hours wear time, no more pressure feeling) a change after 10 days is possible.\n\nDo not change earlier — teeth need time for the biomechanical response." },
 { keywords: ['lieferzeit','liefer','versand','wann fertig','dauer fertigung','delivery'],
   de:"Lieferzeiten:\n\n• Treatment-Plan: 3 Werktage nach Scan-Eingang\n• Schienen Standard: 5–10 Werktage\n• Express (CH/FL): 2–3 Werktage, CHF 45.—\n• Frei Haus ab CHF 600 Bestellwert\n\nDirektversand ab Manufaktur.",
   en: "Delivery times:\n\n• Treatment plan: 3 working days after scan receipt\n• Aligners standard: 5–10 working days\n• Express (CH/FL): 2–3 working days, CHF 45.—\n• Free shipping from CHF 600 order value\n\nDirect dispatch from the manufacturer." },
 { keywords: ['scan','intraoral','itero','trios','3shape','impression','abdruck','stl','ply'],
   de:"Digitaler Scan / Abdruck:\n\nWir akzeptieren STL- oder PLY-Dateien aus allen gängigen Intraoral-Scannern: iTero, TRIOS, Primescan, Medit, etc.\n\nKein Scanner? Silikonabdrücke werden eingescannt (Aufpreis). Empfohlen sind aber digitale Scans — präziser, schneller, hygienischer.",
   en: "Digital scan / impression:\n\nWe accept STL or PLY files from all common intraoral scanners: iTero, TRIOS, Primescan, Medit, etc.\n\nNo scanner? Silicone impressions are scanned (surcharge). Digital scans are recommended — more precise, faster, more hygienic." },
 { keywords: ['clincheck','treatment plan','behandlungsplan','planung','plan freigeben'],
   de:"ClinCheck-Workflow:\n\n1. Scan hochladen über Doctor Portal\n2. Wir erstellen digitalen Treatment-Plan in 3 WT\n3. Sie reviewen 3D-Animation, Bewegungen, Stufen, IPR, Attachments\n4. Anpassungen möglich — kostenlose Iteration\n5. Freigabe → Produktion startet\n\nDie Verantwortung für den Plan bleibt klinisch beim behandelnden Arzt.",
   en: "Treatment plan workflow:\n\n1. Upload scan via Doctor Portal\n2. We create a digital treatment plan in 3 working days\n3. You review the 3D animation, movements, stages, IPR, attachments\n4. Adjustments possible — free iteration\n5. Approval → production starts\n\nClinical responsibility for the plan remains with the treating doctor." },

 // ═══ ZIELGRUPPE ═══
 { keywords: ['erwachsene','adult','alter','grenze','wie alt'],
   de:"Erwachsenenbehandlung:\n\nKeine obere Altersgrenze. Schienenbehandlung funktioniert bei gesundem Parodont und gutem Knochenangebot in jedem Alter. Bei Patienten 50+ achten wir auf langsame Bewegungsraten und parodontale Kontrolle.",
   en: "Adult treatment:\n\nNo upper age limit. Aligner treatment works at any age with healthy periodontium and good bone support. For patients 50+, we focus on slow movement rates and periodontal monitoring." },
 { keywords: ['kind','teen','jugend','teenager','kinder','child','jung'],
   de:"Kinder & Teens:\n\nAb spätem Wechselgebiss (~12 Jahre) und vollständigem Durchbruch der bleibenden Frontzähne möglich. Wichtig: Compliance ist altersabhängig — VISIBAL-Tracking unterstützt.\n\nBei jüngeren Patienten oft besser: Frühbehandlung mit klassischer Apparatur.",
   en: "Children & Teens:\n\nPossible from late mixed dentition (~12 years) and complete eruption of permanent anterior teeth. Important: compliance is age-dependent — VISIBAL tracking supports this.\n\nFor younger patients, early treatment with conventional appliances is often better." },

 // ═══ PATIENTENFRAGEN ═══
 { keywords: ['22h','22 stunden','tragezeit','tragen','wear','stunden','wie lange tragen'],
   de:"22-Stunden-Regel:\n\nSchiene muss mindestens 22h/Tag getragen werden. Unter 20h verliert sie biomechanische Wirksamkeit — Zähne bewegen sich nicht mehr, Behandlung verzögert sich oder stoppt.\n\nNur zum Essen, Trinken (außer Wasser) und Zähneputzen herausnehmen. VISIBAL trackt automatisch.",
   en: "22-hour rule:\n\nThe aligner must be worn at least 22 hours/day. Below 20 hours, it loses biomechanical effectiveness — teeth no longer move, treatment is delayed or stops.\n\nRemove only for eating, drinking (except water), and brushing. VISIBAL tracks automatically." },
 { keywords: ['schmerz','druck','weh','tut weh','unangenehm','pain','pressure','sore'],
   de:"Druckgefühl & Schmerzen:\n\nIn den ersten 2–3 Tagen nach Stufenwechsel ist Druck normal und gewünscht — er zeigt aktive Zahnbewegung. Besonders in REGULAR-Phase.\n\nBei starken Schmerzen, Schleimhautverletzungen, Bisswunden oder unerwarteten Symptomen: direkten Kontakt mit Ihrer Praxis aufnehmen.",
   en: "Pressure & pain:\n\nDuring the first 2–3 days after a stage change, pressure is normal and expected — it indicates active tooth movement. Especially in the REGULAR phase.\n\nFor severe pain, mucosal injuries, bite wounds, or unexpected symptoms: contact your practice directly." },
 { keywords: ['essen','trinken','kaffee','rotwein','tee','food','drink'],
   de:"Essen & Trinken mit Schienen:\n\n• Essen: Schiene IMMER herausnehmen\n• Wasser: OK mit Schiene\n• Kaffee, Tee, Wein, Säfte: NUR ohne Schiene — sonst Verfärbung\n• Vor dem Wiedereinsetzen: Zähne putzen oder mindestens spülen\n• Heißgetränke: nicht mit Schiene — verformt das PET-G",
   en: "Eating & drinking with aligners:\n\n• Eating: ALWAYS remove aligner\n• Water: OK with aligner\n• Coffee, tea, wine, juices: ONLY without aligner — otherwise staining\n• Before reinserting: brush teeth or at least rinse\n• Hot drinks: not with aligner — deforms the PET-G" },
 { keywords: ['reinigen','putzen','hygiene','schiene reinigen','schiene putzen','clean','aligner cleaning'],
   de:"Schiene reinigen:\n\n• Täglich: Zahnbürste + lauwarmes Wasser (nicht heiß!)\n• Wöchentlich: Reinigungstabletten (z.B. Corega, Retainer Brite) oder mildes Spülmittel\n• Niemals: Mundwasser mit Alkohol, Bleichmittel, Backpulver — beschädigen das Material\n• Aufbewahrung außerhalb des Mundes: in der Aufbewahrungsbox, nicht in Servietten (vergessen Sie sonst!)",
   en: "Cleaning the aligner:\n\n• Daily: toothbrush + lukewarm water (not hot!)\n• Weekly: cleaning tablets (e.g. Corega, Retainer Brite) or mild dish soap\n• Never: alcohol-based mouthwash, bleach, baking soda — damage the material\n• Storage outside the mouth: in the storage box, not in napkins (otherwise forgotten!)" },
 { keywords: ['lispeln','sprechen','spreche','speech','aussprache'],
   de:"Lispeln in den ersten Tagen:\n\nNormal in den ersten 3–7 Tagen — Zunge muss sich an die ~1 mm dickere Schiene gewöhnen. Nach kurzer Zeit verschwindet das Lispeln vollständig.\n\nTipp: laut vorlesen oder zählen — beschleunigt die Anpassung.",
   en: "Lisping in the first few days:\n\nNormal in the first 3–7 days — the tongue needs to adjust to the ~1 mm thicker aligner. After a short time, the lisp disappears completely.\n\nTip: read aloud or count — accelerates adaptation." },
 { keywords: ['verloren','lost','vergessen','versehentlich','accident'],
   de:"Schiene verloren:\n\n1. Sofort die nächste Stufe einsetzen (falls bereits zugesendet)\n2. Wenn nicht: vorherige Stufe wieder tragen → keine Rückwärtsbewegung\n3. Praxis kontaktieren — Nachproduktion oft binnen 5 WT möglich (CHF nach Aufwand)\n4. Verlust dokumentieren in VISIBAL → automatisches Re-Order möglich",
   en: "Lost aligner:\n\n1. Immediately insert the next stage (if already sent)\n2. If not: wear previous stage again → no backward movement\n3. Contact practice — re-production often possible within 5 working days (CHF by effort)\n4. Document loss in VISIBAL → automatic re-order possible" },
 { keywords: ['bricht','gebrochen','riss','beschädigt','broken','crack'],
   de:"Schiene gebrochen:\n\nNicht weitertragen — scharfe Kanten können Schleimhaut verletzen.\n\n1. Vorherige Stufe einsetzen (oder Retainer)\n2. Praxis kontaktieren mit Foto der Bruchstelle\n3. Nachproduktion erfolgt kostenlos im Garantierahmen (24 Monate), bei Anwendungsfehler Aufpreis\n\nHäufige Ursache: Schiene in heißem Wasser, mechanische Belastung durch Knirschen — Schienenschutz prüfen.",
   en: "Aligner broken:\n\nDo not continue wearing — sharp edges can injure the mucosa.\n\n1. Insert previous stage (or retainer)\n2. Contact practice with photo of the break\n3. Re-production is free under warranty (24 months); surcharge for user error\n\nCommon cause: aligner in hot water, mechanical stress from grinding — check bite guard." },
 { keywords: ['sport','schwimmen','training','swim','contact sport'],
   de:"Sport mit Schienen:\n\n• Schwimmen, Joggen, Yoga, Krafttraining: Schiene drin lassen — schützt sogar leicht\n• Kontaktsport (Boxen, Hockey, MMA): Schiene raus, Mundschutz nutzen\n• Tauchen: Schiene drin OK, aber Druckausgleich beachten\n\nSchwitzen ist kein Problem — die Schiene verträgt das.",
   en: "Sport with aligners:\n\n• Swimming, jogging, yoga, weight training: leave aligner in — it even provides slight protection\n• Contact sport (boxing, hockey, MMA): remove aligner, use mouthguard\n• Diving: aligner OK, but mind pressure equalization\n\nSweating is not a problem — the aligner tolerates it." },
 { keywords: ['schlafen','nachts','snore','grind','knirschen','bruxismus'],
   de:"Nachts & Knirschen (Bruxismus):\n\nSchlafen mit Schiene ist Pflicht — die meiste Tragezeit fällt in die Nacht.\n\nKnirscher zerstören Schienen schneller — wir empfehlen während aktiver Behandlung KEINEN separaten Aufbissbehelf (die Schiene übernimmt die Funktion). Nach der Behandlung: separater Knirschschutz.",
   en: "Night wear & grinding (bruxism):\n\nSleeping with the aligner is mandatory — most of the wear time falls at night.\n\nGrinders destroy aligners faster — during active treatment we do NOT recommend a separate bite guard (the aligner takes over that function). After treatment: separate grinding guard." },
 { keywords: ['rauchen','smoking','tabak','vape'],
   de:"Rauchen mit Schienen:\n\nGrundsätzlich möglich, aber:\n• Verfärbung der Schiene (besonders bei Zigaretten)\n• Tipp: vor dem Rauchen Schiene raus, danach Zähne spülen\n• E-Zigaretten/Vape: weniger Verfärbung, aber gleiches Verfahren\n\nLangfristig ist Rauchstopp ohnehin gut für Parodont und Behandlungserfolg.",
   en: "Smoking with aligners:\n\nGenerally possible, but:\n• Staining of the aligner (especially with cigarettes)\n• Tip: remove aligner before smoking, rinse teeth afterwards\n• E-cigarettes/vape: less staining, but same procedure\n\nLong-term, quitting smoking is anyway good for the periodontium and treatment success." },
 { keywords: ['schwanger','pregnant','stillen','baby'],
   de:"Schwangerschaft & Stillzeit:\n\nSchienenbehandlung ist generell möglich. Wichtig:\n• Materialien sind biokompatibel\n• Hormonelle Veränderungen können Zahnfleischempfindlichkeit erhöhen\n• Röntgen während Schwangerschaft vermeiden — wir arbeiten ohnehin volldigital\n\nKlinische Entscheidung im Einzelfall mit Ihrer Praxis.",
   en: "Pregnancy & breastfeeding:\n\nAligner treatment is generally possible. Important:\n• Materials are biocompatible\n• Hormonal changes can increase gum sensitivity\n• Avoid X-rays during pregnancy — we work fully digitally anyway\n\nClinical decision on a case-by-case basis with your practice." },

 // ═══ BRACKETS ═══
 { keywords: ['bracket','metall','keramik','selbstligierend','self-lig','self lig'],
   de:"nivellipso® Bracket-Linie:\n\n• Metall (MIM, 022\" Slot Roth/MBT): CHF 2.40/Stk · Standard\n• Keramik (monokristallin): CHF 7.80/Stk · ästhetisch\n• Selbstligierend (passiv): CHF 9.50/Stk · Premium\n\nNivellipso-Mitglieder: bis −30% Rabatt mit Promo-Code (Member-Pricing: CHF 1.32 / 4.29 / 5.23). Bestellung via Webshop (shop.nivellipso.com).",
   en: "nivellipso® Bracket line:\n\n• Metal (MIM, 022\" Slot Roth/MBT): CHF 2.40/pc · Standard\n• Ceramic (monocrystalline): CHF 7.80/pc · aesthetic\n• Self-ligating (passive): CHF 9.50/pc · Premium\n\nNivellipso members: up to −30% discount with Promo Code (Member pricing: CHF 1.32 / 4.29 / 5.23). Order via Webshop (shop.nivellipso.com)." },
 { keywords: ['bogen','arch','niti','stahl','tma'],
   de:"Bögen & Drahttherapie:\n\n• NiTi rund: CHF 3.20/Stk · superelastisch, initial\n• NiTi rechteckig: CHF 4.10/Stk · Arbeitsphase\n• Stahl rund: CHF 1.80/Stk · stabilisierend\n• Stahl rechteckig: CHF 2.40/Stk · Finishing\n• TMA: CHF 5.60/Stk · controlled deflection\n\nMember-Pricing für Nivellipso-Mitglieder. Komplettsortiment im Webshop (shop.nivellipso.com).",
   en: "Archwires & wire therapy:\n\n• NiTi round: CHF 3.20/pc · superelastic, initial\n• NiTi rectangular: CHF 4.10/pc · working phase\n• Steel round: CHF 1.80/pc · stabilizing\n• Steel rectangular: CHF 2.40/pc · finishing\n• TMA: CHF 5.60/pc · controlled deflection\n\nMember pricing for Nivellipso members. Full range in the Webshop (shop.nivellipso.com)." },

 // ═══ PROFI-FRAGEN ═══
 { keywords: ['kfo','kieferorthopäde','kieferorthopaede','orthodontist','spezialist'],
   de:"Für KFO-Ärzte:\n\nDas nivellipso®-System ist von Kieferorthopäden für Kieferorthopäden entwickelt:\n\n• Volle klinische Kontrolle über jeden Schritt\n• Plan-Anpassungen kostenlos\n• Direkte Kommunikation mit unserer KFO-Beratung (Dr. Albin Brkic)\n• Persönlicher Account-Manager statt anonymem Call-Center\n• Sonderkonditionen für High-Volume-Praxen\n\nKennenlern-Termin: albin.brkic@nivellipso.com",
   en: "For orthodontists:\n\nThe nivellipso® system was developed by orthodontists for orthodontists:\n\n• Full clinical control over every step\n• Plan adjustments free of charge\n• Direct communication with our orthodontic consultant (Dr. Albin Brkic)\n• Personal account manager instead of anonymous call center\n• Special conditions for high-volume practices\n\nIntroductory meeting: albin.brkic@nivellipso.com" },
 { keywords: ['zahnarzt','dental','allgemeinpraktiker','dentist','gp'],
   de:"Für Zahnärzte (Allgemeinpraktiker):\n\nEinstieg in die Schienenbehandlung — strukturiert begleitet:\n\n• Onboarding mit klinischer Beratung\n• Fallselektion: wir helfen bei der Einschätzung\n• Treatment-Plan als Diskussionsgrundlage\n• Academy-Materialien (Anleitungen, Webinare)\n• Direktversand, kein Mindestbestellwert\n\nEinstiegsberatung: albin.brkic@nivellipso.com",
   en: "For dentists (general practitioners):\n\nGetting started with aligner treatment — structured support:\n\n• Onboarding with clinical consultation\n• Case selection: we help with assessment\n• Treatment plan as a discussion basis\n• Academy materials (guides, webinars)\n• Direct shipping, no minimum order value\n\nIntroductory consultation: albin.brkic@nivellipso.com" },
 { keywords: ['referral','überweisung','ueberweisung','komplex','schwerer fall','complex case'],
   de:"Komplexe Fälle:\n\nBei skelettalen Diskrepanzen, schweren Klasse II/III, Tiefbiss-Komponenten mit vertikaler Dysplasie oder kombinierten Behandlungen (kieferchirurgisch, parodontal):\n\n• Schiene + Brackets (kombinierte Therapie)\n• Schiene + Mini-Implantate (TADs)\n• Chirurgische Vor- oder Nachbehandlung\n\nSenden Sie uns den Fall zur Einschätzung: albin.brkic@nivellipso.com",
   en: "Complex cases:\n\nFor skeletal discrepancies, severe Class II/III, deep bite components with vertical dysplasia, or combined treatments (orthognathic surgery, periodontal):\n\n• Aligner + brackets (combined therapy)\n• Aligner + mini-implants (TADs)\n• Surgical pre- or post-treatment\n\nSend us the case for assessment: albin.brkic@nivellipso.com" },
 { keywords: ['fortbildung','academy','kurse','webinar','weiterbildung','training'],
   de:"Academy & Fortbildung:\n\nWir bieten:\n• Online-Webinare zu Indikation, Workflow, klinischen Tipps\n• Praxis-Onboarding für neue Anwender\n• Hands-on Workshops (Limited Editions)\n• Case Reviews mit unseren KFO-Beratern\n• Academy-Bibliothek mit Tutorials und Fall-Vorstellungen\n\nDetails: albin.brkic@nivellipso.com oder im Webshop (shop.nivellipso.com)",
   en: "Academy & continuing education:\n\nWe offer:\n• Online webinars on indication, workflow, clinical tips\n• Practice onboarding for new users\n• Hands-on workshops (limited editions)\n• Case reviews with our orthodontic consultants\n• Academy library with tutorials and case presentations\n\nDetails: albin.brkic@nivellipso.com or in the Webshop (shop.nivellipso.com)" },

 // ═══ VISIBAL ═══
 { keywords: ['visibal','app','tracking','compliance','dashboard'],
   de:"VISIBAL — die klinische Begleit-Plattform:\n\n• Patient-App: Behandlungsfortschritt, 22h-Tracking, Foto-Doku, Online-Assistent\n• Praxis-Dashboard: Compliance-Monitoring aller Patienten in Echtzeit\n• Monatliches Patient-Mailing in 6 Sprachen\n• Podcast für Patienten\n• Push-Notifications bei Schienenwechsel\n\nBasic gratis für nivellipso®-Kunden. Pro: CHF 89/Monat (multi-doc). Demo: albin.brkic@nivellipso.com",
   en: "VISIBAL — the clinical companion platform:\n\n• Patient app: treatment progress, 22h tracking, photo documentation, online assistant\n• Practice dashboard: real-time compliance monitoring of all patients\n• Monthly patient mailing in 6 languages\n• Patient podcast\n• Push notifications at aligner change\n\nBasic free for nivellipso® customers. Pro: CHF 89/month (multi-doc). Demo: albin.brkic@nivellipso.com" },

 // ═══ RETAINER ═══
 { keywords: ['retainer','rezidiv','nachbehandlung','retention','nachher','nach behandlung'],
   de:"Retainer nach der Behandlung:\n\nZähne haben natürliches Rezidiv-Potential. Ohne Retainer können sie zurückwandern.\n\nUnser Angebot:\n• Single Arch Paar: CHF 140\n• Dual Arch Paar: CHF 230\n• 3er-Set (Stabilität): CHF 380 / 620\n\nEmpfehlung: erste 12 Monate nachts tragen, dann lebenslang 2–3×/Woche nachts. Alternative: festsitzender Retainer (Draht hinter Frontzähnen).",
   en: "Retainer after treatment:\n\nTeeth have a natural relapse potential. Without a retainer, they can drift back.\n\nOur offer:\n• Single arch pair: CHF 140\n• Dual arch pair: CHF 230\n• 3-pack (stability): CHF 380 / 620\n\nRecommendation: wear nightly for the first 12 months, then 2–3× per week nightly for life. Alternative: fixed retainer (wire behind front teeth)." },
 { keywords: ['bonded retainer','festsitzender retainer','permanent','draht'],
   de:"Festsitzender Retainer (Bonded Retainer):\n\nDraht an der Innenseite der Unterkieferfront (3–3 oder 5–5) — klebt mit Komposit fest. Vorteil: keine Compliance nötig. Nachteil: Hygiene-Aufwand (Zahnseide-Knöpfli), gelegentliche Reparatur.\n\nKombination mit nivellipso®-Retainer (nachts) ist die sicherste Rezidiv-Prävention.",
   en: "Fixed retainer (bonded retainer):\n\nWire on the inside of the lower anterior teeth (3–3 or 5–5) — bonded with composite. Advantage: no compliance required. Disadvantage: hygiene effort (floss threader), occasional repair.\n\nCombination with nivellipso® retainer (nightly) is the safest relapse prevention." },

 // ═══ BESONDERE SITUATIONEN ═══
 { keywords: ['weisheitszahn','wisdom','8er'],
   de:"Weisheitszähne:\n\nVor Schienenbehandlung müssen Weisheitszähne nicht zwingend entfernt werden — entgegen alter Lehrmeinung gibt es keinen kausalen Zusammenhang zu Rezidiv.\n\nWenn aber: Druck auf 7er, Engstand mit Platzmangel, retinierte 8er — Extraktion vor Schienen-Start sinnvoll. Klinische Entscheidung individuell.",
   en: "Wisdom teeth:\n\nWisdom teeth do not necessarily need to be removed before aligner treatment — contrary to old teaching, there is no causal link to relapse.\n\nHowever: pressure on the 7s, crowding with space shortage, impacted wisdom teeth — extraction before starting aligners makes sense. Clinical decision on an individual basis." },
 { keywords: ['implantat','implant','krone','brücke','bridge','crown'],
   de:"Implantate, Kronen, Brücken:\n\n• Implantate: bewegen sich NICHT — werden im Plan als Anker verwendet, andere Zähne bewegen sich um sie herum\n• Kronen / Veneers: Attachments halten nur eingeschränkt — alternative Verankerung im Plan\n• Brücken: müssen vor Schienenbehandlung evaluiert werden — getrennte Glieder nötig?\n\nDetailbesprechung: albin.brkic@nivellipso.com",
   en: "Implants, crowns, bridges:\n\n• Implants: do NOT move — used as anchors in the plan, other teeth move around them\n• Crowns / veneers: attachments hold only to a limited extent — alternative anchorage in the plan\n• Bridges: must be evaluated before aligner treatment — separate units needed?\n\nDetailed discussion: albin.brkic@nivellipso.com" },
 { keywords: ['parodont','parodontitis','knochenabbau','gingivitis'],
   de:"Parodontalstatus vor Schienenbehandlung:\n\nVoraussetzung: parodontal stabil, kein aktiver Knochenabbau. Bei behandeltem Parodont mit Resttaschen sind langsame Bewegungsraten und engmaschige Kontrolle wichtig.\n\nVor Schienen-Start: gründliche PA-Therapie, Mundhygiene-Coaching, ggf. Erhaltungsphase. Kontraindikation bei aktiver schwerer Parodontitis.",
   en: "Periodontal status before aligner treatment:\n\nPrerequisite: periodontally stable, no active bone loss. With treated periodontium with residual pockets, slow movement rates and close monitoring are important.\n\nBefore starting aligners: thorough periodontal therapy, oral hygiene coaching, possibly a maintenance phase. Contraindicated in active severe periodontitis." },
 { keywords: ['kiefergelenk','tmj','cmd','kg','craniomandibulär'],
   de:"Kiefergelenk (TMJ/CMD):\n\nSchienen können bei CMD-Patienten zu Verbesserung beitragen (Bisslage stabilisiert), aber auch zu vorübergehender Verschlechterung führen (Adaptionsphase).\n\nBei symptomatischer CMD: vor Schienen-Start CMD-Therapie, ggf. Aufbiss-Schiene zur Bisslagebestimmung. Plan dann auf stabilisierte Position.",
   en: "Temporomandibular joint (TMJ/CMD):\n\nAligners can contribute to improvement in TMD patients (bite position stabilized), but can also lead to temporary worsening (adaptation phase).\n\nFor symptomatic TMD: TMD therapy before starting aligners, possibly a bite splint to determine jaw position. Plan then based on the stabilized position." },

 // ═══ KONTAKT / SERVICE ═══
 { keywords: ['demo','beratung','termin','visite','kennenlernen','appointment','meeting','call'],
   de:"Demo & Beratung:\n\n• Dr. Albin Brkic kommt persönlich in Ihre Praxis (Schweiz, kostenfrei)\n• 30-Minuten Online-Beratung via Doctor Portal\n• VISIBAL-Demo: 5 Pilot-Praxen aktiv, kostenlos testen\n\nAnfrage: albin.brkic@nivellipso.com · +41 76 407 92 33",
   en: "Demo & consultation:\n\n• Dr. Albin Brkic visits your practice in person (Switzerland, free of charge)\n• 30-minute online consultation via Doctor Portal\n• VISIBAL demo: 5 pilot practices active, free to try\n\nInquiry: albin.brkic@nivellipso.com · +41 76 407 92 33" },
 { keywords: ['swiss','schweiz','schweizer','made in','herkunft','herstellung','manufaktur'],
   de:"Made in Switzerland:\n\n• Produktion 100% in der Schweiz seit 2015\n• PET-G biokompatibel, drei Wandstärken\n• Vollständige Rückverfolgbarkeit jeder Charge\n• Swiss Klinische Planung · Swiss Precision\n• Direktversand ab Manufaktur, kein Zwischenhändler",
   en: "Made in Switzerland:\n\n• Production 100% in Switzerland since 2015\n• Biocompatible PET-G, three wall thicknesses\n• Full traceability of every batch\n• Swiss clinical planning · Swiss precision\n• Direct dispatch from the manufacturer, no intermediary" },
 { keywords: ['portal','doctor portal','bestellung','order','einloggen','login','konto'],
   de:"Doctor Portal:\n\nBestellungen, Treatment-Pläne und Tracking laufen über nivellonlign.com:\n\n• STL/PLY Scans hochladen\n• Treatment-Plan reviewen und freigeben\n• Brackets, Bögen, Zubehör direkt bestellen\n• Bestellhistorie & Tracking\n• Persönlicher Promo-Code hinterlegt\n\nZugang anfragen: albin.brkic@nivellipso.com",
   en: "Doctor Portal:\n\nOrders, treatment plans, and tracking are handled through nivellonlign.com:\n\n• Upload STL/PLY scans\n• Review and approve treatment plans\n• Order brackets, archwires, accessories directly\n• Order history & tracking\n• Personal promo code stored\n\nRequest access: albin.brkic@nivellipso.com" },
 { keywords: ['kontakt','erreich','anruf','mail','contact','wie erreich','telefon'],
   de:"So erreichen Sie uns:\n\n• Klinische Beratung & Planung: Dr. Albin Brkic\n  albin.brkic@nivellipso.com\n  +41 76 407 92 33\n\n• WhatsApp: über die Website (grüner Button)\n\n• Online: Doctor Portal nivellonlign.com\n\nAntwortzeit typisch unter 4 Stunden während Geschäftszeiten.",
   en: "How to reach us:\n\n• Clinical consultation & planning: Dr. Albin Brkic\n  albin.brkic@nivellipso.com\n  +41 76 407 92 33\n\n• WhatsApp: via the website (green button)\n\n• Online: Doctor Portal nivellonlign.com\n\nResponse time typically under 4 hours during business hours." },
 { keywords: ['garantie','warranty','reklamation','beschwerde','umtausch'],
   de:"Garantie & Reklamation:\n\n• 24 Monate Garantie auf Schienen und Brackets\n• Bei Materialfehler oder Nichterfüllung der Spezifikation: kostenlose Neuproduktion\n• Vollständiges Rückgaberecht\n• Bei Anwendungsfehler: Nachfertigung gegen Aufpreis\n\nReklamation: albin.brkic@nivellipso.com mit Fotos und Falldoku — Bearbeitung typisch binnen 48h.",
   en: "Warranty & complaints:\n\n• 24-month warranty on aligners and brackets\n• For material defects or failure to meet specifications: free re-production\n• Full right of return\n• For user error: re-production at extra cost\n\nComplaints: albin.brkic@nivellipso.com with photos and case documentation — typically processed within 48 hours." }
];

function findAnswer(question) {
 const q = question.toLowerCase();
 const lang = (function(){try{return localStorage.getItem('nivell_lang')||'de';}catch(e){return 'de';}})();
 let best = null, max = 0;
 for (const topic of NIVELLIPSO_KNOWLEDGE) {
  let score = 0;
  for (const kw of topic.keywords) { if (q.includes(kw)) score += kw.length; }
  if (score > max) { max = score; best = topic; }
 }
 return best ? (best[lang] || best.de) : null;
}

// ── AI BACKEND CALL ──
// Tries to reach a backend endpoint that proxies to a real AI model (e.g. Claude API).
// Returns null on any failure → fallback to local KB.
async function tryAIBackend(question, conversationHistory) {
 try {
  const ctrl = new AbortController();
  const tid = setTimeout(() => ctrl.abort(), NIVELL_CHAT_API_TIMEOUT_MS);
  const res = await fetch(NIVELL_CHAT_API, {
   method: 'POST',
   headers: { 'Content-Type': 'application/json' },
   body: JSON.stringify({
    message: question,
    history: conversationHistory || []
   }),
   signal: ctrl.signal
  });
  clearTimeout(tid);
  if (!res.ok) return null;
  const data = await res.json();
  return (data && data.reply) ? data.reply.trim() : null;
 } catch (e) {
  // Network error, no backend deployed, timeout, etc. → silent fallback
  return null;
 }
}

// ── CHAT UI ──
let chatOpen = false;
const answeredTopics = new Set();
const chatHistory = []; // for AI context

function toggleNivellChat() {
 chatOpen = !chatOpen;
 const win = document.getElementById('chatWindow');
 const btn = document.getElementById('chatToggle');
 if (!win) return;
 win.classList.toggle('open', chatOpen);
 if (btn) {
  const icon = btn.querySelector('.chat-icon, .c-icon');
  const close = btn.querySelector('.chat-close, .c-close');
  const label = btn.querySelector('.chat-label, .c-label');
  if (icon) icon.style.display = chatOpen ? 'none' : 'block';
  if (close) close.style.display = chatOpen ? 'block' : 'none';
  if (label) label.style.display = chatOpen ? 'none' : 'inline';
 }
}

function addNivellMsg(text, role) {
 const msgs = document.getElementById('chatMessages');
 if (!msgs) return;
 const div = document.createElement('div');
 div.className = role === 'user' ? 'msg msg-user msg-u' : 'msg msg-bot msg-b';
 div.style.whiteSpace = 'pre-wrap';
 div.textContent = text;
 msgs.appendChild(div);
 msgs.scrollTop = msgs.scrollHeight;
}

function showNivellTyping() {
 const msgs = document.getElementById('chatMessages');
 if (!msgs) return;
 const d = document.createElement('div');
 d.id = 'typing';
 d.className = 'typing typing-dots typing-d';
 d.innerHTML = '<span></span><span></span><span></span>';
 msgs.appendChild(d);
 msgs.scrollTop = msgs.scrollHeight;
}

function hideNivellTyping() { const t = document.getElementById('typing'); if (t) t.remove(); }

async function sendNivellChat(systemPrompt) {
 const input = document.getElementById('chatInput');
 if (!input) return;
 const text = input.value.trim();
 if (!text) return;
 input.value = '';
 const suggs = document.getElementById('chatSugg');
 if (suggs) suggs.innerHTML = '';
 addNivellMsg(text, 'user');
 chatHistory.push({ role: 'user', content: text });
 showNivellTyping();

 // 1. Try AI backend first (will return null if no backend deployed)
 const aiReply = await tryAIBackend(text, chatHistory);

 if (aiReply) {
  hideNivellTyping();
  addNivellMsg(aiReply, 'bot');
  chatHistory.push({ role: 'assistant', content: aiReply });
  showFollowUpSuggs();
  return;
 }

 // 2. Fallback: local KB
 const localAnswer = findAnswer(text);
 // Add small natural delay
 await new Promise(r => setTimeout(r, 600 + Math.random() * 500));

 if (localAnswer) {
  hideNivellTyping();
  addNivellMsg(localAnswer, 'bot');
  chatHistory.push({ role: 'assistant', content: localAnswer });
  showFollowUpSuggs();
  return;
 }

 // 3. Final fallback — friendly handoff (language-aware)
 hideNivellTyping();
 const _lang = (function(){try{return localStorage.getItem('nivell_lang')||document.documentElement.lang||'de';}catch(e){return 'de';}})();
 const fallback = _lang.startsWith('en')
  ? "For this specific question I recommend reaching out to our team directly:\n\n• Clinical questions: Dr. Albin Brkic — albin.brkic@nivellipso.com\n• By phone: +41 76 407 92 33\n\nReplies are quick and personal. I can also help on the following topics: pricing, delivery times, the Three-Schienen-System, VISIBAL, Honor & Reward, or clinical indication questions."
  : "Für diese spezifische Frage empfehle ich den direkten Kontakt mit unserem Team:\n\n• Klinische Fragen: Dr. Albin Brkic — albin.brkic@nivellipso.com\n• Telefonisch: +41 76 407 92 33\n\nDie Antwort kommt schnell und persönlich. Gerne kann ich Ihnen auch zu folgenden Themen helfen: Preise, Lieferzeiten, das Three-Schienen-System, VISIBAL, Honor & Reward, oder klinische Fragen zu Indikationen.";
 addNivellMsg(fallback, 'bot');
 chatHistory.push({ role: 'assistant', content: fallback });
 showFollowUpSuggs();
}

function sendNivellSugg(btn, systemPrompt) {
 const input = document.getElementById('chatInput');
 if (input) input.value = btn.textContent.trim();
 sendNivellChat(systemPrompt);
}

// ── CHATBOT FOLLOW-UP SUGGESTIONS ──
const FOLLOW_UP_POOL = [
 { labelDe: 'Preise & Kosten', labelEn: 'Prices & Costs', q: 'Was kostet ein Aligner-Set?' },
 { labelDe: 'Three-Schienen-System', labelEn: 'Three-Aligner System', q: 'Wie funktioniert das Three-Schienen-System?' },
 { labelDe: 'Lieferzeiten', labelEn: 'Delivery Times', q: 'Wie lange dauert die Lieferung?' },
 { labelDe: 'Honor & Reward', labelEn: 'Honor & Reward', q: 'Was ist das Honor & Reward Programm?' },
 { labelDe: 'Indikationen', labelEn: 'Indications', q: 'Für welche Fälle sind Aligners geeignet?' },
 { labelDe: 'Scan einreichen', labelEn: 'Submit Scan', q: 'Wie reiche ich einen Scan ein?' },
 { labelDe: 'Brackets', labelEn: 'Brackets', q: 'Welche Bracket-Systeme gibt es?' },
 { labelDe: 'Behandlungsdauer', labelEn: 'Treatment Duration', q: 'Wie lange dauert eine Behandlung?' },
 { labelDe: 'VISIBAL App', labelEn: 'VISIBAL App', q: 'Was ist die VISIBAL App?' },
 { labelDe: 'Retainer', labelEn: 'Retainer', q: 'Welche Retainer-Optionen gibt es?' },
 { labelDe: 'Attachments', labelEn: 'Attachments', q: 'Wann braucht man Attachments?' },
 { labelDe: 'Whitening', labelEn: 'Whitening', q: 'Gibt es ein Whitening-Angebot?' },
 { labelDe: 'Webshop', labelEn: 'Webshop', q: 'Wie bestelle ich im Webshop?' },
 { labelDe: 'Material & Qualität', labelEn: 'Material & Quality', q: 'Aus welchem Material sind die Schienen?' },
 { labelDe: 'Klasse II', labelEn: 'Class II', q: 'Kann ich Klasse-II-Fälle behandeln?' },
 { labelDe: 'Klasse III', labelEn: 'Class III', q: 'Wie sieht es mit Klasse-III-Fällen aus?' },
 { labelDe: 'IPR', labelEn: 'IPR', q: 'Wann ist eine IPR notwendig?' },
 { labelDe: 'Loyalty', labelEn: 'Loyalty', q: 'Wie funktioniert das Loyalty-Programm?' },
 { labelDe: 'Express-Versand', labelEn: 'Express Shipping', q: 'Gibt es Express-Lieferung?' },
 { labelDe: 'Kinderfälle', labelEn: 'Paediatric Cases', q: 'Ab welchem Alter sind Aligners möglich?' },
];

function showFollowUpSuggs() {
 const suggs = document.getElementById('chatSugg');
 if (!suggs) return;
 const lang = (function(){try{return localStorage.getItem('nivell_lang')||'de';}catch(e){return 'de';}})();
 // Mark recently asked topics as answered
 chatHistory.forEach(msg => {
  if (msg.role === 'user') answeredTopics.add(msg.content.toLowerCase().slice(0,40));
 });
 // Get 3 unanswered suggestions
 const available = FOLLOW_UP_POOL.filter(s => !answeredTopics.has(s.q.toLowerCase().slice(0,40)));
 const picks = available.slice(0, 3);
 if (picks.length === 0) return;
 suggs.innerHTML = '';
 picks.forEach(function(s) {
  const btn = document.createElement('button');
  btn.className = 'sugg';
  btn.textContent = lang === 'en' ? s.labelEn : s.labelDe;
  btn.onclick = function() {
   answeredTopics.add(s.q.toLowerCase().slice(0,40));
   const input = document.getElementById('chatInput');
   if (input) input.value = s.q;
   sendNivellChat();
  };
  suggs.appendChild(btn);
 });
 suggs.style.display = '';
}

// ── PROMO CODE SYSTEM ──
function activatePromoCode(code) {
 if (!code || code.length < 4) return false;
 localStorage.setItem('nivell_promo', code.toUpperCase());
 localStorage.setItem('nivell_promo_active', '1');
 showPromoUI(code);
 return true;
}

function showPromoUI(code) {
 const banner = document.getElementById('promoBanner');
 if (banner) {
  banner.innerHTML = '✓ Promo-Code <strong>' + code + '</strong> aktiv · Persönliche Konditionen werden angezeigt';
  banner.style.display = 'block';
 }
}

function getActivePromo() {
 return localStorage.getItem('nivell_promo_active') === '1' ? localStorage.getItem('nivell_promo') : null;
}

function checkUrlPromo() {
 const params = new URLSearchParams(window.location.search);
 const code = params.get('promo');
 if (code) activatePromoCode(code);
 else {
  const active = getActivePromo();
  if (active) showPromoUI(active);
 }
}

// ── INIT ON LOAD ──
document.addEventListener('DOMContentLoaded', () => {
 checkUrlPromo();
 // Mobile nav toggle if exists
 const mn = document.getElementById('mobileNav');
 if (mn) {
  document.querySelectorAll('.mobile-nav-trigger').forEach(t => {
   t.addEventListener('click', () => mn.classList.toggle('open'));
  });
 }
});

// ── LANGUAGE SWITCHER ──
// Called from index.html with translations object T and target language code.
// Updates all elements with [data-i18n] attribute using the dictionary.
function setNivellLang(lang, translations) {
 if (!translations || !translations[lang]) {
  console.warn('Translations not available for language:', lang);
  return;
 }
 const dict = translations[lang];
 // Persist preference
 try { localStorage.setItem('nivell_lang', lang); } catch (e) {}
 // Update document language attribute (for accessibility + SEO)
 document.documentElement.setAttribute('lang', lang);
 // Apply translations to all [data-i18n] elements
 document.querySelectorAll('[data-i18n]').forEach(el => {
  const key = el.getAttribute('data-i18n');
  if (!dict[key]) return;
  const value = dict[key];
  // Keys containing HTML markup (br, em) → use innerHTML
  // Detection: value contains < or known HTML chars
  if (/<[a-z]/i.test(value) || /&[a-z]+;/i.test(value)) {
   el.innerHTML = value;
  } else {
   // For placeholder attributes (input[placeholder]) handle separately
   if (el.tagName === 'INPUT' && el.type !== 'button' && el.type !== 'submit') {
    el.setAttribute('placeholder', value);
   } else {
    el.textContent = value;
   }
  }
 });
 // Update meta description if a localised version is available  
 // (optional — can be added per-language later)
}

// Expose globally for inline onclick handlers
window.setNivellLang = setNivellLang;

// ── SCROLL ANIMATIONS ──
// Fades in elements with .n-fade as they scroll into view
function initScrollAnimations() {
 // Skip if user prefers reduced motion
 if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.n-fade').forEach(el => el.classList.add('visible'));
  return;
 }
 if (!('IntersectionObserver' in window)) {
  // Fallback: just show everything
  document.querySelectorAll('.n-fade').forEach(el => el.classList.add('visible'));
  return;
 }
 const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
   if (entry.isIntersecting) {
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
   }
  });
 }, {
  threshold: 0.05,
  rootMargin: '0px 0px 50px 0px'
 });
 // Reveal-on-scroll (covers any observer miss). NOT wrapped in requestAnimationFrame,
 // because rAF is throttled/never fires in backgrounded or non-painting tabs — which
 // would otherwise leave whole sections blank (e.g. the roadmap).
 const revealInView = () => {
  document.querySelectorAll('.n-fade:not(.visible)').forEach(el => {
   const rect = el.getBoundingClientRect();
   if (rect.top < window.innerHeight + 80 && rect.bottom > -80) el.classList.add('visible');
  });
 };
 window.addEventListener('scroll', revealInView, { passive: true });
 window.addEventListener('resize', revealInView, { passive: true });
 revealInView();
 setTimeout(revealInView, 300);
 // Hard guarantee, independent of rAF: nothing ever stays invisible.
 setTimeout(() => document.querySelectorAll('.n-fade:not(.visible)').forEach(el => el.classList.add('visible')), 1500);
 // Wire up the observer for the nice in-view fade animation when the page is actually painting.
 requestAnimationFrame(() => {
  document.querySelectorAll('.n-fade:not(.visible)').forEach(el => observer.observe(el));
 });
}
window.initScrollAnimations = initScrollAnimations;

// ── ACTIVE NAV HIGHLIGHTING ──
// Highlights the current page in the navigation
function setActiveNav() {
 const path = window.location.pathname.split('/').pop() || 'index.html';
 const navLinks = document.querySelectorAll('.n-nav-inner a[href], nav a[href]');
 navLinks.forEach(link => {
  const href = link.getAttribute('href');
  if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
  const linkPath = href.split('/').pop().split('#')[0] || 'index.html';
  if (linkPath === path) {
   // Add subtle active styling
   link.style.color = 'var(--red)';
   link.style.fontWeight = '700';
  }
 });
}
window.setActiveNav = setActiveNav;

// Restore saved language from localStorage on page load (so EN/DE persists across pages)
// Falls back to 'de' if no preference saved (German is the site default)
function restoreNivellLang() {
 try {
  const saved = localStorage.getItem('nivell_lang');
  const lang = (saved && window.T && window.T[saved]) ? saved : 'de';
  if (window.T && window.T[lang]) {
   setNivellLang(lang, window.T);
   const opt = document.querySelector('.lang-opt[data-lang="'+lang+'"]');
   if (opt) updateLangUI(lang, opt);
  }
 } catch (e) {}
}
window.restoreNivellLang = restoreNivellLang;

// Auto-init on DOMContentLoaded
if (document.readyState === 'loading') {
 document.addEventListener('DOMContentLoaded', () => { initScrollAnimations(); setActiveNav(); restoreNivellLang(); });
} else {
 initScrollAnimations();
 setActiveNav();
 restoreNivellLang();
}

// ── LANGUAGE UI UPDATE ──
// Updates the flag/code display in the lang switcher UI
function updateLangUI(lang, clickedEl) {
 const codeEl = document.getElementById('lCode');
 if (codeEl) codeEl.textContent = lang.toUpperCase();
 document.querySelectorAll('.lang-opt').forEach(el => el.classList.remove('active'));
 if (clickedEl) clickedEl.classList.add('active');
}
window.updateLangUI = updateLangUI;

// ── SCROLL-HIDE NAV (hysteresis) ──
(function(){
  var nav = document.querySelector('.n-nav, nav.n-nav, nav[class*="n-nav"]') || document.querySelector('nav');
  var lastY = 0;
  if (!nav) return;
  nav.classList.add('n-nav'); // ensure class exists for hdr-hide to work
  window.addEventListener('scroll', function(){
    var y = window.pageYOffset;
    if (y <= 0) { nav.classList.remove('hdr-hide'); lastY = 0; return; }
    if (y < lastY - 8) { nav.classList.remove('hdr-hide'); }
    else if (y > lastY + 5 && y > 80) { nav.classList.add('hdr-hide'); }
    lastY = y;
  }, { passive: true });
})();


// ── LANGUAGE DROPDOWN: click/tap toggle ──
// Hover alone is unreliable (gap to menu breaks it on desktop; no hover on touch).
document.addEventListener('click', function (e) {
  var lb = e.target.closest('.lang-btn');
  if (lb) {
    if (e.target.closest('.lang-opt')) lb.classList.remove('open'); // language chosen → close
    else lb.classList.toggle('open');                               // toggled the button
  } else {
    document.querySelectorAll('.lang-btn.open').forEach(function (x) { x.classList.remove('open'); });
  }
});

// ── MOBILE NAV TOGGLE ──
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  const btn = document.getElementById('hamburger');
  if (!menu) return;
  const open = menu.classList.toggle('open');
  if (btn) { btn.classList.toggle('open', open); btn.setAttribute('aria-expanded', open); }
}
window.toggleMenu = toggleMenu;

// ── FAQ TOGGLE ──
function toggleNivellFaq(btn) {
  const item = btn.closest('.n-faq-item');
  if (!item) return;
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.n-faq-item.open').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}
window.toggleNivellFaq = toggleNivellFaq;

// ── NAV DROPDOWN (JS-controlled with close delay) ──
(function() {
  var timers = new Map();
  function initDropdowns() {
    document.querySelectorAll('.n-dropdown').forEach(function(dd) {
      dd.addEventListener('mouseenter', function() {
        clearTimeout(timers.get(dd));
        dd.classList.add('open');
      });
      dd.addEventListener('mouseleave', function() {
        var t = setTimeout(function() { dd.classList.remove('open'); }, 200);
        timers.set(dd, t);
      });
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDropdowns);
  } else {
    initDropdowns();
  }
})();
