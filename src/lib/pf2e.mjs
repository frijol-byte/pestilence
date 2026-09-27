// Builders for PF2e 8.5.1 documents. Content files describe creatures/items/journals in a
// compact form; these functions expand them into full Foundry source data.
//
// Every Actor/Item is stamped with `_stats` and `system._migration` exactly like the PF2e
// system's own pack builder, so neither Foundry nor PF2e runs migrations over our data.
import { fid, PF2E } from './ids.mjs';

const PF2E_CONDITIONS = PF2E.condition;

export const CORE_VERSION = '14.365';
export const SYSTEM_VERSION = '8.5.1';
export const PF2E_SCHEMA_VERSION = 0.959;

const stats = () => ({ coreVersion: CORE_VERSION, systemId: 'pf2e', systemVersion: SYSTEM_VERSION });
const migration = () => ({ version: PF2E_SCHEMA_VERSION, previous: null });
const publication = () => ({ license: 'ORC', remaster: true, title: 'Pestilence' });
const html = (s) => (s ?? '').trim();

/* ------------------------------------------------------------------ */
/*  NPC embedded items                                                */
/* ------------------------------------------------------------------ */

/** NPC strike ("melee" item). damage: "1d12+6 slashing" or [["1d12+6","slashing"], ...] */
export function strike({ name, bonus, damage, traits = [], effects = [], description = '', ranged = null }) {
  const rolls = (Array.isArray(damage) ? damage : [damage.split(' ')]).map(([d, t]) => ({ damage: d, damageType: t }));
  return {
    type: 'melee',
    name,
    img: ranged ? 'systems/pf2e/icons/default-icons/ranged.svg' : 'systems/pf2e/icons/default-icons/melee.svg',
    system: {
      attackEffects: { value: effects },
      bonus: { value: bonus },
      damageRolls: Object.fromEntries(rolls.map((r, i) => [String(i), r])),
      description: { value: html(description), gm: '' },
      range: ranged,
      rules: [],
      slug: null,
      traits: { value: traits, otherTags: [] },
    },
  };
}

const ACTION_ICONS = {
  passive: 'systems/pf2e/icons/actions/Passive.webp',
  reaction: 'systems/pf2e/icons/actions/Reaction.webp',
  free: 'systems/pf2e/icons/actions/FreeAction.webp',
  1: 'systems/pf2e/icons/actions/OneAction.webp',
  2: 'systems/pf2e/icons/actions/TwoActions.webp',
  3: 'systems/pf2e/icons/actions/ThreeActions.webp',
};

/** NPC ability. actions: 'passive' | 'reaction' | 'free' | 1 | 2 | 3 */
export function ability({ name, actions = 'passive', category = 'offensive', traits = [], description, rules = [], slug = null }) {
  const actionType = typeof actions === 'number' ? 'action' : actions;
  return {
    type: 'action',
    name,
    img: ACTION_ICONS[actions],
    system: {
      actionType: { value: actionType },
      actions: { value: typeof actions === 'number' ? actions : null },
      category,
      description: { value: html(description), gm: '' },
      rules,
      slug,
      traits: { value: traits, otherTags: [] },
    },
  };
}

export function lore(name, mod) {
  return {
    type: 'lore',
    name,
    img: 'systems/pf2e/icons/default-icons/lore.svg',
    system: { description: { value: '', gm: '' }, mod: { value: mod }, proficient: { value: 0 }, rules: [], slug: null, traits: {} },
  };
}

/* ------------------------------------------------------------------ */
/*  Documents                                                         */
/* ------------------------------------------------------------------ */

/**
 * PF2e NPC actor. `notes` goes in the sheet's Notes (publicNotes) and must be at least a
 * paragraph (see CLAUDE.md). `gmNotes` is private.
 */
