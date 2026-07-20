import { describe, it, expect } from 'vitest';
import { getCastleHitFeedback } from '../src/logic/heart-display';

describe('getCastleHitFeedback', () => {
  it('returns -1 heart text for shade', () => {
    const fb = getCastleHitFeedback(1);
    expect(fb.text).toBe('-1 \u2764\uFE0F');
    expect(fb.color).toBe('#ff4444');
  });

  it('returns -2 hearts text for brute', () => {
    const fb = getCastleHitFeedback(2);
    expect(fb.text).toBe('-2 \u2764\uFE0F');
    expect(fb.color).toBe('#ff4444');
  });

  it('returns -3 hearts text for captain', () => {
    const fb = getCastleHitFeedback(3);
    expect(fb.text).toBe('-3 \u2764\uFE0F');
    expect(fb.color).toBe('#ff4444');
  });

  it('returns singular heart for cost=1', () => {
    const fb = getCastleHitFeedback(1);
    expect(fb.text).toContain('1');
    expect(fb.text).toContain('\u2764\uFE0F');
  });

  it('returns plural hearts for cost>1', () => {
    const fb = getCastleHitFeedback(2);
    expect(fb.text).toContain('2');
  });
});
