import { describe, it, expect } from 'vitest';
import { createGameState, placeTower, GameState, ActiveEnemy } from '../src/logic/game-state';
import { findTarget } from '../src/logic/targeting';
import { applyDamage } from '../src/logic/damage';
import { TOWER_LEVELS } from '../src/data/tower-data';

describe('Tower Combat Integration', () => {
  it('archer tower damages closest enemy', () => {
    const state: GameState = createGameState();
    placeTower(state, 0, 'archer');
    const stats = TOWER_LEVELS.archer[0].stats;

    const enemy: ActiveEnemy = {
      id: 0, type: 'shade', hp: 30, maxHp: 30, speed: 60,
      reward: 10, livesCost: 1, pathIndex: 1, pathProgress: 0.8,
      slowTimer: 0, alive: true,
    };
    state.enemies.push(enemy);

    const target = findTarget(state.enemies, { x: 130, y: 110 }, stats.range);
    expect(target).not.toBeNull();

    if (target) {
      applyDamage(target, stats.damage);
      expect(target.hp).toBe(22);
    }
  });
});
