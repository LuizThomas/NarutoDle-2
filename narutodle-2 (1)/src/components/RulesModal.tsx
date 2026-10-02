import React from 'react';
import { HelpCircle, ArrowUp, ArrowDown, Check, Flame, X, Infinity as InfinityIcon } from 'lucide-react';

interface RulesModalProps {
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col">
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
          <HelpCircle className="w-6 h-6 text-orange-500" />
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-100 font-serif">
            Como Jogar o NarutoDle 2
          </h2>
        </div>

        <div className="overflow-y-auto space-y-5 text-sm text-neutral-300 pr-1 leading-relaxed">
          {/* Main concept */}
          <div className="p-3.5 rounded-xl bg-orange-950/20 border border-orange-800/40">
            <h3 className="font-bold text-orange-400 flex items-center gap-1.5 text-base mb-1">
              <InfinityIcon className="w-4 h-4" /> Partidas Infinitas Sem Limite Diário!
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300">
              Ao contrário de jogos tradicionais limitados a 1 partida por dia, no <strong>NarutoDle 2</strong> você pode jogar quantas partidas consecutivas quiser! Assim que acertar ou encerrar, basta clicar em "Nova Partida" para um novo desafio com algoritmos anti-repetição.
            </p>
          </div>

          {/* Color Indicators */}
          <div className="space-y-3">
            <h4 className="font-bold text-neutral-100 uppercase text-xs font-mono tracking-wider">
              Indicadores de Acerto (Modo Clássico)
            </h4>

            <div className="space-y-2">
              <div className="flex items-start gap-3 p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-800/50">
                <span className="w-6 h-6 rounded bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                  🟩
                </span>
                <div>
                  <div className="font-semibold text-emerald-300 text-xs">Correto (Match Exato)</div>
                  <div className="text-xs text-neutral-400">
                    O atributo do personagem palpitado é exatamente igual ao do personagem secreto.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-lg bg-amber-950/30 border border-amber-800/50">
                <span className="w-6 h-6 rounded bg-amber-600 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                  🟨
                </span>
                <div>
                  <div className="font-semibold text-amber-300 text-xs">Parcial</div>
                  <div className="text-xs text-neutral-400">
                    Compartilha uma das naturezas de chakra, clã relacionado, ou vínculo próximo.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-lg bg-neutral-950/40 border border-neutral-800">
                <span className="w-6 h-6 rounded bg-neutral-800 text-neutral-400 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                  ⬜
                </span>
                <div>
                  <div className="font-semibold text-neutral-300 text-xs">Incorreto</div>
                  <div className="text-xs text-neutral-400">
                    Nenhuma correspondência encontrada para aquele atributo.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Arrow Hints */}
          <div className="space-y-2">
            <h4 className="font-bold text-neutral-100 uppercase text-xs font-mono tracking-wider">
              Setas Numéricas (Idade, Altura, Peso)
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-neutral-950/60 border border-neutral-800 flex items-center gap-2">
                <span className="p-1 rounded bg-amber-500/20 text-amber-400 font-bold">
                  <ArrowUp className="w-4 h-4" />
                </span>
                <span>O valor do personagem secreto é <strong>MAIOR</strong>.</span>
              </div>
              <div className="p-2.5 rounded-lg bg-neutral-950/60 border border-neutral-800 flex items-center gap-2">
                <span className="p-1 rounded bg-amber-500/20 text-amber-400 font-bold">
                  <ArrowDown className="w-4 h-4" />
                </span>
                <span>O valor do personagem secreto é <strong>MENOR</strong>.</span>
              </div>
            </div>
          </div>

          {/* Game Modes */}
          <div className="space-y-2 pt-2 border-t border-neutral-800">
            <h4 className="font-bold text-neutral-100 uppercase text-xs font-mono tracking-wider">
              Modos de Jogo Disponíveis
            </h4>
            <ul className="text-xs space-y-1.5 list-disc pl-4 text-neutral-400">
              <li><strong className="text-neutral-200">Clássico:</strong> Adivinhe o ninja recebendo a tabela completa de atributos comparados.</li>
              <li><strong className="text-neutral-200">Jutsu:</strong> Descubra o dono da técnica secreta baseado em classificação, rank e descrição.</li>
              <li><strong className="text-neutral-200">Citação:</strong> Reconheça quem proferiu as falas mais icônicas da saga.</li>
              <li><strong className="text-neutral-200">Olho (Dojutsu):</strong> Adivinhe o personagem a partir do recorte focal de seus olhos.</li>
              <li><strong className="text-neutral-200">Silhueta:</strong> Identifique a sombra do guerreiro com dicas progressivas.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
