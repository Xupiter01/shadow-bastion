import Phaser from 'phaser';
import { PlacedTower } from '../logic/game-state';
import { TOWER_LEVELS } from '../data/tower-data';
import { getTowerAsset } from '../data/asset-registry';
import { computeAttackFlashScales } from './attack-flash';

export class TowerEntity {
  graphics: Phaser.GameObjects.Graphics;
  sprite?: Phaser.GameObjects.Image;
  rangeCircle: Phaser.GameObjects.Arc;
  private tower: PlacedTower;
  private towerX: number;
  private towerY: number;
  private attackTween: Phaser.Tweens.Tween | null = null;

  constructor(scene: Phaser.Scene, x: number, y: number, tower: PlacedTower) {
    this.tower = tower;
    this.towerX = x;
    this.towerY = y;
    this.graphics = scene.add.graphics();
    this.graphics.setDepth(10);

    const levelData = TOWER_LEVELS[tower.type][tower.level - 1];
    const color = levelData.stats.color;
    this.rangeCircle = scene.add.circle(x, y, levelData.stats.range, color, 0.1);
    this.rangeCircle.setStrokeStyle(1, color, 0.3);
    this.rangeCircle.setVisible(false);

    const asset = getTowerAsset(tower.type);
    const textureKey = asset.textureKey;
    if (scene.textures.exists(textureKey)) {
      this.sprite = scene.add.image(x, y, textureKey);
      this.sprite.setDepth(10);
      this.sprite.setDisplaySize(asset.displayWidth, asset.displayHeight);
      this.sprite.setOrigin(0.5);
      this.graphics.setVisible(false);
    }

    this.drawTower();
  }

  private drawTower(): void {
    if (this.sprite) return;

    this.graphics.clear();
    const x = this.towerX;
    const y = this.towerY;
    const levelData = TOWER_LEVELS[this.tower.type][this.tower.level - 1];
    const color = levelData.stats.color;
    const level = this.tower.level;

    const scale = 0.8 + level * 0.1;

    switch (this.tower.type) {
      case 'archer':
        this.drawArcherSilhouette(x, y, color, scale, level);
        break;
      case 'cannon':
        this.drawCannonSilhouette(x, y, color, scale, level);
        break;
      case 'frost':
        this.drawFrostSilhouette(x, y, color, scale, level);
        break;
    }

    if (level > 1) {
      this.graphics.fillStyle(0xf1c40f, 0.9);
      this.graphics.fillCircle(x + 8, y - 10, 4);
      this.graphics.lineStyle(1, 0x000000, 0.5);
      this.graphics.strokeCircle(x + 8, y - 10, 4);
    }
  }

  private drawArcherSilhouette(x: number, y: number, color: number, scale: number, level: number): void {
    this.graphics.fillStyle(0x2c2c3e, 1);
    this.graphics.fillRoundedRect(x - 6 * scale, y - 2, 12 * scale, 8 * scale, 2);

    this.graphics.fillStyle(color, 0.9);
    this.graphics.fillCircle(x, y - 6 * scale, 5 * scale);

    this.graphics.fillStyle(0x1a1a2e, 1);
    this.graphics.fillCircle(x, y - 8 * scale, 3 * scale);

    this.graphics.lineStyle(2, color, 0.8);
    this.graphics.beginPath();
    this.graphics.moveTo(x + 5 * scale, y - 4 * scale);
    this.graphics.lineTo(x + 12 * scale, y - 10 * scale);
    this.graphics.strokePath();

    this.graphics.fillStyle(color, 0.6);
    this.graphics.fillTriangle(
      x + 12 * scale, y - 12 * scale,
      x + 14 * scale, y - 8 * scale,
      x + 10 * scale, y - 8 * scale,
    );
  }

  private drawCannonSilhouette(x: number, y: number, color: number, scale: number, level: number): void {
    this.graphics.fillStyle(0x2c2c3e, 1);
    this.graphics.fillRoundedRect(x - 8 * scale, y, 16 * scale, 8 * scale, 2);

    this.graphics.fillStyle(color, 0.9);
    this.graphics.fillCircle(x, y - 4 * scale, 6 * scale);

    this.graphics.fillStyle(0x1a1a2e, 1);
    this.graphics.fillCircle(x, y - 6 * scale, 3.5 * scale);

    this.graphics.fillStyle(color, 0.85);
    this.graphics.fillRect(x + 5 * scale, y - 6 * scale, 10 * scale, 4 * scale);
    this.graphics.fillStyle(color, 0.7);
    this.graphics.fillCircle(x + 15 * scale, y - 4 * scale, 3 * scale);
  }

  private drawFrostSilhouette(x: number, y: number, color: number, scale: number, level: number): void {
    this.graphics.fillStyle(0x2c2c3e, 1);
    this.graphics.fillRoundedRect(x - 7 * scale, y - 1, 14 * scale, 9 * scale, 2);

    this.graphics.fillStyle(color, 0.9);
    this.graphics.fillCircle(x, y - 6 * scale, 5.5 * scale);

    this.graphics.fillStyle(0x1a1a2e, 1);
    this.graphics.fillCircle(x, y - 8 * scale, 3 * scale);

    this.graphics.lineStyle(1.5, 0xaeefff, 0.7);
    for (let i = 0; i < 3; i++) {
      const angle = (i * Math.PI * 2) / 3 - Math.PI / 2;
      const bx = x + Math.cos(angle) * 8 * scale;
      const by = (y - 6 * scale) + Math.sin(angle) * 8 * scale;
      this.graphics.beginPath();
      this.graphics.moveTo(x, y - 6 * scale);
      this.graphics.lineTo(bx, by);
      this.graphics.strokePath();
      this.graphics.fillStyle(0xaeefff, 0.5);
      this.graphics.fillCircle(bx, by, 1.5);
    }
  }

  getTower(): PlacedTower {
    return this.tower;
  }

  getPosition(): { x: number; y: number } {
    return { x: this.towerX, y: this.towerY };
  }

  showRange(visible: boolean): void {
    this.rangeCircle.setVisible(visible);
  }

  playAttackFlash(scene: Phaser.Scene): void {
    const target = this.sprite ?? this.graphics;
    const baseScaleX = target.scaleX;
    const baseScaleY = target.scaleY;
    const { flashScaleX, flashScaleY, restoreScaleX, restoreScaleY } =
      computeAttackFlashScales(baseScaleX, baseScaleY);
    target.setAlpha(1.3);
    scene.tweens.add({
      targets: target,
      scaleX: flashScaleX,
      scaleY: flashScaleY,
      duration: 60,
      yoyo: true,
      onYoyo: () => {
        target.setScale(restoreScaleX, restoreScaleY);
      },
    });
  }

  updateVisuals(): void {
    const levelData = TOWER_LEVELS[this.tower.type][this.tower.level - 1];
    this.rangeCircle.setRadius(levelData.stats.range);
    this.rangeCircle.setFillStyle(levelData.stats.color, 0.1);
    this.rangeCircle.setStrokeStyle(1, levelData.stats.color, 0.3);
    this.drawTower();
  }

  destroy(): void {
    this.graphics.destroy();
    this.sprite?.destroy();
    this.rangeCircle.destroy();
  }
}
