import { describe, it, expect } from 'vitest';
import { TowerCooldownTracker } from '../src/logic/combat-timing';

describe('TowerCooldownTracker', () => {
  it('tower can fire immediately when never fired', () => {
    const tracker = new TowerCooldownTracker();
    expect(tracker.canFire(1, 0)).toBe(true);
  });

  it('tower cannot fire again before cooldown expires', () => {
    const tracker = new TowerCooldownTracker();
    tracker.recordFire(1, 500, 1);
    expect(tracker.canFire(1, 1200)).toBe(false);
  });

  it('tower can fire after cooldown expires', () => {
    const tracker = new TowerCooldownTracker();
    tracker.recordFire(1, 500, 1);
    expect(tracker.canFire(1, 1600)).toBe(true);
  });

  it('different towers have independent cooldowns', () => {
    const tracker = new TowerCooldownTracker();
    tracker.recordFire(1, 500, 1);
    expect(tracker.canFire(2, 100)).toBe(true);
  });

  it('fireRate of 1 means 1000ms cooldown', () => {
    const tracker = new TowerCooldownTracker();
    tracker.recordFire(1, 0, 1);
    expect(tracker.canFire(1, 500)).toBe(false);
    expect(tracker.canFire(1, 999)).toBe(false);
    expect(tracker.canFire(1, 1000)).toBe(true);
  });

  it('fireRate of 2 means 500ms cooldown', () => {
    const tracker = new TowerCooldownTracker();
    const cooldownMs = 1000 / 2;
    tracker.recordFire(1, 0, 2);
    expect(tracker.canFire(1, cooldownMs - 1)).toBe(false);
    expect(tracker.canFire(1, cooldownMs)).toBe(true);
  });

  it('multiple towers each fire independently', () => {
    const tracker = new TowerCooldownTracker();
    tracker.recordFire(1, 0, 1);
    tracker.recordFire(2, 0, 1);
    expect(tracker.canFire(1, 500)).toBe(false);
    expect(tracker.canFire(2, 500)).toBe(false);
    expect(tracker.canFire(1, 1000)).toBe(true);
    expect(tracker.canFire(2, 1000)).toBe(true);
  });

  it('re-firing resets cooldown from new timestamp', () => {
    const tracker = new TowerCooldownTracker();
    tracker.recordFire(1, 0, 1);
    tracker.recordFire(1, 1000, 1);
    expect(tracker.canFire(1, 1500)).toBe(false);
    expect(tracker.canFire(1, 2000)).toBe(true);
  });
});
