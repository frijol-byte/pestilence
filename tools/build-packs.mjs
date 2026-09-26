// Compiles the module's compendiums (Foundry v14 LevelDB):
//   pestilence-scenes    <- src/maps/*.mjs            (image + walls/doors/lights from the same data)
//   pestilence-journals  <- src/content/journals/*.mjs
//   pestilence-actors    <- src/content/actors/*.mjs
//   pestilence-items     <- src/content/items/*.mjs
//
// v14 notes:
//  - The background image lives on an embedded Level document (`!scenes.levels!<scene>.<level>`),
//    never on a top-level `background` field.
//  - `_stats.coreVersion` must be stamped, otherwise Foundry's v14 migration rebuilds `levels`
//    from the (absent) legacy background and the scene imports blank.
//  - Embedded documents are separate LevelDB entries; the parent stores only their ids.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { ClassicLevel } from 'classic-level';
import { buildGrid, traceWalls, doorSegment, validate } from '../src/lib/grid.mjs';
import { fid, MODULE_ID, PACKS } from '../src/lib/ids.mjs';
import { CORE_VERSION, SYSTEM_VERSION } from '../src/lib/pf2e.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MODULE_DIR = path.join(ROOT, 'module', MODULE_ID);

const WALL = { NONE: 0, NORMAL: 20 };
const DOOR = { NONE: 0, DOOR: 1, SECRET: 2 };
const DOOR_STATE = { closed: 0, open: 1, locked: 2 };

function sceneEntries(def) {
  const outdoor = def.kind === 'outdoor';
  const PX = def.gridSize;
  const sceneId = fid(`scene:${def.id}`);
  const levelId = fid(`level:${def.id}`);
  const assetPath = `modules/${MODULE_ID}/assets/maps/${def.id}`;
  const px = (v) => Math.round(v * PX);

  const walls = [];
  if (!outdoor) {
    const grid = buildGrid(def);
    const errors = validate(def, grid);
    if (errors.length) throw new Error(`${def.id}:\n  ${errors.join('\n  ')}`);
    for (const [i, c] of traceWalls(grid, def.doors).entries()) {
      walls.push({
        _id: fid(`wall:${def.id}:${i}`),
        c: c.map(px),
        move: WALL.NORMAL, sight: WALL.NORMAL, light: WALL.NORMAL, sound: WALL.NORMAL,
        dir: 0, door: DOOR.NONE, ds: 0,
        levels: [levelId],
        flags: {},
      });
    }
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
  }

  const lights = (def.lights ?? []).map((l, i) => ({
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

  const darkness = def.darkness ?? 1;
  const now = Date.now();
  const scene = {
    _id: sceneId,
    name: def.name,
    navName: '',
    navigation: true,
    navOrder: 0,
    active: false,
    initial: { x: null, y: null, scale: null },
    width: def.width * PX,
    height: def.height * PX,
    padding: 0,
    shiftX: 0,
    shiftY: 0,
    thumb: `${assetPath}-thumb.webp`,
    tokenVision: true,
    grid: { type: 1, size: PX, distance: 5, units: 'ft', style: 'solidLines', thickness: 1, color: '#000000', alpha: 0.15 },
    environment: { darknessLevel: darkness, darknessLevelLock: false, globalLight: { enabled: darkness < 0.5 } },
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
    summary: `  ${def.name}: ${walls.length} walls, ${lights.length} lights${outdoor ? ' (outdoor)' : ''}`,
    entries: [
      [`!scenes!${sceneId}`, scene],
      [`!scenes.levels!${sceneId}.${levelId}`, level],
      ...walls.map((w) => [`!scenes.walls!${sceneId}.${w._id}`, w]),
      ...lights.map((l) => [`!scenes.lights!${sceneId}.${l._id}`, l]),
    ],
    requiredAssets: [`${def.id}.webp`, `${def.id}-thumb.webp`],
  };
}

async function modulesIn(dir) {
  const abs = path.join(ROOT, dir);
  const files = (await fs.readdir(abs).catch(() => [])).filter((f) => f.endsWith('.mjs')).sort();
  return Promise.all(files.map(async (f) => ({ file: `${dir}/${f}`, mod: (await import(pathToFileURL(path.join(abs, f)))).default })));
}

async function writePack(name, entries) {
  const dir = path.join(MODULE_DIR, 'packs', name);
  await fs.rm(dir, { recursive: true, force: true });
  const db = new ClassicLevel(dir, { keyEncoding: 'utf8', valueEncoding: 'json' });
  await db.batch(entries.map(([key, value]) => ({ type: 'put', key, value })));
  await db.compactRange('\x00', '￿');
  await db.close();
  console.log(`wrote ${String(entries.length).padStart(4)} entries -> packs/${name}`);
}

async function main() {
  const packs = { scenes: [], journals: [], actors: [], items: [] };

  console.log('scenes:');
  for (const { mod: def } of await modulesIn('src/maps')) {
    const built = sceneEntries(def);
    for (const a of built.requiredAssets) {
      await fs.access(path.join(MODULE_DIR, 'assets', 'maps', a)).catch(() => {
        throw new Error(`missing ${a}: render and save the map first (npm run serve, then Save to module)`);
      });
    }
    console.log(built.summary);
    packs.scenes.push(...built.entries);
  }
  for (const kind of ['journals', 'actors', 'items']) {
    for (const { file, mod } of await modulesIn(`src/content/${kind}`)) {
      if (!Array.isArray(mod)) throw new Error(`${file} must export an array of pack entries`);
      packs[kind].push(...mod);
    }
  }

  // Every @UUID link into this module must point at a document we are building.
  const known = new Set();
  for (const [kind, entries] of Object.entries(packs)) {
    for (const [key, doc] of entries) {
      const [, collection, parents] = key.split('!');
      const pack = PACKS[kind].name;
      if (!collection.includes('.')) known.add(`Compendium.${MODULE_ID}.${pack}.${PACKS[kind].type}.${doc._id}`);
      else if (collection === 'journal.pages') {
        const [journalId] = parents.split('.');
        known.add(`Compendium.${MODULE_ID}.${pack}.JournalEntry.${journalId}.JournalEntryPage.${doc._id}`);
      }
    }
  }
  const linkRe = new RegExp(`Compendium\\.${MODULE_ID}\\.[\\w-]+\\.\\w+\\.[A-Za-z0-9]{16}(?:\\.JournalEntryPage\\.[A-Za-z0-9]{16})?`, 'g');
  const broken = new Set();
  for (const entries of Object.values(packs)) {
    for (const [, doc] of entries) for (const m of JSON.stringify(doc).matchAll(linkRe)) if (!known.has(m[0])) broken.add(m[0]);
  }
  if (broken.size) throw new Error(`broken links:\n  ${[...broken].join('\n  ')}`);

  for (const [kind, entries] of Object.entries(packs)) await writePack(PACKS[kind].name, entries);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
