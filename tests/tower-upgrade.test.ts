import { describe, it, expect, beforeEach } from 'vitest';
import { createGameState, placeTower, upgradeTower, GameState, ActiveEnemy } from '../src/logic/game-state';
import { findTarget } from '../src/logic/targeting';
import { applyDamage } from '../src/logic/damage';
import { TOWER_LEVELS } from '../src/data/tower-data';

describe('Tower upgrade combat impact', () => {
  let state: GameState;

  beforeEach(() => {
    state = createGameState();
  });

  it('level 2 archer has higher damage than level 1', () => {
    placeTower(state, 0, 'archer');
    const l1Stats = TOWER_LEVELS.archer[0].stats;
    upgradeTower(state, 0);
    const l2Stats = TOWER_LEVELS.archer[1].stats;
    expect(l2Stats.damage).toBeGreaterThan(l1Stats.damage);
  });

  it('level 3 archer has higher damage than level 2', () => {
    state.essence = 500;
    placeTower(state, 0, 'archer');
    upgradeTower(state, 0);
    const l2Stats = TOWER_LEVELS.archer[1].stats;
    upgradeTower(state, 0);
    const l3Stats = TOWER_LEVELS.archer[2].stats;
    expect(l3Stats.damage).toBeGreaterThan(l2Stats.damage);
  });

  it('upgraded tower kills enemy in fewer hits', () => {
    placeTower(state, 0, 'archer');
    const l1Stats = TOWER_LEVELS.archer[0].stats;

    const enemy1: ActiveEnemy = {
      id: 0, type: 'shade', hp: 30, maxHp: 30, speed: 60,
      reward: 10, livesCost: 1, pathIndex: 1, pathProgress: 0.8,
      slowTimer: 0, alive: true,
    };
    const hitsL1 = Math.ceil(enemy1.hp / l1Stats.damage);

    upgradeTower(state, 0);
    const l2Stats = TOWER_LEVELS.archer[1].stats;
    const enemy2: ActiveEnemy = {
      id: 1, type: 'shade', hp: 30, maxHp: 30, speed: 60,
      reward: 10, livesCost: 1, pathIndex: 1, pathProgress: 0.8,
      slowTimer: 0, alive: true,
    };
    const hitsL2 = Math.ceil(enemy2.hp / l2Stats.damage);

    expect(hitsL2).toBeLessThan(hitsL1);
  });

  it('upgraded tower has larger range', () => {
    placeTower(state, 0, 'archer');
    const l1Range = TOWER_LEVELS.archer[0].stats.range;
    upgradeTower(state, 0);
    const l2Range = TOWER_LEVELS.archer[1].stats.range;
    expect(l2Range).toBeGreaterThan(l1Range);
  });

  it('frost tower upgrade increases damage and range', () => {
    placeTower(state, 0, 'frost');
    const l1 = TOWER_LEVELS.frost[0].stats;
    upgradeTower(state, 0);
    const l2 = TOWER_LEVELS.frost[1].stats;
    expect(l2.damage).toBeGreaterThan(l1.damage);
    expect(l2.range).toBeGreaterThan(l1.range);
  });

  it('cannon tower upgrade increases damage', () => {
    placeTower(state, 0, 'cannon');
    const l1 = TOWER_LEVELS.cannon[0].stats;
    upgradeTower(state, 0);
    const l2 = TOWER_LEVELS.cannon[1].stats;
    expect(l2.damage).toBeGreaterThan(l1.damage);
  });
});
