// 2D procedural painting for outdoor maps: terrain bands (river, meadow, road, wheat) and
// painted features. Band rows are exact so the table rules (road width etc.) hold.
import { fbm, makeCanvas, mulberry32, speckle } from './paint.mjs';

const clamp = (v, a = 0, b = 255) => Math.max(a, Math.min(b, v));

/** Wavy boundary y (in px) for a band edge at row `row`, ±amp cells. */
function edge(row, PX, seed, amp) {
  return (xPx) => (row + (fbm(xPx / PX / 3, row * 1.7, seed, 3) - 0.5) * 2 * amp) * PX;
}

function bandPath(ctx, CW, top, bottom, step = 8) {
  ctx.beginPath();
  ctx.moveTo(0, top(0));
  for (let x = step; x <= CW; x += step) ctx.lineTo(x, top(x));
  for (let x = CW; x >= 0; x -= step) ctx.lineTo(x, bottom(x));
  ctx.closePath();
}

function noiseOverlay(ctx, CW, CH, scale, seed, rgbaOf, res = 6) {
  const w = Math.ceil(CW / res), h = Math.ceil(CH / res);
  const c = makeCanvas(w, h);
  const cx = c.getContext('2d');
  const img = cx.createImageData(w, h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const [r, g, b, a] = rgbaOf(fbm(x / scale, y / scale, seed, 5));
    const i = (y * w + x) * 4;
    img.data[i] = r; img.data[i + 1] = g; img.data[i + 2] = b; img.data[i + 3] = a;
  }
  cx.putImageData(img, 0, 0);
  ctx.drawImage(c, 0, 0, CW, CH);
}

export function paintOutdoor(def) {
  const PX = def.gridSize;
  const CW = def.width * PX, CH = def.height * PX;
  const rand = mulberry32(def.seed);
  const color = makeCanvas(CW, CH);
  const bump = makeCanvas(CW, CH);
  const rough = makeCanvas(CW, CH);
  const ctx = color.getContext('2d');
  const bctx = bump.getContext('2d');
  const rctx = rough.getContext('2d');
  bctx.fillStyle = '#808080'; bctx.fillRect(0, 0, CW, CH);
  rctx.fillStyle = '#ffffff'; rctx.fillRect(0, 0, CW, CH);

  // Band edges. Road edges barely waver (it must stay 20 ft); natural edges waver more.
  const bands = def.bands;
  const bounds = bands.map((b, i) => {
    if (i === 0) return () => 0;
    const prev = bands[i - 1];
    const amp = b.type === 'road' || prev.type === 'road' ? 0.08 : prev.type === 'river' ? 0.3 : 0.18;
    return edge(b.from, PX, def.seed + i * 13, amp);
  });
  bounds.push(() => CH);

  bands.forEach((b, i) => {
    const top = bounds[i], bottom = bounds[i + 1];
    ctx.save();
    bandPath(ctx, CW, top, bottom);
    ctx.clip();
    BANDS[b.type](ctx, { CW, CH, PX, rand, seed: def.seed + i * 101, top: b.from * PX, bottom: b.to * PX, band: b, bctx, rctx, topEdge: top });
    ctx.restore();
    if (b.type === 'river') {
      rctx.save(); bandPath(rctx, CW, top, bottom); rctx.fillStyle = '#3a3a3a'; rctx.fill(); rctx.restore();
      bctx.save(); bandPath(bctx, CW, top, bottom); bctx.fillStyle = '#6a6a6a'; bctx.fill(); bctx.restore();
    }
    if (b.type === 'wheat') {
      bctx.save(); bandPath(bctx, CW, top, bottom); bctx.fillStyle = '#c0c0c0'; bctx.fill(); bctx.restore();
    }
  });

  // Riverbank: mud strip and reeds along the river's southern edge.
  const riverIdx = bands.findIndex((b) => b.type === 'river');
  if (riverIdx >= 0) riverbank(ctx, bounds[riverIdx + 1], CW, PX, rand);

  // Wheat spills a little onto the verge; grass encroaches on the road edges.
  for (const f of def.features ?? []) FEATURES[f.type]?.(ctx, f, PX, rand, bctx);

  speckle(ctx, CW, CH, 12, def.seed + 7);
  return { color, bump, rough };
}

