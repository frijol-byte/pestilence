import * as THREE from 'three';
import { buildGrid, traceWalls, doorSegment, validate } from '../lib/grid.mjs';
import { paintFloor, paintRock, paintPillarTop, mulberry32 } from './paint.mjs';
import { paintOutdoor } from './paint-outdoor.mjs';
import { buildProp, buildDoor, buildStairs, buildRubble, flame } from './props.mjs';

const params = new URLSearchParams(location.search);
const mapId = params.get('map') ?? 'crypte-saint-roch';
const def = (await import(`../maps/${mapId}.mjs`)).default;
const status = document.getElementById('status');
document.getElementById('title').textContent = def.name;

// Outdoor maps are terrain bands with no walls; dungeon maps are carved from solid rock.
const outdoor = def.kind === 'outdoor';
const W = def.width, H = def.height, PX = def.gridSize;
const lights = def.lights ?? [];
let grid = null, doors = [], walls = [];
if (!outdoor) {
  grid = buildGrid(def);
  const errors = validate(def, grid);
  if (errors.length) {
    status.textContent = errors.join(' | ');
    status.style.color = '#f66';
    throw new Error(errors.join('\n'));
  }
  doors = def.doors ?? [];
  walls = traceWalls(grid, doors);
}

/* ---------------- textures ---------------- */
const floorPaint = outdoor ? paintOutdoor(def) : paintFloor(def, grid, walls, doors);

function tex(canvas, srgb = true) {
  const t = new THREE.CanvasTexture(canvas);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

/* ---------------- renderer / camera ---------------- */
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setSize(W * PX, H * PX, false);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById('stage').appendChild(renderer.domElement);

// Strict top-down orthographic view: 1 world unit = 1 grid cell, +z points down the screen.
const camera = new THREE.OrthographicCamera(-W / 2, W / 2, H / 2, -H / 2, 0.1, 200);
camera.position.set(W / 2, 100, H / 2);
camera.up.set(0, 0, -1);
camera.lookAt(W / 2, 0, H / 2);

const scene = new THREE.Scene();
scene.background = new THREE.Color('#000');

const WALL_H = 4;
const LIGHT_Y = 2.2;

// Floor
{
  const g = new THREE.PlaneGeometry(W, H);
  g.rotateX(-Math.PI / 2);
  const m = new THREE.MeshStandardMaterial({
    map: tex(floorPaint.color),
    bumpMap: tex(floorPaint.bump, false),
    bumpScale: outdoor ? 1.5 : 3,
    roughness: 0.93,
    ...(outdoor ? { roughnessMap: tex(floorPaint.rough, false) } : {}),
  });
  const floor = new THREE.Mesh(g, m);
  floor.position.set(W / 2, 0, H / 2);
  floor.receiveShadow = true;
  scene.add(floor);
}

// Rock mass: unlit painted top plane + invisible-from-above boxes that cast shadows.
if (!outdoor) {
  const rockPaint = paintRock(def, grid, walls);
  const g = new THREE.PlaneGeometry(W, H);
  g.rotateX(-Math.PI / 2);
  const top = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ map: tex(rockPaint), transparent: true, alphaTest: 0.5 }));
  top.position.set(W / 2, WALL_H + 0.02, H / 2);
  scene.add(top);

  const shadowCells = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (grid.isFloor(x, y)) continue;
    let nearFloor = false;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) nearFloor ||= grid.isFloor(x + dx, y + dy);
    if (nearFloor && !grid.isPillar(x, y)) shadowCells.push([x, y]);
  }
  const box = new THREE.BoxGeometry(1, WALL_H, 1);
  const inst = new THREE.InstancedMesh(box, new THREE.MeshStandardMaterial({ color: '#2a2521' }), shadowCells.length);
  const mtx = new THREE.Matrix4();
  shadowCells.forEach(([x, y], i) => inst.setMatrixAt(i, mtx.makeTranslation(x + 0.5, WALL_H / 2, y + 0.5)));
  inst.castShadow = true;
  scene.add(inst);
}

