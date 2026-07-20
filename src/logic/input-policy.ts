export type PanelInputTarget = 'slot' | 'panel' | 'background';

export function shouldDismissPanels(target: PanelInputTarget): boolean {
  return target === 'background';
}
