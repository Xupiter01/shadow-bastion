import Phaser from 'phaser';
import {
  createGameState, GameState, placeTower, upgradeTower, sellTower,
  PlacedTower, ActiveEnemy, enemyReachedGate, MAX_HEARTS,
} from '../logic/game-state';
import { createWaveSpawner, WaveSpawner, applyWaveHpScale } from '../logic/wave-system';
import { findTarget, distance } from '../logic/targeting';
import { applyDamage, applySlow, grantEnemyReward } from '../logic/damage';
import { TowerCooldownTracker, createProjectileState, type ProjectileState } from '../logic/combat-timing';
import { TOWER_LEVELS, SLOW_FACTOR, SLOW_DURATION, CANNON_SPLASH_RADIUS, TowerType } from '../data/tower-data';
import { ENEMY_DATA, EnemyType } from '../data/enemy-data';
import { getMap } from '../data/maps/map-registry';
import type { MapDefinition } from '../data/maps/types';
import { TowerEntity } from '../entities/Tower';
import { EnemyEntity } from '../entities/Enemy';
import { ProjectileEntity } from '../entities/Projectile';
import {
  createMuzzleFlash, createCannonExplosion, createFrostImpact,
  createFloatingText, createSlowEffect, createCastleHitEffect,
} from '../rendering/PixelEffects';
import { shouldDismissPanels } from '../logic/input-policy';
import { formatHearts, formatLives, getCastleHitFeedback } from '../logic/heart-display';
import { getMapBackgroundKey } from '../data/map-asset-registry';

interface ManagedProjectile {
  entity: ProjectileEntity;
  towerType: TowerType;
  targetId: number;
  applied: boolean;
}

export class GameScene extends Phaser.Scene {
  private state!: GameState;
  private spawner!: WaveSpawner;
  private towerEntities: Map<number, TowerEntity> = new Map();
  private enemyEntities: Map<number, EnemyEntity> = new Map();
  private projectiles: ManagedProjectile[] = [];
  private cooldownTracker: TowerCooldownTracker = new TowerCooldownTracker();
  private gameTickMs: number = 0;
  private selectedSlotId: number | null = null;
  private selectedTowerId: number | null = null;
  private hudText!: Phaser.GameObjects.Text;
  private waveStatusText!: Phaser.GameObjects.Text;
  private debugMode: boolean = false;
  private debugText!: Phaser.GameObjects.Text;
  private spawnQueue: { type: string; delay: number }[] = [];
  private spawnTimer: number = 0;
  private selectionPanel: Phaser.GameObjects.Container | null = null;
  private upgradePanel: Phaser.GameObjects.Container | null = null;
  private startWaveBtn!: { btn: Phaser.GameObjects.Rectangle; txt: Phaser.GameObjects.Text };
  private debugPanel: Phaser.GameObjects.Container | null = null;
  private slotHighlights: Map<number, Phaser.GameObjects.Arc> = new Map();
  private activeMap!: MapDefinition;
  private activeMapId: number = 1;

  constructor() {
    super('Game');
  }

  create(data: { mapId?: number } = {}): void {
    const mapId = data.mapId ?? 1;
    this.activeMapId = mapId;
    this.activeMap = getMap(mapId) ?? getMap(1)!;

    this.state = createGameState();
    this.spawner = createWaveSpawner();
    this.towerEntities.clear();
    this.enemyEntities.clear();
    this.projectiles = [];
    this.cooldownTracker = new TowerCooldownTracker();
    this.gameTickMs = 0;
    this.selectedSlotId = null;
    this.selectedTowerId = null;
    this.spawnQueue = [];
    this.spawnTimer = 0;

    this.drawMapBackground();
    this.drawMap();
    this.drawPlacementSlots();
    this.drawHUD();
    this.drawDebugButton();
    this.drawBottomBar();
    this.drawStartWaveButton();
    this.drawWaveStatus();
  }

  private drawMapBackground(): void {
    const bgKey = getMapBackgroundKey(this.activeMapId);
    if (!bgKey || !this.textures.exists(bgKey)) return;

    const canvasW = 360;
    const canvasH = 640;
    const img = this.add.image(canvasW / 2, canvasH / 2, bgKey);

    const tex = this.textures.get(bgKey);
    const source = tex.getSourceImage();
    const srcW = source.width;
    const srcH = source.height;
    const scale = Math.min(canvasW / srcW, canvasH / srcH);
    img.setDisplaySize(srcW * scale, srcH * scale);
    img.setDepth(-10);

    this.add.rectangle(canvasW / 2, canvasH / 2, canvasW, canvasH, 0x000000, 0.35).setDepth(-9);
  }

