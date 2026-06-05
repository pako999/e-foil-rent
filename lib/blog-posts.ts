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
  de: BlogLocaleContent;
};

export function localizeBlog(
  post: BlogPost,
  locale: "sl" | "en" | "de",
): BlogLocaleContent {
  if (locale === "sl") return post.sl;
  if (locale === "de") return post.de;
  return post.en;
}

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
    },
    de: {
      title: "Was ist ein E-Foil? Der komplette Einsteiger-Guide 2026",
      excerpt: "Alles, was du über E-Foilen wissen musst — wie es funktioniert, wer es fahren kann, wo du es in Slowenien ausprobierst.",
      metaTitle: "Was ist ein E-Foil? Kompletter Einsteiger-Guide 2026 | Surf-Store",
      metaDescription: "Ein E-Foil ist ein elektrisches Board mit Unterwasserflügel, das dich über die Wasseroberfläche hebt. Wie es funktioniert, was es kostet und wo du es in Slowenien testest — Surf-Store.com.",
      keywords: "was ist ein E-Foil, E-Foil für Anfänger, elektrisches Hydrofoil, E-Foil Slowenien, wie funktioniert E-Foil, E-Foil Guide",
      blocks: [
        { kind: "p", text: "Ein E-Foil (kurz für „Electric Hydrofoil\") ist ein modernes Wasserboard mit Elektromotor und einem Unterwasserflügel — dem sogenannten Foil — der das gesamte Board ab einer bestimmten Geschwindigkeit über die Wasseroberfläche hebt. Das Gefühl liegt irgendwo zwischen Surfen, Gleiten und Fliegen: lautlos, kein Wellenkontakt, fast kein Widerstand." },
        { kind: "p", text: "In Slowenien ist E-Foilen in den letzten zwei Jahren einer der am schnellsten wachsenden Wassersportarten geworden. In diesem Guide erfährst du, wie die Technik funktioniert, wer sie fahren kann, was sie kostet und wie du in nur einer Stunde fliegen lernst." },
        { kind: "h2", text: "Wie funktioniert ein E-Foil?" },
        { kind: "p", text: "Ein E-Foil besteht aus vier Hauptteilen, die zusammen das Gefühl des Fliegens über dem Wasser erzeugen:" },
        { kind: "ul", items: [
          "Board — Carbon- oder EPS-Konstruktion mit 35–110 L Volumen und Track-System für schnelle Foil-Montage.",
          "Hydrofoil — Unterwasserflügel, der bei ca. 12 km/h genug Auftrieb erzeugt, um das ganze Board in die Luft zu heben.",
          "Elektromotor mit Propeller — bürstenloser Motor (typisch 4–10 kW) mit ummanteltem Propeller, oben am Foil direkt unterm Board.",
          "Li-Ion-Akku und kabelloser Trigger — der Akku sitzt im Board, der Trigger in der Hand steuert die Leistung in 7+ Stufen."
        ]},
        { kind: "p", text: "Sobald du den Motor auslöst, beschleunigt das Board. Bei rund 15 km/h erzeugt das Foil genug Auftrieb, um dich 50 cm bis 1 m über die Oberfläche zu heben — ohne Wellen, ohne Wind, ohne Zugboot." },
        { kind: "image", src: "/action-1.jpg", alt: "Lift-off mit dem E-Foil — Rider 1 m über dem Wasser", caption: "Bei 15 km/h hebt das Foil das gesamte Board über die Wasseroberfläche — Fliegen ohne Wellen." },
        { kind: "h2", text: "Für wen ist E-Foil gedacht?" },
        { kind: "p", text: "Eigentlich für fast jeden. Anders als klassisches Surfen braucht E-Foil weder Wellen noch Kondition noch Erfahrung. Unsere jüngsten Rider sind 14 Jahre alt, die ältesten über 65. Besonders beliebt ist es bei:" },
        { kind: "ul", items: [
          "Anfängern, die das Surfgefühl wollen, ohne auf Wellen zu warten.",
          "Erfahrenen Wassersportlern (Kiter, Wingfoiler), die eine neue Disziplin suchen.",
          "Familien, in denen jeder Teilnehmer — vom Teenager bis zu den Großeltern — am selben Tag lernen kann.",
          "Hotels und Tourismuszentren als Premium-Erlebnis für Gäste."
        ]},
        { kind: "h2", text: "Wie schnell lernt man E-Foilen?" },
        { kind: "p", text: "Nach unseren Daten fliegen 90 % der Gäste innerhalb der ersten Stunde. Ein typischer Ablauf der ersten Stunde mit Instruktor am Grünen See sieht so aus:" },
        { kind: "ol", items: [
          "0–10 Min — Briefing am Ufer: Ausrüstung, Sicherheit, Steuerung, was zu erwarten ist.",
          "10–20 Min — Kniender Start im Wasser: Gefühl für Trigger und Balance.",
          "20–40 Min — Stehende Fahrt ohne Foil-Aktion: Eingewöhnung an das Board in Bewegung.",
          "40–60 Min — Erster Lift-off: Bei richtiger Gewichtsverlagerung hebt dich das Foil — der magische Moment."
        ]},
        { kind: "p", text: "Nach 60 Minuten fliegen die meisten schon eigenständig. Nach zwei Stunden beherrschst du auch Kurven und Richtungswechsel." },
        { kind: "cta", text: "Bereit für deinen ersten Lift-off?", href: "/tecaji", label: "Kurse ansehen" },
        { kind: "h2", text: "Was kostet ein E-Foil?" },
        { kind: "p", text: "Das Duotone Foil Cruise Set AL — unser Verleih-Setup — kostet im Shop zwischen 8.000 und 12.000 €. Für den Verleih ist es deutlich günstiger: 30-Minuten-Schnupper kostet bei uns 70 €, Tagesverleih 199 €, Wochenende (Sa–So) 350 €, Wochenverleih 1.100 €." },
        { kind: "p", text: "Eine volle Akkuladung reicht für 30–60 Minuten intensives Riden oder bis zu 2 Stunden entspanntes Cruisen. Wir haben zwei Akkus — du nutzt einen, während der andere in etwa einer Stunde lädt." },
        { kind: "h2", text: "Wo kann man E-Foil in Slowenien testen?" },
        { kind: "p", text: "Hauptbasis von Surf-Store.com ist der Grüne See in Kidričevo — ruhige Gewässer, ideal für Anfänger. Nach Absprache führen wir Kurse auch in Murska Sobota, Kamešnica und Maribor durch. Wettervorhersagen verfolgen wir täglich und buchen bei Bedarf kostenlos um." },
        { kind: "cta", text: "Komm, probier es, verlieb dich ins E-Foilen.", href: "/", label: "Termin reservieren" }
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
    },
    de: {
      title: "E-Foilen an einem Tag lernen — 5 Schritte zum ersten Lift-off",
      excerpt: "Unser bewährtes 5-Schritte-Programm. Ohne Erfahrung, ohne Angst, ohne Wartezeit.",
      metaTitle: "E-Foilen lernen in 1 Tag — 5 Schritte | Surf-Store",
      metaDescription: "Bewährtes 5-Schritte-E-Foil-Kursprogramm. 90 % der Gäste fliegen nach der ersten Stunde. Alle Schritte, Tipps und Preise.",
      keywords: "E-Foilen lernen, E-Foil Unterricht, E-Foil Kurs, erster Lift-off, E-Foil Anfänger, E-Foil Schule",
      blocks: [
        { kind: "p", text: "E-Foilen sieht aus wie Magie — jemand schwebt lautlos 1 Meter über dem Wasser, ohne Wellen, ohne Anstrengung. Tatsächlich ist es eine Fertigkeit, die die meisten Leute mit einem guten Instruktor in 60 Minuten beherrschen. Hier ist das bewährte 5-Schritte-Programm, das wir in allen unseren Kursen verwenden." },
        { kind: "h2", text: "1. Briefing am Ufer (10 Minuten)" },
        { kind: "p", text: "Vor dem Wassergang gehen wir mit dem Instruktor Ausrüstung, Trigger und Sicherheitsmaßnahmen durch. Wichtig: Der E-Foil-Propeller ist von einem Käfig geschützt, und die Motorsteuerung hat eine programmierte Kurve, die ruckartige Beschleunigung verhindert." },
        { kind: "p", text: "Du lernst die Grundsteuerung: Wie du den Motor startest, wie du die Leistung dosierst und wie du sicher fällst (immer weg vom Board)." },
        { kind: "h2", text: "2. Kniender Start im Wasser (10 Minuten)" },
        { kind: "p", text: "Die erste Fahrt ist auf dem Bauch, dann auf den Knien. Das ist die Phase, in der du das Gefühl für den Trigger entwickelst — leichter Druck bedeutet ruhiges Gleiten, voller Druck bedeutet Lift-off-Geschwindigkeit. Noch kein Lift-off." },
        { kind: "image", src: "/board-1.webp", alt: "Lernender beim knienden Start", caption: "Erstes Trigger-Gefühl, bevor du das Stehen probierst." },
        { kind: "h2", text: "3. Stehende Fahrt ohne Foil-Aktion (15–20 Minuten)" },
        { kind: "p", text: "Aus dem knienden Position stehst du auf dem Board auf. Du fährst in gerader Linie über die Oberfläche — noch im Wasser, ohne Lift-off. Hier lernst du die Standtechnik (Knie leicht gebeugt, Blick nach vorn, Gewicht in der Brettmitte)." },
        { kind: "h3", text: "Häufigster Fehler in dieser Phase" },
        { kind: "p", text: "Anfänger verlagern oft zu viel Gewicht nach hinten, weil sie Angst haben, nach vorn zu fallen. Folge: Das Foil zieht die Nase hoch und das hintere Bein bricht weg. Der Instruktor warnt dich sofort, wenn er den Fehler sieht." },
        { kind: "h2", text: "4. Erster Lift-off (10–15 Minuten)" },
        { kind: "p", text: "Wenn du das Stehen beherrschst, ist es Zeit für den Lift-off. Verlagere das Gewicht schrittweise auf das vordere Bein — etwa 60/40-Verhältnis — und erhöhe die Leistung am Trigger. Das Foil bekommt Auftrieb und hebt dich in die Luft. Das erste Gefühl ist unvergesslich: Der Motorklang verschwindet, du spürst nur den Wind und das Wasser wird glatt." },
        { kind: "cta", text: "Willst du es probieren?", href: "/tecaji", label: "Anfängerkurs buchen" },
        { kind: "h2", text: "5. Stabilisierung und erste Kurven (20+ Minuten)" },
        { kind: "p", text: "In der ersten Stunde fliegt die Mehrheit schon eigenständig. In den nächsten 30 Minuten arbeiten wir an Stabilität — wie du auf einer Höhe bleibst, wie du nicht zu hoch steigst und wie du erste sanfte Kurven mit Gewichtsverlagerung machst." },
        { kind: "p", text: "Der Aufbaukurs (4 Stunden auf 2 Tage verteilt) ist für Rider, die Carving, Video-Analyse und längeres Gleiten ohne Aussetzer dazu lernen möchten." },
        { kind: "h2", text: "Was kostet der Kurs?" },
        { kind: "ul", items: [
          "30-Minuten-Schnupper — 70 € (ideal für Anfänger, die vor einem vollen Kurs reinschnuppern wollen)",
          "Anfängerkurs 2 Stunden — 199 €",
          "Aufbaukurs 4 Stunden / 2 Tage — 400 €",
          "Privatkurs — auf Anfrage"
        ]},
        { kind: "p", text: "Die gesamte Ausrüstung, Helm, Schwimmweste und Neoprenanzug (saisonal) sind im Preis enthalten." },
        { kind: "cta", text: "Komm, flieg, verlieb dich.", href: "/tecaji", label: "Alle Kurse ansehen" }
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
    },
    de: {
      title: "Was kostet E-Foil-Verleih in Slowenien? Preisübersicht 2026",
      excerpt: "Vom 30-Minuten-Schnupper bis zum zweiwöchigen Verleih. Alle Preise, Pakete und versteckten Kosten transparent an einem Ort.",
      metaTitle: "E-Foil Verleih Preis Slowenien 2026 — Übersicht | Surf-Store",
      metaDescription: "Was kostet der E-Foil-Verleih in Slowenien? Preise von 70 € (30 Min) bis 1.990 € (2 Wochen). Alles inklusive, keine versteckten Kosten.",
      keywords: "E-Foil Preis, E-Foil Verleih Preis, E-Foil Slowenien Preise, E-Foil Pakete, E-Foil Verleih Slowenien",
      blocks: [
        { kind: "p", text: "Der E-Foil-Verleih in Slowenien ist auch 2026 ein relativ neues Konzept, deshalb sind die Preisunterschiede zwischen den Anbietern groß. In diesem Artikel erklären wir, was du zahlst, was du bekommst und wie unsere Pakete im Vergleich zu anderen Wassersport-Erlebnissen abschneiden." },
        { kind: "h2", text: "Preise bei Surf-Store.com — Übersicht 2026" },
        { kind: "ul", items: [
          "30 Min — Schnupper: 70 €",
          "Tagesverleih (24 h): 199 €",
          "Wochenende (Sa–So, Abholung Freitag nach 17:00): 350 €",
          "1 Woche (7 Tage, Festpreis): 1.100 € (157 €/Tag)",
          "2 Wochen — VIP: 1.990 € (142 €/Tag)"
        ]},
        { kind: "p", text: "Alle Preise enthalten das Board Duotone Midwish 5'8, das Foil Cruise Set AL, zwei Akkus, Ladegerät, Helm, Schwimmweste und Neoprenanzug (saisonal). Der Instruktor ist im 30-Minuten-Schnupper und in allen Kursen enthalten." },
        { kind: "image", src: "/action-2.jpg", alt: "E-Foil in Aktion" },
        { kind: "h2", text: "Warum sinkt der Tagespreis mit zunehmender Mietdauer?" },
        { kind: "p", text: "Der Tagespreis sinkt, weil je länger die Ausrüstung bei dir ist, desto geringer unsere Logistikkosten (Übergabe, Prüfung, Laden). Beim Wochenverleih zahlst du 157 € pro Tag statt 199 € — das sind 21 % Rabatt. Bei zwei Wochen 142 € pro Tag (29 % Rabatt)." },
        { kind: "h2", text: "Was ist NICHT enthalten?" },
        { kind: "p", text: "Ehrlich gesagt: sehr wenig." },
        { kind: "ul", items: [
          "Kaution für mehrtägige Verleihe (ab 1 Tag): 500 € per Karte, direkt nach schadenfreier Rückgabe der Ausrüstung erstattet.",
          "Transport der Ausrüstung außerhalb unserer 4 Standorte (Grüner See, Murska Sobota, Kamešnica, Maribor) — nach Absprache gegen Aufpreis.",
          "Schäden über normaler Abnutzung — kleine Kratzer decken wir aus der Kaution, größere Schäden (gebrochenes Foil, Motor, Akku) zu Duotone-Servicepreisen."
        ]},
        { kind: "h2", text: "Erst testen, dann kaufen — Mietgebühr-Rabatt" },
        { kind: "p", text: "Besonderes Angebot: Wenn du dich nach dem Verleih für den Kauf eines Foil-Boards in unserem Online-Shop entscheidest, ziehen wir dir den Tagesverleih (199 €) vom Endpreis ab. So wird ein Tag Verleih zur kostenlosen Testfahrt." },
        { kind: "cta", text: "Schau im Shop vorbei", href: "https://www.surf-store.com/t/categories/e-foil/e-foil-sets", label: "Duotone E-Foil Sets ansehen" },
        { kind: "h2", text: "Vergleich mit anderen Wassersportarten in Slowenien" },
        { kind: "ul", items: [
          "Jet-Ski-Verleih (1 h): 80–150 €. Laut, teures Benzin, begrenzte Standorte.",
          "Wakeboard mit Lift (1 Stunde): 25–40 €. Günstiger, aber an Lift gebunden und mit langen Wartezeiten.",
          "SUP-Verleih (ganzer Tag): 25–40 €. Günstiger, ohne Adrenalin.",
          "E-Foil (ganzer Tag): 199 €. Echtes Flug-Erlebnis ohne Benzin, ohne Lärm, ohne Wartezeit."
        ]},
        { kind: "p", text: "E-Foil ist nicht das günstigste, aber ein einzigartiges Erlebnis, das andere Sportarten nicht bieten. Du zahlst für Stille, Sauberkeit und das Fluggefühl." },
        { kind: "cta", text: "Bereit zu reservieren?", href: "/", label: "Zur Buchung" }
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
    },
    de: {
      title: "Die 5 besten E-Foil-Spots in Slowenien",
      excerpt: "Vom Grünen See bis zur Adria — wo du E-Foilen kannst, welche Bedingungen dich erwarten und was du über die lokalen Regeln wissen musst.",
      metaTitle: "Wo E-Foilen in Slowenien? Die 5 besten Spots 2026 | Surf-Store",
      metaDescription: "Übersicht der 5 besten slowenischen E-Foil-Spots — Grüner See, Bohinjer See, Velenje, Soboško jezero und Adria. Bedingungen, Regeln, Genehmigungen.",
      keywords: "E-Foil Spots Slowenien, wo E-Foilen Slowenien, Seen für E-Foil, Grüner See Kidričevo, E-Foil Bohinj, E-Foil Meer",
      blocks: [
        { kind: "p", text: "Slowenien ist mit ruhigen Seen und stillen Buchten perfekt fürs E-Foilen. In diesem Artikel stellen wir die 5 besten Spots vor, an denen du allein oder mit unserem Instruktor deinen ersten Flug überm Wasser ausprobieren kannst. Bei jedem Spot nennen wir auch die aktuell gültigen Regeln und Genehmigungen." },
        { kind: "h2", text: "1. Grüner See, Kidričevo — unsere Hauptbasis" },
        { kind: "p", text: "Der Grüne See (lokal: Zeleno jezero) in Kidričevo ist unser primäres Center. Hier haben wir die Ausrüstungsbasis, Ladestationen und das ganze Jahr über Instruktoren verfügbar." },
        { kind: "h3", text: "Warum der Grüne See?" },
        { kind: "ul", items: [
          "Sehr ruhiges Wasser — ideal für Anfänger.",
          "Keine Strömungen, keine großen Boote.",
          "Schnell erreichbar aus Maribor (25 Min) und Ljubljana (90 Min).",
          "Ausgebauter Steg und Hinterland-Service (Parkplatz, Umkleide, Laden)."
        ]},
        { kind: "image", src: "/green-lake.webp", alt: "Grüner See aus der Luft", caption: "Ruhige Gewässer des Grünen Sees — unser Zuhause und der beste Spot für die ersten Lift-offs." },
        { kind: "h2", text: "2. Bohinjer See — alpine Kulisse" },
        { kind: "p", text: "Der größte natürliche Alpensee Sloweniens. Der Bohinjer See bietet außergewöhnliche Ausblicke, hat aber ein paar Einschränkungen." },
        { kind: "p", text: "E-Foil ist hier nur mit elektrischem Antrieb erlaubt (was wir sind) und mit einer Genehmigung des Triglav-Nationalparks (TNP). Wir empfehlen Morgenfahrten vor 10 Uhr, wenn das Wasser am ruhigsten ist und weniger Touristen unterwegs sind." },
        { kind: "h2", text: "3. Velenjer See" },
        { kind: "p", text: "Der Velenjer See ist in den letzten Jahren zum Wassersportzentrum im Šaleška-Tal geworden. Die benachbarten Seen Škale und Družmirsko sind kleinere Alternativen." },
        { kind: "p", text: "Hier gibt es keine besonderen Einschränkungen für elektrische Wasserfahrzeuge, und die Stadtgemeinde ist wassersportfreundlich. Eine ausgezeichnete Wahl für Freizeit-Rider, die den Touristen am Bohinjer See ausweichen möchten." },
        { kind: "h2", text: "4. Soboško jezero, Murska Sobota" },
        { kind: "p", text: "Unser zweiter Standort. Nach Absprache führen wir auch Wochenendkurse am Soboško jezero durch. Ruhige Gewässer, kurze Distanzen, weniger Andrang als an touristischen Zielen." },
        { kind: "cta", text: "Kurs in Murska Sobota?", href: "/tecaji", label: "Anfrage senden" },
        { kind: "h2", text: "5. Slowenische Adria — Piran, Strunjan, Izola" },
        { kind: "p", text: "Für erfahrene Rider, die die Herausforderung von Wellen und Salzwasser suchen, ist die Adria (Piran, Strunjan, Izola) eine ausgezeichnete Wahl. Wichtig: Das E-Foil braucht eine Schifffahrtsgenehmigung der gleichen Art wie SUP — die bekommst du bei der slowenischen Hafenverwaltung." },
        { kind: "p", text: "Die Kondition fürs Meer ist anspruchsvoller als für den See — vor allem wegen Wellen und Strömung. Wir empfehlen, vor dem Meer mindestens einen Aufbaukurs auf ruhigem Wasser zu absolvieren." },
        { kind: "h2", text: "Allgemeine Regeln und Genehmigungen in Slowenien" },
        { kind: "p", text: "Aktuell ist E-Foilen in Slowenien als elektrisches Wasserfahrzeug geregelt. Die wichtigsten Bedingungen:" },
        { kind: "ul", items: [
          "Mindestalter: 14 Jahre (mit Einverständnis der Eltern).",
          "Pflichtausrüstung: Schwimmweste, Kill-Switch.",
          "In Schutzgebieten (TNP, Landschaftsparks): lokale Regeln prüfen.",
          "Ohne Schifffahrtsgenehmigung fährst du nur auf Freizeitseen ohne Schiffsverkehr.",
          "Auf dem Meer ist eine Genehmigung der slowenischen Hafenverwaltung erforderlich."
        ]},
        { kind: "cta", text: "Starte am Grünen See.", href: "/", label: "Termin reservieren" }
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
    },
    de: {
      title: "Duotone Foil Cruise Set AL — Review, Meinung und Tech-Specs 2026",
      excerpt: "Test nach 200 Stunden Einsatz. Für wen es sich lohnt, welche Schwächen es hat und warum dieses Set unsere Verleih-Wahl ist.",
      metaTitle: "Duotone Foil Cruise Set AL — Review und Meinung 2026 | Surf-Store",
      metaDescription: "Review des Duotone Foil Cruise Set AL — komplette Specs, Test nach 200 Stunden, Vergleich mit dem D/LAB Carbon. Für wen sich das Set eignet.",
      keywords: "Duotone Foil Cruise Set AL, Duotone E-Foil Review, Duotone Foil Meinung, Cruise Mast AL, Duotone Midwish 5'8",
      blocks: [
        { kind: "p", text: "Das Duotone Foil Cruise Set AL ist die Aluminium-Variante von Duotones Foilsystem — robust, günstiger und voll kompatibel mit dem D/LAB Carbon-Mast. Bei Surf-Store.com haben wir dieses Set als unser primäres Verleih-Setup gewählt. Nach 200+ Stunden Einsatz unter verschiedenen Bedingungen liefern wir hier eine ehrliche Review." },
        { kind: "image", src: "/board-3.jpg", alt: "Duotone Foil Cruise Set AL Detail" },
        { kind: "h2", text: "Was ist im Paket?" },
        { kind: "ul", items: [
          "Duotone Foil Assist Cruise Mast AL (80 cm, 3,55 kg)",
          "Front-Wing 1600 cm² (ideal für Anfänger und mittlere Erfahrung)",
          "Back-Wing PX 225 cm²",
          "eHarness mit Akku (3,76 kg gesamt)",
          "Zwei LiPo-Akkus (7 Ah, 22,8 V, je 159,6 Wh)",
          "Ladegerät (Ladezeit ~1 Stunde)",
          "Kabelloser Trigger mit 7 Geschwindigkeitsstufen"
        ]},
        { kind: "p", text: "Unser Verleih-Setup kombiniert dieses Foil-Set mit dem Board Duotone Midwish 5'8 — einem kürzeren, stabilen Board mit 90 L Volumen, das ideal für vielseitige Nutzung ist." },
        { kind: "h2", text: "Technische Spezifikationen" },
        { kind: "ul", items: [
          "Maximale Fahrzeit: 30–60 Min pro Ladung",
          "Höchstgeschwindigkeit: 40+ km/h",
          "Leistungsstufen: 7",
          "Fahrergewicht: 40–110 kg",
          "Minimales Brettvolumen: 35 L+",
          "Harness-Größen: S/M 71–89 cm, L/XXL 89–114 cm"
        ]},
        { kind: "h2", text: "Lift-off und Fahrgefühl" },
        { kind: "p", text: "Der Cruise Mast ist kurz (80 cm), was einen niedrigeren Lift-off bedeutet — etwa 50 cm überm Wasser statt 80 cm beim längeren Assist Mast. Das ist ein Vorteil für Anfänger: Stürze fallen niedriger aus, das Phänomen der „Ventilation\" (wenn das Foil zu hoch steigt und Auftrieb verliert) ist seltener." },
        { kind: "p", text: "Das Front-Wing mit 1600 cm² ist eine große, stabile Fläche — verzeiht Fehler und ist deshalb anfängerfreundlich. Erfahrenere Rider wechseln zum kleineren Wing (z. B. 900 cm²), das mehr Geschwindigkeit und Agilität bietet." },
        { kind: "cta", text: "Live ausprobieren", href: "/", label: "Termin reservieren" },
        { kind: "h2", text: "Haltbarkeit und Verschleiß" },
        { kind: "p", text: "Der Aluminium-Mast ist robust. Nach 200 Stunden Einsatz haben wir keinen einzigen strukturellen Schaden — nur kleine Kratzer am tragenden Bereich. Im Vergleich zum D/LAB Carbon ist AL um 450 Gramm schwerer, dafür dreimal stoßresistenter und deutlich günstiger." },
        { kind: "p", text: "Der Akku ist die wichtigste Verschleißkomponente. Bei richtiger Pflege (nicht voll geladen lagern, nicht unter 10 % entladen) hält er rund 500 Vollzyklen, bevor die Kapazität spürbar nachlässt." },
        { kind: "h2", text: "Für wen empfehlen wir es?" },
        { kind: "ul", items: [
          "Anfängern und mittel erfahrenen Ridern — niedrigerer Lift-off und verzeihender Wing.",
          "Familien, die mit mehreren Fahrern ein Set teilen möchten.",
          "Schulen und Tourismuszentren, die Robustheit brauchen.",
          "Gelegenheitsnutzer, die nicht das letzte Gramm Carbon brauchen."
        ]},
        { kind: "h2", text: "Wann lohnt sich der Schritt zum D/LAB Carbon?" },
        { kind: "p", text: "Wenn du Advanced/Pro-Rider bist und Carving, Freestyle oder Pump-Foiling machst, wird dir das Cruise AL schnell zu schwer. Dann steige direkt aufs D/LAB Carbon-Mast um (3,0 kg, 450 Gramm leichter) für ein Spitzen-Response." },
        { kind: "h2", text: "Preis und wo kaufen" },
        { kind: "p", text: "Das Komplettset (Board + Foil + zwei Akkus + Ladegerät + Trigger) kostet bei Surf-Store.com zwischen 8.000 und 9.500 €, je nach Brettwahl. Der Preis ist vergleichbar mit anderen Premium-Anbietern (Lift, Audi) und niedriger als die D/LAB-Carbon-Variante." },
        { kind: "cta", text: "Duotone im Shop ansehen", href: "https://www.surf-store.com/t/categories/e-foil/e-foil-sets", label: "Surf-Store.com" }
      ]
    }
  }
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
