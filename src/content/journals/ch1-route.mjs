import { journal, readAloud, sinTracker, epigraph } from '../../lib/pf2e.mjs';
import { uuid, link, PF2E } from '../../lib/ids.mjs';

const bertrand = link(uuid.actor('sire-bertrand-de-quinsac'), 'Sire Bertrand de Quinsac');
const guillot = link(uuid.actor('guillot-de-quinsac'), 'Guillot');
const perrin = link(uuid.actor('perrin-de-quinsac'), 'Perrin');
const mahaut = link(uuid.actor('mahaut-la-pestiferee'), 'Mahaut');
const peste = link(uuid.item('la-peste-noire'), 'La Peste Noire');
const chevaliere = link(uuid.item('chevaliere-de-quinsac'), 'Chevalière de Quinsac');
const scene = link(uuid.scene('route-de-la-garonne'), 'La Route de la Garonne (scene)');

export default journal({
  slug: 'ch1-route-de-la-garonne',
  name: 'II. La Route de la Garonne',
  sort: 200,
  pages: [
    /* ------------------------------------------------------------ */
    {
      slug: 'le-depart',
      name: 'Le Départ',
      content: `
${epigraph('The harvest truly is plenteous, but the labourers are few.', 'Matthew 9:37')}
${readAloud(
  'The road leaves Bordeaux between the vineyards and follows the Garonne south and east, and within an hour the city is only a smudge of smoke behind you. The river runs wide and brown on your left hand, slow with the summer, and on your right the fields go on and on to the edge of the sky.',
  'It is the end of August, and the harvest has not been brought in. The wheat stands over the height of a man\'s waist, heavy and bowed and gone to bronze, and in places it has already begun to fall and rot where it stands. There is no one in it. No reapers singing, no gleaners, no carts. Now and then you pass a sickle or a scythe left lying at the edge of a field, as if the hand that held it had simply been called away mid-stroke.',
  'The crows have noticed. There are more of them than you have ever seen, sitting fat and silent along the field-edges, and they watch you pass.',
)}
<p>The party walks for two to three hours without meeting another living soul. Give them a moment to talk about the city, the Archbishop, the penitents. Then run <em>Les Affamés</em>.</p>`,
    },

    /* ------------------------------------------------------------ */
    {
      slug: 'les-affames',
      name: 'Les Affamés',
      content: `
<p><strong>Scene:</strong> ${scene}. <strong>Encounter:</strong> 105 XP for four 2nd-level characters (between Moderate and Severe). Morale, food and Bertrand's weaknesses should end it early; it may never begin.</p>
<h2>The map</h2>
<p>A straight stretch of the Toulouse road, 20 feet wide, running west to east. North of the road, 20 feet of meadow runs down to the muddy bank of the Garonne. South of the road, 20 feet of rough verge and a stone wayside cross give way to endless, unharvested wheat. The party enters from the <strong>west</strong>.</p>
<ul>
  <li><strong>The Garonne</strong> (north edge). Deep and strong: swimming requires a @Check[athletics|dc:15] check. The reedy mud of the bank is difficult terrain. A fishing boat lies pulled up in the reeds.</li>
  <li><strong>Meadows and road.</strong> Open ground. The overturned cart on the road is standard cover.</li>
  <li><strong>The wheat</strong> (south). Difficult terrain. A Medium creature in the wheat is concealed, and can Hide there.</li>
  <li><strong>The wayside cross.</strong> A weathered stone <em>calvaire</em> on the south verge. Its Christ has lost his face to the weather. Old palm fronds lie at its foot.</li>
</ul>
<h2>Setup</h2>
<ul>
  <li>${mahaut} sits at the foot of the wayside cross, face wrapped in rags, the lure.</li>
  <li>${guillot} and ${perrin} are Hidden in the wheat south of the road, 20–30 feet apart, pitchforks ready.</li>
  <li>${bertrand} waits behind the overturned cart that blocks the eastern half of the road, in rusted full plate and a surcoat with a black boar on gold.</li>
</ul>
${readAloud(
  'Ahead, the road runs straight and white beside the river. A cart lies on its side across it, one wheel still turning very slowly in the wind. At the foot of a stone wayside cross on the right-hand verge a woman sits hunched in the dust, her face and throat wrapped in dirty linen, and as you come near she lifts one hand toward you.',
  '"Pour l\'amour de Dieu," she says, in the thick Gascon of the river villages. "For the love of God. Bread. Only a little bread. For my children."',
)}
<h2>The ambush</h2>
<p>If the party approaches Mahaut, or reaches the cart, Bertrand rises from behind it and draws his greatsword. He speaks first:</p>
${readAloud(
  'A man rises from behind the cart in a harness of plate armour gone orange with rust, a great two-handed sword resting on his shoulder. His surcoat was once gold. The black boar on it is faded almost to grey. On either side of the road the wheat stirs and two men stand up out of it with pitchforks, thin as rakes, their eyes too big for their faces.',
  '"I am Bertrand, lord of Quinsac," the armoured man says, and his voice is very tired. "I do not want your blood. I want your bread. Leave your food on the road, all of it, and go on with God. I will not ask twice."',
)}
<p>If the party refuses, attacks, or tries to bluff, roll initiative. Bertrand holds the road; the peasants attack from the wheat with their reach. Mahaut does not attack, but reaches for anyone who comes near her.</p>

<h2>The plague</h2>
<p>This is the party's first brush with ${peste}. Any PC within 30 feet of Mahaut can notice her buboes with a @Check[perception|dc:12] check. Anyone who touches her bare-handed, or whom she touches, must save against @Check[fortitude|dc:20] or be exposed. Let them notice; let them choose.</p>

<h2>Ending it without blood</h2>
<p>This encounter is designed to be resolved peacefully by a merciful or clever party. Any of these works:</p>
<ul>
  <li><strong>Food.</strong> Giving up at least <strong>three days of ${link(PF2E.equipment.rations, 'rations')}</strong> (or equivalent) ends the encounter immediately. A peasant offered food during combat stops fighting at once.</li>
  <li><strong>The Oath of Quinsac.</strong> Recognising Bertrand's arms (@Check[society|dc:15]) or recalling the words of a knight's dubbing (@Check[religion|dc:16]) lets a PC remind him of his vows: a Diplomacy check against his Will DC 19, with a +4 circumstance bonus if food for his people is offered. On a success he lowers his sword.</li>
  <li><strong>The Archbishop's letter.</strong> Showing the Archbishop's seal and naming the errand (Diplomacy DC 17) makes Bertrand hesitate, and the peasants cross themselves and back away. Bertrand asks: "Does the Pope know? Does anyone know what is happening to us?"</li>
  <li><strong>Mercy to Mahaut.</strong> Treating her, sheltering her, or giving her last rites (@Check[religion|dc:15]) disarms Perrin completely, and Guillot with him.</li>
  <li><strong>Intimidation.</strong> A convincing show of force (Intimidation against the peasants' Will DC 12) sends the peasants running. Bertrand stays, and now has nothing to lose.</li>
</ul>

<h2>Morale</h2>
<ul>
  <li>The peasants flee at 4 HP or fewer, when Bertrand yields, or when Bertrand falls. <strong>Perrin will not flee while Mahaut is on the field</strong>, and goes berserk if she is hurt.</li>
  <li>Bertrand yields at 15 HP or fewer and asks mercy for his people, not himself.</li>
  <li>If any of the people of Quinsac dies, Bertrand fights to the death with a +2 status bonus to damage.</li>
</ul>

${sinTracker(
  '<strong>+1</strong> if the encounter ends with none of the people of Quinsac killed (fed, persuaded, allowed to flee, or accepted in surrender).',
  '<strong>−1</strong> if the party kills Mahaut. She is no threat, and there were gentler ways to keep her at bay.',
  '<strong>−1</strong> if the party kills anyone who has yielded or is fleeing.',
  'Killing in the heat of a fight the party did not choose is not by itself sinful: Bertrand drew first.',
)}`,
    },

    /* ------------------------------------------------------------ */
    {
      slug: 'apres',
      name: 'Après',
      content: `
<h2>If the people of Quinsac live</h2>
${readAloud(
  'The knight sits down heavily on the edge of the cart, as though his strings have been cut, and lays the greatsword across his knees. For a long moment he says nothing. Then he twists the ring off his finger and holds it out to you.',
  '"Take it. There is no more house of Quinsac. There is a church with no priest and a pit behind it, and eleven people who were my people, and a harvest that will rot because there is no one to cut it. I fought at Crécy. I thought that was the end of the world. I was a fool."',
)}
<ul>
  <li>Bertrand gives the party his ${chevaliere}.</li>
  <li>He tells them of the ferryman of Quinsac who, on the night the plague came, saw <strong>a rider on a pale horse</strong> cross the Garonne without touching the water, riding east. If the players heard the Archbishop's dream, let the parallel land.</li>
  <li>Mahaut asks that someone carry bread to her children in Quinsac, a league back toward the river. Doing so costs half a day and is an act of charity; it is not required.</li>
  <li>Bertrand may ask to come with the party as far as Toulouse. That is a future hook; he can also simply lead his people home.</li>
</ul>
<h2>If they do not</h2>
<p>There is no treasure worth the name: a rusted harness of plate, two pitchforks, a heel of black bread in Mahaut's apron that she was saving for her children, and the ring on Bertrand's finger. Describe the silence afterwards. Describe the crows.</p>
<h2>Onward</h2>
<p>The road continues up the Garonne. By dusk it reaches the crossroads town of Langon: continue with ${link(uuid.journal('ch1-langon'), 'III. Langon')}. Any PC exposed to ${peste} begins rolling saves after its 1-day onset. Track it.</p>`,
    },
  ],
});
