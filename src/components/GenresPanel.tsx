import React, { useState, useCallback, memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag } from 'lucide-react';

const genres = [
  { name: 'Action', slug: 'action' },
  { name: 'Adventure', slug: 'adventure' },
  { name: 'Comedy', slug: 'comedy' },
  { name: 'Drama', slug: 'drama' },
  { name: 'Fantasy', slug: 'fantasy' },
  { name: 'Horror', slug: 'horror' },
  { name: 'Isekai', slug: 'isekai' },
  { name: 'Mecha', slug: 'mecha' },
  { name: 'Mystery', slug: 'mystery' },
  { name: 'Psychological', slug: 'psychological' },
  { name: 'Romance', slug: 'romance' },
  { name: 'Sci-Fi', slug: 'sci-fi' },
  { name: 'Shounen', slug: 'shounen' },
  { name: 'Slice of Life', slug: 'slice-of-life' },
  { name: 'Sports', slug: 'sports' },
  { name: 'Supernatural', slug: 'supernatural' },
  { name: 'Thriller', slug: 'thriller' },
  { name: 'Cars', slug: 'cars' },
  { name: 'Demons', slug: 'demons' },
  { name: 'Ecchi', slug: 'ecchi' },
  { name: 'Game', slug: 'game' },
  { name: 'Harem', slug: 'harem' },
  { name: 'Historical', slug: 'historical' },
  { name: 'Josei', slug: 'josei' },
  { name: 'Kids', slug: 'kids' },
  { name: 'Magic', slug: 'magic' },
  { name: 'Martial Arts', slug: 'martial-arts' },
  { name: 'Military', slug: 'military' },
  { name: 'Music', slug: 'music' },
  { name: 'Parody', slug: 'parody' },
  { name: 'Police', slug: 'police' },
  { name: 'Samurai', slug: 'samurai' },
  { name: 'School', slug: 'school' },
  { name: 'Seinen', slug: 'seinen' },
  { name: 'Shoujo', slug: 'shoujo' },
  { name: 'Space', slug: 'space' },
  { name: 'Super Power', slug: 'super-power' },
  { name: 'Vampire', slug: 'vampire' },
];

interface GenresPanelProps {
  className?: string;
}

export const GenresPanel = memo(function GenresPanel({
  className = '',
}: GenresPanelProps) {
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);

  const displayedGenres = useMemo(() => {
    return showAll ? genres : genres.slice(0, 20);
  }, [showAll]);

  const toggleShowAll = useCallback(() => {
    setShowAll((prev) => !prev);
  }, []);

  const handleGenreClick = useCallback((slug: string) => {
    navigate(`/genre/${slug}`);
  }, [navigate]);

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
              key={genre.slug}
              onClick={() => handleGenreClick(genre.slug)}
              className="px-3 py-1.5 bg-gray-700/50 hover:bg-blue-600/20 hover:border-blue-500 border border-gray-600 rounded-full text-gray-300 hover:text-blue-400 text-sm transition-all duration-200 hover:scale-105"
            >
              {genre.name}
            </button>
          ))}
        </div>

        <button
          onClick={toggleShowAll}
          className="w-full text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors py-2 border-t border-gray-700"
        >
          {showAll ? 'Show Less' : 'Show More'} →
        </button>
      </div>
    </div>
  );
});
