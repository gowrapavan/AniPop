import React, { useState } from 'react';
import { Tag } from 'lucide-react';

const genres = [
  'Action', 'Adventure', 'Cars', 'Comedy', 'Dementia', 'Demons', 'Drama', 'Ecchi', 
  'Fantasy', 'Game', 'Harem', 'Historical', 'Horror', 'Isekai', 'Josei', 'Kids', 
  'Magic', 'Martial Arts', 'Mecha', 'Military', 'Music', 'Mystery', 'Parody', 
  'Police', 'Psychological', 'Romance', 'Samurai', 'School', 'Sci-Fi', 'Seinen', 
  'Shoujo', 'Shoujo Ai', 'Shounen', 'Shounen Ai', 'Slice of Life', 'Space', 
  'Sports', 'Super Power', 'Supernatural', 'Thriller', 'Vampire'
];

interface GenresPanelProps {
  className?: string;
}

export function GenresPanel({ className = '' }: GenresPanelProps) {
  const [showAll, setShowAll] = useState(false);
  const displayedGenres = showAll ? genres : genres.slice(0, 20);

  return (
    <div className={`bg-[#1a1a1a] rounded-xl overflow-hidden ${className}`}>
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-blue-400" />
          <h3 className="text-white font-semibold">Genres</h3>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {displayedGenres.map((genre) => (
            <button
              key={genre}
              className="px-3 py-1.5 bg-gray-700/50 hover:bg-blue-600/20 hover:border-blue-500 border border-gray-600 rounded-full text-gray-300 hover:text-blue-400 text-sm transition-all duration-200 hover:scale-105"
            >
              {genre}
            </button>
          ))}
        </div>
        
        <button 
          onClick={() => setShowAll(!showAll)}
          className="w-full text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors py-2 border-t border-gray-700"
        >
          {showAll ? 'Show Less' : 'Show More'} →
        </button>
      </div>
    </div>
  );
}