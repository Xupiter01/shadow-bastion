export type EnemyType = 'shade' | 'brute' | 'wraith' | 'captain';

export interface EnemyStats {
  type: EnemyType;
  name: string;
  hp: number;
  speed: number;
  reward: number;
  livesCost: number;
  color: number;
  radius: number;
}

export const ENEMY_DATA: Record<EnemyType, EnemyStats> = {
  shade: { type: 'shade', name: 'Shade', hp: 30, speed: 60, reward: 10, livesCost: 1, color: 0x1a1a2e, radius: 6 },
  brute: { type: 'brute', name: 'Brute', hp: 120, speed: 30, reward: 25, livesCost: 2, color: 0x8b4513, radius: 10 },
  wraith: { type: 'wraith', name: 'Wraith', hp: 60, speed: 45, reward: 20, livesCost: 1, color: 0x6c3483, radius: 8 },
  captain: { type: 'captain', name: 'Shadow Captain', hp: 300, speed: 25, reward: 100, livesCost: 3, color: 0xc0392b, radius: 12 },
};

export const WRAITH_SLOW_IMMUNE_DURATION = 3000;
