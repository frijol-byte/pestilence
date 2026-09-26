// 3D props, built from primitives. World units = grid cells; x = east, z = south, y = up.
import * as THREE from 'three';
import { paintWood } from './paint.mjs';

const matCache = new Map();
function mat(color, rough = 0.9, metal = 0, extra = {}) {
  const k = `${color}|${rough}|${metal}|${JSON.stringify(extra)}`;
  if (!matCache.has(k)) matCache.set(k, new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal, ...extra }));
  return matCache.get(k);
}
const STONE = () => mat('#8a8276');
const STONE_DARK = () => mat('#5d574f');
const BONE = () => mat('#d9cfb4', 0.8);
const LINEN = () => mat('#b9b09a', 0.95);
let woodMat;
const WOOD = () => {
  if (!woodMat) {
    const t = new THREE.CanvasTexture(paintWood());
    t.colorSpace = THREE.SRGBColorSpace;
    woodMat = new THREE.MeshStandardMaterial({ map: t, roughness: 0.85 });
  }
  return woodMat;
};
const IRON = () => mat('#3a3a3c', 0.5, 0.7);

function mesh(geo, material, { cast = true, receive = true } = {}) {
  const m = new THREE.Mesh(geo, material);
  m.castShadow = cast;
  m.receiveShadow = receive;
  return m;
}

function box(w, h, d, material) {
  return mesh(new THREE.BoxGeometry(w, h, d), material);
}

let glowTex;
function glowTexture() {
  if (glowTex) return glowTex;
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,230,170,1)');
  g.addColorStop(0.3, 'rgba(255,170,80,0.5)');
  g.addColorStop(1, 'rgba(255,120,40,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  glowTex = new THREE.CanvasTexture(c);
  return glowTex;
}

export function flame(color = '#ffd27a', size = 0.35) {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 6), new THREE.MeshBasicMaterial({ color })));
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTexture(), color, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.8,
  }));
  sprite.scale.set(size, size, 1);
  g.add(sprite);
  return g;
}

function candle(h, color = '#e8dcc0', flameColor) {
  const g = new THREE.Group();
  const c = mesh(new THREE.CylinderGeometry(0.035, 0.04, h, 10), mat(color, 0.6));
  c.position.y = h / 2;
  g.add(c);
  const f = flame(flameColor);
  f.position.y = h + 0.04;
  g.add(f);
  return g;
}

function skullMesh(s = 1) {
  const g = new THREE.Group();
  const cranium = mesh(new THREE.SphereGeometry(0.09 * s, 12, 10), BONE());
  cranium.scale.set(1, 0.9, 1.2);
  g.add(cranium);
  const jaw = mesh(new THREE.BoxGeometry(0.1 * s, 0.05 * s, 0.07 * s), BONE());
  jaw.position.set(0, -0.06 * s, 0.07 * s);
  g.add(jaw);
  return g;
}

function boneMesh(len) {
  const g = new THREE.Group();
  const shaft = mesh(new THREE.CylinderGeometry(0.022, 0.022, len, 6), BONE());
  shaft.rotation.z = Math.PI / 2;
  g.add(shaft);
  for (const s of [-1, 1]) {
    const knob = mesh(new THREE.SphereGeometry(0.035, 8, 6), BONE());
    knob.position.x = (s * len) / 2;
    g.add(knob);
  }
  return g;
}

