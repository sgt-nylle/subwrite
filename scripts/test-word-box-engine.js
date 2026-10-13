// Test word-box layout engine

function areCharsEquivalent(typed, expected) {
  if (!typed || !expected) return false;
  if (typed === expected) return true;
  return false;
}

function parseTypedWords(input) {
  if (!input) return { completedWords: [], currentWord: '', activeWordIdx: 0 };
  const trimmedLeading = input.replace(/^\s+/, '');
  const tokens = trimmedLeading.split(/\s+/);
  const endsWithSpace = /\s+$/.test(input);

  if (endsWithSpace) {
    const completed = tokens.filter(t => t.length > 0);
    return { completedWords: completed, currentWord: '', activeWordIdx: completed.length };
  } else {
    const completed = tokens.slice(0, -1);
    const current = tokens[tokens.length - 1] || '';
    return { completedWords: completed, currentWord: current, activeWordIdx: completed.length };
  }
}

const targetText = "A submarine is a naval ship";
const targetWords = targetText.split(' ');

function evaluateWordBox(inputVal) {
  const parsed = parseTypedWords(inputVal);

  return targetWords.map((targetWord, w) => {
    const isCompleted = w < parsed.activeWordIdx;
    const isCurrent = w === parsed.activeWordIdx;
    const typedWord = isCompleted
      ? (parsed.completedWords[w] || '')
      : (isCurrent ? parsed.currentWord : '');

    const isAllTyped = isCurrent && parsed.currentWord.length >= targetWord.length;

    const charList = targetWord.split('').map((char, c) => {
      let charClass = 'char-pending';
      let isCursor = false;
      let isEndWordCursor = false;

      if (isCompleted) {
        const isMatch = c < typedWord.length && areCharsEquivalent(typedWord[c], char);
        charClass = isMatch ? 'char-correct' : 'char-error';
      } else if (isCurrent) {
        if (c < parsed.currentWord.length) {
          const isMatch = areCharsEquivalent(parsed.currentWord[c], char);
          charClass = isMatch ? 'char-correct' : 'char-error';
        } else if (c === parsed.currentWord.length) {
          isCursor = true;
        }

        if (isAllTyped && c === targetWord.length - 1) {
          isEndWordCursor = true;
        }
      }

      return { char, charClass, isCursor, isEndWordCursor };
    });

    return { targetWord, isCompleted, isCurrent, isAllTyped, charList };
  });
}

// Case 1: Typing middle of word 1 ("sub")
const test1 = evaluateWordBox("A sub");
console.log("=== CASE 1: 'A sub' ===");
console.assert(test1[0].isCompleted === true, "Word 0 completed");
console.assert(test1[1].isCurrent === true, "Word 1 current");
console.assert(test1[1].charList[3].isCursor === true, "Cursor is on char 3 ('m')");
console.log("Word 1 chars:", test1[1].charList.map(c => `${c.char}:${c.charClass}${c.isCursor ? '[C]' : ''}`).join(' '));

// Case 2: Finished word 1 ("submarine"), needs space
const test2 = evaluateWordBox("A submarine");
console.log("\n=== CASE 2: 'A submarine' (All chars typed, needs space) ===");
console.assert(test2[1].isAllTyped === true, "Word 1 all typed");
console.assert(test2[1].charList[8].isEndWordCursor === true, "Last char has end word cursor");
console.log("Word 1 chars:", test2[1].charList.map(c => `${c.char}:${c.charClass}${c.isEndWordCursor ? '[END-C]' : ''}`).join(' '));

// Case 3: Typed space after word 1 ("A submarine ")
const test3 = evaluateWordBox("A submarine ");
console.log("\n=== CASE 3: 'A submarine ' (Space typed, moves to word 2) ===");
console.assert(test3[1].isCompleted === true, "Word 1 completed");
console.assert(test3[2].isCurrent === true, "Word 2 current");
console.assert(test3[2].charList[0].isCursor === true, "Cursor is on first char of word 2");
console.log("Word 2 chars:", test3[2].charList.map(c => `${c.char}:${c.charClass}${c.isCursor ? '[C]' : ''}`).join(' '));

console.log("\nWord-box evaluation tests all passed!");
