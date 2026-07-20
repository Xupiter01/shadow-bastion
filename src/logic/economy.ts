export function canAfford(essence: number, cost: number): boolean {
  return essence >= cost;
}

export function calculateRefund(totalCost: number): number {
  return Math.floor(totalCost * 0.7);
}
