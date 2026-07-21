export interface GameControls {
  paused: boolean;
  speed: 1 | 2;
}

export function createGameControls(): GameControls {
  return { paused: false, speed: 1 };
}

export function scaleDelta(delta: number, controls: GameControls): number {
  if (controls.paused) return 0;
  return delta * controls.speed;
}

export function togglePause(controls: GameControls): void {
  controls.paused = !controls.paused;
}

export function setSpeed(controls: GameControls, speed: 1 | 2): void {
  if (speed === 1 || speed === 2) controls.speed = speed;
}

export interface WaveSummary {
  waveNumber: number;
  essenceGained: number;
  heartsRemaining: number;
  hasNextWave: boolean;
}

export function createWaveSummary(opts: {
  waveNumber: number;
  essenceGained: number;
  heartsRemaining: number;
  totalWaves: number;
}): WaveSummary {
  return {
    waveNumber: opts.waveNumber,
    essenceGained: opts.essenceGained,
    heartsRemaining: opts.heartsRemaining,
    hasNextWave: opts.waveNumber < opts.totalWaves,
  };
}
