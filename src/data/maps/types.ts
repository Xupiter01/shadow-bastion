export interface PathPoint {
  x: number;
  y: number;
}

export interface PlacementSlot {
  id: number;
  x: number;
  y: number;
  role: string;
}

export interface MapDefinition {
  id: number;
  road: PathPoint[];
  castle: PathPoint;
  slots: PlacementSlot[];
  theme: string;
  isBoss: boolean;
}
