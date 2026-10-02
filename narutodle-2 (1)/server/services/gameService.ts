import { 
  Character, 
  GameSession, 
  GameMode, 
  DifficultyTier, 
  GuessResult, 
  ClassicComparison, 
  AttributeComparison, 
  NumberDirection, 
  MatchState,
  PlayerStats 
} from '../types/character.js';
import { allCharacters, getCharacterById } from '../data/characters.js';

function generateRandomGameId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return 'game_' + crypto.randomUUID().replace(/-/g, '').slice(0, 12);
  }
  return 'game_' + Math.random().toString(36).substring(2, 14);
}

// In-memory sessions & stats (with fallback storage)
const sessions = new Map<string, GameSession>();
const recentPicks = new Map<string, string[]>(); // sessionId -> recent character ids to prevent repetition

export const playerStats: PlayerStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  totalAttempts: 0,
  averageAttempts: 0,
  totalTimeSeconds: 0,
  averageTimeSeconds: 0,
  modeWins: {
    classic: 0,
    jutsu: 0,
    quote: 0,
    eye: 0,
    silhouette: 0
  },
  guessDistribution: {
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0
  },
  history: []
};

// Compare numbers with direction
function compareNumber(val: number | null, target: number | null): { state: MatchState; direction?: NumberDirection } {
  if (val === null && target === null) return { state: 'correct', direction: 'equal' };
  if (val === null || target === null) return { state: 'incorrect' };
  if (val === target) return { state: 'correct', direction: 'equal' };
  return {
    state: 'incorrect',
    direction: val < target ? 'up' : 'down' // 'up' means target is higher, 'down' means target is lower
  };
}

// Compare arrays (like chakraNature or kekkeiGenkai)
function compareArray(arr: string[], targetArr: string[]): { state: MatchState } {
  const normA = (arr || []).map(x => x.toLowerCase().trim());
  const normB = (targetArr || []).map(x => x.toLowerCase().trim());

  if (normA.length === 0 && normB.length === 0) return { state: 'correct' };
  
  const intersection = normA.filter(x => normB.includes(x));
  if (intersection.length === normA.length && normA.length === normB.length) {
    return { state: 'correct' };
  }
  if (intersection.length > 0) {
    return { state: 'partial' };
  }
  return { state: 'incorrect' };
}

// Compare string attributes
function compareString(val: string, target: string): { state: MatchState } {
  const v = (val || '').toLowerCase().trim();
  const t = (target || '').toLowerCase().trim();
  if (v === t) return { state: 'correct' };
  if (v && t && (v.includes(t) || t.includes(v))) return { state: 'partial' };
  return { state: 'incorrect' };
}

export function createGameSession(mode: GameMode, difficulty: DifficultyTier, clientSessionKey = 'default'): GameSession {
  // Pool filtering by difficulty
  let pool = allCharacters.filter(c => c.active);

  if (difficulty === 'easy') {
    pool = pool.filter(c => c.difficultyTier === 'easy' || c.popularityRank <= 20);
  } else if (difficulty === 'normal') {
    pool = pool.filter(c => c.difficultyTier === 'easy' || c.difficultyTier === 'normal' || c.popularityRank <= 45);
  } else if (difficulty === 'hard') {
    pool = pool.filter(c => c.difficultyTier === 'normal' || c.difficultyTier === 'hard');
  }
  // 'expert' uses whole pool

  if (pool.length === 0) pool = allCharacters;

  // Filter out recent picks for this player
  const recents = recentPicks.get(clientSessionKey) || [];
  let available = pool.filter(c => !recents.includes(c.id));
  if (available.length === 0) {
    // Reset pool history once exhausted
    recentPicks.set(clientSessionKey, []);
    available = pool;
  }

  // Pick random character
  const randomIndex = Math.floor(Math.random() * available.length);
  const secretCharacter = available[randomIndex];

  // Update recent picks (keep last 20)
  recents.push(secretCharacter.id);
  if (recents.length > 25) recents.shift();
  recentPicks.set(clientSessionKey, recents);

  const gameId = generateRandomGameId();

  // Build mode clues (without leaking character name)
  let modeClue: GameSession['modeClue'] = undefined;

  if (mode === 'jutsu') {
    const randomJutsu = secretCharacter.jutsu[Math.floor(Math.random() * secretCharacter.jutsu.length)] || {
      name: 'Técnica Oculta',
      description: 'Uma técnica secreta e destrutiva deste shinobi lendário.',
      classification: 'Ninjutsu'
    };
    modeClue = {
      jutsuClue: {
        jutsuName: randomJutsu.name,
        description: randomJutsu.description,
        classification: randomJutsu.classification || 'Ninjutsu',
        rank: randomJutsu.rank,
        element: randomJutsu.nature
      }
    };
  } else if (mode === 'quote') {
    const randomQuote = secretCharacter.quotes[Math.floor(Math.random() * secretCharacter.quotes.length)] || {
      quote: 'Eu sigo meu próprio caminho ninja!'
    };
    modeClue = {
      quoteClue: {
        quote: randomQuote.quote,
        context: randomQuote.context
      }
    };
  } else if (mode === 'eye') {
    modeClue = {
      eyeClue: {
        eyeImage: secretCharacter.portrait,
        eyeDescription: secretCharacter.eyeDescription || 'Olhar concentrado e determinado de um shinobi de elite.'
      }
    };
  } else if (mode === 'silhouette') {
    modeClue = {
      silhouetteClue: {
        image: secretCharacter.portrait,
        blurLevel: 10
      }
    };
  }

  const session: GameSession = {
    gameId,
    mode,
    difficulty,
    secretCharacterId: secretCharacter.id,
    attempts: [],
    status: 'IN_PROGRESS',
    startTime: Date.now(),
    hintsUnlocked: 0,
    modeClue
  };

  sessions.set(gameId, session);
  return session;
}

