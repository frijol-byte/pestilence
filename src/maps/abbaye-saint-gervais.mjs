// L'Abbaye Saint-Gervais, Langon: a small abbey church, standing but desecrated.
// The cambion Bacbuc drinks in the choir. Oriented liturgically: altar to the east (right).
// 1 cell = 5 ft.

export default {
  id: 'abbaye-saint-gervais',
  name: "L'Abbaye Saint-Gervais (Langon)",
  width: 32,
  height: 21,
  gridSize: 100,
  seed: 1349,
  darkness: 0.55, // dusk inside a shuttered church

  carve: [
    [1, 8, 2, 4], //   west porch
    [3, 5, 16, 10], // nave with side aisles (80 ft x 50 ft)
    [19, 6, 7, 8], //  choir
    [26, 7, 4, 6], //  apse and high altar
    [20, 2, 4, 3], //  sacristy
    [21, 5, 1, 1], //   sacristy passage
    [3, 16, 4, 4], //  bell tower
    [4, 15, 1, 1], //   tower passage
  ],

  // Nave arcades separating the side aisles.
  pillars: [
    [6, 7], [9, 7], [12, 7], [15, 7],
    [6, 12], [9, 12], [12, 12], [15, 12],
  ],

  doors: [
    { x: 3, y: 9, orient: 'v', type: 'door', state: 'closed' }, // great west doors (two leaves)
    { x: 3, y: 10, orient: 'v', type: 'door', state: 'closed' },
    { x: 21, y: 5, orient: 'h', type: 'door', state: 'closed' }, // sacristy
    { x: 4, y: 15, orient: 'h', type: 'door', state: 'closed' }, // bell tower
  ],

  lights: [
    { name: 'Black candles on the altar', x: 27.5, y: 10, bright: 5, dim: 15, color: '#ff6a3a', alpha: 0.45, anim: 'torch', prop: null },
    { name: "Bacbuc's candles", x: 22.6, y: 8.2, bright: 10, dim: 20, color: '#ffb35c', alpha: 0.45, anim: 'flame', prop: 'candles' },
    { name: 'Last light through the west doors', x: 2, y: 10, bright: 0, dim: 20, color: '#8fa6c8', alpha: 0.2, anim: null, prop: null },
  ],

  features: [
    // coloured light through the south aisle windows, and the east window of the apse
    { type: 'stainedLight', x: 6.5, y: 13.4, colors: ['#b8282a', '#2d4fa0', '#d8a830'] },
    { type: 'stainedLight', x: 10.5, y: 13.4, colors: ['#2d4fa0', '#d8a830', '#3e8a4a'] },
    { type: 'stainedLight', x: 13.5, y: 13.4, colors: ['#b8282a', '#d8a830', '#2d4fa0'] },
    { type: 'stainedLight', x: 16.5, y: 13.4, colors: ['#3e8a4a', '#b8282a', '#2d4fa0'] },
    // tomb slabs of the abbots, set in the nave floor
    { type: 'tombSlab', x: 9.5, y: 9.5, text: 'HIC IACET' },
    { type: 'tombSlab', x: 12.5, y: 9.5, text: 'ORATE PRO EO' },
    // the desecration
    { type: 'wineTrail', from: [22.8, 7.4], to: [27, 9.6] },
    { type: 'wineTrail', from: [21, 10.5], to: [11, 10.2] },
    { type: 'wineTrail', from: [8, 10], to: [4.2, 12.2] },
    { type: 'graffiti', x: 24.6, y: 10.6, text: 'HOC EST CORPUS', size: 0.34, rot: -0.12, color: '#6e1016' },
    { type: 'graffiti', x: 14, y: 11.1, text: 'BIBAMVS', size: 0.4, rot: 0.08, color: '#6e1016' },
    { type: 'flies', x: 27.4, y: 10, r: 1.5, n: 120 },
    { type: 'flies', x: 9.8, y: 5.6, r: 2.2, n: 90 },
  ],

  props: [
    // choir and sanctuary
    { type: 'altar', x: 27, y: 8.8, w: 1.4, h: 2.4 },
    { type: 'cask', x: 22.3, y: 6.7 },
    { type: 'cask', x: 23.4, y: 6.6 },
    { type: 'cask', x: 24.2, y: 7.6, tipped: true },
    { type: 'chair', x: 23.2, y: 10, rot: Math.PI }, // the abbot's chair, where Bacbuc lounges
    { type: 'pew', x: 19.2, y: 6.3, w: 2.6 },
    { type: 'pew', x: 19.2, y: 13.3, w: 2.6, broken: true },
    { type: 'fallenRood', x: 19.6, y: 9.9 },
    { type: 'lectern', x: 20.4, y: 11.8, rot: 1.9 },
    // nave
    { type: 'font', x: 5, y: 13.5 },
    { type: 'toppledStatue', x: 7.8, y: 13.7, rot: 0.3 },
    { type: 'toppledStatue', x: 16.2, y: 5.6, rot: -0.2 },
    { type: 'shroud', x: 8.2, y: 5.55, rot: 0.02 },
    { type: 'shroud', x: 10, y: 5.6, rot: -0.03 },
    { type: 'shroud', x: 11.8, y: 5.55, rot: 0.05 },
    // sacristy: plundered
    { type: 'chest', x: 21.6, y: 2.8, open: true },
    { type: 'bones', x: 23.1, y: 3.8, n: 2 },
    // bell tower
    { type: 'bell', x: 5, y: 18 },
    { type: 'spiralStair', x: 3.9, y: 16.9 },
  ],
};
