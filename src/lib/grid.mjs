// Shared map geometry. Used by both the browser renderer and the Node pack builder,
// so the painted walls and the Foundry wall documents come from the same data.
//
// Coordinates are in grid cells. Cell (x, y) covers [x, x+1] x [y, y+1].
// An edge is identified by its start point and orientation:
//   h: horizontal edge from (x, y) to (x+1, y)
//   v: vertical   edge from (x, y) to (x, y+1)

export function buildGrid(def) {
  const W = def.width;
  const H = def.height;
  const cells = Array.from({ length: H }, () => new Uint8Array(W));
  for (const [x, y, w, h] of def.carve) {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) cells[y + j][x + i] = 1;
  }
  for (const [x, y] of def.pillars ?? []) cells[y][x] = 0;
  const isFloor = (x, y) => x >= 0 && y >= 0 && x < W && y < H && cells[y][x] === 1;
  const isPillar = (x, y) => (def.pillars ?? []).some(([px, py]) => px === x && py === y);
  return { W, H, cells, isFloor, isPillar };
}

const edgeKey = (e) => `${e.orient}:${e.x}:${e.y}`;

/** Wall segments along every floor/solid boundary, merged into straight runs. */
export function traceWalls(grid, doors = []) {
  const { W, H, isFloor } = grid;
  const doorEdges = new Set(doors.map(edgeKey));
  const segs = [];

  // Horizontal edges at row line y, between cells (x, y-1) and (x, y).
  for (let y = 0; y <= H; y++) {
    let start = null;
    for (let x = 0; x <= W; x++) {
      const wall = x < W && isFloor(x, y - 1) !== isFloor(x, y) && !doorEdges.has(`h:${x}:${y}`);
      if (wall && start === null) start = x;
      if (!wall && start !== null) {
        segs.push([start, y, x, y]);
        start = null;
      }
    }
  }
  // Vertical edges at column line x, between cells (x-1, y) and (x, y).
  for (let x = 0; x <= W; x++) {
    let start = null;
    for (let y = 0; y <= H; y++) {
      const wall = y < H && isFloor(x - 1, y) !== isFloor(x, y) && !doorEdges.has(`v:${x}:${y}`);
      if (wall && start === null) start = y;
      if (!wall && start !== null) {
        segs.push([x, start, x, y]);
        start = null;
      }
    }
  }
  return segs;
}

export function doorSegment(d) {
  return d.orient === 'h' ? [d.x, d.y, d.x + 1, d.y] : [d.x, d.y, d.x, d.y + 1];
}

/** Sanity checks so a bad map definition fails loudly instead of producing broken walls. */
export function validate(def, grid) {
  const errors = [];
  for (const d of def.doors ?? []) {
    const [a, b] = d.orient === 'h' ? [[d.x, d.y - 1], [d.x, d.y]] : [[d.x - 1, d.y], [d.x, d.y]];
    if (!grid.isFloor(...a) || !grid.isFloor(...b)) {
      errors.push(`door ${edgeKey(d)} must sit between two floor cells`);
    }
  }
  for (const l of def.lights ?? []) {
    if (!grid.isFloor(Math.floor(l.x), Math.floor(l.y))) errors.push(`light "${l.name}" is not on a floor cell`);
  }
  for (const [x, y, w, h] of def.carve) {
    if (x < 1 || y < 1 || x + w > def.width - 1 || y + h > def.height - 1) {
      errors.push(`carve [${x},${y},${w},${h}] touches the map border`);
    }
  }
  return errors;
}
