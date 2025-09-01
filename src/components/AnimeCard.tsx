import React, { useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Play, Plus, Eye, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { JikanAnime } from '../lib/jikan';
import { formatScore, getPreferredTitle, truncateText } from '../lib/utils';
import { useState, useEffect } from 'react';

// Hook to detect if screen width < breakpoint
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
}

interface AnimeCardProps {
  anime: JikanAnime;
  index?: number;
  variant?: 'poster' | 'list' | 'featured';
  showProgress?: boolean;
}

export const AnimeCard = memo(function AnimeCard({
  anime,
  index = 0,
  variant = 'poster',
  showProgress = false,
}: AnimeCardProps) {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    navigate(`/anime/${anime.mal_id}`);
  }, [navigate, anime.mal_id]);

  const typeColors: Record<string, string> = {
    TV: 'bg-blue-600',
    Movie: 'bg-red-600',
    OVA: 'bg-purple-600',
    ONA: 'bg-pink-600',
    Special: 'bg-green-600',
    Music: 'bg-yellow-600',
  };

  const handleWatchClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      navigate(`/watch/anime/${anime.mal_id}`);
    },
    [navigate, anime.mal_id]
  );

  const handleAddToList = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      console.log('Added to list:', anime.title);
    },
    [anime.title]
  );

  const preferredTitle = useCallback(() => getPreferredTitle(anime), [anime]);
  const isMobile = useIsMobile();

  const truncatedTitle = useCallback(() => {
    if (variant === 'list') {
      return truncateText(preferredTitle(), isMobile ? 32 : 35);
    }
    if (variant === 'poster') {
      return truncateText(preferredTitle(), isMobile ? 20 : 17);
    }
    return preferredTitle();
  }, [preferredTitle, variant, isMobile]);

  /** ---------------- LIST VARIANT ---------------- */
  if (variant === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className="group flex gap-4 p-4 glass-effect rounded-lg cursor-pointer hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-primary-500/30"
        onClick={handleClick}
      >
        <div className="relative w-16 h-20 flex-shrink-0 rounded overflow-hidden">
          <img
            src={anime.images.jpg.image_url}
            alt={preferredTitle()}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleWatchClick}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center shadow-glow">
              <Play className="w-4 h-4 text-white ml-0.5" />
            </div>
          </motion.button>
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white text-sm leading-tight mb-2 group-hover:text-primary-400 transition-colors line-clamp-2">
            {truncatedTitle()}
          </h4>

          <div className="flex items-center gap-3 text-xs text-dark-500 mb-2">
            {anime.score && (
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="text-yellow-400 font-medium">
                  {formatScore(anime.score)}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{anime.year || 'N/A'}</span>
            </div>
            {anime.episodes && (
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>{anime.episodes} eps</span>
              </div>
            )}
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-md font-medium">
              SUB
            </span>
            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-md font-medium">
              DUB
            </span>
            <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-md font-medium">
              HD
            </span>
          </div>
        </div>
      </motion.div>
    );
  }

  /** ---------------- FEATURED VARIANT ---------------- */
  if (variant === 'featured') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="group relative aspect-[16/9] rounded-3xl overflow-hidden cursor-pointer card-hover"
        onClick={handleClick}
      >
        <img
          src={anime.images.jpg.large_image_url}
          alt={getPreferredTitle(anime)}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
            {truncateText(getPreferredTitle(anime), 40)}
          </h3>

          <div className="flex items-center gap-3 mb-3 text-sm text-dark-300">
            {anime.score && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-yellow-400 font-semibold">
                  {formatScore(anime.score)}
                </span>
              </div>
            )}
            <span>• {anime.year || 'N/A'}</span>
            {anime.episodes && <span>• {anime.episodes} eps</span>}
          </div>

          {/* Badges */}
          <div className="flex gap-2 mb-4">
            <span className="px-2 py-1 bg-green-500/80 text-white text-xs rounded-md font-medium">
              SUB
            </span>
            <span className="px-2 py-1 bg-blue-500/80 text-white text-xs rounded-md font-medium">
              DUB
            </span>
            <span className="px-2 py-1 bg-purple-500/80 text-white text-xs rounded-md font-medium">
              HD
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleWatchClick}
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl font-medium shadow-glow"
            >
              <Play className="w-4 h-4" /> Watch
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToList}
              className="flex items-center gap-2 glass-effect text-white px-4 py-2 rounded-xl font-medium hover:bg-white/20"
            >
              <Plus className="w-4 h-4" /> List
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  /** ---------------- POSTER VARIANT (default) ---------------- */
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative rounded-lg overflow-hidden cursor-pointer border border-white/10 hover:border-primary-500/30 flex flex-col bg-dark-900"
      onClick={handleClick}
    >
      {/* Poster Section */}
      <div className="relative h-[250px] overflow-hidden">
        <img
          src={anime.images.jpg.large_image_url}
          alt={preferredTitle()}
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />

        {/* Type Badge */}
        {anime.type && (
          <div
            className={`absolute top-0 right-0 px-2 py-0.5 text-white text-[10px] rounded font-semibold ${
              typeColors[anime.type] || 'bg-gray-600'
            }`}
          >
            {anime.type}
          </div>
        )}

        {/* Episode + Dub/Sub */}
        <div className="absolute bottom-1 left-2 flex gap-1">
          {anime.episodes && (
            <span className="px-2 py-0.5 bg-purple-600 text-white text-[10px] rounded font-medium">
              Ep {anime.episodes}
            </span>
          )}
          <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] rounded font-medium">
            Dub
          </span>
          <span className="px-2 py-0.5 bg-yellow-500 text-black text-[10px] rounded font-medium">
            Sub
          </span>
        </div>
      </div>

      {/* Title Section */}
      <div className="p-3">
        <h3 className="font-semibold text-white text-sm leading-tight group-hover:text-primary-400 transition-colors line-clamp-2">
          {truncatedTitle()}
        </h3>
      </div>
    </motion.div>
  );
});
