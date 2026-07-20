import { describe, it, expect } from 'vitest';
import { ActiveEnemy, GameState, createGameState } from '../src/logic/game-state';
import { applyDamage, grantEnemyReward } from '../src/logic/damage';

function makeEnemy(overrides?: Partial<ActiveEnemy>): ActiveEnemy {
  return {
    id: 0, type: 'shade', hp: 30, maxHp: 30, speed: 60,
    reward: 10, livesCost: 1, pathIndex: 2, pathProgress: 0.5,
    slowTimer: 0, alive: true,
    ...overrides,
  };
}

describe('Enemy reward transition', () => {
  it('grants reward exactly once when enemy dies from damage', () => {
    const state = createGameState();
    const enemy = makeEnemy({ hp: 10 });
    applyDamage(enemy, 15);
    expect(enemy.alive).toBe(false);

    const granted = grantEnemyReward(state, enemy);
    expect(granted).toBe(10);
    expect(state.essence).toBe(110);
  });

  it('grants zero on repeated processing of same dead enemy', () => {
    const state = createGameState();
    const enemy = makeEnemy({ hp: 10 });
    applyDamage(enemy, 15);

    grantEnemyReward(state, enemy);
    const secondGrant = grantEnemyReward(state, enemy);
    expect(secondGrant).toBe(0);
    expect(state.essence).toBe(110);
  });

  it('grants zero when enemy is still alive', () => {
    const state = createGameState();
    const enemy = makeEnemy({ hp: 20 });
    applyDamage(enemy, 5);

    const granted = grantEnemyReward(state, enemy);
    expect(granted).toBe(0);
    expect(state.essence).toBe(100);
  });

  it('grants correct reward for each enemy type', () => {
    const state = createGameState();

    const shade = makeEnemy({ type: 'shade', reward: 10, hp: 1 });
    applyDamage(shade, 5);
    grantEnemyReward(state, shade);
    expect(state.essence).toBe(110);

    const wraith = makeEnemy({ type: 'wraith', reward: 20, hp: 1 });
    applyDamage(wraith, 5);
    grantEnemyReward(state, wraith);
    expect(state.essence).toBe(130);

    const brute = makeEnemy({ type: 'brute', reward: 25, hp: 1 });
    applyDamage(brute, 5);
    grantEnemyReward(state, brute);
    expect(state.essence).toBe(155);

    const captain = makeEnemy({ type: 'captain', reward: 100, hp: 1 });
    applyDamage(captain, 5);
    grantEnemyReward(state, captain);
    expect(state.essence).toBe(255);
  });
});
