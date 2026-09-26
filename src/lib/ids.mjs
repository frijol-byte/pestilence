// Deterministic Foundry ids + UUID helpers shared by content files and the pack builder.
// Keep slugs stable: changing one changes the id and orphans copies already in a world.
import crypto from 'node:crypto';

export const MODULE_ID = 'pestilence';

export const PACKS = {
  scenes: { name: 'pestilence-scenes', type: 'Scene' },
  journals: { name: 'pestilence-journals', type: 'JournalEntry' },
  actors: { name: 'pestilence-actors', type: 'Actor' },
  items: { name: 'pestilence-items', type: 'Item' },
};

const B62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

/** 16-character Foundry id derived from a slug. */
export function fid(slug) {
  const bytes = crypto.createHash('sha256').update(`${MODULE_ID}:${slug}`).digest();
  let out = '';
  for (let i = 0; i < 16; i++) out += B62[bytes[i] % 62];
  return out;
}

/** UUID of a document in one of this module's compendiums. */
export const uuid = {
  actor: (slug) => `Compendium.${MODULE_ID}.${PACKS.actors.name}.Actor.${fid(`actor:${slug}`)}`,
  item: (slug) => `Compendium.${MODULE_ID}.${PACKS.items.name}.Item.${fid(`item:${slug}`)}`,
  journal: (slug) => `Compendium.${MODULE_ID}.${PACKS.journals.name}.JournalEntry.${fid(`journal:${slug}`)}`,
  page: (journalSlug, pageSlug) =>
    `${uuid.journal(journalSlug)}.JournalEntryPage.${fid(`page:${journalSlug}:${pageSlug}`)}`,
  scene: (slug) => `Compendium.${MODULE_ID}.${PACKS.scenes.name}.Scene.${fid(`scene:${slug}`)}`,
};

/** UUIDs into the PF2e system compendiums (ids verified against pf2e 8.5.1). */
export const PF2E = {
  condition: {
    fatigued: 'Compendium.pf2e.conditionitems.Item.HL2l2VRSaQHu9lUw',
    enfeebled: 'Compendium.pf2e.conditionitems.Item.MIRkyAjyBeXivMa7',
    drained: 'Compendium.pf2e.conditionitems.Item.4D2KBtexWXa6oUMR',
    unconscious: 'Compendium.pf2e.conditionitems.Item.fBnFDH2MTzgFijKf',
    sickened: 'Compendium.pf2e.conditionitems.Item.fesd1n5eVhpCSS18',
    prone: 'Compendium.pf2e.conditionitems.Item.j91X7x0XSomq8d60',
    frightened: 'Compendium.pf2e.conditionitems.Item.TBSHQspnbcqxsmjL',
    grabbed: 'Compendium.pf2e.conditionitems.Item.kWc1fhmv9LBiTuei',
    offGuard: 'Compendium.pf2e.conditionitems.Item.AJh5ex99aV6VTggg',
  },
  equipment: {
    holyWater: 'Compendium.pf2e.equipment-srd.Item.z9T4c1hXwOotsMCp',
    rations: 'Compendium.pf2e.equipment-srd.Item.L9ZV076913otGtiB',
  },
  npc: {
    commoner: 'Compendium.pf2e.pathfinder-npc-core.Actor.APn9B54hhRtr0oCQ',
  },
};

/** Inline link helper: @UUID[...]{Label} */
export const link = (u, label) => `@UUID[${u}]{${label}}`;
