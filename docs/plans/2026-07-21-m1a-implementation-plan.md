# M1-A Implementation Plan: Pause/Speed Controls + Wave Summary

## Milestone Goal
Add a pure `game-controls` helper (pause/resume, 1x/2x speed, wave summary model), integrate it into GameScene without using Phaser's scene.pause, and show a clear Wave Summary overlay when a wave is cleared.

## Scope Constraints
- No new dependencies
- No changes to reward/wave rules
- No changes to existing maps, character assets, projectiles, hearts, upgrades, placement, progression
- Portrait layout preserved (360x640)
- UI must remain interactive while paused (no `scene.pause`)

---

## Step 1: TDD — Write Failing Tests

**File:** `tests/game-controls.test.ts`

### Pure logic to test:
1. **`scaleDelta(delta, controls)`**
   - Paused: returns 0 regardless of delta
   - Speed 1x: returns delta unchanged
   - Speed 2x: returns delta * 2
   - Paused + speed 2x: still returns 0

2. **`togglePause(controls)`**
   - Toggles `paused` from false → true
   - Toggles `paused` from true → false
   - Does not affect speed

3. **`setSpeed(controls, speed)`**
   - Sets speed to 1
   - Sets speed to 2
   - Rejects invalid speed values (clamp to 1 or 2)
   - Does not affect paused state

4. **`createWaveSummary(opts)`**
   - Returns correct wave number
   - Returns correct essence gained
   - Returns correct hearts remaining
   - Sets `hasNextWave` true when wave < maxWaves
   - Sets `hasNextWave` false when wave === maxWaves (final wave)

### Follow TDD skill:
- Write all tests first
- Run `npm test tests/game-controls.test.ts`
- Verify RED (all tests fail because `src/logic/game-controls.ts` does not exist)

---

## Step 2: Implement Minimal Helper

**File:** `src/logic/game-controls.ts`

### Types and functions:
```typescript
export interface GameControls {
  paused: boolean;
  speed: 1 | 2;
}

export function createGameControls(): GameControls
export function scaleDelta(delta: number, controls: GameControls): number
export function togglePause(controls: GameControls): void
export function setSpeed(controls: GameControls, speed: 1 | 2): void

export interface WaveSummary {
  waveNumber: number;
  essenceGained: number;
  heartsRemaining: number;
  hasNextWave: boolean;
}

export function createWaveSummary(opts: {
  waveNumber: number;
  essenceGained: number;
  heartsRemaining: number;
  totalWaves: number;
}): WaveSummary
```

### Implementation rules:
- `scaleDelta`: `if (paused) return 0; return delta * speed;`
- `togglePause`: `controls.paused = !controls.paused;`
- `setSpeed`: `if (speed === 1 || speed === 2) controls.speed = speed;`
- `createWaveSummary`: straight mapping, `hasNextWave = waveNumber < totalWaves`

---

## Step 3: Verify GREEN

Run `npm test tests/game-controls.test.ts` — all tests pass.

---

## Step 4: Integrate into GameScene

**File:** `src/scenes/GameScene.ts`

### 4a. New state fields:
```typescript
private controls: GameControls = createGameControls();
private waveSummaryContainer: Phaser.GameObjects.Container | null = null;
private essenceAtWaveStart: number = 0;
private livesAtWaveStart: number = 0;
```

### 4b. Pause/Resume button:
- Position: top-right area, near existing DBG button (e.g., x=300, y=50)
- Visual: rectangle with "PAUSE"/"RESUME" text
- On tap: calls `togglePause(this.controls)`, updates button label
- While paused: button remains interactive (UI stays responsive)

### 4c. Speed button:
- Position: next to pause button (e.g., x=240, y=50)
- Visual: rectangle with "1x"/"2x" text
- On tap: cycles between 1 and 2 via `setSpeed()`, updates label

### 4d. Modify `update()`:
- First line after gameOver check: `const effectiveDelta = scaleDelta(delta, this.controls);`
- Replace all `delta` usages in the update loop with `effectiveDelta`
- Exception: `this.gameTickMs += delta;` becomes `this.gameTickMs += effectiveDelta;` (game clock also pauses)
- The HUD update and wave status check still run (UI remains interactive)

### 4e. Wave start tracking:
- In `startWave()`: record `this.essenceAtWaveStart = this.state.essence;` and `this.livesAtWaveStart = this.state.lives;`

### 4f. Wave Summary overlay:
- When wave is cleared (the existing block at line 637-644), instead of just updating waveStatusText:
  1. Build `WaveSummary` via `createWaveSummary({ waveNumber: state.wave - 1, essenceGained: state.essence - this.essenceAtWaveStart, heartsRemaining: state.lives, totalWaves: 5 })`
  2. Create a semi-transparent overlay container with:
     - Title: "Wave {N} Cleared!"
     - Essence gained: "+{X} Essence"
     - Hearts: "{hearts emoji} {N}/{MAX}"
     - Next wave prompt: "Tap to continue" (or "Victory!" if final wave)
  3. Tap anywhere on overlay to dismiss it and show start button
- The existing start-wave button logic continues to work after dismissal

### 4g. Imports:
- Add `import { GameControls, createGameControls, scaleDelta, togglePause, setSpeed, WaveSummary, createWaveSummary } from '../logic/game-controls';`

---

## Step 5: Verify — Full Test Suite

Run `npm test` — all 27 existing tests + new game-controls tests pass.

---

## Step 6: Verify — TypeScript Build

Run `npm run build` — no type errors, Vite build succeeds.

---

## Step 7: Verify — git diff --check

Run `git diff --check` — no whitespace errors.

---

## Step 8: Commit

Conventional commit: `feat(m1-a): add pause/speed controls and wave summary`

---

## Files Modified
| File | Action |
|------|--------|
| `src/logic/game-controls.ts` | **NEW** — pure logic helper |
| `tests/game-controls.test.ts` | **NEW** — TDD tests |
| `src/scenes/GameScene.ts` | **MODIFIED** — integration |

## Files NOT Modified
- All data files (tower-data, enemy-data, wave-data, maps)
- All logic files (game-state, damage, economy, targeting, wave-system, heart-display, etc.)
- All entity files (Tower, Enemy, Projectile)
- All rendering files (MapRenderer, PixelEffects)
- All existing test files
- Config files (package.json, tsconfig, vite, vitest)
