import { describe, it, expect } from 'vitest';
import { getMap, getAllMaps, getTotalMaps } from '../src/data/maps/map-registry';

describe('MapRegistry', () => {
  it('returns map 1 from the registry', () => {
    const map = getMap(1);
    expect(map).toBeDefined();
    expect(map!.id).toBe(1);
  });

  it('returns map 2 from the registry', () => {
    const map = getMap(2);
    expect(map).toBeDefined();
    expect(map!.id).toBe(2);
  });

  it('returns map 3 from the registry', () => {
    const map = getMap(3);
    expect(map).toBeDefined();
    expect(map!.id).toBe(3);
  });

  it('returns undefined for unregistered map id', () => {
    expect(getMap(999)).toBeUndefined();
  });

  it('returns undefined for map id 0', () => {
    expect(getMap(0)).toBeUndefined();
  });

  it('returns undefined for negative map id', () => {
    expect(getMap(-1)).toBeUndefined();
  });

  it('getAllMaps returns at least 3 maps', () => {
    const maps = getAllMaps();
    expect(maps.length).toBeGreaterThanOrEqual(3);
  });

  it('getTotalMaps matches getAllMaps length', () => {
    expect(getTotalMaps()).toBe(getAllMaps().length);
  });

  it('all registered maps have positive integer ids', () => {
    const maps = getAllMaps();
    for (const map of maps) {
      expect(map.id).toBeGreaterThan(0);
      expect(Number.isInteger(map.id)).toBe(true);
    }
  });
});
