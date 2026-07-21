import { describe, it, expect, beforeEach } from 'vitest';
import {
  createGameControls,
  scaleDelta,
  togglePause,
  setSpeed,
  createWaveSummary,
  type GameControls,
} from '../src/logic/game-controls';

describe('GameControls', () => {
  let controls: GameControls;

  beforeEach(() => {
    controls = createGameControls();
  });

  it('creates controls with paused=false and speed=1', () => {
    expect(controls.paused).toBe(false);
    expect(controls.speed).toBe(1);
  });

  describe('scaleDelta', () => {
    it('returns delta unchanged at speed 1x', () => {
      expect(scaleDelta(16, controls)).toBe(16);
    });

    it('returns delta * 2 at speed 2x', () => {
      controls.speed = 2;
      expect(scaleDelta(16, controls)).toBe(32);
    });

    it('returns 0 when paused', () => {
      controls.paused = true;
      expect(scaleDelta(16, controls)).toBe(0);
    });

    it('returns 0 when paused even at speed 2x', () => {
      controls.paused = true;
      controls.speed = 2;
      expect(scaleDelta(16, controls)).toBe(0);
    });
  });

  describe('togglePause', () => {
    it('toggles from false to true', () => {
      togglePause(controls);
      expect(controls.paused).toBe(true);
    });

    it('toggles from true to false', () => {
      controls.paused = true;
      togglePause(controls);
      expect(controls.paused).toBe(false);
    });

    it('does not affect speed', () => {
      controls.speed = 2;
      togglePause(controls);
      expect(controls.speed).toBe(2);
    });
  });

  describe('setSpeed', () => {
    it('sets speed to 1', () => {
      controls.speed = 2;
      setSpeed(controls, 1);
      expect(controls.speed).toBe(1);
    });

    it('sets speed to 2', () => {
      setSpeed(controls, 2);
      expect(controls.speed).toBe(2);
    });

    it('rejects invalid speed values', () => {
      controls.speed = 2;
      setSpeed(controls, 3 as 1 | 2);
      expect(controls.speed).toBe(2);
      setSpeed(controls, 0 as 1 | 2);
      expect(controls.speed).toBe(2);
    });

    it('does not affect paused state', () => {
      controls.paused = true;
      setSpeed(controls, 2);
      expect(controls.paused).toBe(true);
    });
  });
});

describe('createWaveSummary', () => {
  it('returns correct wave number', () => {
    const summary = createWaveSummary({
      waveNumber: 3,
      essenceGained: 25,
      heartsRemaining: 8,
      totalWaves: 5,
    });
    expect(summary.waveNumber).toBe(3);
  });

  it('returns correct essence gained', () => {
    const summary = createWaveSummary({
      waveNumber: 1,
      essenceGained: 40,
      heartsRemaining: 10,
      totalWaves: 5,
    });
    expect(summary.essenceGained).toBe(40);
  });

  it('returns correct hearts remaining', () => {
    const summary = createWaveSummary({
      waveNumber: 2,
      essenceGained: 15,
      heartsRemaining: 7,
      totalWaves: 5,
    });
    expect(summary.heartsRemaining).toBe(7);
  });

  it('sets hasNextWave true when wave < totalWaves', () => {
    const summary = createWaveSummary({
      waveNumber: 3,
      essenceGained: 10,
      heartsRemaining: 9,
      totalWaves: 5,
    });
    expect(summary.hasNextWave).toBe(true);
  });

  it('sets hasNextWave false when wave === totalWaves (final wave)', () => {
    const summary = createWaveSummary({
      waveNumber: 5,
      essenceGained: 10,
      heartsRemaining: 9,
      totalWaves: 5,
    });
    expect(summary.hasNextWave).toBe(false);
  });
});
