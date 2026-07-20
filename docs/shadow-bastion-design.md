---
id: 20260720-shadow-bastion-design
title: "Shadow Kingdom: Bastion — Portrait Tower Defence Design"
type: project
status: active
created: 2026-07-20T17:10:00+07:00
updated: 2026-07-20T17:10:00+07:00
author: hermes
tags: [type/project, game/shadow-kingdom, game/tower-defence, platform/mobile, style/pixel-art]
related: ["[[Shadow Kingdom]]"]
session: 20260720-shadow-bastion-design
confidence: high
---

# Shadow Kingdom: Bastion

## 1. Design Summary

**Shadow Kingdom: Bastion** เป็นเกม Tower Defence ขนาดเล็กในจักรวาล Shadow Kingdom สำหรับ Browser บนมือถือเป็นหลัก ผู้เล่นป้องกันเมืองชายแดนจากกองทัพเงาที่เดินลงมาตามเส้นทาง โดยแตะจุดวางที่กำหนด เลือก Tower ใช้ Essence และตัดสินใจอัปเกรดให้เหมาะกับศัตรูแต่ละ Wave

เกมนี้เป็น vertical slice แยกจากเกม Shadow Kingdom หลัก แต่ใช้โลก โทน และคำศัพท์ร่วมกัน เพื่อทดสอบความสนุกของ core loop โดยไม่ขยายไปสู่ระบบ MMORPG, multiplayer หรือ online service

**ประสบการณ์เป้าหมาย:** เริ่มเล่นได้ทันที เข้าใจวิธีเล่นภายใน Wave แรก และรู้สึกว่าการเลือก Tower/อัปเกรดมีผลต่อการรอดใน Wave ท้าย

## 2. Product Goals

### Goals

1. สร้างเกม Tower Defence ที่เล่นจบหนึ่งรอบได้ภายในประมาณ 5–10 นาที
2. รองรับ Mobile Browser แบบ Portrait และ Touch เป็น input หลัก
3. ใช้ Chibi Anime Pixel Art ที่อ่านง่ายบนหน้าจอเล็ก
4. ให้ผู้เล่นเห็นความสัมพันธ์ระหว่างการวาง Tower, การใช้ Essence และผลลัพธ์ของ Wave
5. พิสูจน์ core gameplay loop ด้วยการเล่นจริง ไม่อาศัยเพียง automated tests

### Non-goals ของ Milestone แรก

- ไม่ทำ multiplayer หรือ online account
- ไม่ทำระบบ save/progression ขนาดใหญ่
- ไม่ทำ hero ที่ควบคุมโดยตรง
- ไม่ทำ skill tree, equipment, crafting หรือ economy เต็มรูปแบบ
- ไม่ทำหลายแผนที่หรือ campaign ยาว
- ไม่เชื่อม runtime กับเกม Shadow Kingdom หลัก
- ไม่ทำระบบสร้างแผนที่แบบอิสระ

## 3. Target Platform and Presentation

### Platform

- Mobile Browser เป็นเป้าหมายหลัก
- Desktop Browser รองรับเพื่อ development และ playtest
- Portrait orientation เป็นค่าเริ่มต้น
- ใช้ Phaser `Scale.FIT` กับ internal resolution ประมาณ `360×640`
- รองรับ viewport ขนาดเล็กโดยไม่ให้ HUD หรือปุ่มหลักถูกตัด

### Input

- Touch tap เป็นวิธีหลัก
- Mouse click รองรับบน Desktop
- ไม่มี drag-and-drop ใน Milestone แรก
- จุด interactive สำคัญต้องมี hit area เพียงพอสำหรับนิ้ว
- ป้องกัน browser text selection/context menu บนพื้นที่เกม

## 4. Visual Direction

### Art Direction

- Pixel Art แบบคมชัด ใช้ nearest-neighbour และไม่ใช้ anti-aliasing กับ sprite
- ตัวละครเป็น Chibi Anime: หัวโต ตัวเล็ก silhouette ชัด
- โลกเป็นแฟนตาซีมืดในจักรวาล Shadow Kingdom
- ฉากใช้ navy, violet, crimson และ gold เป็นสีหลัก
- Gameplay object ต้องมี contrast สูงกว่าฉากหลัง

### Readability Rules

1. เส้นทางศัตรูต้องมองออกทันทีจากพื้นหลัง
2. จุดวาง Tower ต้องมีกรอบ/สัญลักษณ์ชัดเจนก่อนและหลังสร้าง
3. Tower แต่ละชนิดต้องมี silhouette และสีประจำชนิด
4. ศัตรูแต่ละชนิดต้องแยกจากกันได้แม้ดูบนจอเล็ก
5. เอฟเฟกต์โจมตีต้องไม่บังตำแหน่งศัตรูหรือเส้นทาง
6. UI ใช้ตัวอักษรขนาดอ่านได้บนมือถือ และไม่ใส่รายละเอียดตกแต่งจนเบียดสนาม

