# SubWrite! 🌊⌨️

> **Red October Commodore 64 Submarine Typing Speed Test**

SubWrite! is a retro 8-bit submarine-themed typing speed and accuracy web application inspired by the Cold War classic *The Hunt for Red October* and classic Commodore 64 terminal aesthetics.

---

## Features

- **Red October C64 Aesthetic:**
  - Heavy tactical red CRT glow, scanlines, double beveled retro borders, and pulsating block cursor.
  - Authentic 8-bit retro monospace typography (`VT323` and `Press Start 2P`).
- **5 Classified Dive Difficulty Levels:**
  - **Level 1 (Cadet - 20m):** Short, lowercase words, minimal punctuation.
  - **Level 2 (Sonar Tech - 80m):** Standard sentences, capitalization, periods.
  - **Level 3 (Tactical Officer - 250m):** Nuclear submarine history, SSBN doctrine, complex vocabulary.
  - **Level 4 (Chief Engineer - 450m):** Deep technical specifications, reactor power ratings, cavitation physics, and numbers.
  - **Level 5 (Fleet Admiral - 700m):** Typhoon-class stealth doctrine, symbols, quotes, numbers, and Cyrillic transliterations.
- **Wikipedia Submarine Articles:** Curated passages extracted directly from submarine history and naval doctrine.
- **Arcade High Scoreboard:**
  - Retro 3-character initials input (e.g. `RAM`, `NYL`, `RED`).
  - Score algorithm factoring in speed, accuracy, and difficulty multiplier: `Score = (WPM * (Accuracy / 100)) * (Level * 200)`.
  - Local storage persistence for classified fleet records.
- **Synthesized 8-Bit Web Audio:**
  - Dynamic key clicks, sonar pings, error alarms, and victory fanfares synthesized in real-time via the Web Audio API.
- **Mobile & Smartphone Ready:**
  - Fully optimized for iOS and Android virtual keyboards.
  - Auto-capitalization and autocorrect suppressed to ensure pure typing test accuracy.
  - Tap-to-engage terminal prompt with responsive telemetry layout.

---

## Local Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build
```

---

## Production

The live application is hosted at [subwrite.se](https://subwrite.se).
