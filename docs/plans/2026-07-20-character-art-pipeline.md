# Shadow Kingdom: Bastion — Character Art Pipeline

> User-approved direction: towers and enemies must be illustrated characters, not geometric placeholders.

## Visual Authority

- Portrait mobile tower-defense game.
- Chibi fantasy pixel-art-inspired characters with clear silhouettes.
- Head-to-body ratio around 1:3, bold outline, limited palette, readable at small size.
- Runtime animation may add idle/attack/hit motion, but source artwork remains consistent.
- No text, logos, watermark, or UI baked into character images.

## Tower Roster

| Unit | Role | Visual identity | Progression cue |
|---|---|---|---|
| Archer | fast single target | hooded forest archer, drawn bow | brighter cloak, larger bow, glowing arrow |
| Cannon | splash damage | armored dwarf/goblin engineer beside cannon | heavier cannon, metal armor, ember muzzle |
| Frost | slow/control | robed ice mage with crystal staff | larger crystals, cyan aura, snow particles |

## Enemy Roster

| Unit | Role | Visual identity | Progression cue |
|---|---|---|---|
| Shade | basic | small shadow creature | small silhouette, purple eyes |
| Wraith | fast | floating ghost with trailing veil | taller body, cyan-violet aura |
| Brute | tank | large armored monster | large silhouette, horns/armor, red glow |
| Shadow Captain | boss | imposing armored shadow commander | 2–3x size, crimson weapon/aura, crown/helm |

## Asset Strategy

- Generate one approved base illustration per character first.
- Keep master assets separate from gameplay copies.
- Integrate static base assets first; derive attack/hit variants only after base silhouettes are consistent.
- Use PNG with transparent background where the generator supports it; otherwise remove background offline with a deterministic image-processing step and verify edges.
- Use Phaser `pixelArt: true`, nearest-neighbor scaling, and runtime tween/flash effects.

## Acceptance

- Every tower and enemy renders as a recognizable character.
- Size hierarchy matches strength and role.
- Characters remain readable at 360x640.
- No baked labels/UI.
- Assets load on GitHub Pages using relative paths.
- Character tests verify asset registry keys and role-to-asset mapping.
- Browser QA verifies at least one tower and one enemy asset render in-game before claiming complete.
