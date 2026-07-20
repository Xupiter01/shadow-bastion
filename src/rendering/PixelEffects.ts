import Phaser from 'phaser';

export function createMuzzleFlash(scene: Phaser.Scene, x: number, y: number, color: number): void {
  const gfx = scene.add.graphics();
  gfx.setDepth(60);
  gfx.fillStyle(color, 0.9);
  gfx.fillCircle(0, 0, 6);
  gfx.fillStyle(0xffffff, 0.8);
  gfx.fillCircle(0, 0, 3);
  gfx.setPosition(x, y);

  scene.tweens.add({
    targets: gfx,
    alpha: 0,
    scaleX: 0.3,
    scaleY: 0.3,
    duration: 80,
    onComplete: () => gfx.destroy(),
  });
}

export function createHitSpark(scene: Phaser.Scene, x: number, y: number, color: number): void {
  const gfx = scene.add.graphics();
  gfx.setDepth(55);
  gfx.fillStyle(color, 0.9);
  gfx.fillCircle(0, 0, 5);
  gfx.fillStyle(0xffffff, 0.7);
  gfx.fillCircle(0, 0, 2);
  gfx.setPosition(x, y);

  scene.tweens.add({
    targets: gfx,
    alpha: 0,
    scaleX: 2,
    scaleY: 2,
    duration: 100,
    onComplete: () => gfx.destroy(),
  });

  const ring = scene.add.graphics();
  ring.setDepth(54);
  ring.lineStyle(1.5, color, 0.6);
  ring.strokeCircle(0, 0, 3);
  ring.setPosition(x, y);

  scene.tweens.add({
    targets: ring,
    alpha: 0,
    scaleX: 3,
    scaleY: 3,
    duration: 150,
    onComplete: () => ring.destroy(),
  });

  for (let i = 0; i < 4; i++) {
    const angle = (Math.PI * 2 * i) / 4 + Math.random() * 0.5;
    const spark = scene.add.graphics();
    spark.setDepth(56);
    spark.fillStyle(color, 0.8);
    spark.fillCircle(0, 0, 1.5);
    spark.setPosition(x, y);

    scene.tweens.add({
      targets: spark,
      x: x + Math.cos(angle) * 12,
      y: y + Math.sin(angle) * 12,
      alpha: 0,
      duration: 100 + Math.random() * 60,
      onComplete: () => spark.destroy(),
    });
  }
}

export function createCannonExplosion(scene: Phaser.Scene, x: number, y: number): void {
  const gfx = scene.add.graphics();
  gfx.setDepth(55);
  gfx.fillStyle(0xff6b6b, 0.8);
  gfx.fillCircle(0, 0, 10);
  gfx.fillStyle(0xffaa44, 0.7);
  gfx.fillCircle(0, 0, 6);
  gfx.fillStyle(0xffffff, 0.6);
  gfx.fillCircle(0, 0, 3);
  gfx.setPosition(x, y);

  scene.tweens.add({
    targets: gfx,
    alpha: 0,
    scaleX: 2.5,
    scaleY: 2.5,
    duration: 200,
    onComplete: () => gfx.destroy(),
  });

  const ring = scene.add.graphics();
  ring.setDepth(54);
  ring.lineStyle(2, 0xff6b6b, 0.5);
  ring.strokeCircle(0, 0, 5);
  ring.setPosition(x, y);

  scene.tweens.add({
    targets: ring,
    alpha: 0,
    scaleX: 5,
    scaleY: 5,
    duration: 250,
    onComplete: () => ring.destroy(),
  });
}

export function createFrostImpact(scene: Phaser.Scene, x: number, y: number): void {
  const gfx = scene.add.graphics();
  gfx.setDepth(55);
  gfx.fillStyle(0x7ec8e3, 0.7);
  gfx.fillCircle(0, 0, 8);
  gfx.fillStyle(0xaeefff, 0.6);
  gfx.fillCircle(0, 0, 4);
  gfx.setPosition(x, y);

  scene.tweens.add({
    targets: gfx,
    alpha: 0,
    scaleX: 1.8,
    scaleY: 1.8,
    duration: 180,
    onComplete: () => gfx.destroy(),
  });

  for (let i = 0; i < 3; i++) {
    const angle = (Math.PI * 2 * i) / 3;
    const crystal = scene.add.graphics();
    crystal.setDepth(56);
    crystal.fillStyle(0xaeefff, 0.8);
    crystal.fillTriangle(0, -3, -2, 2, 2, 2);
    crystal.setPosition(x + Math.cos(angle) * 6, y + Math.sin(angle) * 6);

    scene.tweens.add({
      targets: crystal,
      alpha: 0,
      y: crystal.y - 8,
      duration: 200,
      onComplete: () => crystal.destroy(),
    });
  }
}

export function createFloatingText(
  scene: Phaser.Scene,
  x: number,
  y: number,
  text: string,
  color: string = '#ff4444',
  fontSize: number = 10,
): void {
  const txt = scene.add.text(x, y, text, {
    fontSize: `${fontSize}px`,
    color,
    fontFamily: 'monospace',
    fontStyle: 'bold',
    stroke: '#000000',
    strokeThickness: 2,
  }).setOrigin(0.5).setDepth(70);

  scene.tweens.add({
    targets: txt,
    y: y - 20,
    alpha: 0,
    duration: 600,
    ease: 'Cubic.easeOut',
    onComplete: () => txt.destroy(),
  });
}

export function createHitEffect(scene: Phaser.Scene, x: number, y: number, color: number): void {
  createHitSpark(scene, x, y, color);
}

export function createSlowEffect(scene: Phaser.Scene, x: number, y: number): void {
  const circle = scene.add.graphics();
  circle.setDepth(54);
  circle.lineStyle(1.5, 0x7ec8e3, 0.5);
  circle.strokeCircle(0, 0, 6);
  circle.setPosition(x, y);

  scene.tweens.add({
    targets: circle,
    alpha: 0,
    scaleX: 2,
    scaleY: 2,
    duration: 250,
    onComplete: () => circle.destroy(),
  });
}
