export interface PlacementSlot {
  id: number;
  x: number;
  y: number;
  role: string;
}

export interface PathPoint {
  x: number;
  y: number;
}

export const PATH_POINTS: PathPoint[] = [
  { x: 180, y: -20 },
  { x: 180, y: 80 },
  { x: 100, y: 150 },
  { x: 80, y: 250 },
  { x: 160, y: 320 },
  { x: 280, y: 350 },
  { x: 300, y: 430 },
  { x: 200, y: 480 },
  { x: 100, y: 520 },
  { x: 80, y: 580 },
  { x: 180, y: 660 },
];

export const PLACEMENT_SLOTS: PlacementSlot[] = [
  { id: 0, x: 130, y: 110, role: 'top-curve-left' },
  { id: 1, x: 230, y: 110, role: 'top-curve-right' },
  { id: 2, x: 40, y: 200, role: 'mid-left' },
  { id: 3, x: 140, y: 230, role: 'mid-center' },
  { id: 4, x: 220, y: 310, role: 'junction-right' },
  { id: 5, x: 120, y: 400, role: 'lower-left' },
  { id: 6, x: 250, y: 460, role: 'lower-right' },
  { id: 7, x: 140, y: 540, role: 'pre-gate' },
];

export const GATE_POSITION = { x: 180, y: 620 };
