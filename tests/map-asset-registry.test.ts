import { describe, it, expect } from 'vitest';
import {
  getMapBackgroundPath,
  getMapBackgroundKey,
  getAllMapBackgrounds,
} from '../src/data/map-asset-registry';

describe('MapAssetRegistry', () => {
  describe('getMapBackgroundPath', () => {
    it('returns the background path for map 1', () => {
      const path = getMapBackgroundPath(1);
      expect(path).toBe('assets/maps/map-01-bg.png');
    });

    it('returns undefined for an unregistered map', () => {
      expect(getMapBackgroundPath(999)).toBeUndefined();
    });

    it('returns undefined for map 0', () => {
      expect(getMapBackgroundPath(0)).toBeUndefined();
    });

    it('returns the background path for map 2', () => {
      expect(getMapBackgroundPath(2)).toBe('assets/maps/map-02-bg.png');
    });

    it('returns the background path for map 3', () => {
      expect(getMapBackgroundPath(3)).toBe('assets/maps/map-03-bg.png');
    });
  });

  describe('getMapBackgroundKey', () => {
    it('returns the texture key for map 1', () => {
      const key = getMapBackgroundKey(1);
      expect(key).toBe('map-01-bg');
    });

    it('returns the texture key for map 2', () => {
      expect(getMapBackgroundKey(2)).toBe('map-02-bg');
    });

    it('returns the texture key for map 3', () => {
      expect(getMapBackgroundKey(3)).toBe('map-03-bg');
    });

    it('returns undefined for an unregistered map', () => {
      expect(getMapBackgroundKey(999)).toBeUndefined();
    });
  });

  describe('getAllMapBackgrounds', () => {
    it('returns entries only for maps with backgrounds', () => {
      const entries = getAllMapBackgrounds();
      expect(entries.length).toBe(3);
      expect(entries.map(e => e.mapId).sort()).toEqual([1, 2, 3]);
    });

    it('entries have valid paths (GitHub Pages-relative, no leading slash)', () => {
      const entries = getAllMapBackgrounds();
      for (const entry of entries) {
        expect(entry.path).toMatch(/^assets\/maps\/.+\.png$/);
        expect(entry.path).not.toMatch(/^\//);
      }
    });

    it('entries have valid texture keys', () => {
      const entries = getAllMapBackgrounds();
      for (const entry of entries) {
        expect(entry.textureKey).toMatch(/^map-\d+-bg$/);
      }
    });
  });

  describe('path format', () => {
    it('all background paths are GitHub Pages-relative', () => {
      const entries = getAllMapBackgrounds();
      for (const entry of entries) {
        expect(entry.path.startsWith('/')).toBe(false);
        expect(entry.path.startsWith('http')).toBe(false);
      }
    });
  });
});