### Initial Character Set

| กลุ่ม | ตัวละคร | Visual identity |
|---|---|---|
| Tower | Shadow Archer | ผมเงิน เสื้อคลุมม่วง ธนูเรืองแสง |
| Tower | Crystal Cannon Mage | หมวกใหญ่ คทาคริสตัล เอฟเฟกต์ระเบิด |
| Tower | Frost Mage | ผมฟ้า เสื้อคลุมขาว ออร่าน้ำแข็ง |
| Enemy | Shade | ตัวเล็กสีดำ ตาแดง เคลื่อนที่เร็ว |
| Enemy | Brute | ตัวใหญ่ เกราะแตก พลังชีวิตสูง |
| Enemy | Wraith | ลอยได้ ผ้าคลุมโปร่ง มีความสามารถพิเศษ |
| Boss | Shadow Captain | Chibi แม่ทัพเงา รูปร่างเด่นกว่าศัตรูทั่วไป |

Milestone แรกสามารถใช้ runtime-drawn placeholder ที่อยู่ใน palette/style เดียวกันได้เฉพาะกรณีที่ไม่มี asset จริง แต่ต้องไม่ใช้ placeholder เพื่ออ้างว่า visual quality เสร็จสมบูรณ์

## 5. Core Gameplay Loop

```text
เริ่ม Wave
  ↓
ศัตรูเดินตามเส้นทาง
  ↓
ผู้เล่นแตะจุดวาง → เลือก Tower
  ↓
Tower ยิงอัตโนมัติ
  ↓
ศัตรูตาย → ได้ Essence
  ↓
ผู้เล่นเลือกอัปเกรด/สร้าง Tower เพิ่ม
  ↓
Wave ถัดไปเร็วขึ้นหรือมีศัตรูรูปแบบใหม่
  ↓
รอดครบ 5 Wave = ชนะ / ศัตรูเข้าประตูครบ = แพ้
```

### Win/Lose Rules

- เมืองมี `Lives` เริ่มต้น 10
- ศัตรูทั่วไปเข้าประตูหัก 1 Life
- Brute เข้าประตูหัก 2 Lives
- Wraith เข้าประตูหัก 1 Life และไม่ถูกชะลอด้วย Frost ระหว่างช่วงพิเศษของมัน
- เมื่อ Lives เหลือ 0 ให้จบเกมแพ้
- เมื่อเอาชนะศัตรูครบ Wave 5 และ Shadow Captain แล้วให้จบเกมชนะ
- หลังจบเกมมีปุ่ม Restart ที่ล้าง state ของรอบปัจจุบัน

## 6. Map and Fixed Placement

### Map Layout

- ศัตรูเข้าจากด้านบนและเดินลงสู่ประตูเมืองด้านล่าง
- มีเส้นทางหลักคดเคี้ยว 1 เส้นทาง
- มีทางแยกช่วงท้ายเพื่อสร้างความแตกต่างของระยะยิง
- จุดวาง Tower แบบ fixed ประมาณ 8 จุด
- ห้ามวาง Tower บนเส้นทาง
- จุดวางแต่ละจุดต้องออกแบบให้มีบทบาทเชิงตำแหน่ง เช่น ครอบคลุมโค้ง, ทางแยก หรือช่วงก่อนประตู

### Placement Flow

1. ผู้เล่นแตะจุดวางว่าง
2. แสดง panel เลือก Tower พร้อมราคาและคำอธิบายสั้น
3. ถ้า Essence เพียงพอ สร้าง Tower และหัก Essence
4. ถ้าไม่พอ แสดง feedback ว่า Essence ไม่พอ และไม่เปลี่ยน state
5. แตะ Tower ที่สร้างแล้วเพื่อเปิด panel อัปเกรดหรือขาย
6. การขายคืน Essence เป็น 70% ของมูลค่าที่จ่ายใน Milestone แรก

## 7. Towers

| Tower | บทบาท | จุดเด่น | ข้อจำกัด |
|---|---|---|---|
| Shadow Archer | Single-target DPS | ยิงเร็ว ราคาถูก | ยิงเป็นกลุ่มไม่ได้ |
| Crystal Cannon | Area damage | ระเบิดโดนศัตรูหลายตัว | ยิงช้า ราคาแพง |
| Frost Mage | Control | ลดความเร็วศัตรู | ความเสียหายต่ำ |

### Upgrade Rules

- Tower แต่ละชนิดมี Level 1–3
- อัปเกรดต้องแตะ Tower แล้วกดปุ่ม Upgrade
- ราคาและ stat ต้องมาจาก data file ไม่ hardcode ใน Scene
- อัปเกรดต้องแสดงผลทันทีใน range/damage/speed/effect ที่ผู้เล่นมองเห็นได้
- Level 3 ใช้เป็นเป้าหมายปลายรอบ ไม่ต้องมี branching tree ใน Milestone แรก

