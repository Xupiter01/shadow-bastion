import { describe, expect, it } from 'vitest';
import { shouldDismissPanels } from '../src/logic/input-policy';

describe('panel input policy', () => {
  it('keeps panels open while interacting with slots or panel controls', () => {
    expect(shouldDismissPanels('slot')).toBe(false);
    expect(shouldDismissPanels('panel')).toBe(false);
  });

  it('dismisses panels only when tapping the gameplay background', () => {
    expect(shouldDismissPanels('background')).toBe(true);
  });
});
