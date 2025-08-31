import React, { useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Play, Plus, Eye, Clock, Calendar, Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';
import { JikanAnime } from '../lib/jikan';
import { formatScore, getPreferredTitle, truncateText } from '../lib/utils';

interface AnimeCardProps {
  anime: JikanAnime;
  index?: number;
  variant?: 'poster' | 'list' | 'episode' | 'featured';
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

  const handleWatchClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/watch/anime/${anime.mal_id}`);
  }, [navigate, anime.mal_id]);

  const handleAddToList = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Added to list:', anime.title);
  }, [anime.title]);

  // Memoize computed values
  const preferredTitle = useCallback(() => getPreferredTitle(anime), [anime]);
  const truncatedTitle = useCallback(() => truncateText(preferredTitle(), variant === 'list' ? 35 : 45), [preferredTitle, variant]);

  if (variant === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className="group flex gap-4 p-4 glass-effect rounded-2xl cursor-pointer hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-primary-500/30"
        onClick={handleClick}
      >
        <div className="relative w-16 h-20 flex-shrink-0 rounded-xl overflow-hidden">
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

          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30 font-medium">
              SUB
            </span>
            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full border border-blue-500/30 font-medium">
              DUB
            </span>
            <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full border border-purple-500/30 font-medium">
              HD
            </span>
          </div>

          {showProgress && (
            <div className="w-full bg-dark-200 rounded-full h-1.5 mt-3">
              <div
                className="bg-gradient-to-r from-primary-500 to-accent-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: '60%' }}
              />
            </div>
          )}
        </div>
      </motion.div>
    );
  }

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
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="text-xl font-bold text-white mb-2 text-shadow">
              {truncateText(getPreferredTitle(anime), 40)}
            </h3>

            <div className="flex items-center gap-3 mb-4">
              {anime.score && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-yellow-400 font-semibold">
                    {formatScore(anime.score)}
                  </span>
                </div>
              )}
              <span className="text-dark-300">•</span>
              <span className="text-dark-300">{anime.year}</span>
              {anime.episodes && (
                <>
                  <span className="text-dark-300">•</span>
                  <span className="text-dark-300">{anime.episodes} eps</span>
                </>
              )}
            </div>

            <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleWatchClick}
                className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl font-medium shadow-glow transition-all duration-300"
              >
                <Play className="w-4 h-4" />
                Watch Now
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToList}
                className="flex items-center gap-2 glass-effect text-white px-4 py-2 rounded-xl font-medium hover:bg-white/20 transition-all duration-300"
              >
                <Plus className="w-4 h-4" />
                Add to List
              </motion.button>
            </div>
          </div>
        </div>

        {/* Quality badges */}
        <div className="absolute top-4 right-4 flex gap-2">
          <span className="px-2 py-1 bg-purple-500/90 text-white text-xs rounded-lg font-bold backdrop-blur-sm">
            HD
          </span>
          {anime.rank && anime.rank <= 10 && (
            <span className="px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-xs rounded-lg font-bold">
              TOP {anime.rank}
            </span>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative glass-effect rounded-2xl overflow-hidden cursor-pointer card-hover border border-white/10 hover:border-primary-500/30"
      onClick={handleClick}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={anime.images.jpg.large_image_url}
          alt={preferredTitle()}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Action buttons */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleWatchClick}
              className="w-12 h-12 bg-primary-600 hover:bg-primary-700 text-white rounded-full flex items-center justify-center shadow-glow transition-all duration-300"
            >
              <Play className="w-5 h-5 ml-0.5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToList}
              className="w-12 h-12 glass-dark text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300"
            >
              <Plus className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Quality badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1">
          <span className="px-2 py-1 bg-purple-500/90 text-white text-xs rounded-lg font-bold backdrop-blur-sm">
            HD
          </span>
          {anime.rank && anime.rank <= 100 && (
            <span className="px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-xs rounded-lg font-bold text-center">
              #{anime.rank}
            </span>
          )}
        </div>

        {/* Episode count */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex gap-1">
              <span className="px-2 py-1 bg-green-500/90 text-white text-[8px] rounded-md font-medium backdrop-blur-sm">
                SUB
              </span>
              <span className="px-2 py-1 bg-blue-500/90 text-white text-[8px] rounded-md font-medium backdrop-blur-sm">
                DUB
              </span>
            </div>
            {anime.episodes && (
              <span className="px-2 py-1 glass-dark text-white rounded-md font-medium backdrop-blur-sm">
                {anime.episodes}
              </span>
            )}
          </div>
        </div>

        {showProgress && (
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <div className="w-full bg-dark-200/50 rounded-full h-1.5 backdrop-blur-sm">
              <div
                className="bg-gradient-to-r from-primary-500 to-accent-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: '60%' }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-white text-[13px] leading-tight group-hover:text-primary-400 transition-colors duration-300 line-clamp-2">
          {truncatedTitle()}
        </h3>

        <div className="flex items-center justify-between text-[11px] text-dark-500">
          <div className="flex items-center gap-2">
            <span className="font-medium">TV</span>
            <span>•</span>
            <span>{anime.year || 'N/A'}</span>
          </div>
          {anime.score && (
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span className="text-yellow-400 font-medium">
                {formatScore(anime.score)}
              </span>
            </div>
          )}
        </div>

        {anime.genres?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {anime.genres.slice(0, 2).map((genre) => (
              <span
                key={genre.mal_id}
                className="px-2 py-0.5 bg-dark-200/50 text-dark-400 text-[8px] rounded-full hover:bg-primary-500/20 hover:text-primary-400 transition-all duration-300 cursor-pointer"
              >
                {genre.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
});
