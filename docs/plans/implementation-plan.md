# Shadow Kingdom: Bastion — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a playable portrait mobile-first Tower Defense game (Milestone 1) using Phaser 3 + TypeScript + Vite + Vitest with testable game logic separated from Phaser scenes.

**Architecture:** Pure logic modules in `src/logic/` (no Phaser imports) are tested via Vitest. Data files in `src/data/` hold all constants. Phaser scenes in `src/scenes/` coordinate rendering. UI panels handle touch/mouse input and delegate to logic layer. Fixed tower placement on a winding path with 5 waves.

**Tech Stack:** Phaser 3, TypeScript, Vite, Vitest

---

## File Structure

```
src/
  main.ts                              # Phaser game bootstrap
  config/
    game-config.ts                     # Phaser config (360x640, Scale.FIT)
  data/
    tower-data.ts                      # Tower stats, costs, upgrade levels
    enemy-data.ts                      # Enemy stats, types
    wave-data.ts                       # Wave composition
    map-data.ts                        # Placement slots, path waypoints
  logic/
    game-state.ts                      # Central state: lives, essence, wave, towers[]
    economy.ts                         # Essence gain/spend, sell refund
    wave-system.ts                     # Wave spawning, progression
    targeting.ts                       # Tower target selection
    damage.ts                          # Damage calculation, projectile hit
  entities/
    Tower.ts                           # Tower Phaser sprite + data binding
    Enemy.ts                           # Enemy Phaser sprite + path follow
    Projectile.ts                      # Projectile movement + hit
  scenes/
    BootScene.ts                       # Asset loading (placeholder textures)
    MenuScene.ts                       # Title screen + start button
    GameScene.ts                       # Main gameplay coordinator
    ResultScene.ts                     # Win/Lose + restart button
  ui/
    Hud.ts                             # Lives, Essence, Wave display
    TowerSelectionPanel.ts             # Tower buy panel on slot tap
    TowerUpgradePanel.ts               # Upgrade/sell panel on tower tap
  rendering/
    MapRenderer.ts                     # Draw path, placement slots
    PixelEffects.ts                    # Placeholder particle/effect helpers

tests/
  game-state.test.ts
  economy.test.ts
  wave-system.test.ts
  targeting.test.ts
  damage.test.ts
  tower-combat.test.ts
  mobile-layout.test.ts
```

---

## Task 1: Project Scaffold

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `vitest.config.ts`
- Create: `index.html`
- Create: `src/main.ts`
- Create: `src/config/game-config.ts`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "shadow-bastion",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

- [ ] **Step 2: Install dependencies**

```bash
npm install phaser@3
npm install -D typescript vite vitest @types/node
```

- [ ] **Step 3: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "dist",
    "rootDir": "src",
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] },
    "types": ["vitest/globals"]
  },
  "include": ["src"]
}
```

- [ ] **Step 4: Create vite.config.ts**

```ts
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: { '@': resolve(__dirname, 'src') },
  },
  base: './',
});
```

- [ ] **Step 5: Create vitest.config.ts**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
});
```

- [ ] **Step 6: Create index.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Shadow Kingdom: Bastion</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #0a0a1a; overflow: hidden; touch-action: none; }
  </style>
</head>
<body>
  <div id="game"></div>
  <script type="module" src="/src/main.ts"></script>
</body>
</html>
```

- [ ] **Step 7: Create src/main.ts**

```ts
import Phaser from 'phaser';
import { GameConfig } from './config/game-config';

new Phaser.Game(GameConfig);
```

- [ ] **Step 8: Create src/config/game-config.ts**

```ts
import Phaser from 'phaser';

export const GameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 360,
  height: 640,
  parent: 'game',
  backgroundColor: '#0a0a1a',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [],
};
```

- [ ] **Step 9: Run dev server to verify scaffold**

```bash
npm run dev
# Verify no errors in console
```

---

## Task 2: Data Layer

**Files:**
- Create: `src/data/tower-data.ts`
- Create: `src/data/enemy-data.ts`
- Create: `src/data/wave-data.ts`
- Create: `src/data/map-data.ts`

- [ ] **Step 1: Create tower-data.ts**

```ts
export type TowerType = 'archer' | 'cannon' | 'frost';

export interface TowerStats {
  type: TowerType;
  name: string;
  cost: number;
  damage: number;
  range: number;
  fireRate: number; // shots per second
  description: string;
  color: number;
}

export interface TowerLevel {
  level: number;
  stats: TowerStats;
  upgradeCost: number;
}

export const TOWER_LEVELS: Record<TowerType, TowerLevel[]> = {
  archer: [
    { level: 1, stats: { type: 'archer', name: 'Shadow Archer', cost: 50, damage: 8, range: 80, fireRate: 2, description: 'Fast single-target DPS', color: 0x9b59b6 }, upgradeCost: 40 },
    { level: 2, stats: { type: 'archer', name: 'Shadow Archer', cost: 50, damage: 15, range: 100, fireRate: 2.5, description: 'Fast single-target DPS', color: 0x9b59b6 }, upgradeCost: 60 },
    { level: 3, stats: { type: 'archer', name: 'Shadow Archer', cost: 50, damage: 25, range: 120, fireRate: 3, description: 'Fast single-target DPS', color: 0x9b59b6 }, upgradeCost: 0 },
  ],
  cannon: [
    { level: 1, stats: { type: 'cannon', name: 'Crystal Cannon', cost: 100, damage: 20, range: 70, fireRate: 0.8, description: 'Area damage, slow fire', color: 0xe74c3c }, upgradeCost: 75 },
    { level: 2, stats: { type: 'cannon', name: 'Crystal Cannon', cost: 100, damage: 40, range: 85, fireRate: 0.9, description: 'Area damage, slow fire', color: 0xe74c3c }, upgradeCost: 100 },
    { level: 3, stats: { type: 'cannon', name: 'Crystal Cannon', cost: 100, damage: 70, range: 100, fireRate: 1, description: 'Area damage, slow fire', color: 0xe74c3c }, upgradeCost: 0 },
  ],
  frost: [
    { level: 1, stats: { type: 'frost', name: 'Frost Mage', cost: 75, damage: 5, range: 90, fireRate: 1.2, description: 'Slows enemies', color: 0x3498db }, upgradeCost: 50 },
    { level: 2, stats: { type: 'frost', name: 'Frost Mage', cost: 75, damage: 10, range: 110, fireRate: 1.4, description: 'Slows enemies more', color: 0x3498db }, upgradeCost: 75 },
    { level: 3, stats: { type: 'frost', name: 'Frost Mage', cost: 75, damage: 18, range: 130, fireRate: 1.6, description: 'Strong slow + damage', color: 0x3498db }, upgradeCost: 0 },
  ],
};

export const SLOW_FACTOR = 0.5;
export const SLOW_DURATION = 2000; // ms
export const CANNON_SPLASH_RADIUS = 40;
```

- [ ] **Step 2: Create enemy-data.ts**

```ts
export type EnemyType = 'shade' | 'brute' | 'wraith' | 'captain';

export interface EnemyStats {
  type: EnemyType;
  name: string;
  hp: number;
  speed: number; // pixels per second
  reward: number; // essence on kill
  livesCost: number; // lives lost on reaching gate
  color: number;
  radius: number;
}

