import type { MapDefinition } from './types';
import map01 from './map-01';
import map02 from './map-02';
import map03 from './map-03';

const registry = new Map<number, MapDefinition>();

for (const m of [map01, map02, map03]) {
  registry.set(m.id, m);
}

export function getMap(id: number): MapDefinition | undefined {
  return registry.get(id);
}

export function getAllMaps(): MapDefinition[] {
  return Array.from(registry.values()).sort((a, b) => a.id - b.id);
}

export function getTotalMaps(): number {
  return registry.size;
}
