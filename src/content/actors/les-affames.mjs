// Chapter I — "Les Affamés" (the Starving): the bandits on the Garonne road.
// Party: 4 PCs, level 2. Budget: Bertrand (L3, 60 XP) + 2 peasants (L-1, 15 each)
// + Mahaut (L-1, 15) = 105 XP, between Moderate (80) and Severe (120). Morale, food and
// Bertrand's weaknesses are meant to end the fight early or avoid it entirely.
import { npc, strike, ability, lore } from '../../lib/pf2e.mjs';
import { PF2E, uuid, link } from '../../lib/ids.mjs';

const peste = link(uuid.item('la-peste-noire'), 'La Peste Noire');

const bertrand = npc({
  slug: 'sire-bertrand-de-quinsac',
  name: 'Sire Bertrand de Quinsac',
  level: 3,
  traits: ['human', 'humanoid'],
  rarity: 'unique',
  perception: 7,
  languages: ['common'],
  languageDetails: 'Gascon, French, a little English',
  abilities: { str: 4, dex: -1, con: 3, int: 0, wis: 1, cha: 2 },
  skills: { athletics: 11, intimidation: 9, religion: 6, society: 6 },
  ac: 19,
  acDetails: 'rusted full plate',
  saves: { fort: 12, ref: 4, will: 9 },
  hp: 50,
  speed: 15,
  speedDetails: 'rusted full plate; an English arrowhead in the thigh',
  blurb: 'Knight of Crécy, lord of a dead village',
  items: [
    strike({ name: 'Greatsword', bonus: 12, damage: '1d12+7 slashing', traits: ['versatile-p'] }),
    strike({ name: 'Gauntlet', bonus: 10, damage: '1d4+7 bludgeoning', traits: ['agile', 'nonlethal', 'unarmed'] }),
    ability({
      name: 'The Crécy Wound',
      category: 'defensive',
      description: `<p>An English bodkin point is still lodged in Bertrand's thigh, and his armour has rusted at every joint. He can't Stride more than once per turn, and he can't Step.</p><p>A creature that Strides away from Bertrand after he has already Strided this turn is effectively out of his reach until his next turn: fast, mobile and ranged characters can take this fight apart.</p>`,
    }),
    ability({
      name: 'Reactive Strike',
      actions: 'reaction',
      category: 'defensive',
      slug: 'reactive-strike',
      description: '<p>@Localize[PF2E.NPC.Abilities.Glossary.ReactiveStrike]</p>',
    }),
    ability({
      name: "Liege's Duty",
      actions: 'reaction',
      category: 'defensive',
      description: `<p><strong>Trigger</strong> A Strike targets one of the people of Quinsac adjacent to Bertrand.</p><hr /><p><strong>Effect</strong> Bertrand steps into the blow. He becomes the target of the triggering Strike instead, compared against his AC.</p>`,
    }),
    ability({
      name: 'Wide Swing',
      actions: 2,
      category: 'offensive',
      traits: ['flourish'],
      description: `<p>Bertrand swings his greatsword in a great arc. He makes a single greatsword Strike and compares the attack roll to the AC of each enemy within his reach. Roll damage once and apply it to each creature hit. This counts as one attack for his multiple attack penalty.</p>`,
    }),
    ability({
      name: 'The Oath of Quinsac',
      category: 'interaction',
      description: `<p>Bertrand was dubbed to protect the Church, the weak and his own people, and some part of him still is that man.</p><ul><li><strong>Yielding.</strong> A creature that reminds Bertrand of his oath (a DC 16 Religion or Society check to recall the words of the dubbing, then Diplomacy against his Will DC 19; +4 circumstance if the party offers food for his people) makes him lower his sword. The fight ends.</li><li><strong>Morale.</strong> At 15 HP or fewer, Bertrand yields and begs mercy for his people rather than himself.</li><li><strong>Despair.</strong> If one of the people of Quinsac dies, Bertrand fights to the death and gains a +2 status bonus to damage rolls.</li></ul>`,
    }),
    lore('Warfare Lore', 8),
    lore('Heraldry Lore', 7),
  ],
  notes: `
<p>Bertrand de Quinsac fought at Crécy in 1346, under the leopards of the English king as a good Gascon should, and came home with an arrow in his thigh that no surgeon could draw. Two summers later the Great Mortality came up the Garonne and took his wife, his two sons, his chaplain and two thirds of the village of Quinsac in a single month. The harvest stands rotting in the fields because there is no one left to reap it. Bertrand has sold his horse, his books and his wife's rings for bread, and when there was nothing left to sell he led the last of his villeins out onto the Toulouse road to take what they could not buy. He hates what he has become more than the players ever could.</p>
<p><strong>Tactics.</strong> Bertrand blocks the road behind an overturned cart while his peasants hide in the wheat. He wants food, not blood: he calls out a demand first ("Your bread, and go with God"). Once blows are struck he fights like the soldier he was: he holds the road, uses Wide Swing when flanked, and throws himself in front of his people with Liege's Duty.</p>
<p><strong>Mechanical weakness.</strong> Terrible Reflex (+4) and The Crécy Wound: a party that keeps moving and keeps its distance can beat him without ever standing in his reach.</p>
<p><strong>Lore weakness.</strong> The Oath of Quinsac. The arms on his surcoat (a black boar beneath three ears of wheat; Society DC 15 to recognise them) tell the players who he is. A knight reminded of his vows, and offered a way to feed his people, will lay down his sword.</p>`,
  gmNotes: `<p>If spared, Bertrand gives the party his signet ring (${link(uuid.item('chevaliere-de-quinsac'), 'Chevalière de Quinsac')}) and a warning: on the night the plague came to Quinsac, the ferryman saw a rider on a pale horse cross the Garonne without touching the water. Bertrand may return later in the campaign as an ally, or as a penitent.</p>`,
});

