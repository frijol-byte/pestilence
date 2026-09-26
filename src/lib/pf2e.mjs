// Builders for PF2e 8.5.1 documents. Content files describe creatures/items/journals in a
// compact form; these functions expand them into full Foundry source data.
//
// Every Actor/Item is stamped with `_stats` and `system._migration` exactly like the PF2e
// system's own pack builder, so neither Foundry nor PF2e runs migrations over our data.
import { fid } from './ids.mjs';

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
      perception: { mod: c.perception, details: c.perceptionDetails ?? '', senses: [] },
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
 * PF2e affliction item (tracked disease/poison). stages: [{ conditions: [[slug, value]], damage: [[formula, type]],
 * duration: [n, 'days'] }]
 */
export function affliction(a) {
  const id = fid(`item:${a.slug}`);
  const item = {
    _id: id,
    name: a.name,
    type: 'affliction',
    img: a.img,
    system: {
      description: { value: html(a.description), gm: html(a.gmDescription) },
      level: { value: a.level },
      traits: { value: a.traits, otherTags: [] },
      save: { type: a.save.type, value: a.save.dc },
      status: { onset: !!a.onset, stage: 1, progress: 0 },
      onset: a.onset ? { value: a.onset[0], unit: a.onset[1] } : null,
      stages: a.stages.map((s) => ({
        damage: (s.damage ?? []).map(([formula, damageType]) => ({ formula, damageType, category: null })),
        conditions: (s.conditions ?? []).map(([slug, value = null]) => ({ slug, value, linked: true })),
        effects: [],
        duration: { value: s.duration?.[0] ?? 1, unit: s.duration?.[1] ?? 'days' },
      })),
      duration: { value: -1, unit: 'unlimited', expiry: null },
      start: { value: 0, initiative: null },
      fromSpell: false,
      context: null,
      rules: [],
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