// Pillars: stone piers whose top face carries a carved quatrefoil.
if (!outdoor) {
  const topMat = new THREE.MeshBasicMaterial({ map: tex(paintPillarTop()) });
  const side = new THREE.MeshStandardMaterial({ color: '#4d4740' });
  const mats = [side, side, topMat, side, side, side];
  const g = new THREE.BoxGeometry(0.98, WALL_H - 0.4, 0.98);
  for (const [x, y] of def.pillars ?? []) {
    const p = new THREE.Mesh(g, mats);
    p.position.set(x + 0.5, (WALL_H - 0.4) / 2, y + 0.5);
    p.castShadow = true;
    scene.add(p);
  }
}

// Doors, stairs, rubble, props
for (const d of doors) scene.add(buildDoor(d, doorSegment(d), WALL_H));
for (const s of def.stairs ?? []) scene.add(buildStairs(s));
const rand = mulberry32(def.seed + 99);
for (const f of def.features ?? []) if (f.type === 'rubble') scene.add(buildRubble(f, rand));
for (const p of def.props ?? []) {
  const obj = buildProp(p, rand);
  if (obj) scene.add(obj);
}

/* ---------------- lighting ---------------- */
function keyLight(color, intensity, dir) {
  const key = new THREE.DirectionalLight(color, intensity);
  key.position.set(W / 2 + dir.x * 40, dir.y * 40, H / 2 + dir.z * 40);
  key.target.position.set(W / 2, 0, H / 2);
  key.castShadow = true;
  key.shadow.mapSize.set(4096, 4096);
  Object.assign(key.shadow.camera, { left: -W, right: W, top: H, bottom: -H, near: 1, far: 150 });
  key.shadow.bias = -0.0005;
  key.shadow.radius = 4;
  scene.add(key, key.target);
}

if (outdoor) {
  // Sun from def.sun (azimuth clockwise from north, elevation above the horizon).
  const az = ((def.sun?.azimuth ?? 200) * Math.PI) / 180, el = ((def.sun?.elevation ?? 45) * Math.PI) / 180;
  scene.add(new THREE.HemisphereLight('#d6e2f0', '#6b5a3a', 1.3));
  scene.add(new THREE.AmbientLight('#ffffff', 0.35));
  keyLight('#ffe6bf', 2.4, { x: Math.sin(az) * Math.cos(el), y: Math.sin(el), z: -Math.cos(az) * Math.cos(el) });
} else {
  scene.add(new THREE.AmbientLight('#8a93a6', 1.35));
  scene.add(new THREE.HemisphereLight('#b8c0d0', '#2a2420', 0.7));
  // A soft, very high key light so props read with depth even far from any light source.
  keyLight('#c9cfe0', 0.55, { x: -6 / 40, y: 1, z: -10 / 40 });
}

for (const l of lights) {
  const cells = l.dim / 5;
  // Magical lights are left mostly to Foundry's animated lighting; bake only a hint of them.
  const baked = l.anim === 'ghost' || l.anim === 'pulse' ? 0.55 : 1;
  const light = new THREE.PointLight(l.color, (2.2 + cells * 1.1) * baked, cells * 1.25, 1.2);
  light.position.set(l.x, LIGHT_Y, l.y);
  if (l.prop !== null || l.anim === 'pulse' || l.anim === 'flame') {
    light.castShadow = true;
    light.shadow.mapSize.set(1024, 1024);
    light.shadow.bias = -0.004;
    light.shadow.radius = 6;
  }
  scene.add(light);
  if (l.prop) {
    const p = buildProp({ type: l.prop, x: l.x, y: l.y }, rand);
    if (p) scene.add(p);
  }
}

/* ---------------- render + save ---------------- */
renderer.render(scene, camera);
status.textContent = `rendered ${W * PX}×${H * PX}px · ${walls.length} wall runs · ${doors.length} doors · ${lights.length} lights`;
window.__rendered = true;

