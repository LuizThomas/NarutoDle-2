import { 
  GameSession, 
  GameMode, 
  DifficultyTier, 
  GuessResult, 
  PlayerStats, 
  Character 
} from '../../server/types/character.js';
import { 
  createGameSession, 
  makeGuess as localMakeGuess, 
  surrenderGame as localSurrenderGame, 
  playerStats as localPlayerStats 
} from '../../server/services/gameService.js';
import { 
  allCharacters, 
  searchCharacters as localSearchCharacters, 
  getCharacterById as localGetCharacterById 
} from '../../server/data/characters.js';

const STATS_STORAGE_KEY = 'narutodle_player_stats_v2';
let isBackendAvailable: boolean | null = null;

// Initialize stats from localStorage if available
function loadLocalStats(): PlayerStats {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(STATS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        Object.assign(localPlayerStats, parsed);
        return localPlayerStats;
      }
    } catch (e) {
      console.warn('Could not load local stats from localStorage', e);
    }
  }
  return localPlayerStats;
}

function saveLocalStats(stats: PlayerStats) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
    } catch (e) {
      console.warn('Could not save local stats to localStorage', e);
    }
  }
}

// Sanitize session for client to never leak secretCharacterId early
function sanitizeSession(session: GameSession): GameSession {
  const { secretCharacterId, ...safe } = session;
  return safe as GameSession;
}

export const apiClient = {
  // Check if a live backend is responding with JSON
  async checkBackend(): Promise<boolean> {
    if (isBackendAvailable !== null) return isBackendAvailable;
    try {
      const res = await fetch('/api/stats', { method: 'GET' });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        isBackendAvailable = Boolean(data.success);
        return isBackendAvailable;
      }
    } catch {
      // Backend not running (e.g. static Vercel deployment)
    }
    isBackendAvailable = false;
    return false;
  },

  async startNewGame(mode: GameMode, difficulty: DifficultyTier): Promise<GameSession> {
    const hasBackend = await this.checkBackend();
    if (hasBackend) {
      try {
        const res = await fetch('/api/games', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode, difficulty })
        });
        const data = await res.json();
        if (data.success && data.game) {
          return data.game;
        }
      } catch (e) {
        console.warn('Backend game creation failed, falling back to client engine', e);
      }
    }

    // Client-side fallback engine (Vercel static / offline)
    const session = createGameSession(mode, difficulty, 'client_session');
    return sanitizeSession(session);
  },

  async makeGuess(gameId: string, characterId: string): Promise<{ guess: GuessResult; game: GameSession }> {
    const hasBackend = await this.checkBackend();
    if (hasBackend) {
      try {
        const res = await fetch(`/api/games/${gameId}/guess`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ characterId })
        });
        const data = await res.json();
        if (data.success) {
          return { guess: data.guess, game: data.game };
        }
        throw new Error(data.error || 'Erro no palpite.');
      } catch (e) {
        console.warn('Backend guess failed, using client engine', e);
      }
    }

    // Client-side fallback engine
    const result = localMakeGuess(gameId, characterId);
    if (!result.success || !result.result || !result.session) {
      throw new Error(result.error || 'Erro ao processar palpite.');
    }

    if (result.result.correct) {
      saveLocalStats(localPlayerStats);
    }

    return {
      guess: result.result,
      game: sanitizeSession(result.session)
    };
  },

  async surrenderGame(gameId: string): Promise<GameSession> {
    const hasBackend = await this.checkBackend();
    if (hasBackend) {
      try {
        const res = await fetch(`/api/games/${gameId}/finish`, {
          method: 'POST'
        });
        const data = await res.json();
        if (data.success && data.game) {
          return data.game;
        }
      } catch (e) {
        console.warn('Backend surrender failed, using client engine', e);
      }
    }

    // Client-side fallback engine
    const result = localSurrenderGame(gameId);
    if (!result.success || !result.session) {
      throw new Error(result.error || 'Erro ao finalizar partida.');
    }
    saveLocalStats(localPlayerStats);
    return sanitizeSession(result.session);
  },

  async getStats(): Promise<PlayerStats> {
    const hasBackend = await this.checkBackend();
    if (hasBackend) {
      try {
        const res = await fetch('/api/stats');
        const data = await res.json();
        if (data.success && data.stats) {
          return data.stats;
        }
      } catch (e) {
        console.warn('Backend getStats failed, reading local stats', e);
      }
    }

    const stats = loadLocalStats();
    return stats;
  },

  async searchCharacters(query: string, limit = 15): Promise<any[]> {
    const hasBackend = await this.checkBackend();
    if (hasBackend) {
      try {
        const res = await fetch(`/api/characters/search?q=${encodeURIComponent(query)}&limit=${limit}`);
        const data = await res.json();
        if (data.success && data.characters) {
          return data.characters;
        }
      } catch (e) {
        console.warn('Backend search failed, using local search', e);
      }
    }

    // Client-side instant search
    const results = localSearchCharacters(query, limit);
    return results.map(c => ({
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
  },

  async getAllCharacters(): Promise<any[]> {
    const hasBackend = await this.checkBackend();
    if (hasBackend) {
      try {
        const res = await fetch('/api/characters');
        const data = await res.json();
        if (data.success && data.characters) {
          return data.characters;
        }
      } catch (e) {
        console.warn('Backend getAllCharacters failed, using local list', e);
      }
    }

    return allCharacters.map(c => ({
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
  },

  async getCharacterById(id: string): Promise<Character | null> {
    const hasBackend = await this.checkBackend();
    if (hasBackend) {
      try {
        const res = await fetch(`/api/characters/${id}`);
        const data = await res.json();
        if (data.success && data.character) {
          return data.character;
        }
      } catch (e) {
        console.warn('Backend getCharacterById failed, using local catalog', e);
      }
    }

    return localGetCharacterById(id) || null;
  }
};
