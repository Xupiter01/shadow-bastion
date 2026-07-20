import { getAllMaps, getTotalMaps } from '../data/maps/map-registry';

export interface SelectableMap {
  mapId: number;
  theme: string;
  accessible: boolean;
}

export function getSelectableMaps(highestCompleted: number): SelectableMap[] {
  return getAllMaps().map(m => ({
    mapId: m.id,
    theme: m.theme,
    accessible: canAccessMap(m.id, highestCompleted),
  }));
}

export function isBossMap(mapId: number): boolean {
  return mapId > 0 && mapId % 10 === 0;
}

export function getChapter(mapId: number): number {
  return Math.ceil(mapId / 10);
}

export function canAccessMap(mapId: number, highestCompleted: number): boolean {
  if (mapId <= 0) return false;
  if (mapId === 1) return true;
  return highestCompleted >= mapId - 1;
}

export function getNextMap(currentMapId: number): number | null {
  const next = currentMapId + 1;
  return next <= getTotalMaps() ? next : null;
}
