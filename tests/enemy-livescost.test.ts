import { describe, it, expect } from 'vitest';
import { ENEMY_DATA, type EnemyType } from '../src/data/enemy-data';

describe('enemy livesCost values for castle hearts', () => {
  it('shade costs 1 heart', () => {
    expect(ENEMY_DATA.shade.livesCost).toBe(1);
  });

  it('brute costs 2 hearts', () => {
    expect(ENEMY_DATA.brute.livesCost).toBe(2);
  });

  it('wraith costs 1 heart', () => {
    expect(ENEMY_DATA.wraith.livesCost).toBe(1);
  });

  it('shadow captain costs 3 hearts', () => {
    expect(ENEMY_DATA.captain.livesCost).toBe(3);
  });

  it('all enemy types have positive livesCost', () => {
    const types: EnemyType[] = ['shade', 'brute', 'wraith', 'captain'];
    for (const type of types) {
      expect(ENEMY_DATA[type].livesCost).toBeGreaterThan(0);
    }
  });

  it('livesCost values sum to at least 7 for a full wave 5', () => {
    const wave5 = [
      { type: 'shade' as EnemyType, count: 8 },
      { type: 'brute' as EnemyType, count: 4 },
      { type: 'wraith' as EnemyType, count: 4 },
      { type: 'captain' as EnemyType, count: 1 },
    ];
    const totalCost = wave5.reduce(
      (sum, entry) => sum + ENEMY_DATA[entry.type].livesCost * entry.count,
      0,
    );
    expect(totalCost).toBeGreaterThanOrEqual(7);
  });
});
