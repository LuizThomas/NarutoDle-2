import React, { useState, useEffect } from 'react';
import { BarChart2, Trophy, Flame, Target, Clock, X, RefreshCw } from 'lucide-react';
import { PlayerStats } from '../../server/types/character.js';
import { apiClient } from '../services/apiClient.js';

interface StatsModalProps {
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ onClose }) => {
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.getStats()
      .then(data => {
        setStats(data);
      })
      .catch(err => console.error('Failed to load stats:', err))
      .finally(() => setLoading(false));
  }, []);

  const distribution = stats?.guessDistribution || {};
  const maxFreq = Math.max(1, ...Object.values(distribution));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 mb-6">
          <BarChart2 className="w-6 h-6 text-orange-500" />
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-100 font-serif">
            Estatísticas do Shinobi
          </h2>
        </div>

        {loading ? (
          <div className="py-16 text-center text-neutral-400 flex items-center justify-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-orange-500" />
            <span>Consultando pergaminhos de registro...</span>
          </div>
        ) : stats ? (
          <div className="overflow-y-auto space-y-6 pr-1 pb-2">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 bg-neutral-950/70 border border-neutral-800 rounded-xl text-center">
                <span className="text-xs text-neutral-400 flex items-center justify-center gap-1">
                  <Target className="w-3.5 h-3.5 text-blue-400" /> Partidas
                </span>
                <div className="text-2xl font-black text-neutral-100 font-mono mt-1 tabular-nums">
                  {stats.gamesPlayed}
                </div>
              </div>

              <div className="p-3.5 bg-neutral-950/70 border border-neutral-800 rounded-xl text-center">
                <span className="text-xs text-neutral-400 flex items-center justify-center gap-1">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" /> Taxa de Acerto
                </span>
                <div className="text-2xl font-black text-amber-400 font-mono mt-1 tabular-nums">
                  {stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0}%
                </div>
              </div>

              <div className="p-3.5 bg-neutral-950/70 border border-neutral-800 rounded-xl text-center">
                <span className="text-xs text-neutral-400 flex items-center justify-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-orange-400" /> Streak Atual
                </span>
                <div className="text-2xl font-black text-orange-400 font-mono mt-1 tabular-nums">
                  {stats.currentStreak}
                </div>
              </div>

              <div className="p-3.5 bg-neutral-950/70 border border-neutral-800 rounded-xl text-center">
                <span className="text-xs text-neutral-400 flex items-center justify-center gap-1">
                  <Trophy className="w-3.5 h-3.5 text-emerald-400" /> Melhor Streak
                </span>
                <div className="text-2xl font-black text-emerald-400 font-mono mt-1 tabular-nums">
                  {stats.maxStreak}
                </div>
              </div>
            </div>

            {/* Averages Row */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-neutral-950/50 border border-neutral-800/80 rounded-xl flex items-center justify-between">
                <span className="text-neutral-400">Média de Tentativas:</span>
                <span className="text-sm font-bold text-neutral-200 tabular-nums">
                  {stats.averageAttempts || 0}
                </span>
              </div>
              <div className="p-3 bg-neutral-950/50 border border-neutral-800/80 rounded-xl flex items-center justify-between">
                <span className="text-neutral-400">Tempo Médio:</span>
                <span className="text-sm font-bold text-neutral-200 tabular-nums">
                  {stats.averageTimeSeconds || 0}s
                </span>
              </div>
            </div>

            {/* Guess Distribution Chart */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono">
                Distribuição de Tentativas
              </h3>
              <div className="space-y-1.5">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(guessNum => {
                  const count = distribution[guessNum] || 0;
                  const pct = Math.max(8, Math.round((count / maxFreq) * 100));

                  return (
                    <div key={guessNum} className="flex items-center gap-2 text-xs font-mono">
                      <span className="w-5 text-right text-neutral-400">{guessNum}</span>
                      <div className="flex-1 bg-neutral-950 rounded overflow-hidden h-5 flex items-center">
                        <div
                          style={{ width: `${count > 0 ? pct : 0}%` }}
                          className={`h-full flex items-center justify-end px-2 text-[10px] font-bold text-white transition-all duration-500 ${
                            count > 0
                              ? 'bg-gradient-to-r from-orange-600 to-amber-500'
                              : 'bg-transparent text-neutral-600'
                          }`}
                        >
                          {count}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Match History */}
            {stats.history && stats.history.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-neutral-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono">
                  Histórico Recente
                </h3>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {stats.history.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-neutral-950/60 border border-neutral-800/80 text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            item.won ? 'bg-emerald-400' : 'bg-red-400'
                          }`}
                        />
                        <span className="font-semibold text-neutral-200 truncate">
                          {item.characterName}
                        </span>
                        <span className="text-[10px] text-neutral-400 uppercase font-mono">
                          ({item.mode})
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-neutral-400 font-mono text-[11px] shrink-0">
                        <span>{item.attempts} tent.</span>
                        <span>{item.durationSeconds}s</span>
                        <span className="text-neutral-400">{item.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};
