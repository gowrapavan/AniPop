import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Radio, Grid, List, Star, Calendar, Clock } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { AnimeCard } from '../components/AnimeCard';
import { CardSkeleton } from '../components/Skeletons/CardSkeleton';
import { Button } from '../components/ui/Button';
import { useTopAiring } from '../hooks/useAnimeData';
import { JikanAnime } from '../lib/jikan';
import { SEOHead } from '../components/SEOHead';

export function TopAiring() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('rank');

  const { data: airingAnime, isLoading, error, refetch } = useTopAiring();

  const sortedAnime = React.useMemo(() => {
    if (!airingAnime?.length) return [];
    
    const sorted = [...airingAnime];
    switch (sortBy) {
      case 'rank':
        return sorted.sort((a, b) => (a.rank || 0) - (b.rank || 0));
      case 'score':
        return sorted.sort((a, b) => (b.score || 0) - (a.score || 0));
      case 'popularity':
        return sorted.sort((a, b) => (a.popularity || 0) - (b.popularity || 0));
      case 'title':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return sorted;
    }
  }, [airingAnime, sortBy]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <SEOHead
        title="Top Airing Anime - Currently Broadcasting Anime Series"
        description="Watch the top currently airing anime series. Stay up-to-date with the latest episodes of ongoing anime shows, seasonal releases, and weekly anime broadcasts."
        keywords="airing anime, currently airing, ongoing anime, seasonal anime, weekly anime, latest anime episodes"
        url="https://anipop.netlify.app/top-airing"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Top Airing Anime",
          "description": "Currently airing anime series ranked by popularity",
          "url": "https://anipop.netlify.app/top-airing"
        }}
      />
      <Header />

      <div className="pt-16">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-green-900/50 via-blue-900/50 to-purple-900/50 border-b border-gray-700">
          <div className="container mx-auto px-6 lg:px-8 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <Radio className="w-8 h-8 text-green-400" />
                <h1 className="text-4xl font-bold">Top Airing Anime</h1>
              </div>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Currently broadcasting anime series ranked by popularity and ratings
              </p>
            </motion.div>
          </div>
        </div>

        {/* Controls */}
        <div className="container mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="rank">Top Ranked</option>
                  <option value="score">Highest Rated</option>
                  <option value="popularity">Most Popular</option>
                  <option value="title">A-Z</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">View:</span>
              <div className="flex gap-1 bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${
                    viewMode === 'grid'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${
                    viewMode === 'list'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Live Status Banner */}
          {!isLoading && airingAnime && airingAnime.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-500/30 rounded-xl p-4 mb-8"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <Clock className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Currently Broadcasting</h3>
                  <p className="text-gray-300 text-sm">
                    {airingAnime.length} anime series are currently airing with new episodes
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6'
                : 'space-y-4'
            }>
              {Array.from({ length: 20 }, (_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                <Radio className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Failed to Load Airing Anime</h3>
              <p className="text-gray-400 mb-4">
                {error?.message?.includes('Rate limit') 
                  ? 'Rate limit exceeded. Please wait a moment and try again.'
                  : 'Unable to fetch currently airing anime. Please check your connection and try again.'
                }
              </p>
              <div className="flex items-center justify-center gap-2 text-blue-400 text-sm mb-4">
                <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Retrying automatically...</span>
              </div>
              <Button
                onClick={() => refetch()}
                variant="outline"
              >
                Retry Now
              </Button>
            </div>
          )}

          {/* Airing Anime Grid */}
          {!isLoading && !error && sortedAnime.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6'
                  : 'space-y-4'
              }
            >
              {sortedAnime.map((anime: JikanAnime, index: number) => (
                <motion.div
                  key={anime.mal_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="relative"
                >
                  {/* Airing Status Badge */}
                  <div className="absolute top-2 right-2 z-10">
                    <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      LIVE
                    </div>
                  </div>

                  {/* Rank Badge */}
                  {anime.rank && anime.rank <= 50 && (
                    <div className="absolute top-2 left-2 z-10">
                      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                        #{anime.rank}
                      </div>
                    </div>
                  )}
                  
                  <AnimeCard
                    anime={anime}
                    index={index}
                    variant={viewMode === 'list' ? 'list' : 'poster'}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* No Results */}
          {!isLoading && !error && (!airingAnime || airingAnime.length === 0) && (
            <div className="text-center py-12">
              <Radio className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <h3 className="text-white font-semibold mb-2">No Airing Anime Found</h3>
              <p className="text-gray-400">
                No currently airing anime are available at the moment.
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}