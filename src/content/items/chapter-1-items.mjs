import { equipment } from '../../lib/pf2e.mjs';

export default [
  ...equipment({
    slug: 'lettre-de-l-archeveque',
    name: "Lettre de l'Archevêque",
    img: 'systems/pf2e/icons/equipment/adventuring-gear/writ-of-authenticity.webp',
    rarity: 'unique',
    description: `
<p>A letter of heavy vellum folded in three and sealed in red wax with the arms of the Archbishop of Bordeaux: the Lamb of God over the crossed keys. It is addressed in a careful, shaking hand to <em>His Holiness Clement, sixth of that name, Bishop of Rome, at Avignon</em>.</p>
<p>A second sheet, unsealed, is a <strong>safe-conduct</strong> commending the bearers to every priest, abbot and Christian soul between the Garonne and the Rhône, and bidding them give the bearers bread, bed and passage "for the love of God and the salvation of this city."</p>
<hr />
<p><strong>Safe-conduct.</strong> While presenting the safe-conduct, you gain a +2 item bonus to Diplomacy checks to Request or Make an Impression on clergy and the devout. Toggle <em>Addressing clergy</em> on the Diplomacy roll.</p>`,
    gmDescription: `
<p>The sealed letter begs the Pope for grain, physicians, and priests to shrive the dying, and asks that the plague dead of Bordeaux be granted a plenary indulgence. Breaking the seal is a grave discourtesy; any cleric who notices the broken seal treats the bearers with suspicion (the safe-conduct bonus is lost with that person).</p>`,
    rules: [
      { key: 'RollOption', domain: 'diplomacy', option: 'pestilence:clergy', toggleable: true, label: 'Addressing clergy (safe-conduct)' },
      { key: 'FlatModifier', selector: 'diplomacy', type: 'item', value: 2, predicate: ['pestilence:clergy'], label: "Archbishop's safe-conduct" },
    ],
  }),
  ...equipment({
    slug: 'chevaliere-de-quinsac',
    name: 'Chevalière de Quinsac',
    img: 'systems/pf2e/icons/equipment/worn-items/other-worn-items/shadow-signet.webp',
    rarity: 'unique',
    level: 1,
    price: { gp: 10 },
    usage: 'worn',
    description: `
<p>A heavy gold signet ring, worn thin on the inside where it has turned on a finger for thirty years. The bezel bears the arms of the house of Quinsac: <em>a black boar on gold, beneath three silver ears of wheat</em>. The wheat is scratched almost smooth, as though someone has tried to cut it away with a knife.</p>`,
    gmDescription: `<p>Sire Bertrand de Quinsac's ring. He gives it freely if the party spares his people ("Take it. There is no more house of Quinsac."). Showing it to anyone of Gascon nobility later can open doors, or old grudges.</p>`,
  }),
];
