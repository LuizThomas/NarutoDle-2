import { Request, Response } from 'express';
import { allCharacters, searchCharacters, getCharacterById } from '../data/characters.js';
import { Character } from '../types/character.js';

export function handleSearchCharacters(req: Request, res: Response) {
  const query = (req.query.q as string) || '';
  const limit = Math.min(30, parseInt((req.query.limit as string) || '15', 10));
  const results = searchCharacters(query, limit);

  // Return sanitized public cards for search dropdown
  const cards = results.map(c => ({
    id: c.id,
    name: c.name,
    japaneseName: c.japaneseName,
    aliases: c.aliases,
    village: c.village,
    clan: c.clan,
    rank: c.rank,
    image: c.portrait,
    difficultyTier: c.difficultyTier
  }));

  return res.json({ success: true, count: cards.length, characters: cards });
}

export function handleGetAllCharacters(req: Request, res: Response) {
  const safeList = allCharacters.map(c => ({
    id: c.id,
    name: c.name,
    japaneseName: c.japaneseName,
    village: c.village,
    clan: c.clan,
    rank: c.rank,
    era: c.era,
    image: c.portrait,
    difficultyTier: c.difficultyTier,
    active: c.active
  }));
  return res.json({ success: true, count: safeList.length, characters: safeList });
}

export function handleGetCharacterById(req: Request, res: Response) {
  const { id } = req.params;
  const character = getCharacterById(id);
  if (!character) {
    return res.status(404).json({ success: false, error: 'Personagem não encontrado.' });
  }
  return res.json({ success: true, character });
}

export function handleAdminValidateCharacters(req: Request, res: Response) {
  const missingAttrs: { id: string; name: string; missingFields: string[] }[] = [];

  for (const c of allCharacters) {
    const missing: string[] = [];
    if (!c.name) missing.push('name');
    if (!c.village) missing.push('village');
    if (!c.clan) missing.push('clan');
    if (!c.rank) missing.push('rank');
    if (!c.chakraNature || c.chakraNature.length === 0) missing.push('chakraNature');
    if (!c.portrait) missing.push('portrait');
    if (!c.firstArc) missing.push('firstArc');

    if (missing.length > 0) {
      missingAttrs.push({ id: c.id, name: c.name, missingFields: missing });
    }
  }

  return res.json({
    success: true,
    totalCharacters: allCharacters.length,
    validCount: allCharacters.length - missingAttrs.length,
    issues: missingAttrs
  });
}

export function handleAdminAddOrUpdateCharacter(req: Request, res: Response) {
  const payload = req.body as Partial<Character>;
  if (!payload.name || !payload.id) {
    return res.status(400).json({ success: false, error: 'Campos "id" e "name" são obrigatórios.' });
  }

  const existingIndex = allCharacters.findIndex(c => c.id === payload.id);
  if (existingIndex >= 0) {
    allCharacters[existingIndex] = { ...allCharacters[existingIndex], ...payload } as Character;
    return res.json({ success: true, action: 'updated', character: allCharacters[existingIndex] });
  } else {
    const newChar = {
      ...payload,
      active: payload.active ?? true,
      popularityRank: payload.popularityRank || 999,
      difficultyTier: payload.difficultyTier || 'normal',
      chakraNature: payload.chakraNature || [],
      kekkeiGenkai: payload.kekkeiGenkai || [],
      abilities: payload.abilities || [],
      jutsu: payload.jutsu || [],
      transformations: payload.transformations || [],
      quotes: payload.quotes || [],
      tags: payload.tags || []
    } as Character;
    allCharacters.push(newChar);
    return res.json({ success: true, action: 'created', character: newChar });
  }
}
