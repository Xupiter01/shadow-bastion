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
    const target = findTarget(enemies, { x: 150, y: 200 }, 300);
    expect(target?.id).toBe(1);
  });

  it('returns null when no enemies in range', () => {
    const enemies = [makeEnemy(0, 0, 0)];
    const target = findTarget(enemies, { x: 300, y: 600 }, 10);
    expect(target).toBeNull();
  });

  it('returns null for dead enemies', () => {
    const enemies = [makeEnemy(0, 5, 0.5)];
    enemies[0].alive = false;
    const target = findTarget(enemies, { x: 150, y: 200 }, 200);
    expect(target).toBeNull();
  });
});
