// Test continuous streaming typing engine with error isolation and -500 penalty

function areCharsEquivalent(typed, expected) {
  if (!typed || !expected) return false;
  if (typed === expected) return true;

  const isSingleQuote = (c) => c === "'" || c === '’' || c === '‘' || c === '`' || c === '´';
  if (isSingleQuote(typed) && isSingleQuote(expected)) return true;

  const isDoubleQuote = (c) => c === '"' || c === '“' || c === '”' || c === '«' || c === '»';
  if (isDoubleQuote(typed) && isDoubleQuote(expected)) return true;

  const isDash = (c) => c === '-' || c === '—' || c === '–' || c === '−';
  if (isDash(typed) && isDash(expected)) return true;

  const isSpace = (c) => c === ' ' || c === '\u00A0';
  if (isSpace(typed) && isSpace(expected)) return true;

  if (expected === '°' && (typed === 'o' || typed === '*' || typed === '^' || typed === "'")) return true;

  return false;
}

function evaluateContinuousTyping(targetText, inputVal) {
  const chars = targetText.split('');
  let errors = 0;
  let correctCount = 0;

  const evaluatedChars = chars.map((expectedChar, index) => {
    let charClass = 'char-pending';
    const isCursor = index === inputVal.length;

    if (index < inputVal.length) {
      const typedChar = inputVal[index];
      const isMatch = typedChar === expectedChar || areCharsEquivalent(typedChar, expectedChar);

      if (isMatch) {
        charClass = 'char-correct';
        correctCount++;
      } else {
        charClass = 'char-error';
        errors++;
      }
    }

    return {
      index,
      expectedChar,
      typedChar: index < inputVal.length ? inputVal[index] : null,
      charClass,
      isCursor
    };
  });

  return { evaluatedChars, errors, correctCount };
}

// TEST 1: User types "A submarine is a naval ship"
// At char 4 (expected 'b' in submarine), user types 'x' (an error!)
// Then user carries on typing 'm', 'a', 'r', 'i', 'n', 'e', ' ', 'i', 's'
const target = "A submarine is a naval ship";
// Target chars:
// index 0: 'A'
// index 1: ' '
// index 2: 's'
// index 3: 'u'
// index 4: 'b'  <-- user types 'x'
// index 5: 'm'  <-- user carries on: types 'm'
// index 6: 'a'  <-- user carries on: types 'a'
// index 7: 'r'  <-- user carries on: types 'r'
// index 8: 'i'  <-- user carries on: types 'i'
// index 9: 'n'  <-- user carries on: types 'n'
// index 10: 'e' <-- user carries on: types 'e'
// index 11: ' ' <-- user carries on: types ' '
// index 12: 'i' <-- user carries on: types 'i'
// index 13: 's' <-- user carries on: types 's'

const inputWithTypoAndContinue = "A suxmarine is";

const result = evaluateContinuousTyping(target, inputWithTypoAndContinue);

console.log("=== TEST 1: TYPO AT CHAR 4 AND CONTINUING ===");
console.log(`Target: "${target.slice(0, 14)}"`);
console.log(`Typed:  "${inputWithTypoAndContinue}"`);
console.log(`Total errors: ${result.errors}`);

console.assert(result.errors === 1, `Expected exactly 1 error at index 4, got ${result.errors}`);
console.assert(result.evaluatedChars[4].charClass === 'char-error', "Char 4 ('b' vs 'x') must be error");

// Verify that EVERY character typed after the error is GREEN!
console.assert(result.evaluatedChars[5].charClass === 'char-correct', "Char 5 ('m') must be correct!");
console.assert(result.evaluatedChars[6].charClass === 'char-correct', "Char 6 ('a') must be correct!");
console.assert(result.evaluatedChars[7].charClass === 'char-correct', "Char 7 ('r') must be correct!");
console.assert(result.evaluatedChars[8].charClass === 'char-correct', "Char 8 ('i') must be correct!");
console.assert(result.evaluatedChars[9].charClass === 'char-correct', "Char 9 ('n') must be correct!");
console.assert(result.evaluatedChars[10].charClass === 'char-correct', "Char 10 ('e') must be correct!");
console.assert(result.evaluatedChars[11].charClass === 'char-correct', "Char 11 (' ') must be correct!");
console.assert(result.evaluatedChars[12].charClass === 'char-correct', "Char 12 ('i' in 'is') must be correct!");
console.assert(result.evaluatedChars[13].charClass === 'char-correct', "Char 13 ('s' in 'is') must be correct!");

// Verify cursor is on next char (index 14)
console.assert(result.evaluatedChars[14].isCursor === true, "Cursor must be on char 14");

console.log("Characters evaluation:");
result.evaluatedChars.slice(0, 15).forEach(c => {
  console.log(`  [${c.index}] exp:'${c.expectedChar}' typed:'${c.typedChar}' -> ${c.charClass} ${c.isCursor ? '<- CURSOR' : ''}`);
});

console.log("\nTEST 1 PASSED: User typed error, carried on freely, and all subsequent characters & words matched 100% GREEN!\n");

// TEST 2: Scoring model verification
function calculateScore(targetLength, level, elapsedSecs, errors) {
  const initialReserve = (targetLength * 25) + (level * 2500);
  const drainRate = 20 + (level * 10);
  const timeDrain = elapsedSecs * drainRate;
  const errorPenalty = errors * 500;
  return Math.max(0, Math.round(initialReserve - timeDrain - errorPenalty));
}

const scoreNoErrors = calculateScore(100, 3, 20, 0);
const score1Error = calculateScore(100, 3, 20, 1);
const score2Errors = calculateScore(100, 3, 20, 2);

console.log(`Score 0 errors: ${scoreNoErrors}`);
console.log(`Score 1 error:  ${score1Error} (-500)`);
console.log(`Score 2 errors: ${score2Errors} (-1000)`);

console.assert(scoreNoErrors - score1Error === 500, "1 error must deduct 500 points");
console.assert(scoreNoErrors - score2Errors === 1000, "2 errors must deduct 1000 points");

console.log("\nALL TESTS PASSED SUCCESSFULLY!");
