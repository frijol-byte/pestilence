import { journal, readAloud, sinTracker, epigraph } from '../../lib/pf2e.mjs';
import { uuid, link, PF2E } from '../../lib/ids.mjs';

const bacbuc = link(uuid.actor('bacbuc'), 'Bacbuc ("Père Clément")');
const guilhelma = link(uuid.actor('guilhelma-la-masca'), 'Guilhelma la Masca');
const communion = link(uuid.item('communion-impie'), 'Communion Impie');
const reconciliation = link(uuid.item('reconciliation-d-une-eglise'), "Réconciliation d'une Église");
const peste = link(uuid.item('la-peste-noire'), 'La Peste Noire');
const scene = link(uuid.scene('abbaye-saint-gervais'), "L'Abbaye Saint-Gervais (scene)");

export default journal({
  slug: 'ch1-langon',
  name: 'III. Langon',
  sort: 300,
  pages: [
    /* ------------------------------------------------------------ */
    {
      slug: 'arrivee',
      name: 'Arrivée à Langon',
      content: `
${epigraph('Your country is desolate, your cities are burned with fire: your land, strangers devour it in your presence.', 'Isaiah 1:7')}
<p>Langon sits where the Toulouse road crosses the road south to Bazas, and it has the only stone bridge over the Garonne for many leagues. That made it worth fighting over. In the last three years French and English companies have taken it from each other twice, and each time they burned a little more of it. Then the Great Mortality came, and finished what the war began.</p>
${readAloud(
  'Langon announces itself with a gallows. It stands at the crossroads outside the town, and three men hang from it, so long dead that the crows have lost interest. Someone has hung a shield from the crossbeam: a fleur-de-lis on blue, split by an axe-blow.',
  'Beyond it the town is a ruin. Half the houses are black shells, their roofs fallen in; the rest stand with their doors hanging open, and nothing moves in them. A dog watches you from a doorway and does not bark. Grass is already growing in the market square. You hear the river long before you see it, loud in the silence: the Garonne, going under the arches of a great grey bridge.',
  'Above the roofs to the north rises the belfry of the abbey of Saint-Gervais. The sun is going down behind you, and every window of the town is dark but one. High in the abbey church, a small yellow light is burning.',
)}
<h2>The town</h2>
<p>There is nothing of value left in Langon. Soldiers and looters have taken everything portable; the plague took the people. A quick search turns up only signs: a child's shoe, a half-burned ledger of wine-tithes, a door marked with a red cross and then, in another hand, a black one. Two places draw the eye: <strong>the bridge</strong> and <strong>the abbey</strong>.</p>`,
    },

    /* ------------------------------------------------------------ */
    {
      slug: 'le-pont',
      name: 'Le Pont',
      content: `
${epigraph('Save me, O God; for the waters are come in unto my soul. I sink in deep mire, where there is no standing.', 'Psalm 69:1–2')}
${readAloud(
  'The bridge of Langon has five pointed arches and a little chapel-shrine at its middle, where travellers once left a coin for Saint Nicholas, patron of those in peril on the water. The shrine is empty. Nailed to its door is a square of parchment, and on it, in a clerk\'s careful hand: <em>ICI FUT JETÉE LA MASCA. QUE DIEU JUGE.</em> Here the witch was thrown. Let God judge.',
  'Below, the Garonne runs brown and quick through the arches.',
)}
<h2>The bundle</h2>
<p>A PC who looks over the parapet by the shrine and succeeds at a @Check[perception|dc:15] check notices a rope tied to an iron ring on the central pier, running taut down into the water. In a slack eddy beneath the arch, where the water clears, a long pale shape lies on the riverbed: a sack, human-sized, weighted with stones. <strong>Every few moments, a thread of bubbles rises from it.</strong></p>
<p>This is ${guilhelma}, the town's cunning woman, drowned by her neighbours as a witch three days ago. A charm sewn into her hair has kept breath in her, and it is almost spent.</p>
<h2>Saving her</h2>
<ul>
  <li><strong>Hauling her up.</strong> Pulling the weighted sack up by the rope takes a @Check[athletics|dc:18] check. Up to two other PCs can Aid.</li>
  <li><strong>Diving.</strong> A PC can climb or jump down and swim to her (@Check[athletics|dc:15] against the current) to cut the stones free, which drops the haul DC to 14.</li>
  <li><strong>Time.</strong> The charm will last for about a minute of effort: <strong>three attempts</strong>. On a critical failure the rope slips and she sinks deeper, and the next attempt is at +2 DC. If all three attempts fail, the bubbles stop.</li>
</ul>
${readAloud(
  'The sack comes up streaming, heavier than a body should be, and when you cut it open a woman\'s face comes out of it, grey-lipped, eyes screwed shut, hair full of weed and a green stone tied into it with thread. For a long moment she does not breathe. Then she coughs up half the Garonne onto the stones of the bridge, and draws a breath like a saw, and says in rough Gascon: "Well. God has judged, then. Who are you?"',
)}
<h2>Guilhelma</h2>
<p>She is sharp, furious and grateful, in that order. She tells the party what the town did to her and why ("because the herbs saved the baker's wife and not the priest's"). She knows the abbey is "wrong" since the last monk died, and advises them not to eat or drink anything they are given there.</p>
<p>As payment for her life she offers her <strong>Remède</strong>: <strong>once</strong>, she can cure one creature of ${peste} completely (see her sheet). This is the party's early way out if anyone was infected on the road. She can do it tonight, in the shelter of the bridge shrine.</p>
${sinTracker(
  '<strong>+1</strong> for saving Guilhelma.',
  '<strong>−1</strong> if the party harms or kills her once she is rescued, whatever they decide about what she is.',
)}`,
    },

    /* ------------------------------------------------------------ */
    {
      slug: 'abbaye',
      name: "L'Abbaye Saint-Gervais",
      content: `
${epigraph('Woe unto them that are mighty to drink wine, and men of strength to mingle strong drink.', 'Isaiah 5:22')}
<p><strong>Scene:</strong> ${scene}. <strong>Encounter:</strong> ${bacbuc}, 60 XP for four 2nd-level characters (Low), and he begins Sickened 2. Place the party in the west porch.</p>
<h2>The approach: wrongness</h2>
<p>Within about 60 feet of the church, the wrongness is unmistakable. Read or paraphrase, then let anyone who wishes attempt a @Check[religion|dc:14] or @Check[perception|dc:14] check. On a success they can name it: <em>this church has been profaned</em>.</p>
${readAloud(
  'No birds roost on the belfry. There are always birds on a belfry. There are flies instead, fat and blue and slow, crawling on the carved saints of the doorway, on their eyes and their mouths. The air smells of spilled wine, and of incense, and under the incense something like a struck match.',
  'If anyone carries holy water, the flask is warm to the touch, as though it had been sitting in the sun. And from inside, through the heavy west doors, comes a man\'s voice, singing, off-key and very happy, a drinking song in Latin.',
)}
<h2>Inside</h2>
${readAloud(
  'The nave is dim and long and smells like a tavern floor. The last light of the day comes in coloured through the south windows and lies across the flagstones in red and blue and gold, and across something else: a trail of wine, dark as old blood, that runs up the middle of the church to the altar. Three shrouded bodies lie along the north aisle, side by side, as though someone meant to bury them and forgot. A saint lies face down where he was thrown from his niche.',
  'The great rood cross that should hang over the choir lies on the floor, upside down. Beyond it, among three casks of the abbey\'s wine, a fat red-faced priest in a stained cassock is sprawled in the abbot\'s chair with a golden chalice in his hand. He lifts it to you with enormous good cheer.',
  '"Pilgrims! Welcome, welcome, my children! <em>Dominus vobiscum</em>, and also with the other fellow. Come in, come in, there is wine enough for the whole parish, and the whole parish is dead!"',
)}
<h2>Père Clément</h2>
<p>This is ${bacbuc}, a cambion of the Order of the Fly, in the guise of a country priest. He calls himself <strong>Père Clément</strong> "like my dear cousin in Avignon" (Pope Clement VI). He is delighted to have company, and tries very hard to sound priestly. He can't manage it.</p>
<p><strong>Blasphemies to drop into conversation</strong> (each one is a chance to see through him):</p>
<ul>
  <li>He crosses himself from right to left, bottom to top, and with his left hand.</li>
  <li>"Blessed are the poor, for they are so very easy to rob."</li>
  <li>"In the name of the Father, and of the Son, and of the... ah, the <em>other</em> one."</li>
  <li>"Let us pray," then he bows his head, "that the wine holds out."</li>
  <li>He says the words of consecration backwards, and giggles: "<em>Sum corpus... est hoc</em>, no, no."</li>
  <li>He refers to the Last Supper as "a very good party, until the end."</li>
</ul>
<p>Anyone who listens to him for a minute can attempt the @Check[religion|dc:16] check from his <em>Priestly Guise</em> to see through him.</p>
<h2>The unholy communion</h2>
${readAloud(
  '"But you are travellers, and the road is long, and who knows what is waiting on it?" Père Clément heaves himself up, wipes the chalice on his sleeve, and fills it from a cask. From a pyx he takes a wafer, grey at the edges. "Come. Kneel. Take, eat. Take, drink. For the road, my children, for the road."',
)}
<p>Each PC who accepts gains ${communion}. If a PC refuses, he takes no offence ("More for me!"), but he keeps offering, to each in turn, until someone accepts or someone calls him what he is.</p>
<h2>Unmasked</h2>
<p>When he's discovered (a successful Religion check spoken aloud, holy water, a true blessing, or violence), his cassock splits over a pair of leathery wings and he fights. See his sheet: he starts ${link(PF2E.condition.sickened, 'Sickened 2')}, has weakness to holy 5, and <strong>true sacraments burn him</strong>. The Archbishop's holy water from Saint Seurin is exactly the weapon for this. At 15 HP he tries to bargain; if refused, he flees up the bell tower.</p>
<h2>Treasure</h2>
<p>The abbey has been stripped. In the sacristy chest and the poor-box, the party finds <strong>20 gp</strong> in gold trinkets and leftover donations: a small gilt pyx, a handful of silver ex-votos (a leg, an eye, a child), and coins.</p>
<h2>Reconciling the church</h2>
<p>A champion or divine spellcaster can perform the ${reconciliation} ritual (3 hours; primary check Religion DC 18, secondary Religion or Crafting DC 16; costs one holy water, salt, ashes and wine). Success returns Saint-Gervais to God, and frees everyone present from Communion Impie.</p>
${readAloud(
  'When the last of the Gregorian water is sprinkled on the altar the flies, all of them at once, rise from the church in a single humming cloud and pour out through the west doors into the night. The rood is raised. The candles on the altar are white again. Somewhere above you, in the belfry where there is no longer any bell, something rings once, very softly.',
)}
${sinTracker(
  '<strong>−1</strong> for each PC who accepts the unholy communion.',
  '<strong>+1</strong> for defeating Bacbuc.',
  '<strong>+1</strong> for reconciling the church.',
)}`,
    },

    /* ------------------------------------------------------------ */
    {
      slug: 'depart',
      name: 'Onward',
      content: `
<p>The road to Toulouse crosses the bridge and runs east along the south bank of the Garonne. If the party spared Bacbuc and bargained with him, he told them his master rides ahead of them: a knight-commander of the <strong>Order of the Fly</strong>, going east toward Avignon. If they spoke with Guilhelma, she has told them the road, its shrines and its stories, and warned them that the flagellants have been seen on it.</p>
<p>If the church was reconciled, the party can sleep there in safety, the first safe night since Bordeaux.</p>`,
    },
  ],
});