function peasant({ slug, name, notes }) {
  return npc({
    slug,
    name,
    level: -1,
    rarity: 'unique',
    perception: 3,
    languageDetails: 'Gascon',
    abilities: { str: 2, dex: 1, con: 1, int: -1, wis: 1, cha: 0 },
    skills: { athletics: 5, survival: 3 },
    ac: 13,
    saves: { fort: 5, ref: 4, will: 2 },
    hp: 9,
    hpDetails: 'starving',
    speed: 25,
    blurb: 'Starving villein of Quinsac',
    items: [
      strike({ name: 'Pitchfork', bonus: 6, damage: '1d6+2 piercing', traits: ['reach-10'] }),
      strike({ name: 'Fist', bonus: 5, damage: '1d4+2 bludgeoning', traits: ['agile', 'nonlethal', 'unarmed'] }),
      ability({
        name: 'Pitch and Push',
        actions: 1,
        description: `<p><strong>Requirements</strong> The peasant's last action was a successful pitchfork Strike.</p><hr /><p><strong>Effect</strong> The peasant shoves the creature they hit 5 feet away and it falls ${link(PF2E.condition.prone, 'Prone')}. The target can attempt a @Check[reflex|dc:13] save to avoid falling prone, and isn't moved at all on a critical success.</p>`,
      }),
      ability({
        name: 'Starving',
        category: 'interaction',
        description: `<p>The peasant hasn't eaten properly in a week. They stop fighting at once if offered food (a day's ${link(PF2E.equipment.rations, 'rations')} or more), and flee when reduced to 4 HP or fewer, when Bertrand yields, or when Bertrand falls.</p>`,
      }),
      lore('Farming Lore', 4),
    ],
    notes,
  });
}

const guillot = peasant({
  slug: 'guillot-de-quinsac',
  name: 'Guillot',
  notes: `
<p>Guillot is the elder of two brothers who farmed a strip of Bertrand's land beside the Garonne. He is broad, slow-spoken and ashamed; he has never struck a man in his life, and he holds his pitchfork like a hay-rake. He buried his mother and his three daughters in the lime pit behind Quinsac church a fortnight ago and has not wept since. He follows Bertrand because the knight is the last authority left in his world. If the party feeds him he will cry openly, and he will tell them everything: the harvest nobody could reap, the priest who died first, the pale rider the ferryman saw. He hides in the wheat on the south side of the road and attacks from within it, using his pitchfork's reach to stay out of harm's way.</p>`,
});

