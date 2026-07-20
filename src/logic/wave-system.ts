import { WAVES } from '../data/wave-data';
import { GameState, ActiveEnemy } from './game-state';

export const WAVE_HP_MULTIPLIERS = [1.00, 1.20, 1.45, 1.75, 2.10];

export function applyWaveHpScale(enemy: ActiveEnemy, wave: number): void {
  const multiplier = WAVE_HP_MULTIPLIERS[wave - 1] ?? 1.0;
  enemy.hp = Math.round(enemy.hp * multiplier * 100) / 100;
  enemy.maxHp = Math.round(enemy.maxHp * multiplier * 100) / 100;
}

export interface SpawnEntry {
  type: string;
  delay: number;
}

export interface WaveSpawner {
  currentWave: number;
  isSpawning: boolean;
  getWaveEnemies(wave: number): SpawnEntry[];
  tryAdvanceWave(state: GameState): boolean;
}

export function createWaveSpawner(): WaveSpawner {
  const spawner: WaveSpawner = {
    currentWave: 1,
    isSpawning: false,
    getWaveEnemies(wave: number): SpawnEntry[] {
      const waveData = WAVES.find(w => w.number === wave);
      if (!waveData) return [];

      const entries: SpawnEntry[] = [];
      for (const entry of waveData.entries) {
        for (let i = 0; i < entry.count; i++) {
          entries.push({ type: entry.type, delay: entry.delay });
        }
      }
      return entries;
    },
    tryAdvanceWave(state: GameState): boolean {
      if (state.enemies.filter(e => e.alive).length > 0) return false;

      if (state.wave >= 5) {
        state.won = true;
        state.gameOver = true;
        state.phase = 'result';
        return false;
      }

      state.wave++;
      state.phase = 'prep';
      spawner.currentWave = state.wave;
      return true;
    },
  };
  return spawner;
}
