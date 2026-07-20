import { EnemyType } from './enemy-data';

export interface WaveEntry {
  type: EnemyType;
  count: number;
  delay: number;
}

export interface Wave {
  number: number;
  entries: WaveEntry[];
  pauseBefore: number;
}

export const WAVES: Wave[] = [
  {
    number: 1,
    pauseBefore: 3000,
    entries: [
      { type: 'shade', count: 6, delay: 1000 },
    ],
  },
  {
    number: 2,
    pauseBefore: 5000,
    entries: [
      { type: 'shade', count: 8, delay: 800 },
      { type: 'brute', count: 2, delay: 2000 },
    ],
  },
  {
    number: 3,
    pauseBefore: 5000,
    entries: [
      { type: 'brute', count: 4, delay: 1500 },
      { type: 'shade', count: 6, delay: 700 },
    ],
  },
  {
    number: 4,
    pauseBefore: 5000,
    entries: [
      { type: 'shade', count: 5, delay: 700 },
      { type: 'brute', count: 3, delay: 1500 },
      { type: 'wraith', count: 3, delay: 1200 },
    ],
  },
  {
    number: 5,
    pauseBefore: 5000,
    entries: [
      { type: 'shade', count: 8, delay: 600 },
      { type: 'brute', count: 4, delay: 1200 },
      { type: 'wraith', count: 4, delay: 1000 },
      { type: 'captain', count: 1, delay: 3000 },
    ],
  },
];
