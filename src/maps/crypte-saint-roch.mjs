// La Crypte de Saint-Roch — test map for the Pestilence module.
// A parish crypt beneath a plague-struck church. Saint Roch is the patron of plague
// victims; his crypt has been turned into a place where something infernal is fed.
//
// All positions are in grid cells (1 cell = 5 ft = 100 px).

export default {
  id: 'crypte-saint-roch',
  name: 'La Crypte de Saint-Roch',
  width: 36,
  height: 24,
  gridSize: 100,
  seed: 1348, // the Black Death reaches France

  // Floor areas: [x, y, w, h]
  carve: [
    [2, 2, 5, 5], // A. Stair hall from the church above
    [7, 4, 4, 1], //    passage to the nave
    [11, 2, 14, 9], // B. Nave of the Dead
    [13, 1, 1, 1], //    ossuary niches along the north wall
    [16, 1, 1, 1],
    [20, 1, 1, 1],
    [23, 1, 1, 1],
    [25, 6, 3, 1], //    passage to the chapel
    [28, 3, 6, 8], // C. Chapel of Saint Roch
    [17, 11, 2, 2], //    stair-less ramp down to the pit
    [12, 13, 14, 7], // D. The Lime Pit
    [30, 11, 1, 5], //    collapsed passage chapel -> pit
    [26, 16, 5, 1],
    [8, 16, 4, 1], //    hidden passage
    [1, 11, 7, 11], // E. The Inverted Sanctum
  ],

  // Solid piers inside the nave (these block movement and sight).
  pillars: [
    [14, 4], [14, 8], [18, 4], [18, 8], [22, 4], [22, 8],
  ],

  // type: door | secret ; state: closed | locked
  doors: [
    { x: 11, y: 4, orient: 'v', type: 'door', state: 'closed', mark: 'plague-cross' },
    { x: 28, y: 6, orient: 'v', type: 'door', state: 'closed' },
    { x: 12, y: 16, orient: 'v', type: 'secret', state: 'closed' },
    { x: 8, y: 16, orient: 'v', type: 'door', state: 'locked', material: 'iron' },
  ],

  stairs: [{ x: 2, y: 2, w: 5, h: 2, up: 'north' }],

  // Light sources: rendered into the image AND emitted as Foundry AmbientLights.
  // bright/dim are in feet. Colours are hex.
  lights: [
    { name: 'Daylight from the church', x: 4.5, y: 2.6, bright: 0, dim: 20, color: '#9fb4d8', alpha: 0.25, anim: null, prop: null },
    { name: 'Niche candle', x: 13.5, y: 1.6, bright: 5, dim: 10, color: '#ffb35c', alpha: 0.4, anim: 'torch', prop: 'candles' },
    { name: 'Niche candle', x: 16.5, y: 1.6, bright: 5, dim: 10, color: '#ffb35c', alpha: 0.4, anim: 'torch', prop: 'candles' },
    { name: 'Niche candle', x: 20.5, y: 1.6, bright: 5, dim: 10, color: '#ffb35c', alpha: 0.4, anim: 'torch', prop: 'candles' },
    { name: 'Niche candle', x: 23.5, y: 1.6, bright: 5, dim: 10, color: '#ffb35c', alpha: 0.4, anim: 'torch', prop: 'candles' },
    { name: 'Votive stand', x: 18.5, y: 6.5, bright: 10, dim: 20, color: '#ff9f45', alpha: 0.45, anim: 'flame', prop: 'candelabrum' },
    { name: 'Votives of Saint Roch', x: 31, y: 5.2, bright: 10, dim: 25, color: '#ffc36e', alpha: 0.45, anim: 'flame', prop: 'candles' },
    { name: 'Lime phosphorescence', x: 19, y: 16.5, bright: 5, dim: 25, color: '#a6d86a', alpha: 0.35, anim: 'ghost', prop: null },
    { name: 'The Seventh Circle', x: 4.5, y: 16.5, bright: 5, dim: 30, color: '#d0142a', alpha: 0.55, anim: 'pulse', prop: null },
    { name: 'Black altar candles', x: 4.5, y: 13, bright: 0, dim: 15, color: '#ff5a3c', alpha: 0.4, anim: 'torch', prop: null },
  ],

  // Painted floor features (drawn onto the floor texture).
  features: [
    { type: 'inscription', x: 4.5, y: 5.3, text: 'SAINT ROCH · PRIEZ POUR NOUS', size: 0.3, w: 4.4, color: '#c9bfa6' },
    { type: 'inscription', x: 18, y: 10.55, text: 'ICI GISENT CEUX QUE LA PESTE A PRIS', size: 0.3, w: 7.5, color: '#b9ae95' },
    { type: 'memento', x: 31, y: 7.8, r: 1.9 },
    { type: 'limePit', x: 19, y: 16.5, r: 2.4 },
    { type: 'infernalCircle', x: 4.5, y: 16.5, r: 2.8, points: 7, text: 'DIES IRAE DIES ILLA SOLVET SAECLVM IN FAVILLA' },
    { type: 'bloodTrail', from: [12.4, 16.5], to: [9, 16.5] },
    { type: 'bloodTrail', from: [7.6, 16.5], to: [5.6, 16.8] },
    { type: 'rubble', x: 30, y: 11, w: 1, h: 5 },
    { type: 'rubble', x: 26, y: 16, w: 4, h: 1 },
  ],

  // 3D props. Positions are cell-space centres unless w/h given (then top-left).
  props: [
    // Nave
    { type: 'sarcophagus', x: 15, y: 6, w: 2, h: 1, effigy: true },
    { type: 'sarcophagus', x: 20, y: 6, w: 2, h: 1, effigy: true },
    { type: 'sarcophagus', x: 22.2, y: 9.1, w: 2, h: 0.9, open: true },
    { type: 'sarcophagus', x: 12.2, y: 9.1, w: 2, h: 0.9, effigy: true },
    { type: 'skullPile', x: 13.5, y: 1.45 },
    { type: 'skullPile', x: 16.5, y: 1.45 },
    { type: 'skullPile', x: 20.5, y: 1.45 },
    { type: 'skullPile', x: 23.5, y: 1.45 },
    { type: 'bones', x: 23.1, y: 8.3, n: 10 },
    { type: 'bones', x: 12.6, y: 3.0, n: 6 },
    // Chapel
    { type: 'statue', x: 31, y: 3.55, headless: true },
    { type: 'pew', x: 28.6, y: 6.0, w: 1.8 }, { type: 'pew', x: 31.6, y: 6.0, w: 1.8 },
    { type: 'pew', x: 28.6, y: 9.4, w: 1.8, broken: true }, { type: 'pew', x: 31.6, y: 9.4, w: 1.8 },
    // Pit
    { type: 'shroud', x: 16.2, y: 14.6, rot: 0.4 }, { type: 'shroud', x: 21.8, y: 14.2, rot: -0.2 },
    { type: 'shroud', x: 18.3, y: 15.6, rot: 1.1, sunk: true }, { type: 'shroud', x: 20.1, y: 17.4, rot: -0.7, sunk: true },
    { type: 'shroud', x: 23.4, y: 18.3, rot: 1.5 }, { type: 'shroud', x: 13.6, y: 18.4, rot: 0.1 },
    { type: 'cart', x: 14.3, y: 14.3, rot: 0.3 },
    { type: 'sacks', x: 24.4, y: 13.8 },
    { type: 'beakMask', x: 22.6, y: 16.9, rot: 2.2 },
    { type: 'bones', x: 16.5, y: 18.6, n: 8 },
    // Sanctum
    { type: 'altar', x: 3, y: 12, w: 3, h: 0.9 },
    { type: 'circleCandles', x: 4.5, y: 16.5, r: 2.8, points: 7 },
    { type: 'bones', x: 2.2, y: 20.4, n: 12 },
    { type: 'bones', x: 6.6, y: 19.8, n: 7 },
    { type: 'chains', x: 1.25, y: 15, n: 3 },
    { type: 'chains', x: 7.75, y: 13.2, n: 2 },
  ],

  // GM notes that become Foundry map notes later (not emitted yet).
  keys: {
    A: 'Stair hall', B: 'Nave of the Dead', C: 'Chapel of Saint Roch', D: 'The Lime Pit', E: 'The Inverted Sanctum',
  },
};
