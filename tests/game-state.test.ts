import { describe, it, expect, beforeEach } from 'vitest';
import { createGameState, GameState, placeTower, upgradeTower, sellTower, enemyReachedGate, restartGame } from '../src/logic/game-state';

describe('GameState', () => {
  let state: GameState;

  beforeEach(() => {
    state = createGameState();
  });

  it('creates initial state with correct values', () => {
    expect(state.lives).toBe(10);
    expect(state.essence).toBe(100);
    expect(state.wave).toBe(1);
    expect(state.phase).toBe('prep');
    expect(state.towers).toEqual([]);
    expect(state.enemies).toEqual([]);
    expect(state.gameOver).toBe(false);
    expect(state.won).toBe(false);
  });

  it('can place a tower on an empty slot with enough essence', () => {
    const result = placeTower(state, 0, 'archer');
    expect(result.success).toBe(true);
    expect(state.towers).toHaveLength(1);
    expect(state.towers[0].type).toBe('archer');
    expect(state.towers[0].slotId).toBe(0);
    expect(state.essence).toBe(50);
  });

  it('rejects placement on occupied slot', () => {
    placeTower(state, 0, 'archer');
    const result = placeTower(state, 0, 'cannon');
    expect(result.success).toBe(false);
    expect(result.reason).toBe('slot_occupied');
    expect(state.essence).toBe(50);
  });

  it('rejects placement without enough essence', () => {
    state.essence = 30;
    const result = placeTower(state, 0, 'cannon');
    expect(result.success).toBe(false);
    expect(result.reason).toBe('insufficient_essence');
    expect(state.essence).toBe(30);
  });

  it('upgrades a tower and deducts essence', () => {
    placeTower(state, 0, 'archer');
    const result = upgradeTower(state, 0);
    expect(result.success).toBe(true);
    expect(state.towers[0].level).toBe(2);
    expect(state.essence).toBe(10);
  });

  it('rejects upgrade at max level', () => {
    state.essence = 500;
    placeTower(state, 0, 'archer');
    upgradeTower(state, 0); // level 1 → 2
    upgradeTower(state, 0); // level 2 → 3
    const result = upgradeTower(state, 0); // level 3 = max
    expect(result.success).toBe(false);
    expect(result.reason).toBe('max_level');
  });

  it('sells a tower and refunds 70% essence', () => {
    placeTower(state, 0, 'archer');
    const result = sellTower(state, 0);
    expect(result.success).toBe(true);
    expect(state.essence).toBe(85);
    expect(state.towers).toHaveLength(0);
  });

  it('deducts lives when enemy reaches gate', () => {
    state.enemies.push({
      id: 0, type: 'shade', hp: 10, maxHp: 10, speed: 60,
      reward: 10, livesCost: 1, pathIndex: 10, pathProgress: 1,
      slowTimer: 0, alive: true,
    });
    enemyReachedGate(state, 0);
    expect(state.lives).toBe(9);
    expect(state.gameOver).toBe(false);
  });

  it('sets gameOver when lives reach 0', () => {
    state.lives = 1;
    state.enemies.push({
      id: 0, type: 'brute', hp: 10, maxHp: 10, speed: 30,
      reward: 25, livesCost: 2, pathIndex: 10, pathProgress: 1,
      slowTimer: 0, alive: true,
    });
    enemyReachedGate(state, 0);
    expect(state.lives).toBe(-1);
    expect(state.gameOver).toBe(true);
    expect(state.won).toBe(false);
  });

  it('restart clears state to initial values', () => {
    placeTower(state, 0, 'archer');
    state.lives = 5;
    state.essence = 20;
    state.wave = 3;
    restartGame(state);
    expect(state.lives).toBe(10);
    expect(state.essence).toBe(100);
    expect(state.wave).toBe(1);
    expect(state.towers).toEqual([]);
    expect(state.enemies).toEqual([]);
    expect(state.gameOver).toBe(false);
  });
});
