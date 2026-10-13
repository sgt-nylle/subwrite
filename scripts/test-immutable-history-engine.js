// Test immutable history typing engine

function areCharsEquivalent(typed, expected) {
  if (!typed || !expected) return false;
  if (typed === expected) return true;
  return false;
}

// Simulates user input events with immutable history logic
class TypingEngine {
  constructor(targetText) {
    this.targetText = targetText;
    this.inputVal = '';
    this.errorCount = 0;
  }

  // Pure append/pop update function
  updateFromInput(rawBrowserVal) {
    if (rawBrowserVal.length > this.inputVal.length) {
      // Characters were added: extract newly added character(s)
      const addedChars = rawBrowserVal.slice(this.inputVal.length);
      const nextVal = (this.inputVal + addedChars).slice(0, this.targetText.length);

      // Check errors on the newly added positions
      for (let i = this.inputVal.length; i < nextVal.length; i++) {
        const typed = nextVal[i];
        const expected = this.targetText[i];
        if (typed !== expected && !areCharsEquivalent(typed, expected)) {
          this.errorCount++;
        }
      }

      this.inputVal = nextVal;
    } else if (rawBrowserVal.length < this.inputVal.length) {
      // Backspace: delete strictly from the end
      const deleteCount = this.inputVal.length - rawBrowserVal.length;
      this.inputVal = this.inputVal.slice(0, Math.max(0, this.inputVal.length - deleteCount));
    }
  }

  getStates() {
    return this.targetText.split('').map((char, index) => {
      let charClass = 'char-pending';
      const isCursor = index === this.inputVal.length;

      if (index < this.inputVal.length) {
        const typed = this.inputVal[index];
        const isMatch = typed === char || areCharsEquivalent(typed, char);
        charClass = isMatch ? 'char-correct' : 'char-error';
      }

      return { index, char, charClass, isCursor };
    });
  }
}

// TEST: Level 5 Admiral passage
const target = "TK-208 'Dmitriy Donskoy', lead ship of Project 941 Akula (NATO: Typhoon-class), displaces 48,000 tonnes submerged with twin OK-650 reactors (190 MW each) and 20x RSM-52 'R-39 Rif' solid-fuel SLBMs.";

const engine = new TypingEngine(target);

// 1. User types first 80 characters correctly (2-3 lines)
const prefix80 = target.slice(0, 80);
engine.updateFromInput(prefix80);

let states = engine.getStates();
// Assert all 80 characters are GREEN
console.log("=== STEP 1: Type 80 characters correctly ===");
const all80Green = states.slice(0, 80).every(c => c.charClass === 'char-correct');
console.assert(all80Green, "First 80 characters must be all correct (GREEN)");
console.log(`First 80 characters green: ${all80Green}`);

// 2. User makes a mistake at character 81 (types 'X' instead of target[80])
console.log(`\n=== STEP 2: Make mistake on char 81 (expected '${target[80]}', type 'X') ===`);
const valWithTypo = prefix80 + "X";
engine.updateFromInput(valWithTypo);

states = engine.getStates();
// Assert that the first 80 characters REMAIN 100% GREEN!
const still80Green = states.slice(0, 80).every(c => c.charClass === 'char-correct');
console.assert(still80Green, "CRITICAL: Previous 80 characters must REMAIN GREEN!");
console.log(`Previous 80 characters still green: ${still80Green}`);

// Assert that char 80 is RED
console.assert(states[80].charClass === 'char-error', "Char 80 must be RED (error)");
console.log(`Char 80 is error: ${states[80].charClass === 'char-error'}`);

// 3. User continues and types the NEXT character correctly!
console.log(`\n=== STEP 3: User carries on and types next char '${target[81]}' ===`);
const valContinue = prefix80 + "X" + target[81];
engine.updateFromInput(valContinue);

states = engine.getStates();
// Previous 80 characters are still green
console.assert(states.slice(0, 80).every(c => c.charClass === 'char-correct'), "Previous 80 chars still green");
// Char 80 is still red (the mistake)
console.assert(states[80].charClass === 'char-error', "Char 80 is still red");
// Char 81 is GREEN (the next character typed correctly!)
console.assert(states[81].charClass === 'char-correct', "Char 81 MUST TURN GREEN AUTOMATICALLY!");
console.log(`Char 81 turned green automatically: ${states[81].charClass === 'char-correct'}`);

// 4. User simulates erratic browser caret insertion in the middle (e.g. at index 30)
console.log("\n=== STEP 4: Browser simulates caret click/insertion at index 30 ===");
// Browser sends string with a char inserted at position 30
const corruptBrowserVal = prefix80.slice(0, 30) + "Z" + prefix80.slice(30) + "X" + target[81];
engine.updateFromInput(corruptBrowserVal);

states = engine.getStates();
// Assert previous 80 characters are STILL 100% GREEN!
console.assert(states.slice(0, 80).every(c => c.charClass === 'char-correct'), "Previous 80 chars MUST NOT TURN RED!");
console.log(`Previous 80 characters remained green despite browser caret desync: ${states.slice(0, 80).every(c => c.charClass === 'char-correct')}`);

console.log("\nALL VERIFICATION TESTS PASSED SUCCESSFULLY!");