const BUILDERS = {
  sarcophagus(p, rand) {
    const g = new THREE.Group();
    const base = box(p.w - 0.1, 0.8, p.h - 0.1, STONE_DARK());
    base.position.y = 0.4;
    g.add(base);
    if (p.open) {
      // lid shoved aside: whatever lay here got up
      const lid = box(p.w - 0.02, 0.12, p.h - 0.02, STONE());
      lid.position.set(0.25, 0.3, -0.75);
      lid.rotation.set(-0.35, 0.3, 0);
      g.add(lid);
      const crack = mesh(new THREE.BoxGeometry(0.02, 0.13, p.h * 0.6), mat('#2a2622'), { cast: false });
      crack.position.set(0.4, 0.3, -0.75);
      crack.rotation.set(-0.35, 0.3, 0);
      g.add(crack);
      const hollow = mesh(new THREE.BoxGeometry(p.w - 0.3, 0.02, p.h - 0.3), mat('#0b0908'), { cast: false });
      hollow.position.y = 0.81;
      g.add(hollow);
    } else {
      const lid = box(p.w + 0.02, 0.14, p.h + 0.02, STONE());
      lid.position.y = 0.87;
      g.add(lid);
      if (p.effigy) {
        const long = p.w >= p.h;
        const L = (long ? p.w : p.h) * 0.62;
        const body = mesh(new THREE.CapsuleGeometry(0.15, L - 0.3, 4, 10), mat('#a39b8c'));
        body.rotation[long ? 'z' : 'x'] = Math.PI / 2;
        body.position.y = 1.0;
        g.add(body);
        const head = mesh(new THREE.SphereGeometry(0.13, 12, 10), mat('#a39b8c'));
        head.position.set(long ? -L / 2 - 0.05 : 0, 1.02, long ? 0 : -L / 2 - 0.05);
        g.add(head);
        const hands = mesh(new THREE.ConeGeometry(0.06, 0.2, 6), mat('#a39b8c'));
        hands.position.set(long ? -L * 0.12 : 0, 1.17, 0);
        g.add(hands);
      }
    }
    g.position.set(p.x + p.w / 2, 0, p.y + p.h / 2);
    return g;
  },

  skullPile(p, rand) {
    const g = new THREE.Group();
    for (let i = 0; i < 9; i++) {
      const s = skullMesh(0.9 + rand() * 0.3);
      s.position.set((rand() - 0.5) * 0.6, 0.08 + (i > 5 ? 0.15 : 0), (rand() - 0.5) * 0.35);
      s.rotation.y = (rand() - 0.5) * 1.2;
      g.add(s);
    }
    g.position.set(p.x, 0, p.y);
    return g;
  },

  bones(p, rand) {
    const g = new THREE.Group();
    for (let i = 0; i < p.n; i++) {
      const b = boneMesh(0.22 + rand() * 0.25);
      b.position.set((rand() - 0.5) * 0.8, 0.03, (rand() - 0.5) * 0.8);
      b.rotation.y = rand() * Math.PI;
      g.add(b);
    }
    for (let i = 0; i < Math.max(1, p.n / 5); i++) {
      const s = skullMesh();
      s.position.set((rand() - 0.5) * 0.6, 0.08, (rand() - 0.5) * 0.6);
      s.rotation.set(rand(), rand() * 6, rand());
      g.add(s);
    }
    g.position.set(p.x, 0, p.y);
    return g;
  },

  statue(p, rand) {
    // Saint Roch with his pilgrim's staff and faithful dog; the head has been struck off.
    const g = new THREE.Group();
    const plinth = box(1.4, 0.7, 0.8, STONE_DARK());
    plinth.position.y = 0.35;
    g.add(plinth);
    const marble = mat('#b3ab9d', 0.7);
    const robe = mesh(new THREE.CylinderGeometry(0.22, 0.33, 1.3, 14), marble);
    robe.position.set(-0.15, 1.35, 0);
    g.add(robe);
    const shoulders = mesh(new THREE.SphereGeometry(0.26, 14, 10), marble);
    shoulders.scale.set(1.3, 0.6, 0.9);
    shoulders.position.set(-0.15, 1.98, 0);
    g.add(shoulders);
    const neck = mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.1, 8), mat('#6f685e'));
    neck.position.set(-0.15, 2.1, 0);
    g.add(neck);
    const staff = mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.9, 6), marble);
    staff.position.set(0.18, 1.6, 0.12);
    g.add(staff);
    const dog = mesh(new THREE.CapsuleGeometry(0.1, 0.3, 4, 8), marble);
    dog.rotation.z = Math.PI / 2;
    dog.position.set(0.42, 0.85, 0.12);
    g.add(dog);
    const dogHead = mesh(new THREE.SphereGeometry(0.08, 10, 8), marble);
    dogHead.position.set(0.62, 0.95, 0.12);
    g.add(dogHead);
    if (p.headless) {
      const head = mesh(new THREE.SphereGeometry(0.13, 12, 10), marble);
      head.position.set(0.55, 0.12, 1.15);
      g.add(head);
      for (let i = 0; i < 6; i++) {
        const chip = mesh(new THREE.DodecahedronGeometry(0.04 + rand() * 0.04), marble);
        chip.position.set(0.2 + rand() * 0.8, 0.03, 0.7 + rand() * 0.8);
        g.add(chip);
      }
    }
    g.position.set(p.x, 0, p.y);
    return g;
  },

  pew(p, rand) {
    const g = new THREE.Group();
    const seat = box(p.w, 0.08, 0.4, WOOD());
    seat.position.y = 0.45;
    const back = box(p.w, 0.5, 0.06, WOOD());
    back.position.set(0, 0.7, 0.2);
    g.add(seat, back);
    for (const s of [-1, 1]) {
      const leg = box(0.06, 0.45, 0.4, WOOD());
      leg.position.set((s * (p.w - 0.1)) / 2, 0.22, 0);
      g.add(leg);
    }
    if (p.broken) {
      g.rotation.set(0, 0.5, 1.2);
      g.position.y = 0.25;
    }
    g.position.x += p.x + p.w / 2;
    g.position.z += p.y;
    return g;
  },

  shroud(p, rand) {
    const g = new THREE.Group();
    const body = mesh(new THREE.CapsuleGeometry(0.18, 0.75, 4, 12), LINEN());
    body.rotation.z = Math.PI / 2;
    body.scale.set(1, 1, 0.8);
    g.add(body);
    for (const t of [-0.3, 0.05, 0.35]) {
      const rope = mesh(new THREE.TorusGeometry(0.18, 0.018, 6, 16), mat('#5b4a33'));
      rope.rotation.y = Math.PI / 2;
      rope.position.x = t;
      g.add(rope);
    }
    g.rotation.y = p.rot ?? 0;
    g.position.set(p.x, p.sunk ? 0.02 : 0.15, p.y);
    return g;
  },

  cart(p, rand) {
    // The dead-cart, still loaded.
    const g = new THREE.Group();
    const bed = box(1.3, 0.1, 0.7, WOOD());
    bed.position.y = 0.45;
    g.add(bed);
    for (const s of [-1, 1]) {
      const side = box(1.3, 0.25, 0.05, WOOD());
      side.position.set(0, 0.6, (s * 0.7) / 2);
      g.add(side);
      const wheel = mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.07, 16), mat('#3a281a'));
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(0.1, 0.38, s * 0.42);
      g.add(wheel);
      const handle = box(0.7, 0.05, 0.05, WOOD());
      handle.position.set(-0.95, 0.5, s * 0.25);
      g.add(handle);
    }
    const body = BUILDERS.shroud({ x: 0, y: 0, rot: 0 }, rand);
    body.position.set(0.05, 0.68, -0.05);
    g.add(body);
    g.rotation.y = p.rot ?? 0;
    g.position.set(p.x, 0, p.y);
    return g;
  },

  sacks(p, rand) {
    const g = new THREE.Group();
    for (let i = 0; i < 4; i++) {
      const s = mesh(new THREE.SphereGeometry(0.22, 12, 10), mat('#9c8c6a'));
      s.scale.set(1.2, 0.6, 0.9);
      s.position.set((rand() - 0.5) * 0.6, 0.12 + (i === 3 ? 0.2 : 0), (rand() - 0.5) * 0.5);
      s.rotation.y = rand() * 3;
      g.add(s);
    }
    const spill = mesh(new THREE.CylinderGeometry(0.3, 0.35, 0.02, 16), mat('#dcdccc'), { cast: false });
    spill.position.set(0.35, 0.01, 0.3);
    g.add(spill);
    g.position.set(p.x, 0, p.y);
    return g;
  },

  beakMask(p) {
    // A plague doctor's mask, dropped where its wearer was taken.
    const g = new THREE.Group();
    const leather = mat('#221a15', 0.6);
    const hood = mesh(new THREE.SphereGeometry(0.16, 14, 10), leather);
    hood.scale.set(1, 0.8, 1);
    hood.position.y = 0.12;
    g.add(hood);
    const beak = mesh(new THREE.ConeGeometry(0.08, 0.45, 12), leather);
    beak.rotation.z = -Math.PI / 2;
    beak.position.set(0.3, 0.1, 0);
    g.add(beak);
    for (const s of [-1, 1]) {
      const lens = mesh(new THREE.SphereGeometry(0.045, 10, 8), mat('#b0802a', 0.2, 0.5, { emissive: '#3a2400' }));
      lens.position.set(0.1, 0.2, s * 0.07);
      g.add(lens);
    }
    g.rotation.y = p.rot ?? 0;
    g.position.set(p.x, 0, p.y);
    return g;
  },

  altar(p, rand) {
    const g = new THREE.Group();
    const stone = box(p.w, 1.0, p.h, STONE_DARK());
    stone.position.y = 0.5;
    g.add(stone);
    const cloth = box(p.w * 0.7, 0.02, p.h + 0.08, mat('#5a0d10', 0.9));
    cloth.position.y = 1.01;
    g.add(cloth);
    // inverted cross laid on the altar
    const crossMat = mat('#8a6a2a', 0.35, 0.8);
    const beam = box(0.08, 0.04, 0.7, crossMat);
    beam.position.set(0, 1.05, 0);
    const bar = box(0.4, 0.04, 0.08, crossMat);
    bar.position.set(0, 1.05, 0.18);
    g.add(beam, bar);
    // broken reliquary, emptied
    const rel = box(0.3, 0.2, 0.2, mat('#a88a3a', 0.3, 0.9));
    rel.position.set(-p.w * 0.3, 1.12, 0);
    const relLid = box(0.32, 0.04, 0.22, mat('#a88a3a', 0.3, 0.9));
    relLid.position.set(-p.w * 0.3 - 0.25, 1.05, 0.25);
    relLid.rotation.y = 0.7;
    g.add(rel, relLid);
    for (const x of [-p.w * 0.42, p.w * 0.25, p.w * 0.42]) {
      const c = candle(0.25 + rand() * 0.1, '#1b1715', '#ff7a4a');
      c.position.set(x, 1.02, (rand() - 0.5) * 0.3);
      g.add(c);
    }
    g.position.set(p.x + p.w / 2, 0, p.y + p.h / 2);
    return g;
  },

  circleCandles(p, rand) {
    const g = new THREE.Group();
    for (let i = 0; i < p.points; i++) {
      const a = Math.PI / 2 + (i * Math.PI * 2) / p.points;
      const c = candle(0.2 + rand() * 0.15, '#141110', '#ff5a3c');
      c.position.set(Math.cos(a) * p.r * 0.8, 0, Math.sin(a) * p.r * 0.8);
      g.add(c);
    }
    g.position.set(p.x, 0, p.y);
    return g;
  },

  chains(p, rand) {
    const g = new THREE.Group();
    const facing = p.x < 4 ? 1 : -1;
    for (let c = 0; c < p.n; c++) {
      for (let i = 0; i < 7; i++) {
        const link = mesh(new THREE.TorusGeometry(0.05, 0.014, 6, 10), IRON());
        link.position.set(facing * (0.05 + i * 0.075), 0.03, c * 0.6 + Math.sin(i * 0.8 + c) * 0.05);
        link.rotation.set(i % 2 ? Math.PI / 2 : 0, 0, Math.PI / 2);
        g.add(link);
      }
      const shackle = mesh(new THREE.TorusGeometry(0.09, 0.02, 6, 14), IRON());
      shackle.rotation.x = Math.PI / 2;
      shackle.position.set(facing * 0.62, 0.02, c * 0.6);
      g.add(shackle);
    }
    g.position.set(p.x, 0, p.y);
    return g;
  },

  candles(p, rand) {
    const g = new THREE.Group();
    const n = 3 + ((rand() * 3) | 0);
    for (let i = 0; i < n; i++) {
      const c = candle(0.1 + rand() * 0.25);
      c.position.set((rand() - 0.5) * 0.35, 0, (rand() - 0.5) * 0.25);
      g.add(c);
    }
    g.position.set(p.x, 0, p.y);
    return g;
  },

  candelabrum(p, rand) {
    // Seven-branched iron stand.
    const g = new THREE.Group();
    const post = mesh(new THREE.CylinderGeometry(0.03, 0.06, 1.1, 8), IRON());
    post.position.y = 0.55;
    g.add(post);
    const ring = mesh(new THREE.TorusGeometry(0.3, 0.02, 6, 24), IRON());
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 1.1;
    g.add(ring);
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2;
      const c = candle(0.12 + rand() * 0.08);
      c.position.set(Math.cos(a) * 0.3, 1.1, Math.sin(a) * 0.3);
      g.add(c);
    }
    g.position.set(p.x, 0, p.y);
    return g;
  },

  /* ---------------- outdoor ---------------- */

  waysideCross(p) {
    // A weathered stone calvaire; its Christ has lost his face to the rain.
    const g = new THREE.Group();
    const stone = mat('#a39d8e', 0.95);
    const step1 = box(0.7, 0.2, 0.7, mat('#7d776b', 0.95));
    step1.position.y = 0.1;
    const shaft = box(0.2, 2.3, 0.2, stone);
    shaft.position.y = 1.35;
    shaft.position.z = 0.1;
    // the cross is laid out north-south so its shape reads from above
    const upright = box(0.22, 0.2, 1.5, stone);
    upright.position.set(0, 2.4, 0.1);
    const bar = box(1.0, 0.2, 0.22, stone);
    bar.position.set(0, 2.42, -0.2);
    const lichen = mesh(new THREE.SphereGeometry(0.09, 8, 6), mat('#8a9a55'));
    lichen.scale.set(1, 0.3, 1.3);
    lichen.position.set(0.3, 2.52, -0.2);
    g.add(step1, shaft, upright, bar, lichen);
    g.position.set(p.x, 0, p.y);
    return g;
  },

  overturnedCart(p, rand) {
    // A farm cart flipped on its back across half the road: the knight's barricade. It is empty.
    const g = new THREE.Group();
    const bed = box(2.4, 0.12, 1.3, WOOD());
    bed.position.y = 0.55;
    g.add(bed);
    for (const s of [-1, 1]) {
      const side = box(2.4, 0.45, 0.07, WOOD());
      side.position.set(0, 0.25, (s * 1.3) / 2);
      g.add(side);
      const wheel = mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.09, 18), mat('#3a281a'));
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(0.2, 1.05, s * 0.78);
      g.add(wheel);
    }
    const axle = mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.7, 8), mat('#2c2016'));
    axle.rotation.x = Math.PI / 2;
    axle.position.set(0.2, 0.7, 0);
    g.add(axle);
    for (const s of [-1, 1]) {
      const shaft = box(1.3, 0.07, 0.07, WOOD());
      shaft.position.set(-1.8, 0.1, s * 0.35);
      shaft.rotation.y = s * 0.12;
      g.add(shaft);
    }
    g.rotation.y = Math.PI / 2 + (p.rot ?? 0);
    g.position.set(p.x, 0, p.y);
    return g;
  },

  willow(p, rand) {
    const g = new THREE.Group();
    const trunk = mesh(new THREE.CylinderGeometry(0.18, 0.28, 2.6, 10), mat('#4a3b2a'));
    trunk.position.y = 1.3;
    g.add(trunk);
    const leaves = [mat('#6f7a3a'), mat('#7f8a44'), mat('#5d6a32'), mat('#8e9650')];
    const n = Math.round(30 * p.r);
    for (let i = 0; i < n; i++) {
      const a = rand() * Math.PI * 2, d = Math.sqrt(rand()) * p.r * 0.85;
      const blob = mesh(new THREE.SphereGeometry(0.35 + rand() * 0.35, 10, 8), leaves[(rand() * 4) | 0]);
      blob.scale.set(1, 0.55, 1);
      blob.position.set(Math.cos(a) * d, 2.3 + rand() * 0.9 - d * 0.35, Math.sin(a) * d);
      g.add(blob);
    }
    g.position.set(p.x, 0, p.y);
    return g;
  },

  boat(p) {
    const g = new THREE.Group();
    const hullShape = new THREE.Shape();
    hullShape.moveTo(-1, 0);
    hullShape.quadraticCurveTo(0, 0.5, 1, 0);
    hullShape.quadraticCurveTo(0, -0.5, -1, 0);
    const hull = mesh(new THREE.ExtrudeGeometry(hullShape, { depth: 0.35, bevelEnabled: false }), WOOD());
    hull.geometry.rotateX(-Math.PI / 2);
    g.add(hull);
    const inner = new THREE.Shape();
    inner.moveTo(-0.85, 0);
    inner.quadraticCurveTo(0, 0.4, 0.85, 0);
    inner.quadraticCurveTo(0, -0.4, -0.85, 0);
    const bilge = mesh(new THREE.ShapeGeometry(inner), mat('#231a12'), { cast: false });
    bilge.geometry.rotateX(-Math.PI / 2);
    bilge.position.y = 0.36;
    g.add(bilge);
    for (const x of [-0.35, 0.3]) {
      const bench = box(0.12, 0.04, 0.6, WOOD());
      bench.position.set(x, 0.37, 0);
      g.add(bench);
    }
    const oar = box(1.5, 0.03, 0.08, WOOD());
    oar.position.set(0.2, 0.4, 0.1);
    oar.rotation.y = 0.2;
    g.add(oar);
    g.rotation.y = p.rot ?? 0;
    g.position.set(p.x, 0, p.y);
    return g;
  },

  scarecrow(p) {
    // Dressed in a dead man's red coat.
    const g = new THREE.Group();
    const pole = mesh(new THREE.CylinderGeometry(0.04, 0.05, 2.0, 6), WOOD());
    pole.position.y = 1.0;
    const arms = mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.3, 6), WOOD());
    arms.rotation.z = Math.PI / 2;
    arms.position.y = 1.55;
    const coat = box(0.9, 0.7, 0.28, mat('#6a2a22'));
    coat.position.y = 1.35;
    const head = mesh(new THREE.SphereGeometry(0.18, 10, 8), mat('#b9a67a'));
    head.position.y = 2.0;
    const hat = mesh(new THREE.ConeGeometry(0.28, 0.25, 12), mat('#3d2d1c'));
    hat.position.y = 2.2;
    g.add(pole, arms, coat, head, hat);
    g.position.set(p.x, 0, p.y);
    return g;
  },

  scythe(p) {
    // Left where it fell, mid-stroke.
    const g = new THREE.Group();
    const snath = mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.7, 6), WOOD());
    snath.rotation.z = Math.PI / 2;
    snath.position.y = 0.04;
    const blade = mesh(new THREE.TorusGeometry(0.5, 0.025, 4, 24, Math.PI * 0.55), mat('#9a9ea2', 0.35, 0.8));
    blade.rotation.x = -Math.PI / 2;
    blade.scale.set(1, 1, 0.3);
    blade.position.set(0.85, 0.04, 0);
    g.add(snath, blade);
    g.rotation.y = p.rot ?? 0;
    g.position.set(p.x, 0, p.y);
    return g;
  },

  milestone(p) {
    const g = new THREE.Group();
    const stone = box(0.45, 0.55, 0.3, mat('#9a9486'));
    stone.position.y = 0.275;
    const cap = mesh(new THREE.CylinderGeometry(0.225, 0.225, 0.3, 16, 1, false, 0, Math.PI), mat('#9a9486'));
    cap.rotation.set(Math.PI / 2, 0, Math.PI / 2);
    cap.position.y = 0.55;
    g.add(stone, cap);
    g.position.set(p.x, 0, p.y);
    return g;
  },

  crows(p, rand) {
    const g = new THREE.Group();
    const black = mat('#121214', 0.6);
    for (let i = 0; i < p.n; i++) {
      const c = new THREE.Group();
      const body = mesh(new THREE.SphereGeometry(0.08, 8, 6), black);
      body.scale.set(1.6, 0.8, 0.9);
      const head = mesh(new THREE.SphereGeometry(0.05, 8, 6), black);
      head.position.set(0.13, 0.04, 0);
      const beak = mesh(new THREE.ConeGeometry(0.018, 0.07, 6), mat('#2a2a2a'));
      beak.rotation.z = -Math.PI / 2;
      beak.position.set(0.2, 0.04, 0);
      const tail = box(0.1, 0.01, 0.07, black);
      tail.position.set(-0.15, 0.02, 0);
      c.add(body, head, beak, tail);
      c.rotation.y = rand() * Math.PI * 2;
      c.position.set(p.x + rand() * p.w, 0.08, p.y + rand() * p.h);
      g.add(c);
    }
    return g;
  },
};

