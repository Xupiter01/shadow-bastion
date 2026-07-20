export type TowerType = 'archer' | 'cannon' | 'frost';

export interface TowerStats {
  type: TowerType;
  name: string;
  cost: number;
  damage: number;
  range: number;
  fireRate: number;
  description: string;
  color: number;
}

export interface TowerLevel {
  level: number;
  stats: TowerStats;
  upgradeCost: number;
}

export const TOWER_LEVELS: Record<TowerType, TowerLevel[]> = {
  archer: [
    { level: 1, stats: { type: 'archer', name: 'Shadow Archer', cost: 50, damage: 8, range: 80, fireRate: 2, description: 'Fast single-target DPS', color: 0x9b59b6 }, upgradeCost: 40 },
    { level: 2, stats: { type: 'archer', name: 'Shadow Archer', cost: 50, damage: 15, range: 100, fireRate: 2.5, description: 'Fast single-target DPS', color: 0x9b59b6 }, upgradeCost: 60 },
    { level: 3, stats: { type: 'archer', name: 'Shadow Archer', cost: 50, damage: 25, range: 120, fireRate: 3, description: 'Fast single-target DPS', color: 0x9b59b6 }, upgradeCost: 0 },
  ],
  cannon: [
    { level: 1, stats: { type: 'cannon', name: 'Crystal Cannon', cost: 100, damage: 20, range: 70, fireRate: 0.8, description: 'Area damage, slow fire', color: 0xe74c3c }, upgradeCost: 75 },
    { level: 2, stats: { type: 'cannon', name: 'Crystal Cannon', cost: 100, damage: 40, range: 85, fireRate: 0.9, description: 'Area damage, slow fire', color: 0xe74c3c }, upgradeCost: 100 },
    { level: 3, stats: { type: 'cannon', name: 'Crystal Cannon', cost: 100, damage: 70, range: 100, fireRate: 1, description: 'Area damage, slow fire', color: 0xe74c3c }, upgradeCost: 0 },
  ],
  frost: [
    { level: 1, stats: { type: 'frost', name: 'Frost Mage', cost: 75, damage: 5, range: 90, fireRate: 1.2, description: 'Slows enemies', color: 0x3498db }, upgradeCost: 50 },
    { level: 2, stats: { type: 'frost', name: 'Frost Mage', cost: 75, damage: 10, range: 110, fireRate: 1.4, description: 'Slows enemies more', color: 0x3498db }, upgradeCost: 75 },
    { level: 3, stats: { type: 'frost', name: 'Frost Mage', cost: 75, damage: 18, range: 130, fireRate: 1.6, description: 'Strong slow + damage', color: 0x3498db }, upgradeCost: 0 },
  ],
};

export const SLOW_FACTOR = 0.5;
export const SLOW_DURATION = 2000;
export const CANNON_SPLASH_RADIUS = 40;
