export const HEART_FULL = '\u2764\uFE0F';
export const HEART_EMPTY = '\u2661';

export function formatHearts(lives: number, maxHearts: number): string {
  const clamped = Math.max(0, Math.min(lives, maxHearts));
  return HEART_FULL.repeat(clamped) + HEART_EMPTY.repeat(maxHearts - clamped);
}

export function formatLives(lives: number, maxHearts: number): string {
  const clamped = Math.max(0, Math.min(lives, maxHearts));
  return `${clamped}/${maxHearts}`;
}

export interface CastleHitFeedback {
  text: string;
  color: string;
}

export function getCastleHitFeedback(livesCost: number): CastleHitFeedback {
  return { text: `-${livesCost} ${HEART_FULL}`, color: '#ff4444' };
}

export interface ResultDisplay {
  title: string;
  titleColor: string;
  subtitle: string;
}

export function getResultDisplay(won: boolean): ResultDisplay {
  if (won) {
    return {
      title: 'VICTORY!',
      titleColor: '#27ae60',
      subtitle: 'The Shadow Kingdom stands!',
    };
  }
  return {
    title: 'THE CASTLE HAS FALLEN',
    titleColor: '#c0392b',
    subtitle: 'The castle has fallen... all hearts lost.',
  };
}
