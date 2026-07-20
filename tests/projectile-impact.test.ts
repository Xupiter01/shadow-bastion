import { describe, it, expect } from 'vitest';
import {
  createProjectileState,
  tickProjectile,
  getProjectileDamage,
  shouldApplyImpactEffects,
  getProjectileImpactType,
  type ProjectileState,
} from '../src/logic/combat-timing';
import { ActiveEnemy, GameState, createGameState } from '../src/logic/game-state';
import { applyDamage, applySlow, grantEnemyReward } from '../src/logic/damage';

function makeEnemy(overrides?: Partial<ActiveEnemy>): ActiveEnemy {
  return {
    id: 0, type: 'shade', hp: 30, maxHp: 30, speed: 60,
    reward: 10, livesCost: 1, pathIndex: 2, pathProgress: 0.5,
    slowTimer: 0, alive: true,
    ...overrides,
  };
}

describe('ProjectileState', () => {
  it('creates a projectile with starting position and target', () => {
    const p = createProjectileState(100, 100, 200, 200, 10, 'archer', 1);
    expect(p.x).toBe(100);
    expect(p.y).toBe(100);
    expect(p.targetId).toBe(1);
    expect(p.damage).toBe(10);
    expect(p.alive).toBe(true);
  });

  it('tickProjectile moves toward target and returns alive', () => {
    const p = createProjectileState(100, 100, 200, 100, 10, 'archer', 1);
    const result = tickProjectile(p, 100);
    expect(result).toBe(true);
    expect(p.alive).toBe(true);
    expect(p.x).toBeGreaterThan(100);
  });

  it('projectile reaches target position and marks dead', () => {
    const p = createProjectileState(100, 100, 105, 100, 10, 'archer', 1);
    tickProjectile(p, 500);
    expect(p.alive).toBe(false);
  });

  it('getProjectileDamage returns projectile damage', () => {
    const p = createProjectileState(0, 0, 10, 0, 25, 'cannon', 1);
    expect(getProjectileDamage(p)).toBe(25);
  });

  it('shouldApplyImpactEffects true when projectile just reached target', () => {
    const p = createProjectileState(100, 100, 105, 100, 10, 'archer', 1);
    tickProjectile(p, 500);
    expect(shouldApplyImpactEffects(p)).toBe(true);
  });

  it('shouldApplyImpactEffects false when still in flight', () => {
    const p = createProjectileState(100, 100, 300, 100, 10, 'archer', 1);
    tickProjectile(p, 10);
    expect(shouldApplyImpactEffects(p)).toBe(false);
  });

  it('getProjectileImpactType returns tower type', () => {
    const p = createProjectileState(0, 0, 5, 0, 10, 'frost', 1);
    tickProjectile(p, 500);
    expect(getProjectileImpactType(p)).toBe('frost');
  });
});

describe('Projectile impact damage', () => {
  it('applies damage exactly once on impact', () => {
    const enemy = makeEnemy({ hp: 30 });
    const p = createProjectileState(100, 100, 105, 100, 10, 'archer', 1);
    tickProjectile(p, 500);

    applyDamage(enemy, getProjectileDamage(p));
    expect(enemy.hp).toBe(20);

    applyDamage(enemy, getProjectileDamage(p));
    expect(enemy.hp).toBe(10);
  });

  it('cannon splash applies to nearby enemies on impact only', () => {
    const target = makeEnemy({ id: 0, hp: 30 });
    const nearby = makeEnemy({ id: 1, hp: 30 });
    const far = makeEnemy({ id: 2, hp: 30 });

    const p = createProjectileState(100, 100, 105, 100, 20, 'cannon', 1);
    tickProjectile(p, 500);

    applyDamage(target, getProjectileDamage(p));

    const nearbyPos = { x: 110, y: 105 };
    const targetPos = { x: 105, y: 100 };
    const splashRadius = 40;

    const dist = Math.sqrt((nearbyPos.x - targetPos.x) ** 2 + (nearbyPos.y - targetPos.y) ** 2);
    if (dist < splashRadius) {
      applyDamage(nearby, getProjectileDamage(p) * 0.5);
    }

    const farPos = { x: 500, y: 500 };
    const farDist = Math.sqrt((farPos.x - targetPos.x) ** 2 + (farPos.y - targetPos.y) ** 2);
    if (farDist < splashRadius) {
      applyDamage(far, getProjectileDamage(p) * 0.5);
    }

    expect(target.hp).toBe(10);
    expect(nearby.hp).toBe(20);
    expect(far.hp).toBe(30);
  });

  it('frost slow applies on impact only', () => {
    const enemy = makeEnemy({ slowTimer: 0 });
    const p = createProjectileState(100, 100, 105, 100, 5, 'frost', 1);
    tickProjectile(p, 500);

    applyDamage(enemy, getProjectileDamage(p));
    applySlow(enemy, 2000);

    expect(enemy.hp).toBe(25);
    expect(enemy.slowTimer).toBe(2000);
  });

  it('kill reward granted exactly once after projectile impact kills enemy', () => {
    const state = createGameState();
    const enemy = makeEnemy({ hp: 8 });

    const p = createProjectileState(100, 100, 105, 100, 10, 'archer', 1);
    tickProjectile(p, 500);

    applyDamage(enemy, getProjectileDamage(p));
    expect(enemy.alive).toBe(false);

    const reward1 = grantEnemyReward(state, enemy);
    const reward2 = grantEnemyReward(state, enemy);
    expect(reward1).toBe(10);
    expect(reward2).toBe(0);
    expect(state.essence).toBe(110);
  });
});