export const ENEMY_DATA: Record<EnemyType, EnemyStats> = {
  shade: { type: 'shade', name: 'Shade', hp: 30, speed: 60, reward: 10, livesCost: 1, color: 0x1a1a2e, radius: 6 },
  brute: { type: 'brute', name: 'Brute', hp: 120, speed: 30, reward: 25, livesCost: 2, color: 0x8b4513, radius: 10 },
  wraith: { type: 'wraith', name: 'Wraith', hp: 60, speed: 45, reward: 20, livesCost: 1, color: 0x6c3483, radius: 8 },
  captain: { type: 'captain', name: 'Shadow Captain', hp: 300, speed: 25, reward: 100, livesCost: 3, color: 0xc0392b, radius: 12 },
};

export const WRAITH_SLOW_IMMUNE_DURATION = 3000; // ms after spawn
```

- [ ] **Step 3: Create wave-data.ts**

```ts
import { EnemyType } from './enemy-data';

export interface WaveEntry {
  type: EnemyType;
  count: number;
  delay: number; // ms between spawns
}

export interface Wave {
  number: number;
  entries: WaveEntry[];
  pauseBefore: number; // ms pause before wave starts
}

export const WAVES: Wave[] = [
  {
    number: 1,
    pauseBefore: 3000,
    entries: [
      { type: 'shade', count: 6, delay: 1000 },
    ],
  },
  {
    number: 2,
    pauseBefore: 5000,
    entries: [
      { type: 'shade', count: 8, delay: 800 },
      { type: 'brute', count: 2, delay: 2000 },
    ],
  },
  {
    number: 3,
    pauseBefore: 5000,
    entries: [
      { type: 'brute', count: 4, delay: 1500 },
      { type: 'shade', count: 6, delay: 700 },
    ],
  },
  {
    number: 4,
    pauseBefore: 5000,
    entries: [
      { type: 'shade', count: 5, delay: 700 },
      { type: 'brute', count: 3, delay: 1500 },
      { type: 'wraith', count: 3, delay: 1200 },
    ],
  },
  {
    number: 5,
    pauseBefore: 5000,
    entries: [
      { type: 'shade', count: 8, delay: 600 },
      { type: 'brute', count: 4, delay: 1200 },
      { type: 'wraith', count: 4, delay: 1000 },
      { type: 'captain', count: 1, delay: 3000 },
    ],
  },
];
```

- [ ] **Step 4: Create map-data.ts**

```ts
export interface PlacementSlot {
  id: number;
  x: number;
  y: number;
  role: string; // 'curve', 'junction', 'pre-gate', etc.
}

export interface PathPoint {
  x: number;
  y: number;
}

// Winding path from top to bottom
export const PATH_POINTS: PathPoint[] = [
  { x: 180, y: -20 },
  { x: 180, y: 80 },
  { x: 100, y: 150 },
  { x: 80, y: 250 },
  { x: 160, y: 320 },
  { x: 280, y: 350 },
  { x: 300, y: 430 },
  { x: 200, y: 480 },
  { x: 100, y: 520 },
  { x: 80, y: 580 },
  { x: 180, y: 660 },
];

// 8 fixed placement slots
export const PLACEMENT_SLOTS: PlacementSlot[] = [
  { id: 0, x: 130, y: 110, role: 'top-curve-left' },
  { id: 1, x: 230, y: 110, role: 'top-curve-right' },
  { id: 2, x: 40, y: 200, role: 'mid-left' },
  { id: 3, x: 140, y: 230, role: 'mid-center' },
  { id: 4, x: 220, y: 310, role: 'junction-right' },
  { id: 5, x: 120, y: 400, role: 'lower-left' },
  { id: 6, x: 250, y: 460, role: 'lower-right' },
  { id: 7, x: 140, y: 540, role: 'pre-gate' },
];

export const GATE_POSITION = { x: 180, y: 620 };
```

- [ ] **Step 5: Verify no import errors**

```bash
npx tsc --noEmit
```

---

## Task 3: Game State Logic (TDD)

**Files:**
- Create: `src/logic/game-state.ts`
- Create: `tests/game-state.test.ts`

- [ ] **Step 1: Write failing test — initial state**

```ts
// tests/game-state.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { createGameState, GameState } from '../src/logic/game-state';

describe('GameState', () => {
  let state: GameState;

  beforeEach(() => {
    state = createGameState();
  });

  it('creates initial state with correct values', () => {
    expect(state.lives).toBe(10);
    expect(state.essence).toBe(100);
    expect(state.wave).toBe(1);
    expect(state.phase).toBe('prep');
    expect(state.towers).toEqual([]);
    expect(state.enemies).toEqual([]);
    expect(state.gameOver).toBe(false);
    expect(state.won).toBe(false);
  });
});
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npx vitest run tests/game-state.test.ts
```

- [ ] **Step 3: Implement game-state.ts (minimal)**

```ts
// src/logic/game-state.ts
export type TowerType = 'archer' | 'cannon' | 'frost';
export type GamePhase = 'prep' | 'wave' | 'result';
export type GameResult = null | 'win' | 'lose';

export interface PlacedTower {
  id: number;
  slotId: number;
  type: TowerType;
  level: number;
  totalCost: number;
}

export interface ActiveEnemy {
  id: number;
  type: string;
  hp: number;
  maxHp: number;
  speed: number;
  reward: number;
  livesCost: number;
  pathIndex: number;
  pathProgress: number;
  slowTimer: number;
  alive: boolean;
}

export interface GameState {
  lives: number;
  essence: number;
  wave: number;
  phase: GamePhase;
  towers: PlacedTower[];
  enemies: ActiveEnemy[];
  gameOver: boolean;
  won: boolean;
  nextTowerId: number;
  nextEnemyId: number;
}

let towerIdCounter = 0;
let enemyIdCounter = 0;

export function createGameState(): GameState {
  towerIdCounter = 0;
  enemyIdCounter = 0;
  return {
    lives: 10,
    essence: 100,
    wave: 1,
    phase: 'prep',
    towers: [],
    enemies: [],
    gameOver: false,
    won: false,
    nextTowerId: 0,
    nextEnemyId: 0,
  };
}
```

- [ ] **Step 4: Run test — verify it passes**

```bash
npx vitest run tests/game-state.test.ts
```

- [ ] **Step 5: Write failing test — place tower**

Add to `tests/game-state.test.ts`:

```ts
it('can place a tower on an empty slot with enough essence', () => {
  const result = placeTower(state, 0, 'archer');
  expect(result.success).toBe(true);
  expect(state.towers).toHaveLength(1);
  expect(state.towers[0].type).toBe('archer');
  expect(state.towers[0].slotId).toBe(0);
  expect(state.essence).toBe(50); // 100 - 50
});

it('rejects placement on occupied slot', () => {
  placeTower(state, 0, 'archer');
  const result = placeTower(state, 0, 'cannon');
  expect(result.success).toBe(false);
  expect(result.reason).toBe('slot_occupied');
  expect(state.essence).toBe(50); // unchanged
});

it('rejects placement without enough essence', () => {
  state.essence = 30;
  const result = placeTower(state, 0, 'cannon');
  expect(result.success).toBe(false);
  expect(result.reason).toBe('insufficient_essence');
  expect(state.essence).toBe(30);
});
```

- [ ] **Step 6: Run test — verify fails**

```bash
npx vitest run tests/game-state.test.ts
```

- [ ] **Step 7: Implement placeTower**

Add to `src/logic/game-state.ts`:

```ts
import { TOWER_LEVELS } from '../data/tower-data';

export interface PlacementResult {
  success: boolean;
  reason?: string;
}

