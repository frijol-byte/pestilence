import { affliction } from '../../lib/pf2e.mjs';
import { PF2E, link } from '../../lib/ids.mjs';

// La Peste Noire — the campaign's central affliction.
// Level 3 disease, DC 20: a hard DC for a level 2 party ("harsh"). Tune per CLAUDE.md with a
// single-number change if it proves too lethal; don't log that in history/.
export default affliction({
  slug: 'la-peste-noire',
  name: 'La Peste Noire',
  img: 'systems/pf2e/icons/spells/divine-plagues.webp',
  level: 3,
  traits: ['disease'],
  save: { type: 'fortitude', dc: 20 },
  onset: [1, 'days'],
  stages: [
    { conditions: [['fatigued']], duration: [1, 'days'] },
    { conditions: [['fatigued'], ['enfeebled', 1]], duration: [1, 'days'] },
    { conditions: [['fatigued'], ['enfeebled', 2], ['drained', 1]], duration: [1, 'days'] },
    { conditions: [['sickened', 1], ['enfeebled', 2], ['drained', 2]], duration: [1, 'days'] },
    { conditions: [['unconscious']], duration: [1, 'days'] },
    { conditions: [], duration: [1, 'days'] },
  ],
  description: `
<p><em>"And I looked, and behold a pale horse: and his name that sat on him was Death, and Hell followed with him."</em> (Revelation 6:8)</p>
<p>The Great Mortality came up the Garonne in the bellies of ships. It begins as a fever and a weariness that sleep does not mend; then the <strong>buboes</strong> rise in the groin, the armpit and the neck, hard as walnuts and black as sin; then the skin blooms with dark spots, the breath turns foul, and the sick spit blood. Few who reach the fourth day see the seventh.</p>
<hr />
<p><strong>Saving Throw</strong> @Check[fortitude|dc:20]</p>
<p><strong>Transmission</strong> contact with the sick (touching bare skin, rags or bedding soaked with their sweat or the fluid of their buboes), the bite of plague fleas, or breathing the breath of those who cough blood. Protective gloves, a plague mask or a cloth soaked in vinegar grant a +2 circumstance bonus to the save.</p>
<p><strong>Onset</strong> 1 day</p>
<p><strong>Stage 1</strong> ${link(PF2E.condition.fatigued, 'Fatigued')}: fever and bone-weariness (1 day)</p>
<p><strong>Stage 2</strong> ${link(PF2E.condition.fatigued, 'Fatigued')} and ${link(PF2E.condition.enfeebled, 'Enfeebled 1')}: the buboes rise (1 day)</p>
<p><strong>Stage 3</strong> ${link(PF2E.condition.fatigued, 'Fatigued')}, ${link(PF2E.condition.enfeebled, 'Enfeebled 2')} and ${link(PF2E.condition.drained, 'Drained 1')}: black spots bloom on the skin (1 day)</p>
<p><strong>Stage 4</strong> ${link(PF2E.condition.sickened, 'Sickened 1')}, ${link(PF2E.condition.enfeebled, 'Enfeebled 2')} and ${link(PF2E.condition.drained, 'Drained 2')}: coughing blood (1 day)</p>
<p><strong>Stage 5</strong> ${link(PF2E.condition.unconscious, 'Unconscious')}: delirium and the death-sleep (1 day)</p>
<p><strong>Stage 6</strong> dead</p>`,
  gmDescription: `
<p><strong>Running the plague.</strong> Drag this item onto an exposed creature: the PF2e affliction tracker handles onset and stages. Roll the save once per day. A success reduces the stage by 1, a critical success by 2; a failure increases it by 1, a critical failure by 2.</p>
<p><strong>Earthly remedies</strong> (Treat Disease, theriac, bleeding the buboes) grant the usual bonuses and never more. The plague is a judgment as much as a sickness: true cures come from relics, saints and acts of faith found later in the campaign. Keep that hope alive but scarce.</p>`,
});
