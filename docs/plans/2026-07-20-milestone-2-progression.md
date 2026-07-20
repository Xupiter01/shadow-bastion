# Shadow Kingdom: Bastion — Milestone 2 Implementation Plan

> User-approved implementation plan. Use TDD and verify with real browser gameplay before completion.

**Goal:** Complete the progression loop: killing enemies grants Essence, placed towers can be upgraded through three levels, and enemy strength scales across five waves.

**Architecture:** Keep reward calculation and wave scaling in pure logic modules. Reuse the existing GameState, tower data, enemy data, and Phaser scene adapters. Do not add new dependencies, persistence, networking, heroes, maps, or unrelated UI systems.

**Tech Stack:** Phaser 3, TypeScript, Vite, Vitest

## Scope

- Reward exactly once when an enemy transitions from alive to defeated.
- Preserve existing reward values: Shade 10, Wraith 20, Brute 25, Shadow Captain 100 Essence.
- Upgrade towers from level 1 to 2 to 3 using existing costs/stats.
- Show upgrade level/cost/stat feedback and update the rendered tower after upgrade.
- Scale enemy HP by wave: 1.00, 1.20, 1.45, 1.75, 2.10.
- Increase later-wave pressure through composition and the existing Wave 5 captain.
- Keep `Lives`, `Essence`, and balance rules deterministic and finite.

## Tasks

### Task 1: Enemy reward transition

- Add failing pure tests for one-time reward on alive→dead transition and no reward on repeated processing.
- Implement the smallest reward helper and wire it into GameScene damage resolution.
- Verify focused tests, then full suite.

### Task 2: Tower upgrade progression

- Add failing tests for level 1→2→3, insufficient Essence, and max-level rejection.
- Reuse existing `upgradeTower` and tower data; fix only missing integration/render feedback.
- Verify panel interaction, Essence deduction, level update, and rendered stat/level state.

### Task 3: Wave enemy scaling

- Add failing tests for the exact five wave multipliers and finite/non-negative HP.
- Apply scaling at enemy spawn from data-driven wave configuration.
- Verify existing wave composition remains intact and Wave 5 includes Shadow Captain.

### Task 4: Browser gameplay QA

- Run focused tests, full tests, production build.
- Deploy to GitHub Pages.
- Open a fresh browser session, start a wave, verify a kill visibly increases Essence, place a tower, upgrade it, and observe stronger later-wave enemies.
- Check console errors and report touch/FPS only when actually measured.

## Acceptance Criteria

- [ ] Enemy kill increases Essence exactly once.
- [ ] Essence can fund new towers and upgrades.
- [ ] Tower upgrade visibly changes level/stats and affects combat values.
- [ ] Wave multipliers match the specified values.
- [ ] Existing tests remain green.
- [ ] Browser path demonstrates reward and upgrade behavior.
- [ ] GitHub Pages deployment succeeds.