export function placeTower(state: GameState, slotId: number, type: TowerType): PlacementResult {
  const levelData = TOWER_LEVELS[type][0];
  if (state.towers.some(t => t.slotId === slotId)) {
    return { success: false, reason: 'slot_occupied' };
  }
  if (state.essence < levelData.stats.cost) {
    return { success: false, reason: 'insufficient_essence' };
  }
  state.essence -= levelData.stats.cost;
  const tower: PlacedTower = {
    id: state.nextTowerId++,
    slotId,
    type,
    level: 1,
    totalCost: levelData.stats.cost,
  };
  state.towers.push(tower);
  return { success: true };
}
```

- [ ] **Step 8: Run test — verify passes**

```bash
npx vitest run tests/game-state.test.ts
```

- [ ] **Step 9: Write failing test — upgrade tower**

```ts
it('upgrades a tower and deducts essence', () => {
  placeTower(state, 0, 'archer');
  const result = upgradeTower(state, 0);
  expect(result.success).toBe(true);
  expect(state.towers[0].level).toBe(2);
  expect(state.essence).toBe(10); // 50 - 40
});

it('rejects upgrade at max level', () => {
  placeTower(state, 0, 'archer');
  upgradeTower(state, 0);
  upgradeTower(state, 0);
  const result = upgradeTower(state, 0);
  expect(result.success).toBe(false);
  expect(result.reason).toBe('max_level');
});
```

- [ ] **Step 10: Implement upgradeTower**

Add to `src/logic/game-state.ts`:

```ts
export interface UpgradeResult {
  success: boolean;
  reason?: string;
}

export function upgradeTower(state: GameState, towerId: number): UpgradeResult {
  const tower = state.towers.find(t => t.id === towerId);
  if (!tower) return { success: false, reason: 'tower_not_found' };

  const levels = TOWER_LEVELS[tower.type];
  if (tower.level >= levels.length) return { success: false, reason: 'max_level' };

  const nextLevel = levels[tower.level]; // 0-indexed: level 2 is at index 1
  if (state.essence < nextLevel.upgradeCost) return { success: false, reason: 'insufficient_essence' };

  state.essence -= nextLevel.upgradeCost;
  tower.level++;
  tower.totalCost += nextLevel.upgradeCost;
  return { success: true };
}
```

- [ ] **Step 11: Write failing test — sell tower**

```ts
it('sells a tower and refunds 70% essence', () => {
  placeTower(state, 0, 'archer');
  const result = sellTower(state, 0);
  expect(result.success).toBe(true);
  expect(state.essence).toBe(85); // 50 + 35 (70% of 50)
  expect(state.towers).toHaveLength(0);
});
```

- [ ] **Step 12: Implement sellTower**

```ts
export function sellTower(state: GameState, towerId: number): UpgradeResult {
  const idx = state.towers.findIndex(t => t.id === towerId);
  if (idx === -1) return { success: false, reason: 'tower_not_found' };

  const tower = state.towers[idx];
  const refund = Math.floor(tower.totalCost * 0.7);
  state.essence += refund;
  state.towers.splice(idx, 1);
  return { success: true };
}
```

- [ ] **Step 13: Write failing test — enemy reaches gate**

```ts
it('deducts lives when enemy reaches gate', () => {
  state.enemies.push({
    id: 0, type: 'shade', hp: 10, maxHp: 10, speed: 60,
    reward: 10, livesCost: 1, pathIndex: 10, pathProgress: 1,
    slowTimer: 0, alive: true,
  });
  enemyReachedGate(state, 0);
  expect(state.lives).toBe(9);
  expect(state.gameOver).toBe(false);
});

it('sets gameOver when lives reach 0', () => {
  state.lives = 1;
  state.enemies.push({
    id: 0, type: 'brute', hp: 10, maxHp: 10, speed: 30,
    reward: 25, livesCost: 2, pathIndex: 10, pathProgress: 1,
    slowTimer: 0, alive: true,
  });
  enemyReachedGate(state, 0);
  expect(state.lives).toBe(-1);
  expect(state.gameOver).toBe(true);
  expect(state.won).toBe(false);
});
```

- [ ] **Step 14: Implement enemyReachedGate**

```ts
export function enemyReachedGate(state: GameState, enemyId: number): void {
  const enemy = state.enemies.find(e => e.id === enemyId);
  if (!enemy || !enemy.alive) return;

  state.lives -= enemy.livesCost;
  enemy.alive = false;

  if (state.lives <= 0) {
    state.gameOver = true;
    state.won = false;
    state.phase = 'result';
  }
}
```

- [ ] **Step 15: Write failing test — restart**

```ts
it('restart clears state to initial values', () => {
  placeTower(state, 0, 'archer');
  state.lives = 5;
  state.essence = 20;
  state.wave = 3;
  restartGame(state);
  expect(state.lives).toBe(10);
  expect(state.essence).toBe(100);
  expect(state.wave).toBe(1);
  expect(state.towers).toEqual([]);
  expect(state.enemies).toEqual([]);
  expect(state.gameOver).toBe(false);
});
```

- [ ] **Step 16: Implement restartGame**

```ts
export function restartGame(state: GameState): void {
  const fresh = createGameState();
  Object.assign(state, fresh);
}
```

- [ ] **Step 17: Run full game-state tests**

```bash
npx vitest run tests/game-state.test.ts
```

---

## Task 4: Economy Logic (TDD)

**Files:**
- Create: `src/logic/economy.ts`
- Create: `tests/economy.test.ts`

- [ ] **Step 1: Write failing test**

```ts
// tests/economy.test.ts
import { describe, it, expect } from 'vitest';
import { canAfford, calculateRefund } from '../src/logic/economy';

describe('Economy', () => {
  it('canAfford returns true when essence >= cost', () => {
    expect(canAfford(100, 50)).toBe(true);
    expect(canAfford(100, 100)).toBe(true);
  });

  it('canAfford returns false when essence < cost', () => {
    expect(canAfford(30, 50)).toBe(false);
  });

  it('calculateRefund returns 70% of total cost', () => {
    expect(calculateRefund(100)).toBe(70);
    expect(calculateRefund(50)).toBe(35);
  });
});
```

- [ ] **Step 2: Run test — verify fails**

```bash
npx vitest run tests/economy.test.ts
```

- [ ] **Step 3: Implement economy.ts**

```ts
// src/logic/economy.ts
export function canAfford(essence: number, cost: number): boolean {
  return essence >= cost;
}

export function calculateRefund(totalCost: number): number {
  return Math.floor(totalCost * 0.7);
}
```

- [ ] **Step 4: Run test — verify passes**

```bash
npx vitest run tests/economy.test.ts
```

---

## Task 5: Wave System Logic (TDD)

**Files:**
- Create: `src/logic/wave-system.ts`
- Create: `tests/wave-system.test.ts`

- [ ] **Step 1: Write failing test**

```ts
// tests/wave-system.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { WaveSpawner, createWaveSpawner } from '../src/logic/wave-system';
import { GameState, createGameState } from '../src/logic/game-state';

