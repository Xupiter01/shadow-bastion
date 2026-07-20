import Phaser from 'phaser';

export function createHitEffect(scene: Phaser.Scene, x: number, y: number, color: number): void {
  const circle = scene.add.circle(x, y, 8, color, 0.6);
  scene.tweens.add({
    targets: circle,
    alpha: 0,
    scale: 2,
    duration: 200,
    onComplete: () => circle.destroy(),
  });
}

export function createSlowEffect(scene: Phaser.Scene, x: number, y: number): void {
  const circle = scene.add.circle(x, y, 6, 0x3498db, 0.4);
  scene.tweens.add({
    targets: circle,
    alpha: 0,
    scale: 1.5,
    duration: 300,
    onComplete: () => circle.destroy(),
  });
}
