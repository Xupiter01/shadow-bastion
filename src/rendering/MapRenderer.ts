import Phaser from 'phaser';
import { PATH_POINTS, PLACEMENT_SLOTS, GATE_POSITION } from '../data/map-data';

export function drawPath(graphics: Phaser.GameObjects.Graphics): void {
  graphics.lineStyle(8, 0x1a1a3e, 1);
  graphics.beginPath();
  graphics.moveTo(PATH_POINTS[0].x, PATH_POINTS[0].y);
  for (let i = 1; i < PATH_POINTS.length; i++) {
    graphics.lineTo(PATH_POINTS[i].x, PATH_POINTS[i].y);
  }
  graphics.strokePath();

  graphics.lineStyle(3, 0x2c3e50, 0.6);
  graphics.beginPath();
  graphics.moveTo(PATH_POINTS[0].x, PATH_POINTS[0].y);
  for (let i = 1; i < PATH_POINTS.length; i++) {
    graphics.lineTo(PATH_POINTS[i].x, PATH_POINTS[i].y);
  }
  graphics.strokePath();
}

export function drawPlacementSlots(scene: Phaser.Scene): Phaser.GameObjects.Arc[] {
  return PLACEMENT_SLOTS.map(slot => {
    const circle = scene.add.circle(slot.x, slot.y, 14, 0x2ecc71, 0.15);
    circle.setStrokeStyle(2, 0x2ecc71, 0.6);
    return circle;
  });
}

export function drawGate(scene: Phaser.Scene): void {
  scene.add.rectangle(GATE_POSITION.x, GATE_POSITION.y, 60, 16, 0xc0392b)
    .setStrokeStyle(2, 0xe74c3c);
  scene.add.text(GATE_POSITION.x, GATE_POSITION.y, 'GATE', {
    fontSize: '9px', color: '#fff', fontFamily: 'monospace',
  }).setOrigin(0.5);
}
