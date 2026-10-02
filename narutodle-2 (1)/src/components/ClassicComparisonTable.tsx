import React from 'react';
import { ArrowUp, ArrowDown, Check, HelpCircle } from 'lucide-react';
import { GuessResult, AttributeComparison, MatchState } from '../../server/types/character.js';
import { NinjaAvatar } from './NinjaAvatar.js';

interface ClassicComparisonTableProps {
  attempts: GuessResult[];
}

function getCellColorClass(state: MatchState) {
  switch (state) {
    case 'correct':
      return 'bg-emerald-700 text-white border-emerald-500/80 shadow-sm shadow-emerald-950/40';
    case 'partial':
      return 'bg-amber-700 text-white border-amber-500/80 shadow-sm shadow-amber-950/40';
    case 'incorrect':
    default:
      return 'bg-neutral-800/90 text-neutral-300 border-neutral-700/60';
  }
}

function renderValueWithArrow(comp?: AttributeComparison<number | null>, unit = '') {
  if (!comp) return '-';
  const val = comp.value !== null && comp.value !== undefined ? `${comp.value}${unit}` : '?';

  return (
    <div className="flex items-center justify-center gap-1 font-mono font-bold">
      <span>{val}</span>
      {comp.direction === 'up' && (
        <span className="text-amber-200 inline-flex items-center" title="O valor secreto é maior">
          <ArrowUp className="w-4 h-4 stroke-[3]" />
        </span>
      )}
      {comp.direction === 'down' && (
        <span className="text-amber-200 inline-flex items-center" title="O valor secreto é menor">
          <ArrowDown className="w-4 h-4 stroke-[3]" />
        </span>
      )}
    </div>
  );
}

export const ClassicComparisonTable: React.FC<ClassicComparisonTableProps> = ({ attempts }) => {
  if (attempts.length === 0) {
    return (
      <div className="w-full text-center py-12 border border-dashed border-neutral-800/80 rounded-2xl bg-neutral-950/40 p-6">
        <HelpCircle className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
        <p className="text-neutral-400 font-medium text-sm sm:text-base">
          Faça sua primeira tentativa acima para começar a revelar as pistas shinobi!
        </p>
        <p className="text-xs text-neutral-500 mt-1">
          Dica: Comece com um shinobi versátil como Kakashi ou Naruto para mapear Vila, Clã e Naturezas de Chakra.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 text-xs text-neutral-400 font-mono">
        <span className="font-semibold text-neutral-300">
          Tentativas realizadas: <strong className="text-orange-400">{attempts.length}</strong>
        </span>
        <div className="hidden sm:flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-emerald-600 border border-emerald-400 inline-block" /> Correto
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-amber-600 border border-amber-400 inline-block" /> Parcial
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-neutral-800 border border-neutral-600 inline-block" /> Incorreto
          </span>
        </div>
      </div>

      <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
        <div className="min-w-[860px]">
          {/* Table Header */}
          <div className="grid grid-cols-10 gap-2 mb-2 text-center text-xs font-bold uppercase tracking-wider text-neutral-400 select-none px-1">
            <div className="col-span-2 text-left">Shinobi</div>
            <div>Gênero</div>
            <div>Vila</div>
            <div>Clã</div>
            <div>Rank</div>
            <div>Idade</div>
            <div>Altura</div>
            <div>Chakra</div>
            <div>Arco</div>
          </div>

          {/* Rows */}
          <div className="space-y-2">
            {attempts.map((attempt, index) => {
              const comp = attempt.comparison;
              const isFirst = index === 0;

              return (
                <div
                  key={attempt.guessId}
                  className={`grid grid-cols-10 gap-2 items-center p-2 rounded-xl transition-all duration-300 border ${
                    attempt.correct
                      ? 'border-emerald-500/80 bg-emerald-950/20'
                      : 'border-neutral-800/80 bg-neutral-900/60'
                  } ${isFirst ? 'ring-1 ring-orange-500/40' : ''}`}
                >
                  {/* Character Identity */}
                  <div className="col-span-2 flex items-center gap-2.5 min-w-0 pr-1">
                    <NinjaAvatar
                      src={attempt.guessedCharacter.image}
                      name={attempt.guessedCharacter.name}
                      size="sm"
                    />
                    <div className="min-w-0 truncate">
                      <div className="text-xs sm:text-sm font-bold text-neutral-100 truncate">
                        {attempt.guessedCharacter.name}
                      </div>
                      <div className="text-[10px] text-neutral-400 truncate">
                        {attempt.guessedCharacter.japaneseName}
                      </div>
                    </div>
                  </div>

                  {/* Gender */}
                  <div
                    className={`h-14 flex items-center justify-center p-1 rounded-lg border text-xs text-center font-medium ${getCellColorClass(
                      comp?.gender?.state || 'incorrect'
                    )}`}
                  >
                    <span className="truncate">{comp?.gender?.value || '-'}</span>
                  </div>

                  {/* Village */}
                  <div
                    className={`h-14 flex flex-col items-center justify-center p-1 rounded-lg border text-xs text-center font-medium ${getCellColorClass(
                      comp?.village?.state || 'incorrect'
                    )}`}
                  >
                    <span className="truncate max-w-full">{comp?.village?.value || '-'}</span>
                  </div>

                  {/* Clan */}
                  <div
                    className={`h-14 flex items-center justify-center p-1 rounded-lg border text-xs text-center font-medium ${getCellColorClass(
                      comp?.clan?.state || 'incorrect'
                    )}`}
                  >
                    <span className="truncate max-w-full">{comp?.clan?.value || 'Nenhum'}</span>
                  </div>

                  {/* Rank */}
                  <div
                    className={`h-14 flex items-center justify-center p-1 rounded-lg border text-xs text-center font-medium ${getCellColorClass(
                      comp?.rank?.state || 'incorrect'
                    )}`}
                  >
                    <span className="truncate max-w-full">{comp?.rank?.value || '-'}</span>
                  </div>

                  {/* Age */}
                  <div
                    className={`h-14 flex items-center justify-center p-1 rounded-lg border text-xs text-center font-medium ${getCellColorClass(
                      comp?.age?.state || 'incorrect'
                    )}`}
                  >
                    {renderValueWithArrow(comp?.age, ' a')}
                  </div>

                  {/* Height */}
                  <div
                    className={`h-14 flex items-center justify-center p-1 rounded-lg border text-xs text-center font-medium ${getCellColorClass(
                      comp?.height?.state || 'incorrect'
                    )}`}
                  >
                    {renderValueWithArrow(comp?.height, 'cm')}
                  </div>

                  {/* Chakra Nature */}
                  <div
                    className={`h-14 flex items-center justify-center p-1 rounded-lg border text-[11px] text-center font-medium ${getCellColorClass(
                      comp?.chakraNature?.state || 'incorrect'
                    )}`}
                  >
                    <span className="line-clamp-2 max-w-full leading-tight">
                      {comp?.chakraNature?.value && comp.chakraNature.value.length > 0
                        ? comp.chakraNature.value.slice(0, 3).join(', ')
                        : 'Nenhum'}
                    </span>
                  </div>

                  {/* First Arc */}
                  <div
                    className={`h-14 flex items-center justify-center p-1 rounded-lg border text-[11px] text-center font-medium ${getCellColorClass(
                      comp?.firstArc?.state || 'incorrect'
                    )}`}
                  >
                    <span className="line-clamp-2 max-w-full leading-tight">
                      {comp?.firstArc?.value || '-'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
