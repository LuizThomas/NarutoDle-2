import { Character } from '../types/character.js';
import { charactersBatch1 } from './charactersBatch1.js';
import { charactersBatch2 } from './charactersBatch2.js';
import { charactersBatch3 } from './charactersBatch3.js';
import { charactersBatch4 } from './charactersBatch4.js';
import { charactersBatch5 } from './charactersBatch5.js';
import { charactersBatch6 } from './charactersBatch6.js';
import { charactersBatch7 } from './charactersBatch7.js';

export const allCharacters: Character[] = [
  ...charactersBatch1,
  ...charactersBatch2,
  ...charactersBatch3,
  ...charactersBatch4,
  ...charactersBatch5,
  ...charactersBatch6,
  ...charactersBatch7,
];

// Normalize strings for resilient and instant search matching
export function normalizeSearchString(text: string): string {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/[^a-z0-9]/g, '');
}

export function searchCharacters(query: string, limit = 15): Character[] {
  const cleanQ = normalizeSearchString(query);
  if (!cleanQ) return allCharacters.slice(0, limit);

  return allCharacters
    .filter(char => {
      if (!char.active) return false;
      const matchName = normalizeSearchString(char.name).includes(cleanQ);
      const matchJp = normalizeSearchString(char.japaneseName).includes(cleanQ);
      const matchClan = normalizeSearchString(char.clan).includes(cleanQ);
      const matchVillage = normalizeSearchString(char.village).includes(cleanQ);
      const matchAlias = char.aliases.some(a => normalizeSearchString(a).includes(cleanQ));
      const matchTag = char.tags.some(t => normalizeSearchString(t).includes(cleanQ));
      return matchName || matchJp || matchClan || matchVillage || matchAlias || matchTag;
    })
    .sort((a, b) => {
      // Prioritize exact match or prefix match
      const aStarts = normalizeSearchString(a.name).startsWith(cleanQ);
      const bStarts = normalizeSearchString(b.name).startsWith(cleanQ);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return a.popularityRank - b.popularityRank;
    })
    .slice(0, limit);
}

export function getCharacterById(id: string): Character | undefined {
  return allCharacters.find(c => c.id === id);
}
