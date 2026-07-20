import Phaser from 'phaser';
import { ActiveEnemy } from '../logic/game-state';
import { ENEMY_DATA, EnemyType } from '../data/enemy-data';
import { PATH_POINTS } from '../data/map-data';

export class EnemyEntity {
  sprite: Phaser.GameObjects.Arc;
  hpBar: Phaser.GameObjects.Rectangle;
  private enemy: ActiveEnemy;

  constructor(scene: Phaser.Scene, enemy: ActiveEnemy) {
    this.enemy = enemy;
    const data = ENEMY_DATA[enemy.type as EnemyType];
    const pos = this.getWorldPos();
    this.sprite = scene.add.circle(pos.x, pos.y, data.radius, data.color);
    this.sprite.setStrokeStyle(1, 0xffffff, 0.5);
    this.hpBar = scene.add.rectangle(pos.x, pos.y - data.radius - 4, data.radius * 2, 3, 0x00ff00);
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

  update(): void {
    const pos = this.getWorldPos();
    this.sprite.setPosition(pos.x, pos.y);
    this.hpBar.setPosition(pos.x, pos.y - 14);
    const ratio = Math.max(0, this.enemy.hp / this.enemy.maxHp);
    this.hpBar.setSize(20 * ratio, 3);
    this.hpBar.setFillStyle(ratio > 0.5 ? 0x00ff00 : ratio > 0.25 ? 0xffff00 : 0xff0000);
  }

  getEnemy(): ActiveEnemy {
    return this.enemy;
  }

  destroy(): void {
    this.sprite.destroy();
    this.hpBar.destroy();
  }
}
