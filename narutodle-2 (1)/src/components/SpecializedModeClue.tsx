import React from 'react';
import { GameSession } from '../../server/types/character.js';
import { Sparkles, Eye, MessageSquareQuote, Flame, EyeOff } from 'lucide-react';
import { NinjaAvatar } from './NinjaAvatar.js';

interface SpecializedModeClueProps {
  session: GameSession;
}

export const SpecializedModeClue: React.FC<SpecializedModeClueProps> = ({ session }) => {
  const { mode, modeClue, attempts, status } = session;
  const isFinished = status === 'WON' || status === 'GIVEN_UP';

  // Gather all incremental hints received
  const unlockedHints = attempts
    .map(a => a.modeHint)
    .filter((h): h is string => Boolean(h));

  if (mode === 'classic') return null;

  return (
    <div className="w-full max-w-2xl mx-auto my-6 p-6 rounded-2xl bg-gradient-to-b from-neutral-900 via-neutral-900/90 to-neutral-950 border border-neutral-800 shadow-xl relative overflow-hidden">
      {/* Glow decorative aura */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Mode Clue Header */}
      <div className="flex items-center justify-between mb-4 border-b border-neutral-800/80 pb-3">
        <div className="flex items-center gap-2">
          {mode === 'jutsu' && <Flame className="w-5 h-5 text-orange-500" />}
          {mode === 'quote' && <MessageSquareQuote className="w-5 h-5 text-amber-500" />}
          {mode === 'eye' && <Eye className="w-5 h-5 text-red-500" />}
          {mode === 'silhouette' && <EyeOff className="w-5 h-5 text-neutral-400" />}
          <h3 className="font-serif font-bold text-lg text-neutral-100 tracking-wide">
            {mode === 'jutsu' && 'Pista de Jutsu Secreto'}
            {mode === 'quote' && 'Citação Shinobi'}
            {mode === 'eye' && 'Olhar do Shinobi / Dojutsu'}
            {mode === 'silhouette' && 'Silhueta Oculta'}
          </h3>
        </div>
        <span className="text-xs font-mono text-neutral-400 bg-neutral-800/60 px-2 py-0.5 rounded border border-neutral-700/50">
          Modo {mode.toUpperCase()}
        </span>
      </div>

      {/* Clue Content */}
      {mode === 'jutsu' && modeClue?.jutsuClue && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            {modeClue.jutsuClue.classification && (
              <span className="bg-orange-950/80 border border-orange-800/60 text-orange-300 px-2.5 py-1 rounded">
                {modeClue.jutsuClue.classification}
              </span>
            )}
            {modeClue.jutsuClue.rank && (
              <span className="bg-amber-950/80 border border-amber-800/60 text-amber-300 px-2.5 py-1 rounded">
                Rank: {modeClue.jutsuClue.rank}
              </span>
            )}
            {modeClue.jutsuClue.element && (
              <span className="bg-blue-950/80 border border-blue-800/60 text-blue-300 px-2.5 py-1 rounded">
                Elemento: {modeClue.jutsuClue.element}
              </span>
            )}
          </div>
          <h4 className="text-xl font-bold text-orange-400 tracking-wide font-mono">
            {modeClue.jutsuClue.jutsuName}
          </h4>
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed italic bg-black/30 p-3.5 rounded-xl border border-neutral-800/60">
            "{modeClue.jutsuClue.description}"
          </p>
        </div>
      )}

      {mode === 'quote' && modeClue?.quoteClue && (
        <div className="space-y-3">
          <div className="p-5 rounded-xl bg-neutral-950/80 border border-amber-900/40 relative">
            <span className="text-4xl text-amber-500/20 font-serif absolute top-2 left-3 select-none">
              “
            </span>
            <p className="text-base sm:text-lg text-amber-200/90 font-medium italic pl-6 pr-2 leading-relaxed">
              {modeClue.quoteClue.quote}
            </p>
          </div>
          {modeClue.quoteClue.context && (
            <p className="text-xs text-neutral-400 font-mono">
              Ocasião: <span className="text-neutral-300">{modeClue.quoteClue.context}</span>
            </p>
          )}
        </div>
      )}

      {mode === 'eye' && modeClue?.eyeClue && (
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="relative w-36 h-28 sm:w-44 sm:h-32 rounded-xl overflow-hidden border-2 border-red-500/50 shadow-lg shadow-red-950/30 shrink-0 bg-black flex items-center justify-center">
            {modeClue.eyeClue.eyeImage ? (
              <img
                src={modeClue.eyeClue.eyeImage}
                alt="Eye preview"
                className="w-full h-full object-cover object-top filter contrast-125 scale-150"
              />
            ) : (
              <Eye className="w-12 h-12 text-red-500 animate-pulse" />
            )}
            <div className="absolute inset-0 ring-1 ring-inset ring-red-500/30 pointer-events-none" />
          </div>
          <div className="space-y-2 text-center sm:text-left">
            <h4 className="text-xs font-mono uppercase tracking-wider text-red-400">
              Análise Ocular
            </h4>
            <p className="text-sm text-neutral-300 leading-relaxed">
              {modeClue.eyeClue.eyeDescription}
            </p>
            <span className="inline-block text-xs text-neutral-500 italic">
              Observe formato da íris, detalhes da pupila e marcas ao redor das órbitas.
            </span>
          </div>
        </div>
      )}

      {mode === 'silhouette' && modeClue?.silhouetteClue && (
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-xl overflow-hidden border-2 border-neutral-700 bg-neutral-950 shrink-0 flex items-center justify-center shadow-inner">
            <NinjaAvatar
              src={modeClue.silhouetteClue.image}
              name="Silhueta"
              size="xl"
              silhouette={!isFinished}
              className="w-full h-full"
            />
          </div>
          <div className="space-y-2 text-center sm:text-left">
            <h4 className="text-xs font-mono uppercase tracking-wider text-orange-400">
              Identificação por Forma e Contorno
            </h4>
            <p className="text-sm text-neutral-300">
              Reconheça o ninja através do seu formato capilar, protetores, adereços e porte físico.
            </p>
            {attempts.length > 0 && !isFinished && (
              <p className="text-xs text-amber-400 font-mono">
                Cada erro desbloqueia pistas contextuais adicionais!
              </p>
            )}
          </div>
        </div>
      )}

      {/* Unlocked Hints Feed */}
      {unlockedHints.length > 0 && !isFinished && (
        <div className="mt-4 pt-4 border-t border-neutral-800 space-y-1.5">
          <h5 className="text-xs font-bold uppercase tracking-wider text-orange-400 font-mono flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Pistas Desbloqueadas ({unlockedHints.length})
          </h5>
          <div className="space-y-1">
            {unlockedHints.map((hint, idx) => (
              <div
                key={idx}
                className="text-xs font-medium text-amber-200 bg-amber-950/30 border border-amber-900/40 px-3 py-1.5 rounded-lg"
              >
                {hint}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
