import { describe, it, expect } from 'vitest';
import {
  createPlacementMode,
  selectSlot,
  selectTowerType,
  cancelPlacement,
  isSlotOccupied,
  getTowerOptions,
  getPlacementFeedback,
  type PlacementMode,
  type TowerOption,
} from '../src/logic/placement-policy';
import type { PlacedTower } from '../src/logic/game-state';

function makePlacedTower(overrides: Partial<PlacedTower> = {}): PlacedTower {
  return {
    id: 0,
    slotId: 0,
    type: 'archer',
    level: 1,
    totalCost: 50,
    ...overrides,
  };
}

describe('placement-policy', () => {
  describe('createPlacementMode', () => {
    it('returns idle mode', () => {
      const mode = createPlacementMode();
      expect(mode).toEqual({ kind: 'idle' });
    });
  });

  describe('selectSlot', () => {
    it('transitions from idle to selecting_tower with slotId', () => {
      const mode = selectSlot(createPlacementMode(), 3);
      expect(mode).toEqual({ kind: 'selecting_tower', slotId: 3 });
    });

    it('ignores selection when already selecting_tower', () => {
      const first = selectSlot(createPlacementMode(), 2);
      const second = selectSlot(first, 5);
      expect(second).toEqual({ kind: 'selecting_tower', slotId: 2 });
    });

    it('ignores selection when confirming_placement', () => {
      const mode: PlacementMode = { kind: 'confirming_placement', slotId: 1, towerType: 'archer' };
      const result = selectSlot(mode, 9);
      expect(result).toEqual({ kind: 'confirming_placement', slotId: 1, towerType: 'archer' });
    });
  });

  describe('selectTowerType', () => {
    it('transitions from selecting_tower to confirming_placement', () => {
      const selecting = selectSlot(createPlacementMode(), 4);
      const confirming = selectTowerType(selecting, 'cannon');
      expect(confirming).toEqual({ kind: 'confirming_placement', slotId: 4, towerType: 'cannon' });
    });

    it('ignores selection when idle', () => {
      const mode = selectTowerType(createPlacementMode(), 'frost');
      expect(mode).toEqual({ kind: 'idle' });
    });

    it('ignores selection when already confirming_placement', () => {
      const mode: PlacementMode = { kind: 'confirming_placement', slotId: 1, towerType: 'archer' };
      const result = selectTowerType(mode, 'cannon');
      expect(result).toEqual({ kind: 'confirming_placement', slotId: 1, towerType: 'archer' });
    });
  });

  describe('cancelPlacement', () => {
    it('returns to idle from selecting_tower', () => {
      const selecting = selectSlot(createPlacementMode(), 2);
      expect(cancelPlacement(selecting)).toEqual({ kind: 'idle' });
    });

    it('returns to idle from confirming_placement', () => {
      const confirming: PlacementMode = { kind: 'confirming_placement', slotId: 1, towerType: 'frost' };
      expect(cancelPlacement(confirming)).toEqual({ kind: 'idle' });
    });

    it('returns to idle from idle (no-op)', () => {
      expect(cancelPlacement(createPlacementMode())).toEqual({ kind: 'idle' });
    });
  });

  describe('isSlotOccupied', () => {
    it('returns false when no towers exist', () => {
      expect(isSlotOccupied(0, [])).toBe(false);
    });

    it('returns true when a tower occupies the slot', () => {
      const towers = [makePlacedTower({ slotId: 3 })];
      expect(isSlotOccupied(3, towers)).toBe(true);
    });

    it('returns false for a different slot', () => {
      const towers = [makePlacedTower({ slotId: 1 })];
      expect(isSlotOccupied(2, towers)).toBe(false);
    });
  });

  describe('getTowerOptions', () => {
    it('returns empty array when not in selecting_tower mode', () => {
      expect(getTowerOptions(createPlacementMode(), 100, [])).toEqual([]);
    });

    it('returns three tower options with correct costs and labels', () => {
      const selecting = selectSlot(createPlacementMode(), 0);
      const options = getTowerOptions(selecting, 100, []);
      expect(options).toHaveLength(3);
      expect(options[0].type).toBe('archer');
      expect(options[0].cost).toBe(50);
      expect(options[0].label).toBe('Archer');
      expect(options[1].type).toBe('cannon');
      expect(options[1].cost).toBe(100);
      expect(options[2].type).toBe('frost');
      expect(options[2].cost).toBe(75);
    });

    it('marks canAfford false when essence is below cost', () => {
      const selecting = selectSlot(createPlacementMode(), 0);
      const options = getTowerOptions(selecting, 30, []);
      expect(options.find(o => o.type === 'archer')!.canAfford).toBe(false);
      expect(options.find(o => o.type === 'cannon')!.canAfford).toBe(false);
      expect(options.find(o => o.type === 'frost')!.canAfford).toBe(false);
    });

    it('marks canAfford true for affordable towers', () => {
      const selecting = selectSlot(createPlacementMode(), 0);
      const options = getTowerOptions(selecting, 80, []);
      expect(options.find(o => o.type === 'archer')!.canAfford).toBe(true);
      expect(options.find(o => o.type === 'cannon')!.canAfford).toBe(false);
      expect(options.find(o => o.type === 'frost')!.canAfford).toBe(true);
    });
  });

  describe('getPlacementFeedback', () => {
    it('idle: no options, no ghost, no confirm', () => {
      const fb = getPlacementFeedback(createPlacementMode(), 100, []);
      expect(fb.slotId).toBeNull();
      expect(fb.options).toEqual([]);
      expect(fb.showInsufficientEssence).toBe(false);
      expect(fb.canConfirm).toBe(false);
      expect(fb.ghostRange).toBeNull();
      expect(fb.ghostColor).toBeNull();
    });

    it('selecting_tower: shows options, no ghost, no confirm', () => {
      const selecting = selectSlot(createPlacementMode(), 0);
      const fb = getPlacementFeedback(selecting, 100, []);
      expect(fb.slotId).toBe(0);
      expect(fb.options).toHaveLength(3);
      expect(fb.showInsufficientEssence).toBe(false);
      expect(fb.canConfirm).toBe(false);
      expect(fb.ghostRange).toBeNull();
      expect(fb.ghostColor).toBeNull();
    });

    it('confirming with enough essence: canConfirm true, ghost green', () => {
      const selecting = selectSlot(createPlacementMode(), 0);
      const confirming = selectTowerType(selecting, 'archer');
      const fb = getPlacementFeedback(confirming, 100, []);
      expect(fb.canConfirm).toBe(true);
      expect(fb.showInsufficientEssence).toBe(false);
      expect(fb.ghostRange).toBe(80);
      expect(fb.ghostColor).toBe(0x2ecc71);
    });

    it('confirming without enough essence: canConfirm false, shows insufficient message, ghost red', () => {
      const selecting = selectSlot(createPlacementMode(), 0);
      const confirming = selectTowerType(selecting, 'cannon');
      const fb = getPlacementFeedback(confirming, 30, []);
      expect(fb.canConfirm).toBe(false);
      expect(fb.showInsufficientEssence).toBe(true);
      expect(fb.ghostRange).toBe(70);
      expect(fb.ghostColor).toBe(0xe74c3c);
    });

    it('confirming on occupied slot: canConfirm false even if affordable', () => {
      const towers = [makePlacedTower({ slotId: 2 })];
      const selecting = selectSlot(createPlacementMode(), 2);
      const confirming = selectTowerType(selecting, 'archer');
      const fb = getPlacementFeedback(confirming, 200, towers);
      expect(fb.canConfirm).toBe(false);
      expect(fb.showInsufficientEssence).toBe(false);
    });

    it('confirming with exact essence: canConfirm true', () => {
      const selecting = selectSlot(createPlacementMode(), 0);
      const confirming = selectTowerType(selecting, 'archer');
      const fb = getPlacementFeedback(confirming, 50, []);
      expect(fb.canConfirm).toBe(true);
    });
  });
});