describe('WaveSystem', () => {
  let state: GameState;
  let spawner: WaveSpawner;

  beforeEach(() => {
    state = createGameState();
    spawner = createWaveSpawner();
  });

  it('starts at wave 1 with prep phase', () => {
    expect(spawner.currentWave).toBe(1);
    expect(spawner.isSpawning).toBe(false);
  });

  it('generates enemies for wave 1', () => {
    const enemies = spawner.getWaveEnemies(1);
    expect(enemies.length).toBeGreaterThan(0);
    expect(enemies[0].type).toBe('shade');
  });

  it('advances wave after all enemies defeated', () => {
    state.wave = 1;
    state.enemies = [];
    const advanced = spawner.tryAdvanceWave(state);
    expect(advanced).toBe(true);
    expect(state.wave).toBe(2);
  });

  it('does not advance past wave 5', () => {
    state.wave = 5;
    state.enemies = [];
    const advanced = spawner.tryAdvanceWave(state);
    expect(advanced).toBe(false);
  });

  it('marks win when wave 5 complete and no captain alive', () => {
    state.wave = 5;
    state.enemies = [];
    spawner.tryAdvanceWave(state);
    // Wave 6 doesn't exist, so completing wave 5 = win
    expect(state.won).toBe(true);
    expect(state.phase).toBe('result');
  });
});
```

- [ ] **Step 2: Run test — verify fails**

```bash
npx vitest run tests/wave-system.test.ts
```

- [ ] **Step 3: Implement wave-system.ts**

```ts
// src/logic/wave-system.ts
import { WAVES, WaveEntry } from '../data/wave-data';
import { GameState } from './game-state';

export interface SpawnEntry {
  type: string;
  delay: number;
}

export interface WaveSpawner {
  currentWave: number;
  isSpawning: boolean;
  getWaveEnemies(wave: number): SpawnEntry[];
  tryAdvanceWave(state: GameState): boolean;
}

export function createWaveSpawner(): WaveSpawner {
  return {
    currentWave: 1,
    isSpawning: false,
    getWaveEnemies(wave: number): SpawnEntry[] {
      const waveData = WAVES.find(w => w.number === wave);
      if (!waveData) return [];

      const entries: SpawnEntry[] = [];
      for (const entry of waveData.entries) {
        for (let i = 0; i < entry.count; i++) {
          entries.push({ type: entry.type, delay: entry.delay });
        }
      }
      return entries;
    },
    tryAdvanceWave(state: GameState): boolean {
      if (state.enemies.filter(e => e.alive).length > 0) return false;

      if (state.wave >= 5) {
        state.won = true;
        state.gameOver = true;
        state.phase = 'result';
        return false;
      }

      state.wave++;
      state.phase = 'prep';
      this.currentWave = state.wave;
      return true;
    },
  };
}
```

- [ ] **Step 4: Run test — verify passes**

```bash
npx vitest run tests/wave-system.test.ts
```

---

## Task 6: Targeting Logic (TDD)

**Files:**
- Create: `src/logic/targeting.ts`
- Create: `tests/targeting.test.ts`

- [ ] **Step 1: Write failing test**

```ts
// tests/targeting.test.ts
import { describe, it, expect } from 'vitest';
import { findTarget, distance } from '../src/logic/targeting';
import { ActiveEnemy } from '../src/logic/game-state';

function makeEnemy(id: number, pathIndex: number, pathProgress: number): ActiveEnemy {
  return {
    id, type: 'shade', hp: 30, maxHp: 30, speed: 60,
    reward: 10, livesCost: 1, pathIndex, pathProgress,
    slowTimer: 0, alive: true,
  };
}

describe('Targeting', () => {
  it('finds the enemy closest to the gate (highest pathIndex)', () => {
    const enemies = [
      makeEnemy(0, 2, 0.5),
      makeEnemy(1, 5, 0.3),
      makeEnemy(2, 3, 0.8),
    ];
    const target = findTarget(enemies, { x: 150, y: 200 }, 100);
    expect(target?.id).toBe(1);
  });

  it('returns null when no enemies in range', () => {
    const enemies = [makeEnemy(0, 0, 0)];
    const target = findTarget(enemies, { x: 0, y: 0 }, 10);
    expect(target).toBeNull();
  });

  it('returns null for dead enemies', () => {
    const enemies = [makeEnemy(0, 5, 0.5)];
    enemies[0].alive = false;
    const target = findTarget(enemies, { x: 150, y: 200 }, 200);
    expect(target).toBeNull();
  });
});
```

- [ ] **Step 2: Run test — verify fails**

```bash
npx vitest run tests/targeting.test.ts
```

- [ ] **Step 3: Implement targeting.ts**

```ts
// src/logic/targeting.ts
import { ActiveEnemy } from './game-state';
import { PATH_POINTS } from '../data/map-data';

