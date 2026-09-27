// Chapter I, Langon: the cambion of Saint-Gervais and the witch under the bridge.
// Party: 4 PCs, level 2. Bacbuc (L3) alone = 60 XP, a Low encounter, softened further by
// Sickened 2.
import { npc, strike, ability, lore } from '../../lib/pf2e.mjs';
import { PF2E, uuid, link } from '../../lib/ids.mjs';

const communion = link(uuid.item('communion-impie'), 'Communion Impie');
const reconciliation = link(uuid.item('reconciliation-d-une-eglise'), "Réconciliation d'une Église");
const peste = link(uuid.item('la-peste-noire'), 'La Peste Noire');

const bacbuc = npc({
  slug: 'bacbuc',
  name: 'Bacbuc',
  tokenName: 'Père Clément',
  level: 3,
  traits: ['devil', 'fiend', 'humanoid', 'unholy'],
  rarity: 'unique',
  perception: 9,
  senses: ['darkvision'],
  languages: ['common', 'diabolic'],
  languageDetails: 'Latin (badly)',
  abilities: { str: 3, dex: 2, con: 2, int: 1, wis: 0, cha: 4 },
  skills: { deception: 12, diplomacy: 9, intimidation: 9, athletics: 8, religion: 5 },
  ac: 18,
  saves: { fort: 10, ref: 9, will: 7 },
  hp: 50,
  weaknesses: [{ type: 'holy', value: 5 }],
  speed: 25,
  speedDetails: 'fly 25 once his disguise falls',
  blurb: 'Cambion, squire of the Order of the Fly',
  items: [
    strike({ name: 'Censer', bonus: 11, damage: [['1d8+5', 'bludgeoning'], ['1d4', 'fire']], traits: ['unholy'], description: '<p>A swinging brass censer full of coals and something that is not incense.</p>' }),
    strike({ name: 'Claw', bonus: 11, damage: '1d6+5 slashing', traits: ['agile', 'unholy'] }),
    ability({
      name: 'Drunk on the Altar Wine',
      category: 'defensive',
      description: `<p>Bacbuc has been drinking the abbey's sacramental wine for a week. <strong>He begins any encounter ${link(PF2E.condition.sickened, 'Sickened 2')}</strong> and never spends actions to retch; he'd rather keep drinking. Apply the condition when combat begins.</p>`,
    }),
    ability({
      name: 'Priestly Guise',
      category: 'interaction',
      traits: ['illusion', 'unholy'],
      description: `<p>Bacbuc wears the seeming of a plump, red-faced country priest in a stained cassock. It holds up to touch, but not to listening: he blasphemes without noticing, gets the Mass backwards, blesses with the left hand.</p><p>A creature that converses with him for a minute, or watches him "celebrate", can attempt a @Check[religion|dc:16] check. <strong>Success</strong>: they realise he is no priest. <strong>Critical success</strong>: they also see the goat's pupils in his eyes and know him for a devil.</p><p>When the guise falls, his cassock splits over a pair of leathery wings (fly Speed 25).</p>`,
    }),
    ability({
      name: 'Unholy Communion',
      category: 'interaction',
      traits: ['unholy'],
      description: `<p>Before he's discovered, Bacbuc offers the party the sacrament: a wafer and wine from the abbey's chalice, "for the road, my children, for the road." A creature that accepts gains ${communion}.</p>`,
    }),
    ability({
      name: 'True Sacraments Burn',
      category: 'defensive',
      description: `<p>Bacbuc can counterfeit a sacrament but can't endure a real one.</p><ul><li>A flask of @UUID[${PF2E.equipment.holyWater}]{holy water} poured into his cup or thrown at him, or wine genuinely blessed and made to touch his lips, deals 2d6 spirit damage (in addition to his weakness) and ends his Priestly Guise.</li><li>A champion or divine spellcaster can spend 1 action speaking a true blessing over him (Religion check against his Will DC 17). On a success, he takes 1d6 spirit damage and is ${link(PF2E.condition.frightened, 'Frightened 1')}; on a critical success, 2d6 and Frightened 2.</li></ul>`,
    }),
    ability({
      name: 'Spit Burning Wine',
      actions: 2,
      category: 'offensive',
      traits: ['fire', 'unholy'],
      description: `<p>Bacbuc takes a mouthful from the chalice and sprays it out as flame in a 15-foot cone, dealing 3d6 fire damage (@Check[reflex|dc:19|basic]). He can't use Spit Burning Wine again for 1d4 rounds (he has to refill the chalice).</p>`,
    }),
    ability({
      name: 'Last Orders',
      category: 'interaction',
      description: `<p>At 15 HP or fewer, Bacbuc tries to bargain: the name of his master, the "true" way to Avignon, a cask of the good wine. If refused he flees up the bell tower and out through the louvres.</p>`,
    }),
    lore('Wine Lore', 10),
    lore('Hell Lore', 7),
  ],
  notes: `
<p>Bacbuc is a <em>cambion</em>, the child of an incubus and a mortal woman, raised in Hell as a squire of Beelzebub's <strong>Order of the Fly</strong>. The squires of the Fly follow the plague the way crows follow an army: wherever the Great Mortality empties a town, one of them comes to sit in its church, drink its wine, and turn its altar to the Order's use, so that the dead of the parish go into the ground unblessed. Bacbuc came to Langon a week ago, when the last monk of Saint-Gervais died in the choir. He has been drinking ever since. He is very good at being a devil and very bad at being a priest, and he has no idea which of these is the problem.</p>
<p><strong>Tactics.</strong> He would much rather talk than fight. He greets the party as travellers in need of comfort, pours wine, offers communion, and tells long, rambling, blasphemous homilies. Once discovered he fights sloppily: Spit Burning Wine at clusters, then the censer. He's Sickened 2 for the whole fight.</p>
<p><strong>Mechanical weakness.</strong> Weakness to holy 5, low Will (+7), and he starts every fight Sickened 2 and never retches.</p>
<p><strong>Lore weakness.</strong> <em>True sacraments burn.</em> Real holy water, genuinely blessed wine, or a true blessing spoken over him hurts him and strips his disguise (see True Sacraments Burn). The Archbishop's holy water from Saint Seurin is exactly what the party needs.</p>`,
  gmNotes: `<p>Defeating Bacbuc moves the Sin tracker +1. Each PC who took his communion is at −1 each. Reconciling the church afterwards (${reconciliation}) is another +1. If he's allowed to bargain, his master is a knight-commander of the Order of the Fly riding east ahead of the party, a thread for later.</p>`,
});

