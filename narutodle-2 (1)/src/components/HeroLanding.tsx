import React from 'react';
import { Play, Sparkles, Flame, Eye, MessageSquareQuote, Shield, BookOpen } from 'lucide-react';
import { GameMode, DifficultyTier } from '../../server/types/character.js';

interface HeroLandingProps {
  onStartGame: (mode: GameMode, difficulty: DifficultyTier) => void;
  selectedMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  selectedDifficulty: DifficultyTier;
  onSelectDifficulty: (difficulty: DifficultyTier) => void;
  onOpenDatabook: () => void;
}

export const HeroLanding: React.FC<HeroLandingProps> = ({
  onStartGame,
  selectedMode,
  onSelectMode,
  selectedDifficulty,
  onSelectDifficulty,
  onOpenDatabook
}) => {
  const modes: { id: GameMode; name: string; desc: string; icon: any; image: string }[] = [
    {
      id: 'classic',
      name: 'Modo Clássico',
      desc: 'Compare atributos ninja detalhados a cada palpite até encontrar a resposta.',
      icon: Shield,
      image: '/src/assets/images/mode_databook_scroll_1790859438357.jpg'
    },
    {
      id: 'jutsu',
      name: 'Modo Jutsu',
      desc: 'Descubra qual shinobi domina a técnica secreta revelada no pergaminho.',
      icon: Flame,
      image: '/src/assets/images/mode_chakra_clash_1790859448797.jpg'
    },
    {
      id: 'eye',
      name: 'Modo Olho / Dojutsu',
      desc: 'Reconheça o ninja através do olhar, sharingan, byakugan ou marcas.',
      icon: Eye,
      image: '/src/assets/images/mode_dojutsu_eye_1790859458585.jpg'
    },
    {
      id: 'quote',
      name: 'Modo Citação',
      desc: 'Descubra a voz por trás das frases mais memoráveis do mundo shinobi.',
      icon: MessageSquareQuote,
      image: '/src/assets/images/mode_databook_scroll_1790859438357.jpg'
    },
    {
      id: 'silhouette',
      name: 'Modo Silhueta',
      desc: 'Identifique o personagem a partir de sua silhueta e porte físico.',
      icon: Sparkles,
      image: '/src/assets/images/mode_chakra_clash_1790859448797.jpg'
    }
  ];

  const difficulties: { id: DifficultyTier; label: string; desc: string }[] = [
    { id: 'easy', label: 'Fácil', desc: 'Shinobis principais e muito populares' },
    { id: 'normal', label: 'Normal', desc: 'Roster canônico equilibrado' },
    { id: 'hard', label: 'Difícil', desc: 'Personagens secundários e vilões profundos' },
    { id: 'expert', label: 'Especialista', desc: 'Mestres obscuros e ancestrais do Databook' }
  ];

  return (
    <div className="relative w-full overflow-hidden border-b border-neutral-800 bg-neutral-950">
      {/* Background Hero Banner with Dark Gradient Scrim */}
      <div className="absolute inset-0 z-0 opacity-25">
        <img
          src="/src/assets/images/hero_ninja_banner_1790859425661.jpg"
          alt="NarutoDle 2 Hero Banner"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 text-center">
        {/* Editorial Subtitle */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-950/60 border border-orange-700/50 text-orange-400 text-xs font-mono font-medium mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Partidas Infinitas · Sem Limite Diário · Roster Canônico</span>
        </div>

        {/* Hero Title */}
        <h1
          className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-400 to-red-500 tracking-tight mb-3"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          NARUTODLE 2
        </h1>

        <p className="text-base sm:text-xl text-neutral-300 font-medium max-w-2xl mx-auto mb-8 text-balance">
          QUANTOS VOCÊ CONSEGUE DESCOBRIR? Teste seu conhecimento supremo sobre os shinobis de Konoha e do mundo ninja.
        </p>

        {/* Mode Selector Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-4xl mx-auto mb-8">
          {modes.map(m => {
            const Icon = m.icon;
            const isSelected = selectedMode === m.id;

            return (
              <button
                key={m.id}
                onClick={() => onSelectMode(m.id)}
                className={`relative group p-3 rounded-xl border text-left transition-all duration-200 overflow-hidden ${
                  isSelected
                    ? 'bg-neutral-900 border-orange-500 ring-2 ring-orange-500/40 shadow-lg shadow-orange-950/50'
                    : 'bg-neutral-950/80 border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-900/60'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-orange-400' : 'text-neutral-400'}`} />
                  <span className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-neutral-300'}`}>
                    {m.name.replace('Modo ', '')}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 line-clamp-2 leading-tight">
                  {m.desc}
                </p>
              </button>
            );
          })}
        </div>

        {/* Difficulty Controls */}
        <div className="max-w-xl mx-auto mb-8 bg-neutral-900/60 p-1.5 rounded-xl border border-neutral-800/80 flex items-center justify-between gap-1">
          {difficulties.map(d => (
            <button
              key={d.id}
              onClick={() => onSelectDifficulty(d.id)}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
                selectedDifficulty === d.id
                  ? 'bg-orange-600 text-white font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Start Game CTA Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => onStartGame(selectedMode, selectedDifficulty)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold text-base sm:text-lg rounded-xl shadow-xl shadow-orange-950/60 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>COMEÇAR A JOGAR</span>
          </button>

          <button
            onClick={onOpenDatabook}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 font-semibold text-sm rounded-xl transition-colors"
          >
            <BookOpen className="w-4 h-4 text-orange-400" />
            <span>Explorar Databook</span>
          </button>
        </div>
      </div>
    </div>
  );
};
