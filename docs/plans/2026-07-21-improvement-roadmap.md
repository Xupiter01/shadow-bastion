# Shadow Kingdom: Bastion — Improvement Roadmap

> User-approved direction: improve weaknesses across the game, make it distinctive, replayable, and fun without copying other repositories.

## Product Identity

**Shadow Bastion** is a portrait mobile tower-defense game where the castle's Hearts are both the loss resource and the kingdom's power. The player protects a winding road through distinct Shadow Kingdom regions, makes meaningful between-wave choices, and combines character towers against enemy formations and chapter bosses.

The unique hooks are:

1. **Castle Heart Decisions:** after selected waves, the player chooses whether to repair/protect Hearts, empower a tower family, or charge a limited Bastion ability. Hearts remain dangerous to spend, so the choice creates tension rather than becoming a generic mana bar.
2. **Living Map Landmarks:** each map's bridge, ruin, forest, lava, or ice landmark changes one tactical rule or creates a timed opportunity. The visual map is part of strategy, not decoration only.
3. **Tower Synergy:** Archer marks, Cannon breaks armor/creates impact zones, and Frost controls movement. The fun comes from combinations and timing, not only bigger numbers.
4. **Enemy Formation Pressure:** enemies have readable roles and mixed formations; bosses change the road fight with telegraphed abilities.
5. **Short Mobile Sessions:** one map is readable in portrait, waves are clear, pause/speed controls are available, and each run produces a meaningful result.

## Current Weaknesses to Address

- `GameScene` is a large monolith mixing state, rendering, input, wave spawning, combat, and UI.
- Combat lacks enough tactical choices and enemy behavior variety.
- Tower stats and wave scaling need deterministic balance simulation.
- Map backgrounds exist, but landmarks do not yet affect gameplay.
- Character assets are integrated, but animation and asset optimization are incomplete.
- Map campaign currently has only three playable maps; chapter boss content is not authored.
- Placement/upgrade UI needs stronger mobile affordances and feedback.
- No pause/speed controls, between-wave decision layer, or wave summary.
- Browser interaction, real mobile touch, FPS, and effect-load behavior are not fully verified.
- No automated performance/load budget for enemies, projectiles, and effects.

## Milestones

### Milestone 1 — Foundation and Playability

**Goal:** make the current game easier to maintain and easier to play without changing its identity.

- Extract pure wave/combat/scene coordinator boundaries from `GameScene`.
- Add Pause, 1x/2x speed, and a clear wave-end summary.
- Improve placement hit areas to mobile-safe sizes.
- Add explicit attack/impact/kill/gate feedback states.
- Add performance counters and deterministic load tests.
- Keep behavior unchanged except for intentional UX fixes.

### Milestone 2 — Distinctive Shadow Bastion Mechanics

**Goal:** make the game feel unique.

- Add a tested between-wave Bastion Choice screen.
- Choices: restore one Heart, empower a tower family for the next wave, or charge a limited Bastion pulse.
- Add map landmark modifiers as data-driven rules, not hard-coded scene branches.
- Add tower synergy status effects: Mark, Shatter, Chill.
- Add HUD indicators explaining active modifiers.

### Milestone 3 — Tactical Enemy and Boss Design

**Goal:** replace HP-only difficulty with readable counterplay.

- Add enemy abilities: shield, stealth window, split, rage, or healer support.
- Add telegraphs and counter windows.
- Author Map 10 Boss as the first full chapter boss.
- Add boss-specific tests for phase changes, rewards, and Heart damage.

### Milestone 4 — Campaign and Content

**Goal:** expand replayable content after the core is fun.

- Author Maps 4–10 with distinct GPT-generated backgrounds and gameplay geometry.
- Add chapter map select with boss milestones.
- Add map-specific landmark rules and composition.
- Add difficulty curve and completion rating.

### Milestone 5 — Art, Audio, and Performance Polish

**Goal:** turn the prototype into a polished vertical slice.

- Generate/approve animation bases before sprite sheets.
- Add idle/attack/hit/defeat frames only after base art is locked.
- Optimize PNGs and verify load sizes.
- Add original sound effects and restrained music.
- Test 30+ FPS under a documented enemy/projectile/effect load.
- Run mobile browser QA on real touch and portrait layouts.

## Architecture Direction

Keep the existing stack:

- Phaser 3
- TypeScript
- Vite
- Vitest
- GitHub Pages

Proposed folders:

```text
src/
  data/       # maps, towers, enemies, assets, modifiers
  logic/      # pure state, combat, waves, choices, landmarks, progression
  entities/   # Tower, Enemy, Projectile visual adapters
  systems/    # WaveSystem, CombatSystem, LandmarkSystem, EffectsSystem
  scenes/     # Boot, Menu, MapSelect, Game, BastionChoice, Result
  rendering/  # map/background/HUD/effects rendering
  config/     # Phaser and game configuration
```

Rules:

- Pure logic must be testable without Phaser.
- Scene classes coordinate systems; they should not own every rule.
- Map/tower/enemy content stays data-driven.
- No copied code/assets from reference repos; learn patterns and reimplement with original Shadow Kingdom behavior.
- Every milestone uses RED → GREEN → full tests → build → browser/device QA.

## Release Gates

A milestone is not done until:

- Focused tests pass.
- Full suite passes.
- TypeScript/build pass.
- `git diff --check` passes.
- Browser behavior is observed or explicitly labeled `NOT MEASURED`.
- No new dependency or asset license risk is introduced.
- The change is committed separately and deployed only after verification.
