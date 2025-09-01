import React, { useEffect, useState, useCallback, useMemo, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Play,
  Info,
  Star,
  Calendar,
  Eye,
  Bookmark,
  Share2,
  RefreshCw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/Button';
import { JikanAnime } from '../lib/jikan';
import { formatScore, getPreferredTitle, truncateText } from '../lib/utils';

interface HeroSpotlightProps {
  animes: JikanAnime[];
  slideIntervalMs?: number;
  isLoading?: boolean;
  error?: any;
  onRetry?: () => void;
}

export const HeroSpotlight = memo(function HeroSpotlight({
  animes,
  slideIntervalMs = 8000,
  isLoading = false,
  error,
  onRetry,
}: HeroSpotlightProps) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-retry on error after a delay
  React.useEffect(() => {
    if (error && onRetry && !isLoading) {
      console.log('Auto-retrying hero spotlight in 5 seconds...');
      const timer = setTimeout(() => {
        console.log('Auto-retrying hero spotlight now');
        onRetry();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [error, onRetry, isLoading]);

  // Error State
  if (error && !isLoading) {
    return (
      <div className="relative h-[500px] md:h-[580px] overflow-hidden bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-white font-bold text-xl mb-3">Failed to Load Featured Content</h3>
          <p className="text-gray-400 mb-6">
            {error?.message?.includes('Rate limit') 
              ? 'Rate limit exceeded. Automatically retrying in a few seconds...'
              : 'Unable to load featured anime. Please check your connection and try again.'
            }
          </p>
          <div className="flex items-center justify-center gap-2 text-blue-400 mb-4">
            <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Retrying automatically...</span>
          </div>
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="gradient"
              className="shadow-glow flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Retry Now
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Loading State
  if (isLoading || !animes || animes.length === 0) {
    return (
      <div className="relative h-[500px] md:h-[580px] overflow-hidden bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700/50 to-transparent animate-pulse">
          <div className="h-full flex items-center px-8 md:px-12">
            <div className="max-w-3xl space-y-6">
              <div className="h-6 bg-gray-600 rounded w-48 animate-pulse"></div>
              <div className="h-12 bg-gray-600 rounded w-3/4 animate-pulse"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-600 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-600 rounded w-5/6 animate-pulse"></div>
                <div className="h-4 bg-gray-600 rounded w-4/6 animate-pulse"></div>
              </div>
              <div className="flex gap-4 mt-6">
                <div className="h-12 w-32 bg-gray-600 rounded-xl animate-pulse"></div>
                <div className="h-12 w-32 bg-gray-600 rounded-xl animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  useEffect(() => {
    if (!animes || animes.length <= 1 || !isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % animes.length);
    }, slideIntervalMs);

    return () => clearInterval(interval);
  }, [animes, slideIntervalMs, isAutoPlaying]);

  // Memoize current anime to prevent unnecessary re-renders
  const anime = useMemo(() => animes?.[currentIndex], [animes, currentIndex]);

  if (!animes || animes.length === 0) return null;

  const handleWatchClick = useCallback(() => {
    navigate(`/watch/anime/${anime.mal_id}`);
  }, [navigate, anime?.mal_id]);

  const handleDetailsClick = useCallback(() => {
    navigate(`/anime/${anime.mal_id}`);
  }, [navigate, anime?.mal_id]);

  const handleSlideChange = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, []);

  // Memoize computed values
  const truncatedTitle = useMemo(() => {
    if (!anime) return '';
    return truncateText(getPreferredTitle(anime), 25);
  }, [anime]);

  if (!anime) return null;

  return (
    <div className="relative h-[500px] md:h-[580px] overflow-hidden bg-black">
      {/* Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={anime.mal_id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${anime.images.jpg.large_image_url})`,
            }}
          />

          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div
        className="
          absolute inset-0 flex z-20
          items-end md:items-center   /* 👈 bottom on mobile, center on desktop */
      "
      >
        <div className="container mx-auto px-6 lg:px-8 pb-6 md:pb-0">
          <div className="max-w-3xl">
            {/* Spotlight Badge */}
            <motion.div
              key={`spotlight-badge-${anime.mal_id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-3"
            >
              <div className="inline-flex items-center gap-3 glass-effect px-4 py-2 rounded-full border border-white/20 shadow-md">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-xs sm:text-sm font-semibold text-white">
                  🔥 Featured Spotlight
                </span>
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              key={`title-${anime.mal_id}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-bold mb-3 leading-tight text-white drop-shadow-lg"
            >
              {truncatedTitle}
            </motion.h1>

            {/* Metadata */}
            <motion.div
              key={`meta-${anime.mal_id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center gap-2 mb-4 text-[11px] sm:text-xs md:text-sm text-gray-300"
            >
              {anime.score && (
                <div className="flex items-center gap-2 glass-effect px-3 py-1 rounded-full border border-yellow-500/30 shadow-inner">
                  <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-current" />
                  <span className="text-yellow-400 font-semibold">
                    {formatScore(anime.score)}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 glass-effect px-3 py-1 rounded-full border border-white/20">
                <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                <span className="font-medium">{anime.year || 'N/A'}</span>
              </div>

              {anime.episodes && (
                <div className="flex items-center gap-2 glass-effect px-3 py-1 rounded-full border border-white/20">
                  <Eye className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="font-medium">{anime.episodes} Episodes</span>
                </div>
              )}

              {/* Tags */}
              <div className="flex gap-1">
                <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full border border-green-500/30 font-semibold text-[10px]">
                  SUB
                </span>
                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30 font-semibold text-[10px]">
                  DUB
                </span>
                <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full border border-purple-500/30 font-semibold text-[10px]">
                  4K
                </span>
              </div>
            </motion.div>

            {/* Synopsis - desktop only */}
            {anime.synopsis && (
              <motion.p
                key={`synopsis-${anime.mal_id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="hidden md:block text-gray-300 text-sm md:text-base leading-relaxed mb-5 max-w-2xl drop-shadow-md"
              >
                {truncateText(anime.synopsis, 150)}
              </motion.p>
            )}

            {/* Action Buttons */}
            <motion.div
              key={`actions-${anime.mal_id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-wrap sm:flex-nowrap gap-3 mb-6"
            >
              <Button
                size="lg"
                variant="gradient"
                onClick={handleWatchClick}
                className="flex-1 sm:flex-none gap-2 shadow-glow hover:shadow-glow-lg text-xs sm:text-sm md:text-base"
                icon={<Play className="w-4 h-4 md:w-5 md:h-5" />}
              >
                Watch Now
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={handleDetailsClick}
                className="flex-1 sm:flex-none gap-2 glass-effect border-white/30 hover:bg-white/10 text-xs sm:text-sm md:text-base"
                icon={<Info className="w-4 h-4 md:w-5 md:h-5" />}
              >
                More Details
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="glass-effect hover:bg-white/10 aspect-square p-0"
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </motion.div>

            {/* Slide Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="flex gap-2"
            >
              {animes.map((_, index) => (
                <button
                  key={index}
                  onClick={useCallback(() => handleSlideChange(index), [handleSlideChange, index])}
                  className={`w-10 h-1 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-gradient-to-r from-primary-500 to-accent-500 shadow-lg'
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
});