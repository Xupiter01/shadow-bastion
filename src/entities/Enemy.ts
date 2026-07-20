import Phaser from 'phaser';
import { ActiveEnemy } from '../logic/game-state';
import { ENEMY_DATA, EnemyType } from '../data/enemy-data';
import { PATH_POINTS } from '../data/map-data';

export class EnemyEntity {
  graphics: Phaser.GameObjects.Graphics;
  hpBarBg: Phaser.GameObjects.Graphics;
  hpBar: Phaser.GameObjects.Graphics;
  private enemy: ActiveEnemy;
  private scene: Phaser.Scene;
  private hitFlashTimer: number = 0;

  constructor(scene: Phaser.Scene, enemy: ActiveEnemy) {
    this.scene = scene;
    this.enemy = enemy;
    this.graphics = scene.add.graphics();
    this.graphics.setDepth(20);
    this.hpBarBg = scene.add.graphics();
    this.hpBarBg.setDepth(21);
    this.hpBar = scene.add.graphics();
    this.hpBar.setDepth(22);
    this.drawEnemy();
  }

  getWorldPos(): { x: number; y: number } {
    const idx = Math.min(this.enemy.pathIndex, PATH_POINTS.length - 2);
    const a = PATH_POINTS[idx];
    const b = PATH_POINTS[idx + 1];
    return {
      x: a.x + (b.x - a.x) * this.enemy.pathProgress,
      y: a.y + (b.y - a.y) * this.enemy.pathProgress,
    };
  }

  update(delta: number): void {
    const pos = this.getWorldPos();
    this.graphics.setPosition(pos.x, pos.y);

    if (this.hitFlashTimer > 0) {
      this.hitFlashTimer -= delta;
      this.graphics.setAlpha(0.7 + Math.sin(this.hitFlashTimer * 0.03) * 0.3);
      if (this.hitFlashTimer <= 0) {
        this.graphics.setAlpha(1);
      }
    }

    this.hpBarBg.clear();
    this.hpBar.clear();

    const data = ENEMY_DATA[this.enemy.type as EnemyType];
    const barWidth = data.radius * 2.5;
    const barY = pos.y - data.radius - 6;

    this.hpBarBg.fillStyle(0x1a1a1a, 0.8);
    this.hpBarBg.fillRoundedRect(pos.x - barWidth / 2, barY, barWidth, 3, 1);

    const ratio = Math.max(0, this.enemy.hp / this.enemy.maxHp);
    const hpColor = ratio > 0.5 ? 0x2ecc71 : ratio > 0.25 ? 0xf1c40f : 0xe74c3c;
    this.hpBar.fillStyle(hpColor, 1);
    this.hpBar.fillRoundedRect(pos.x - barWidth / 2, barY, barWidth * ratio, 3, 1);
  }

  onHit(): void {
    this.hitFlashTimer = 120;
    this.scene.tweens.add({
      targets: this.graphics,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 40,
      yoyo: true,
    });
  }

  private drawEnemy(): void {
    this.graphics.clear();
    const data = ENEMY_DATA[this.enemy.type as EnemyType];
    const r = data.radius;

    switch (this.enemy.type as EnemyType) {
      case 'shade':
        this.drawShade(r, data.color);
        break;
      case 'brute':
        this.drawBrute(r, data.color);
        break;
      case 'wraith':
        this.drawWraith(r, data.color);
        break;
      case 'captain':
        this.drawCaptain(r, data.color);
        break;
    }
  }

  private drawShade(r: number, color: number): void {
    this.graphics.fillStyle(color, 1);
    this.graphics.fillCircle(0, 0, r);
    this.graphics.fillStyle(0xffffff, 0.15);
    this.graphics.fillCircle(-r * 0.3, -r * 0.3, r * 0.4);
    this.graphics.fillStyle(color, 0.8);
    this.graphics.fillCircle(0, -r * 0.8, r * 0.4);
  }

  private drawBrute(r: number, color: number): void {
    this.graphics.fillStyle(color, 1);
    this.graphics.fillCircle(0, 2, r);
    this.graphics.fillStyle(0x1a1a2e, 1);
    this.graphics.fillRect(-r * 0.8, -r * 0.5, r * 1.6, r * 0.6);
    this.graphics.fillStyle(color, 1);
    this.graphics.fillCircle(0, -r * 0.3, r * 0.6);
    this.graphics.fillStyle(0x000000, 0.3);
    this.graphics.fillCircle(-2, -r * 0.4, 1.5);
    this.graphics.fillCircle(2, -r * 0.4, 1.5);
  }

  private drawWraith(r: number, color: number): void {
    this.graphics.fillStyle(color, 0.8);
    this.graphics.fillCircle(0, -2, r * 0.8);
    this.graphics.fillStyle(color, 0.4);
    for (let i = 0; i < 3; i++) {
      const ox = (i - 1) * r * 0.5;
      this.graphics.fillCircle(ox, r * 0.3 + i * 2, r * 0.5);
    }
    this.graphics.fillStyle(0xffffff, 0.3);
    this.graphics.fillCircle(-r * 0.25, -r * 0.4, 1.5);
    this.graphics.fillCircle(r * 0.25, -r * 0.4, 1.5);
  }

  private drawCaptain(r: number, color: number): void {
    this.graphics.fillStyle(color, 1);
    this.graphics.fillCircle(0, 0, r);
    this.graphics.fillStyle(0x1a1a2e, 1);
    this.graphics.fillRoundedRect(-r * 0.6, -r * 0.2, r * 1.2, r * 1.2, 2);
    this.graphics.fillStyle(0xf1c40f, 0.8);
    this.graphics.fillCircle(0, -r * 0.7, r * 0.35);
    this.graphics.fillStyle(0x000000, 0.4);
    this.graphics.fillCircle(-2, -r * 0.1, 1.5);
    this.graphics.fillCircle(2, -r * 0.1, 1.5);
  }

  getEnemy(): ActiveEnemy {
    return this.enemy;
  }

  destroy(): void {
    this.graphics.destroy();
    this.hpBarBg.destroy();
    this.hpBar.destroy();
  }
}
