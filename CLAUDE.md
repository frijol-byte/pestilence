# Pestilence — Foundry VTT PF2e Adventure Module

A Pathfinder Second Edition adventure module for Foundry VTT: a mythologized, plague-era France
where demons and devils feed on a dying kingdom.

- **Foundry:** v14 (build 365) · **PF2e system:** 8.5.1
- **Module id:** `pestilence` · **Repo:** https://github.com/frijol-byte/pestilence (public)
- The game runs on a friend's server; the module is installed by **manifest URL** only.

---

## 1. How to work with me (the user)

### Ask until the intent is clear
Before building anything non-trivial, ask questions until my intent is unambiguous. Do not guess
at creative direction. In particular, confirm before you start:

- **Who/what** the piece centres on (which demon/devil, which NPC, which location).
- **Party level** and where it sits in the adventure's progression.
- **Scope**: which documents will be created (scene, journal, actors, items), and roughly how many.
- **Tone or symbolism** I want emphasised, if it isn't already established in `history/` or the lore docs.

Ask in batches (use the question tool with concrete options where possible) rather than one
question per turn. Once intent is clear, state a short plan and proceed. Small, unambiguous
requests (fix a typo, tweak a number, re-render a map) need no questioning.

### Log changes in `history/`
Every **substantive content change** gets a timestamped Markdown file in `history/`.

- **Filename:** `history/YYYY-MM-DD-HHMM-short-slug.md` (local time, 24h), e.g.
  `history/2026-09-26-1014-crypte-saint-roch.md`.
- **Track:** character additions (NPCs, creatures), journal entries, item creation, scene creation,
  and substantial rewrites of any of those.
- **Do not track:** spelling/wording fixes, single-number changes (e.g. adjusting a creature's
  AC or a DC after it exists), re-renders that don't change content, tooling/refactors.
- **Contents:** what was added, where it lives (file paths / compendium), key design decisions
  (weaknesses, secrets, symbolism), and open questions or TODOs. Keep it short and skimmable.
- One file per working session/feature is fine; don't create a file per tiny edit.

Template:

```markdown
# <Title>
**Date:** YYYY-MM-DD HH:MM · **Version:** x.y.z

## Added
- Scene: ... (`src/maps/<id>.mjs`, compendium `pestilence-scenes`)
- Actor: ... (level N, `pestilence-actors`)

## Design notes
- ...

## Open questions / TODO
- ...
```

---

## 2. Setting & tone

### Setting
A **mythologized plague-era France** (evoking the Black Death, c. 1348, and after): parish crypts,
charnel houses, flagellant processions, lepers' hospices, dead-carts, walled abbeys, burning
villages, plague doctors, pilgrim roads, and a Church that has lost its answers. The plague is
not only disease — it is a door the infernal has walked through.

### Lore sources: real-world first, Pathfinder as engine
**PF2e is the rules engine, not the lore.** Draw lore from real-world biblical, apocryphal and
esoteric tradition; fall back on Pathfinder/Golarion lore only where it fills a gap and doesn't
contradict the real-world material. Don't use Golarion places, gods or history.

Preferred sources for fiends, angels, saints and symbolism:
- **Scripture & apocrypha:** Revelation, Daniel, Ezekiel, Job, Isaiah, the Book of Enoch
  (Watchers, Nephilim), Tobit (Asmodeus, Raphael).
- **Demonology:** Collin de Plancy's *Dictionnaire Infernal* (French, a natural fit), the
  *Ars Goetia* / *Lesser Key of Solomon*, Weyer's *Pseudomonarchia Daemonum*,
  *Grimorium Verum*, Binsfeld's classification of demons by sin (Lucifer: pride, Mammon: greed,
  Asmodeus: lust, Leviathan: envy, Beelzebub: gluttony, Satan: wrath, Belphegor: sloth).
- **Esoteric & medieval:** Kabbalah (Qliphoth), the Pseudo-Dionysian angelic hierarchy,
  hagiography (plague saints: Roch, Sebastian), the *Danse Macabre*, *Ars moriendi*,
  medieval bestiaries, alchemical symbolism.