const guilhelma = npc({
  slug: 'guilhelma-la-masca',
  name: 'Guilhelma la Masca',
  level: 1,
  traits: ['human', 'humanoid'],
  rarity: 'unique',
  perception: 9,
  languageDetails: 'Gascon, Occitan, the Latin of prayers and the names of herbs',
  abilities: { str: -1, dex: 1, con: 0, int: 2, wis: 4, cha: 1 },
  skills: { medicine: 11, nature: 9, religion: 6, occultism: 7, diplomacy: 5 },
  ac: 14,
  saves: { fort: 4, ref: 5, will: 10 },
  hp: 18,
  hpDetails: 'half-drowned',
  speed: 25,
  blurb: 'Cunning woman of Langon',
  items: [
    strike({ name: 'Knife', bonus: 5, damage: '1d4 slashing', traits: ['agile', 'finesse'] }),
    ability({
      name: 'Remède de la Masca',
      actions: 'passive',
      category: 'interaction',
      traits: ['healing', 'manipulate'],
      description: `<p><strong>Once</strong>, as thanks for her life, Guilhelma can draw ${peste} out of one creature. It takes 10 minutes of herbs, smoke, a knife across the bubo and words half Latin and half something older. The creature is cured: remove the disease entirely, whatever its stage short of death.</p><p>She has only the strength (and the herbs) to do this once. She says so plainly.</p>`,
    }),
    lore('Herbalism Lore', 9),
  ],
  notes: `
<p>Guilhelma has been Langon's <em>masca</em> for thirty years: midwife, bone-setter, layer-out of the dead, seller of love-charms and fever-draughts, and the woman the priest preached against every Lent and sent for every time his own children were sick. When the Great Mortality came, her remedies saved a few and failed most, and the town, half-burned by the war and now dying of plague, needed someone to blame. They sewed her into a sack with stones and threw her from the bridge, as the old ordeal allows. If the water takes her, she is innocent; if it refuses her, she is a witch.</p>
<p>The water did not take her. A charm of her own, a green stone sewn into her hair, has kept breath in her for three days at the bottom of the Garonne, and it is almost spent. Whether that makes her a witch is a question the players will have to answer for themselves.</p>
<p><strong>Personality.</strong> Dry, practical, unsentimental, and furious. She forgives no one in Langon; most of them are dead now anyway. She is genuinely grateful to her rescuers and pays her debts. She knows the country between the Garonne and Toulouse, its herbs, its shrines, and its stories.</p>
<p><strong>Faith.</strong> She prays to the Virgin and to Saint Anne, and also to the river. She sees no contradiction. A pious PC may.</p>`,
  gmNotes: `<p>Saving her moves the Sin tracker <strong>+1</strong>. She can cure one PC of La Peste Noire, the party's early way out if someone fell for Mahaut's trap. She may reappear later as an ally, a suspect, or a victim of the penitents.</p>`,
});

export default [...bacbuc, ...guilhelma];
