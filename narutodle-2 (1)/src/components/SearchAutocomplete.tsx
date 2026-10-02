import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { NinjaAvatar } from './NinjaAvatar.js';
import { apiClient } from '../services/apiClient.js';

export interface SearchCharacterItem {
  id: string;
  name: string;
  japaneseName: string;
  aliases?: string[];
  village: string;
  clan: string;
  rank: string;
  image: string;
  difficultyTier?: string;
}

interface SearchAutocompleteProps {
  onSelectCharacter: (characterId: string) => void;
  disabledGuessedIds: string[];
  disabled?: boolean;
  placeholder?: string;
}

export const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({
  onSelectCharacter,
  disabledGuessedIds,
  disabled = false,
  placeholder = 'Digite o nome de um shinobi (ex: Naruto, Kakashi, Sasuke...)'
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchCharacterItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const characters = await apiClient.searchCharacters(query, 12);
        setResults(characters || []);
        setIsOpen(true);
        setSelectedIndex(0);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = results[selectedIndex];
      if (selected && !disabledGuessedIds.includes(selected.id)) {
        handleSelect(selected.id);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSelect = (charId: string) => {
    onSelectCharacter(charId);
    setQuery('');
    setIsOpen(false);
    setResults([]);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      <div className="relative flex items-center">
        <div className="absolute left-4 pointer-events-none text-orange-500/80">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          disabled={disabled}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? 'Partida finalizada. Inicie uma nova!' : placeholder}
          className="w-full pl-12 pr-4 py-3.5 bg-neutral-900/90 border border-neutral-700/80 focus:border-orange-500 rounded-xl text-neutral-100 placeholder:text-neutral-500 text-sm sm:text-base outline-none shadow-lg shadow-black/40 transition-all focus:ring-2 focus:ring-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {/* Dropdown Suggestions */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 max-h-80 overflow-y-auto bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl z-50 divide-y divide-neutral-800/60 backdrop-blur-xl">
          {results.map((char, index) => {
            const isAlreadyGuessed = disabledGuessedIds.includes(char.id);
            const isHighlighted = index === selectedIndex;

            return (
              <button
                key={char.id}
                type="button"
                disabled={isAlreadyGuessed}
                onClick={() => handleSelect(char.id)}
                className={`w-full flex items-center justify-between p-3 text-left transition-colors ${
                  isAlreadyGuessed
                    ? 'opacity-40 cursor-not-allowed bg-neutral-950/30'
                    : isHighlighted
                    ? 'bg-neutral-800/90 text-white'
                    : 'hover:bg-neutral-800/50 text-neutral-200'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <NinjaAvatar src={char.image} name={char.name} size="sm" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm truncate text-neutral-100">{char.name}</span>
                      <span className="text-xs text-neutral-400 font-normal">({char.japaneseName})</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-neutral-400 truncate mt-0.5">
                      <span>{char.village}</span>
                      <span>·</span>
                      <span>{char.clan}</span>
                      <span>·</span>
                      <span className="text-orange-400/90 font-medium">{char.rank}</span>
                    </div>
                  </div>
                </div>

                {isAlreadyGuessed && (
                  <span className="text-[11px] text-neutral-400 font-mono italic shrink-0 ml-2">
                    Já palpitado
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