"Demon" and "devil" are used in their **real-world sense** (largely interchangeable, and a
fallen angel's rank matters more than its family), not in Pathfinder's Abyss-vs-Hell split.

**Mapping to PF2e mechanics:** use whatever PF2e traits give the right mechanics
(`fiend`, `unholy`, `demon`/`devil` for their weaknesses and interactions with holy effects,
spells and items) and pick the trait for what it does in play, not for its Golarion lore.
Record notable mappings in the creature's Notes.

Do not copy Paizo adventure text; reference Paizo compendium content by UUID only (ORC licensing).

### Names
Names must feel **French and medieval**:

- **People:** Old/Middle French given names and bynames — *Aymeric, Guillemette, Perrin,
  Jehanne, Thibaut, Ysabeau, Enguerrand, Mahaut*; bynames by trade, place or trait —
  *le Tonnelier, de Beaune, la Borgne, Fossoyeur*.
- **Places:** saints and geography — *Saint-Roch-des-Cendres, Val-Maudit, l'Hôtel-Dieu de
  Sainte-Agathe, la Fosse aux Pauvres*.
- **Latin** for liturgy, inscriptions and the demonic inverted liturgy (*Dies Irae*,
  *Memento mori*, *Libera nos*).
- Keep diacritics correct (é, è, ô, ç). Avoid modern-sounding or obviously non-French names
  unless a character is deliberately foreign.

### Tone
**Apocalyptic and biblical.** Write as if the end times have begun:

- Scriptural cadence in read-aloud text: parallelism, "and" chains, prophecy and judgment.
- Heavy **symbolism** in every location: the four horsemen, the seven sins, inverted sacraments,
  defaced saints, bells that toll for no one, lamb/wolf, ash and lime, rot and seed.
- Grief and dread over gore. Horror comes from meaning, not just description of wounds.
- Hope is scarce and costly, but it exists — saints' relics, acts of mercy, true faith — and it
  should matter mechanically when it appears.

---

## 3. Building scenes (adventure locations)

A "scene" here means an adventure location or story beat: any mix of map + Foundry Scene +
journal + actors + items.

### Scene types
- **`full_scene`** — only scenes the **user explicitly designates** as `full_scene`. These are
  the major set-piece locations and must follow the full structure below.
- **Smaller scenes** (everything else) — connective tissue around the full scenes: story beats,
  travel, roleplay, single encounters, atmosphere. No required structure; build what the user
  describes. Never assume a scene is a `full_scene`; ask if unclear.

**Sandbox:** *La Crypte de Saint-Roch* (`crypte-saint-roch`) is the user's **test sandbox**.
Don't expand it into a scene unless asked.

### Structure: every `full_scene` must include
- **One named Demon or Devil** that the whole location is centred on. The map, symbolism,
  minor enemies, puzzles and secrets should all point back to it (its sin, its domain, its
  bargain).
- **2–3 fights against minor enemies** (thralls, cultists, lesser fiends, plague-touched dead).
- **2–3 puzzles** — grounded in the setting (liturgy, relics, bells, inscriptions, reliquary
  locks, sins/virtues), solvable by player thinking, not only by a skill check.
- **1–2 secrets** that players must work hard for or think outside the box to find (hidden
  passages, a truth behind the demon's pact, a weakness revealed through lore). Reward
  curiosity; never gate the main path behind a secret.
- **One set-piece fight** against the demon/devil, in a space designed for it (terrain, hazards,
  and a way for its weaknesses to be exploited).

Budget encounters with PF2e XP (GM Core): minor fights typically Low–Moderate, set piece
Severe (Extreme only if the players have had a way to learn/exploit the weakness).

### The Sin tracker (party-wide)
The party has a **Sinful ↔ Sinless** score, kept in the user's own tool (don't build one).
It will later grant bonuses/penalties.

- **+1 (Sinless):** resolving a situation **without violence** (mercy, charity, persuasion,
  sacrifice, clever avoidance).
- **−1 (Sinful):** committing **unnecessary violence** (killing the surrendered, the harmless,
  the desperate; violence where a peaceful path was clearly open).
- **Design implication:** encounters with non-demonic foes (desperate peasants, bandits,
  penitents, the sick) should usually offer at least one **peaceful resolution**, with
  morale/surrender thresholds on the enemies.
- **In journals:** add a GM-only **Sin tracker** callout wherever a scene offers a ±1, stating
  the exact trigger (e.g. "+1 if the bandits are fed or allowed to flee; −1 if a surrendered
  bandit is killed").

### Journal entries
- Every scene gets a journal with **rich, evocative read-aloud text** for each area, written
  in the apocalyptic/biblical voice. Read-aloud should appeal to multiple senses (sound, smell,
  cold, light) and plant the location's symbolism.
- Keep read-aloud clearly separated from GM text (a consistent boxed/blockquote style).
- GM sections: what's here, creatures (linked with `@UUID[...]`), checks as PF2e inline rolls
  (`@Check[type:religion|dc:22]`, `@Damage[...]`), puzzle solutions, secrets and how to find
  them, and treasure.
- Link map notes to journal pages so the GM can click a room on the map.

---

## 4. Making enemies

### Named / major enemies
Every named or major enemy must have:

1. **A big mechanical weakness** that clever play can exploit. Build it into the stat block, not
   just the flavour. Example: a demon of sloth gets a very low Reflex save, a slow Speed, and
   short-range or touch-range abilities, so a fast-moving party that keeps its distance can beat
   it.
2. **A big lore/roleplay weakness** that can be discovered and used — a name, a vow, a
   relic, a person it cannot harm, a sin it cannot resist indulging, a bargain that binds it.
   Seed clues to this weakness in the scene's puzzles/secrets.

### Custom enemies (all of them)
- The actor's **Notes** must contain **at least one full paragraph** of information: origin,
  motives, behaviour/tactics, and how it ties to the scene's demon/devil. For major enemies,
  also note the lore weakness and how players can learn it.
- Build stats from the GM Core creature-building tables for the creature's level; note any
  deliberate deviations (e.g. the weakness) in the Notes.
- Use real PF2e traits, rule elements and compendium references; test rule elements in Foundry
  when possible.

---

## 5. Building maps

### Hallway widths
| Kind | Width | Squares |
|---|---|---|
| Claustrophobic hallway | 5 ft | 1 |
| Small / tight hallway | 10 ft | 2 |
| Normal hallway | 15 ft | 3 |

Choose the width deliberately for the encounter: claustrophobic corridors force single file
and funnel fights; normal hallways allow flanking and fighting retreats.

### Map pipeline (how maps are made here)
Maps are **generated from data**, so the image and the Foundry walls always align.

- Map definition: `src/maps/<id>.mjs` — rooms (`carve`), `pillars`, `doors`, `stairs`,
  `lights`, painted `features`, 3D `props`. Units are grid cells; **1 cell = 5 ft = 100 px**.
- `src/lib/grid.mjs` — builds the floor grid, traces walls along floor/solid edges, validates
  (doors must sit between two floor cells, lights on floor, nothing touching the border).
- `src/render/` — Three.js renderer (top-down orthographic): `paint.mjs` (2D procedural
  textures and symbolic floor features), `props.mjs` (3D props), `render.mjs` (scene, lighting,
  save, debug overlay).
- Outdoor maps (`kind: 'outdoor'`) are horizontal terrain `bands` (river, meadow, road, wheat)
  with exact row ranges, a `sun` direction, painted `features` and props; they have no walls.
  Painted in `src/render/paint-outdoor.mjs`.
- `tools/build-packs.mjs` — writes Scenes (with walls, doors, lights) into the LevelDB compendium.
- `tools/package.py` — zips the module into `release/pestilence.zip`.

Workflow:
1. `npm run serve`, open the renderer (the `map-renderer` launch config), `?map=<id>` selects a map.
2. Check the **Show Foundry walls & lights** overlay; `window.__debugExport()` writes PNGs to
   `debug/` for inspection (full image + walls overlay; pass `[x, y, w, h]` for a full-res crop).
3. **Save to module** (or open with `?save`) → `module/pestilence/assets/maps/<id>.webp` + thumb.
4. `npm run release` → builds packs and the release zip.

Rules:
- Always **re-render after changing a map definition** before building packs, or the image and
  walls will disagree.
- Doors are wall edges between two floor cells; secret doors are `type: 'secret'`.
- Lights are both baked softly into the image and emitted as animated Foundry lights; keep
  magical lights mostly to Foundry (baked at reduced strength).
- Every map should carry the scene's symbolism in its floor features and props.

### Content pipeline (journals, actors, items)
Content is authored as JS modules and compiled by `npm run build` into four compendiums:
`pestilence-journals`, `pestilence-scenes`, `pestilence-actors`, `pestilence-items`.

- `src/content/journals/*.mjs`, `src/content/actors/*.mjs`, `src/content/items/*.mjs` — each
  default-exports an **array of pack entries** built with the helpers in `src/lib/pf2e.mjs`:
  `npc()` + `strike()` / `ability()` / `lore()`, `affliction()`, `equipment()`, `journal()`,
  and the journal snippets `readAloud()`, `sinTracker()`, `epigraph()`.
- `src/lib/ids.mjs` — deterministic ids and `uuid.actor/item/journal/page/scene(slug)` for
  cross-links; `PF2E.*` holds verified UUIDs into the PF2e system compendiums (conditions,
  equipment, NPC Core). Add new PF2e UUIDs there after verifying them against the pf2e repo.
- The build **fails on any broken `@UUID` link** into this module.
- Journal styling lives in `module/pestilence/styles/pestilence.css`.
- PF2e reference: the `foundryvtt/pf2e` repo's default branch (`v14-dev`) is system 8.5.1;
  check document shapes against `packs/pf2e/...` there before inventing fields.

---

## 6. Foundry v14 technical notes (hard-won — don't regress)

- **Scene backgrounds live on an embedded Level** (`!scenes.levels!<sceneId>.<levelId>`), not a
  top-level `background`. Never emit top-level `background`, `globalLight` or `darkness`.
- **Stamp `_stats.coreVersion`** on Scene records (currently `14.365`), or v14's migration
  rebuilds `levels` and the scene imports blank.
- Embedded documents (walls, lights, levels, and later journal pages, table results) are
  **separate LevelDB entries**; the parent stores only their ids.
- Walls/lights carry `levels: [levelId]`.
- Darkness/global light go in `environment` (`darknessLevel`, `globalLight.enabled`).
- Document ids are deterministic (`fid(slug)` in `build-packs.mjs`) so rebuilds don't orphan
  world copies — keep slugs stable.
- Pack files are binary (`.gitattributes`); never let git convert their line endings.
- PF2e Actors/Items must carry `_stats` (coreVersion/systemId/systemVersion) and
  `system._migration.version` (currently `0.959`) or PF2e migrates them on import; the
  builders in `src/lib/pf2e.mjs` do this.

---

## 7. Releasing an update

1. Bump `version` in `module/pestilence/module.json` (semver; content additions = minor).
2. `npm run release`.
3. Add the `history/` entry if the change is trackable.
4. Commit. The user pushes with GitHub Desktop (**Push origin**).
5. In Foundry, the module shows **Update**. raw.githubusercontent caches up to ~5 minutes.

Manifest URL (for reference):
`https://raw.githubusercontent.com/frijol-byte/pestilence/main/module/pestilence/module.json`

Never push or make the repo/content public-facing in new ways without asking; the user publishes.

---

## 8. Project layout

```
CLAUDE.md
history/                  change log (timestamped .md)
src/maps/                 map definitions (one .mjs per map)
src/lib/grid.mjs          shared geometry (walls, validation)
src/render/               Three.js map renderer
tools/serve.mjs           dev server (renderer + save endpoint)
tools/build-packs.mjs     compendium builder (LevelDB)
tools/package.py          release zip
module/pestilence/        the actual Foundry module (module.json, assets/, packs/)
release/pestilence.zip    download target referenced by the manifest
debug/                    render inspection output (git-ignored)
```