export function npc(c) {
  const actorId = fid(`actor:${c.slug}`);
  const items = c.items.map((it, i) => ({
    _id: fid(`actor-item:${c.slug}:${i}:${it.name}`),
    sort: (i + 1) * 100000,
    flags: {},
    effects: [],
    ...it,
    system: { ...it.system, publication: publication(), _migration: migration() },
    _stats: { ...stats(), compendiumSource: null },
  }));
  const skills = Object.fromEntries(Object.entries(c.skills ?? {}).map(([k, v]) => [k, { base: v }]));
  const actor = {
    _id: actorId,
    name: c.name,
    type: 'npc',
    img: c.img ?? 'systems/pf2e/icons/default-icons/npc.svg',
    prototypeToken: {
      name: c.tokenName ?? c.name,
      displayName: 20, // hover by owner
      actorLink: false,
      disposition: -1,
      texture: { src: c.img ?? 'systems/pf2e/icons/default-icons/npc.svg' },
      width: 1,
      height: 1,
      flags: {},
    },
    system: {
      abilities: Object.fromEntries(Object.entries(c.abilities).map(([k, v]) => [k, { mod: v }])),
      attributes: {
        ac: { value: c.ac, details: c.acDetails ?? '' },
        allSaves: { value: c.allSaves ?? '' },
        hp: { value: c.hp, max: c.hp, temp: 0, details: c.hpDetails ?? '' },
        speed: { value: c.speed, otherSpeeds: [], details: c.speedDetails ?? '' },
        immunities: [],
        weaknesses: c.weaknesses ?? [],
        resistances: c.resistances ?? [],
      },
      details: {
        blurb: c.blurb ?? '',
        languages: { value: c.languages ?? ['common'], details: c.languageDetails ?? '' },
        level: { value: c.level },
        publicNotes: html(c.notes),
        privateNotes: html(c.gmNotes),
        publication: publication(),
      },
      initiative: { statistic: 'perception' },
      perception: { mod: c.perception, details: c.perceptionDetails ?? '', senses: (c.senses ?? []).map((type) => ({ type })) },
      resources: {},
      saves: {
        fortitude: { value: c.saves.fort, saveDetail: '' },
        reflex: { value: c.saves.ref, saveDetail: '' },
        will: { value: c.saves.will, saveDetail: '' },
      },
      skills,
      traits: { rarity: c.rarity ?? 'unique', size: { value: c.size ?? 'med' }, value: c.traits ?? ['human', 'humanoid'] },
      _migration: migration(),
    },
    items: items.map((i) => i._id),
    effects: [],
    folder: null,
    sort: 0,
    ownership: { default: 0 },
    flags: {},
    _stats: { ...stats(), compendiumSource: null },
  };
  return [
    [`!actors!${actorId}`, actor],
    ...items.map((i) => [`!actors.items!${actorId}.${i._id}`, i]),
  ];
}

/**
 * Staged affliction as a PF2e **effect** with a counter badge (the PF2e "affliction" item type
 * is disabled in release builds of the system, so never use it).
 *
 * Badge value 1 is the onset; value n+1 is stage n. Each stage's conditions are granted in
 * memory while the badge sits on that stage, so clicking the badge up/down on the effects panel
 * moves the creature through the disease.
 *
 * stages: [{ label, conditions: [[slug, value?]] }]
 */
export function stagedEffect(a) {
  const id = fid(`item:${a.slug}`);
  const conditionUuid = (slug) => {
    const u = PF2E_CONDITIONS[slug];
    if (!u) throw new Error(`${a.slug}: unknown condition "${slug}" (add it to PF2E.condition in ids.mjs)`);
    return u;
  };

  // One GrantItem per (condition, value) run of consecutive badge values.
  const rules = [];
  const badgeOf = (stageIndex) => stageIndex + 2; // stage 1 -> badge 2
  const runs = new Map();
  a.stages.forEach((st, i) => {
    for (const [slug, value = null] of st.conditions ?? []) {
      const k = `${slug}|${value}`;
      const run = runs.get(k)?.at(-1);
      if (run && run.to === badgeOf(i) - 1) run.to = badgeOf(i);
      else runs.set(k, [...(runs.get(k) ?? []), { slug, value, from: badgeOf(i), to: badgeOf(i) }]);
    }
  });
  for (const list of runs.values()) {
    for (const { slug, value, from, to } of list) {
      const predicate =
        from === to
          ? [`parent:badge:value:${from}`]
          : [{ gte: ['parent:badge:value', from] }, { lte: ['parent:badge:value', to] }];
      rules.push({
        key: 'GrantItem',
        uuid: conditionUuid(slug),
        inMemoryOnly: true,
        predicate,
        ...(value !== null ? { alterations: [{ mode: 'override', property: 'badge-value', value }] } : {}),
      });
    }
  }

  const item = {
    _id: id,
    name: a.name,
    type: 'effect',
    img: a.img,
    system: {
      badge: {
        type: 'counter',
        value: 1,
        min: 1,
        max: a.stages.length + 1,
        labels: [a.onsetLabel ?? 'Onset', ...a.stages.map((st, i) => st.label ?? `Stage ${i + 1}`)],
      },
      description: { value: html(a.description), gm: html(a.gmDescription) },
      duration: { value: -1, unit: 'unlimited', expiry: null, sustained: false },
      level: { value: a.level },
      rules,
      start: { value: 0, initiative: null },
      tokenIcon: { show: true },
      traits: { value: a.traits ?? [], otherTags: [] },
      slug: a.slug,
      publication: publication(),
      _migration: migration(),
    },
    effects: [],
    folder: null,
    sort: 0,
    ownership: { default: 0 },
    flags: {},
    _stats: { ...stats(), compendiumSource: null },
  };
  return [[`!items!${id}`, item]];
}

