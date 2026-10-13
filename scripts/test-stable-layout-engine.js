// Test stable flat character mapping with word-level synchronization

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

function parseTypedWords(input) {
  if (!input) return { completedWords: [], currentWord: '', activeWordIdx: 0 };
  const trimmedLeading = input.replace(/^\s+/, '');
  const tokens = trimmedLeading.split(/\s+/);
  const endsWithSpace = /\s+$/.test(input);

  if (endsWithSpace) {
    const completed = tokens.filter(t => t.length > 0);
    return {
      completedWords: completed,
      currentWord: '',
      activeWordIdx: completed.length
    };
  } else {
    const completed = tokens.slice(0, -1);
    const current = tokens[tokens.length - 1] || '';
    return {
      completedWords: completed,
      currentWord: current,
      activeWordIdx: completed.length
    };
  }
}

function isWordMatch(typedWord, targetWord) {
  if (typedWord === targetWord) return true;
  if (typedWord.length !== targetWord.length) return false;
  for (let i = 0; i < targetWord.length; i++) {
    if (typedWord[i] !== targetWord[i] && !areCharsEquivalent(typedWord[i], targetWord[i])) {
      return false;
    }
  }
  return true;
}

// Map each character in targetText to its word index and char index within word
function buildTargetCharMap(targetText) {
  const targetWords = targetText.split(' ');
  const charMap = [];

  let wordIdx = 0;
  let charInWord = 0;

  for (let i = 0; i < targetText.length; i++) {
    const char = targetText[i];
    if (char === ' ') {
      charMap.push({
        globalIdx: i,
        char,
        isSpace: true,
        wordIdx,
        charInWord: -1
      });
      wordIdx++;
      charInWord = 0;
    } else {
      charMap.push({
        globalIdx: i,
        char,
        isSpace: false,
        wordIdx,
        charInWord
      });
      charInWord++;
    }
  }

  return { targetWords, charMap };
}

function computeCharStates(targetText, inputVal) {
  const { targetWords, charMap } = buildTargetCharMap(targetText);
  const parsed = parseTypedWords(inputVal);

  return charMap.map(item => {
    const { char, isSpace, wordIdx, charInWord } = item;
    const isCompleted = wordIdx < parsed.activeWordIdx;
    const isCurrent = wordIdx === parsed.activeWordIdx;
    const targetWord = targetWords[wordIdx] || '';
    const typedWord = isCompleted
      ? (parsed.completedWords[wordIdx] || '')
      : (isCurrent ? parsed.currentWord : '');

    const wordHadError = isCompleted && !isWordMatch(typedWord, targetWord);

    let charClass = 'char-pending';
    let isCursor = false;

    if (isSpace) {
      if (isCompleted) {
        charClass = wordHadError ? 'char-error' : 'char-correct';
      } else if (isCurrent && parsed.currentWord.length >= targetWord.length) {
        // User typed all chars of current word, cursor is on the space!
        isCursor = true;
      }
    } else {
      if (isCompleted) {
        const isMatch = charInWord < typedWord.length && areCharsEquivalent(typedWord[charInWord], char);
        charClass = isMatch ? 'char-correct' : 'char-error';
      } else if (isCurrent) {
        if (charInWord < parsed.currentWord.length) {
          const isMatch = areCharsEquivalent(parsed.currentWord[charInWord], char);
          charClass = isMatch ? 'char-correct' : 'char-error';
        } else if (charInWord === parsed.currentWord.length) {
          isCursor = true;
        }
      }
    }

    return { char, charClass, isCursor, wordIdx };
  });
}

// TEST: Long sentence where word 1 is misstyped
const target = "A submarine is a naval ship built to travel beneath the ocean surface. The vessel uses large ballast tanks to dive down and surface safely.";
const input = "A submarne is a naval ship";

const evaluated = computeCharStates(target, input);

// Word 0 ("A") -> all correct
const word0 = evaluated.filter(c => c.wordIdx === 0 && c.char !== ' ');
console.assert(word0.every(c => c.charClass === 'char-correct'), "Word 0 should be correct");

// Word 1 ("submarine") -> chars 0..5 ('submar') correct, then error
const word1 = evaluated.filter(c => c.wordIdx === 1 && c.char !== ' ');
console.log("Word 1 states:", word1.map(c => `${c.char}:${c.charClass}`).join(' '));

// Word 2 ("is") -> all correct!
const word2 = evaluated.filter(c => c.wordIdx === 2 && c.char !== ' ');
console.assert(word2.every(c => c.charClass === 'char-correct'), "Word 2 ('is') must be ALL CORRECT!");
console.log("Word 2 ('is') states:", word2.map(c => `${c.char}:${c.charClass}`).join(' '));

// Word 3 ("a") -> all correct!
const word3 = evaluated.filter(c => c.wordIdx === 3 && c.char !== ' ');
console.assert(word3.every(c => c.charClass === 'char-correct'), "Word 3 ('a') must be ALL CORRECT!");

// Word 4 ("naval") -> all correct!
const word4 = evaluated.filter(c => c.wordIdx === 4 && c.char !== ' ');
console.assert(word4.every(c => c.charClass === 'char-correct'), "Word 4 ('naval') must be ALL CORRECT!");

// Check cursor position
const cursorChar = evaluated.find(c => c.isCursor);
console.log("Active cursor character:", cursorChar);
console.assert(cursorChar && cursorChar.char === ' ', "Cursor should be on the space after 'ship'");

console.log("\nStable flat character layout verification passed!");
