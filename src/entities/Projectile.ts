import Phaser from 'phaser';

export class ProjectileEntity {
  sprite: Phaser.GameObjects.Arc;
  private targetX: number;
  private targetY: number;
  private damage: number;
  private speed: number = 300;
  private alive: boolean = true;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    targetX: number,
    targetY: number,
    damage: number,
    color: number,
  ) {
    this.targetX = targetX;
    this.targetY = targetY;
    this.damage = damage;
    this.sprite = scene.add.circle(x, y, 3, color);
  }

  update(delta: number): boolean {
    if (!this.alive) return false;

    const dx = this.targetX - this.sprite.x;
    const dy = this.targetY - this.sprite.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 5) {
      this.alive = false;
      this.destroy();
      return false;
    }

    const move = this.speed * (delta / 1000);
    this.sprite.x += (dx / dist) * move;
    this.sprite.y += (dy / dist) * move;
    return true;
  }

  hasReachedTarget(): boolean {
    return !this.alive;
  }

  getDamage(): number {
    return this.damage;
  }

  destroy(): void {
    this.sprite.destroy();
  }
}
