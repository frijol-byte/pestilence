import { journal, readAloud, sinTracker, epigraph } from '../../lib/pf2e.mjs';
import { uuid, link, PF2E } from '../../lib/ids.mjs';

const lettre = link(uuid.item('lettre-de-l-archeveque'), "Lettre de l'Archevêque");
const peste = link(uuid.item('la-peste-noire'), 'La Peste Noire');
const route = link(uuid.journal('ch1-route-de-la-garonne'), 'La Route de la Garonne');

export default journal({
  slug: 'ch1-bordeaux',
  name: "I. Bordeaux, l'An de la Grande Mortalité",
  sort: 100,
  pages: [
    /* ------------------------------------------------------------ */
    {
      slug: 'overview',
      name: 'Pour le MJ : Aperçu',
      content: `
${epigraph('For death is come up into our windows, and is entered into our palaces, to cut off the children from without, and the young men from the streets.', 'Jeremiah 9:21')}
<h2>The Year of the Great Mortality</h2>
<p>It is late summer in the year of Our Lord 1348. In August the Great Mortality came up the Garonne in the holds of ships, and Bordeaux, the jewel of English Gascony and the greatest wine-port in Christendom, has become a city of the dead. The mayor has put the port quarter to the torch to burn the sickness out, and it has not worked. The markets are shut. The bells have stopped because the bell-ringers are dead. Those who can flee have fled; those who remain pray, and die, and are carted to the lime pits by men who will be carted there themselves within the week.</p>
<p>In Avignon, the Pope, Clement VI, still sits on the throne of Saint Peter. If anyone on earth can send grain, physicians and priests, and the grace of a plenary indulgence for the dying, it is he.</p>
<h2>This chapter</h2>
<ol>
  <li><strong>La Cathédrale Saint-André.</strong> The Archbishop of Bordeaux, Monseigneur Amanieu de Lormont, charges the party to carry his letter to the Pope in Avignon.</li>
  <li><strong>La Procession des Pénitents.</strong> Leaving the cathedral, the party meets a procession of penitents beating themselves with palm fronds: a people beginning to go mad.</li>
  <li><strong>La Ville Silencieuse.</strong> The party crosses a silent, dying city. There is nothing here for them. Every scene should push them toward the gate.</li>
  <li><strong>The road.</strong> Continue with ${route}.</li>
</ol>
<h2>Running the chapter</h2>
<ul>
  <li><strong>Party.</strong> Four characters of 2nd level.</li>
  <li><strong>Tone.</strong> Apocalyptic, biblical, grieving. Let silence do the work: describe what is missing (bells, voices, market cries) as much as what is there.</li>
  <li><strong>Pacing.</strong> The city holds nothing of value. If the players linger, escalate the dread (see <em>La Ville Silencieuse</em>) until leaving feels like mercy.</li>
  <li><strong>The plague.</strong> Rules for ${peste} are on the item. No one in the city should be touchable without risk; anyone who touches the dying bare-handed is exposed.</li>
</ul>
${sinTracker(
  '<strong>+1</strong> if the party performs an act of costly charity in the city (gives away its own food or money to the dying, carries a corpse to the pit, sits with the dying).',
  '<strong>−1</strong> if the party uses violence against the penitents, or against any of the sick or grieving of Bordeaux.',
)}`,
    },

    /* ------------------------------------------------------------ */
    {
      slug: 'saint-andre',
      name: 'La Cathédrale Saint-André',
      content: `
${epigraph('How doth the city sit solitary, that was full of people! how is she become as a widow!', 'Lamentations 1:1')}
<h2>Arrival</h2>
${readAloud(
  'The great west doors of Saint-André stand open, and the smell comes out to meet you before the dark does: tallow and incense, vinegar and lye, and beneath them all the sweet, heavy smell that has lain over Bordeaux for a month, which no one names.',
  'The nave is full. Not with worshippers: with the dying. They lie on straw between the pillars in rows as straight as the furrows of a field, and grey-robed brothers move among them with basins and candles. Someone is singing the <em>Miserere</em> very softly, alone, and losing the tune. High above, in the gloom of the vaults, the painted Christ of the Last Judgment divides the saved from the damned, and his raised hand is black with the smoke of a thousand candles.',
  'At the foot of the altar steps a single man kneels in a violet cope, so still you take him at first for one of the tomb effigies. Then he crosses himself, rises slowly, as if every joint has to be persuaded, and turns to face you.',
)}
<h2>Monseigneur Amanieu de Lormont</h2>
<p>The Archbishop of Bordeaux is past sixty, gaunt from fasting, grey-bearded and hollow-eyed. He has not left the cathedral in nineteen days. He buried his vicar-general on Tuesday and his confessor this morning. He is not sick, and he takes this as a sign that God has left him alive for a purpose.</p>
${readAloud(
  '"You came. Good. Forgive me if I do not bless you properly. My hand shakes, and I have blessed so many of the dead today that I fear the words are worn thin."',
  '"You have seen the city. You have smelled it. Three thousand souls since the Assumption, and the pits will not hold them. The physicians bleed them and they die. The priests shrive them and die after them. There are parishes in this city where there is no one left to give the last rites, and so men go before God unconfessed, and that, my children, is the second death, the one that St John warns us of."',
  '"I am writing to the Holy Father at Avignon. He must send grain, for the fields are unreaped. He must send physicians. He must send priests. And he must grant the dead of Bordeaux the plenary indulgence, so that those who die without a confessor may still be received into grace. A letter by sea would not arrive, and a letter by courier would be burned at the first gate by men afraid of what it carries. It must be carried by hand, by people who will not die on the road. God has kept you alive this long. I believe He has kept you for this."',
  'He holds out a letter sealed in red wax, and his hand does not shake at all.',
)}
<h2>What the Archbishop gives</h2>
<ul>
  <li>The ${lettre}: the sealed letter to Pope Clement VI, and a safe-conduct to every church between the Garonne and the Rhône.</li>
  <li>A purse of <strong>40 gp</strong> "for bread and passage. Do not spend it on wine; there is no wine to be had."</li>
  <li>Two lead ampullae of @UUID[${PF2E.equipment.holyWater}]{Holy Water} blessed at the tomb of Saint Seurin, "against what you may meet on the road. I pray you will not need them."</li>
</ul>
<h2>Questions the players may ask</h2>
<ul>
  <li><strong>"Why us?"</strong> "Because you are alive, and you are here, and you do not have the look of people who run. And because I dreamed of you." He will not elaborate on the dream unless pressed (see below).</li>
  <li><strong>"What is this plague?"</strong> "The physicians of Paris say it is a corruption of the air, born of a conjunction of Saturn, Jupiter and Mars in the house of Aquarius. The flagellants say it is the wrath of God. I say that I have been a priest for forty years, and I have never before been afraid to be alone in my own church at night."</li>
  <li><strong>"The road to Avignon?"</strong> Up the Garonne to Toulouse, then east by Carcassonne, Narbonne and Montpellier to the Rhône. More than a hundred leagues: three weeks on foot if the roads are kind. "They will not be kind."</li>
  <li><strong>The dream</strong> (if pressed, or on a DC 18 Diplomacy check): "I dreamed I stood on the quay at night, and a rider came up out of the Garonne on a pale horse, and the water did not wet him. He rode through the city and wherever he looked, a door was marked with a red cross. And then he turned his head and looked east, toward Avignon, and I woke. I tell myself it was a fever-dream. I do not have a fever."</li>
</ul>
<p>When the audience is over, the Archbishop blesses them after all, and goes back to his dying. As they leave, continue with <em>La Procession des Pénitents</em>.</p>`,
    },

    /* ------------------------------------------------------------ */
    {
      slug: 'penitents',
      name: 'La Procession des Pénitents',
      content: `
${epigraph('Have mercy upon me, O God, according to thy lovingkindness: according unto the multitude of thy tender mercies blot out my transgressions.', 'Psalm 51:1, the Miserere')}
${readAloud(
  'You step out of the cathedral into white, pitiless sunlight, and hear it before you see it: the slap of something on bare skin, over and over, dozens of times at once, like rain beginning on a roof. And under it, many voices chanting out of time with one another: <em>Miserere mei, Deus... Miserere mei, Deus...</em>',
  'They come up the Rue Sainte-Catherine in a long, shuffling column: forty, fifty souls, stripped to the waist or in shifts, barefoot on the stones. Each one carries a frond of dried palm, the palms of last Easter kept behind the crucifix at home, and each one is beating themselves with it across the shoulders, the chest, the face. The fronds have raised red weals on their skin and here and there a thin line of blood. It is not enough blood to matter. Not yet.',
  'At their head walks a tall friar in a grey habit with a wooden cross held high. His eyes are bright and very calm. Behind him, a girl of perhaps ten years beats her own small face with a palm leaf and weeps, and does not stop.',
)}
<h2>The procession</h2>
<p>These are ordinary Bordelais (a cooper, two fishwives, a notary's clerk, a whole family of tanners) who have concluded that the plague is God's punishment and that if they punish themselves first, He may relent. They are not dangerous. They are frightened, exhausted and more than a little exalted. They block the street for a few minutes as they pass.</p>
<ul>
  <li><strong>Frère Anselme</strong>, their leader, is a Franciscan whose own friary has lost every brother but him. He greets the party courteously, notes the Archbishop's seal if it is visible, and invites them to walk with the procession "to the church of Saint-Michel, where God may yet be listening." He says the Archbishop is a good man who is praying to the wrong God: "He asks for mercy. There is no more mercy. There is only the Judgment, and we must meet it with our backs bare."</li>
  <li><strong>The girl</strong> (Jehannette) stumbles out of line and clutches at a PC's hand to be pulled along. She is not sick. If comforted, she says her mother told her to walk with the Brother and not to stop hitting until God forgives them. She doesn't know what she did.</li>
  <li><strong>A woman</strong> presses a dried palm frond into a PC's hands: "For when it's your turn." It has no mechanical effect. Keep track of who carries it.</li>
</ul>
<p>If the party tries to stop the procession, the penitents simply flow around them, chanting louder. If attacked they scatter, screaming; use ${link(PF2E.npc.commoner, 'Commoner')} statistics if needed, but there should be no fight here.</p>
<h2>Foreshadowing</h2>
<p>These penitents will return later in the campaign, and they will have traded their palm fronds for scourges tipped with iron. Make Frère Anselme memorable: calm, kind, utterly certain. Let the players feel that something here is beginning, not ending.</p>
${sinTracker('<strong>−1</strong> if any PC strikes, shoves violently through, or otherwise harms a penitent.')}`,
    },

    /* ------------------------------------------------------------ */
    {
      slug: 'ville-silencieuse',
      name: 'La Ville Silencieuse',
      content: `
${epigraph('The ways of Zion do mourn, because none come to the solemn feasts: all her gates are desolate: her priests sigh, her virgins are afflicted, and she is in bitterness.', 'Lamentations 1:4')}
<p>Use these vignettes as the party crosses Bordeaux toward the <strong>Porte Saint-Julien</strong> and the road to Toulouse. Read one or two; there is no need to use them all. <strong>Nothing here rewards lingering</strong>: no shop is open, no one will sell, trade or talk for long, and every scene should push the party toward the gate.</p>

<h3>La Grosse Cloche</h3>
${readAloud(
  'The great bell-gate of the city stands over the street with its two round towers and its clock, and the clock has stopped at the ninth hour. The bell hangs silent. Someone has chalked on the gate, in letters as tall as a man: <em>MISERERE NOBIS</em>. Beneath it, in a smaller and later hand: <em>trop tard</em>. Too late.',
)}

<h3>The Market of Saint-Pierre</h3>
${readAloud(
  'The market square is empty. The stalls are still standing, their awnings furled; on one, a basket of plums has been left to rot and a cloud of wasps works at it with a sound like a distant saw. A dog lies in the shade of the fountain, too thin to lift its head. There is no crier, no haggling, no bells, no carts, no children. In the whole square the only voice is the fountain, talking to itself.',
)}

<h3>The Port</h3>
${readAloud(
  'Where the port quarter stood there is only a black field of ash, still smoking in places, and the chimneys of burned houses standing up out of it like the fingers of the drowned. On the river, three cogs ride at anchor with their sails still bent. No one has gone aboard them in a week. The gulls have.',
)}

<h3>Rue des Faures</h3>
${readAloud(
  'Every third door on the street is marked with a cross in red chalk. From behind one of them a woman is singing a lullaby, very steadily, over and over, and a child is not crying. At the end of the street two men in vinegar-soaked masks are loading a cart. They do not look up. The cart is already full, and they are stacking the new ones crosswise, the way you stack firewood.',
)}

<h3>L'Hôtel-Dieu</h3>
${readAloud(
  'At the hospice gate a nun with a face the colour of candle wax is turning people away. "No more beds," she tells them, one after another, "no more beds, no more beds, God forgive me, no more beds." She does not seem to know she is still saying it after they have gone.',
)}

<h3>If the players linger</h3>
<ul>
  <li><strong>First hour.</strong> Doors close as they approach. A shutter slams. Someone throws a pot of vinegar at them from a window: "Get away from my house! You carry it, you all carry it!"</li>
  <li><strong>Second hour.</strong> A dead-cart stops beside them. The driver, a ${link(PF2E.npc.commoner, 'Commoner')} whose own hands are black to the wrist, asks if they would help him lift a body. This is a real act of charity (and a real exposure risk to ${peste}).</li>
  <li><strong>Evening.</strong> The city watch, six frightened men, orders them out of the city by nightfall: strangers are being blamed for the pestilence, and the watch cannot protect them. There is nowhere to sleep; every inn is shut or full of the dead.</li>
</ul>
<h3>The gate</h3>
${readAloud(
  'The Porte Saint-Julien stands open and unguarded. Beyond it the road runs south and east between the vineyards toward Toulouse, white with dust in the afternoon sun, and the sky over it is enormous and empty. Behind you, Bordeaux is silent. Ahead of you, for the first time in days, you can hear birds.',
)}
<p>Continue with ${route}.</p>`,
    },
  ],
});
