import { ActiveEnemy } from './game-state';
import { PATH_POINTS } from '../data/map-data';

export function distance(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function getEnemyWorldPos(enemy: ActiveEnemy): { x: number; y: number } {
  const idx = Math.min(enemy.pathIndex, PATH_POINTS.length - 2);
  const a = PATH_POINTS[idx];
  const b = PATH_POINTS[idx + 1];
  return {
    x: a.x + (b.x - a.x) * enemy.pathProgress,
    y: a.y + (b.y - a.y) * enemy.pathProgress,
  };
}

export function findTarget(
  enemies: ActiveEnemy[],
  towerPos: { x: number; y: number },
  range: number,
): ActiveEnemy | null {
  let best: ActiveEnemy | null = null;
  let bestProgress = -1;

  for (const enemy of enemies) {
    if (!enemy.alive) continue;
    const pos = getEnemyWorldPos(enemy);
    if (distance(towerPos, pos) > range) continue;

    const progress = enemy.pathIndex + enemy.pathProgress;
    if (progress > bestProgress) {
      bestProgress = progress;
      best = enemy;
    }
  }

  return best;
}
