import Phaser from 'phaser';
import { getSelectableMaps } from '../logic/map-progression';
import { getMap } from '../data/maps/map-registry';

export class MapSelectScene extends Phaser.Scene {
  private highestCompleted = 0;

  constructor() {
    super('MapSelect');
  }

  create(): void {
    this.highestCompleted = this.registry.get('highestCompleted') ?? 0;

    this.add.text(180, 50, 'SELECT MAP', {
      fontSize: '22px', color: '#c0a050', fontFamily: 'monospace',
    }).setOrigin(0.5);

    const selectable = getSelectableMaps(this.highestCompleted);

    selectable.forEach((entry, i) => {
      const y = 140 + i * 150;
      const map = getMap(entry.mapId);
      const canPlay = entry.accessible;

      const bg = this.add.rectangle(180, y, 300, 120, canPlay ? 0x1a1a2e : 0x111118)
        .setStrokeStyle(2, canPlay ? 0xc0a050 : 0x333340);

      if (canPlay) {
        bg.setInteractive();
        bg.on('pointerover', () => bg.setFillStyle(0x2a2a3e));
        bg.on('pointerout', () => bg.setFillStyle(0x1a1a2e));
        bg.on('pointerdown', () => {
          this.scene.start('Game', { mapId: entry.mapId });
        });
      }

      this.add.text(180, y - 25, `Map ${entry.mapId}`, {
        fontSize: '16px', color: canPlay ? '#e0c070' : '#555', fontFamily: 'monospace',
      }).setOrigin(0.5);

      this.add.text(180, y + 5, entry.theme, {
        fontSize: '12px', color: canPlay ? '#bdc3c7' : '#444', fontFamily: 'monospace',
      }).setOrigin(0.5);

      if (map) {
        this.add.text(180, y + 25, `${map.slots.length} slots`, {
          fontSize: '10px', color: canPlay ? '#7f8c8d' : '#333', fontFamily: 'monospace',
        }).setOrigin(0.5);
      }

      if (!canPlay) {
        this.add.text(180, y + 45, 'LOCKED', {
          fontSize: '10px', color: '#c0392b', fontFamily: 'monospace',
        }).setOrigin(0.5);
      }
    });

    const backBtn = this.add.rectangle(180, 590, 120, 36, 0x34495e)
      .setStrokeStyle(2, 0x5dade2)
      .setInteractive();
    this.add.text(180, 590, 'BACK', {
      fontSize: '14px', color: '#ecf0f1', fontFamily: 'monospace',
    }).setOrigin(0.5);

    backBtn.on('pointerover', () => backBtn.setFillStyle(0x4a6fa5));
    backBtn.on('pointerout', () => backBtn.setFillStyle(0x34495e));
    backBtn.on('pointerdown', () => {
      this.scene.start('Menu');
    });
  }
}
