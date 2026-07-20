import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('Menu');
  }

  create(): void {
    this.add.rectangle(180, 280, 300, 120, 0x1a1a2e).setStrokeStyle(2, 0xc0a050);
    this.add.text(180, 260, 'Shadow Kingdom', {
      fontSize: '20px', color: '#c0a050', fontFamily: 'monospace',
    }).setOrigin(0.5);
    this.add.text(180, 290, 'BASTION', {
      fontSize: '28px', color: '#e0c070', fontFamily: 'monospace',
    }).setOrigin(0.5);

    const startBtn = this.add.rectangle(180, 420, 160, 50, 0x34495e)
      .setStrokeStyle(2, 0x5dade2)
      .setInteractive();
    this.add.text(180, 420, 'START', {
      fontSize: '18px', color: '#ecf0f1', fontFamily: 'monospace',
    }).setOrigin(0.5);

    startBtn.on('pointerover', () => startBtn.setFillStyle(0x4a6fa5));
    startBtn.on('pointerout', () => startBtn.setFillStyle(0x34495e));
    startBtn.on('pointerdown', () => {
      this.scene.start('Game', { mapId: 1 });
    });
  }
}
