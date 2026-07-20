# Shadow Kingdom: Bastion — Castle Hearts Plan

> User-approved gameplay requirement.

**Goal:** Make the castle's hearts the explicit loss resource: enemies reaching the castle consume hearts; zero hearts immediately loses; restart starts the active map from Wave 1 with full hearts.

**Architecture:** Keep numeric `GameState.lives` as the canonical value. Add a small pure UI formatter for full/empty heart display and a named `MAX_HEARTS` constant. Scene HUD renders hearts plus a compact numeric fallback. Existing enemy `livesCost`, gate loss, ResultScene, and scene restart remain the rules source.

## Requirements

- Start each new map with 10 hearts.
- Shade costs 1, Brute 2, Wraith 1, Shadow Captain 3 (reuse existing data).
- Clamp display to 0–10 hearts.
- On zero hearts: `gameOver=true`, `won=false`, `phase='result'`.
- Result screen clearly says the castle fell and offers restart/map select.
- Restart must not carry depleted hearts into a new run.
- Add a brief castle-hit flash/shake and a floating `-N ❤️` feedback when an enemy passes.

## Files

- Create/modify: `src/logic/heart-display.ts`
- Modify: `src/logic/game-state.ts` if a named constant is needed
- Modify: `src/scenes/GameScene.ts`
- Modify: `src/scenes/ResultScene.ts`
- Tests: `tests/heart-display.test.ts`, plus existing game-state tests

## Verification

- Focused RED→GREEN tests for display/clamping and zero-heart defeat.
- Full tests and production build.
- Browser QA: observe full hearts, enemy reaching castle, decrement, zero-heart defeat, and restart reset where real input is available.
