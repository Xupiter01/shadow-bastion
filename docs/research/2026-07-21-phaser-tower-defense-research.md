# Phaser Tower Defense Repository Research — 2026-07-21

## Sources studied

- `thilo-behnke/phaser3-tower-defense` — cloned/read-only at `.research-phaser3-tower-defense`; MIT. Portrait Phaser 3 + TypeScript + Matter prototype. `src/index.ts`, `src/scenes/GameScene.ts`, `src/objects/gun.ts`, `src/objects/Bullet.ts`, `src/lib/AutoRemoveList.ts`, Tiled map/assets.
- `SerhiiChoGames/tower-defense` — cloned/read-only at `tower-defense-reference`; MIT. Phaser + TypeScript + Vite, live demo verified. `src/config.ts`, `src/Scenes/StartScene.ts`, `src/Scenes/GameScene.ts`, `src/Models/Enemy/*`, `src/Models/Tower/*`, `src/Models/Placeholder.ts`.
- `thomaskoeppe/typescript-tower-defense-2d` — cloned/read-only at `typescript-tower-defense-2d`; GPL-3.0. Phaser + TypeScript + Matter, Tiled map, overlay scene. `src/game.ts`, `src/scenes/GameScene.ts`, `src/scenes/OverlayScene.ts`, `src/objects/*`, `src/lib/AutoRemoveList.ts`, `src/config/mapdata/map-2.json`.
- `phaserjs/examples` — official examples reference; MIT source, but many included assets are not licensed for commercial/ad-supported reuse.
- `digitsensitive/phaser3-typescript` — large MIT TypeScript example collection and boilerplates.

## Lessons that transfer to Shadow Bastion

### Architecture

- Reference TD repos commonly put too much state/orchestration in `GameScene`; this is easy initially but becomes fragile as features grow.
- Keep Bastion's stronger split: pure `logic/`, data registries, Phaser entity views, and scene orchestration. Extract future `systems/` from the monolithic scene rather than copying the reference architecture.
- Use explicit lifecycle and removal for enemies/projectiles. The references use `AutoRemoveList`-style patterns; Bastion should formalize this without introducing unnecessary physics.

### Maps and assets

- The strongest map reference uses Tiled layers and tile properties for visual layout, but gameplay rules should remain typed data for tests/balance.
- Recommended Bastion boundary: generated/GPT image and optional Tiled layout for visual presentation; TypeScript `MapDefinition` for road, slots, landmark rules, waves and boss metadata.
- Portrait maps of roughly `480x960` or `15x30` tiles support readable full-route composition; Bastion's 360x640 requires strict clutter/contrast discipline.

### Towers and targeting

- Useful reference patterns: separate tower archetypes, explicit cooldown, target lock, projectile factory, weapon orientation, and lead-target calculations.
- Bastion already has data-driven tower levels and cooldown, but needs targeting modes (`first`, `last`, `closest`, `strongest`) and clearer tower-specific attack identities.
- Keep projectile behavior separate from tower definition; avoid putting all damage/economy effects directly in a Scene loop.

### Placement UX

- The clearest reference flow is: choose tower → reveal valid mount points → place → hide points, with hover/press feedback.
- Common reference defects included hardcoded tower-price checks and global toggle-based placeholder visibility. Bastion should use explicit `placementMode: TowerType | null`, selected-definition pricing, red/green validity, ghost preview, cancel, and mobile-safe hit zones.

### Castle/game state

- One reference visually attacks the castle but has no actual castle health/game-over state. Bastion's Hearts system is stronger and should stay pure-state driven:
  `enemy reaches castle → pure CastleDamage transition → HUD/effect → zero Hearts defeat`.
- Do not let Phaser entities mutate Hearts/economy directly.

### Animation and game feel

- References use sprite sheets, direction-aware movement animation, build animation, attack animation, health bars, and sound feedback. Bastion has base character PNGs and runtime effects but still needs approved base-first animation frames, then idle/attack/hit variants.
- Use original GPT assets only; do not copy reference assets. Keep asset provenance/license notes.

### Build and quality

- `thilo-behnke/phaser3-tower-defense` and `SerhiiChoGames/tower-defense` are MIT and useful for ideas; `thomaskoeppe/typescript-tower-defense-2d` is GPL-3.0, so do not copy code into a differently licensed commercial project without a deliberate license decision.
- Phaser official examples are excellent API references, but their assets may not be reusable even though source is MIT.
- One reference had ~1.49MB bundle size; Bastion should set an explicit mobile asset/bundle budget because current generated PNGs are individually large.

## Direct comparison: Bastion gaps

1. `GameScene.ts` still owns map drawing, HUD, input, spawning, combat, projectile impacts, rewards, and cleanup.
2. Targeting is mostly one policy; there is no player-selectable priority.
3. Placement state/feedback is basic; no ghost preview or explicit cancel mode.
4. Enemies mostly differ by stats; no shield/stealth/split/healer/rage counterplay.
5. Boss logic foundation exists, but a full authored boss map/phase encounter is not present.
6. No pause/speed control/wave result layer.
7. Character base assets are integrated but no sprite-sheet animation yet.
8. Generated asset sizes need optimization and load-budget checks.
9. Landmark visuals are not yet gameplay modifiers.
10. Real mobile touch, FPS under load, and full browser gameplay need verification.

## Decision

Do not fork any reference repo. Implement lessons in Shadow Bastion's existing Phaser + TypeScript + Vite + Vitest architecture, with original assets and pure tested gameplay rules.
