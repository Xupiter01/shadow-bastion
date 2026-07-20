import type { MapDefinition } from './types';

const map03: MapDefinition = {
  id: 3,
  theme: 'frozen-peaks',
  isBoss: false,
  road: [
    { x: 300, y: -20 },
    { x: 300, y: 80 },
    { x: 180, y: 160 },
    { x: 60, y: 240 },
    { x: 180, y: 320 },
    { x: 300, y: 380 },
    { x: 200, y: 460 },
    { x: 80, y: 520 },
    { x: 180, y: 660 },
  ],
  castle: { x: 180, y: 610 },
  slots: [
    { id: 0, x: 200, y: 40, role: 'entry-left' },
    { id: 1, x: 80, y: 120, role: 'upper-left' },
    { id: 2, x: 280, y: 200, role: 'upper-right' },
    { id: 3, x: 100, y: 300, role: 'mid-left' },
    { id: 4, x: 280, y: 340, role: 'mid-right' },
    { id: 5, x: 100, y: 420, role: 'lower-left' },
    { id: 6, x: 280, y: 460, role: 'lower-right' },
    { id: 7, x: 80, y: 560, role: 'pre-gate' },
  ],
};

export default map03;