export function distance(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function getEnemyWorldPos(enemy: ActiveEnemy): { x: number; y: number } {
  const idx = Math.min(enemy.pathIndex, PATH_POINTS.length - 2);
  const a = PATH_POINTS[idx];
  const b = PATH_POINTS[idx + 1];
  return {
    x: a.x + (b.x - a.x) * enemy.pathProgress,
    y: a.y + (b.y - a.y) * enemy.pathProgress,
  };
}

export function findTarget(
  enemies: ActiveEnemy[],
  towerPos: { x: number; y: number },
  range: number,
): ActiveEnemy | null {
  let best: ActiveEnemy | null = null;
  let bestProgress = -1;

  for (const enemy of enemies) {
    if (!enemy.alive) continue;
    const pos = getEnemyWorldPos(enemy);
    if (distance(towerPos, pos) > range) continue;

    const progress = enemy.pathIndex + enemy.pathProgress;
    if (progress > bestProgress) {
      bestProgress = progress;
      best = enemy;
    }
  }

  return best;
}
```

- [ ] **Step 4: Run test — verify passes**

```bash
npx vitest run tests/targeting.test.ts
```

---

## Task 7: Damage Logic (TDD)

**Files:**
- Create: `src/logic/damage.ts`
- Create: `tests/damage.test.ts`

- [ ] **Step 1: Write failing test**

```ts
// tests/damage.test.ts
import { describe, it, expect } from 'vitest';
import { applyDamage, applySlow } from '../src/logic/damage';
import { ActiveEnemy } from '../src/logic/game-state';
import { SLOW_FACTOR, SLOW_DURATION } from '../src/data/tower-data';

function makeEnemy(overrides?: Partial<ActiveEnemy>): ActiveEnemy {
  return {
    id: 0, type: 'shade', hp: 30, maxHp: 30, speed: 60,
    reward: 10, livesCost: 1, pathIndex: 2, pathProgress: 0.5,
    slowTimer: 0, alive: true,
    ...overrides,
  };
}

describe('Damage', () => {
  it('reduces enemy hp by damage amount', () => {
    const enemy = makeEnemy();
    applyDamage(enemy, 10);
    expect(enemy.hp).toBe(20);
    expect(enemy.alive).toBe(true);
  });

  it('kills enemy when hp <= 0', () => {
    const enemy = makeEnemy({ hp: 10 });
    applyDamage(enemy, 15);
    expect(enemy.hp).toBe(-5);
    expect(enemy.alive).toBe(false);
  });

  it('applies slow effect to enemy', () => {
    const enemy = makeEnemy();
    applySlow(enemy, 1000);
    expect(enemy.slowTimer).toBe(1000);
  });

  it('does not apply slow to immune wraith', () => {
    const enemy = makeEnemy({ type: 'wraith', slowTimer: 2000 });
    applySlow(enemy, 1000);
    expect(enemy.slowTimer).toBe(2000); // unchanged
  });
});
```

- [ ] **Step 2: Run test — verify fails**

```bash
npx vitest run tests/damage.test.ts
```

- [ ] **Step 3: Implement damage.ts**

```ts
// src/logic/damage.ts
import { ActiveEnemy } from './game-state';
import { WRAITH_SLOW_IMMUNE_DURATION } from '../src/data/enemy-data';

export function applyDamage(enemy: ActiveEnemy, damage: number): void {
  enemy.hp -= damage;
  if (enemy.hp <= 0) {
    enemy.alive = false;
  }
}

export function applySlow(enemy: ActiveEnemy, duration: number): void {
  if (enemy.type === 'wraith' && enemy.slowTimer > 0) return;
  enemy.slowTimer = duration;
}
```

- [ ] **Step 4: Run test — verify passes**

```bash
npx vitest run tests/damage.test.ts
```

---

## Task 8: Tower Combat Integration Test (TDD)

**Files:**
- Create: `tests/tower-combat.test.ts`

- [ ] **Step 1: Write failing test**

```ts
// tests/tower-combat.test.ts
import { describe, it, expect } from 'vitest';
import { createGameState, placeTower, GameState, ActiveEnemy } from '../src/logic/game-state';
import { findTarget } from '../src/logic/targeting';
import { applyDamage } from '../src/logic/damage';
import { TOWER_LEVELS } from '../src/data/tower-data';

describe('Tower Combat Integration', () => {
  let state: GameState;

  it('archer tower damages closest enemy', () => {
    state = createGameState();
    placeTower(state, 0, 'archer');
    const tower = state.towers[0];
    const stats = TOWER_LEVELS.archer[0].stats;

    const enemy: ActiveEnemy = {
      id: 0, type: 'shade', hp: 30, maxHp: 30, speed: 60,
      reward: 10, livesCost: 1, pathIndex: 5, pathProgress: 0.5,
      slowTimer: 0, alive: true,
    };
    state.enemies.push(enemy);

    const target = findTarget(state.enemies, { x: 130, y: 110 }, stats.range);
    expect(target).not.toBeNull();

    if (target) {
      applyDamage(target, stats.damage);
      expect(target.hp).toBe(22); // 30 - 8
    }
  });
});
```

- [ ] **Step 2: Run test — verify passes (integration of existing modules)**

```bash
npx vitest run tests/tower-combat.test.ts
```

---

## Task 9: Mobile Layout Test

**Files:**
- Create: `tests/mobile-layout.test.ts`

- [ ] **Step 1: Write test**

```ts
// tests/mobile-layout.test.ts
import { describe, it, expect } from 'vitest';
import { PLACEMENT_SLOTS, PATH_POINTS } from '../src/data/map-data';

describe('Mobile Layout', () => {
  it('all placement slots are within 360x640 bounds', () => {
    for (const slot of PLACEMENT_SLOTS) {
      expect(slot.x).toBeGreaterThanOrEqual(0);
      expect(slot.x).toBeLessThanOrEqual(360);
      expect(slot.y).toBeGreaterThanOrEqual(0);
      expect(slot.y).toBeLessThanOrEqual(640);
    }
  });

  it('path points are within bounds (with some margin for entry/exit)', () => {
    for (const pt of PATH_POINTS) {
      expect(pt.x).toBeGreaterThanOrEqual(-50);
      expect(pt.x).toBeLessThanOrEqual(410);
      expect(pt.y).toBeGreaterThanOrEqual(-50);
      expect(pt.y).toBeLessThanOrEqual(690);
    }
  });

  it('has exactly 8 placement slots', () => {
    expect(PLACEMENT_SLOTS).toHaveLength(8);
  });

  it('path has at least 10 points for winding layout', () => {
    expect(PATH_POINTS.length).toBeGreaterThanOrEqual(10);
  });
});
```

- [ ] **Step 2: Run test — verify passes**

```bash
npx vitest run tests/mobile-layout.test.ts
```

---

## Task 10: Run Full Test Suite

```bash
npx vitest run
```

All tests must pass. Fix any failures before proceeding.

---

## Task 11: Phaser Entities

**Files:**
- Create: `src/entities/Tower.ts`
- Create: `src/entities/Enemy.ts`
- Create: `src/entities/Projectile.ts`

- [ ] **Step 1: Create Tower.ts**

```ts
// src/entities/Tower.ts
import Phaser from 'phaser';
import { PlacedTower } from '../logic/game-state';
import { TOWER_LEVELS } from '../data/tower-data';

export class TowerEntity {
  sprite: Phaser.GameObjects.Arc;
  rangeCircle: Phaser.GameObjects.Arc;
  private tower: PlacedTower;

  constructor(scene: Phaser.Scene, x: number, y: number, tower: PlacedTower) {
    this.tower = tower;
    const levelData = TOWER_LEVELS[tower.type][tower.level - 1];
    const color = levelData.stats.color;

    this.sprite = scene.add.circle(x, y, 10, color);
    this.sprite.setStrokeStyle(2, 0xffffff);

    this.rangeCircle = scene.add.circle(x, y, levelData.stats.range, color, 0.1);
    this.rangeCircle.setStrokeStyle(1, color, 0.3);
    this.rangeCircle.setVisible(false);
  }

  getTower(): PlacedTower {
    return this.tower;
  }

  getPosition(): { x: number; y: number } {
    return { x: this.sprite.x, y: this.sprite.y };
  }

  showRange(visible: boolean): void {
    this.rangeCircle.setVisible(visible);
  }

  destroy(): void {
    this.sprite.destroy();
    this.rangeCircle.destroy();
  }
}
```

- [ ] **Step 2: Create Enemy.ts**

```ts
// src/entities/Enemy.ts
import Phaser from 'phaser';
import { ActiveEnemy } from '../logic/game-state';
import { ENEMY_DATA } from '../data/enemy-data';
import { PATH_POINTS } from '../data/map-data';
import { SLOW_FACTOR } from '../data/tower-data';

export class EnemyEntity {
  sprite: Phaser.GameObjects.Arc;
  hpBar: Phaser.GameObjects.Rectangle;
  private enemy: ActiveEnemy;

  constructor(scene: Phaser.Scene, enemy: ActiveEnemy) {
    this.enemy = enemy;
    const data = ENEMY_DATA[enemy.type as keyof typeof ENEMY_DATA];
    const pos = this.getWorldPos();
    this.sprite = scene.add.circle(pos.x, pos.y, data.radius, data.color);
    this.hpBar = scene.add.rectangle(pos.x, pos.y - data.radius - 4, data.radius * 2, 3, 0x00ff00);
  }

  getWorldPos(): { x: number; y: number } {
    const idx = Math.min(this.enemy.pathIndex, PATH_POINTS.length - 2);
    const a = PATH_POINTS[idx];
    const b = PATH_POINTS[idx + 1];
    return {
      x: a.x + (b.x - a.x) * this.enemy.pathProgress,
      y: a.y + (b.y - a.y) * this.enemy.pathProgress,
    };
  }

  update(): void {
    const pos = this.getWorldPos();
    this.sprite.setPosition(pos.x, pos.y);
    this.hpBar.setPosition(pos.x, pos.y - 14);
    const ratio = Math.max(0, this.enemy.hp / this.enemy.maxHp);
    this.hpBar.setSize(20 * ratio, 3);
    this.hpBar.setFillStyle(ratio > 0.5 ? 0x00ff00 : ratio > 0.25 ? 0xffff00 : 0xff0000);
  }

  getEnemy(): ActiveEnemy {
    return this.enemy;
  }

  destroy(): void {
    this.sprite.destroy();
    this.hpBar.destroy();
  }
}
```

- [ ] **Step 3: Create Projectile.ts**

```ts
// src/entities/Projectile.ts
import Phaser from 'phaser';
import { ActiveEnemy } from '../logic/game-state';

export class ProjectileEntity {
  sprite: Phaser.GameObjects.Arc;
  private speed: number = 200;
  private target: ActiveEnemy;
  private damage: number;
  private scene: Phaser.Scene;
  private onHit: (enemy: ActiveEnemy, damage: number) => void;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    target: ActiveEnemy,
    damage: number,
    color: number,
    onHit: (enemy: ActiveEnemy, damage: number) => void,
  ) {
    this.scene = scene;
    this.target = target;
    this.damage = damage;
    this.onHit = onHit;
    this.sprite = scene.add.circle(x, y, 3, color);
  }

  update(): boolean {
    if (!this.target.alive) {
      this.destroy();
      return false;
    }

    const tx = this.target.pathIndex + this.target.pathProgress;
    // Simple movement towards target
    const dx = this.sprite.x - this.sprite.x; // placeholder: just hit immediately
    const dy = this.sprite.y - this.sprite.y;

    this.onHit(this.target, this.damage);
    this.destroy();
    return true;
  }

  destroy(): void {
    this.sprite.destroy();
  }
}
```

---

## Task 12: Phaser Scenes

**Files:**
- Create: `src/scenes/BootScene.ts`
- Create: `src/scenes/MenuScene.ts`
- Create: `src/scenes/GameScene.ts`
- Create: `src/scenes/ResultScene.ts`
- Modify: `src/config/game-config.ts`

- [ ] **Step 1: Create BootScene.ts**

```ts
// src/scenes/BootScene.ts
import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload(): void {
    // Using runtime-drawn shapes for Milestone 1
  }

  create(): void {
    this.scene.start('Menu');
  }
}
```

- [ ] **Step 2: Create MenuScene.ts**

```ts
// src/scenes/MenuScene.ts
import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('Menu');
  }

  create(): void {
    this.add.rectangle(180, 280, 300, 100, 0x1a1a2e);
    this.add.text(180, 260, 'Shadow Kingdom', { fontSize: '20px', color: '#c0a050', fontFamily: 'monospace' }).setOrigin(0.5);
    this.add.text(180, 290, 'BASTION', { fontSize: '28px', color: '#e0c070', fontFamily: 'monospace' }).setOrigin(0.5);

    const startBtn = this.add.rectangle(180, 400, 160, 50, 0x34495e).setInteractive();
    this.add.text(180, 400, 'START', { fontSize: '18px', color: '#ecf0f1', fontFamily: 'monospace' }).setOrigin(0.5);

    startBtn.on('pointerdown', () => {
      this.scene.start('Game');
    });
  }
}
```

- [ ] **Step 3: Create GameScene.ts**

```ts
// src/scenes/GameScene.ts
import Phaser from 'phaser';
import { createGameState, GameState, placeTower, upgradeTower, sellTower, PlacedTower, ActiveEnemy } from '../logic/game-state';
import { createWaveSpawner, WaveSpawner } from '../logic/wave-system';
import { findTarget, distance } from '../logic/targeting';
import { applyDamage, applySlow } from '../logic/damage';
import { TOWER_LEVELS, SLOW_FACTOR, SLOW_DURATION, CANNON_SPLASH_RADIUS } from '../data/tower-data';
import { ENEMY_DATA, WRAITH_SLOW_IMMUNE_DURATION } from '../data/enemy-data';
import { PLACEMENT_SLOTS, PATH_POINTS, GATE_POSITION } from '../data/map-data';
import { TowerEntity } from '../entities/Tower';
import { EnemyEntity } from '../entities/Enemy';