  private drawMap(): void {
    const road = this.activeMap.road;
    const castle = this.activeMap.castle;

    this.add.rectangle(180, 320, 360, 520, 0x000000, 0)
      .setInteractive()
      .on('pointerdown', (pointer: Phaser.Input.Pointer) => {
        pointer.event.stopPropagation();
        if (shouldDismissPanels('background')) this.closePanels();
      });

    const gfx = this.add.graphics();
    gfx.lineStyle(8, 0x1a1a3e, 1);
    gfx.beginPath();
    gfx.moveTo(road[0].x, road[0].y);
    for (let i = 1; i < road.length; i++) {
      gfx.lineTo(road[i].x, road[i].y);
    }
    gfx.strokePath();

    gfx.lineStyle(3, 0x2c3e50, 0.6);
    gfx.beginPath();
    gfx.moveTo(road[0].x, road[0].y);
    for (let i = 1; i < road.length; i++) {
      gfx.lineTo(road[i].x, road[i].y);
    }
    gfx.strokePath();

    this.add.rectangle(castle.x, castle.y, 60, 16, 0xc0392b)
      .setStrokeStyle(2, 0xe74c3c);
    this.add.text(castle.x, castle.y, 'GATE', {
      fontSize: '9px', color: '#fff', fontFamily: 'monospace',
    }).setOrigin(0.5);

    this.add.text(180, 6, 'SHADOW KINGDOM: BASTION', {
      fontSize: '10px', color: '#555', fontFamily: 'monospace',
    }).setOrigin(0.5, 0);
  }

  private drawPlacementSlots(): void {
    for (const slot of this.activeMap.slots) {
      const circle = this.add.circle(slot.x, slot.y, 14, 0x2ecc71, 0.15);
      circle.setStrokeStyle(2, 0x2ecc71, 0.6);
      circle.setInteractive();
      circle.setData('slotId', slot.id);
      circle.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
        pointer.event.stopPropagation();
        this.onSlotTap(slot.id);
      });

