import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { JikanAnime } from '../lib/jikan';
import { formatScore, getPreferredTitle, truncateText } from '../lib/utils';
import { useRecommendations } from '../hooks/useRecommendations';
import { useTopAiring, useTrending } from '../hooks/useAnimeData';
import { AnimeCard } from './AnimeCard'; // Import your AnimeCard component

interface RecommendationPropProps {
  animeId: number;
  className?: string;
}

export function RecommendationProp({
  animeId,
  className = '',
}: RecommendationPropProps) {
  const navigate = useNavigate();
  const { recommendations, isLoading, error, recommendationType } =
    useRecommendations(animeId);
  const { data: topAiring } = useTopAiring();
  const { data: trendingAnime } = useTrending();

  const handleAnimeClick = (anime: JikanAnime) => {
    navigate(`/anime/${anime.mal_id}`);
  };

  const getRecommendationTitle = () => {
    switch (recommendationType) {
      case 'related':
        return 'Related Anime';
      case 'jikan':
        return 'Recommended Anime';
      case 'genre':
        return 'Similar Anime';
      case 'top':
        return 'Top Rated Anime';
      default:
        return 'Popular Anime';
    }
  };

  const getRecommendationSubtitle = () => {
    switch (recommendationType) {
      case 'related':
        return 'Sequels, prequels, and spin-offs';
      case 'jikan':
        return 'Community recommended anime';
      case 'genre':
        return 'Based on similar genres';
      case 'top':
        return 'Most popular anime on MyAnimeList';
      default:
        return 'Trending and popular anime';
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div
        className={`bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 ${className}`}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] bg-gray-700 rounded-xl mb-3"></div>
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div
        className={`bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 ${className}`}
      >
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
            <ChevronRight className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-white font-semibold mb-2">
            Failed to Load Recommendations
          </h3>
          <p className="text-gray-400 text-sm">
            Please try refreshing the page or check back later.
          </p>
        </div>
      </div>
    );
  }

  // If no recommendations are available, fallback to top or trending
  if (!recommendations || recommendations.length === 0) {
    const fallbackRecommendations = topAiring || trendingAnime;

    return (
      <div
        className={`bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 ${className}`}
      >
        <div className="text-center py-8">
          <h3 className="text-white font-semibold mb-2">
            No Recommendations Found
          </h3>
          <p className="text-gray-400 text-sm">
            Sorry, we couldn't find any related or similar anime at this time.
          </p>
        </div>

        {/* Use top or trending anime as fallback */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {(fallbackRecommendations || [])
            .slice(0, 12)
            .map((anime: JikanAnime, index) => (
              <AnimeCard
                key={anime.mal_id}
                anime={anime}
                index={index}
                variant="poster"
              />
            ))}
        </div>
      </div>
    );
  }

  // Recommendations Grid
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden ${className}`}
    >
      <div className="p-6 border-b border-gray-700/50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">
              {getRecommendationTitle()}
            </h2>
            <p className="text-gray-400 text-sm">
              {getRecommendationSubtitle()}
            </p>
          </div>
          <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors flex items-center gap-1">
            View All
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Recommendations */}
      <div className="p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {recommendations.slice(0, 12).map((anime, index) => (
            <AnimeCard
              key={anime.mal_id}
              anime={anime}
              index={index}
              variant="poster"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
