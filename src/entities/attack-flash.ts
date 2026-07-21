const DEFAULT_FLASH_FACTOR = 1.15;

export function computeAttackFlashScales(
  baseScaleX: number,
  baseScaleY: number,
  flashFactor: number = DEFAULT_FLASH_FACTOR,
): { flashScaleX: number; flashScaleY: number; restoreScaleX: number; restoreScaleY: number } {
  return {
    flashScaleX: baseScaleX * flashFactor,
    flashScaleY: baseScaleY * flashFactor,
    restoreScaleX: baseScaleX,
    restoreScaleY: baseScaleY,
  };
}
