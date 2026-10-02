import React from 'react';
import { Volume2, VolumeX, BarChart2, BookOpen, RefreshCw, HelpCircle } from 'lucide-react';
import { GameMode } from '../../server/types/character.js';

interface TopNavProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  onNewGame: () => void;
  onOpenStats: () => void;
  onOpenDatabook: () => void;
  onOpenRules: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  streak: number;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentMode,
  onSelectMode,
  onNewGame,
  onOpenStats,
  onOpenDatabook,
  onOpenRules,
  soundEnabled,
  onToggleSound,
  streak
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={onNewGame}
          className="text-left font-serif font-black tracking-tight text-xl sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-400 to-red-500 hover:opacity-90 transition-opacity"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          NARUTODLE 2
        </button>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs sm:text-sm font-medium text-neutral-400">
          <button
            onClick={() => onSelectMode('classic')}
            className={`transition-colors pb-1 border-b-2 ${
              currentMode === 'classic'
                ? 'text-orange-400 border-orange-500 font-semibold'
                : 'border-transparent hover:text-neutral-100'
            }`}
          >
            Clássico
          </button>
          <button
            onClick={() => onSelectMode('jutsu')}
            className={`transition-colors pb-1 border-b-2 ${
              currentMode === 'jutsu'
                ? 'text-orange-400 border-orange-500 font-semibold'
                : 'border-transparent hover:text-neutral-100'
            }`}
          >
            Jutsu
          </button>
          <button
            onClick={() => onSelectMode('quote')}
            className={`transition-colors pb-1 border-b-2 ${
              currentMode === 'quote'
                ? 'text-orange-400 border-orange-500 font-semibold'
                : 'border-transparent hover:text-neutral-100'
            }`}
          >
            Citação
          </button>
          <button
            onClick={() => onSelectMode('eye')}
            className={`transition-colors pb-1 border-b-2 ${
              currentMode === 'eye'
                ? 'text-orange-400 border-orange-500 font-semibold'
                : 'border-transparent hover:text-neutral-100'
            }`}
          >
            Olho
          </button>
          <button
            onClick={() => onSelectMode('silhouette')}
            className={`transition-colors pb-1 border-b-2 ${
              currentMode === 'silhouette'
                ? 'text-orange-400 border-orange-500 font-semibold'
                : 'border-transparent hover:text-neutral-100'
            }`}
          >
            Silhueta
          </button>
          <span className="text-neutral-700">|</span>
          <button
            onClick={onOpenDatabook}
            className="hover:text-neutral-100 transition-colors inline-flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4 text-orange-400/80" />
            <span>Databook</span>
          </button>
          <button
            onClick={onOpenStats}
            className="hover:text-neutral-100 transition-colors inline-flex items-center gap-1.5"
          >
            <BarChart2 className="w-4 h-4 text-orange-400/80" />
            <span>Estatísticas</span>
          </button>
          <button
            onClick={onOpenRules}
            className="hover:text-neutral-100 transition-colors inline-flex items-center gap-1.5"
          >
            <HelpCircle className="w-4 h-4 text-neutral-400" />
            <span>Regras</span>
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {streak > 0 && (
            <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded bg-orange-950/60 border border-orange-700/50 text-orange-400 text-xs font-mono font-bold">
              <span>🔥 Streak:</span>
              <span className="tabular-nums">{streak}</span>
            </div>
          )}

          <button
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Silenciar som' : 'Ativar som'}
            className="p-2 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-orange-400" /> : <VolumeX className="w-5 h-5 text-neutral-500" />}
          </button>

          <button
            onClick={onNewGame}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 rounded-lg shadow-sm shadow-orange-950/50 transition-all active:scale-95 whitespace-nowrap"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Nova Partida</span>
          </button>
        </div>
      </div>

      {/* Mobile sub-bar for modes */}
      <div className="lg:hidden flex items-center justify-between px-4 py-2 border-t border-neutral-900 bg-neutral-950 text-xs overflow-x-auto gap-2">
        <div className="flex items-center gap-2">
          {(['classic', 'jutsu', 'quote', 'eye', 'silhouette'] as GameMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => onSelectMode(mode)}
              className={`px-2.5 py-1 rounded capitalize whitespace-nowrap transition-colors ${
                currentMode === mode
                  ? 'bg-orange-600 text-white font-medium'
                  : 'text-neutral-400 hover:text-neutral-200 bg-neutral-900'
              }`}
            >
              {mode === 'classic' ? 'Clássico' : mode === 'quote' ? 'Citação' : mode === 'eye' ? 'Olho' : mode === 'silhouette' ? 'Silhueta' : 'Jutsu'}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button onClick={onOpenStats} className="p-1.5 text-neutral-400 hover:text-white">
            <BarChart2 className="w-4 h-4" />
          </button>
          <button onClick={onOpenDatabook} className="p-1.5 text-neutral-400 hover:text-white">
            <BookOpen className="w-4 h-4" />
          </button>
          <button onClick={onOpenRules} className="p-1.5 text-neutral-400 hover:text-white">
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
