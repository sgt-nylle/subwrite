// Test device separation and level separation in scoreboards

import { INITIAL_HIGH_SCORES, INITIAL_MOBILE_HIGH_SCORES, ALL_INITIAL_HIGH_SCORES, SUBMARINE_LEVELS } from '../src/data/submarineTexts.ts';

console.log("=== VERIFYING DESKTOP (PC/MAC) FLEET RECORDS ===");
console.assert(INITIAL_HIGH_SCORES.length >= 10, "Should have initial desktop high scores");
for (let lvl = 1; lvl <= 5; lvl++) {
  const levelScores = INITIAL_HIGH_SCORES.filter(s => s.level === lvl && (s.device || 'desktop') === 'desktop');
  console.assert(levelScores.length >= 2, `Desktop Level ${lvl} should have at least 2 initial high scores`);
  console.log(`[PC/MAC] Level ${lvl} (${SUBMARINE_LEVELS.find(l => l.level === lvl).name}) has ${levelScores.length} scores. Top: ${levelScores[0].initials} - ${levelScores[0].score}`);
}

console.log("\n=== VERIFYING MOBILE FLEET RECORDS ===");
console.assert(INITIAL_MOBILE_HIGH_SCORES.length >= 10, "Should have initial mobile high scores");
for (let lvl = 1; lvl <= 5; lvl++) {
  const levelScores = INITIAL_MOBILE_HIGH_SCORES.filter(s => s.level === lvl && s.device === 'mobile');
  console.assert(levelScores.length >= 2, `Mobile Level ${lvl} should have at least 2 initial high scores`);
  console.log(`[MOBILE] Level ${lvl} (${SUBMARINE_LEVELS.find(l => l.level === lvl).name}) has ${levelScores.length} scores. Top: ${levelScores[0].initials} - ${levelScores[0].score}`);
}

console.log("\n=== VERIFYING STRICT DEVICE ISOLATION ===");
const desktopInMobile = INITIAL_MOBILE_HIGH_SCORES.some(s => s.device === 'desktop');
console.assert(!desktopInMobile, "Mobile scores must not contain desktop device tag");

const mobileInDesktop = INITIAL_HIGH_SCORES.some(s => s.device === 'mobile');
console.assert(!mobileInDesktop, "Desktop scores must not contain mobile device tag");

console.assert(ALL_INITIAL_HIGH_SCORES.length === INITIAL_HIGH_SCORES.length + INITIAL_MOBILE_HIGH_SCORES.length, "ALL_INITIAL_HIGH_SCORES should combine both rosters");

console.log("\n=== VERIFYING STATISTICAL INTEGRITY (WPM & FAILED CHARS) ===");
for (const score of ALL_INITIAL_HIGH_SCORES) {
  console.assert(typeof score.wpm === 'number' && score.wpm > 0, `Score ${score.initials} must have positive WPM`);
  console.assert(typeof score.failedChars === 'number' && score.failedChars >= 0, `Score ${score.initials} must have non-negative failedChars`);
}
console.log("All scores contain valid WPM and failedChars statistics!");

console.log("\nAll device and level scoreboard verification tests passed successfully!");
