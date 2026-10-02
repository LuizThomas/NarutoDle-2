import { Request, Response } from 'express';
import { 
  createGameSession, 
  getSession, 
  makeGuess, 
  surrenderGame, 
  playerStats 
} from '../services/gameService.js';
import { GameMode, DifficultyTier } from '../types/character.js';

// Sanitize session so secret character ID is NEVER leaked
function sanitizeSessionForClient(session: any) {
  const { secretCharacterId, ...safe } = session;
  return safe;
}

export function handleCreateGame(req: Request, res: Response) {
  const mode = (req.body.mode || 'classic') as GameMode;
  const difficulty = (req.body.difficulty || 'normal') as DifficultyTier;
  const sessionKey = (req.body.sessionKey || req.ip || 'anon') as string;

  const validModes: GameMode[] = ['classic', 'jutsu', 'quote', 'eye', 'silhouette'];
  const validDifficulties: DifficultyTier[] = ['easy', 'normal', 'hard', 'expert'];

  const chosenMode = validModes.includes(mode) ? mode : 'classic';
  const chosenDifficulty = validDifficulties.includes(difficulty) ? difficulty : 'normal';

  const session = createGameSession(chosenMode, chosenDifficulty, sessionKey);
  return res.json({ success: true, game: sanitizeSessionForClient(session) });
}

export function handleGetGame(req: Request, res: Response) {
  const { id } = req.params;
  const session = getSession(id);
  if (!session) {
    return res.status(404).json({ success: false, error: 'Partida não encontrada.' });
  }
  return res.json({ success: true, game: sanitizeSessionForClient(session) });
}

export function handleMakeGuess(req: Request, res: Response) {
  const { id } = req.params;
  const { characterId } = req.body;

  if (!characterId) {
    return res.status(400).json({ success: false, error: 'ID do personagem é obrigatório.' });
  }

  const result = makeGuess(id, characterId);
  if (!result.success) {
    return res.status(400).json({ success: false, error: result.error });
  }

  return res.json({
    success: true,
    guess: result.result,
    game: sanitizeSessionForClient(result.session)
  });
}

export function handleSurrenderGame(req: Request, res: Response) {
  const { id } = req.params;
  const result = surrenderGame(id);
  if (!result.success) {
    return res.status(400).json({ success: false, error: result.error });
  }
  return res.json({
    success: true,
    game: sanitizeSessionForClient(result.session)
  });
}

export function handleGetStats(req: Request, res: Response) {
  const winRate = playerStats.gamesPlayed > 0 
    ? Math.round((playerStats.gamesWon / playerStats.gamesPlayed) * 100) 
    : 0;

  return res.json({
    success: true,
    stats: {
      ...playerStats,
      winRate
    }
  });
}

export function handleGetLeaderboard(req: Request, res: Response) {
  // Generates current high ranking shinobi ninja based on streaks
  const sampleShinobiRanks = [
    { rank: 1, ninjaName: 'Hokage_Das_Sombras', title: 'Ninja Lendário', streak: Math.max(14, playerStats.maxStreak), winRate: 94 },
    { rank: 2, ninjaName: 'Chidori_Master', title: 'Jonin Especial', streak: 12, winRate: 88 },
    { rank: 3, ninjaName: 'Uzumaki_Will', title: 'Jonin', streak: 9, winRate: 83 },
    { rank: 4, ninjaName: 'Dattebayo_Fan', title: 'Chunin', streak: 7, winRate: 78 },
    { rank: 5, ninjaName: 'Você (Sessão Atual)', title: playerStats.currentStreak >= 5 ? 'Jonin de Elite' : 'Genin Dedicado', streak: playerStats.currentStreak, winRate: playerStats.gamesPlayed > 0 ? Math.round((playerStats.gamesWon / playerStats.gamesPlayed) * 100) : 0 }
  ].sort((a, b) => b.streak - a.streak);

  return res.json({ success: true, leaderboard: sampleShinobiRanks });
}
