import { describe, it, expect } from 'vitest';
import { formatHearts, HEART_FULL, HEART_EMPTY, formatLives } from '../src/logic/heart-display';
import { MAX_HEARTS } from '../src/logic/game-state';

describe('heart-display', () => {
  it('exports HEART_FULL and HEART_EMPTY symbols', () => {
    expect(typeof HEART_FULL).toBe('string');
    expect(typeof HEART_EMPTY).toBe('string');
    expect(HEART_FULL.length).toBeGreaterThan(0);
    expect(HEART_EMPTY.length).toBeGreaterThan(0);
  });

  it('MAX_HEARTS is 10', () => {
    expect(MAX_HEARTS).toBe(10);
  });

  it('returns 10 full hearts when lives equals MAX_HEARTS', () => {
    const result = formatHearts(MAX_HEARTS, MAX_HEARTS);
    expect(result).toBe(HEART_FULL.repeat(MAX_HEARTS));
  });

  it('returns 10 empty hearts when lives is 0', () => {
    const result = formatHearts(0, MAX_HEARTS);
    expect(result).toBe(HEART_EMPTY.repeat(MAX_HEARTS));
  });

  it('returns mixed hearts for partial lives', () => {
    const result = formatHearts(3, 5);
    expect(result).toBe(HEART_FULL.repeat(3) + HEART_EMPTY.repeat(2));
  });

  it('clamps negative lives to 0', () => {
    const result = formatHearts(-5, MAX_HEARTS);
    expect(result).toBe(HEART_EMPTY.repeat(MAX_HEARTS));
  });

  it('clamps lives above max to max', () => {
    const result = formatHearts(15, MAX_HEARTS);
    expect(result).toBe(HEART_FULL.repeat(MAX_HEARTS));
  });

  it('formatLives returns numeric fallback string', () => {
    const result = formatLives(7, MAX_HEARTS);
    expect(result).toBe('7/10');
  });

  it('formatLives clamps negative to 0', () => {
    const result = formatLives(-3, MAX_HEARTS);
    expect(result).toBe('0/10');
  });

  it('formatLives clamps above max', () => {
    const result = formatLives(20, MAX_HEARTS);
    expect(result).toBe('10/10');
  });

  it('formatHearts with max=1 returns single character', () => {
    expect(formatHearts(1, 1)).toBe(HEART_FULL);
    expect(formatHearts(0, 1)).toBe(HEART_EMPTY);
  });
});
