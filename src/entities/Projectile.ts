import Phaser from 'phaser';
import type { ProjectileState } from '../logic/combat-timing';

const TRAIL_LENGTH = 6;

export class ProjectileEntity {
  graphics: Phaser.GameObjects.Graphics;
  private state: ProjectileState;
  private trail: { x: number; y: number }[] = [];
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, state: ProjectileState) {
    this.scene = scene;
    this.state = state;
    this.graphics = scene.add.graphics();
    this.graphics.setDepth(50);
  }

  update(delta: number): boolean {
    if (!this.state.alive) return false;

    this.trail.push({ x: this.state.x, y: this.state.y });
    if (this.trail.length > TRAIL_LENGTH) this.trail.shift();

    const prevX = this.state.x;
    const prevY = this.state.y;
    const hit = !tickAndMove(this.state, delta);

    this.draw(prevX, prevY);
    return !hit;
  }

  hasImpacted(): boolean {
    return this.state.justImpacted;
  }

  getState(): ProjectileState {
    return this.state;
  }

  private draw(prevX: number, prevY: number): void {
    this.graphics.clear();

    for (let i = 0; i < this.trail.length; i++) {
      const t = this.trail[i];
      const alpha = (i + 1) / this.trail.length * 0.4;
      const size = 1 + (i / this.trail.length) * 1.5;
      this.graphics.fillStyle(getProjectileColor(this.state.towerType), alpha);
      this.graphics.fillCircle(t.x, t.y, size);
    }

    const color = getProjectileColor(this.state.towerType);
    this.graphics.fillStyle(color, 1);
    const sz = this.state.towerType === 'cannon' ? 4 : this.state.towerType === 'frost' ? 3.5 : 2.5;
    this.graphics.fillCircle(this.state.x, this.state.y, sz);
    this.graphics.fillStyle(0xffffff, 0.7);
    this.graphics.fillCircle(this.state.x - sz * 0.3, this.state.y - sz * 0.3, sz * 0.35);
  }

  destroy(): void {
    this.graphics.destroy();
  }
}

function tickAndMove(state: ProjectileState, deltaMs: number): boolean {
  if (!state.alive) return false;

  const dx = state.targetX - state.x;
  const dy = state.targetY - state.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist <= 5) {
    state.alive = false;
    state.justImpacted = true;
    state.x = state.targetX;
    state.y = state.targetY;
    return false;
  }

  const move = state.speed * (deltaMs / 1000);
  state.x += (dx / dist) * move;
  state.y += (dy / dist) * move;
  state.distanceTraveled += move;
  return true;
}

function getProjectileColor(towerType: string): number {
  switch (towerType) {
    case 'archer': return 0xd4a0ff;
    case 'cannon': return 0xff6b6b;
    case 'frost': return 0x7ec8e3;
    default: return 0xffffff;
  }
}
