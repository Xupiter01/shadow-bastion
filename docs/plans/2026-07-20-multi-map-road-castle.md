# Shadow Kingdom: Bastion — Multi-Map Road and Castle Plan

> User-approved plan. Implement after Milestone 2 progression changes are committed.

**Goal:** Replace the single fixed battlefield with a manually authored map journey where each map is a winding road leading to a castle, with tower placement areas beside the road and a major boss every tenth map.

**Architecture:** `MapDefinition` is the single source of truth for path points, castle/gate position, tower slots, visual theme, and wave profile. A registry resolves map IDs. Pure progression logic determines unlocked maps and boss-map status. Phaser renders the active definition without hard-coded map geometry in scenes.

**Tech Stack:** Existing Phaser 3 + TypeScript + Vite + Vitest; no new dependencies.

## Map Rules

- Map IDs are positive integers.
- Maps 1–10 form Chapter 1; Map 10 is a boss map.
- Every `mapId % 10 === 0` is a boss map.
- Each map has a winding road with at least 6 path points and a castle/gate endpoint.
- Tower slots are beside the road and must not overlap the road or castle.
- Map definitions are authored data, not random generation.
- Initial implementation includes 3 handcrafted maps plus the registry/progression contract; remaining maps can reuse a validated data pattern only after browser QA of the first three.
- Boss maps use a dedicated boss flag and preserve the existing Shadow Captain for Map 10.

## Files

- Create: `src/data/maps/types.ts`
- Create: `src/data/maps/map-01.ts`
- Create: `src/data/maps/map-02.ts`
- Create: `src/data/maps/map-03.ts`
- Create: `src/data/maps/map-registry.ts`
- Create: `src/logic/map-progression.ts`
- Modify: `src/data/map-data.ts` only to preserve compatibility or replace hard-coded geometry cleanly
- Modify: `src/scenes/GameScene.ts` to render the selected MapDefinition
- Modify: scene flow to select active map without adding online/save systems
- Test: `tests/map-registry.test.ts`
- Test: `tests/map-progression.test.ts`
- Test: `tests/map-geometry.test.ts`

## Acceptance Criteria

- [ ] Map 1, 2, and 3 have visibly different winding roads.
- [ ] Castle/gate is the destination at the end of every road.
- [ ] Placement slots are beside the road and remain clickable.
- [ ] Map 10 is recognized as a boss map by pure logic.
- [ ] Existing single-map gameplay remains playable while map selection is introduced.
- [ ] No random geometry, networking, save system, or extra unrelated features.
- [ ] Focused tests, full tests, TypeScript/build pass.
- [ ] Browser QA verifies at least Maps 1–3 render and one slot remains interactive.
