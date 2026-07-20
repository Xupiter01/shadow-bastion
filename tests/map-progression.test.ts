import { describe, it, expect } from 'vitest';
import {
  isBossMap,
  getChapter,
  canAccessMap,
  getNextMap,
} from '../src/logic/map-progression';

describe('MapProgression', () => {
  describe('isBossMap', () => {
    it('returns true for map 10', () => {
      expect(isBossMap(10)).toBe(true);
    });

    it('returns true for map 20', () => {
      expect(isBossMap(20)).toBe(true);
    });

    it('returns true for map 30', () => {
      expect(isBossMap(30)).toBe(true);
    });

    it('returns false for map 1', () => {
      expect(isBossMap(1)).toBe(false);
    });

    it('returns false for map 5', () => {
      expect(isBossMap(5)).toBe(false);
    });

    it('returns false for map 9', () => {
      expect(isBossMap(9)).toBe(false);
    });

    it('returns false for map 11', () => {
      expect(isBossMap(11)).toBe(false);
    });
  });

  describe('getChapter', () => {
    it('returns chapter 1 for maps 1-10', () => {
      expect(getChapter(1)).toBe(1);
      expect(getChapter(5)).toBe(1);
      expect(getChapter(10)).toBe(1);
    });

    it('returns chapter 2 for maps 11-20', () => {
      expect(getChapter(11)).toBe(2);
      expect(getChapter(15)).toBe(2);
      expect(getChapter(20)).toBe(2);
    });

    it('returns chapter 3 for maps 21-30', () => {
      expect(getChapter(30)).toBe(3);
    });
  });

  describe('canAccessMap', () => {
    it('map 1 is always accessible', () => {
      expect(canAccessMap(1, 0)).toBe(true);
    });

    it('map 2 requires map 1 completed', () => {
      expect(canAccessMap(2, 0)).toBe(false);
      expect(canAccessMap(2, 1)).toBe(true);
    });

    it('map 10 requires map 9 completed', () => {
      expect(canAccessMap(10, 8)).toBe(false);
      expect(canAccessMap(10, 9)).toBe(true);
    });

    it('map 11 requires map 10 (boss) completed', () => {
      expect(canAccessMap(11, 9)).toBe(false);
      expect(canAccessMap(11, 10)).toBe(true);
    });
  });

  describe('getNextMap', () => {
    it('returns 2 after completing map 1', () => {
      expect(getNextMap(1)).toBe(2);
    });

    it('returns 3 after completing map 2', () => {
      expect(getNextMap(2)).toBe(3);
    });

    it('returns null when no next map beyond registry', () => {
      expect(getNextMap(3)).toBeNull();
    });

    it('returns null for unregistered map id', () => {
      expect(getNextMap(999)).toBeNull();
    });
  });
});
