import { describe, it, expect } from 'vitest';
import {
  getTowerAsset, getEnemyAsset, getAllAssetKeys,
  isTowerType, isEnemyType,
} from '../src/data/asset-registry';
import type { TowerType } from '../src/data/tower-data';
import type { EnemyType } from '../src/data/enemy-data';

const ALL_TOWER_TYPES: TowerType[] = ['archer', 'cannon', 'frost'];
const ALL_ENEMY_TYPES: EnemyType[] = ['shade', 'brute', 'wraith', 'captain'];

describe('AssetRegistry', () => {
  describe('tower assets', () => {
    for (const type of ALL_TOWER_TYPES) {
      it(`has a valid entry for ${type}`, () => {
        const asset = getTowerAsset(type);
        expect(asset.path).toBe(`assets/characters/${type}.png`);
        expect(asset.displayWidth).toBeGreaterThan(0);
        expect(asset.displayHeight).toBeGreaterThan(0);
      });
    }
  });

  describe('enemy assets', () => {
    for (const type of ALL_ENEMY_TYPES) {
      it(`has a valid entry for ${type}`, () => {
        const asset = getEnemyAsset(type);
        expect(asset.path).toMatch(/^assets\/characters\/.+\.png$/);
        expect(asset.displayWidth).toBeGreaterThan(0);
        expect(asset.displayHeight).toBeGreaterThan(0);
      });
    }
  });

  describe('shadow-captain path', () => {
    it('uses hyphenated filename for captain', () => {
      const asset = getEnemyAsset('captain');
      expect(asset.path).toBe('assets/characters/shadow-captain.png');
    });
  });

  describe('size hierarchy', () => {
    it('captain is larger than brute', () => {
      const captain = getEnemyAsset('captain');
      const brute = getEnemyAsset('brute');
      expect(captain.displayWidth).toBeGreaterThan(brute.displayWidth);
    });

    it('brute is larger than shade and wraith', () => {
      const brute = getEnemyAsset('brute');
      const shade = getEnemyAsset('shade');
      const wraith = getEnemyAsset('wraith');
      expect(brute.displayWidth).toBeGreaterThan(shade.displayWidth);
      expect(brute.displayWidth).toBeGreaterThan(wraith.displayWidth);
    });

    it('shade is smallest enemy', () => {
      const shade = getEnemyAsset('shade');
      const others = ['brute', 'wraith', 'captain'] as EnemyType[];
      for (const other of others) {
        expect(shade.displayWidth).toBeLessThanOrEqual(getEnemyAsset(other).displayWidth);
      }
    });
  });

  describe('getAllAssetKeys', () => {
    it('returns 7 unique paths (3 towers + 4 enemies)', () => {
      const keys = getAllAssetKeys();
      expect(keys.length).toBe(7);
      expect(new Set(keys).size).toBe(7);
    });

    it('all paths end with .png', () => {
      for (const key of getAllAssetKeys()) {
        expect(key).toMatch(/\.png$/);
      }
    });
  });

  describe('type guards', () => {
    it('isTowerType recognizes valid types', () => {
      expect(isTowerType('archer')).toBe(true);
      expect(isTowerType('cannon')).toBe(true);
      expect(isTowerType('frost')).toBe(true);
    });

    it('isTowerType rejects invalid types', () => {
      expect(isTowerType('shade')).toBe(false);
      expect(isTowerType('')).toBe(false);
      expect(isTowerType('Archer')).toBe(false);
    });

    it('isEnemyType recognizes valid types', () => {
      expect(isEnemyType('shade')).toBe(true);
      expect(isEnemyType('brute')).toBe(true);
      expect(isEnemyType('wraith')).toBe(true);
      expect(isEnemyType('captain')).toBe(true);
    });

    it('isEnemyType rejects invalid types', () => {
      expect(isEnemyType('archer')).toBe(false);
      expect(isEnemyType('')).toBe(false);
    });
  });
});
