import { describe, it, expect } from 'vitest';
import { PLACEMENT_SLOTS, PATH_POINTS } from '../src/data/map-data';

describe('Mobile Layout', () => {
  it('all placement slots are within 360x640 bounds', () => {
    for (const slot of PLACEMENT_SLOTS) {
      expect(slot.x).toBeGreaterThanOrEqual(0);
      expect(slot.x).toBeLessThanOrEqual(360);
      expect(slot.y).toBeGreaterThanOrEqual(0);
      expect(slot.y).toBeLessThanOrEqual(640);
    }
  });

  it('path points are within bounds', () => {
    for (const pt of PATH_POINTS) {
      expect(pt.x).toBeGreaterThanOrEqual(-50);
      expect(pt.x).toBeLessThanOrEqual(410);
      expect(pt.y).toBeGreaterThanOrEqual(-50);
      expect(pt.y).toBeLessThanOrEqual(690);
    }
  });

  it('has exactly 8 placement slots', () => {
    expect(PLACEMENT_SLOTS).toHaveLength(8);
  });

  it('path has at least 10 points for winding layout', () => {
    expect(PATH_POINTS.length).toBeGreaterThanOrEqual(10);
  });
});
