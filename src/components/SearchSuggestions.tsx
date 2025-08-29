import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, Star } from 'lucide-react';

interface SearchSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
  className?: string;
}

export function SearchSuggestions({ onSuggestionClick, className = '' }: SearchSuggestionsProps) {
  const popularSearches = [
    'One Piece', 'Naruto', 'Attack on Titan', 'Demon Slayer', 'My Hero Academia',
    'Jujutsu Kaisen', 'Dragon Ball', 'Death Note', 'Fullmetal Alchemist',
    'Tokyo Ghoul', 'Hunter x Hunter', 'Bleach'
  ];

  const trendingSearches = [
    'Chainsaw Man', 'Spy x Family', 'Mob Psycho 100', 'Cyberpunk Edgerunners',
    'Bocchi the Rock', 'Blue Lock', 'Overlord'
  ];

  const recentSearches = [
    'Frieren', 'Solo Leveling', 'Dandadan', 'Wind Breaker'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-xl p-6 ${className}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Popular Searches */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-4 h-4 text-yellow-400" />
            <h3 className="font-semibold text-white">Popular</h3>
          </div>
          <div className="space-y-2">
            {popularSearches.slice(0, 6).map((search) => (
              <button
                key={search}
                onClick={() => onSuggestionClick(search)}
                className="block w-full text-left text-gray-300 hover:text-white hover:bg-gray-700/50 px-3 py-2 rounded-lg transition-colors text-sm"
              >
                {search}
              </button>
            ))}
          </div>
        </div>

        {/* Trending Searches */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <h3 className="font-semibold text-white">Trending</h3>
          </div>
          <div className="space-y-2">
            {trendingSearches.map((search) => (
              <button
                key={search}
                onClick={() => onSuggestionClick(search)}
                className="block w-full text-left text-gray-300 hover:text-white hover:bg-gray-700/50 px-3 py-2 rounded-lg transition-colors text-sm"
              >
                {search}
              </button>
            ))}
          </div>
        </div>

        {/* Recent Searches */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-blue-400" />
            <h3 className="font-semibold text-white">Recent</h3>
          </div>
          <div className="space-y-2">
            {recentSearches.map((search) => (
              <button
                key={search}
                onClick={() => onSuggestionClick(search)}
                className="block w-full text-left text-gray-300 hover:text-white hover:bg-gray-700/50 px-3 py-2 rounded-lg transition-colors text-sm"
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}