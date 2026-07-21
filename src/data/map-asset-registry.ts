export interface MapBackgroundEntry {
  mapId: number;
  path: string;
  textureKey: string;
}

const MAP_BACKGROUNDS: MapBackgroundEntry[] = [
  { mapId: 1, path: 'assets/maps/map-01-bg.png', textureKey: 'map-01-bg' },
];

const backgroundByMapId = new Map<number, MapBackgroundEntry>(
  MAP_BACKGROUNDS.map(e => [e.mapId, e]),
);

export function getMapBackgroundPath(mapId: number): string | undefined {
  return backgroundByMapId.get(mapId)?.path;
}

export function getMapBackgroundKey(mapId: number): string | undefined {
  return backgroundByMapId.get(mapId)?.textureKey;
}

export function getAllMapBackgrounds(): MapBackgroundEntry[] {
  return [...MAP_BACKGROUNDS];
}
