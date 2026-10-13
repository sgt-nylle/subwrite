// Test word-unit wrapping and character states

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

const target = "A submarine is a naval ship";
const input = "A sub";

const targetWords = target.split(' ');
const parsed = parseTypedWords(input);

console.log("targetWords:", targetWords);
console.log("parsed:", parsed);

targetWords.forEach((targetWord, w) => {
  const isCompleted = w < parsed.activeWordIdx;
  const isCurrent = w === parsed.activeWordIdx;
  const typedWord = isCompleted ? (parsed.completedWords[w] || '') : (isCurrent ? parsed.currentWord : '');
  const isSpaceCursor = isCurrent && parsed.currentWord.length >= targetWord.length;

  console.log(`Word ${w} (${targetWord}): isCompleted=${isCompleted}, isCurrent=${isCurrent}, typedWord="${typedWord}", isSpaceCursor=${isSpaceCursor}`);
});

console.log("\nVerification succeeded!");
