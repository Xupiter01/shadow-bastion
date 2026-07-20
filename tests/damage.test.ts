import { describe, it, expect } from 'vitest';
import { applyDamage, applySlow } from '../src/logic/damage';
import { ActiveEnemy } from '../src/logic/game-state';

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

  it('does not re-slow an already slowed wraith', () => {
    const enemy = makeEnemy({ type: 'wraith', slowTimer: 2000 });
    applySlow(enemy, 1000);
    expect(enemy.slowTimer).toBe(2000);
  });
});