      const highlight = this.add.circle(slot.x, slot.y, 16, 0xf1c40f, 0);
      highlight.setStrokeStyle(3, 0xf1c40f);
      highlight.setVisible(false);
      this.slotHighlights.set(slot.id, highlight);
    }
  }

  private drawHUD(): void {
    this.hudText = this.add.text(10, 50, '', {
      fontSize: '13px', color: '#ecf0f1', fontFamily: 'monospace',
    });
    this.updateHUD();
  }

  private drawWaveStatus(): void {
    this.waveStatusText = this.add.text(180, 595, '', {
      fontSize: '11px', color: '#bdc3c7', fontFamily: 'monospace',
    }).setOrigin(0.5);
  }

  private updateHUD(): void {
    const hearts = formatHearts(this.state.lives, MAX_HEARTS);
    const livesNum = formatLives(this.state.lives, MAX_HEARTS);
    this.hudText.setText(
      `${hearts} ${livesNum}  |  Essence: ${this.state.essence}  |  Wave: ${this.state.wave}/5`
    );
  }

  private drawBottomBar(): void {
    this.add.rectangle(180, 620, 360, 40, 0x0d0d1a).setStrokeStyle(1, 0x1a1a3e);

    const towerTypes: Array<{ type: TowerType; label: string; color: number; cost: number }> = [
      { type: 'archer', label: 'Archer', color: 0x9b59b6, cost: TOWER_LEVELS.archer[0].stats.cost },
      { type: 'cannon', label: 'Cannon', color: 0xe74c3c, cost: TOWER_LEVELS.cannon[0].stats.cost },
      { type: 'frost', label: 'Frost', color: 0x3498db, cost: TOWER_LEVELS.frost[0].stats.cost },
    ];

    towerTypes.forEach((t, i) => {
      const x = 60 + i * 120;
      const btn = this.add.rectangle(x, 620, 100, 30, t.color, 0.3)
        .setStrokeStyle(1, t.color, 0.8)
        .setInteractive();
      this.add.text(x, 614, t.label, {
        fontSize: '10px', color: '#fff', fontFamily: 'monospace',
      }).setOrigin(0.5);
      this.add.text(x, 626, `${t.cost} E`, {
        fontSize: '8px', color: '#aaa', fontFamily: 'monospace',
      }).setOrigin(0.5);

      btn.on('pointerdown', (p: Phaser.Input.Pointer) => {
        p.event.stopPropagation();
      });
    });
  }

  private drawStartWaveButton(): void {
    const btn = this.add.rectangle(180, 570, 140, 28, 0x27ae60)
      .setStrokeStyle(2, 0x2ecc71)
      .setInteractive();
    const txt = this.add.text(180, 570, 'START WAVE', {
      fontSize: '12px', color: '#fff', fontFamily: 'monospace',
    }).setOrigin(0.5);

    btn.on('pointerover', () => btn.setFillStyle(0x2ecc71));
    btn.on('pointerout', () => btn.setFillStyle(0x27ae60));
    btn.on('pointerdown', (p: Phaser.Input.Pointer) => {
      p.event.stopPropagation();
      if (this.state.phase === 'prep' && !this.state.gameOver) {
        this.state.phase = 'wave';
        this.startWave();
        btn.setVisible(false);
        txt.setVisible(false);
      }
    });

    this.startWaveBtn = { btn, txt };
  }

  private drawDebugButton(): void {
    const btn = this.add.rectangle(345, 50, 28, 18, 0x444444)
      .setStrokeStyle(1, 0x666666)
      .setInteractive();
    this.add.text(345, 50, 'DBG', {
      fontSize: '7px', color: '#888', fontFamily: 'monospace',
    }).setOrigin(0.5);

    btn.on('pointerdown', (p: Phaser.Input.Pointer) => {
      p.event.stopPropagation();
      this.debugMode = !this.debugMode;
      this.debugText?.setVisible(this.debugMode);
      if (this.debugMode) {
        this.showDebugPanel();
      } else {
        this.debugPanel?.destroy();
        this.debugPanel = null;
      }
    });

    this.debugText = this.add.text(10, 68, '', {
      fontSize: '10px', color: '#f1c40f', fontFamily: 'monospace',
    });
    this.debugText.setVisible(false);
  }

  private showDebugPanel(): void {
    this.debugPanel?.destroy();

    const btnAdd = this.add.rectangle(60, 555, 80, 22, 0x8e44ad).setInteractive();
    const txtAdd = this.add.text(60, 555, '+50 Ess', {
      fontSize: '9px', color: '#fff', fontFamily: 'monospace',
    }).setOrigin(0.5);
    btnAdd.on('pointerdown', (p: Phaser.Input.Pointer) => {
      p.event.stopPropagation();
      this.state.essence += 50;
      this.updateHUD();
    });

    const btnSkip = this.add.rectangle(180, 555, 80, 22, 0x2980b9).setInteractive();
    const txtSkip = this.add.text(180, 555, 'Next Wave', {
      fontSize: '9px', color: '#fff', fontFamily: 'monospace',
    }).setOrigin(0.5);
    btnSkip.on('pointerdown', (p: Phaser.Input.Pointer) => {
      p.event.stopPropagation();
      this.spawner.tryAdvanceWave(this.state);
      this.state.phase = 'wave';
      this.startWave();
    });

    const btnReset = this.add.rectangle(300, 555, 80, 22, 0xc0392b).setInteractive();
    const txtReset = this.add.text(300, 555, 'Reset', {
      fontSize: '9px', color: '#fff', fontFamily: 'monospace',
    }).setOrigin(0.5);
    btnReset.on('pointerdown', (p: Phaser.Input.Pointer) => {
      p.event.stopPropagation();
      this.scene.restart();
    });

    this.debugPanel = this.add.container(0, 0, [
      btnAdd, txtAdd, btnSkip, txtSkip, btnReset, txtReset,
    ]);
  }

  private onSlotTap(slotId: number): void {
    if (this.state.gameOver) return;

    const existingTower = this.state.towers.find(t => t.slotId === slotId);
    if (existingTower) {
      this.showUpgradePanel(existingTower);
      return;
    }

    this.selectedSlotId = slotId;
    this.showSelectionPanel(slotId);
  }

  private showSelectionPanel(slotId: number): void {
    this.closePanels();
    const slot = this.activeMap.slots.find(s => s.id === slotId)!;
    const types: Array<{ type: TowerType; label: string; cost: number; color: number }> = [
      { type: 'archer', label: 'Archer', cost: TOWER_LEVELS.archer[0].stats.cost, color: TOWER_LEVELS.archer[0].stats.color },
      { type: 'cannon', label: 'Cannon', cost: TOWER_LEVELS.cannon[0].stats.cost, color: TOWER_LEVELS.cannon[0].stats.color },
      { type: 'frost', label: 'Frost', cost: TOWER_LEVELS.frost[0].stats.cost, color: TOWER_LEVELS.frost[0].stats.color },
    ];

    const panel = this.add.container(slot.x, slot.y - 55);

    const bg = this.add.rectangle(0, 0, 110, 90, 0x1a1a2e, 0.95)
      .setStrokeStyle(1, 0x34495e);
    panel.add(bg);

    types.forEach((t, i) => {
      const canAfford = this.state.essence >= t.cost;
      const y = -25 + i * 25;
      const btn = this.add.rectangle(0, y, 95, 20, canAfford ? 0x2c3e50 : 0x333333, 0.9)
        .setStrokeStyle(1, canAfford ? t.color : 0x555555)
        .setInteractive();
      const label = this.add.text(0, y, `${t.label} (${t.cost})`, {
        fontSize: '9px', color: canAfford ? '#fff' : '#666', fontFamily: 'monospace',
      }).setOrigin(0.5);

      if (canAfford) {
        btn.on('pointerdown', (p: Phaser.Input.Pointer) => {
          p.event.stopPropagation();
          this.tryPlaceTower(slotId, t.type);
        });
      }

      panel.add([btn, label]);
    });

    this.selectionPanel = panel;
  }

  private showUpgradePanel(tower: PlacedTower): void {
    this.closePanels();
    this.selectedTowerId = tower.id;
    const towerEntity = this.towerEntities.get(tower.id);
    if (towerEntity) towerEntity.showRange(true);

    const levels = TOWER_LEVELS[tower.type];
    const currentLevelData = levels[tower.level - 1];
    const canUpgrade = tower.level < levels.length;
    const upgradeCost = canUpgrade ? currentLevelData.upgradeCost : 0;
    const sellValue = Math.floor(tower.totalCost * 0.7);

    const slot = this.activeMap.slots.find(s => s.id === tower.slotId)!;
    const panel = this.add.container(slot.x, slot.y - 65);

    const bg = this.add.rectangle(0, 5, 110, canUpgrade ? 70 : 45, 0x1a1a2e, 0.95)
      .setStrokeStyle(1, 0x34495e);
    panel.add(bg);

    const levelTxt = this.add.text(0, -25, `Lv.${tower.level} ${tower.type}`, {
      fontSize: '9px', color: '#aaa', fontFamily: 'monospace',
    }).setOrigin(0.5);
    panel.add(levelTxt);

    if (canUpgrade) {
      const canAfford = this.state.essence >= upgradeCost;
      const upgBtn = this.add.rectangle(0, 0, 95, 20, canAfford ? 0x27ae60 : 0x333333, 0.9)
        .setStrokeStyle(1, canAfford ? 0x2ecc71 : 0x555555)
        .setInteractive();
      const upgTxt = this.add.text(0, 0, `Upgrade (${upgradeCost})`, {
        fontSize: '9px', color: canAfford ? '#fff' : '#666', fontFamily: 'monospace',
      }).setOrigin(0.5);

      if (canAfford) {
        upgBtn.on('pointerdown', (p: Phaser.Input.Pointer) => {
          p.event.stopPropagation();
          const result = upgradeTower(this.state, tower.id);
          if (result.success) {
            const entity = this.towerEntities.get(tower.id);
            if (entity) entity.updateVisuals();
            this.updateHUD();
            this.closePanels();
          }
        });
      }
      panel.add([upgBtn, upgTxt]);
    }

    const sellBtn = this.add.rectangle(0, canUpgrade ? 25 : 0, 95, 20, 0x922b21, 0.9)
      .setStrokeStyle(1, 0xc0392b)
      .setInteractive();
    const sellTxt = this.add.text(0, canUpgrade ? 25 : 0, `Sell (${sellValue})`, {
      fontSize: '9px', color: '#fff', fontFamily: 'monospace',
    }).setOrigin(0.5);
    sellBtn.on('pointerdown', (p: Phaser.Input.Pointer) => {
      p.event.stopPropagation();
      sellTower(this.state, tower.id);
      const entity = this.towerEntities.get(tower.id);
      if (entity) { entity.destroy(); this.towerEntities.delete(tower.id); }
      this.updateHUD();
      this.closePanels();
    });
    panel.add([sellBtn, sellTxt]);

    this.upgradePanel = panel;
  }

  private closePanels(): void {
    this.selectionPanel?.destroy();
    this.selectionPanel = null;
    this.upgradePanel?.destroy();
    this.upgradePanel = null;
    this.selectedSlotId = null;
    this.selectedTowerId = null;
    this.towerEntities.forEach(e => e.showRange(false));
    this.slotHighlights.forEach(h => h.setVisible(false));
  }

  private tryPlaceTower(slotId: number, type: TowerType): void {
    const result = placeTower(this.state, slotId, type);
    if (result.success) {
      const slot = this.activeMap.slots.find(s => s.id === slotId)!;
      const tower = this.state.towers.find(t => t.slotId === slotId)!;
      const entity = new TowerEntity(this, slot.x, slot.y, tower);
      this.towerEntities.set(tower.id, entity);
      this.updateHUD();
      this.closePanels();
    }
  }

  private startWave(): void {
    const entries = this.spawner.getWaveEnemies(this.state.wave);
    this.spawnQueue = [...entries];
    this.spawnTimer = 500;
    this.waveStatusText.setText(`Wave ${this.state.wave} incoming...`);
  }

  private spawnEnemy(type: string): void {
    const data = ENEMY_DATA[type as EnemyType];
    const enemy: ActiveEnemy = {
      id: this.state.nextEnemyId++,
      type,
      hp: data.hp,
      maxHp: data.hp,
      speed: data.speed,
      reward: data.reward,
      livesCost: data.livesCost,
      pathIndex: 0,
      pathProgress: 0,
      slowTimer: 0,
      alive: true,
    };
    this.state.enemies.push(enemy);
    applyWaveHpScale(enemy, this.state.wave);
    const entity = new EnemyEntity(this, enemy);
    this.enemyEntities.set(enemy.id, entity);
  }

  private getSegmentLength(pathIndex: number): number {
    const road = this.activeMap.road;
    const idx = Math.min(pathIndex, road.length - 2);
    const a = road[idx];
    const b = road[idx + 1];
    return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
  }

  update(_time: number, delta: number): void {
    if (this.state.gameOver) {
      this.scene.start('Result', { won: this.state.won, mapId: this.activeMapId });
      return;
    }

    this.gameTickMs += delta;
    const road = this.activeMap.road;

    if (this.spawnQueue.length > 0) {
      this.spawnTimer -= delta;
      if (this.spawnTimer <= 0) {
        const next = this.spawnQueue.shift()!;
        this.spawnEnemy(next.type);
        this.spawnTimer = next.delay;
      }
    }

    for (const enemy of this.state.enemies) {
      if (!enemy.alive) continue;

      const speedMult = enemy.slowTimer > 0 ? SLOW_FACTOR : 1;
      if (enemy.slowTimer > 0) enemy.slowTimer -= delta;

      const moveAmount = (enemy.speed * speedMult * delta) / 1000;
      const segLength = this.getSegmentLength(enemy.pathIndex);
      enemy.pathProgress += moveAmount / segLength;

      while (enemy.pathProgress >= 1 && enemy.pathIndex < road.length - 2) {
        enemy.pathProgress -= 1;
        enemy.pathIndex++;
      }

      if (enemy.pathIndex >= road.length - 1) {
        const livesCost = enemy.livesCost;
        enemyReachedGate(this.state, enemy.id);
        const castle = this.activeMap.castle;
        createCastleHitEffect(this, castle.x, castle.y);
        const fb = getCastleHitFeedback(livesCost);
        createFloatingText(this, castle.x, castle.y - 20, fb.text, fb.color, 12);
      }

      const entity = this.enemyEntities.get(enemy.id);
      if (entity) entity.update(delta);
    }

    for (const tower of this.state.towers) {
      const entity = this.towerEntities.get(tower.id);
      if (!entity) continue;
      const levels = TOWER_LEVELS[tower.type];
      const stats = levels[tower.level - 1].stats;
      const pos = entity.getPosition();

      if (!this.cooldownTracker.canFire(tower.id, this.gameTickMs)) continue;

      const target = findTarget(this.state.enemies, pos, stats.range);
      if (!target) continue;

      const targetEntity = this.enemyEntities.get(target.id);
      const targetPos = targetEntity?.getWorldPos() ?? pos;

      const projState = createProjectileState(
        pos.x, pos.y, targetPos.x, targetPos.y,
        stats.damage, tower.type, target.id,
      );
      const projEntity = new ProjectileEntity(this, projState);
      this.projectiles.push({
        entity: projEntity,
        towerType: tower.type,
        targetId: target.id,
        applied: false,
      });

      this.cooldownTracker.recordFire(tower.id, this.gameTickMs, stats.fireRate);
      entity.playAttackFlash(this);
      createMuzzleFlash(this, pos.x, pos.y, stats.color);
    }

    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const proj = this.projectiles[i];
      const stillAlive = proj.entity.update(delta);

      if (!stillAlive && proj.entity.hasImpacted() && !proj.applied) {
        proj.applied = true;
        const state = proj.entity.getState();
        const target = this.state.enemies.find(e => e.id === state.targetId);
        const targetEntity = state.targetId >= 0 ? this.enemyEntities.get(state.targetId) : undefined;

        if (target && target.alive) {
          applyDamage(target, state.damage);

          const impactPos = targetEntity?.getWorldPos() ?? { x: state.x, y: state.y };
          if (targetEntity) targetEntity.onHit();

          if (target.hp <= 0 && target.reward > 0) {
            const reward = grantEnemyReward(this.state, target);
            if (reward > 0) {
              createFloatingText(this, impactPos.x, impactPos.y - 10, `+${reward}`, '#f1c40f', 10);
            }
          } else {
            createFloatingText(this, impactPos.x, impactPos.y - 8, `-${Math.round(state.damage)}`, '#ff4444', 9);
          }

          if (proj.towerType === 'cannon') {
            createCannonExplosion(this, impactPos.x, impactPos.y);
            for (const e of this.state.enemies) {
              if (e === target || !e.alive) continue;
              const eEntity = this.enemyEntities.get(e.id);
              if (eEntity) {
                const epos = eEntity.getWorldPos();
                if (distance(epos, impactPos) < CANNON_SPLASH_RADIUS) {
                  applyDamage(e, state.damage * 0.5);
                  eEntity.onHit();
                  if (e.hp <= 0 && e.reward > 0) {
                    const splashReward = grantEnemyReward(this.state, e);
                    if (splashReward > 0) {
                      createFloatingText(this, epos.x, epos.y - 10, `+${splashReward}`, '#f1c40f', 9);
                    }
                  }
                }
              }
            }
          } else if (proj.towerType === 'frost') {
            createFrostImpact(this, impactPos.x, impactPos.y);
            applySlow(target, SLOW_DURATION);
            createSlowEffect(this, impactPos.x, impactPos.y);
          } else {
            createFloatingText(this, impactPos.x + 6, impactPos.y - 14, '', '#ffffff', 0);
          }
        }

        proj.entity.destroy();
        this.projectiles.splice(i, 1);
      } else if (!stillAlive) {
        proj.entity.destroy();
        this.projectiles.splice(i, 1);
      }
    }

    for (const [id, entity] of this.enemyEntities) {
      const enemy = this.state.enemies.find(e => e.id === id);
      if (!enemy || !enemy.alive) {
        entity.destroy();
        this.enemyEntities.delete(id);
      }
    }
    this.state.enemies = this.state.enemies.filter(e => e.alive);

    this.updateHUD();

    if (this.debugMode) {
      const alive = this.state.enemies.filter(e => e.alive).length;
      this.debugText.setText(
        `FPS: ${Math.round(this.game.loop.actualFps)} | Enemies: ${alive} | Projectiles: ${this.projectiles.length} | Phase: ${this.state.phase}`
      );
    }

    if (this.state.phase === 'wave') {
      const alive = this.state.enemies.filter(e => e.alive).length;
      this.waveStatusText.setText(`Wave ${this.state.wave} | Enemies: ${alive}`);
    }

    if (this.state.phase === 'wave' && this.spawnQueue.length === 0 && this.state.enemies.length === 0 && this.projectiles.length === 0) {
      this.spawner.tryAdvanceWave(this.state);
      if (!this.state.gameOver) {
        this.startWaveBtn.btn.setVisible(true);
        this.startWaveBtn.txt.setVisible(true);
        this.waveStatusText.setText(`Wave ${this.state.wave - 1} cleared! Prepare for Wave ${this.state.wave}`);
      }
    }
  }
}
