# Chapter I: Bordeaux and the Garonne road
**Date:** 2026-09-26 14:08 · **Version:** 0.2.0

Party: 4 PCs, level 2. Smaller scenes (not `full_scene`).

## Added
- **Journal:** *I. Bordeaux, l'An de la Grande Mortalité* (`src/content/journals/ch1-bordeaux.mjs`)
  - GM overview (August 1348; the port burned; Pope Clement VI at Avignon)
  - *La Cathédrale Saint-André*: Archbishop **Amanieu de Lormont** charges the party to carry his
    letter to Avignon; gives the letter, 40 gp, 2 holy water; his dream of the pale rider
  - *La Procession des Pénitents*: led by **Frère Anselme** (Franciscan); palm fronds, not yet
    scourges; the girl **Jehannette**; a palm frond given "for when it's your turn" (foreshadowing)
  - *La Ville Silencieuse*: vignettes (Grosse Cloche stopped at the ninth hour, empty market,
    burned port, red crosses, Hôtel-Dieu) + escalation if players linger; exit by the Porte Saint-Julien
- **Journal:** *II. La Route de la Garonne* (`src/content/journals/ch1-route.mjs`): departure,
  the ambush *Les Affamés*, aftermath
- **Scene:** *La Route de la Garonne* (`src/maps/route-de-la-garonne.mjs`), 40×26 outdoor:
  river north, 20 ft meadow, 20 ft road, 20 ft verge, endless unharvested wheat south.
  Wayside cross, overturned cart barricade, willows, boat, scarecrow, dropped scythe, crows,
  trampled trails in the wheat that betray the hidden peasants.
- **Actors** (`src/content/actors/les-affames.mjs`), 105 XP total:
  - **Sire Bertrand de Quinsac** (L3): knight of Crécy, lord of a dead village.
    *Mechanical weakness:* Reflex +4, Speed 15, can't Stride twice or Step (The Crécy Wound).
    *Lore weakness:* The Oath of Quinsac (reminded of his vows + food → yields).
  - **Guillot** and **Perrin** (L-1): starving villeins with pitchforks (reach), flee at 4 HP or
    when fed; Perrin is Mahaut's husband and won't flee while she's on the field.
  - **Mahaut** (L-1): plague-stricken lure; buboes spotted on DC 12 Perception; Pestilent Touch
    (DC 20 Fortitude or exposed to La Peste Noire).
- **Items** (`src/content/items/`):
  - **La Peste Noire**: PF2e affliction (disease), level 3, Fortitude DC 20, onset 1 day, six stages
  - **Lettre de l'Archevêque**: letter + safe-conduct (+2 item bonus to Diplomacy with clergy, toggle)
  - **Chevalière de Quinsac**: Bertrand's signet ring (10 gp)

## Design notes
- Sin tracker: +1 if none of the people of Quinsac are killed; −1 for killing Mahaut or anyone
  who yielded/fled; −1 for violence against penitents or the sick in Bordeaux; +1 for costly
  charity in the city.
- Foreshadowing threads: the **rider on a pale horse** (Archbishop's dream, Quinsac ferryman),
  Frère Anselme's penitents (will return with scourges), the palm frond a PC carries.
- Real history used: plague reaches Bordeaux Aug 1348; port quarter burned; Gascony under the
  English crown; Crécy 1346; Pope Clement VI. Locals are invented.

## Open questions / TODO
- The Garonne and the wheat are described as difficult terrain in the journal, not yet as
  Foundry Regions.
- Tokens are not pre-placed on the road scene; the GM places them from the Actors compendium.
- Bertrand may return as an ally or penitent; Mahaut's children in Quinsac are an open hook.
