import { describe, it, expect } from 'vitest';
import { updateHighestCompleted } from '../src/logic/map-progression';

describe('updateHighestCompleted', () => {
  it('returns mapId on victory when higher than prev', () => {
    expect(updateHighestCompleted(0, 1, true)).toBe(1);
    expect(updateHighestCompleted(1, 2, true)).toBe(2);
  });

  it('returns prev when defeated', () => {
    expect(updateHighestCompleted(0, 1, false)).toBe(0);
    expect(updateHighestCompleted(1, 2, false)).toBe(1);
  });

  it('does not downgrade when winning a lower map', () => {
    expect(updateHighestCompleted(2, 1, true)).toBe(2);
  });

  it('keeps prev when winning the same map again', () => {
    expect(updateHighestCompleted(2, 2, true)).toBe(2);
  });

  it('advances from 0 on first win', () => {
    expect(updateHighestCompleted(0, 1, true)).toBe(1);
  });

  it('advances from 1 to 2 on map 2 victory', () => {
    expect(updateHighestCompleted(1, 2, true)).toBe(2);
  });

  it('advances from 2 to 3 on map 3 victory', () => {
    expect(updateHighestCompleted(2, 3, true)).toBe(3);
  });
});
