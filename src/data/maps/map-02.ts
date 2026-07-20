import type { MapDefinition } from './types';

const map02: MapDefinition = {
  id: 2,
  theme: 'volcanic-wastes',
  isBoss: false,
  road: [
    { x: 60, y: -20 },
    { x: 60, y: 60 },
    { x: 280, y: 120 },
    { x: 60, y: 200 },
    { x: 300, y: 280 },
    { x: 60, y: 360 },
    { x: 300, y: 440 },
    { x: 180, y: 520 },
    { x: 180, y: 660 },
  ],
  castle: { x: 180, y: 600 },
  slots: [
    { id: 0, x: 160, y: 30, role: 'entry-left' },
    { id: 1, x: 180, y: 100, role: 'zigzag-1-right' },
    { id: 2, x: 160, y: 170, role: 'zigzag-2-left' },
    { id: 3, x: 200, y: 250, role: 'zigzag-3-right' },
    { id: 4, x: 160, y: 330, role: 'zigzag-4-left' },
    { id: 5, x: 180, y: 410, role: 'zigzag-5-right' },
    { id: 6, x: 80, y: 490, role: 'lower-left' },
    { id: 7, x: 280, y: 490, role: 'lower-right' },
  ],
};

export default map02;
