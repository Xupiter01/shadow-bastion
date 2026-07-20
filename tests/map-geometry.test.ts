import { describe, it, expect } from 'vitest';
import { getMap, getAllMaps } from '../src/data/maps/map-registry';
import type { MapDefinition } from '../src/data/maps/types';

function slotOverlapsRoad(slot: { x: number; y: number }, road: { x: number; y: number }[]): boolean {
  const threshold = 20;
  for (const pt of road) {
    const dist = Math.sqrt((slot.x - pt.x) ** 2 + (slot.y - pt.y) ** 2);
    if (dist < threshold) return true;
  }
  return false;
}

function slotOverlapsCastle(slot: { x: number; y: number }, castle: { x: number; y: number }): boolean {
  const dist = Math.sqrt((slot.x - castle.x) ** 2 + (slot.y - castle.y) ** 2);
  return dist < 30;
}

function boundingBox(map: MapDefinition) {
  const xs = map.road.map(p => p.x);
  const ys = map.road.map(p => p.y);
  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
  };
}

describe('MapGeometry', () => {
  const maps = [1, 2, 3];

  for (const id of maps) {
    describe(`Map ${id}`, () => {
      let map: MapDefinition;

      it('exists in registry', () => {
        map = getMap(id)!;
        expect(map).toBeDefined();
      });

      it('has at least 6 road points', () => {
        map = getMap(id)!;
        expect(map.road.length).toBeGreaterThanOrEqual(6);
      });

      it('has a castle/gate position', () => {
        map = getMap(id)!;
        expect(map.castle).toBeDefined();
        expect(typeof map.castle.x).toBe('number');
        expect(typeof map.castle.y).toBe('number');
      });

      it('has placement slots', () => {
        map = getMap(id)!;
        expect(map.slots.length).toBeGreaterThan(0);
      });

      it('has unique slot ids', () => {
        map = getMap(id)!;
        const ids = map.slots.map(s => s.id);
        expect(new Set(ids).size).toBe(ids.length);
      });

      it('no slot overlaps the road', () => {
        map = getMap(id)!;
        for (const slot of map.slots) {
          expect(slotOverlapsRoad(slot, map.road)).toBe(false);
        }
      });

      it('no slot overlaps the castle', () => {
        map = getMap(id)!;
        for (const slot of map.slots) {
          expect(slotOverlapsCastle(slot, map.castle)).toBe(false);
        }
      });

      it('road is inside canvas bounds (0-360 x -40-660)', () => {
        map = getMap(id)!;
        const bb = boundingBox(map);
        expect(bb.minX).toBeGreaterThanOrEqual(0);
        expect(bb.maxX).toBeLessThanOrEqual(360);
        expect(bb.minY).toBeGreaterThanOrEqual(-40);
        expect(bb.maxY).toBeLessThanOrEqual(660);
      });

      it('road endpoints are distinct (winding, not degenerate)', () => {
        map = getMap(id)!;
        const first = map.road[0];
        const last = map.road[map.road.length - 1];
        const dist = Math.sqrt((first.x - last.x) ** 2 + (first.y - last.y) ** 2);
        expect(dist).toBeGreaterThan(100);
      });

      it('has a numeric theme', () => {
        map = getMap(id)!;
        expect(typeof map.theme).toBe('string');
        expect(map.theme.length).toBeGreaterThan(0);
      });
    });
  }

  describe('cross-map diversity', () => {
    it('maps 1, 2, 3 have different road points', () => {
      const m1 = getMap(1)!;
      const m2 = getMap(2)!;
      const m3 = getMap(3)!;
      const roadsDiffer = (a: MapDefinition, b: MapDefinition) =>
        JSON.stringify(a.road) !== JSON.stringify(b.road);
      expect(roadsDiffer(m1, m2)).toBe(true);
      expect(roadsDiffer(m1, m3)).toBe(true);
      expect(roadsDiffer(m2, m3)).toBe(true);
    });

    it('maps 1, 2, 3 have different castle positions', () => {
      const m1 = getMap(1)!;
      const m2 = getMap(2)!;
      const m3 = getMap(3)!;
      const pos = (m: MapDefinition) => `${m.castle.x},${m.castle.y}`;
      expect(pos(m1)).not.toBe(pos(m2));
      expect(pos(m1)).not.toBe(pos(m3));
      expect(pos(m2)).not.toBe(pos(m3));
    });
  });
});