export function buildProp(p, rand) {
  const b = BUILDERS[p.type];
  if (!b) {
    console.warn('unknown prop', p.type);
    return null;
  }
  return b(p, rand);
}

export function buildDoor(d, [x0, y0, x1, y1], wallH) {
  const g = new THREE.Group();
  const vertical = x0 === x1;
  const cx = (x0 + x1) / 2, cz = (y0 + y1) / 2;
  if (d.type === 'secret') {
    // Indistinguishable from the masonry around it.
    const slab = new THREE.Mesh(
      new THREE.BoxGeometry(vertical ? 0.42 : 1, wallH, vertical ? 1 : 0.42),
      new THREE.MeshBasicMaterial({ color: '#4c463f' }),
    );
    slab.position.set(cx, wallH / 2, cz);
    slab.castShadow = true;
    g.add(slab);
    const seam = new THREE.Mesh(
      new THREE.BoxGeometry(vertical ? 0.43 : 0.02, 0.01, vertical ? 0.02 : 0.43),
      new THREE.MeshBasicMaterial({ color: '#211d1a' }),
    );
    seam.position.set(cx, wallH + 0.01, cz);
    g.add(seam);
    return g;
  }
  const iron = d.material === 'iron';
  const leaf = box(vertical ? 0.16 : 0.92, 1.3, vertical ? 0.92 : 0.16, iron ? mat('#303134', 0.45, 0.8) : WOOD());
  leaf.position.set(cx, 0.65, cz);
  g.add(leaf);
  for (const t of [-0.3, 0, 0.3]) {
    const band = box(vertical ? 0.18 : 0.05, 1.32, vertical ? 0.05 : 0.18, IRON());
    band.position.set(cx + (vertical ? 0 : t), 0.66, cz + (vertical ? t : 0));
    g.add(band);
  }
  // stone jambs
  for (const s of [-1, 1]) {
    const jamb = box(vertical ? 0.36 : 0.12, 1.6, vertical ? 0.12 : 0.36, STONE_DARK());
    jamb.position.set(cx + (vertical ? 0 : s * 0.5), 0.8, cz + (vertical ? s * 0.5 : 0));
    g.add(jamb);
  }
  return g;
}

export function buildStairs(s) {
  // Steps rising toward the church above (north).
  const g = new THREE.Group();
  const steps = s.h * 3;
  for (let i = 0; i < steps; i++) {
    const depth = s.h / steps;
    const hgt = 0.35 * (i + 1);
    const step = box(s.w, hgt, depth, mat('#7b746a'));
    step.position.set(s.x + s.w / 2, hgt / 2, s.y + s.h - depth * (i + 0.5));
    g.add(step);
    const nose = box(s.w, 0.02, 0.03, mat('#2a2622'));
    nose.position.set(s.x + s.w / 2, hgt + 0.01, s.y + s.h - depth * (i + 1) + depth - 0.015);
    g.add(nose);
  }
  return g;
}

export function buildRubble(f, rand) {
  const g = new THREE.Group();
  const n = Math.round(f.w * f.h * 6);
  for (let i = 0; i < n; i++) {
    const r = 0.05 + rand() * 0.16;
    const rock = mesh(new THREE.DodecahedronGeometry(r), mat('#5e5850'));
    rock.position.set(f.x + rand() * f.w, r * 0.5, f.y + rand() * f.h);
    rock.rotation.set(rand() * 3, rand() * 3, rand() * 3);
    g.add(rock);
  }
  return g;
}