const perrin = peasant({
  slug: 'perrin-de-quinsac',
  name: 'Perrin',
  notes: `
<p>Perrin is Guillot's younger brother and Mahaut's husband. He is quick, angry, and much more dangerous than he looks, because he has already decided that his wife is going to die and that nobody in the world will help her. He hides in the wheat opposite his brother and is the first to strike and the last to yield. He will not flee while Mahaut is on the field. If anyone hurts her he goes berserk, ignores his morale threshold, and fights until he drops. Kindness shown to Mahaut (Treat Wounds, last rites, a blanket) disarms him completely.</p>`,
});

const mahaut = npc({
  slug: 'mahaut-la-pestiferee',
  name: 'Mahaut',
  tokenName: 'A woman in rags',
  level: -1,
  rarity: 'unique',
  perception: 2,
  perceptionDetails: 'fevered',
  languageDetails: 'Gascon',
  abilities: { str: -1, dex: 0, con: -2, int: 0, wis: 1, cha: 1 },
  skills: { diplomacy: 4, religion: 3 },
  ac: 11,
  saves: { fort: 1, ref: 2, will: 4 },
  hp: 5,
  hpDetails: 'plague-stricken (La Peste Noire, stage 3)',
  speed: 15,
  speedDetails: 'buboes in the groin',
  blurb: 'Plague-stricken lure',
  items: [
    strike({
      name: 'Clutching Hand',
      bonus: 3,
      damage: '1d4 bludgeoning',
      traits: ['agile', 'nonlethal', 'unarmed'],
      effects: ['pestilent-touch'],
      description: '<p>Mahaut carries no weapon. She grabs at hands and sleeves, begging.</p>',
    }),
    ability({
      name: 'Buboes Beneath the Rags',
      category: 'interaction',
      description: `<p>Mahaut's face and throat are wrapped in filthy linen. A creature within 30 feet that succeeds at a @Check[perception|dc:12] check notices the black swellings at her neck and the sweet-rotten smell of the sickroom. A @Check[medicine|dc:10] check names it: ${peste}.</p>`,
    }),
    ability({
      name: 'Pestilent Touch',
      category: 'offensive',
      slug: 'pestilent-touch',
      traits: ['disease'],
      description: `<p>A creature that touches Mahaut bare-handed (an unarmed Strike, a Grapple or Shove, dragging her, or tending her without gloves) or that is hit by her Clutching Hand must attempt a @Check[fortitude|dc:20] save. On a failure, it is exposed to ${peste}.</p>`,
    }),
    ability({
      name: 'Wasted by Plague',
      category: 'defensive',
      description: `<p>Mahaut is dying. She can't take reactions, and she loses 1 action each turn to coughing. She never attacks first; she reaches for anyone who comes close and begs for bread for her children.</p>`,
    }),
  ],
  notes: `
<p>Mahaut is twenty-two years old and has perhaps three days to live. The buboes rose under her arms four days ago; she has told no one in Quinsac but her husband Perrin, and she wraps her face in rags so the others will not see the swelling at her throat. She volunteered to be the lure: she sits at the foot of the wayside cross and calls to travellers for help, because she is the only one of them who has nothing left to lose. Her two small children are waiting in Quinsac with an old neighbour, and every word she says is for them.</p>
<p><strong>The trap within the trap.</strong> Compassionate players will want to help her, and helping her bare-handed may give them the plague. This is the first time the party meets ${peste}; let them notice the signs (DC 12 Perception) and choose. Gloves, a cloth over the face, or treating her at a distance are all ways to show mercy safely.</p>
<p><strong>Mercy.</strong> Mahaut asks for a priest, not a physician. Last rites (a DC 15 Religion check, or any cleric or champion) bring her peace; she will ask the party to carry bread to her children in Quinsac.</p>`,
});

export default [...bertrand, ...guillot, ...perrin, ...mahaut];