/** Plain PF2e effect (no stages). rules: PF2e rule elements. */
export function effect(e) {
  const id = fid(`item:${e.slug}`);
  const item = {
    _id: id,
    name: e.name,
    type: 'effect',
    img: e.img,
    system: {
      badge: null,
      description: { value: html(e.description), gm: html(e.gmDescription) },
      duration: { value: -1, unit: 'unlimited', expiry: null, sustained: false },
      level: { value: e.level ?? 1 },
      rules: e.rules ?? [],
      start: { value: 0, initiative: null },
      tokenIcon: { show: true },
      traits: { value: e.traits ?? [], otherTags: [] },
      slug: e.slug,
      publication: publication(),
      _migration: migration(),
    },
    effects: [],
    folder: null,
    sort: 0,
    ownership: { default: 0 },
    flags: {},
    _stats: { ...stats(), compendiumSource: null },
  };
  return [[`!items!${id}`, item]];
}

/** PF2e ritual (a `spell` item with ritual data). */
export function ritual(r) {
  const id = fid(`item:${r.slug}`);
  const item = {
    _id: id,
    name: r.name,
    type: 'spell',
    img: r.img,
    system: {
      area: r.area ?? null,
      cost: { value: r.cost ?? '' },
      counteraction: false,
      damage: {},
      defense: null,
      description: { value: html(r.description), gm: html(r.gmDescription) },
      duration: { value: r.duration ?? '', sustained: false },
      level: { value: r.rank },
      range: { value: r.range ?? '' },
      requirements: r.requirements ?? '',
      ritual: {
        primary: { check: r.primary },
        secondary: { casters: r.secondaryCasters ?? 0, checks: r.secondary ?? '' },
      },
      rules: [],
      target: { value: r.target ?? '' },
      time: { value: r.time },
      traits: { rarity: r.rarity ?? 'unique', traditions: [], value: r.traits ?? [], otherTags: [] },
      slug: r.slug,
      publication: publication(),
      _migration: migration(),
    },
    effects: [],
    folder: null,
    sort: 0,
    ownership: { default: 0 },
    flags: {},
    _stats: { ...stats(), compendiumSource: null },
  };
  return [[`!items!${id}`, item]];
}

/** Simple non-magical equipment item (quest items, keepsakes). */
export function equipment(e) {
  const id = fid(`item:${e.slug}`);
  const item = {
    _id: id,
    name: e.name,
    type: 'equipment',
    img: e.img ?? 'systems/pf2e/icons/default-icons/equipment.svg',
    system: {
      baseItem: null,
      bulk: { value: e.bulk ?? 0 },
      containerId: null,
      description: { value: html(e.description), gm: html(e.gmDescription) },
      hardness: 0,
      hp: { max: 0, value: 0 },
      level: { value: e.level ?? 0 },
      material: { grade: null, type: null },
      price: { value: e.price ?? {} },
      quantity: e.quantity ?? 1,
      rules: e.rules ?? [],
      size: 'med',
      slug: e.slug,
      traits: { rarity: e.rarity ?? 'unique', value: e.traits ?? [], otherTags: [] },
      usage: { value: e.usage ?? 'held-in-one-hand' },
      equipped: { carryType: 'worn' },
      publication: publication(),
      _migration: migration(),
    },
    effects: [],
    folder: null,
    sort: 0,
    ownership: { default: 0 },
    flags: {},
    _stats: { ...stats(), compendiumSource: null },
  };
  return [[`!items!${id}`, item]];
}

/** Journal entry with text pages. pages: [{ slug, name, content (html), level? }] */
export function journal(j) {
  const id = fid(`journal:${j.slug}`);
  const pages = j.pages.map((p, i) => ({
    _id: fid(`page:${j.slug}:${p.slug}`),
    name: p.name,
    type: 'text',
    title: { show: true, level: p.level ?? 1 },
    text: { format: 1, content: html(p.content) },
    sort: (i + 1) * 100000,
    ownership: { default: -1 },
    category: null,
    image: {},
    src: null,
    system: {},
    video: { controls: true, volume: 0.5 },
    flags: {},
    _stats: stats(),
  }));
  const entry = {
    _id: id,
    name: j.name,
    pages: pages.map((p) => p._id),
    categories: [],
    folder: null,
    sort: j.sort ?? 0,
    ownership: { default: 0 },
    flags: {},
    _stats: stats(),
  };
  return [[`!journal!${id}`, entry], ...pages.map((p) => [`!journal.pages!${id}.${p._id}`, p])];
}

/* ------------------------------------------------------------------ */
/*  Journal HTML snippets                                             */
/* ------------------------------------------------------------------ */

/** Read-aloud box (styled by styles/pestilence.css). */
export const readAloud = (...paras) =>
  `<section class="pestilence-readaloud">${paras.map((p) => `<p>${p}</p>`).join('')}</section>`;

/** GM-only callout for the Sin tracker. */
export const sinTracker = (...lines) =>
  `<section class="pestilence-sin"><p><strong>Sin tracker</strong></p><ul>${lines.map((l) => `<li>${l}</li>`).join('')}</ul></section>`;

/** Scripture/epigraph line. */
export const epigraph = (text, source) =>
  `<blockquote class="pestilence-epigraph"><p>${text}</p><p class="source">— ${source}</p></blockquote>`;
