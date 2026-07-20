import { ActiveEnemy, GameState } from './game-state';

export function applyDamage(enemy: ActiveEnemy, damage: number): void {
  enemy.hp -= damage;
  if (enemy.hp <= 0) {
    enemy.alive = false;
  }
}

export function grantEnemyReward(state: GameState, enemy: ActiveEnemy): number {
  if (enemy.alive || enemy.hp > 0) return 0;
  const reward = enemy.reward;
  state.essence += reward;
  enemy.reward = 0;
  return reward;
}

export function applySlow(enemy: ActiveEnemy, duration: number): void {
  if (enemy.type === 'wraith' && enemy.slowTimer > 0) return;
  enemy.slowTimer = duration;
}
