import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { JikanAnime } from '../lib/jikan';
import { getPreferredTitle } from '../lib/utils';

interface TrendingSliderProps {
  animes: JikanAnime[];
}

export function TrendingSlider({ animes }: TrendingSliderProps) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoPlaying || animes.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % animes.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, animes.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + animes.length) % animes.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % animes.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const handleAnimeClick = (anime: JikanAnime) => {
    navigate(`/anime/${anime.mal_id}`);
  };

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
}