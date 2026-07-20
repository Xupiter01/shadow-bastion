import Phaser from 'phaser';
import { getAllAssetKeys } from '../data/asset-registry';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload(): void {
    const keys = getAllAssetKeys();
    for (const key of keys) {
      const textureKey = key.replace('assets/characters/', '').replace('.png', '');
      this.load.image(textureKey, key);
    }
  }

  create(): void {
    this.scene.start('Menu');
  }
}
