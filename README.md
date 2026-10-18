# SubWrite! 🌊⌨️

> [!IMPORTANT]
> ### 🏆 Leaderboard Reset Announcement (Version 0.95)
> All highscores have been cleared as of **v0.95** to start from a completely clean slate.
>
> Because passage lengths across all 4 operational themes (**Submarine**, **Air Force**, **Army**, and **Pub / Off-Duty**) and all 5 difficulty levels have now been strictly standardized to exact proportional lengths (Level 1: 50% = 250 chars, Level 2: 60% = 300 chars, Level 3: 70% = 350 chars, Level 4: 90% = 450 chars, Level 5: 100% = 500 chars within a strict 2% margin) alongside rebalanced countdown timers, earlier playtest scores are no longer comparable.
>
> **Permanent Highscore Guarantee:** From version 0.95 onward, **no future highscores will be cleared**. This was an exclusive one-time reset conducted during active pre-release development to establish fair, permanent competitive leaderboards for all players.

> **Red October Commodore 64 Submarine Typing Speed Test**

SubWrite! is a retro 8-bit submarine-themed typing speed and accuracy web application inspired by the Cold War classic *The Hunt for Red October* and classic Commodore 64 terminal aesthetics.

---

## Features

- **4 Operational Themes & Visual Viewports:**
  - **Submarine (Red October / C64):** Crimson radar CRT glow, sonar acoustics, and ballast telemetry.
  - **Air Force (Saab JAS 39 Gripen / HUD):** Swedish aviation cockpit theme, jet afterburner audio, and altitude telemetry.
  - **Army (Stridsvagn 122 / Night Vision):** Emerald armor green military CRT, tank cannon acoustics, and combat range telemetry.
  - **Pub / Off-Duty (Local Tavern / Amber CRT):** Warm amber pub aesthetic, tavern chime acoustics, and rock music & brewing history.
- **Dual Language Support (English & Swedish):** Over 800 curated, calibrated passages with quick toggle via keyboard `[L]`.
- **5 Classified Difficulty Levels:**
  - **Level 1 (50% length - 250 chars):** Short, lowercase vocabulary, periods only, minimal punctuation.
  - **Level 2 (60% length - 300 chars):** Standard compound sentences, capitalization, proper nouns, and commas.
  - **Level 3 (70% length - 350 chars):** Operational history, fleet doctrine, semicolons, and dashes.
  - **Level 4 (90% length - 450 chars):** Exact technical specifications, reactor/engine power ratings, dates, and metric units.
  - **Level 5 (100% length - 500 chars):** Tactical dialogues, quotes, Cyrillic/callsign transliterations, and complex symbols.
- **Wikipedia Submarine Articles:** Curated passages extracted directly from submarine history and naval doctrine.
- **Arcade High Scoreboard:**
  - Retro 3-character initials input (e.g. `RAM`, `NYL`, `RED`).
  - Score algorithm factoring in speed, accuracy, and difficulty multiplier: `Score = (WPM * (Accuracy / 100)) * (Level * 200)`.
  - Local storage persistence for classified fleet records.
- **100% Keyboard-Driven Navigation:** The complete experience—theme switching, level selection, language toggling, in-game restarts, audio muting, and post-game leaderboard submissions—can be operated seamlessly without touching a mouse.
- **Synthesized 8-Bit Web Audio:**
  - Dynamic key clicks, sonar pings, error alarms, and victory fanfares synthesized in real-time via the Web Audio API (press `[S]` to mute/unmute).
- **Mobile & Smartphone Ready:**
  - Fully optimized for iOS and Android virtual keyboards.
  - Auto-capitalization and autocorrect suppressed to ensure pure typing test accuracy.
  - Tap-to-engage terminal prompt with responsive telemetry layout.

---

## ⌨️ Keyboard Controls Reference

SubWrite is designed for lightning-fast, mouse-free arcade gameplay. Every state of the application supports intuitive keyboard shortcuts:

| Context | Key / Shortcut | Action Description |
| :--- | :--- | :--- |
| **Universal** | `ESC` | Universal exit / back button: returns to Main Menu from active game or highscore menu |
| | `S` | Toggle synthesized sound effects and audio ON / OFF |
| **Main Menu** | `Enter` or `Space` | Launch typing mission with selected level, theme, and language |
| | `←` / `→` (Left / Right Arrows) | Cycle operational theme (*Submarine* ⇄ *Air Force* ⇄ *Army* ⇄ *Pub*) |
| | `↑` / `↓` (Up / Down Arrows) | Cycle difficulty level (Levels 1 to 5) |
| | `1` – `5` | Instantly select difficulty level 1 through 5 and launch mission |
| | `L` | Toggle passage language between English (`EN`) and Swedish (`SV`) |
| | `E` / `V` | Direct language selection (`E` = English, `V` = Svenska) |
| | `H` | Open Hall of Fame / High Scoreboard modal |
| **In-Game** | `Any Key` | Auto-focus capture: keystrokes immediately route to the terminal arena without clicking |
| | `Enter` | Instant restart: restarts mission immediately with a fresh random passage |
| | `ESC` | Abort mission and return to Main Menu |
| | `1` – `5` | Switch difficulty level before typing commences |
| | `Backspace` | Erase previous character without desynchronizing cursor state |
| **Scoreboard** | `Enter` | **First press:** Submit 3-letter callsign/initials<br>**Subsequent press:** Launch selected level for a new mission |
| | `←` / `↑` (Left / Up Arrows) | Decrease target level for next mission (cycles 5 → 4 → 3 → 2 → 1) |
| | `→` / `↓` (Right / Down Arrows) | Increase target level for next mission (cycles 1 → 2 → 3 → 4 → 5) |
| | `1` – `5` | Jump directly to level 1, 2, 3, 4, or 5 |
| | `L` | Toggle language (`EN` / `SV`) for next game |
| | `ESC` | Close scoreboard and return to Main Menu |

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

### Server Status Dashboard & Connection Monitor

A dedicated CLI tool `subwrite-status` is available to check health and incoming traffic:

```bash
# Instant status snapshot (Services, CPU, Memory, Disk, and Recent Visitors)
subwrite-status

# REAL-TIME LIVE connection stream (watch hits as they arrive with IP, device, latency)
subwrite-status -l
# or
subwrite-status --live

# Continuous auto-refreshing dashboard (refreshes every 2s)
subwrite-status -w

# Show last 30 requests
subwrite-status -n 30
```
