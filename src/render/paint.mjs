// 2D procedural painting: floor, rock mass, and symbolic floor features.
// Everything is drawn at full map resolution (gridSize px per cell).

export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash2(x, y, s) {
  let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(s, 1442695041);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

function vnoise(x, y, s) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash2(xi, yi, s), b = hash2(xi + 1, yi, s), c = hash2(xi, yi + 1, s), d = hash2(xi + 1, yi + 1, s);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

export function fbm(x, y, s, oct = 4) {
  let t = 0, amp = 0.5, f = 1, norm = 0;
  for (let i = 0; i < oct; i++) {
    t += amp * vnoise(x * f, y * f, s + i * 17);
    norm += amp;
    f *= 2;
    amp *= 0.5;
  }
  return t / norm;
}

export function makeCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

/** Low-res noise layer, returned as a canvas to be drawn scaled up (cheap soft grime). */
function noiseLayer(w, h, scale, seed, toRGBA) {
  const c = makeCanvas(w, h);
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(w, h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const [r, g, b, a] = toRGBA(fbm(x / scale, y / scale, seed, 5), x, y);
      const i = (y * w + x) * 4;
      img.data[i] = r; img.data[i + 1] = g; img.data[i + 2] = b; img.data[i + 3] = a;
    }
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

export function speckle(ctx, w, h, amount, seed) {
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  for (let i = 0, p = 0; i < d.length; i += 4, p++) {
    if (d[i + 3] === 0) continue;
    const n = (hash2(p % w, (p / w) | 0, seed) - 0.5) * amount;
    d[i] += n; d[i + 1] += n; d[i + 2] += n;
  }
  ctx.putImageData(img, 0, 0);
}

function cellsPath(ctx, grid, PX, test) {
  ctx.beginPath();
  for (let y = 0; y < grid.H; y++) for (let x = 0; x < grid.W; x++) if (test(x, y)) ctx.rect(x * PX, y * PX, PX, PX);
}

const clamp = (v, a = 0, b = 255) => Math.max(a, Math.min(b, v));

/* ------------------------------------------------------------------ */
/*  Floor                                                             */
/* ------------------------------------------------------------------ */

export function paintFloor(def, grid, walls, doors) {
  const PX = def.gridSize;
  const CW = grid.W * PX, CH = grid.H * PX;
  const rand = mulberry32(def.seed);
  const color = makeCanvas(CW, CH);
  const bump = makeCanvas(CW, CH);
  const ctx = color.getContext('2d');
  const bctx = bump.getContext('2d');

  bctx.fillStyle = '#000';
  bctx.fillRect(0, 0, CW, CH);

  ctx.save();
  cellsPath(ctx, grid, PX, grid.isFloor);
  ctx.clip();
  ctx.fillStyle = '#2b2824';
  ctx.fillRect(0, 0, CW, CH);

  // Flagstones in running courses of uneven height, like reused grave slabs.
  for (let y = 0, course; y < CH; y += course) {
    course = PX * (0.42 + rand() * 0.36);
    let x = -rand() * PX;
    while (x < CW) {
      const len = PX * (0.55 + rand() * 0.75);
      const shade = (rand() - 0.5) * 26;
      const warm = (rand() - 0.5) * 8;
      const r = 104 + shade + warm, g = 97 + shade, b = 88 + shade - warm;
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(x + 2.5, y + 2.5, len - 5, course - 5);
      // worn centre, darker edges
      const grad = ctx.createLinearGradient(x, y, x, y + course);
      grad.addColorStop(0, 'rgba(255,255,255,0.05)');
      grad.addColorStop(1, 'rgba(0,0,0,0.12)');
      ctx.fillStyle = grad;
      ctx.fillRect(x + 2.5, y + 2.5, len - 5, course - 5);
      bctx.fillStyle = `rgb(${200 + shade},${200 + shade},${200 + shade})`;
      bctx.fillRect(x + 3, y + 3, len - 6, course - 6);
      x += len;
    }
  }

  // Cracks
  ctx.strokeStyle = 'rgba(25,22,20,0.55)';
  ctx.lineWidth = 1.3;
  for (let i = 0; i < grid.W * grid.H * 0.35; i++) {
    let x = rand() * CW, y = rand() * CH;
    ctx.beginPath();
    ctx.moveTo(x, y);
    const n = 2 + ((rand() * 5) | 0);
    let a = rand() * Math.PI * 2;
    for (let k = 0; k < n; k++) {
      a += (rand() - 0.5) * 1.4;
      const l = 6 + rand() * 18;
      x += Math.cos(a) * l;
      y += Math.sin(a) * l;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Damp grime: low-frequency dark-green blotches.
  const grime = noiseLayer(CW / 8, CH / 8, 18, def.seed + 3, (n) => [26, 30, 20, clamp((n - 0.42) * 520)]);
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(grime, 0, 0, CW, CH);
  const stains = noiseLayer(CW / 4, CH / 4, 6, def.seed + 9, (n) => [20, 16, 12, clamp((n - 0.6) * 500)]);
  ctx.drawImage(stains, 0, 0, CW, CH);
  ctx.restore();

  speckle(ctx, CW, CH, 16, def.seed);

  // Ambient occlusion against walls: blurred rock mask multiplied in.
  const ao = makeCanvas(CW, CH);
  const actx = ao.getContext('2d');
  actx.filter = `blur(${PX * 0.22}px)`;
  actx.fillStyle = '#000';
  cellsPath(actx, grid, PX, (x, y) => !grid.isFloor(x, y));
  actx.fill();
  ctx.save();
  ctx.globalAlpha = 0.75;
  ctx.drawImage(ao, 0, 0);
  ctx.restore();

  // Symbolic features. Inlaid ones also flatten the flagstone relief underneath.
  for (const f of def.features ?? []) {
    FEATURES[f.type]?.(ctx, f, PX, rand);
    if (f.type === 'limePit' || f.type === 'memento') {
      bctx.fillStyle = f.type === 'limePit' ? '#555' : '#c8c8c8';
      bctx.beginPath(); bctx.arc(f.x * PX, f.y * PX, f.r * PX * (f.type === 'limePit' ? 1.02 : 1), 0, Math.PI * 2); bctx.fill();
    }
  }
  for (const d of doors) if (d.mark === 'plague-cross') plagueCross(ctx, d, PX);

  return { color, bump };
}

/* ------------------------------------------------------------------ */
/*  Rock mass (everything that is not floor)                          */
/* ------------------------------------------------------------------ */

export function paintRock(def, grid, walls) {
  const PX = def.gridSize;
  const CW = grid.W * PX, CH = grid.H * PX;
  const c = makeCanvas(CW, CH);
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#1d1a18';
  ctx.fillRect(0, 0, CW, CH);
  const veins = noiseLayer(CW / 6, CH / 6, 10, def.seed + 5, (n) => [60, 52, 46, clamp((n - 0.45) * 400)]);
  ctx.drawImage(veins, 0, 0, CW, CH);
  speckle(ctx, CW, CH, 18, def.seed + 1);

  // Dressed masonry band along every wall face, two courses of blocks.
  const band = PX * 0.42;
  ctx.lineCap = 'square';
  ctx.strokeStyle = '#4c463f';
  ctx.lineWidth = band;
  for (const [x0, y0, x1, y1] of walls) {
    ctx.beginPath(); ctx.moveTo(x0 * PX, y0 * PX); ctx.lineTo(x1 * PX, y1 * PX); ctx.stroke();
  }
  const rand = mulberry32(def.seed + 11);
  ctx.strokeStyle = '#211d1a';
  ctx.lineWidth = 2;
  for (const [x0, y0, x1, y1] of walls) {
    const horiz = y0 === y1;
    const len = (horiz ? x1 - x0 : y1 - y0) * PX;
    for (const side of [-1, 1]) {
      // course line
      const off = side * band * 0.25;
      ctx.beginPath();
      if (horiz) { ctx.moveTo(x0 * PX, y0 * PX + off * 2); ctx.lineTo(x1 * PX, y0 * PX + off * 2); }
      else { ctx.moveTo(x0 * PX + off * 2, y0 * PX); ctx.lineTo(x0 * PX + off * 2, y1 * PX); }
      ctx.stroke();
      // joints, staggered per course
      for (let t = (side > 0 ? 0 : PX * 0.2) + rand() * 8; t < len; t += PX * (0.32 + rand() * 0.18)) {
        ctx.beginPath();
        if (horiz) {
          ctx.moveTo(x0 * PX + t, y0 * PX + (side > 0 ? 0 : -band / 2));
          ctx.lineTo(x0 * PX + t, y0 * PX + (side > 0 ? band / 2 : 0));
        } else {
          ctx.moveTo(x0 * PX + (side > 0 ? 0 : -band / 2), y0 * PX + t);
          ctx.lineTo(x0 * PX + (side > 0 ? band / 2 : 0), y0 * PX + t);
        }
        ctx.stroke();
      }
    }
  }
  // Crisp dark outline exactly on the Foundry wall line.
  ctx.strokeStyle = '#0d0b0a';
  ctx.lineWidth = 6;
  for (const [x0, y0, x1, y1] of walls) {
    ctx.beginPath(); ctx.moveTo(x0 * PX, y0 * PX); ctx.lineTo(x1 * PX, y1 * PX); ctx.stroke();
  }

  // Punch out the floor and the pillar cells (pillars are drawn in 3D).
  ctx.globalCompositeOperation = 'destination-out';
  cellsPath(ctx, grid, PX, (x, y) => grid.isFloor(x, y) || grid.isPillar(x, y));
  ctx.fill();
  ctx.globalCompositeOperation = 'source-over';
  return c;
}

/** Top face of a pier: worn stone with a carved gothic quatrefoil. */
export function paintPillarTop(size = 128) {
  const c = makeCanvas(size, size);
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#6a645b';
  ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = '#2c2825';
  ctx.lineWidth = size * 0.05;
  ctx.strokeRect(size * 0.08, size * 0.08, size * 0.84, size * 0.84);
  const m = size / 2, lobe = size * 0.13;
  ctx.fillStyle = '#4a453f';
  ctx.strokeStyle = '#2c2825';
  ctx.lineWidth = size * 0.025;
  ctx.beginPath();
  for (const [dx, dy] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) {
    ctx.moveTo(m + dx * lobe + lobe, m + dy * lobe);
    ctx.arc(m + dx * lobe, m + dy * lobe, lobe, 0, Math.PI * 2);
  }
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#6a645b';
  ctx.beginPath(); ctx.arc(m, m, lobe * 0.55, 0, Math.PI * 2); ctx.fill();
  speckle(ctx, size, size, 30, 7);
  return c;
}

/** Plank texture for doors, pews and the dead-cart. */
export function paintWood(size = 256) {
  const c = makeCanvas(size, size);
  const ctx = c.getContext('2d');
  const rand = mulberry32(31);
  const planks = 4;
  for (let i = 0; i < planks; i++) {
    const s = (rand() - 0.5) * 18;
    ctx.fillStyle = `rgb(${86 + s},${60 + s},${40 + s})`;
    ctx.fillRect(0, (i * size) / planks, size, size / planks);
    ctx.strokeStyle = 'rgba(30,18,10,0.35)';
    ctx.lineWidth = 1;
    for (let k = 0; k < 7; k++) {
      const y = (i * size) / planks + rand() * (size / planks);
      ctx.beginPath(); ctx.moveTo(0, y);
      ctx.bezierCurveTo(size * 0.3, y + (rand() - 0.5) * 6, size * 0.7, y + (rand() - 0.5) * 6, size, y);
      ctx.stroke();
    }
    ctx.fillStyle = '#1e140c';
    ctx.fillRect(0, ((i + 1) * size) / planks - 2, size, 3);
  }
  speckle(ctx, size, size, 14, 5);
  return c;
}

/* ------------------------------------------------------------------ */
/*  Floor features                                                    */
/* ------------------------------------------------------------------ */

function carvedText(ctx, text, x, y, size, color, maxWidth) {
  ctx.save();
  ctx.font = `600 ${size}px "Cinzel", "Trajan Pro", Georgia, "Times New Roman", serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillText(text, x + 1.5, y + 1.5, maxWidth);
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.75;
  ctx.fillText(text, x, y, maxWidth);
  ctx.restore();
}

function textOnCircle(ctx, text, cx, cy, r, size, color, mirrored) {
  ctx.save();
  ctx.font = `600 ${size}px Georgia, "Times New Roman", serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color;
  const chars = [...text];
  const step = (Math.PI * 2) / chars.length;
  chars.forEach((ch, i) => {
    const a = -Math.PI / 2 + (mirrored ? -1 : 1) * i * step;
    ctx.save();
    ctx.translate(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    ctx.rotate(a + Math.PI / 2);
    if (mirrored) ctx.scale(-1, 1); // written backwards, as a blasphemy of the liturgy
    ctx.fillText(ch, 0, 0);
    ctx.restore();
  });
  ctx.restore();
}

function skull(ctx, x, y, s, color, hole) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(0, -s * 0.15, s * 0.5, s * 0.48, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(-s * 0.26, s * 0.1, s * 0.52, s * 0.38);
  ctx.fillStyle = hole;
  for (const sx of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(sx * s * 0.19, -s * 0.05, s * 0.13, s * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.beginPath();
  ctx.moveTo(0, s * 0.1); ctx.lineTo(-s * 0.06, s * 0.22); ctx.lineTo(s * 0.06, s * 0.22);
  ctx.fill();
  for (let i = -2; i <= 2; i++) ctx.fillRect(i * s * 0.09 - 1, s * 0.34, 2, s * 0.14);
  ctx.restore();
}

function plagueCross(ctx, d, PX) {
  // Red chalk cross on the approach side of the door: the mark of a plague house.
  const cx = (d.orient === 'v' ? d.x - 0.5 : d.x + 0.5) * PX;
  const cy = (d.orient === 'v' ? d.y + 0.5 : d.y - 0.5) * PX;
  ctx.save();
  ctx.strokeStyle = 'rgba(150,20,18,0.8)';
  ctx.lineWidth = PX * 0.07;
  ctx.lineCap = 'round';
  const s = PX * 0.3;
  ctx.beginPath();
  ctx.moveTo(cx - s, cy - s); ctx.lineTo(cx + s, cy + s);
  ctx.moveTo(cx + s, cy - s); ctx.lineTo(cx - s, cy + s);
  ctx.stroke();
  ctx.restore();
}

const FEATURES = {
  inscription(ctx, f, PX) {
    carvedText(ctx, f.text, f.x * PX, f.y * PX, f.size * PX, f.color, (f.w ?? 8) * PX);
  },

  memento(ctx, f, PX) {
    // Floor mosaic: winged hourglass over skull and crossed bones — memento mori.
    const cx = f.x * PX, cy = f.y * PX, r = f.r * PX;
    ctx.save();
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = '#3b3530';
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#8c7e62'; ctx.lineWidth = PX * 0.05;
    ctx.beginPath(); ctx.arc(cx, cy, r * 0.97, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, r * 0.72, 0, Math.PI * 2); ctx.stroke();
    textOnCircle(ctx, 'MEMENTO MORI · TIMOR MORTIS CONTURBAT ME · ', cx, cy, r * 0.845, PX * 0.2, '#b8a98a', false);
    // crossed bones
    ctx.strokeStyle = '#cfc2a4'; ctx.lineCap = 'round'; ctx.lineWidth = PX * 0.09;
    for (const a of [Math.PI / 4, -Math.PI / 4]) {
      ctx.beginPath();
      ctx.moveTo(cx - Math.cos(a) * r * 0.55, cy + r * 0.12 - Math.sin(a) * r * 0.4);
      ctx.lineTo(cx + Math.cos(a) * r * 0.55, cy + r * 0.12 + Math.sin(a) * r * 0.4);
      ctx.stroke();
    }
    skull(ctx, cx, cy + r * 0.12, r * 0.55, '#d8ccb0', '#2a2522');
    // hourglass with bat wings above
    const hy = cy - r * 0.42;
    ctx.fillStyle = '#8c7e62';
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.12, hy - r * 0.14); ctx.lineTo(cx + r * 0.12, hy - r * 0.14);
    ctx.lineTo(cx, hy); ctx.lineTo(cx + r * 0.12, hy + r * 0.14); ctx.lineTo(cx - r * 0.12, hy + r * 0.14);
    ctx.lineTo(cx, hy); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#5a5046';
    for (const s of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(cx + s * r * 0.1, hy);
      ctx.quadraticCurveTo(cx + s * r * 0.35, hy - r * 0.2, cx + s * r * 0.5, hy - r * 0.05);
      ctx.lineTo(cx + s * r * 0.4, hy + r * 0.02);
      ctx.lineTo(cx + s * r * 0.33, hy - r * 0.02);
      ctx.lineTo(cx + s * r * 0.24, hy + r * 0.05);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  },

  limePit(ctx, f, PX, rand) {
    const cx = f.x * PX, cy = f.y * PX, r = f.r * PX;
    ctx.save();
    // broken paving around the pit
    const rim = ctx.createRadialGradient(cx, cy, r * 0.8, cx, cy, r * 1.35);
    rim.addColorStop(0, 'rgba(15,14,10,0.9)');
    rim.addColorStop(1, 'rgba(15,14,10,0)');
    ctx.fillStyle = rim;
    ctx.beginPath(); ctx.arc(cx, cy, r * 1.35, 0, Math.PI * 2); ctx.fill();
    // irregular pit outline
    ctx.beginPath();
    for (let i = 0; i <= 48; i++) {
      const a = (i / 48) * Math.PI * 2;
      const rr = r * (0.93 + fbm(Math.cos(a) * 2 + 5, Math.sin(a) * 2 + 5, 77, 3) * 0.14);
      i ? ctx.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr) : ctx.moveTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
    }
    ctx.closePath();
    const lime = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    lime.addColorStop(0, '#9aa283');
    lime.addColorStop(0.55, '#c9cdb4');
    lime.addColorStop(0.9, '#dcdcc8');
    lime.addColorStop(1, '#6d6d5c');
    ctx.fillStyle = lime;
    ctx.fill();
    ctx.clip();
    // mottled slurry
    for (let i = 0; i < 260; i++) {
      const a = rand() * Math.PI * 2, d = Math.sqrt(rand()) * r;
      ctx.fillStyle = rand() < 0.5 ? 'rgba(120,130,95,0.25)' : 'rgba(240,240,225,0.25)';
      ctx.beginPath();
      ctx.ellipse(cx + Math.cos(a) * d, cy + Math.sin(a) * d, 4 + rand() * 18, 3 + rand() * 12, rand() * 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },

  infernalCircle(ctx, f, PX, rand) {
    const cx = f.x * PX, cy = f.y * PX, r = f.r * PX;
    const blood = 'rgba(112,14,14,0.9)';
    ctx.save();
    ctx.strokeStyle = blood;
    ctx.lineWidth = PX * 0.06;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
    ctx.lineWidth = PX * 0.035;
    ctx.beginPath(); ctx.arc(cx, cy, r * 0.8, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, r * 0.2, 0, Math.PI * 2); ctx.stroke();
    // Heptagram {7/3}: seven sins, seven princes.
    const n = f.points;
    const pts = Array.from({ length: n }, (_, i) => {
      const a = Math.PI / 2 + (i * Math.PI * 2) / n; // inverted: point toward the altar-less south
      return [cx + Math.cos(a) * r * 0.8, cy + Math.sin(a) * r * 0.8];
    });
    ctx.lineWidth = PX * 0.04;
    ctx.beginPath();
    for (let i = 0, k = 0; i <= n; i++, k = (k + 3) % n) i ? ctx.lineTo(...pts[k]) : ctx.moveTo(...pts[k]);
    ctx.stroke();
    textOnCircle(ctx, f.text + ' · ', cx, cy, r * 0.9, PX * 0.15, 'rgba(140,22,20,0.95)', true);
    // sigils at each point
    ctx.lineWidth = PX * 0.025;
    for (const [px, py] of pts) {
      ctx.beginPath(); ctx.arc(px, py, PX * 0.14, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(px - PX * 0.08, py + PX * 0.08); ctx.lineTo(px, py - PX * 0.1); ctx.lineTo(px + PX * 0.08, py + PX * 0.08);
      ctx.moveTo(px - PX * 0.1, py); ctx.lineTo(px + PX * 0.1, py);
      ctx.stroke();
    }
    // drips and spatter
    for (let i = 0; i < 90; i++) {
      const a = rand() * Math.PI * 2, d = r * (0.1 + rand() * 1.05);
      ctx.fillStyle = `rgba(${90 + rand() * 40},10,12,${0.3 + rand() * 0.5})`;
      ctx.beginPath(); ctx.arc(cx + Math.cos(a) * d, cy + Math.sin(a) * d, 1 + rand() * 5, 0, Math.PI * 2); ctx.fill();
    }
    // the old dedication, scratched out
    ctx.restore();
  },

  bloodTrail(ctx, f, PX, rand) {
    const [x0, y0] = f.from, [x1, y1] = f.to;
    ctx.save();
    for (let i = 0; i < 60; i++) {
      const t = i / 59;
      const x = (x0 + (x1 - x0) * t) * PX + (rand() - 0.5) * PX * 0.15;
      const y = (y0 + (y1 - y0) * t) * PX + (rand() - 0.5) * PX * 0.15;
      ctx.fillStyle = `rgba(${70 + rand() * 30},8,8,${0.18 + rand() * 0.2})`;
      ctx.beginPath(); ctx.ellipse(x, y, PX * (0.06 + rand() * 0.12), PX * (0.03 + rand() * 0.05), Math.atan2(y1 - y0, x1 - x0), 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  },

  rubble(ctx, f, PX, rand) {
    ctx.save();
    const n = Math.round(f.w * f.h * 40);
    for (let i = 0; i < n; i++) {
      const x = (f.x + rand() * f.w) * PX, y = (f.y + rand() * f.h) * PX, s = 3 + rand() * 12;
      const g = 55 + rand() * 45;
      ctx.fillStyle = `rgb(${g + 6},${g},${g - 6})`;
      ctx.beginPath();
      for (let k = 0; k < 5; k++) {
        const a = (k / 5) * Math.PI * 2 + rand();
        k ? ctx.lineTo(x + Math.cos(a) * s, y + Math.sin(a) * s) : ctx.moveTo(x + Math.cos(a) * s, y + Math.sin(a) * s);
      }
      ctx.fill();
    }
    ctx.restore();
  },

  stainedLight(ctx, f, PX, rand) {
    // Coloured light from a window falling across the floor (slanting in from the south).
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const w = PX * 0.34;
    f.colors.forEach((c, i) => {
      const x0 = (f.x - 0.5) * PX + i * w;
      ctx.fillStyle = c;
      ctx.globalAlpha = 0.28;
      ctx.beginPath();
      ctx.moveTo(x0, (f.y + 0.7) * PX);
      ctx.lineTo(x0 + w, (f.y + 0.7) * PX);
      ctx.lineTo(x0 + w - PX * 0.5, (f.y - 1.6) * PX);
      ctx.lineTo(x0 - PX * 0.5, (f.y - 1.6) * PX);
      ctx.closePath();
      ctx.fill();
    });
    ctx.restore();
  },

  tombSlab(ctx, f, PX) {
    // An abbot's incised grave slab: figure with crozier, and an inscription.
    const cx = f.x * PX, cy = f.y * PX, w = PX * 0.9, h = PX * 1.9;
    ctx.save();
    ctx.fillStyle = '#5e5850';
    ctx.fillRect(cx - w / 2, cy - h / 2, w, h);
    ctx.strokeStyle = '#2e2a26';
    ctx.lineWidth = 3;
    ctx.strokeRect(cx - w / 2 + 6, cy - h / 2 + 6, w - 12, h - 12);
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(cx, cy - h * 0.28, PX * 0.11, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - PX * 0.18, cy - h * 0.18); ctx.lineTo(cx - PX * 0.24, cy + h * 0.3);
    ctx.lineTo(cx + PX * 0.24, cy + h * 0.3); ctx.lineTo(cx + PX * 0.18, cy - h * 0.18); ctx.closePath();
    ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx + PX * 0.28, cy + h * 0.32); ctx.lineTo(cx + PX * 0.28, cy - h * 0.32);
    ctx.arc(cx + PX * 0.2, cy - h * 0.32, PX * 0.08, 0, Math.PI, true); ctx.stroke();
    ctx.translate(cx - w / 2 + 12, cy);
    ctx.rotate(-Math.PI / 2);
    ctx.font = `600 ${PX * 0.11}px Georgia, serif`;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#2e2a26';
    ctx.fillText(f.text, 0, 4, h - 20);
    ctx.restore();
  },

  wineTrail(ctx, f, PX, rand) {
    // Spilled wine, dark as old blood, dragged and splashed across the stone.
    const [x0, y0] = f.from, [x1, y1] = f.to;
    ctx.save();
    const n = Math.round(Math.hypot(x1 - x0, y1 - y0) * 14);
    for (let i = 0; i < n; i++) {
      const t = i / Math.max(1, n - 1);
      const x = (x0 + (x1 - x0) * t) * PX + (rand() - 0.5) * PX * 0.25;
      const y = (y0 + (y1 - y0) * t) * PX + (rand() - 0.5) * PX * 0.25;
      ctx.fillStyle = `rgba(${80 + rand() * 30},10,${24 + rand() * 12},${0.2 + rand() * 0.25})`;
      ctx.beginPath();
      ctx.ellipse(x, y, PX * (0.04 + rand() * 0.1), PX * (0.03 + rand() * 0.06), rand() * 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },

  graffiti(ctx, f, PX, rand) {
    // Words daubed on the floor in wine, by a drunk hand.
    ctx.save();
    ctx.translate(f.x * PX, f.y * PX);
    ctx.rotate(f.rot ?? 0);
    ctx.font = `italic 700 ${f.size * PX}px Georgia, "Times New Roman", serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = f.color;
    ctx.globalAlpha = 0.8;
    let x = -ctx.measureText(f.text).width / 2;
    for (const ch of f.text) {
      const w = ctx.measureText(ch).width;
      ctx.save();
      ctx.translate(x + w / 2, (rand() - 0.5) * f.size * PX * 0.25);
      ctx.rotate((rand() - 0.5) * 0.25);
      ctx.fillText(ch, 0, 0);
      ctx.restore();
      x += w;
      if (rand() < 0.3) {
        ctx.fillRect(x - w / 2, f.size * PX * 0.35, 2, f.size * PX * (0.2 + rand() * 0.5));
      }
    }
    ctx.restore();
  },

  flies(ctx, f, PX, rand) {
    ctx.save();
    ctx.fillStyle = 'rgba(12,12,14,0.85)';
    for (let i = 0; i < f.n; i++) {
      const a = rand() * Math.PI * 2, d = Math.sqrt(rand()) * f.r * PX;
      ctx.beginPath();
      ctx.ellipse(f.x * PX + Math.cos(a) * d, f.y * PX + Math.sin(a) * d, 2.2, 1.5, rand() * 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
