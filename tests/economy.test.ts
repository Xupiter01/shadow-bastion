import { describe, it, expect } from 'vitest';
import { canAfford, calculateRefund } from '../src/logic/economy';

describe('Economy', () => {
  it('canAfford returns true when essence >= cost', () => {
    expect(canAfford(100, 50)).toBe(true);
    expect(canAfford(100, 100)).toBe(true);
  });

  it('canAfford returns false when essence < cost', () => {
    expect(canAfford(30, 50)).toBe(false);
  });

  it('calculateRefund returns 70% of total cost', () => {
    expect(calculateRefund(100)).toBe(70);
    expect(calculateRefund(50)).toBe(35);
  });
});
