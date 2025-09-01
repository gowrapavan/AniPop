import React, { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { JikanAnime } from '../lib/jikan';
import { getPreferredTitle } from '../lib/utils';

interface TrendingSliderProps {
  animes: JikanAnime[];
  isLoading?: boolean;
  error?: any;
  onRetry?: () => void;
}

export const TrendingSlider = memo(function TrendingSlider({ 
  animes, 
  isLoading = false, 
  error, 
  onRetry 
}: TrendingSliderProps) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-retry on error after a delay
  React.useEffect(() => {
    if (error && onRetry && !isLoading) {
      console.log('Auto-retrying trending slider in 5 seconds...');
      const timer = setTimeout(() => {
        console.log('Auto-retrying trending slider now');
        onRetry();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [error, onRetry, isLoading]);

  // Error State
  if (error && !isLoading) {
    return (
      <div className="bg-gray-800/50 rounded-xl p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-white font-semibold mb-2">Failed to Load Trending</h3>
        <p className="text-gray-400 text-sm mb-4">
          Unable to fetch trending anime. Automatically retrying in a few seconds...
        </p>
        <div className="flex items-center justify-center gap-2 text-blue-400 text-sm mb-4">
          <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          <span>Retrying automatically...</span>
        </div>
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            size="sm"
            className="mx-auto flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Retry Now
          </Button>
        )}
      </div>
    );
  }

  // Loading State
  if (isLoading || !animes || animes.length === 0) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4 max-w-full">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="flex-shrink-0 w-32">
            <div className="aspect-[3/4] bg-gray-700 rounded-lg animate-pulse mb-2"></div>
            <div className="h-4 bg-gray-700 rounded animate-pulse mb-1"></div>
            <div className="h-3 bg-gray-700 rounded w-2/3 animate-pulse"></div>
          </div>
        ))}
      </div>
    );
  }
  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoPlaying || animes.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % animes.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, animes.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + animes.length) % animes.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, [animes.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % animes.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, [animes.length]);

  const handleAnimeClick = useCallback((anime: JikanAnime) => {
    navigate(`/anime/${anime.mal_id}`);
  }, [navigate]);

  if (!animes || animes.length === 0) return null;

  return (
    <div className="trending-slider relative overflow-x-hidden">
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide max-w-full">
        {animes.map((anime, index) => (
          <div
            key={anime.mal_id}
            className="flex-shrink-0 w-32 cursor-pointer group"
            onClick={() => handleAnimeClick(anime)}
          >
            <div className="relative">
              {/* Ranking Number */}
              <div className="absolute top-2 left-2 z-10">
                <div className="bg-black/80 backdrop-blur-sm rounded-lg px-2 py-1">
                  <span className="text-white text-xs font-bold">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* Anime Poster */}
              <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-800">
                <img
                  src={anime.images.jpg.image_url}
                  alt={getPreferredTitle(anime)}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
            </div>

            {/* Anime Title */}
            <div className="mt-2 overflow-hidden">
              <h4 className="text-white text-sm font-medium leading-tight group-hover:text-blue-400 transition-colors line-clamp-2">
                {getPreferredTitle(anime)}
              </h4>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none">
        <button
          onClick={goToPrevious}
          className="pointer-events-auto -ml-4 w-10 h-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={goToNext}
          className="pointer-events-auto -mr-4 w-10 h-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .trending-slider {
          max-width: 100%;
        }
      `}</style>
    </div>
  );
});