function riverbank(ctx, bankEdge, CW, PX, rand) {
  ctx.save();
  // mud
  ctx.beginPath();
  ctx.moveTo(0, bankEdge(0) - PX * 0.12);
  for (let x = 8; x <= CW; x += 8) ctx.lineTo(x, bankEdge(x) - PX * 0.12);
  for (let x = CW; x >= 0; x -= 8) ctx.lineTo(x, bankEdge(x) + PX * (0.28 + fbm(x / 90, 3, 5, 2) * 0.3));
  ctx.closePath();
  ctx.fillStyle = 'rgba(84,70,48,0.85)';
  ctx.fill();
  // foam line
  ctx.strokeStyle = 'rgba(210,205,180,0.35)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let x = 0; x <= CW; x += 8) (x ? ctx.lineTo(x, bankEdge(x) - PX * 0.14) : ctx.moveTo(x, bankEdge(x) - PX * 0.14));
  ctx.stroke();
  // reeds
  for (let i = 0; i < CW / 3.5; i++) {
    const x = rand() * CW;
    if (fbm(x / 160, 1, 9, 2) < 0.45) continue;
    const y = bankEdge(x) + (rand() - 0.55) * PX * 0.5;
    const a = -Math.PI / 2 + (rand() - 0.5) * 1.2;
    const l = 10 + rand() * 26;
    ctx.strokeStyle = rand() < 0.5 ? '#5f6b33' : '#7f7a3c';
    ctx.lineWidth = 1.5 + rand();
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l * 0.5);
    ctx.stroke();
    if (rand() < 0.15) {
      ctx.fillStyle = '#4a3522';
      ctx.beginPath(); ctx.ellipse(x + Math.cos(a) * l, y + Math.sin(a) * l * 0.5, 2.5, 6, a, 0, Math.PI * 2); ctx.fill();
    }
  }
  ctx.restore();
}

const BANDS = {
  river(ctx, { CW, top, bottom, PX, rand, seed }) {
    const g = ctx.createLinearGradient(0, top, 0, bottom + PX * 0.4);
    // the Garonne runs brown with silt
    g.addColorStop(0, '#3a3527');
    g.addColorStop(0.6, '#56503a');
    g.addColorStop(1, '#6b6344');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, CW, bottom + PX);
    noiseOverlay(ctx, CW, bottom + PX, 30, seed, (n) => [120, 110, 80, clamp((n - 0.5) * 260)], 8);
    // current lines, flowing west (downstream toward Bordeaux)
    for (let i = 0; i < 520; i++) {
      const y = rand() * (bottom + PX * 0.2);
      const x = rand() * CW;
      const l = 30 + rand() * 120;
      ctx.strokeStyle = `rgba(${rand() < 0.5 ? '170,180,150' : '20,28,22'},${0.12 + rand() * 0.18})`;
      ctx.lineWidth = 1 + rand() * 2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.bezierCurveTo(x - l * 0.3, y + 4, x - l * 0.6, y - 4, x - l, y + (rand() - 0.5) * 6);
      ctx.stroke();
    }
  },

  meadow(ctx, { CW, CH, top, bottom, PX, rand, seed }) {
    ctx.fillStyle = '#76793e';
    ctx.fillRect(0, top - PX, CW, bottom - top + PX * 2);
    noiseOverlay(ctx, CW, CH, 14, seed, (n) => (n > 0.5 ? [150, 140, 70, clamp((n - 0.5) * 380)] : [60, 80, 40, clamp((0.5 - n) * 380)]));
    // grass tufts
    const n = ((bottom - top) * CW) / 140;
    for (let i = 0; i < n; i++) {
      const x = rand() * CW, y = top - PX * 0.3 + rand() * (bottom - top + PX * 0.6);
      const a = -Math.PI / 2 + (rand() - 0.5) * 2.2;
      const l = 4 + rand() * 10;
      const s = rand();
      ctx.strokeStyle = s < 0.4 ? '#5b6630' : s < 0.8 ? '#8f8b47' : '#a9a060';
      ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); ctx.stroke();
    }
    // poppies (blood in the grass) and a few cornflowers
    for (let i = 0; i < n / 90; i++) {
      const x = rand() * CW, y = top + rand() * (bottom - top);
      if (fbm(x / 200, y / 200, seed + 3, 2) < 0.52) continue;
      ctx.fillStyle = rand() < 0.85 ? '#b3261e' : '#4a64a8';
      ctx.beginPath(); ctx.arc(x, y, 2.5 + rand() * 2.5, 0, Math.PI * 2); ctx.fill();
    }
  },

  road(ctx, { CW, CH, top, bottom, PX, rand, seed }) {
    ctx.fillStyle = '#a58f69';
    ctx.fillRect(0, top - PX, CW, bottom - top + PX * 2);
    noiseOverlay(ctx, CW, CH, 10, seed, (n) => (n > 0.5 ? [200, 185, 150, clamp((n - 0.5) * 300)] : [110, 92, 66, clamp((0.5 - n) * 320)]));
    // cart ruts
    for (const ry of [top + (bottom - top) * 0.3, top + (bottom - top) * 0.7]) {
      for (let pass = 0; pass < 3; pass++) {
        ctx.strokeStyle = `rgba(95,78,55,${0.25 + pass * 0.1})`;
        ctx.lineWidth = 16 - pass * 5;
        ctx.beginPath();
        for (let x = 0; x <= CW; x += 20) {
          const y = ry + (fbm(x / 400, ry, seed + pass, 2) - 0.5) * 18;
          x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.stroke();
      }
    }
    // hoofprints and stones
    for (let i = 0; i < CW / 6; i++) {
      const x = rand() * CW, y = top + rand() * (bottom - top);
      if (rand() < 0.6) {
        ctx.fillStyle = 'rgba(90,72,50,0.35)';
        ctx.beginPath(); ctx.ellipse(x, y, 5, 6, 0, 0, Math.PI * 2); ctx.fill();
      } else {
        const g = 120 + rand() * 60;
        ctx.fillStyle = `rgb(${g},${g - 6},${g - 16})`;
        ctx.beginPath(); ctx.arc(x, y, 1.5 + rand() * 3.5, 0, Math.PI * 2); ctx.fill();
      }
    }
    // grass creeping in at the verges (stays within ~5% of a square)
    for (const edgeY of [top, bottom]) {
      for (let i = 0; i < CW / 4; i++) {
        const x = rand() * CW, y = edgeY + (rand() - 0.5) * PX * 0.14;
        ctx.strokeStyle = rand() < 0.5 ? '#6e7338' : '#8a8446';
        ctx.lineWidth = 1.3;
        const a = -Math.PI / 2 + (rand() - 0.5) * 2;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * 8, y + Math.sin(a) * 8); ctx.stroke();
      }
    }
  },

  wheat(ctx, { CW, CH, top, bottom, PX, rand, seed }) {
    ctx.fillStyle = '#8f6f30';
    ctx.fillRect(0, top - PX, CW, CH - top + PX);
    // furrow shading, east-west
    for (let y = top - PX; y < CH; y += PX * 0.25) {
      ctx.fillStyle = 'rgba(60,40,15,0.18)';
      ctx.fillRect(0, y, CW, PX * 0.07);
    }
    noiseOverlay(ctx, CW, CH, 16, seed, (n) => (n > 0.5 ? [220, 180, 90, clamp((n - 0.5) * 300)] : [90, 70, 35, clamp((0.5 - n) * 300)]));
    // wheat heads: dense bowed ears leaning with the wind (east)
    const n = ((CH - top) * CW) / 55;
    for (let i = 0; i < n; i++) {
      const x = rand() * CW, y = top - PX * 0.15 + rand() * (CH - top + PX * 0.2);
      const s = rand();
      const r = s < 0.3 ? 150 : s < 0.75 ? 196 : 226;
      ctx.fillStyle = `rgb(${r},${r * 0.78},${r * 0.38})`;
      ctx.beginPath();
      ctx.ellipse(x, y, 5 + rand() * 3, 2 + rand(), 0.35 + (rand() - 0.5) * 0.6, 0, Math.PI * 2);
      ctx.fill();
      if (rand() < 0.3) {
        ctx.strokeStyle = 'rgba(240,215,140,0.6)';
        ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(x + 5, y + 1); ctx.lineTo(x + 13, y + 4); ctx.stroke();
      }
    }
    // poppies among the wheat
    for (let i = 0; i < n / 400; i++) {
      const x = rand() * CW, y = top + rand() * (CH - top);
      ctx.fillStyle = '#a3221a';
      ctx.beginPath(); ctx.arc(x, y, 3 + rand() * 2, 0, Math.PI * 2); ctx.fill();
    }
  },
};

