import { describe, it, expect } from 'vitest';
import { getResultDisplay } from '../src/logic/heart-display';

describe('getResultDisplay', () => {
  it('returns victory title and subtitle when won', () => {
    const result = getResultDisplay(true);
    expect(result.title).toBe('VICTORY!');
    expect(result.titleColor).toBe('#27ae60');
    expect(result.subtitle).toContain('stands');
  });

  it('returns defeat title and subtitle when lost', () => {
    const result = getResultDisplay(false);
    expect(result.title).toBe('THE CASTLE HAS FALLEN');
    expect(result.titleColor).toBe('#c0392b');
    expect(result.subtitle.toLowerCase()).toContain('castle');
  });

  it('defeat subtitle mentions hearts or castle', () => {
    const result = getResultDisplay(false);
    const combined = (result.title + ' ' + result.subtitle).toLowerCase();
    expect(combined).toMatch(/castle|heart|fell|fallen/);
  });
});
