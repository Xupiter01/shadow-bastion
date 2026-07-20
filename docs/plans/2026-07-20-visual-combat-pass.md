# Shadow Kingdom: Bastion — Visual Combat Pass Plan

> User-approved direction: make the game visibly beautiful, with real shots, projectiles, and combat effects.

**Goal:** Replace placeholder combat presentation with readable Chibi Pixel-style tower silhouettes, timed firing, moving projectiles, hit effects, and combat feedback while preserving reward, upgrade, wave, and map systems.

**Architecture:** Keep combat timing and projectile hit decisions deterministic and testable in pure logic. Phaser entities render towers, enemies, projectiles, flashes, trails, and damage numbers. Damage/reward happens once on projectile impact, not once per frame while a target is in range.

**Tech Stack:** Existing Phaser 3 + TypeScript + Vite + Vitest; no new dependencies or external assets required for this pass.

## Scope

- Respect each tower's `fireRate` with a per-tower cooldown.
- Spawn a projectile for every shot.
- Apply single-target damage only when projectile reaches its target.
- Apply Cannon splash and Frost slow on impact.
- Keep one-time kill reward behavior intact.
- Add short 12 FPS-feel attack/impact animations using tweens and crisp runtime-drawn shapes.
- Add muzzle flash, projectile trail, hit spark/ring, and floating damage/reward feedback.
- Add readable composite tower silhouettes: base, body, head, weapon, level badge.
- Add enemy hit flash/knockback pulse and stronger HP bar treatment.
- Keep effects bounded and destroy completed objects to avoid leaks.

## Files

- Modify: `src/entities/Tower.ts`
- Modify: `src/entities/Enemy.ts`
- Modify: `src/entities/Projectile.ts`
- Modify: `src/rendering/PixelEffects.ts`
- Modify: `src/scenes/GameScene.ts`
- Create or modify pure combat timing helper under `src/logic/`
- Test: `tests/combat-timing.test.ts`
- Test: `tests/projectile-impact.test.ts`

## Acceptance Criteria

- [ ] Archer/Cannon/Frost visibly fire on their configured cooldown.
- [ ] Projectile travels from tower to enemy and is destroyed at impact.
- [ ] Damage is not applied before impact and is applied exactly once per projectile.
- [ ] Cannon splash and Frost slow occur only on impact.
- [ ] Kill reward remains exactly once.
- [ ] Tower upgrade changes visible tower level/scale/range and combat stats.
- [ ] Hit/muzzle/trail/damage-number effects are visible and short-lived.
- [ ] Map roads, castle, placement, and progression remain intact.
- [ ] Focused tests, full tests, TypeScript/build pass.
- [ ] Browser QA observes at least one real shot, projectile travel, and hit effect; unmeasured touch/FPS remain explicitly labeled.
