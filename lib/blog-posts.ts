/**
 * Blog posts. Each post has bilingual content; Slovenian is the primary
 * SEO target since the rental business is local. The content array is a
 * sequence of typed blocks the renderer interprets — simple but enough
 * for the long-form needs without pulling in MDX.
 */

export type BlogBlock =
  | { kind: "p"; text: string }
  | { kind: "h2"; text: string }
  | { kind: "h3"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "ol"; items: string[] }
  | { kind: "quote"; text: string }
  | { kind: "image"; src: string; alt: string; caption?: string }
  | { kind: "cta"; text: string; href: string; label: string };

export type BlogLocaleContent = {
  title: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  blocks: BlogBlock[];
};

export type BlogPost = {
  slug: string;
  publishedAt: string; // YYYY-MM-DD
  readingMinutes: number;
  cover: { src: string; alt: string };
  category: "guide" | "howto" | "price" | "locations" | "gear";
  sl: BlogLocaleContent;
  en: BlogLocaleContent;
};

export const BLOG_POSTS: readonly BlogPost[] = [
  /* ───────────── Post 1 — What is an e-foil ───────────── */
  {
    slug: "kaj-je-efoil",
    publishedAt: "2026-06-01",
    readingMinutes: 6,
    cover: { src: "/hero.jpg", alt: "E-foil rider gliding above tropical water" },
    category: "guide",
    sl: {
      title: "Kaj je e-foil? Popoln vodič za začetnike v 2026",
      excerpt: "Vse, kar moraš vedeti o e-foilingu — kako deluje, kdo ga lahko vozi, kje ga preizkusiš v Sloveniji.",
      metaTitle: "Kaj je e-foil? Popoln vodič za začetnike 2026 | Surf-Store",
      metaDescription: "E-foil je električna deska s podvodnim krilom, ki te dvigne nad gladino. Kako deluje, koliko stane in kje ga preizkusiš v Sloveniji — Surf-Store.com.",
      keywords: "kaj je e-foil, e-foil za začetnike, električni hidrofoil, e-foil Slovenija, kako deluje e-foil, e-foil vodič",
      blocks: [
        { kind: "p", text: "E-foil (kratko za »electric hydrofoil«) je sodobna vodna deska z električnim motorjem in podvodnim krilom — t. i. foilom — ki ob določeni hitrosti celotno desko dvigne nad gladino. Občutek je nekje med surfanjem, drsenjem in letenjem: tiho, brez stika z valovi, skoraj brez upora." },
        { kind: "p", text: "V Sloveniji je e-foil v zadnjih dveh letih postal eden najhitreje rastočih vodnih športov. V tem vodiču boš izvedel, kako tehnika dela, kdo jo lahko vozi, koliko stane in kako se naučiš letenja v eni sami uri." },
        { kind: "h2", text: "Kako deluje e-foil?" },
        { kind: "p", text: "E-foil sestavljajo štirje glavni deli, ki skupaj ustvarijo občutek leta nad vodo:" },
        { kind: "ul", items: [
          "Deska — karbonska ali EPS konstrukcija z volumnom 35–110 L, s sistemom za hitro pritrditev foila.",
          "Hidrofoil (foil) — krilo pod vodo, ki ob hitrosti ~12 km/h ustvari dovolj vzgona, da dvigne celotno desko v zrak.",
          "Električni motor in propeler — brezkrtačni motor (običajno 4–10 kW) z zaščitenim propelerjem, nameščen na vrhu foila tik pod desko.",
          "Litij-ion baterija in brezžični sprožilec — baterija je v deski, sprožilec v roki krmili moč v 7+ stopnjah."
        ]},
        { kind: "p", text: "Ko sprožiš motor, deska pridobi hitrost. Pri okoli 15 km/h foil ustvari dovolj vzgona, da te dvigne v zrak — tipično 50 cm do 1 m nad gladino. Brez valov, brez vetra, brez vlečnega čolna." },
        { kind: "image", src: "/action-1.jpg", alt: "Vzlet z e-foilom — rider 1 m nad gladino", caption: "Pri 15 km/h foil dvigne celotno desko nad vodno gladino — občutek leta brez valov." },
        { kind: "h2", text: "Komu je e-foil namenjen?" },
        { kind: "p", text: "Pravzaprav skoraj vsem. Za razliko od klasičnega surfanja e-foil ne zahteva valov, kondicije ali izkušenj. Naši najmlajši riderji imajo 14 let, najstarejši pa več kot 65. Posebej priljubljen je pri:" },
        { kind: "ul", items: [
          "Začetnikih, ki si želijo občutek surfanja brez čakanja na valove.",
          "Izkušenih watersportašev (kiterji, wingfoilerji), ki iščejo dodatno disciplino.",
          "Družinah, kjer se vsak udeleženec — od najstnika do starega starša — nauči v istem dnevu.",
          "Hotelih in turističnih centrih kot premium doživetje za goste."
        ]},
        { kind: "h2", text: "Kako hitro se naučiš e-foilanja?" },
        { kind: "p", text: "Po naših podatkih 90 % gostov leti znotraj prve ure. Tipičen potek prve šole z inštruktorjem na Green Lake izgleda takole:" },
        { kind: "ol", items: [
          "0–10 min — Brifing na obali: oprema, varnost, kontrole, kaj pričakovati.",
          "10–20 min — Klečeč start v vodi: občutek za sprožilec in ravnotežje.",
          "20–40 min — Stoječa vožnja brez foila: privajanje na desko v gibanju.",
          "40–60 min — Prvi vzlet: ko pravilno preneseš težo, te foil dvigne — magičen trenutek."
        ]},
        { kind: "p", text: "V 60 minutah večina že leti samostojno. Po dveh urah obvladaš tudi obrate in spremembe smeri." },
        { kind: "cta", text: "Pripravljen na svoj prvi vzlet?", href: "/tecaji", label: "Poglej naše tečaje" },
        { kind: "h2", text: "Koliko stane e-foil?" },
        { kind: "p", text: "Komplet Duotone Foil Cruise Set AL — naša rental konfiguracija — stane v trgovini med 8.000 in 12.000 €. Za najem je veliko ugodnejše: 30-minutni taster pri nas stane 70 €, dnevni najem 199 €, vikend (sob–ned) 350 €, tedenski najem 1.100 €." },
        { kind: "p", text: "Ena polnjenje baterije je dovolj za 30–60 minut intenzivne vožnje ali do 2 uri umirjenega krstarjenja. Imamo dve bateriji — eno uporabljaš, druga se polni v približno eni uri." },
        { kind: "h2", text: "Kje preizkusiti e-foil v Sloveniji?" },
        { kind: "p", text: "Glavna baza Surf-Store.com je Green Lake v Kidričevu — mirne vode, idealne za začetnike. Po dogovoru izvajamo tečaje tudi na Murski Soboti, Kamešnici in v Mariboru. Vremenske napovedi spremljamo dnevno in po potrebi termin brezplačno prestavimo." },
        { kind: "cta", text: "Pridi, preizkusi, zaljubi se v e-foiling.", href: "/", label: "Rezerviraj termin" }
      ]
    },
    en: {
      title: "What is an e-foil? Complete 2026 beginner's guide",
      excerpt: "Everything you need to know about e-foiling — how it works, who can ride it, where to try it in Slovenia.",
      metaTitle: "What is an e-foil? Complete 2026 beginner's guide | Surf-Store",
      metaDescription: "An e-foil is an electric board with an underwater wing that lifts you above the surface. How it works, what it costs, and where to try it in Slovenia.",
      keywords: "what is an e-foil, e-foil beginners, electric hydrofoil, e-foil Slovenia, how e-foil works",
      blocks: [
        { kind: "p", text: "An e-foil (short for \"electric hydrofoil\") is a modern board with an electric motor and a submerged wing — the foil — that lifts the whole board above the water once it reaches a certain speed. It feels somewhere between surfing, sailing and flying: silent, no wave contact, almost no drag." },
        { kind: "p", text: "In Slovenia, e-foiling has become one of the fastest-growing watersports over the last two years. In this guide you'll learn how the technology works, who can ride it, what it costs and how you can learn to fly within a single hour." },
        { kind: "h2", text: "How does an e-foil work?" },
        { kind: "ul", items: [
          "Board — carbon or EPS construction, 35–110 L volume, with a quick-mount foil track.",
          "Hydrofoil — the underwater wing that, at ~12 km/h, generates enough lift to raise the whole board.",
          "Electric motor + shrouded propeller — 4–10 kW brushless motor mounted at the top of the foil.",
          "Li-ion battery + wireless trigger — 7+ power steps controlled with your hand."
        ]},
        { kind: "p", text: "Once you trigger the motor the board accelerates. At around 15 km/h the foil produces enough lift to raise you 50 cm to 1 m above the surface — no waves, no wind, no tow boat needed." },
        { kind: "image", src: "/action-1.jpg", alt: "Rider flying on an e-foil one meter above the water" },
        { kind: "cta", text: "Ready for your first flight?", href: "/tecaji", label: "See our courses" }
      ]
    }
  },

  /* ───────────── Post 2 — How to learn ───────────── */
  {
    slug: "kako-se-nauciti-efoilanja",
    publishedAt: "2026-06-03",
    readingMinutes: 5,
    cover: { src: "/action-2.jpg", alt: "Učenec na e-foilu z inštruktorjem" },
    category: "howto",
    sl: {
      title: "Kako se naučiti e-foilanja v 1 dnevu — 5 korakov do prvega vzleta",
      excerpt: "Preverjen 5-stopenjski program, ki ga uporabljamo v naši šoli. Brez izkušenj, brez strahu, brez čakanja.",
      metaTitle: "Kako se naučiti e-foilanja v 1 dnevu — 5 korakov | Surf-Store",
      metaDescription: "Preverjeni 5-stopenjski program e-foil tečaja. 90 % gostov leti že po prvi uri. Najdi vse korake, nasvete in cene.",
      keywords: "kako se naučiti e-foilanja, e-foil učenje, e-foil tečaj, prvi vzlet, e-foil začetnik, šola e-foilinga",
      blocks: [
        { kind: "p", text: "E-foilanje izgleda kot magija — človek tiho lebdi 1 meter nad vodo, brez valov in brez napora. V resnici pa je veščina, ki jo večina ljudi obvlada v 60 minutah z dobrim inštruktorjem. Tukaj je preverjen 5-stopenjski program, ki ga uporabljamo na vseh naših tečajih." },
        { kind: "h2", text: "1. Brifing na obali (10 minut)" },
        { kind: "p", text: "Pred vstopom v vodo z inštruktorjem pregledamo opremo, sprožilec in varnostne ukrepe. Pomembno: e-foil propeler je zaščiten z mrežo, kontrola motorja pa ima programirano krivuljo, ki preprečuje sunkovite pospeške." },
        { kind: "p", text: "Naučiš se osnovne kontrole: kako prižgati motor, kako uravnavati moč in kako varno padeti (vedno proč od deske)." },
        { kind: "h2", text: "2. Klečeč start v vodi (10 minut)" },
        { kind: "p", text: "Prva vožnja je na trebuhu, nato na kolenih. To je faza, kjer se naučiš občutka za sprožilec — kako blag pritisk pomeni mirno drsenje, polni pritisk pa hitrost vzleta. Nobenega vzleta še ni." },
        { kind: "image", src: "/board-1.webp", alt: "Učenec na klečečem startu", caption: "Prvi občutek za sprožilec preden poskusiš stojo." },
        { kind: "h2", text: "3. Stoječa vožnja brez foila (15–20 minut)" },
        { kind: "p", text: "Iz klečečega položaja vstaneš na desko. Voziš v ravni liniji po gladini — še vedno na vodi, brez vzleta. Tukaj se naučiš tehnike drže (kolena rahlo upognjena, pogled naprej, teža sredina deske)." },
        { kind: "h3", text: "Najpogostejša napaka v tej fazi" },
        { kind: "p", text: "Začetniki pogosto vlečejo težo preveč nazaj, ker se bojijo, da bodo padli naprej. Posledica: foil hitro dvigne nos in zadnja noga ti pobegne. Inštruktor te bo opozoril takoj, ko zazna napako." },
        { kind: "h2", text: "4. Prvi vzlet (10–15 minut)" },
        { kind: "p", text: "Ko obvladaš stojo, je čas za vzlet. Postopno prenesi težo na sprednjo nogo — približno 60/40 razmerje — in povečaj moč na sprožilcu. Foil pridobi vzgon in te dvigne v zrak. Prvi občutek je nepozaben: zvok motorja izgine, čutiš samo veter in voda postane gladka." },
        { kind: "cta", text: "Hočeš preizkusiti?", href: "/tecaji", label: "Rezerviraj začetni tečaj" },
        { kind: "h2", text: "5. Stabilizacija in prvi obrati (20+ minut)" },
        { kind: "p", text: "V prvi uri večina že leti samostojno. V naslednjih 30 minutah delamo na stabilnosti — kako ostati na enem nivoju, kako se ne dvigniti previsoko in kako narediti prve nežne obrate s prenosom teže." },
        { kind: "p", text: "Nadaljevalni tečaj (4 ure, razdeljen na 2 dni) je za riderje, ki bi radi dodali carving, video analizo in daljše drsenje brez izpadov." },
        { kind: "h2", text: "Koliko stane tečaj?" },
        { kind: "ul", items: [
          "30-minutni taster — 70 € (idealen za začetnike, ki bi radi občutek pred polnim tečajem)",
          "Začetni tečaj 2 uri — 199 €",
          "Nadaljevalni tečaj 4 ure / 2 dni — 400 €",
          "Privatni tečaj — po dogovoru"
        ]},
        { kind: "p", text: "Vsa oprema, čelada, reševalni jopič in neopren (sezonsko) so vključeni v ceno." },
        { kind: "cta", text: "Pridi, leti, zaljubi se.", href: "/tecaji", label: "Poglej vse tečaje" }
      ]
    },
    en: {
      title: "How to learn e-foiling in 1 day — 5 steps to your first flight",
      excerpt: "Our proven 5-step programme. No experience needed. 90 % of guests fly within the first hour.",
      metaTitle: "How to learn e-foiling in 1 day — 5 steps | Surf-Store",
      metaDescription: "Our proven 5-step e-foil course programme. 90 % of guests fly within the first hour.",
      keywords: "how to learn e-foiling, e-foil lessons, e-foil course, first flight, e-foil for beginners",
      blocks: [
        { kind: "p", text: "E-foiling looks like magic — silently flying 1 meter above the water. In reality it's a skill most people master in 60 minutes with a good instructor. Here is the proven 5-step programme we use in all our courses." },
        { kind: "h2", text: "1. Shore briefing (10 min)" },
        { kind: "p", text: "Equipment, trigger, safety. The propeller is fully shrouded; the motor has a programmed power curve preventing sudden surges." },
        { kind: "h2", text: "2. Kneeling start (10 min)" },
        { kind: "p", text: "First on the belly, then on the knees. You learn the feel of the trigger before standing." },
        { kind: "h2", text: "3. Standing without lift-off (15–20 min)" },
        { kind: "p", text: "Stand up and ride on the surface in a straight line — no flying yet." },
        { kind: "h2", text: "4. First lift-off (10–15 min)" },
        { kind: "p", text: "Shift weight forward to about 60/40 and apply more throttle. The foil lifts you." },
        { kind: "h2", text: "5. Stabilization & first turns (20+ min)" },
        { kind: "p", text: "Hold a steady altitude and try gentle turns with weight shifts." },
        { kind: "cta", text: "Come, try, fall in love.", href: "/tecaji", label: "See all courses" }
      ]
    }
  },

  /* ───────────── Post 3 — Pricing ───────────── */
  {
    slug: "cena-najema-efoila-slovenija",
    publishedAt: "2026-06-05",
    readingMinutes: 5,
    cover: { src: "/board-1.webp", alt: "Duotone Foil Cruise Set AL na vodi" },
    category: "price",
    sl: {
      title: "Koliko stane najem e-foila v Sloveniji? Pregled cen 2026",
      excerpt: "Od 30-minutnega tasterja do dvotedenskega najema. Vse cene, paketi in skriti stroški jasno na enem mestu.",
      metaTitle: "Cena najema e-foila v Sloveniji 2026 — pregled | Surf-Store",
      metaDescription: "Koliko stane najem e-foila v Sloveniji? Cene od 70 € (30 min) do 1.990 € (2 tedna). Vse vključeno, brez skritih stroškov.",
      keywords: "cena e-foil, najem e-foil cena, koliko stane e-foil, e-foil paketi, e-foil Slovenija cenik, najem e-foil Slovenija",
      blocks: [
        { kind: "p", text: "Najem e-foila v Sloveniji je v 2026 še vedno razmeroma nov koncept, zato so razlike v cenah med ponudniki precejšnje. V tem članku razložimo, kaj plačaš in kaj dobiš, ter kako se naši paketi primerjajo z drugimi watersports doživetji." },
        { kind: "h2", text: "Cene v Surf-Store.com — pregled 2026" },
        { kind: "ul", items: [
          "30 min — Taster: 70 €",
          "Dnevni najem (24 h): 199 €",
          "Vikend (sob–ned, prevzem petek po 17:00): 350 €",
          "1 teden (7 dni, fiksna cena): 1.100 € (157 €/dan)",
          "2 tedna — VIP: 1.990 € (142 €/dan)"
        ]},
        { kind: "p", text: "Vse cene vključujejo desko Duotone Midwish 5'8, Foil Cruise Set AL, dve bateriji, polnilnik, čelado, reševalni jopič in neopren (sezonsko). Inštruktor je vključen pri 30-minutnem tasterju in tečajih." },
        { kind: "image", src: "/action-2.jpg", alt: "E-foil v akciji" },
        { kind: "h2", text: "Zakaj cena raste z dnevi padajoče?" },
        { kind: "p", text: "Cena na dan se zmanjšuje, ker dlje kot je oprema pri tebi, manjši so naši logistični stroški (prevzem, pregled, polnjenje). Pri tedenskem najemu plačaš 157 € na dan namesto 199 € — to je 21 % popust. Pri dvotedenskem 142 € na dan (29 % popust)." },
        { kind: "h2", text: "Kaj NI vključeno?" },
        { kind: "p", text: "Iskreno: zelo malo." },
        { kind: "ul", items: [
          "Varščina za večdnevne najeme (3+ dni): 500 € na bančni kartici, takoj povrnjena po vrnitvi opreme brez vidnih poškodb.",
          "Prevoz opreme do izven naših 4 lokacij (Green Lake, Murska Sobota, Kamešnica, Maribor) — po dogovoru proti doplačilu.",
          "Poškodbe nad obseg »normalnega obrabljenja« — manjše praske krijemo iz polog, večje poškodbe (lom foila, motorja, baterije) po servisnih cenah Duotone."
        ]},
        { kind: "h2", text: "Probaj, potem kupi — kreditiranje izposoje" },
        { kind: "p", text: "Posebna ponudba: če se po izposoji odločiš za nakup foil deske v naši spletni trgovini, ti enodnevni najem (199 €) odštejemo od končne cene deske. Tako da en dan najema postane brezplačen testni vozić." },
        { kind: "cta", text: "Preveri trgovino", href: "https://www.surf-store.com/t/categories/e-foil/e-foil-sets", label: "Oglej si Duotone e-foil sete" },
        { kind: "h2", text: "Primerjava z drugimi watersports v Sloveniji" },
        { kind: "ul", items: [
          "Najem jet-ski (1 h): 80–150 €. Hrupno, drago gorivo, omejene lokacije.",
          "Wakeboard z vlečnico (1 ura): 25–40 €. Cenejše, a omejeno na vlečnice in dolge vrste.",
          "Najem SUP-a (cel dan): 25–40 €. Cenejše, brez adrenalina.",
          "E-foil (cel dan): 199 €. Prva pravo doživetje letenja brez goriva, brez hrupa, brez čakanja."
        ]},
        { kind: "p", text: "E-foil ni najcenejši, je pa edinstveno doživetje, ki ga drugi športi ne ponudijo. Plačaš za tihoto, čistost in občutek leta." },
        { kind: "cta", text: "Pripravljen rezervirati?", href: "/", label: "Pojdi na rezervacijo" }
      ]
    },
    en: {
      title: "What does e-foil rental cost in Slovenia? 2026 price guide",
      excerpt: "From a 30-minute taster to a two-week rental. All pricing and packages transparently in one place.",
      metaTitle: "E-foil rental price Slovenia 2026 — guide | Surf-Store",
      metaDescription: "How much does e-foil rental cost in Slovenia? From €70 (30 min) to €1,990 (2 weeks). All-inclusive.",
      keywords: "e-foil price, e-foil rental cost, e-foil Slovenia pricing, e-foil packages",
      blocks: [
        { kind: "p", text: "E-foil rental in Slovenia is still a fairly new concept in 2026, so prices vary between providers. Here is what you pay and what you get with Surf-Store.com." },
        { kind: "h2", text: "Surf-Store.com prices — 2026" },
        { kind: "ul", items: [
          "30-min taster: €70",
          "Day rental (24 h): €199",
          "Weekend (Sat–Sun): €350",
          "1 week: €1,100 (€157/day)",
          "2 weeks — VIP: €1,990 (€142/day)"
        ]},
        { kind: "cta", text: "Ready to book?", href: "/", label: "Go to booking" }
      ]
    }
  },

  /* ───────────── Post 4 — Locations ───────────── */
  {
    slug: "najboljse-lokacije-efoil-slovenija",
    publishedAt: "2026-06-07",
    readingMinutes: 6,
    cover: { src: "/green-lake.webp", alt: "Green Lake Kidričevo iz zraka" },
    category: "locations",
    sl: {
      title: "5 najboljših lokacij za e-foil v Sloveniji",
      excerpt: "Od Green Lake do morja — kje voziti e-foil, kakšni so pogoji in kaj morate vedeti o lokalnih pravilih.",
      metaTitle: "Kje e-foilati v Sloveniji? 5 najboljših lokacij 2026 | Surf-Store",
      metaDescription: "Pregled 5 najboljših slovenskih lokacij za e-foil — Green Lake, Bohinjsko, Velenjsko, Soboško jezero in Adriatik. Pogoji, pravila, dovoljenja.",
      keywords: "e-foil lokacije Slovenija, kje e-foilati Slovenija, jezera za e-foil, Green Lake Kidričevo, e-foil Bohinj, e-foil morje",
      blocks: [
        { kind: "p", text: "Slovenija je z mirnimi jezeri in tihimi zalivi popolna za e-foiling. V tem članku predstavljamo 5 najboljših lokacij, kjer lahko sami ali z našim inštruktorjem preizkusiš svoj prvi let nad vodo. Pri vsaki lokaciji navedemo tudi pravila in dovoljenja, ki so trenutno v veljavi." },
        { kind: "h2", text: "1. Green Lake, Kidričevo — naša glavna baza" },
        { kind: "p", text: "Green Lake (lokalno: Zeleno jezero) v Kidričevu je naš primarni izvajalski center. Tukaj imamo bazo opreme, polnilnice in inštruktorje na razpolago vse leto." },
        { kind: "h3", text: "Zakaj Green Lake?" },
        { kind: "ul", items: [
          "Zelo mirna voda — idealno za začetnike.",
          "Brez tokov, brez velikih plovil.",
          "Hitro dostopen iz Maribora (25 min) in Ljubljane (90 min).",
          "Razvit pomol in zaledne storitve (parking, garderoba, polnjenje)."
        ]},
        { kind: "image", src: "/green-lake.webp", alt: "Green Lake iz zraka", caption: "Mirne vode Green Lake — naš dom in najboljša lokacija za prve vzlete." },
        { kind: "h2", text: "2. Bohinjsko jezero — alpska scenografija" },
        { kind: "p", text: "Največje stalno alpsko jezero v Sloveniji. Bohinjsko jezero ponuja izjemne razglede, vendar je tu nekaj omejitev." },
        { kind: "p", text: "E-foil je tu dovoljen le z električnim pogonom (kar smo) in z dovoljenjem TNP (Triglavski narodni park). Priporočamo jutranje vožnje pred 10. uro, ko je voda najmirnejša in turistov manj." },
        { kind: "h2", text: "3. Velenjsko jezero" },
        { kind: "p", text: "Velenjsko jezero je v zadnjih letih postalo center watersportov v Šaleški dolini. Sosednje Skornje in Družmirsko jezero so manjše alternative." },
        { kind: "p", text: "Tukaj ni posebnih omejitev za električne plovne objekte, mestna občina pa je naklonjena watersport razvoju. Odlična izbira za rekreativne riderje, ki bi se radi izognili turistom Bohinja." },
        { kind: "h2", text: "4. Soboško jezero, Murska Sobota" },
        { kind: "p", text: "Naša sekundarna lokacija. Po dogovoru izvajamo tudi vikend tečaje na Soboškem jezeru. Mirne vode, kratke razdalje, manj zasedeno kot turistični destinaciji." },
        { kind: "cta", text: "Tečaj v Murski Soboti?", href: "/tecaji", label: "Pošlji povpraševanje" },
        { kind: "h2", text: "5. Slovenska Istra — Adriatik" },
        { kind: "p", text: "Za izkušene riderje, ki si želijo izziv valov in slanega okolja, je Adriatik (Piran, Strunjan, Izola) odlična izbira. Pomembna opomba: e-foil potrebuje dovoljenje za plovbo iste vrste kot SUP — to lahko pridobiš pri Upravi RS za pomorstvo." },
        { kind: "p", text: "Kondicija za morje je zahtevnejša kot za jezero — predvsem zaradi valov in toka. Priporočamo, da preden voziš na morju, opraviš vsaj nadaljevalni tečaj na mirnih vodah." },
        { kind: "h2", text: "Splošna pravila in dovoljenja v Sloveniji" },
        { kind: "p", text: "Trenutno je e-foiling v Sloveniji urejen kot električni vodni plovni objekt. Glavni pogoji:" },
        { kind: "ul", items: [
          "Najnižja starost: 14 let (z dovoljenjem staršev).",
          "Obvezna oprema: reševalni jopič, kill switch.",
          "Na zaščitenih območjih (TNP, Krajinski parki): preveri lokalna pravila.",
          "Brez dovoljenja za plovbo se voziš samo na rekreativnih jezerih, ki nimajo plovnega prometa.",
          "Na morju je potrebno dovoljenje Uprave RS za pomorstvo."
        ]},
        { kind: "cta", text: "Začni z Green Lake.", href: "/", label: "Rezerviraj termin" }
      ]
    },
    en: {
      title: "5 best e-foil spots in Slovenia",
      excerpt: "From Green Lake to the Adriatic — where to ride, what conditions to expect, and local rules.",
      metaTitle: "Where to e-foil in Slovenia? 5 best spots 2026 | Surf-Store",
      metaDescription: "5 best Slovenian e-foil spots — Green Lake, Bohinj, Velenje, Murska Sobota and the Adriatic. Conditions, rules, permits.",
      keywords: "e-foil locations Slovenia, e-foil spots, Green Lake Kidricevo, Slovenia e-foil",
      blocks: [
        { kind: "p", text: "With calm lakes and quiet coves, Slovenia is perfect for e-foiling. Here are 5 of the best spots." },
        { kind: "h2", text: "1. Green Lake, Kidričevo" },
        { kind: "p", text: "Our home base — calm water, easy access, full service." },
        { kind: "h2", text: "2. Lake Bohinj" },
        { kind: "p", text: "Stunning alpine setting. Permits required inside the Triglav National Park." },
        { kind: "h2", text: "3. Lake Velenje" },
        { kind: "p", text: "Less crowded; the city is watersport-friendly." },
        { kind: "h2", text: "4. Lake Murska Sobota" },
        { kind: "p", text: "Our secondary spot — calm water, weekend courses." },
        { kind: "h2", text: "5. Slovenian Adriatic — Piran, Strunjan, Izola" },
        { kind: "p", text: "For experienced riders. Maritime navigation permit required." },
        { kind: "cta", text: "Start at Green Lake.", href: "/", label: "Book a slot" }
      ]
    }
  },

  /* ───────────── Post 5 — Duotone gear review ───────────── */
  {
    slug: "duotone-foil-cruise-set-al-pregled",
    publishedAt: "2026-06-09",
    readingMinutes: 7,
    cover: { src: "/board-3.jpg", alt: "Duotone Foil Cruise Set AL" },
    category: "gear",
    sl: {
      title: "Duotone Foil Cruise Set AL — pregled, mnenje in tehnične specifikacije 2026",
      excerpt: "Test po 200 urah uporabe. Komu se splača, kakšne so pomanjkljivosti in zakaj je ta set naša izbira za rental.",
      metaTitle: "Duotone Foil Cruise Set AL — pregled in mnenje 2026 | Surf-Store",
      metaDescription: "Pregled Duotone Foil Cruise Set AL — celotne specifikacije, test po 200 urah, primerjava z D/LAB karbonom. Za koga je ta set primeren.",
      keywords: "Duotone Foil Cruise Set AL, Duotone e-foil pregled, Duotone foil mnenje, Cruise mast AL, Duotone Midwish 5'8",
      blocks: [
        { kind: "p", text: "Duotone Foil Cruise Set AL je aluminijasta različica Duotonovega foil sistema — robustna, dostopnejša in popolnoma kompatibilna z D/LAB karbonsko mast. V Surf-Store.com smo ta set izbrali kot našo primarno rental konfiguracijo. Po 200+ urah uporabe v različnih pogojih predstavljamo iskren pregled." },
        { kind: "image", src: "/board-3.jpg", alt: "Duotone Foil Cruise Set AL detajl" },
        { kind: "h2", text: "Kaj je v paketu?" },
        { kind: "ul", items: [
          "Duotone Foil Assist Cruise Mast AL (80 cm, 3,55 kg)",
          "Sprednje krilo 1600 cm² (idealno za začetnike in srednje izkušene)",
          "Zadnje krilo PX 225 cm²",
          "eHarness z baterijo (3,76 kg skupaj)",
          "Dve LiPo baterije (7 Ah, 22,8 V, 159,6 Wh vsaka)",
          "Polnilnik (čas polnjenja ~1 ura)",
          "Brezžični sprožilec z 7 stopnjami hitrosti"
        ]},
        { kind: "p", text: "Naš rental setup kombinira ta foil set z desko Duotone Midwish 5'8 — krajša, stabilna deska s 90 L volumnom, ki je idealna za vsestransko rabo." },
        { kind: "h2", text: "Tehnične specifikacije" },
        { kind: "ul", items: [
          "Maksimalni čas vožnje: 30–60 min na polnjenje",
          "Maksimalna hitrost: 40+ km/h",
          "Stopnje moči: 7",
          "Težnost voznika: 40–110 kg",
          "Minimalni volumen deske: 35 L+",
          "Velikost pasu (harness): S/M 71–89 cm, L/XXL 89–114 cm"
        ]},
        { kind: "h2", text: "Vzlet in občutek" },
        { kind: "p", text: "Cruise Mast je kratek (80 cm), kar pomeni nižji vzlet — približno 50 cm nad gladino namesto 80 cm pri daljši Assist mast. To je prednost za začetnike: padci so nižji, vmesni pojav »ventilacije« (ko se foil dvigne preveč in izgubi vzgon) je manjši." },
        { kind: "p", text: "Sprednje krilo 1600 cm² je velika in stabilna ploskev — odpušča napake, zato je primerna za začetnike. Bolj izkušeni riderji preklopijo na manjše krilo (npr. 900 cm²), ki ponudi več hitrosti in agilnosti." },
        { kind: "cta", text: "Probaj v živo", href: "/", label: "Rezerviraj termin" },
        { kind: "h2", text: "Vzdržljivost in obraba" },
        { kind: "p", text: "Aluminijasta mast je robustna. Po 200 urah uporabe nimamo nobene strukturne poškodbe — le manjše praske na noseči ploskvi. V primerjavi z D/LAB karbonom je AL težji za 450 gramov, vendar tudi 3x bolj odporen na udarce in mnogo cenejši." },
        { kind: "p", text: "Baterija je glavna obrabna komponenta. Pri pravilni negi (ne shranjuj polno polnjeno, ne praznjenje pod 10 %) zdrži približno 500 polnih ciklov pred opaznim padcem kapacitete." },
        { kind: "h2", text: "Komu priporočamo?" },
        { kind: "ul", items: [
          "Začetnikom in srednje izkušenim riderjem — manjši vzlet in odpuščajoče krilo.",
          "Družinam, ki bi rade več voznikov delile en set.",
          "Šolam in turističnim centrom, ki potrebujejo robustnost.",
          "Občasnim uporabnikom, ki ne potrebujejo zadnjega gram-shave karbona."
        ]},
        { kind: "h2", text: "Kdaj iti na D/LAB karbon?" },
        { kind: "p", text: "Če si advance/pro rider in te zanima carving, freestyle ali pump-foiling, ti bo Cruise AL hitro pretežak. Takrat preskoči direktno na D/LAB karbon mast (3,0 kg, 450 gramov lažja) za vrhunski odziv." },
        { kind: "h2", text: "Cena in kje kupiti" },
        { kind: "p", text: "Komplet (deska + foil + dve bateriji + polnilnik + sprožilec) stane v Surf-Store.com med 8.000 in 9.500 €, odvisno od izbora deske. Cena je primerljiva z drugimi premium ponudniki (Lift, Audi) in nižja od D/LAB karbon različice." },
        { kind: "cta", text: "Poglej Duotone v naši trgovini", href: "https://www.surf-store.com/t/categories/e-foil/e-foil-sets", label: "Surf-Store.com" }
      ]
    },
    en: {
      title: "Duotone Foil Cruise Set AL — review and 2026 specs",
      excerpt: "Tested over 200 hours. Who it suits, where it falls short, why we picked it for our rental fleet.",
      metaTitle: "Duotone Foil Cruise Set AL review 2026 | Surf-Store",
      metaDescription: "Honest 200-hour review of the Duotone Foil Cruise Set AL — full specs, comparison with the D/LAB carbon mast.",
      keywords: "Duotone Foil Cruise Set AL, Duotone e-foil review, Cruise mast AL, Duotone Midwish 5'8",
      blocks: [
        { kind: "p", text: "Duotone Foil Cruise Set AL is the aluminum version of Duotone's foil system — rugged, affordable, fully compatible with the D/LAB carbon mast." },
        { kind: "h2", text: "What's in the box?" },
        { kind: "ul", items: [
          "Cruise Mast AL (80 cm, 3.55 kg)",
          "Front wing 1600 cm²",
          "Back wing PX 225 cm²",
          "eHarness (3.76 kg with batteries)",
          "Two LiPo batteries (159.6 Wh each)",
          "Charger + wireless trigger"
        ]},
        { kind: "h2", text: "Who is it for?" },
        { kind: "p", text: "Beginners and intermediate riders who want robust gear and forgiving handling." },
        { kind: "cta", text: "Try one live", href: "/", label: "Book a session" }
      ]
    }
  }
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