export function getSession(gameId: string): GameSession | undefined {
  return sessions.get(gameId);
}

// Generate comparison for Classic mode
function generateClassicComparison(guessed: Character, secret: Character): ClassicComparison {
  return {
    name: { value: guessed.name, state: guessed.id === secret.id ? 'correct' : 'incorrect' },
    gender: { value: guessed.gender, state: guessed.gender === secret.gender ? 'correct' : 'incorrect' },
    species: { value: guessed.species, state: guessed.species === secret.species ? 'correct' : 'incorrect' },
    clan: { value: guessed.clan, ...compareString(guessed.clan, secret.clan) },
    village: { value: guessed.village, ...compareString(guessed.village, secret.village) },
    country: { value: guessed.country, ...compareString(guessed.country, secret.country) },
    rank: { value: guessed.rank, state: guessed.rank === secret.rank ? 'correct' : 'incorrect' },
    age: { value: guessed.age, ...compareNumber(guessed.age, secret.age) },
    height: { value: guessed.height, ...compareNumber(guessed.height, secret.height) },
    weight: { value: guessed.weight, ...compareNumber(guessed.weight, secret.weight) },
    team: { value: guessed.team, ...compareString(guessed.team, secret.team) },
    organization: { value: guessed.organization, ...compareString(guessed.organization, secret.organization) },
    master: { value: guessed.master, ...compareString(guessed.master, secret.master) },
    chakraNature: { value: guessed.chakraNature, ...compareArray(guessed.chakraNature, secret.chakraNature) },
    kekkeiGenkai: { value: guessed.kekkeiGenkai, ...compareArray(guessed.kekkeiGenkai, secret.kekkeiGenkai) },
    firstArc: { value: guessed.firstArc, ...compareString(guessed.firstArc, secret.firstArc) },
    status: { value: guessed.status, state: guessed.status === secret.status ? 'correct' : 'incorrect' },
    era: { value: guessed.era, state: guessed.era === secret.era ? 'correct' : 'incorrect' }
  };
}

// Generate incremental hint for specialized modes on incorrect guess
function getIncrementalModeHint(mode: GameMode, secret: Character, attemptCount: number): string | undefined {
  if (mode === 'jutsu') {
    if (attemptCount === 1) return `Pista: A vila deste shinobi é ${secret.village}.`;
    if (attemptCount === 2) return `Pista: O clã do personagem é ${secret.clan}.`;
    if (attemptCount >= 3) return `Pista: Primeira aparição no ${secret.firstArc}.`;
  }
  if (mode === 'quote') {
    if (attemptCount === 1) return `Pista: Ele(a) pertence a ${secret.village}.`;
    if (attemptCount === 2) return `Pista: O seu rank shinobi é ${secret.rank}.`;
    if (attemptCount >= 3) return `Pista: O seu mestre foi ${secret.master}.`;
  }
  if (mode === 'eye') {
    if (attemptCount === 1) return `Pista: Gênero ${secret.gender}, Vila ${secret.village}.`;
    if (attemptCount >= 2) return `Pista: Kekkei Genkai: ${secret.kekkeiGenkai.join(', ') || 'Nenhum'}.`;
  }
  if (mode === 'silhouette') {
    if (attemptCount === 1) return `Pista: Chakra Natureza principal inclui ${secret.chakraNature.slice(0, 2).join(', ')}.`;
    if (attemptCount >= 2) return `Pista: Pertence ao ${secret.team}.`;
  }
  return undefined;
}

