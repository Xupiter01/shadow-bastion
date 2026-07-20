export class TowerCooldownTracker {
  private cooldownEnds: Map<number, number> = new Map();

  canFire(towerId: number, currentTimeMs: number): boolean {
    const cooldownEnd = this.cooldownEnds.get(towerId) ?? 0;
    return currentTimeMs >= cooldownEnd;
  }

  recordFire(towerId: number, currentTimeMs: number, fireRate: number): void {
    this.cooldownEnds.set(towerId, currentTimeMs + 1000 / fireRate);
  }
}

export interface ProjectileState {
  x: number;
  y: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  targetId: number;
  damage: number;
  speed: number;
  towerType: string;
  alive: boolean;
  justImpacted: boolean;
  distanceToTravel: number;
  distanceTraveled: number;
}

const PROJECTILE_SPEED = 300;

export function createProjectileState(
  fromX: number,
  fromY: number,
  targetX: number,
  targetY: number,
  damage: number,
  towerType: string,
  targetId: number = -1,
): ProjectileState {
  const dx = targetX - fromX;
  const dy = targetY - fromY;
  return {
    x: fromX,
    y: fromY,
    startX: fromX,
    startY: fromY,
    targetX,
    targetY,
    targetId,
    damage,
    speed: PROJECTILE_SPEED,
    towerType,
    alive: true,
    justImpacted: false,
    distanceToTravel: Math.sqrt(dx * dx + dy * dy),
    distanceTraveled: 0,
  };
}

export function tickProjectile(p: ProjectileState, deltaMs: number): boolean {
  if (!p.alive) return false;

  const dx = p.targetX - p.x;
  const dy = p.targetY - p.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist <= 5) {
    p.alive = false;
    p.justImpacted = true;
    p.x = p.targetX;
    p.y = p.targetY;
    return false;
  }

  const move = p.speed * (deltaMs / 1000);
  p.x += (dx / dist) * move;
  p.y += (dy / dist) * move;
  p.distanceTraveled += move;
  return true;
}

export function getProjectileDamage(p: ProjectileState): number {
  return p.damage;
}

export function shouldApplyImpactEffects(p: ProjectileState): boolean {
  return p.justImpacted;
}

export function getProjectileImpactType(p: ProjectileState): string {
  return p.towerType;
}
