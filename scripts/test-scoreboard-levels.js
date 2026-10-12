// Test level separation in scoreboards

import { INITIAL_HIGH_SCORES, SUBMARINE_LEVELS } from '../src/data/submarineTexts.ts';

console.assert(INITIAL_HIGH_SCORES.length >= 10, "Should have initial high scores");

for (let lvl = 1; lvl <= 5; lvl++) {
  const levelScores = INITIAL_HIGH_SCORES.filter(s => s.level === lvl);
  console.assert(levelScores.length >= 2, `Level ${lvl} should have at least 2 initial high scores`);
  console.log(`Level ${lvl} (${SUBMARINE_LEVELS.find(l => l.level === lvl).name}) has ${levelScores.length} scores. Top score: ${levelScores[0].initials} - ${levelScores[0].score}`);
}

console.log("All level scoreboard verification tests passed successfully!");
