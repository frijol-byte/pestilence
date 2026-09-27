// Chapter I, Langon: the unholy communion and the rite that undoes the abbey's desecration.
import { effect, ritual } from '../../lib/pf2e.mjs';
import { PF2E, link } from '../../lib/ids.mjs';

export default [
  ...effect({
    slug: 'communion-impie',
    name: 'Effect: Communion Impie',
    img: 'systems/pf2e/icons/spells/divine-plagues.webp',
    level: 3,
    traits: ['unholy'],
    rules: [
      { key: 'FlatModifier', selector: 'will', type: 'status', value: -1, label: 'Communion Impie' },
      {
        key: 'FlatModifier',
        selector: 'saving-throw',
        type: 'status',
        value: -1,
        predicate: ['item:trait:unholy'],
        label: 'Communion Impie (against unholy effects)',
      },
    ],
    description: `
<p>You have taken wine and bread from a devil's hand at a profaned altar. It tasted of vinegar and iron and something sweeter underneath, and it has not left you.</p>
<p>You take a –1 status penalty to Will saves, and to all saves against unholy effects.</p>
<p><strong>Ending the effect.</strong> Make a true confession to an ordained priest, or be present when a profaned church is reconciled.</p>`,
    gmDescription: `<p>Each creature that accepts the communion also moves the party's <strong>Sin tracker −1</strong>.</p>`,
  }),

  ...ritual({
    slug: 'reconciliation-d-une-eglise',
    name: "Réconciliation d'une Église",
    img: 'icons/magic/holy/chalice-glowing-gold-water.webp',
    rank: 2,
    rarity: 'uncommon',
    traits: ['consecration'],
    time: '3 hours',
    cost: 'Gregorian water: one flask of holy water, a handful each of salt and ashes, and a cup of wine, blessed together',
    primary: 'Religion',
    secondary: 'Religion, Crafting',
    secondaryCasters: 1,
    requirements: 'The primary caster must be a champion or a divine spellcaster.',
    area: null,
    range: 'the whole church',
    target: 'one profaned church or chapel',
    duration: 'permanent',
    description: `
<p><strong>Primary Check</strong> Religion (DC 18; the primary caster must be a champion or a divine spellcaster)</p>
<p><strong>Secondary Casters</strong> 1</p>
<p><strong>Secondary Checks</strong> Religion or Crafting (DC 16)</p>
<p><strong>Cost</strong> Gregorian water: a flask of @UUID[${PF2E.equipment.holyWater}]{Holy Water}, a handful each of salt and ashes, and a cup of wine, blessed together</p>
<hr />
<p>When blood has been shed in anger in a church, or its altar defiled, God does not dwell there until it is <em>reconciled</em>. The primary caster walks the church three times, sprinkling the walls and the altar with Gregorian water and singing the <em>Asperges me</em>, while the secondary caster scrubs the defiled places, rights the fallen cross, and mends what can be mended of the altar.</p>
<ul>
  <li><strong>Critical Success</strong> The church is reconciled, and more: for as long as it stands, creatures within it gain a +1 status bonus to saves against unholy effects and against fiends. Fiends and undead that enter it are ${link(PF2E.condition.sickened, 'Sickened 1')} while inside. Everyone present is freed of <em>Communion Impie</em>.</li>
  <li><strong>Success</strong> The church is reconciled and becomes consecrated ground again. Everyone present is freed of <em>Communion Impie</em>.</li>
  <li><strong>Failure</strong> The desecration holds. The cost is spent. The ritual can be attempted again after the next dawn.</li>
  <li><strong>Critical Failure</strong> The profanation answers. The primary caster is ${link(PF2E.condition.frightened, 'Frightened 2')} and ${link(PF2E.condition.drained, 'Drained 1')} until their next daily preparations, flies boil out of every crack in the stone, and the church can't be reconciled by these casters until a new moon.</li>
</ul>`,
    gmDescription: `<p>Success or critical success moves the party's <strong>Sin tracker +1</strong>.</p>`,
  }),
];
