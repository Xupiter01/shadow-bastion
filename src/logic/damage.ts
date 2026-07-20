import { ActiveEnemy } from './game-state';

export function applyDamage(enemy: ActiveEnemy, damage: number): void {
  enemy.hp -= damage;
  if (enemy.hp <= 0) {
    enemy.alive = false;
  }
}

export function applySlow(enemy: ActiveEnemy, duration: number): void {
  if (enemy.type === 'wraith' && enemy.slowTimer > 0) return;
  enemy.slowTimer = duration;
}
