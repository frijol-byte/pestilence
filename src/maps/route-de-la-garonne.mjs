// La Route de la Garonne: the Toulouse road beside the river, a few hours out of Bordeaux.
// Chapter I ambush ("Les Affamés"). 1 cell = 5 ft.
//
// Layout (north to south), per the brief:
//   river (Garonne)   rows 0-5
//   meadow / bank     rows 6-9    20 ft cleared
//   road              rows 10-13  20 ft wide
//   meadow / verge    rows 14-17  20 ft cleared
//   wheat             rows 18-25  endless, unharvested

export default {
  id: 'route-de-la-garonne',
  name: 'La Route de la Garonne',
  kind: 'outdoor',
  width: 40,
  height: 26,
  gridSize: 100,
  seed: 1356,
  darkness: 0,

  bands: [
    { type: 'river', from: 0, to: 6 },
    { type: 'meadow', from: 6, to: 10, bank: true },
    { type: 'road', from: 10, to: 14 },
    { type: 'meadow', from: 14, to: 18 },
    { type: 'wheat', from: 18, to: 26 },
  ],

  // Afternoon sun from the south-west: long shadows toward the river.
  sun: { azimuth: 225, elevation: 38 },

  features: [
    { type: 'palmFronds', x: 14.5, y: 15.2 },
    { type: 'trampled', path: [[18.5, 26], [18.2, 22], [18.5, 19.3]] }, // Guillot's hiding place
    { type: 'trampled', path: [[25.5, 26], [25.8, 22.5], [24.5, 19.4]] }, // Perrin's
    { type: 'lodged', x: 8, y: 22, r: 2.2 },
    { type: 'lodged', x: 31, y: 23.5, r: 2.8 },
    { type: 'lodged', x: 21.5, y: 24.5, r: 1.6 },
  ],

  props: [
    { type: 'waysideCross', x: 14.5, y: 15.5 },
    { type: 'overturnedCart', x: 29.4, y: 11.8, rot: 0.25 },
    { type: 'willow', x: 5.5, y: 6.6, r: 2.4 },
    { type: 'willow', x: 34.5, y: 7.0, r: 2.8 },
    { type: 'willow', x: 38.6, y: 6.4, r: 1.8 },
    { type: 'boat', x: 21.5, y: 6.5, rot: -0.35 },
    { type: 'scarecrow', x: 9.5, y: 21.5 },
    { type: 'scythe', x: 31.2, y: 18.35, rot: 0.2 },
    { type: 'milestone', x: 36.5, y: 14.4, text: 'TOLOSA' },
    { type: 'crows', x: 20, y: 21, w: 16, h: 4, n: 9 },
    { type: 'crows', x: 2, y: 14.4, w: 10, h: 2.5, n: 4 },
  ],

  lights: [],
};
