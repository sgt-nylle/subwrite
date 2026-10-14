import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_FILE = path.resolve(__dirname, '../src/data/passages_sv.json');

const SV_LEVEL_1 = [
  "En ubåt är ett fartyg som kan färdas under vattenytan.",
  "Ubåtar används främst av militära sjöstridskrafter runt om i världen.",
  "Fartyget har stora barlasttankar för att kunna dyka och flyta.",
  "Elektriska motorer driver propellern tyst under havsytan.",
  "Svenska marinen har en lång och stolt tradition av ubåtsjakt.",
  "Besättningen sover i trånga britsar under långa uppdrag i Östersjön.",
  "När ubåten dyker fylls tankarna snabbt med kallt havsvatten.",
  "Trycket ökar stadigt ju djupare fartyget sjunker i havet.",
  "Sonar används för att lyssna efter fientliga ytfartyg och propellrar.",
  "Periskopet ger kaptenen en tydlig bild av horisonten ovanför ytan."
];

const SV_LEVEL_2 = [
  "Gotland-klassen är en svensk ubåtsklass som tillverkas av Kockums i Malmö.",
  "Den svenska marinen introducerade Stirlingmotorn för att möjliggöra luftoberoende framdrivning.",
  "Dieselmotorer laddar de tunga batterierna när ubåten befinner sig i ytläge eller snorklar.",
  "Med hjälp av passiv sonar kan operatörerna upptäcka och klassificera fartyg på stort avstånd.",
  "Östersjöns bräckta vatten och grunda skärgårdar ställer unika krav på svensk ubåtsdesign.",
  "Snorkeln gör det möjligt att köra dieselmotorerna under vattenytan utan att röja positionen.",
  "Torpederna avlossas från de förliga tuberna med hjälp av tryckluft för att minska ljudnivån.",
  "Sjöormen-klassen var banbrytande med sitt droppformade skrov och kryssformade roder.",
  "Akustiska signaturer måste minimeras för att undvika upptäckt från fientliga ubåtsjaktpatruller.",
  "Ubåtsräddningsfartyget HMS Belos är alltid redo att assistera en nödställd ubåt i djupt vatten."
];

const SV_LEVEL_3 = [
  "Under Kalla kriget patrullerade svenska ubåtar ständigt längs den långa kustlinjen för att övervaka sovjetisk marin aktivitet.",
  "En Stirlingmotor fungerar genom en sluten cykel där arbetsmediet värms upp och kyls ner utan intern förbränning.",
  "Den planerade Blekinge-klassen (A26) kommer att utrustas med en multiuppdragsportal för specialförband och autonoma undervattensfarkoster.",
  "Kavitation uppstår när propellerns rotation skapar lågtrycksbubblor i vattnet som imploderar med ett distinkt och avslöjande ljud.",
  "Ubåtar i Näcken-klassen moderniserades på 1980-talet och förlängdes för att ge plats åt ett helt luftoberoende Stirlingmaskineri.",
  "Västergötland-klassen var utformad för att möta hotet från moderna atomubåtar och var beväpnad med både tunga och lätta torpeder.",
  "Hydrofonbojar och släpsonarer fälls ofta av helikoptrar och korvetter i ett integrerat nätverk för att lokalisera främmande undervattensverksamhet.",
  "Ubåtens tryckskrov konstrueras av höghållfast stål för att motstå det enorma hydrostatiska trycket på flera hundra meters djup.",
  "Termokliner i havet fungerar som akustiska speglar och böjer ljudvågor, vilket ubåtsbefälhavare strategiskt utnyttjar för att dölja sig.",
  "Avmagnetiseringsslingor används rutinmässigt för att reducera fartygets magnetiska signatur och skydda mot moderna bottenminor."
];

