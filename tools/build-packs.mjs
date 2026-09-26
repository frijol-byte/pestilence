// Compiles map definitions into the module's Scene compendium (Foundry v14 LevelDB).
//
// v14 notes:
//  - The background image lives on an embedded Level document (`!scenes.levels!<scene>.<level>`),
//    never on a top-level `background` field.
//  - `_stats.coreVersion` must be stamped, otherwise Foundry's v14 migration rebuilds `levels`
//    from the (absent) legacy background and the scene imports blank.
//  - Embedded documents are separate LevelDB entries; the parent stores only their ids.
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { ClassicLevel } from 'classic-level';
import { buildGrid, traceWalls, doorSegment, validate } from '../src/lib/grid.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MODULE_ID = 'pestilence';
const MODULE_DIR = path.join(ROOT, 'module', MODULE_ID);
const CORE_VERSION = '14.365';
const SYSTEM_VERSION = '8.5.1';

const WALL = { NONE: 0, NORMAL: 20 };
const DOOR = { NONE: 0, DOOR: 1, SECRET: 2 };
const DOOR_STATE = { closed: 0, open: 1, locked: 2 };

const B62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
/** Deterministic 16-character Foundry id, so rebuilds don't orphan world copies. */
function fid(slug) {
  const bytes = crypto.createHash('sha256').update(`${MODULE_ID}:${slug}`).digest();
  let out = '';
  for (let i = 0; i < 16; i++) out += B62[bytes[i] % 62];
  return out;
}

function sceneEntries(def) {
  const grid = buildGrid(def);
  const errors = validate(def, grid);
  if (errors.length) throw new Error(`${def.id}:\n  ${errors.join('\n  ')}`);

  const PX = def.gridSize;
  const sceneId = fid(`scene:${def.id}`);
  const levelId = fid(`level:${def.id}`);
  const assetPath = `modules/${MODULE_ID}/assets/maps/${def.id}`;
  const px = (v) => Math.round(v * PX);

  const walls = traceWalls(grid, def.doors).map((c, i) => ({
    _id: fid(`wall:${def.id}:${i}`),
    c: c.map(px),
    move: WALL.NORMAL, sight: WALL.NORMAL, light: WALL.NORMAL, sound: WALL.NORMAL,
    dir: 0, door: DOOR.NONE, ds: 0,
    levels: [levelId],
    flags: {},
  }));
  for (const [i, d] of (def.doors ?? []).entries()) {
    walls.push({
      _id: fid(`door:${def.id}:${i}`),
      c: doorSegment(d).map(px),
      move: WALL.NORMAL, sight: WALL.NORMAL, light: WALL.NORMAL, sound: WALL.NORMAL,
      dir: 0,
      door: d.type === 'secret' ? DOOR.SECRET : DOOR.DOOR,
      ds: DOOR_STATE[d.state ?? 'closed'],
      levels: [levelId],
      flags: {},
    });
  }

  const lights = def.lights.map((l, i) => ({
    _id: fid(`light:${def.id}:${i}`),
    name: l.name,
    x: px(l.x), y: px(l.y),
    elevation: 0, rotation: 0,
    walls: true, vision: false, hidden: false, locked: false,
    levels: [levelId],
    config: {
      negative: false, priority: 0,
      alpha: l.alpha, angle: 360,
      bright: l.bright, dim: l.dim,
      color: l.color, coloration: 1,
      attenuation: 0.5, luminosity: 0.5, saturation: 0, contrast: 0, shadows: 0,
      animation: l.anim ? { type: l.anim, speed: 3, intensity: 3, reverse: false } : { type: null, speed: 5, intensity: 5, reverse: false },
      darkness: { min: 0, max: 1 },
    },
    flags: {},
  }));

  const level = {
    _id: levelId,
    name: def.name,
    sort: 0,
    elevation: { bottom: 0, top: 20 },
    background: { src: `${assetPath}.webp` },
    flags: {},
  };

  const now = Date.now();
  const scene = {
    _id: sceneId,
    name: def.name,
    navName: '',
    navigation: true,
    navOrder: 0,
    active: false,
    initial: { x: null, y: null, scale: null },
    width: grid.W * PX,
    height: grid.H * PX,
    padding: 0,
    shiftX: 0,
    shiftY: 0,
    thumb: `${assetPath}-thumb.webp`,
    tokenVision: true,
    grid: { type: 1, size: PX, distance: 5, units: 'ft', style: 'solidLines', thickness: 1, color: '#000000', alpha: 0.15 },
    environment: { darknessLevel: 1, darknessLevelLock: false, globalLight: { enabled: false } },
    fog: { exploration: true },
    levels: [levelId],
    walls: walls.map((w) => w._id),
    lights: lights.map((l) => l._id),
    tokens: [], notes: [], drawings: [], sounds: [], tiles: [], regions: [],
    journal: null,
    playlist: null,
    folder: null,
    sort: 0,
    ownership: { default: 0 },
    flags: { [MODULE_ID]: { source: `src/maps/${def.id}.mjs` } },
    _stats: {
      coreVersion: CORE_VERSION,
      systemId: 'pf2e',
      systemVersion: SYSTEM_VERSION,
      createdTime: now,
      modifiedTime: now,
      lastModifiedBy: null,
      compendiumSource: null,
      duplicateSource: null,
    },
  };

  return {
    summary: `${def.name}: ${walls.length} walls (${def.doors?.length ?? 0} doors), ${lights.length} lights`,
    entries: [
      [`!scenes!${sceneId}`, scene],
      [`!scenes.levels!${sceneId}.${levelId}`, level],
      ...walls.map((w) => [`!scenes.walls!${sceneId}.${w._id}`, w]),
      ...lights.map((l) => [`!scenes.lights!${sceneId}.${l._id}`, l]),
    ],
    requiredAssets: [`${def.id}.webp`, `${def.id}-thumb.webp`],
  };
}

async function main() {
  const mapDir = path.join(ROOT, 'src', 'maps');
  const files = (await fs.readdir(mapDir)).filter((f) => f.endsWith('.mjs'));
  const packDir = path.join(MODULE_DIR, 'packs', 'pestilence-scenes');
  const all = [];
  for (const f of files) {
    const def = (await import(pathToFileURL(path.join(mapDir, f)))).default;
    const built = sceneEntries(def);
    for (const a of built.requiredAssets) {
      await fs.access(path.join(MODULE_DIR, 'assets', 'maps', a)).catch(() => {
        throw new Error(`missing ${a} — render and save the map first (npm run serve, then Save to module)`);
      });
    }
    console.log(built.summary);
    all.push(...built.entries);
  }
  await fs.rm(packDir, { recursive: true, force: true });
  const db = new ClassicLevel(packDir, { keyEncoding: 'utf8', valueEncoding: 'json' });
  await db.batch(all.map(([key, value]) => ({ type: 'put', key, value })));
  await db.compactRange('\x00', '￿');
  await db.close();
  console.log(`wrote ${all.length} entries to ${path.relative(ROOT, packDir)}`);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
