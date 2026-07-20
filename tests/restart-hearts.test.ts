import { describe, it, expect, beforeEach } from 'vitest';
import { createGameState, GameState, enemyReachedGate, restartGame, MAX_HEARTS } from '../src/logic/game-state';
import { formatHearts, formatLives } from '../src/logic/heart-display';

describe('restart resets hearts fully', () => {
  let state: GameState;

  beforeEach(() => {
    state = createGameState();
  });

  it('restart after partial damage restores MAX_HEARTS', () => {
    state.lives = 6;
    restartGame(state);
    expect(state.lives).toBe(MAX_HEARTS);
    expect(formatLives(state.lives, MAX_HEARTS)).toBe(`${MAX_HEARTS}/${MAX_HEARTS}`);
  });

  it('restart after game over restores MAX_HEARTS', () => {
    state.lives = 1;
    state.enemies.push({
      id: 0, type: 'shade', hp: 30, maxHp: 30, speed: 60,
      reward: 10, livesCost: 1, pathIndex: 10, pathProgress: 1,
      slowTimer: 0, alive: true,
    });
    enemyReachedGate(state, 0);
    expect(state.gameOver).toBe(true);
    expect(state.lives).toBe(0);

    restartGame(state);
    expect(state.lives).toBe(MAX_HEARTS);
    expect(state.gameOver).toBe(false);
    expect(state.won).toBe(false);
    expect(state.phase).toBe('prep');
    expect(state.enemies).toEqual([]);
    expect(state.towers).toEqual([]);
  });

  it('hearts display shows full hearts after restart', () => {
    state.lives = 3;
    restartGame(state);
    const hearts = formatHearts(state.lives, MAX_HEARTS);
    expect(hearts).toBe('\u2764\uFE0F'.repeat(MAX_HEARTS));
  });

  it('restart does not carry depleted hearts into new run', () => {
    state.lives = 4;
    restartGame(state);
    expect(state.lives).toBe(10);
    expect(formatLives(state.lives, MAX_HEARTS)).toBe('10/10');
  });
});
