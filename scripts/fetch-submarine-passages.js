// Script to fetch authentic Wikipedia submarine articles and curate 100+ passages per difficulty level (500+ total)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_FILE = path.resolve(__dirname, '../src/data/passages.json');

const ARTICLE_TITLES = [
  'Submarine',
  'History_of_submarines',
  'Nuclear_submarine',
  'Ballistic_missile_submarine',
  'Attack_submarine',
  'Gotland-class_submarine',
  'Typhoon-class_submarine',
  'Air-independent_propulsion',
  'USS_Nautilus_(SSN-571)',
  'Soviet_submarine_K-278_Komsomolets',
  'Submarine_warfare',
  'Sonar',
  'Torpedo',
  'Periscope',
  'Ohio-class_submarine',
  'Los_Angeles-class_submarine',
  'Virginia-class_submarine',
  'Akula-class_submarine',
  'Borei-class_submarine',
  'Alfa-class_submarine',
  'Delta-class_submarine',
  'U-boat',
  'Submarine_hull',
  'Ballast_tank',
  'Anechoic_tile',
  'Hydrophone',
  'K-141_Kursk',
  'USS_Thresher_(SSN-593)',
  'Type_212_submarine',
  'Vanguard-class_submarine',
  'Astute-class_submarine',
  'Blekinge-class_submarine',
  'Collins-class_submarine',
  'Trieste_(bathyscaphe)',
  'SOSUS',
  'Submarine_communications',
  'Cavitation',
  'Submarine_snorkel',
  'Submarine_depth_record',
  'Mark_48_torpedo',
  'The_Hunt_for_Red_October'
];

async function fetchArticle(title) {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&titles=${encodeURIComponent(title)}&format=json`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'SubWriteApp/1.0 (https://subwrite.se; typing-test)' }
    });
    if (!res.ok) return '';
    const json = await res.json();
    const pages = json.query?.pages || {};
    for (const pageId in pages) {
      if (pages[pageId].extract) {
        return pages[pageId].extract;
      }
    }
  } catch (err) {
    console.warn(`Failed fetching ${title}:`, err.message);
  }
  return '';
}

function cleanText(raw) {
  return raw
    .replace(/==+[^=]+==+/g, '') // remove section headers
    .replace(/\[\d+\]/g, '') // remove citations like [1]
    .replace(/\[citation needed\]/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function segmentSentences(text) {
  // Split into sentences
  const rawSentences = text.match(/[^.!?]+[.!?]+/g) || [];
  const segments = [];

  for (let i = 0; i < rawSentences.length; i++) {
    let candidate = rawSentences[i].trim();
    // If too short (< 80 chars), combine with next sentence
    if (candidate.length < 80 && i + 1 < rawSentences.length) {
      candidate += ' ' + rawSentences[i + 1].trim();
      i++;
    }
    // Filter reasonable length (80 - 280 chars)
    if (candidate.length >= 80 && candidate.length <= 280) {
      // Must not contain weird non-printable characters or code
      if (!candidate.includes('http') && !candidate.includes('{') && !candidate.includes('}') && /^[A-Za-z0-9\s.,'"\-—:;()/]+$/.test(candidate)) {
        segments.push(candidate);
      }
    }
  }

  return segments;
}

async function run() {
  console.log(`Fetching ${ARTICLE_TITLES.length} submarine articles from Wikipedia...`);
  const allSegments = [];

  for (const title of ARTICLE_TITLES) {
    process.stdout.write(`Fetching ${title}... `);
    const raw = await fetchArticle(title);
    if (raw) {
      const cleaned = cleanText(raw);
      const segments = segmentSentences(cleaned);
      allSegments.push(...segments);
      console.log(`(${segments.length} segments)`);
    } else {
      console.log(`(empty)`);
    }
  }

  console.log(`Total extracted candidate segments: ${allSegments.length}`);

  // Deduplicate
  const uniqueSegments = Array.from(new Set(allSegments));

  const level1 = []; // Lowercase only, simple vocabulary, no punctuation
  const level2 = []; // Standard simple sentences, basic capitalization, periods
  const level3 = []; // Medium complexity, commas, hyphens, naval terms
  const level4 = []; // Numbers, specs, displacement, technical terms
  const level5 = []; // Heavy numbers, quotes, acronyms (SSBN, AIP, SLBM), maximum complexity

  for (const seg of uniqueSegments) {
    const hasNumbers = /\d/.test(seg);
    const hasQuotesOrParens = /['"();:]/.test(seg);
    const hasAcronyms = /\b[A-Z]{3,}\b/.test(seg);
    const wordCount = seg.split(/\s+/).length;

    // Filter into Level 5 (Super Hard)
    if ((hasNumbers && (hasQuotesOrParens || hasAcronyms)) || (hasAcronyms && hasQuotesOrParens) || /typhoon|akula|komsomolets|gotland|stirling|reactor|displacement/i.test(seg)) {
      if (level5.length < 120) {
        level5.push(seg);
        continue;
      }
    }

    // Filter into Level 4 (Hard: numbers and specs)
    if (hasNumbers || /metric|meters|feet|knots|megawatt|sonar|torpedo/i.test(seg)) {
      if (level4.length < 120) {
        level4.push(seg);
        continue;
      }
    }

    // Filter into Level 3 (Medium: normal sentences with punctuation)
    if (seg.includes(',') || seg.includes('-') || wordCount >= 22) {
      if (level3.length < 120) {
        level3.push(seg);
        continue;
      }
    }

    // Filter into Level 2 (Easy-Med: standard sentences with basic period/caps)
    if (level2.length < 120 && wordCount <= 25) {
      level2.push(seg);
      continue;
    }

    // Level 1: strip all punctuation and lowercase
    if (level1.length < 120) {
      const cleanedLvl1 = seg
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\d+/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      if (cleanedLvl1.split(/\s+/).length >= 15 && cleanedLvl1.split(/\s+/).length <= 32) {
        level1.push(cleanedLvl1);
      }
    }
  }

  // Ensure Level 1 has 100+ by converting more simple segments if needed
  if (level1.length < 100) {
    for (const seg of uniqueSegments) {
      if (level1.length >= 105) break;
      const l1 = seg.toLowerCase().replace(/[^a-z\s]/g, '').replace(/\s+/g, ' ').trim();
      if (l1.split(/\s+/).length >= 15 && !level1.includes(l1)) {
        level1.push(l1);
      }
    }
  }

  console.log(`Results:`);
  console.log(`Level 1 (Easy): ${level1.length} passages`);
  console.log(`Level 2 (Easy-Med): ${level2.length} passages`);
  console.log(`Level 3 (Medium): ${level3.length} passages`);
  console.log(`Level 4 (Hard): ${level4.length} passages`);
  console.log(`Level 5 (Super Hard): ${level5.length} passages`);

  const output = {
    level1: level1.slice(0, 105),
    level2: level2.slice(0, 105),
    level3: level3.slice(0, 105),
    level4: level4.slice(0, 105),
    level5: level5.slice(0, 105),
    totalCount: level1.length + level2.length + level3.length + level4.length + level5.length,
    generatedAt: new Date().toISOString()
  };

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`Successfully generated ${OUTPUT_FILE}!`);
}

run();
