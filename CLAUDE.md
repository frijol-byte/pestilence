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

This is Golarion-compatible PF2e mechanically, but the setting is our own. Do not copy Paizo
adventure text; reference Paizo compendium content by UUID only (ORC licensing).

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

A "scene" here means a full adventure location: map + Foundry Scene + journal + actors + items.

### Structure — every scene must include
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

Note on terminology: in Pathfinder lore, *Abaddon* is the plane of **daemons**, and demons and
devils are different fiend families (Abyss vs. Hell). Keep this straight when naming and
choosing traits, or deliberately re-myth it and record the choice in `history/`.

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
