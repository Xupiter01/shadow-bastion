import { TOWER_LEVELS, TowerType } from '../data/tower-data';

export type GamePhase = 'prep' | 'wave' | 'result';
export type GameResult = null | 'win' | 'lose';

export interface PlacedTower {
  id: number;
  slotId: number;
  type: TowerType;
  level: number;
  totalCost: number;
}

export interface ActiveEnemy {
  id: number;
  type: string;
  hp: number;
  maxHp: number;
  speed: number;
  reward: number;
  livesCost: number;
  pathIndex: number;
  pathProgress: number;
  slowTimer: number;
  alive: boolean;
}

export interface GameState {
  lives: number;
  essence: number;
  wave: number;
  phase: GamePhase;
  towers: PlacedTower[];
  enemies: ActiveEnemy[];
  gameOver: boolean;
  won: boolean;
  nextTowerId: number;
  nextEnemyId: number;
}

let towerIdCounter = 0;
let enemyIdCounter = 0;

export function createGameState(): GameState {
  towerIdCounter = 0;
  enemyIdCounter = 0;
  return {
    lives: 10,
    essence: 100,
    wave: 1,
    phase: 'prep',
    towers: [],
    enemies: [],
    gameOver: false,
    won: false,
    nextTowerId: 0,
    nextEnemyId: 0,
  };
}

export interface PlacementResult {
  success: boolean;
  reason?: string;
}

export function placeTower(state: GameState, slotId: number, type: TowerType): PlacementResult {
  const levelData = TOWER_LEVELS[type][0];
  if (state.towers.some(t => t.slotId === slotId)) {
    return { success: false, reason: 'slot_occupied' };
  }
  if (state.essence < levelData.stats.cost) {
    return { success: false, reason: 'insufficient_essence' };
  }
  state.essence -= levelData.stats.cost;
  const tower: PlacedTower = {
    id: state.nextTowerId++,
    slotId,
    type,
    level: 1,
    totalCost: levelData.stats.cost,
  };
  state.towers.push(tower);
  return { success: true };
}

export interface UpgradeResult {
  success: boolean;
  reason?: string;
}

export function upgradeTower(state: GameState, towerId: number): UpgradeResult {
  const tower = state.towers.find(t => t.id === towerId);
  if (!tower) return { success: false, reason: 'tower_not_found' };

  const levels = TOWER_LEVELS[tower.type];
  if (tower.level >= levels.length) return { success: false, reason: 'max_level' };

  const currentLevelData = levels[tower.level - 1];
  if (state.essence < currentLevelData.upgradeCost) return { success: false, reason: 'insufficient_essence' };

  state.essence -= currentLevelData.upgradeCost;
  tower.level++;
  tower.totalCost += currentLevelData.upgradeCost;
  return { success: true };
}

export function sellTower(state: GameState, towerId: number): UpgradeResult {
  const idx = state.towers.findIndex(t => t.id === towerId);
  if (idx === -1) return { success: false, reason: 'tower_not_found' };

  const tower = state.towers[idx];
  const refund = Math.floor(tower.totalCost * 0.7);
  state.essence += refund;
  state.towers.splice(idx, 1);
  return { success: true };
}

export function enemyReachedGate(state: GameState, enemyId: number): void {
  const enemy = state.enemies.find(e => e.id === enemyId);
  if (!enemy || !enemy.alive) return;

  state.lives -= enemy.livesCost;
  enemy.alive = false;

  if (state.lives <= 0) {
    state.gameOver = true;
    state.won = false;
    state.phase = 'result';
  }
}

export function restartGame(state: GameState): void {
  const fresh = createGameState();
  Object.assign(state, fresh);
}