export class GameScene extends Phaser.Scene {
  private state!: GameState;
  private spawner!: WaveSpawner;
  private towerEntities: Map<number, TowerEntity> = new Map();
  private enemyEntities: Map<number, EnemyEntity> = new Map();
  private selectedSlotId: number | null = null;
  private selectedTowerId: number | null = null;
  private hudText!: Phaser.GameObjects.Text;
  private waveText!: Phaser.GameObjects.Text;
  private debugMode: boolean = false;
  private debugText!: Phaser.GameObjects.Text;
  private spawnQueue: { type: string; delay: number }[] = [];
  private spawnTimer: number = 0;
  private selectedSlotHighlight!: Phaser.GameObjects.Arc;
  private selectionPanel: Phaser.GameObjects.Container | null = null;
  private upgradePanel: Phaser.GameObjects.Container | null = null;

  constructor() {
    super('Game');
  }

  create(): void {
    this.state = createGameState();
    this.spawner = createWaveSpawner();
    this.towerEntities.clear();
    this.enemyEntities.clear();
    this.selectedSlotId = null;
    this.selectedTowerId = null;

    this.drawMap();
    this.drawPlacementSlots();
    this.drawHUD();
    this.drawDebugButton();
    this.drawBottomPanel();
    this.drawStartWaveButton();

    this.input.on('pointerdown', () => this.closePanels());
  }

  private drawMap(): void {
    const gfx = this.add.graphics();
    gfx.lineStyle(6, 0x2c3e50, 0.8);
    gfx.beginPath();
    gfx.moveTo(PATH_POINTS[0].x, PATH_POINTS[0].y);
    for (let i = 1; i < PATH_POINTS.length; i++) {
      gfx.lineTo(PATH_POINTS[i].x, PATH_POINTS[i].y);
    }
    gfx.strokePath();

    // Gate
    const gate = this.add.rectangle(GATE_POSITION.x, GATE_POSITION.y, 60, 20, 0xc0392b);
    this.add.text(GATE_POSITION.x, GATE_POSITION.y, 'GATE', { fontSize: '10px', color: '#fff', fontFamily: 'monospace' }).setOrigin(0.5);
  }