async function blobOf(canvas, type = 'image/webp', q = 0.9) {
  return new Promise((res) => canvas.toBlob(res, type, q));
}

async function save() {
  status.textContent = 'saving…';
  const full = await blobOf(renderer.domElement);
  await fetch(`/save?file=maps/${def.id}.webp`, { method: 'POST', body: full });
  const thumb = document.createElement('canvas');
  thumb.width = 480;
  thumb.height = Math.round((480 * H) / W);
  thumb.getContext('2d').drawImage(renderer.domElement, 0, 0, thumb.width, thumb.height);
  await fetch(`/save?file=maps/${def.id}-thumb.webp`, { method: 'POST', body: await blobOf(thumb, 'image/webp', 0.8) });
  status.textContent = `saved assets/maps/${def.id}.webp (${(full.size / 1e6).toFixed(1)} MB)`;
  window.__saved = true;
}
document.getElementById('save').onclick = save;
if (params.has('save')) await save();

/* ---------------- debug overlay: exactly what Foundry will get ---------------- */
const overlay = document.createElement('canvas');
overlay.id = 'overlay';
overlay.width = W * PX;
overlay.height = H * PX;
overlay.style.width = '100%';
overlay.style.display = 'none';
document.getElementById('stage').appendChild(overlay);
{
  const o = overlay.getContext('2d');
  o.strokeStyle = 'rgba(255,255,255,0.18)';
  o.lineWidth = 1;
  for (let x = 0; x <= W; x++) { o.beginPath(); o.moveTo(x * PX, 0); o.lineTo(x * PX, H * PX); o.stroke(); }
  for (let y = 0; y <= H; y++) { o.beginPath(); o.moveTo(0, y * PX); o.lineTo(W * PX, y * PX); o.stroke(); }
  o.lineWidth = 8;
  const line = ([a, b, c, d], color) => { o.strokeStyle = color; o.beginPath(); o.moveTo(a * PX, b * PX); o.lineTo(c * PX, d * PX); o.stroke(); };
  for (const w of walls) line(w, '#ff2d55');
  for (const d of doors) line(doorSegment(d), d.type === 'secret' ? '#d05bff' : d.state === 'locked' ? '#ffcc00' : '#33e07a');
  for (const l of lights) {
    o.strokeStyle = l.color; o.lineWidth = 3;
    o.beginPath(); o.arc(l.x * PX, l.y * PX, (l.dim / 5) * PX, 0, Math.PI * 2); o.stroke();
    o.fillStyle = l.color; o.beginPath(); o.arc(l.x * PX, l.y * PX, 10, 0, Math.PI * 2); o.fill();
  }
}
const toggle = document.getElementById('showWalls');
toggle.onchange = () => (overlay.style.display = toggle.checked ? 'block' : 'none');
if (params.has('walls')) { toggle.checked = true; overlay.style.display = 'block'; }

// Debug export: full image, a 2x-downscaled image, and one with the Foundry walls overlaid.
window.__debugExport = async (crop) => {
  const put = async (name, c) => fetch(`/save?debug=1&file=${name}`, { method: 'POST', body: await blobOf(c, 'image/png') });
  const mk = (w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d')); return c; };
  const [sx, sy, sw, sh] = crop ?? [0, 0, W * PX, H * PX];
  const scale = crop ? 1 : 0.5;
  await put(`${def.id}${crop ? '-crop' : ''}.png`, mk(sw * scale, sh * scale, (c) => c.drawImage(renderer.domElement, sx, sy, sw, sh, 0, 0, sw * scale, sh * scale)));
  await put(`${def.id}${crop ? '-crop' : ''}-walls.png`, mk(sw * scale, sh * scale, (c) => {
    c.drawImage(renderer.domElement, sx, sy, sw, sh, 0, 0, sw * scale, sh * scale);
    c.drawImage(overlay, sx, sy, sw, sh, 0, 0, sw * scale, sh * scale);
  }));
  return 'ok';
};
