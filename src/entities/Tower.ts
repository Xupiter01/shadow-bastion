import Phaser from 'phaser';
import { PlacedTower } from '../logic/game-state';
import { TOWER_LEVELS } from '../data/tower-data';

export class TowerEntity {
  sprite: Phaser.GameObjects.Arc;
  rangeCircle: Phaser.GameObjects.Arc;
  private tower: PlacedTower;

  constructor(scene: Phaser.Scene, x: number, y: number, tower: PlacedTower) {
    this.tower = tower;
    const levelData = TOWER_LEVELS[tower.type][tower.level - 1];
    const color = levelData.stats.color;

    this.sprite = scene.add.circle(x, y, 10, color);
    this.sprite.setStrokeStyle(2, 0xffffff);

    this.rangeCircle = scene.add.circle(x, y, levelData.stats.range, color, 0.1);
    this.rangeCircle.setStrokeStyle(1, color, 0.3);
    this.rangeCircle.setVisible(false);
  }

  getTower(): PlacedTower {
    return this.tower;
  }

  getPosition(): { x: number; y: number } {
    return { x: this.sprite.x, y: this.sprite.y };
  }

  showRange(visible: boolean): void {
    this.rangeCircle.setVisible(visible);
  }

  updateVisuals(): void {
    const levelData = TOWER_LEVELS[this.tower.type][this.tower.level - 1];
    this.sprite.setFillStyle(levelData.stats.color);
    this.rangeCircle.setRadius(levelData.stats.range);
    this.rangeCircle.setFillStyle(levelData.stats.color, 0.1);
    this.rangeCircle.setStrokeStyle(1, levelData.stats.color, 0.3);
  }

  destroy(): void {
    this.sprite.destroy();
    this.rangeCircle.destroy();
  }
}