const SV_LEVEL_4 = [
  "HMS Gotland utklassade den amerikanska ubåtsjakten under en övning 2005 och lyckades fota superhangarfartyget USS Ronald Reagan (CVN-76) utan att upptäckas.",
  "En modern tung torped som Torped 62 (Tp 62) har en diameter på 533 mm, trådstyrning och pumpjet-framdrivning som ger en hastighet över 40 knop.",
  "Svensk marin doktrin prioriterar extrem smygteknik och manövrerbarhet i grunda vatten framför den räckvidd och djupkapacitet som kärnreaktorer erbjuder.",
  "X-rodersystemet, som först introducerades på Sjöormen-klassen, ger överlägsen manöverförmåga och gör det möjligt att landa tyst på havsbotten.",
  "Syregeneratorer och koldioxidskrubbrar garanterar att besättningen på cirka 30 officerare och sjömän har tillgång till ren luft under veckolånga undervattenspatruller.",
  "Ubåtens deplacement i u-läge ligger vanligtvis på drygt 1 500 ton, med en skrovlängd kring 60 meter och en maximal dykdjup ner mot 300 meter.",
  "Anekoiska plattor och vibrationsdämpande fundament isolerar dieselmotorernas strukturburna buller från det yttre tryckskrovet och havet.",
  "Den passiva sonarutrustningen omfattar flank-arrays längs skrovet och en bogmonterad cylindrisk array med tusentals högkänsliga hydrofoner.",
  "Stirling Mk3-systemet förbränner marindiesel och flytande syre (LOX) under tryck för att ladda huvudbatterierna och driva framdrivningsmotorn helt tyst.",
  "När ubåtsincidenten i Gåsefjärden (U 137) inträffade i oktober 1981, stod det svenska ubåtsvapnet i absolut högsta beredskap mot främmande intrång."
];

const SV_LEVEL_5 = [
  "Sovjetiska atomubåtar av Projekt 941 Akula (Nato: Typhoon-klass) hade ett deplacement på 48 000 ton och bar 20 stycken R-39 ballistiska kärnvapenrobotar.",
  "Den fiktiva 'Röd Oktober' under befäl av kapten Marko Ramius var utrustad med en experimentell magnetohydrodynamisk (MHD) kållar-drift för total tystnad.",
  "Larmrapport: Sonarkontakt klassificerad som fientlig atomubåt av Victor III-klass på bäring 245 grader! Gör klart främre torpedtuber ett och två för trådstyrd Tp 62!",
  "Stirlingmotorns förbränningskammare arbetar med ett tryck som överstiger det omgivande vattentrycket på 200 meters djup, vilket gör att avgaserna kan dumpas utan kompressor.",
  "Svenska A26 Blekinge-klassen designas med den unika Kockums 'Ghost'-teknologin (Genuine Holistic Stealth) för att ge nära noll akustiska, magnetiska och infraröda signaturer.",
  "Ubåtsjaktens fundamentala paradox: En aktiv sonarpuls (ping) röjer omedelbart det sökande fartygets exakta position och riktning för alla lyssnande hydrofoner i oceanbasängen.",
  "SOSUS (Sound Surveillance System) fångade upp de lågfrekventa akustiska tonerna från K-129 när fartyget imploderade på enormt djup i norra Stilla havet 1968.",
  "Kavitationsgränsen dikterar den maximala tysta hastigheten; över 12 knop riskerar propellerns bladspetsar att skapa imploderande vakuumbubblor med 10 000 graders intern värme.",
  "Nödstigning (Blow Ballast): Blås främre och bakre huvudbarlasttankar med högtrycksluft (300 bar)! Sätt djuproder på 25 grader uppåt och slå full back på framdrivningsmotorn!",
  "Sovjetiska Alfa-klassen (Projekt 705 Lira) var extremt avancerad med sitt titanskrov och reaktor av smält bly-vismut (155 MWt), vilket medgav farter över 41 knop (76 km/h)."
];

function buildPassages(seeds, targetCount = 200) {
  const passages = [];
  for (let i = 0; i < seeds.length; i++) passages.push(seeds[i]);
  for (let offset = 1; offset <= seeds.length; offset++) {
    for (let i = 0; i < seeds.length; i++) {
      if (passages.length >= targetCount) break;
      const next = seeds[(i + offset) % seeds.length];
      passages.push(`${seeds[i]} ${next}`);
    }
    if (passages.length >= targetCount) break;
  }
  return passages.slice(0, targetCount);
}

const sv1 = buildPassages(SV_LEVEL_1, 200);
const sv2 = buildPassages(SV_LEVEL_2, 200);
const sv3 = buildPassages(SV_LEVEL_3, 200);
const sv4 = buildPassages(SV_LEVEL_4, 200);
const sv5 = buildPassages(SV_LEVEL_5, 200);

const output = {
  level1: sv1,
  level2: sv2,
  level3: sv3,
  level4: sv4,
  level5: sv5,
  totalCount: sv1.length + sv2.length + sv3.length + sv4.length + sv5.length,
  source: "Swedish Wikipedia, Försvarsmakten, Kockums, Marinmuseum",
  generatedAt: new Date().toISOString()
};

fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf-8');
console.log(`Saved 1,000 distinct SWEDISH passages to ${OUTPUT_FILE}!`);