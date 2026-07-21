import { describe, it, expect } from 'vitest';
import { computeAttackFlashScales } from '../src/entities/attack-flash';

describe('computeAttackFlashScales', () => {
  it('returns flash factor applied to base scale and restores to base', () => {
    const result = computeAttackFlashScales(1, 1);
    expect(result.flashScaleX).toBeCloseTo(1.15);
    expect(result.flashScaleY).toBeCloseTo(1.15);
    expect(result.restoreScaleX).toBe(1);
    expect(result.restoreScaleY).toBe(1);
  });

  it('preserves a small sprite scale (setDisplaySize case)', () => {
    const baseX = 0.1196;
    const baseY = 0.0428;
    const result = computeAttackFlashScales(baseX, baseY);

    expect(result.flashScaleX).toBeCloseTo(baseX * 1.15, 6);
    expect(result.flashScaleY).toBeCloseTo(baseY * 1.15, 6);
    expect(result.restoreScaleX).toBe(baseX);
    expect(result.restoreScaleY).toBe(baseY);
  });

  it('returns base scale as restore (not hardcoded 1)', () => {
    const baseX = 0.3;
    const baseY = 0.5;
    const result = computeAttackFlashScales(baseX, baseY);

    expect(result.restoreScaleX).toBe(baseX);
    expect(result.restoreScaleY).toBe(baseY);
    expect(result.restoreScaleX).not.toBe(1);
  });

  it('works with non-default flash factor', () => {
    const result = computeAttackFlashScales(2, 3, 1.3);
    expect(result.flashScaleX).toBeCloseTo(2.6);
    expect(result.flashScaleY).toBeCloseTo(3.9);
    expect(result.restoreScaleX).toBe(2);
    expect(result.restoreScaleY).toBe(3);
  });

  it('flash scale is always larger than base for positive factors', () => {
    const bases = [
      [0.1, 0.1],
      [0.5, 0.5],
      [1, 1],
      [2, 2],
    ];
    for (const [bx, by] of bases) {
      const r = computeAttackFlashScales(bx, by);
      expect(r.flashScaleX).toBeGreaterThan(bx);
      expect(r.flashScaleY).toBeGreaterThan(by);
    }
  });
});
