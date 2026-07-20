# Shadow Kingdom: Bastion — Map Visual Pass Plan

> User correction: map geometry existed, but the visual map was not implemented. This pass makes the reference-inspired vertical world map visible in-game.

**Goal:** Turn the data-only road maps into a readable vertical fantasy battlefield inspired by the supplied reference: enemy portal at the top, winding road through environmental zones, side tower grounds, and a prominent castle at the bottom.

**Architecture:** Keep gameplay path/slots as canonical data. Add a data-driven visual layer with palette, zones, and landmarks. Render all scenery using Phaser Graphics/runtime primitives so no external asset dependency is required. Scenery stays behind path, towers, enemies, projectiles, and HUD.

## Visual Composition

- Top: Shadow Gate/portal where enemies spawn.
- Middle: winding road with stone border and textured shoulder.
- Environmental bands: forest, water/bridge, ruins or volcanic/frozen landmark depending on map.
- Sides: grass/rock/tree clusters and clear tower placement pads.
- Bottom: castle keep with banners, gate, moat/highlight, and heart feedback anchor.
- Keep the full playable road visible at the existing portrait resolution.

## Data Changes

Extend `MapDefinition` with optional visual data:

- `palette`: ground, road, roadEdge, water, accent, castle, gate colors.
- `landmarks`: type, x, y, scale, label.
- `zones`: vertical bands with y-range and color/detail type.

Author distinct visual compositions for Map 1–3 without changing enemy path behavior.

## Rendering Changes

- Add `drawMapBackdrop(scene, map)`.
- Replace hard-coded GameScene road/gate/castle drawing with MapRenderer functions.
- Draw road as layered path: dark shadow/edge, warm road surface, dashed stone/grass accents.
- Draw procedural trees, rocks, water, bridge, ruins, portal, castle, banners and moat.
- Draw placement slots as stone pads with subtle glow, not plain green circles.
- Use depth ordering so scenery < road < slots < enemies/towers/projectiles < HUD.
- Keep hit targets and path geometry unchanged.

## TDD / Verification

- Add pure data tests for palettes, landmark bounds, zone bounds, and visual diversity.
- Run focused tests RED→GREEN, full tests, TypeScript, build.
- Use browser screenshot/vision if available to verify the actual rendered Map 1 and one alternate map. If browser binary/tooling is unavailable, label visual QA NOT MEASURED rather than claiming it.
- Commit only this visual map pass with a conventional commit.
