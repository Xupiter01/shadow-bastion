import { describe, it, expect } from 'vitest';
import { applyWaveHpScale, WAVE_HP_MULTIPLIERS } from '../src/logic/wave-system';
import { ActiveEnemy } from '../src/logic/game-state';

function makeEnemy(overrides?: Partial<ActiveEnemy>): ActiveEnemy {
  return {
    id: 0, type: 'shade', hp: 30, maxHp: 30, speed: 60,
    reward: 10, livesCost: 1, pathIndex: 0, pathProgress: 0,
    slowTimer: 0, alive: true,
    ...overrides,
  };
}

describe('Wave enemy HP scaling', () => {
  it('returns exact multipliers for waves 1 through 5', () => {
    expect(WAVE_HP_MULTIPLIERS).toEqual([1.00, 1.20, 1.45, 1.75, 2.10]);
  });

  it('scales shade HP correctly for each wave', () => {
    const base = 30;
    const expected = [30, 36, 43.5, 52.5, 63];
    for (let i = 0; i < 5; i++) {
      const enemy = makeEnemy({ hp: base, maxHp: base });
      applyWaveHpScale(enemy, i + 1);
      expect(enemy.hp).toBeCloseTo(expected[i], 10);
      expect(enemy.maxHp).toBeCloseTo(expected[i], 10);
    }
  });

  it('scales brute HP correctly', () => {
    const enemy = makeEnemy({ type: 'brute', hp: 120, maxHp: 120 });
    applyWaveHpScale(enemy, 5);
    expect(enemy.hp).toBeCloseTo(252, 10);
    expect(enemy.maxHp).toBeCloseTo(252, 10);
  });

  it('scales captain HP correctly on wave 5', () => {
    const enemy = makeEnemy({ type: 'captain', hp: 300, maxHp: 300 });
    applyWaveHpScale(enemy, 5);
    expect(enemy.hp).toBeCloseTo(630, 10);
    expect(enemy.maxHp).toBeCloseTo(630, 10);
  });

  it('preserves wave 1 base HP (multiplier 1.00)', () => {
    const enemy = makeEnemy({ hp: 30, maxHp: 30 });
    applyWaveHpScale(enemy, 1);
    expect(enemy.hp).toBe(30);
    expect(enemy.maxHp).toBe(30);
  });

  it('produces finite non-negative HP for all waves and enemy types', () => {
    const types = ['shade', 'brute', 'wraith', 'captain'] as const;
    for (const type of types) {
      for (let wave = 1; wave <= 5; wave++) {
        const enemy = makeEnemy({ type, hp: 30, maxHp: 30 });
        applyWaveHpScale(enemy, wave);
        expect(enemy.hp).toBeGreaterThanOrEqual(0);
        expect(Number.isFinite(enemy.hp)).toBe(true);
        expect(enemy.maxHp).toBeGreaterThanOrEqual(0);
        expect(Number.isFinite(enemy.maxHp)).toBe(true);
      }
    }
  });

  it('wave 5 includes captain with scaled HP', () => {
    const enemy = makeEnemy({ type: 'captain', hp: 300, maxHp: 300 });
    applyWaveHpScale(enemy, 5);
    expect(enemy.type).toBe('captain');
    expect(enemy.hp).toBeGreaterThan(300);
  });
});
