import React, { useState, useEffect } from 'react';
import { BookOpen, Search, X, Shield, Zap, Sparkles } from 'lucide-react';
import { NinjaAvatar } from './NinjaAvatar.js';
import { apiClient } from '../services/apiClient.js';

interface DatabookModalProps {
  onClose: () => void;
}

export const DatabookModal: React.FC<DatabookModalProps> = ({ onClose }) => {
  const [characters, setCharacters] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('ALL');
  const [selectedChar, setSelectedChar] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.getAllCharacters()
      .then(d => {
        setCharacters(d || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const villages = ['ALL', 'Konohagakure', 'Sunagakure', 'Kirigakure', 'Kumogakure', 'Iwagakure', 'Amegakure', 'Otogakure'];

  const filtered = characters.filter(c => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.clan.toLowerCase().includes(search.toLowerCase());
    const matchVillage = selectedVillage === 'ALL' || c.village.includes(selectedVillage);
    return matchSearch && matchVillage;
  });

  const handleInspect = async (id: string) => {
    try {
      const char = await apiClient.getCharacterById(id);
      if (char) {
        setSelectedChar(char);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors z-10"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-2.5 mb-4">
          <BookOpen className="w-6 h-6 text-orange-500" />
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-100 font-serif">
            Pergaminhos do Databook Ninja
          </h2>
          <span className="text-xs font-mono text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded ml-2">
            {characters.length} Shinobis Catalogados
          </span>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Pesquisar por nome ou clã..."
              className="w-full pl-9 pr-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full text-xs">
            {villages.map(v => (
              <button
                key={v}
                onClick={() => setSelectedVillage(v)}
                className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  selectedVillage === v
                    ? 'bg-orange-600 text-white font-semibold'
                    : 'bg-neutral-950 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
                }`}
              >
                {v === 'ALL' ? 'Todas as Vilas' : v.replace('gakure', '')}
              </button>
            ))}
          </div>
        </div>

        {/* Content Body: Grid or Selected Character */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-4 pr-1">
          {/* Character List */}
          <div className="md:col-span-2 space-y-2 overflow-y-auto max-h-[55vh] pr-1">
            {filtered.map(char => (
              <div
                key={char.id}
                onClick={() => handleInspect(char.id)}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                  selectedChar?.id === char.id
                    ? 'bg-neutral-800 border-orange-500/80 shadow-md'
                    : 'bg-neutral-950/60 border-neutral-800/80 hover:bg-neutral-800/50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <NinjaAvatar src={char.image} name={char.name} size="sm" />
                  <div className="min-w-0">
                    <div className="font-semibold text-sm text-neutral-200 truncate">
                      {char.name}
                    </div>
                    <div className="text-xs text-neutral-400 truncate">
                      {char.village} · {char.clan}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-right">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-900 text-amber-300 border border-neutral-800">
                    {char.rank}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Character Detail Inspector Pane */}
          <div className="bg-neutral-950/90 border border-neutral-800/90 rounded-xl p-4 overflow-y-auto max-h-[55vh] space-y-4">
            {selectedChar ? (
              <>
                <div className="text-center">
                  <NinjaAvatar
                    src={selectedChar.portrait}
                    name={selectedChar.name}
                    size="lg"
                    className="mx-auto mb-2 border-2 border-orange-500/60"
                  />
                  <h3 className="font-bold text-base text-neutral-100">{selectedChar.name}</h3>
                  <p className="text-xs text-orange-400 font-mono">{selectedChar.japaneseName}</p>
                </div>

                <div className="text-xs space-y-2 font-mono divide-y divide-neutral-900">
                  <div className="flex justify-between py-1">
                    <span className="text-neutral-400">Vila:</span>
                    <span className="text-neutral-200 font-semibold">{selectedChar.village}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-neutral-400">Clã:</span>
                    <span className="text-neutral-200 font-semibold">{selectedChar.clan}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-neutral-400">Rank:</span>
                    <span className="text-amber-400 font-semibold">{selectedChar.rank}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-neutral-400">Altura / Peso:</span>
                    <span className="text-neutral-200">
                      {selectedChar.height ? `${selectedChar.height}cm` : '?'} /{' '}
                      {selectedChar.weight ? `${selectedChar.weight}kg` : '?'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-neutral-400">Idade:</span>
                    <span className="text-neutral-200">{selectedChar.age || '?'} anos</span>
                  </div>
                  <div className="py-1">
                    <span className="text-neutral-400 block mb-1">Chakra:</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedChar.chakraNature?.map((cn: string) => (
                        <span key={cn} className="px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 rounded text-[10px] text-blue-300">
                          {cn}
                        </span>
                      ))}
                    </div>
                  </div>
                  {selectedChar.master && (
                    <div className="flex justify-between py-1">
                      <span className="text-neutral-400">Mestre:</span>
                      <span className="text-neutral-200">{selectedChar.master}</span>
                    </div>
                  )}
                  {selectedChar.firstArc && (
                    <div className="flex justify-between py-1">
                      <span className="text-neutral-400">Primeiro Arco:</span>
                      <span className="text-neutral-200 truncate max-w-[140px]">{selectedChar.firstArc}</span>
                    </div>
                  )}
                </div>

                {selectedChar.quotes && selectedChar.quotes.length > 0 && (
                  <div className="pt-2 border-t border-neutral-900 text-xs italic text-neutral-300 bg-neutral-900/50 p-2.5 rounded-lg border border-neutral-800">
                    "{selectedChar.quotes[0].quote}"
                  </div>
                )}
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-500 text-xs">
                <Sparkles className="w-8 h-8 text-neutral-700 mb-2" />
                <span>Selecione um shinobi na lista ao lado para inspecionar os registros canônicos do Databook.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