## 8. Enemies and Wave Pacing

| Enemy | บทบาท | พฤติกรรม |
|---|---|---|
| Shade | เร็ว/กดดัน | HP ต่ำ เดินเร็ว เหมาะกับทดสอบ Archer |
| Brute | รถถัง | HP สูง เดินช้า เหมาะกับ Cannon และการอัปเกรด |
| Wraith | ตัวพิเศษ | มีช่วงต้าน slow และบังคับให้ผู้เล่นจัดลำดับเป้าหมาย |
| Shadow Captain | Mini Boss | HP สูง มี phase สั้น ๆ เพิ่มความกดดันใน Wave 5 |

### Wave Table

| Wave | เนื้อหา | เป้าหมายด้านประสบการณ์ |
|---:|---|---|
| 1 | Shade จำนวนไม่มาก | สอนแตะจุด วาง Tower และรับ Essence |
| 2 | Shade เร็วขึ้น + Brute เล็กน้อย | สอนให้เลือก Tower ให้เหมาะศัตรู |
| 3 | Brute หลายตัว + Shade | บังคับให้อัปเกรดและวางตำแหน่งให้ดี |
| 4 | Shade + Brute + Wraith | เริ่มมีแรงกดดันและต้องจัด priority |
| 5 | กองใหญ่ + Shadow Captain | ตรวจว่าการวางและอัปเกรดก่อนหน้ามีผลจริง |

ระหว่าง Wave ให้มีช่วงพักสั้น ๆ สำหรับอัปเกรด แต่ไม่หยุดเกมโดยอัตโนมัตินานจนจังหวะขาด

## 9. Economy and HUD

### Resources

- `Essence`: ใช้สร้างและอัปเกรด Tower
- `Lives`: จำนวนครั้งที่ศัตรูผ่านเข้าประตูได้ก่อนแพ้
- `Wave`: แสดงความคืบหน้าและช่วงพัก

### HUD Portrait Layout

```text
┌─────────────────────┐
│ Lives  Essence Wave  │
├─────────────────────┤
│                     │
│      สนามรบ         │
│  เส้นทางศัตรูลงล่าง  │
│                     │
│      ประตูเมือง      │
├─────────────────────┤
│      Wave status     │
├─────────────────────┤
│ Archer Cannon Frost │
│         Pause       │
└─────────────────────┘
```

HUD ต้องแสดงค่า Essence ใหม่ทันทีหลังสร้าง/อัปเกรด/ขาย Tower และต้องมี feedback ที่เห็นได้ชัดเมื่อซื้อไม่ได้

## 10. Phaser Architecture

### Folder Structure

```text
src/
  main.ts
  config/
    game-config.ts
  data/
    tower-data.ts
    enemy-data.ts
    wave-data.ts
    map-data.ts
  logic/
    game-state.ts
    wave-system.ts
    targeting.ts
    damage.ts
    economy.ts
  entities/
    Tower.ts
    Enemy.ts
    Projectile.ts
  scenes/
    BootScene.ts
    MenuScene.ts
    GameScene.ts
    ResultScene.ts
  ui/
    Hud.ts
    TowerSelectionPanel.ts
    TowerUpgradePanel.ts
  rendering/
    MapRenderer.ts
    PixelEffects.ts

tests/
  game-state.test.ts
  wave-system.test.ts
  targeting.test.ts
  economy.test.ts
  tower-combat.test.ts
  mobile-layout.test.ts
```

### Separation Rules

- `logic/` ห้าม import Phaser เพื่อให้ทดสอบด้วย Vitest ได้
- `data/` เป็นค่าคงที่ของเกมและแก้ balance ได้โดยไม่แก้ Scene
- `entities/` รับ state/config จาก logic และรับผิดชอบการแสดงผล/interaction ที่จำเป็น
- `GameScene` เป็น coordinator ไม่เป็นที่เก็บกฎเกมทั้งหมด
- UI ส่ง intent เช่น `placeTower`, `upgradeTower`, `sellTower` ให้ state layer ตรวจสิทธิ์และราคา
- State สำคัญต้อง serialize ได้ แม้ Milestone แรกยังไม่เปิดระบบ save ถาวร

### Data Flow

```text
Touch event
  → UI intent
  → GameState validation
  → state mutation
  → renderer/HUD refresh
  → testable result
```

## 11. Testing and Verification Gates

### Unit/Test Gate

ก่อนสร้าง gameplay code ต้องมี tests ที่ fail สำหรับ:

