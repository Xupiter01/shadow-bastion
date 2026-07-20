import { describe, it, expect } from 'vitest';
import { getSelectableMaps } from '../src/logic/map-progression';

describe('getSelectableMaps', () => {
  it('returns all 3 maps', () => {
    const maps = getSelectableMaps(0);
    expect(maps).toHaveLength(3);
  });

  it('map 1 is always accessible', () => {
    const maps = getSelectableMaps(0);
    const map1 = maps.find(m => m.mapId === 1);
    expect(map1?.accessible).toBe(true);
  });

  it('map 2 locked when nothing completed', () => {
    const maps = getSelectableMaps(0);
    const map2 = maps.find(m => m.mapId === 2);
    expect(map2?.accessible).toBe(false);
  });

  it('map 2 accessible after map 1 completed', () => {
    const maps = getSelectableMaps(1);
    const map2 = maps.find(m => m.mapId === 2);
    expect(map2?.accessible).toBe(true);
  });

  it('map 3 locked when only map 1 completed', () => {
    const maps = getSelectableMaps(1);
    const map3 = maps.find(m => m.mapId === 3);
    expect(map3?.accessible).toBe(false);
  });

  it('map 3 accessible after map 2 completed', () => {
    const maps = getSelectableMaps(2);
    const map3 = maps.find(m => m.mapId === 3);
    expect(map3?.accessible).toBe(true);
  });
});