const FEATURES = {
  palmFronds(ctx, f, PX, rand) {
    // Last Easter's palms, left at the foot of the cross and gone brown.
    ctx.save();
    for (let i = 0; i < 6; i++) {
      const x = (f.x + (rand() - 0.5) * 0.9) * PX, y = (f.y + (rand() - 0.2) * 0.5) * PX;
      const a = rand() * Math.PI * 2, l = PX * (0.3 + rand() * 0.25);
      ctx.strokeStyle = '#7a6436';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); ctx.stroke();
      for (let k = 1; k < 8; k++) {
        const t = k / 8, px = x + Math.cos(a) * l * t, py = y + Math.sin(a) * l * t;
        for (const s of [-1, 1]) {
          ctx.beginPath(); ctx.moveTo(px, py);
          ctx.lineTo(px + Math.cos(a + s * 0.9) * 9 * (1 - t * 0.6), py + Math.sin(a + s * 0.9) * 9 * (1 - t * 0.6));
          ctx.stroke();
        }
      }
    }
    ctx.restore();
  },

  trampled(ctx, f, PX, rand) {
    // A subtle trail of bent stalks: attentive players can find the ambushers.
    ctx.save();
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(120,95,45,0.45)';
    ctx.lineWidth = PX * 0.32;
    ctx.beginPath();
    f.path.forEach(([x, y], i) => (i ? ctx.lineTo(x * PX, y * PX) : ctx.moveTo(x * PX, y * PX)));
    ctx.stroke();
    const [ex, ey] = f.path[f.path.length - 1];
    ctx.fillStyle = 'rgba(115,90,42,0.55)';
    ctx.beginPath(); ctx.ellipse(ex * PX, ey * PX, PX * 0.45, PX * 0.35, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  },

  lodged(ctx, f, PX, rand) {
    // Wheat beaten flat by rain and left to rot.
    const cx = f.x * PX, cy = f.y * PX, r = f.r * PX;
    ctx.save();
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, 'rgba(80,62,34,0.75)');
    g.addColorStop(1, 'rgba(80,62,34,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(140,112,60,0.5)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 220; i++) {
      const a = rand() * Math.PI * 2, d = Math.sqrt(rand()) * r;
      const x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d;
      const sw = a + Math.PI / 2 + 0.4;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(sw) * 14, y + Math.sin(sw) * 14); ctx.stroke();
    }
    ctx.restore();
  },
};
