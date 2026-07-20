import Phaser from 'phaser';
import { updateHighestCompleted } from '../logic/map-progression';

export class ResultScene extends Phaser.Scene {
  constructor() {
    super('Result');
  }

  create(data: { won: boolean; mapId?: number }): void {
    const won = data?.won ?? false;
    const mapId = data?.mapId ?? 1;

    if (won) {
      const prev = this.registry.get('highestCompleted') ?? 0;
      this.registry.set('highestCompleted', updateHighestCompleted(prev, mapId, true));
    }

    this.add.rectangle(180, 320, 360, 640, 0x0a0a1a);

    if (won) {
      this.add.text(180, 220, 'VICTORY!', {
        fontSize: '36px', color: '#27ae60', fontFamily: 'monospace',
      }).setOrigin(0.5);
      this.add.text(180, 270, 'The Shadow Kingdom stands!', {
        fontSize: '14px', color: '#bdc3c7', fontFamily: 'monospace',
      }).setOrigin(0.5);
    } else {
      this.add.text(180, 220, 'DEFEATED', {
        fontSize: '36px', color: '#c0392b', fontFamily: 'monospace',
      }).setOrigin(0.5);
      this.add.text(180, 270, 'The shadows have fallen...', {
        fontSize: '14px', color: '#bdc3c7', fontFamily: 'monospace',
      }).setOrigin(0.5);
    }

    const restartBtn = this.add.rectangle(180, 380, 160, 50, 0x34495e)
      .setStrokeStyle(2, 0x5dade2)
      .setInteractive();
    this.add.text(180, 380, 'RESTART', {
      fontSize: '18px', color: '#ecf0f1', fontFamily: 'monospace',
    }).setOrigin(0.5);

    restartBtn.on('pointerover', () => restartBtn.setFillStyle(0x4a6fa5));
    restartBtn.on('pointerout', () => restartBtn.setFillStyle(0x34495e));
    restartBtn.on('pointerdown', () => {
      this.scene.start('MapSelect');
    });
  }
}
