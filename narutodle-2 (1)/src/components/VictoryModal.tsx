import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RefreshCw, Share2, BarChart2, Flame, Clock, Award, X } from 'lucide-react';
import { GameSession } from '../../server/types/character.js';
import { NinjaAvatar } from './NinjaAvatar.js';
import { playVictoryFanfare, triggerHaptic } from '../utils/soundEffects.js';

interface VictoryModalProps {
  session: GameSession;
  onNewGame: () => void;
  onOpenStats: () => void;
  onClose: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  session,
  onNewGame,
  onOpenStats,
  onClose
}) => {
  const secret = session.revealedSecret;
  const isWon = session.status === 'WON';
  const attemptsCount = session.attempts.length;
  const durationSeconds = session.endTime && session.startTime
    ? Math.max(1, Math.round((session.endTime - session.startTime) / 1000))
    : 10;

  useEffect(() => {
    if (isWon) {
      playVictoryFanfare();
      triggerHaptic([100, 50, 150]);

      // Spectacular Chakra Confetti burst
      const end = Date.now() + 1500;
      const colors = ['#f97316', '#ef4444', '#eab308', '#38bdf8', '#ffffff'];

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }
  }, [isWon]);

  const handleShare = () => {
    if (!secret) return;
    const modeName = session.mode.toUpperCase();
    const resultText = `🔥 NarutoDle 2 — Modo ${modeName}\n${
      isWon
        ? `Acertei o shinobi em ${attemptsCount} tentativa(s)! 🎯 Score: ${session.score || 850} pts`
        : `Desisti após ${attemptsCount} tentativa(s). O shinobi era ${secret.name}!`
    }\nJogue infinitamente em: ${window.location.origin}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(resultText);
      alert('Resultado copiado para a área de transferência!');
    }
  };

  if (!secret) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl shadow-orange-950/40 p-6 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Ribbon */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 mb-3 shadow-inner">
            {isWon ? <Trophy className="w-8 h-8 text-amber-400" /> : <Award className="w-8 h-8 text-neutral-400" />}
          </div>
          <h2
            className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-red-400 uppercase tracking-tight"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            {isWon ? 'VOCÊ DESCOBRIU!' : 'FIM DA PARTIDA'}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            {isWon
              ? `Excelente intuição shinobi! Você precisou de ${attemptsCount} ${
                  attemptsCount === 1 ? 'tentativa' : 'tentativas'
                }.`
              : 'O shinobi secreto foi revelado:'}
          </p>
        </div>

        {/* Revealed Character Card */}
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-neutral-950/80 border border-neutral-800 p-4 rounded-xl mb-6">
          <NinjaAvatar src={secret.portrait} name={secret.name} size="lg" className="border-2 border-orange-500/50" />
          <div className="text-center sm:text-left min-w-0">
            <h3 className="text-lg font-bold text-neutral-100 truncate">{secret.name}</h3>
            <p className="text-xs text-orange-400 font-mono mb-1">{secret.japaneseName}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 text-xs text-neutral-400">
              <span className="bg-neutral-800 px-2 py-0.5 rounded">{secret.village}</span>
              <span className="bg-neutral-800 px-2 py-0.5 rounded">{secret.clan}</span>
              <span className="bg-neutral-800 px-2 py-0.5 rounded text-amber-300">{secret.rank}</span>
            </div>
            {secret.quotes && secret.quotes.length > 0 && (
              <p className="text-xs text-neutral-300 italic mt-2 line-clamp-2">
                "{secret.quotes[0].quote}"
              </p>
            )}
          </div>
        </div>

        {/* Stats Meters */}
        <div className="grid grid-cols-3 gap-2.5 mb-6 text-center font-mono">
          <div className="p-2.5 bg-neutral-950/60 rounded-xl border border-neutral-800/80">
            <div className="text-xs text-neutral-400 flex items-center justify-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-400" /> Tentativas
            </div>
            <div className="text-lg font-bold text-neutral-100 mt-0.5 tabular-nums">
              {attemptsCount}
            </div>
          </div>
          <div className="p-2.5 bg-neutral-950/60 rounded-xl border border-neutral-800/80">
            <div className="text-xs text-neutral-400 flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5 text-blue-400" /> Tempo
            </div>
            <div className="text-lg font-bold text-neutral-100 mt-0.5 tabular-nums">
              {durationSeconds}s
            </div>
          </div>
          <div className="p-2.5 bg-neutral-950/60 rounded-xl border border-neutral-800/80">
            <div className="text-xs text-neutral-400 flex items-center justify-center gap-1">
              <Flame className="w-3.5 h-3.5 text-orange-400" /> Pontuação
            </div>
            <div className="text-lg font-bold text-orange-400 mt-0.5 tabular-nums">
              {session.score || (isWon ? 750 : 0)}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={onNewGame}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 hover:from-orange-500 hover:to-amber-500 text-white font-bold rounded-xl shadow-lg shadow-orange-950/50 transition-all active:scale-[0.98]"
          >
            <RefreshCw className="w-4 h-4 animate-spin-hover" />
            <span>JOGAR NOVAMENTE (INFINITO)</span>
          </button>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 py-2.5 px-3 bg-neutral-800 hover:bg-neutral-700/80 text-neutral-200 text-xs sm:text-sm font-semibold rounded-xl border border-neutral-700/80 transition-colors"
            >
              <Share2 className="w-4 h-4 text-orange-400" />
              <span>Compartilhar</span>
            </button>
            <button
              onClick={onOpenStats}
              className="flex items-center justify-center gap-2 py-2.5 px-3 bg-neutral-800 hover:bg-neutral-700/80 text-neutral-200 text-xs sm:text-sm font-semibold rounded-xl border border-neutral-700/80 transition-colors"
            >
              <BarChart2 className="w-4 h-4 text-amber-400" />
              <span>Estatísticas</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
