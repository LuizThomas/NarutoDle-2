export type Gender = 'Masculino' | 'Feminino' | 'Desconhecido / Outro';
export type Species = 'Humano' | 'Bijuu (Besta com Cauda)' | 'Otsutsuki' | 'Invocação' | 'Marionete' | 'Zetsu Artificial';
export type NinjaRank = 
  | 'Genin' 
  | 'Chunin' 
  | 'Tokubetsu Jonin' 
  | 'Jonin' 
  | 'Kage' 
  | 'Nukenin (Renegado)' 
  | 'Anbu' 
  | 'Lorde / Civil' 
  | 'Deus Shinobi';

export type Status = 'Vivo' | 'Falecido' | 'Reanimado (Edo Tensei)' | 'Selado';
export type Era = 'Clássico' | 'Shippuden' | 'The Last (Em Branco)' | 'Boruto' | 'Era dos Estados Combatentes';
export type DifficultyTier = 'easy' | 'normal' | 'hard' | 'expert';
export type GameMode = 'classic' | 'jutsu' | 'quote' | 'eye' | 'silhouette';

export interface CharacterFamily {
  father?: string | null;
  mother?: string | null;
  siblings?: string[] | null;
  spouse?: string | null;
  children?: string[] | null;
}

export interface CharacterQuote {
  quote: string;
  context?: string;
  recipient?: string;
}

export interface CharacterJutsu {
  name: string;
  kanji?: string;
  classification?: string; // Ninjutsu, Genjutsu, Taijutsu, Fuinjutsu, Senjutsu, Doujutsu
  nature?: string;
  rank?: string; // S, A, B, C, D, E, Hiden, Kekkei Genkai
  description: string;
}

export interface Character {
  id: string;
  name: string;
  aliases: string[];
  japaneseName: string;
  gender: Gender;
  species: Species;
  clan: string;
  village: string;
  country: string;
  rank: NinjaRank;
  age: number | null; // Canonical age (usually Shippuden / peak)
  height: number | null; // in cm
  weight: number | null; // in kg
  team: string;
  organization: string;
  family: CharacterFamily;
  master: string;
  students: string[];
  chakraNature: string[]; // ['Fogo', 'Vento', 'Relâmpago', 'Terra', 'Água', 'Yin', 'Yang']
  kekkeiGenkai: string[];
  abilities: string[];
  jutsu: CharacterJutsu[];
  transformations: string[];
  firstAppearance: string; // Manga chapter or Anime episode
  firstArc: string;
  status: Status;
  era: Era;
  image: string;
  portrait: string;
  silhouette?: string;
  eyeImage?: string;
  eyeDescription?: string;
  quotes: CharacterQuote[];
  tags: string[];
  difficultyTier: DifficultyTier;
  popularityRank: number; // 1 = highest
  active: boolean;
}

export type MatchState = 'correct' | 'partial' | 'incorrect';
export type NumberDirection = 'up' | 'down' | 'equal';

export interface AttributeComparison<T = any> {
  value: T;
  targetValue?: T; // only populated when game is over
  state: MatchState;
  direction?: NumberDirection;
}

export interface ClassicComparison {
  name: AttributeComparison<string>;
  gender: AttributeComparison<Gender>;
  species: AttributeComparison<Species>;
  clan: AttributeComparison<string>;
  village: AttributeComparison<string>;
  country: AttributeComparison<string>;
  rank: AttributeComparison<NinjaRank>;
  age: AttributeComparison<number | null>;
  height: AttributeComparison<number | null>;
  weight: AttributeComparison<number | null>;
  team: AttributeComparison<string>;
  organization: AttributeComparison<string>;
  master: AttributeComparison<string>;
  chakraNature: AttributeComparison<string[]>;
  kekkeiGenkai: AttributeComparison<string[]>;
  firstArc: AttributeComparison<string>;
  status: AttributeComparison<Status>;
  era: AttributeComparison<Era>;
}

export interface GuessResult {
  guessId: string;
  guessedCharacter: {
    id: string;
    name: string;
    japaneseName: string;
    image: string;
    clan: string;
    village: string;
  };
  correct: boolean;
  comparison?: ClassicComparison;
  modeHint?: string; // For Jutsu, Quote, Eye, Silhouette
  attemptNumber: number;
  timestamp: number;
}

export interface GameSession {
  gameId: string;
  mode: GameMode;
  difficulty: DifficultyTier;
  secretCharacterId: string; // HIDDEN FROM CLIENT
  attempts: GuessResult[];
  status: 'IN_PROGRESS' | 'WON' | 'GIVEN_UP';
  startTime: number;
  endTime?: number;
  hintsUnlocked: number;
  score?: number;
  revealedSecret?: Character; // ONLY PRESENT AFTER COMPLETION
  // Specific mode prompt clues sent to player initially:
  modeClue?: {
    jutsuClue?: {
      jutsuName?: string;
      description: string;
      classification: string;
      rank?: string;
      element?: string;
    };
    quoteClue?: {
      quote: string;
      context?: string;
    };
    eyeClue?: {
      eyeImage?: string;
      eyeDescription?: string;
    };
    silhouetteClue?: {
      image: string;
      blurLevel: number;
    };
  };
}

export interface PlayerStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  totalAttempts: number;
  averageAttempts: number;
  totalTimeSeconds: number;
  averageTimeSeconds: number;
  modeWins: Record<GameMode, number>;
  guessDistribution: Record<number, number>; // { 1: 5, 2: 12, ... 10+: 2 }
  history: {
    gameId: string;
    mode: GameMode;
    characterName: string;
    characterImage: string;
    attempts: number;
    won: boolean;
    durationSeconds: number;
    date: string;
  }[];
}
