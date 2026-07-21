import Phaser from 'phaser';
import { getAllAssetKeys } from '../data/asset-registry';
import { getAllMapBackgrounds } from '../data/map-asset-registry';

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

    for (const bg of getAllMapBackgrounds()) {
      this.load.image(bg.textureKey, bg.path);
    }
  }

  create(): void {
    this.scene.start('Menu');
  }
}