  private drawPlacementSlots(): void {
    for (const slot of PLACEMENT_SLOTS) {
      const circle = this.add.circle(slot.x, slot.y, 14, 0x2ecc71, 0.3);
      circle.setStrokeStyle(2, 0x2ecc71);
      circle.setInteractive();
      circle.setData('slotId', slot.id);
      circle.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
        pointer.event.stopPropagation();
        this.onSlotTap(slot.id);
      });
    }

    this.selectedSlotHighlight = this.add.circle(0, 0, 16, 0xf1c40f, 0).setStrokeStyle(3, 0xf1c40f);
    this.selectedSlotHighlight.setVisible(false);
  }

  private drawHUD(): void {
    this.hudText = this.add.text(10, 10, '', { fontSize: '14px', color: '#ecf0f1', fontFamily: 'monospace' });
    this.waveText = this.add.text(180, 630, '', { fontSize: '12px', color: '#bdc3c7', fontFamily: 'monospace' }).setOrigin(0.5);
    this.updateHUD();
  }

  private updateHUD(): void {
    this.hudText.setText(`Lives: ${this.state.lives}  Essence: ${this.state.essence}  Wave: ${this.state.wave}/5`);
  }

  private drawDebugButton(): void {
    const btn = this.add.rectangle(340, 10, 30, 20, 0x555555).setInteractive();
    this.add.text(340, 10, 'DBG', { fontSize: '8px', color: '#aaa', fontFamily: 'monospace' }).setOrigin(0.5);
    btn.on('pointerdown', (p: Phaser.Input.Pointer) => {
      p.event.stopPropagation();
      this.debugMode = !this.debugMode;
      this.debugText?.setVisible(this.debugMode);
      if (this.debugMode) this.showDebugPanel();
      else this.debugPanel?.destroy();
    });

    this.debugText = this.add.text(10, 30, '', { fontSize: '10px', color: '#f1c40f', fontFamily: 'monospace' });
    this.debugText.setVisible(false);
  }

  private debugPanel: Phaser.GameObjects.Container | null = null;

  private showDebugPanel(): void {
    this.debugPanel?.destroy();
    const btnAddEssence = this.add.rectangle(60, 580, 80, 25, 0x8e44ad).setInteractive();
    const txtAddEssence = this.add.text(60, 580, '+50 Ess', { fontSize: '10px', color: '#fff', fontFamily: 'monospace' }).setOrigin(0.5);
    const btnSkipWave = this.add.rectangle(180, 580, 80, 25, 0x2980b9).setInteractive();
    const txtSkipWave = this.add.text(180, 580, 'Next Wave', { fontSize: '10px', color: '#fff', fontFamily: 'monospace' }).setOrigin(0.5);
    const btnReset = this.add.rectangle(300, 580, 80, 25, 0xc0392b).setInteractive();
    const txtReset = this.add.text(300, 580, 'Reset', { fontSize: '10px', color: '#fff', fontFamily: 'monospace' }).setOrigin(0.5);

    btnAddEssence.on('pointerdown', (p: Phaser.Input.Pointer) => {
      p.event.stopPropagation();
      this.state.essence += 50;
      this.updateHUD();
    });
    btnSkipWave.on('pointerdown', (p: Phaser.Input.Pointer) => {
      p.event.stopPropagation();
      this.spawner.tryAdvanceWave(this.state);
      this.state.phase = 'wave';
      this.startWave();
    });
    btnReset.on('pointerdown', (p: Phaser.Input.Pointer) => {
      p.event.stopPropagation();
      this.scene.restart();
    });

    this.debugPanel = this.add.container(0, 0, [btnAddEssence, txtAddEssence, btnSkipWave, txtSkipWave, btnReset, txtReset]);
  }

  private drawBottomPanel(): void {
    const panel = this.add.rectangle(180, 610, 340, 50, 0x1a1a2e).setStrokeStyle(1, 0x34495e);
    const towerTypes: Array<{ type: string; label: string; color: number }> = [
      { type: 'archer', label: 'Archer', color: 0x9b59b6 },
      { type: 'cannon', label: 'Cannon', color: 0xe74c3c },
      { type: 'frost', label: 'Frost', color: 0x3498db },
    ];

    towerTypes.forEach((t, i) => {
      const x = 60 + i * 120;
      const btn = this.add.rectangle(x, 610, 100, 35, t.color, 0.6).setInteractive();
      this.add.text(x, 610, t.label, { fontSize: '11px', color: '#fff', fontFamily: 'monospace' }).setOrigin(0.5);
    });
  }

  private drawStartWaveButton(): void {
    const btn = this.add.rectangle(180, 600, 120, 30, 0x27ae60).setInteractive();
    const txt = this.add.text(180, 600, 'START WAVE', { fontSize: '12px', color: '#fff', fontFamily: 'monospace' }).setOrigin(0.5);

    btn.on('pointerdown', (p: Phaser.Input.Pointer) => {
      p.event.stopPropagation();
      if (this.state.phase === 'prep' && !this.state.gameOver) {
        this.state.phase = 'wave';
        this.startWave();
        btn.setVisible(false);
        txt.setVisible(false);
      }
    });

    this.startWaveBtn = { btn, txt };
  }

  private startWaveBtn!: { btn: Phaser.GameObjects.Rectangle; txt: Phaser.GameObjects.Text };

  private onSlotTap(slotId: number): void {
    if (this.state.gameOver) return;

    const existingTower = this.state.towers.find(t => t.slotId === slotId);
    if (existingTower) {
      this.showUpgradePanel(existingTower);
      return;
    }

    this.selectedSlotId = slotId;
    this.showSelectionPanel(slotId);
  }

  private showSelectionPanel(slotId: number): void {
    this.closePanels();
    const slot = PLACEMENT_SLOTS.find(s => s.id === slotId)!;
    const types: Array<{ type: string; label: string; cost: number }> = [
      { type: 'archer', label: 'Archer', cost: TOWER_LEVELS.archer[0].stats.cost },
      { type: 'cannon', label: 'Cannon', cost: TOWER_LEVELS.cannon[0].stats.cost },
      { type: 'frost', label: 'Frost', cost: TOWER_LEVELS.frost[0].stats.cost },
    ];

    const panel = this.add.container(slot.x, slot.y - 60);

    types.forEach((t, i) => {
      const bg = this.add.rectangle(0, i * 30 - 30, 100, 25, 0x2c3e50).setInteractive();
      const label = this.add.text(0, i * 30 - 30, `${t.label} (${t.cost})`, {
        fontSize: '10px', color: '#fff', fontFamily: 'monospace',
      }).setOrigin(0.5);

      bg.on('pointerdown', (p: Phaser.Input.Pointer) => {
        p.event.stopPropagation();
        this.tryPlaceTower(slotId, t.type as 'archer' | 'cannon' | 'frost');
      });

      panel.add([bg, label]);
    });

    this.selectionPanel = panel;
  }

  private showUpgradePanel(tower: PlacedTower): void {
    this.closePanels();
    this.selectedTowerId = tower.id;
    const towerEntity = this.towerEntities.get(tower.id);
    if (towerEntity) towerEntity.showRange(true);

    const levels = TOWER_LEVELS[tower.type];
    const canUpgrade = tower.level < levels.length;
    const upgradeCost = canUpgrade ? levels[tower.level].upgradeCost : 0;
    const sellValue = Math.floor(tower.totalCost * 0.7);

    const slot = PLACEMENT_SLOTS.find(s => s.id === tower.slotId)!;
    const panel = this.add.container(slot.x, slot.y - 70);

    if (canUpgrade) {
      const upgBtn = this.add.rectangle(0, -30, 100, 25, 0x27ae60).setInteractive();
      const upgTxt = this.add.text(0, -30, `Upgrade (${upgradeCost})`, { fontSize: '10px', color: '#fff', fontFamily: 'monospace' }).setOrigin(0.5);
      upgBtn.on('pointerdown', (p: Phaser.Input.Pointer) => {
        p.event.stopPropagation();
        const result = upgradeTower(this.state, tower.id);
        if (result.success) {
          this.updateHUD();
          this.closePanels();
        }
      });
      panel.add([upgBtn, upgTxt]);
    }

    const sellBtn = this.add.rectangle(0, 0, 100, 25, 0xc0392b).setInteractive();
    const sellTxt = this.add.text(0, 0, `Sell (${sellValue})`, { fontSize: '10px', color: '#fff', fontFamily: 'monospace' }).setOrigin(0.5);
    sellBtn.on('pointerdown', (p: Phaser.Input.Pointer) => {
      p.event.stopPropagation();
      sellTower(this.state, tower.id);
      const entity = this.towerEntities.get(tower.id);
      if (entity) { entity.destroy(); this.towerEntities.delete(tower.id); }
      this.updateHUD();
      this.closePanels();
    });
    panel.add([sellBtn, sellTxt]);

    this.upgradePanel = panel;
  }

  private closePanels(): void {
    this.selectionPanel?.destroy();
    this.selectionPanel = null;
    this.upgradePanel?.destroy();
    this.upgradePanel = null;
    this.selectedSlotId = null;
    this.selectedTowerId = null;
    this.towerEntities.forEach(e => e.showRange(false));
  }

  private tryPlaceTower(slotId: number, type: 'archer' | 'cannon' | 'frost'): void {
    const result = placeTower(this.state, slotId, type);
    if (result.success) {
      const slot = PLACEMENT_SLOTS.find(s => s.id === slotId)!;
      const tower = this.state.towers.find(t => t.slotId === slotId)!;
      const entity = new TowerEntity(this, slot.x, slot.y, tower);
      this.towerEntities.set(tower.id, entity);
      this.updateHUD();
      this.closePanels();
    }
  }

  private startWave(): void {
    const entries = this.spawner.getWaveEnemies(this.state.wave);
    this.spawnQueue = [...entries];
    this.spawnTimer = 0;
  }

  private spawnEnemy(type: string): void {
    const data = ENEMY_DATA[type as keyof typeof ENEMY_DATA];
    const enemy: ActiveEnemy = {
      id: this.state.nextEnemyId++,
      type,
      hp: data.hp,
      maxHp: data.hp,
      speed: data.speed,
      reward: data.reward,
      livesCost: data.livesCost,
      pathIndex: 0,
      pathProgress: 0,
      slowTimer: 0,
      alive: true,
    };
    this.state.enemies.push(enemy);
    const entity = new EnemyEntity(this, enemy);
    this.enemyEntities.set(enemy.id, entity);
  }

  update(time: number, delta: number): void {
    if (this.state.gameOver) {
      this.scene.start('Result', { won: this.state.won });
      return;
    }

    // Spawn enemies
    if (this.spawnQueue.length > 0) {
      this.spawnTimer -= delta;
      if (this.spawnTimer <= 0) {
        const next = this.spawnQueue.shift()!;
        this.spawnEnemy(next.type);
        this.spawnTimer = next.delay;
      }
    }

    // Move enemies
    for (const enemy of this.state.enemies) {
      if (!enemy.alive) continue;

      const speedMult = enemy.slowTimer > 0 ? SLOW_FACTOR : 1;
      if (enemy.slowTimer > 0) enemy.slowTimer -= delta;

      const moveAmount = (enemy.speed * speedMult * delta) / 1000;
      const segLength = this.getSegmentLength(enemy.pathIndex);
      enemy.pathProgress += moveAmount / segLength;

      while (enemy.pathProgress >= 1 && enemy.pathIndex < PATH_POINTS.length - 2) {
        enemy.pathProgress -= 1;
        enemy.pathIndex++;
      }

      if (enemy.pathIndex >= PATH_POINTS.length - 1) {
        enemy.alive = false;
        this.state.lives -= enemy.livesCost;
        if (this.state.lives <= 0) {
          this.state.gameOver = true;
          this.state.won = false;
          this.state.phase = 'result';
        }
      }

      const entity = this.enemyEntities.get(enemy.id);
      if (entity) entity.update();
    }

    // Remove dead enemies
    for (const [id, entity] of this.enemyEntities) {
      const enemy = this.state.enemies.find(e => e.id === id);
      if (!enemy || !enemy.alive) {
        entity.destroy();
        this.enemyEntities.delete(id);
      }
    }
    this.state.enemies = this.state.enemies.filter(e => e.alive);

    // Tower shooting
    for (const tower of this.state.towers) {
      const entity = this.towerEntities.get(tower.id);
      if (!entity) continue;
      const levels = TOWER_LEVELS[tower.type];
      const stats = levels[tower.level - 1].stats;
      const pos = entity.getPosition();

      const target = findTarget(this.state.enemies, pos, stats.range);
      if (target) {
        applyDamage(target, stats.damage);
        if (tower.type === 'frost') {
          applySlow(target, SLOW_DURATION);
        }
        if (tower.type === 'cannon') {
          for (const e of this.state.enemies) {
            if (e === target || !e.alive) continue;
            const epos = this.enemyEntities.get(e.id)?.getWorldPos();
            if (epos && distance(epos, this.enemyEntities.get(target.id)?.getWorldPos() || pos) < CANNON_SPLASH_RADIUS) {
              applyDamage(e, stats.damage * 0.5);
            }
          }
        }
      }
    }

    // Update HUD
    this.updateHUD();

    // Debug info
    if (this.debugMode) {
      const alive = this.state.enemies.filter(e => e.alive).length;
      this.debugText.setText(`FPS: ${Math.round(this.game.loop.actualFps)} | Enemies: ${alive} | Phase: ${this.state.phase}`);
    }

    // Check wave complete
    if (this.state.phase === 'wave' && this.spawnQueue.length === 0 && this.state.enemies.length === 0) {
      this.spawner.tryAdvanceWave(this.state);
      if (!this.state.gameOver) {
        this.startWaveBtn.btn.setVisible(true);
        this.startWaveBtn.txt.setVisible(true);
      }
    }
  }

  private getSegmentLength(pathIndex: number): number {
    const idx = Math.min(pathIndex, PATH_POINTS.length - 2);
    const a = PATH_POINTS[idx];
    const b = PATH_POINTS[idx + 1];
    return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
  }
}
```

- [ ] **Step 4: Create ResultScene.ts**

```ts
// src/scenes/ResultScene.ts
import Phaser from 'phaser';

