import type { TowerType } from './tower-data';
import type { EnemyType } from './enemy-data';

export interface AssetEntry {
  path: string;
  textureKey: string;
  displayWidth: number;
  displayHeight: number;
}

const TOWER_ASSETS: Record<TowerType, AssetEntry> = {
  archer: { path: 'assets/characters/archer.png', textureKey: 'archer', displayWidth: 44, displayHeight: 44 },
  cannon: { path: 'assets/characters/cannon.png', textureKey: 'cannon', displayWidth: 48, displayHeight: 48 },
  frost:  { path: 'assets/characters/frost.png',  textureKey: 'frost',  displayWidth: 44, displayHeight: 44 },
};

const ENEMY_ASSETS: Record<EnemyType, AssetEntry> = {
  shade:   { path: 'assets/characters/shade.png',           textureKey: 'shade',           displayWidth: 22, displayHeight: 22 },
  brute:   { path: 'assets/characters/brute.png',           textureKey: 'brute',           displayWidth: 36, displayHeight: 36 },
  wraith:  { path: 'assets/characters/wraith.png',          textureKey: 'wraith',          displayWidth: 28, displayHeight: 28 },
  captain: { path: 'assets/characters/shadow-captain.png',  textureKey: 'shadow-captain',  displayWidth: 42, displayHeight: 42 },
};

export function getTowerAsset(type: TowerType): AssetEntry {
  return TOWER_ASSETS[type];
}

export function getEnemyAsset(type: EnemyType): AssetEntry {
  return ENEMY_ASSETS[type];
}

export function getAllAssetKeys(): string[] {
  return [
    ...Object.values(TOWER_ASSETS).map(a => a.path),
    ...Object.values(ENEMY_ASSETS).map(a => a.path),
  ];
}

export function isTowerType(value: string): value is TowerType {
  return value in TOWER_ASSETS;
}

export function isEnemyType(value: string): value is EnemyType {
  return value in ENEMY_ASSETS;
}
