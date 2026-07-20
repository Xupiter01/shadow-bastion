import { describe, it, expect, beforeEach } from 'vitest';
import { WaveSpawner, createWaveSpawner } from '../src/logic/wave-system';
import { GameState, createGameState } from '../src/logic/game-state';

describe('WaveSystem', () => {
  let state: GameState;
  let spawner: WaveSpawner;

  beforeEach(() => {
    state = createGameState();
    spawner = createWaveSpawner();
  });

  it('starts at wave 1', () => {
    expect(spawner.currentWave).toBe(1);
    expect(spawner.isSpawning).toBe(false);
  });

  it('generates enemies for wave 1', () => {
    const enemies = spawner.getWaveEnemies(1);
    expect(enemies.length).toBe(6);
    expect(enemies[0].type).toBe('shade');
  });

  it('advances wave after all enemies defeated', () => {
    state.wave = 1;
    state.enemies = [];
    const advanced = spawner.tryAdvanceWave(state);
    expect(advanced).toBe(true);
    expect(state.wave).toBe(2);
  });

  it('does not advance when enemies still alive', () => {
    state.wave = 1;
    state.enemies.push({
      id: 0, type: 'shade', hp: 10, maxHp: 30, speed: 60,
      reward: 10, livesCost: 1, pathIndex: 2, pathProgress: 0.5,
      slowTimer: 0, alive: true,
    });
    const advanced = spawner.tryAdvanceWave(state);
    expect(advanced).toBe(false);
    expect(state.wave).toBe(1);
  });

  it('marks win when wave 5 complete', () => {
    state.wave = 5;
    state.enemies = [];
    spawner.tryAdvanceWave(state);
    expect(state.won).toBe(true);
    expect(state.phase).toBe('result');
  });
});