export class ResultScene extends Phaser.Scene {
  constructor() {
    super('Result');
  }

  create(data: { won: boolean }): void {
    const won = data?.won ?? false;
    const color = won ? '#27ae60' : '#c0392b';
    const msg = won ? 'VICTORY!' : 'DEFEATED';

    this.add.rectangle(180, 320, 360, 640, 0x0a0a1a);
    this.add.text(180, 250, msg, { fontSize: '36px', color, fontFamily: 'monospace' }).setOrigin(0.5);
    this.add.text(180, 300, won ? 'The Shadow Kingdom stands!' : 'The shadows have fallen...', {
      fontSize: '14px', color: '#bdc3c7', fontFamily: 'monospace',
    }).setOrigin(0.5);

    const restartBtn = this.add.rectangle(180, 380, 160, 50, 0x34495e).setInteractive();
    this.add.text(180, 380, 'RESTART', { fontSize: '18px', color: '#ecf0f1', fontFamily: 'monospace' }).setOrigin(0.5);

    restartBtn.on('pointerdown', () => {
      this.scene.start('Game');
    });
  }
}
```

- [ ] **Step 5: Update game-config.ts with scenes**

```ts
// src/config/game-config.ts
import Phaser from 'phaser';
import { BootScene } from '../scenes/BootScene';
import { MenuScene } from '../scenes/MenuScene';
import { GameScene } from '../scenes/GameScene';
import { ResultScene } from '../scenes/ResultScene';

export const GameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 360,
  height: 640,
  parent: 'game',
  backgroundColor: '#0a0a1a',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, MenuScene, GameScene, ResultScene],
};
```

---

## Task 13: Build and Test

- [ ] **Step 1: Run full test suite**

```bash
npx vitest run
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Build**

```bash
npm run build
```

- [ ] **Step 4: Dev server smoke test**

```bash
npm run dev
```

Open in browser, verify:
- Menu screen renders
- Start button works
- Game scene loads with map and placement slots
- Can tap slot and place tower
- Wave spawns enemies
- Towers shoot enemies
- HUD updates
- Win/Lose/Restart works
- Debug mode toggles

---

## Task 14: Final Verification Checklist

- [ ] All unit tests pass
- [ ] TypeScript compiles without errors
- [ ] Vite build succeeds
- [ ] Game loads in browser (mobile-sized viewport)
- [ ] Touch/mouse input works
- [ ] 3 tower types have different behaviors
- [ ] 3 enemy types have different stats
- [ ] 5 waves progress correctly
- [ ] Win/lose conditions work
- [ ] Restart clears state
- [ ] Debug mode off by default
- [ ] Console has no uncaught errors