- สร้าง state เริ่มต้นถูกต้อง
- วาง Tower เฉพาะจุดที่ว่างและมี Essence พอ
- ปฏิเสธการซื้อเมื่อ Essence ไม่พอ
- ศัตรูหัก Lives เมื่อถึงประตู
- Damage และ targeting ทำงานตามชนิด Tower
- Wave เปลี่ยนตามลำดับ
- Upgrade เพิ่ม stat และหัก Essence ถูกต้อง
- Restart ล้าง state รอบก่อน

### Browser Playable Gate

หลัง implementation ต้องตรวจด้วย Browser จริง:

- fresh state บนมือถือ-sized viewport
- แตะจุดวาง Tower จริง
- แตะเลือก Tower และอัปเกรดจริง
- เล่น Wave ต่อเนื่องจนชนะหรือแพ้
- ตรวจ desktop mouse fallback
- ตรวจ console ไม่มี uncaught error
- ตรวจ screenshot สนาม/UI ไม่ล้นหรือถูกตัด
- วัด FPS บน desktop และ mobile-sized viewport
- ตรวจการกด Pause/Restart

KPI ทุกข้อรายงานเป็น `PASS`, `FAIL` หรือ `NOT MEASURED` ห้ามสรุปว่าเล่นได้จาก unit tests หรือ build อย่างเดียว

### Debug Mode

Milestone แรกต้องมี debug controls ที่ไม่รบกวนเกมปกติ:

- ปุ่มเพิ่ม Essence
- ปุ่มข้ามไป Wave ถัดไป
- ปุ่ม reset run
- แสดง FPS และ state summary เมื่อเปิด debug mode

Debug mode ต้องปิดเป็นค่าเริ่มต้นและไม่เปลี่ยน behavior ของ production path

## 12. Acceptance Criteria — Milestone 1

Milestone 1 จะถือว่าผ่านเมื่อครบทุกข้อ:

- เปิดเกมบน Browser แนวตั้งได้ทั้ง desktop และ mobile-sized viewport
- เห็น Chibi Anime Pixel Art หรือ asset ที่ผ่าน visual review แล้ว
- ผู้เล่นแตะจุด fixed placement และสร้าง Tower ได้
- Tower ทั้ง 3 แบบมีพฤติกรรมต่างกันจริง
- ศัตรูทั้ง 3 แบบมีพฤติกรรม/ความทนทานต่างกันจริง
- Tower ยิงและทำ damage ได้
- ผู้เล่นได้รับ Essence และใช้ซื้อ/อัปเกรดได้
- Wave 1–5 ทำงานตามลำดับและความยากเพิ่มขึ้น
- Win/Lose/Restart ทำงานครบ
- Unit tests, full test suite, build และ smoke test ผ่าน
- Browser real-input test ผ่านบน mobile-sized viewport
- Console ไม่มี uncaught error ระหว่างการเล่นหนึ่งรอบ
- Remaining KPI ถูกระบุชัดเจน ไม่แอบสรุปแทนเป็น PASS

## 13. Future Expansion After MVP

สิ่งต่อไปนี้พิจารณาได้หลัง Milestone 1 ผ่านและผ่าน playtest เท่านั้น:

- หลายแผนที่และ campaign
- ตัวละคร Hero จาก Shadow Kingdom
- Faction-specific Tower
- Branching upgrade
- Story choice ที่มีผลต่อเมือง
- Boss หลายรูปแบบ
- Save/progression
- เชื่อม lore กับเกมหลัก

ห้ามเพิ่มสิ่งเหล่านี้ระหว่าง Milestone 1 หากยังไม่ผ่าน core loop และ real-input QA

## 14. Design Decisions and Reasons

- **Portrait:** เพราะพี่เอกต้องการให้เล่นมือถือและเล่นมือเดียวได้สะดวก
- **Fixed placement:** ลดความซับซ้อนของ touch interaction และควบคุม balance ด่านแรกได้ดี
- **Chibi Anime Pixel Art:** อ่านง่ายบนจอเล็กและทำให้ตัวละครมีเอกลักษณ์โดยไม่ต้องใช้ sprite ใหญ่
- **Difficulty แบบผสม:** ให้ผู้เล่นเรียนรู้ในช่วงต้น แต่ยังมีแรงกดดันและความลุ้นในช่วงท้าย
- **3 Towers/3 Enemies/5 Waves:** ขนาดพอดีสำหรับพิสูจน์ gameplay loop โดยไม่สร้าง content มากเกินจำเป็น
- **แยก logic จาก Phaser:** ทำให้กฎเกมทดสอบได้และลดความเสี่ยงจาก Scene ที่ใหญ่เกินไป

## 15. Review Status

สถานะเอกสารนี้คือ `DESIGN_READY_FOR_USER_REVIEW` ค่ะ ยังไม่มีการสร้างโค้ดหรือ scaffold ใหม่จากเอกสารนี้ จนกว่าพี่เอกจะตรวจและอนุมัติ Design Spec ก่อน