export function makeGuess(gameId: string, characterId: string): { 
  success: boolean; 
  result?: GuessResult; 
  session?: GameSession; 
  error?: string 
} {
  const session = sessions.get(gameId);
  if (!session) return { success: false, error: 'Partida não encontrada.' };
  if (session.status !== 'IN_PROGRESS') return { success: false, error: 'Esta partida já foi encerrada.' };

  const guessed = getCharacterById(characterId);
  const secret = getCharacterById(session.secretCharacterId);
  if (!guessed || !secret) return { success: false, error: 'Personagem inválido.' };

  const isCorrect = guessed.id === secret.id;
  const attemptNum = session.attempts.length + 1;

  let comparison: ClassicComparison | undefined = undefined;
  if (session.mode === 'classic') {
    comparison = generateClassicComparison(guessed, secret);
  }

  const modeHint = !isCorrect ? getIncrementalModeHint(session.mode, secret, attemptNum) : undefined;

  const guessResult: GuessResult = {
    guessId: 'guess_' + attemptNum + '_' + Date.now(),
    guessedCharacter: {
      id: guessed.id,
      name: guessed.name,
      japaneseName: guessed.japaneseName,
      image: guessed.portrait,
      clan: guessed.clan,
      village: guessed.village
    },
    correct: isCorrect,
    comparison,
    modeHint,
    attemptNumber: attemptNum,
    timestamp: Date.now()
  };

  session.attempts.unshift(guessResult); // newest first

  if (isCorrect) {
    session.status = 'WON';
    session.endTime = Date.now();
    session.revealedSecret = secret; // Revealed ONLY now!
    const duration = Math.max(1, Math.round((session.endTime - session.startTime) / 1000));
    session.score = Math.max(100, 1000 - (attemptNum - 1) * 90 - Math.min(300, duration * 2));

    // Update player statistics
    playerStats.gamesPlayed += 1;
    playerStats.gamesWon += 1;
    playerStats.currentStreak += 1;
    if (playerStats.currentStreak > playerStats.maxStreak) {
      playerStats.maxStreak = playerStats.currentStreak;
    }
    playerStats.totalAttempts += attemptNum;
    playerStats.averageAttempts = Number((playerStats.totalAttempts / playerStats.gamesWon).toFixed(1));
    playerStats.totalTimeSeconds += duration;
    playerStats.averageTimeSeconds = Math.round(playerStats.totalTimeSeconds / playerStats.gamesWon);
    playerStats.modeWins[session.mode] = (playerStats.modeWins[session.mode] || 0) + 1;

    const bracket = Math.min(10, attemptNum);
    playerStats.guessDistribution[bracket] = (playerStats.guessDistribution[bracket] || 0) + 1;

    playerStats.history.unshift({
      gameId: session.gameId,
      mode: session.mode,
      characterName: secret.name,
      characterImage: secret.portrait,
      attempts: attemptNum,
      won: true,
      durationSeconds: duration,
      date: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    });

    if (playerStats.history.length > 30) playerStats.history.pop();
  }

  return { success: true, result: guessResult, session };
}

export function surrenderGame(gameId: string): { success: boolean; session?: GameSession; error?: string } {
  const session = sessions.get(gameId);
  if (!session) return { success: false, error: 'Partida não encontrada.' };

  const secret = getCharacterById(session.secretCharacterId);
  if (!secret) return { success: false, error: 'Erro ao revelar personagem.' };

  session.status = 'GIVEN_UP';
  session.endTime = Date.now();
  session.revealedSecret = secret; // Revealed safely

  playerStats.gamesPlayed += 1;
  playerStats.currentStreak = 0; // streak reset
  const duration = Math.max(1, Math.round((session.endTime - session.startTime) / 1000));

  playerStats.history.unshift({
    gameId: session.gameId,
    mode: session.mode,
    characterName: secret.name,
    characterImage: secret.portrait,
    attempts: session.attempts.length,
    won: false,
    durationSeconds: duration,
    date: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  });

  return { success: true, session };
}
