// Test word alignment and scoring engine

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

  return false;
}

// Function to compute character classes using word synchronization
function evaluateTyping(targetText, inputVal) {
  const targetWords = targetText.split(' ');
  const typedWords = inputVal.split(' ');
  const activeWordIdx = Math.max(0, typedWords.length - 1);

  let continuedErrors = 0;
  const wordEvaluations = [];

  for (let w = 0; w < targetWords.length; w++) {
    const targetWord = targetWords[w];
    const isCompleted = w < activeWordIdx;
    const isCurrent = w === activeWordIdx;
    const isFuture = w > activeWordIdx;

    const typedWord = isCompleted || isCurrent ? (typedWords[w] || '') : '';

    let wordHasError = false;
    const charStates = [];

    if (isCompleted) {
      // Completed word: check if it matched
      if (typedWord !== targetWord) {
        // Check character equivalence
        let allMatch = typedWord.length === targetWord.length;
        if (allMatch) {
          for (let i = 0; i < targetWord.length; i++) {
            if (!areCharsEquivalent(typedWord[i], targetWord[i])) {
              allMatch = false;
              break;
            }
          }
        }
        wordHasError = !allMatch;
      }
      if (wordHasError) continuedErrors++;

      // Character highlighting for completed word
      for (let i = 0; i < targetWord.length; i++) {
        if (wordHasError) {
          // If word was wrong, characters are marked error or what matched
          const isCharMatch = i < typedWord.length && areCharsEquivalent(typedWord[i], targetWord[i]);
          charStates.push(isCharMatch ? 'char-correct' : 'char-error');
        } else {
          charStates.push('char-correct');
        }
      }
    } else if (isCurrent) {
      // Currently active word
      for (let i = 0; i < targetWord.length; i++) {
        if (i < typedWord.length) {
          const match = areCharsEquivalent(typedWord[i], targetWord[i]);
          charStates.push(match ? 'char-correct' : 'char-error');
        } else {
          charStates.push('char-pending');
        }
      }
    } else {
      // Future word
      for (let i = 0; i < targetWord.length; i++) {
        charStates.push('char-pending');
      }
    }

    wordEvaluations.push({
      targetWord,
      typedWord,
      isCompleted,
      isCurrent,
      isFuture,
      wordHasError,
      charStates
    });
  }

  return { wordEvaluations, continuedErrors };
}

// TEST 1: Long sentence where word 1 is misstyped and user CONTINUES typing subsequent words correctly
const target = "A submarine is a naval ship built to travel beneath the ocean surface. The vessel uses large ballast tanks to dive down and surface safely.";
// User types "A submarne is a naval ship" (missing 'i' in submarine, but typed the rest correctly)
const input = "A submarne is a naval ship";

const result = evaluateTyping(target, input);

console.log("=== TEST 1: MISSTYPE IN WORD 1 AND CONTINUE ===");
console.log(`Target: "${target}"`);
console.log(`Typed: "${input}"`);
console.log(`Continued errors detected: ${result.continuedErrors}`);
console.assert(result.continuedErrors === 1, `Expected exactly 1 continued error, got ${result.continuedErrors}`);

// Check that word 0 ("A") is all correct
console.assert(result.wordEvaluations[0].charStates.every(s => s === 'char-correct'), "Word 0 should be all correct");

// Check that word 1 ("submarine") has error
console.assert(result.wordEvaluations[1].wordHasError === true, "Word 1 should be flagged as error");

// Check that word 2 ("is") is all correct!
console.assert(result.wordEvaluations[2].charStates.every(s => s === 'char-correct'), "Word 2 ('is') should be ALL CORRECT, NOT RED!");
console.log("Word 2 ('is') charStates:", result.wordEvaluations[2].charStates);

// Check that word 3 ("a") is all correct!
console.assert(result.wordEvaluations[3].charStates.every(s => s === 'char-correct'), "Word 3 ('a') should be ALL CORRECT, NOT RED!");
console.log("Word 3 ('a') charStates:", result.wordEvaluations[3].charStates);

// Check that word 4 ("naval") is all correct!
console.assert(result.wordEvaluations[4].charStates.every(s => s === 'char-correct'), "Word 4 ('naval') should be ALL CORRECT, NOT RED!");
console.log("Word 4 ('naval') charStates:", result.wordEvaluations[4].charStates);

// Check that word 5 ("ship") is currently being typed and all correct!
console.assert(result.wordEvaluations[5].charStates.every(s => s === 'char-correct'), "Word 5 ('ship') should be ALL CORRECT, NOT RED!");
console.log("Word 5 ('ship') charStates:", result.wordEvaluations[5].charStates);

// Future words are pending
console.assert(result.wordEvaluations[6].charStates.every(s => s === 'char-pending'), "Word 6 ('built') should be pending");

console.log("\nTEST 1 PASSED: Subsequent words remain GREEN despite previous error!\n");

// TEST 2: Scoring model calculation
function calculateMissionScore(targetLength, level, elapsedSecs, continuedErrors) {
  const initialReserve = (targetLength * 25) + (level * 2500);
  const drainRate = 20 + (level * 10);
  const timeDrain = elapsedSecs * drainRate;
  const errorPenalty = continuedErrors * 500;
  const finalScore = Math.max(0, Math.round(initialReserve - timeDrain - errorPenalty));
  return { initialReserve, drainRate, timeDrain, errorPenalty, finalScore };
}

console.log("=== TEST 2: TIME DRAIN AND ERROR PENALTY ===");
const fastTypist = calculateMissionScore(140, 3, 20, 0); // 20s, 0 errors
const slowTypist = calculateMissionScore(140, 3, 60, 0); // 60s, 0 errors
const typistWith2Errors = calculateMissionScore(140, 3, 20, 2); // 20s, 2 errors (-1000 pts)

console.log(`Fast typist (20s): Score = ${fastTypist.finalScore}`);
console.log(`Slow typist (60s): Score = ${slowTypist.finalScore}`);
console.log(`Typist with 2 errors (20s): Score = ${typistWith2Errors.finalScore}`);

console.assert(fastTypist.finalScore > slowTypist.finalScore, "Faster typist must score higher than slow typist");
console.assert(fastTypist.finalScore - typistWith2Errors.finalScore === 1000, "2 errors must deduct exactly 1000 points (500 pts each)");

console.log("\nALL VERIFICATION TESTS PASSED SUCCESSFULLY!");
