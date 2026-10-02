import React, { useState, useEffect, useRef } from 'react';
import { GameSession, GameMode, DifficultyTier } from '../server/types/character.js';
import { TopNav } from './components/TopNav.js';
import { HeroLanding } from './components/HeroLanding.js';
import { SearchAutocomplete } from './components/SearchAutocomplete.js';
import { ClassicComparisonTable } from './components/ClassicComparisonTable.js';
import { SpecializedModeClue } from './components/SpecializedModeClue.js';
import { VictoryModal } from './components/VictoryModal.js';
import { StatsModal } from './components/StatsModal.js';
import { DatabookModal } from './components/DatabookModal.js';
import { RulesModal } from './components/RulesModal.js';
import { NinjaAvatar } from './components/NinjaAvatar.js';
import { apiClient } from './services/apiClient.js';
import { 
  isSoundEnabled, 
  setSoundEnabled, 
  playGuessSound, 
  playErrorSound, 
  playCorrectSound,
  triggerHaptic 
} from './utils/soundEffects.js';
import { Flag, Sparkles, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [session, setSession] = useState<GameSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<GameMode>('classic');
  const [difficulty, setDifficulty] = useState<DifficultyTier>('normal');
  const [streak, setStreak] = useState(0);
  const [soundOn, setSoundOn] = useState(true);

  // Modals state
  const [showVictory, setShowVictory] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showDatabook, setShowDatabook] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const gameAreaRef = useRef<HTMLDivElement>(null);

  // Initialize sound preference & fetch initial stats
  useEffect(() => {
    setSoundOn(isSoundEnabled());
    fetchStats();
    // Automatically start first game session
    startNewGame(mode, difficulty);
  }, []);

  const fetchStats = async () => {
    try {
      const stats = await apiClient.getStats();
      setStreak(stats.currentStreak || 0);
    } catch (e) {
      console.error('Failed to fetch stats:', e);
    }
  };

  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
  };

  const startNewGame = async (selectedMode = mode, selectedDifficulty = difficulty) => {
    setLoading(true);
    setErrorMessage(null);
    setShowVictory(false);

    try {
      const newSession = await apiClient.startNewGame(selectedMode, selectedDifficulty);
      setSession(newSession);
      setMode(selectedMode);
      setDifficulty(selectedDifficulty);

      // Smooth scroll to active play area
      if (gameAreaRef.current) {
        gameAreaRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || 'Falha ao iniciar partida.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuess = async (characterId: string) => {
    if (!session || session.status !== 'IN_PROGRESS') return;

    try {
      const { guess, game } = await apiClient.makeGuess(session.gameId, characterId);
      setSession(game);

      if (guess.correct) {
        playCorrectSound();
        triggerHaptic([80, 40, 100]);
        setShowVictory(true);
        fetchStats();
      } else {
        playGuessSound();
        triggerHaptic(40);
      }
    } catch (err: any) {
      console.error(err);
      playErrorSound();
      setErrorMessage(err?.message || 'Erro ao processar palpite.');
      setTimeout(() => setErrorMessage(null), 3500);
    }
  };

  const handleSurrender = async () => {
    if (!session || session.status !== 'IN_PROGRESS') return;
    if (!confirm('Deseja desistir desta partida e revelar o personagem secreto?')) return;

    try {
      const updated = await apiClient.surrenderGame(session.gameId);
      setSession(updated);
      setShowVictory(true);
      fetchStats();
    } catch (e: any) {
      console.error('Surrender error:', e);
      setErrorMessage(e?.message || 'Erro ao desistir da partida.');
    }
  };

  // Character IDs already guessed in this match
  const guessedIds = session?.attempts.map(a => a.guessedCharacter.id) || [];
  const isFinished = session?.status === 'WON' || session?.status === 'GIVEN_UP';

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100 selection:bg-orange-500 selection:text-white">
      {/* Top Bar with Strict Contract */}
      <TopNav
        currentMode={mode}
        onSelectMode={m => startNewGame(m, difficulty)}
        onNewGame={() => startNewGame(mode, difficulty)}
        onOpenStats={() => setShowStats(true)}
        onOpenDatabook={() => setShowDatabook(true)}
        onOpenRules={() => setShowRules(true)}
        soundEnabled={soundOn}
        onToggleSound={handleToggleSound}
        streak={streak}
      />

      {/* Hero Landing */}
      <HeroLanding
        selectedMode={mode}
        onSelectMode={m => setMode(m)}
        selectedDifficulty={difficulty}
        onSelectDifficulty={d => setDifficulty(d)}
        onStartGame={(m, d) => startNewGame(m, d)}
        onOpenDatabook={() => setShowDatabook(true)}
      />

      {/* Main Play Area */}
      <main ref={gameAreaRef} className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Session Status HUD */}
        {session && (
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-neutral-900/80 border border-neutral-800 rounded-xl mb-6 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-orange-950/80 border border-orange-700/60 text-orange-400 text-xs font-mono font-bold uppercase">
                {session.mode}
              </span>
              <span className="text-xs font-mono text-neutral-400">
                Dificuldade: <strong className="text-neutral-200 capitalize">{session.difficulty}</strong>
              </span>
              <span className="text-neutral-600 hidden sm:inline">·</span>
              <span className="text-xs font-mono text-neutral-400 hidden sm:inline">
                ID: <code className="text-neutral-300">{session.gameId}</code>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-neutral-400">
                Tentativas: <strong className="text-orange-400 text-sm">{session.attempts.length}</strong>
              </span>

              {!isFinished && (
                <button
                  onClick={handleSurrender}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-800 hover:bg-neutral-700/80 text-neutral-300 hover:text-white rounded-lg text-xs font-medium border border-neutral-700/80 transition-colors"
                  title="Desistir e ver resposta"
                >
                  <Flag className="w-3.5 h-3.5 text-red-400" />
                  <span>Desistir</span>
                </button>
              )}

              {isFinished && (
                <button
                  onClick={() => startNewGame(mode, difficulty)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Próximo Shinobi</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Error notification banner */}
        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs sm:text-sm flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Specialized Mode Clue Section (Jutsu, Quote, Eye, Silhouette) */}
        {session && session.mode !== 'classic' && (
          <SpecializedModeClue session={session} />
        )}

        {/* Autocomplete Input */}
        <div className="mb-8">
          <SearchAutocomplete
            disabledGuessedIds={guessedIds}
            disabled={isFinished || loading}
            onSelectCharacter={handleGuess}
            placeholder={
              session?.mode === 'jutsu'
                ? 'Quem domina este jutsu? (ex: Naruto, Kakashi...)'
                : session?.mode === 'quote'
                ? 'Quem disse esta frase? (ex: Itachi, Jiraiya...)'
                : session?.mode === 'eye'
                ? 'De quem é este olhar shinobi? (ex: Sasuke, Hinata...)'
                : session?.mode === 'silhouette'
                ? 'Quem é o shinobi na silhueta? (ex: Gaara, Lee...)'
                : 'Digite o nome de um shinobi (ex: Naruto, Kakashi, Sasuke...)'
            }
          />
        </div>

        {/* Mode Play Table / Attempts Presentation */}
        {session && session.mode === 'classic' && (
          <ClassicComparisonTable attempts={session.attempts} />
        )}

        {/* Non-Classic Mode Attempts Feed */}
        {session && session.mode !== 'classic' && session.attempts.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
              Palpites Realizados ({session.attempts.length})
            </h4>
            <div className="space-y-2">
              {session.attempts.map(att => (
                <div
                  key={att.guessId}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    att.correct
                      ? 'bg-emerald-950/40 border-emerald-500/80 shadow-md shadow-emerald-950/40'
                      : 'bg-neutral-900/70 border-neutral-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <NinjaAvatar src={att.guessedCharacter.image} name={att.guessedCharacter.name} size="sm" />
                    <div>
                      <div className="text-sm font-bold text-neutral-100">{att.guessedCharacter.name}</div>
                      <div className="text-xs text-neutral-400">
                        {att.guessedCharacter.village} · {att.guessedCharacter.clan}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {att.correct ? (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-700/60 px-2.5 py-1 rounded-lg">
                        <CheckCircle2 className="w-4 h-4" /> CORRETO!
                      </span>
                    ) : (
                      <span className="text-xs font-mono text-red-400 bg-red-950/50 border border-red-900/50 px-2.5 py-1 rounded-lg">
                        Incorreto
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Clean Editorial Footer */}
      <footer className="border-t border-neutral-800/80 bg-neutral-950 py-8 text-center text-xs text-neutral-500">
        <div className="max-w-4xl mx-auto px-4 space-y-2">
          <p className="font-serif text-neutral-400 font-semibold">
            NARUTODLE 2 · O Jogo Ninja Definitivo e Infinito
          </p>
          <p className="text-neutral-400">
            Inspirado nas obras e databooks canônicos de Masashi Kishimoto. Desenvolvido para jogabilidade infinita e independente.
          </p>
        </div>
      </footer>

      {/* Victory / End Modal */}
      {showVictory && session && (
        <VictoryModal
          session={session}
          onNewGame={() => startNewGame(mode, difficulty)}
          onOpenStats={() => {
            setShowVictory(false);
            setShowStats(true);
          }}
          onClose={() => setShowVictory(false)}
        />
      )}

      {/* Stats Modal */}
      {showStats && <StatsModal onClose={() => setShowStats(false)} />}

      {/* Databook Inspector Modal */}
      {showDatabook && <DatabookModal onClose={() => setShowDatabook(false)} />}

      {/* Rules Modal */}
      {showRules && <RulesModal onClose={() => setShowRules(false)} />}
    </div>
  );
}
