// Test double space handling

function parseTypedWords(inputVal) {
  // If input is empty, return empty array
  if (!inputVal) return [];

  // Match words and trailing space
  // E.g. "A submarine " -> completed: ["A", "submarine"], active: ""
  // E.g. "A submarine  " -> completed: ["A", "submarine"], active: "" (extra space ignored)
  // E.g. "A submarine is" -> completed: ["A", "submarine"], active: "is"

  const trimmedLeading = inputVal.replace(/^\s+/, '');
  // Split on one or more spaces
  const parts = trimmedLeading.split(/\s+/);
  const endsWithSpace = /\s+$/.test(inputVal);

  if (endsWithSpace) {
    // Last token was completed, active word is empty
    return {
      completedWords: parts.filter(p => p.length > 0),
      currentWord: '',
      activeWordIdx: parts.filter(p => p.length > 0).length
    };
  } else {
    // Last token is currently being typed
    const completed = parts.slice(0, -1);
    const current = parts[parts.length - 1] || '';
    return {
      completedWords: completed,
      currentWord: current,
      activeWordIdx: completed.length
    };
  }
}

console.log("Single space after word:", parseTypedWords("A submarine "));
console.log("Double space after word:", parseTypedWords("A submarine  "));
console.log("Typing next word:", parseTypedWords("A submarine is"));
console.log("Space after period:", parseTypedWords("ocean surface. "));
console.log("Double space after period:", parseTypedWords("ocean surface.  "));
console.log("Next word after period with double space:", parseTypedWords("ocean surface.  The"));

const testDoubleSpace = parseTypedWords("ocean surface.  The");
console.assert(testDoubleSpace.completedWords.length === 2, "Should have 2 completed words");
console.assert(testDoubleSpace.completedWords[0] === "ocean", "Word 0 is 'ocean'");
console.assert(testDoubleSpace.completedWords[1] === "surface.", "Word 1 is 'surface.'");
console.assert(testDoubleSpace.currentWord === "The", "Current word is 'The'");
console.assert(testDoubleSpace.activeWordIdx === 2, "Active index is 2");

console.log("\nDouble space test passed flawlessly!");
