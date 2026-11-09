// Test script for character equivalencies and passage completion

const areCharsEquivalent = (typed, expected) => {
  if (!typed || !expected) return false;
  if (typed === expected) return true;

  // Single quotes, apostrophes, backticks, acute accents
  const isSingleQuote = (c) => c === "'" || c === '’' || c === '‘' || c === '`' || c === '´';
  if (isSingleQuote(typed) && isSingleQuote(expected)) return true;

  // Double quotes, smart double quotes, guillemets
  const isDoubleQuote = (c) => c === '"' || c === '“' || c === '”' || c === '«' || c === '»';
  if (isDoubleQuote(typed) && isDoubleQuote(expected)) return true;

  // Hyphens, en-dashes, em-dashes, minus signs
  const isDash = (c) => c === '-' || c === '—' || c === '–' || c === '−';
  if (isDash(typed) && isDash(expected)) return true;

  // Standard and non-breaking spaces
  const isSpace = (c) => c === ' ' || c === '\u00A0';
  if (isSpace(typed) && isSpace(expected)) return true;

  return false;
};

// 1. Test quotes
console.assert(areCharsEquivalent("'", "’"), "Straight quote should match curly right quote");
console.assert(areCharsEquivalent("'", "‘"), "Straight quote should match curly left quote");
console.assert(areCharsEquivalent("’", "'"), "Curly quote should match straight quote");
console.assert(areCharsEquivalent('"', "“"), "Straight double quote should match curly left quote");
console.assert(areCharsEquivalent('"', "”"), "Straight double quote should match curly right quote");

// 2. Test dashes
console.assert(areCharsEquivalent("-", "—"), "Hyphen should match em-dash");
console.assert(areCharsEquivalent("-", "–"), "Hyphen should match en-dash");
console.assert(areCharsEquivalent("—", "-"), "Em-dash should match hyphen");

// 3. Test spaces
console.assert(areCharsEquivalent(" ", "\u00A0"), "Normal space should match non-breaking space");

// 4. Test non-equivalent (including strict Swedish å/ä/ö matching)
console.assert(!areCharsEquivalent("a", "b"), "Different letters should not match");
console.assert(!areCharsEquivalent("a", "ä"), "'a' should not match 'ä'");
console.assert(!areCharsEquivalent("a", "å"), "'a' should not match 'å'");
console.assert(!areCharsEquivalent("o", "ö"), "'o' should not match 'ö'");
console.assert(!areCharsEquivalent("A", "Ä"), "'A' should not match 'Ä'");
console.assert(!areCharsEquivalent("A", "Å"), "'A' should not match 'Å'");
console.assert(!areCharsEquivalent("O", "Ö"), "'O' should not match 'Ö'");
console.assert(areCharsEquivalent("ä", "ä"), "'ä' should match 'ä'");
console.assert(areCharsEquivalent("å", "å"), "'å' should match 'å'");
console.assert(areCharsEquivalent("ö", "ö"), "'ö' should match 'ö'");
console.assert(!areCharsEquivalent("-", "."), "Hyphen and period should not match");
console.assert(!areCharsEquivalent("'", '"'), "Single and double quote should not match");

console.log("All character equivalence tests passed successfully!");
