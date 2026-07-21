import { TowerType, TOWER_LEVELS } from '../data/tower-data';
import type { PlacedTower } from './game-state';

export type PlacementMode =
  | { kind: 'idle' }
  | { kind: 'selecting_tower'; slotId: number }
  | { kind: 'confirming_placement'; slotId: number; towerType: TowerType };

export interface TowerOption {
  type: TowerType;
  label: string;
  cost: number;
  color: number;
  canAfford: boolean;
}

export interface PlacementFeedback {
  mode: PlacementMode;
  slotId: number | null;
  options: TowerOption[];
  showInsufficientEssence: boolean;
  canConfirm: boolean;
  ghostRange: number | null;
  ghostColor: number | null;
}

export function createPlacementMode(): PlacementMode {
  return { kind: 'idle' };
}

export function selectSlot(mode: PlacementMode, slotId: number): PlacementMode {
  if (mode.kind !== 'idle') return mode;
  return { kind: 'selecting_tower', slotId };
}

export function selectTowerType(mode: PlacementMode, towerType: TowerType): PlacementMode {
  if (mode.kind !== 'selecting_tower') return mode;
  return { kind: 'confirming_placement', slotId: mode.slotId, towerType };
}

export function cancelPlacement(mode: PlacementMode): PlacementMode {
  return { kind: 'idle' };
}

export function isSlotOccupied(slotId: number, towers: PlacedTower[]): boolean {
  return towers.some(t => t.slotId === slotId);
}

export function getTowerOptions(mode: PlacementMode, essence: number, _towers: PlacedTower[]): TowerOption[] {
  if (mode.kind !== 'selecting_tower') return [];

  const types: TowerType[] = ['archer', 'cannon', 'frost'];
  return types.map(type => {
    const stats = TOWER_LEVELS[type][0].stats;
    return {
      type,
      label: type.charAt(0).toUpperCase() + type.slice(1),
      cost: stats.cost,
      color: stats.color,
      canAfford: essence >= stats.cost,
    };
  });
}

export function getPlacementFeedback(
  mode: PlacementMode,
  essence: number,
  towers: PlacedTower[],
): PlacementFeedback {
  switch (mode.kind) {
    case 'idle':
      return {
        mode,
        slotId: null,
        options: [],
        showInsufficientEssence: false,
        canConfirm: false,
        ghostRange: null,
        ghostColor: null,
      };
    case 'selecting_tower': {
      const options = getTowerOptions(mode, essence, towers);
      return {
        mode,
        slotId: mode.slotId,
        options,
        showInsufficientEssence: false,
        canConfirm: false,
        ghostRange: null,
        ghostColor: null,
      };
    }
    case 'confirming_placement': {
      const stats = TOWER_LEVELS[mode.towerType][0].stats;
      const canAfford = essence >= stats.cost;
      const occupied = isSlotOccupied(mode.slotId, towers);
      return {
        mode,
        slotId: mode.slotId,
        options: [],
        showInsufficientEssence: !canAfford,
        canConfirm: canAfford && !occupied,
        ghostRange: stats.range,
        ghostColor: canAfford ? 0x2ecc71 : 0xe74c3c,
      };
    }
  }
}
