import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Film, Grid, List } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { AnimeCard } from '../components/AnimeCard';
import { CardSkeleton } from '../components/Skeletons/CardSkeleton';
import { Button } from '../components/ui/Button';
import { JikanAnime } from '../lib/jikan';
import { useSearchParams } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';


export function Movies() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('score');
  const [movies, setMovies] = useState<JikanAnime[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sync page with URL
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;

  // Fetch movies (stable endpoint)
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch(
          `https://api.jikan.moe/v4/top/anime?type=movie&page=${page}&limit=24`
        );
        const json = await res.json();

        setMovies(json?.data || []);
        setTotalPages(json?.pagination?.last_visible_page || 1);
      } catch (err) {
        console.error(err);
        setError('Failed to load movies.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [page]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setSearchParams({ page: String(newPage) }); // ✅ updates URL
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sortedMovies = useMemo(() => {
    if (!movies.length) return [];

    const sorted = [...movies];
    switch (sortBy) {
      case 'score':
        return sorted.sort((a, b) => (b.score || 0) - (a.score || 0));
      case 'year':
        return sorted.sort((a, b) => (b.year || 0) - (a.year || 0));
      case 'popularity':
        return sorted.sort((a, b) => (a.popularity || 0) - (b.popularity || 0));
      case 'title':
        return sorted.sort((a, b) =>
          (a.title || '').localeCompare(b.title || '')
        );
      default:
        return sorted;
    }
  }, [movies, sortBy]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
        <SEOHead
        title="Anime Movies - Watch Latest Anime Films Online Free"
        description="Discover and watch the best anime movies online for free. From Studio Ghibli classics to latest anime films, stream high-quality anime movies with subtitles and dubbing."
        keywords="anime movies, anime films, Studio Ghibli, anime cinema, watch anime movies online, free anime movies"
        url="https://anipop.netlify.app/movies"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Anime Movies",
          "description": "Collection of anime movies available for streaming",
          "url": "https://anipop.netlify.app/movies",
          "mainEntity": {
            "@type": "ItemList",
            "name": "Anime Movies Collection"
          }
        }}
      />
      <Header />

      <div className="pt-16">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700">
          <div className="container mx-auto px-6 lg:px-8 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <Film className="w-8 h-8 text-blue-400" />
                <h1 className="text-4xl font-bold">Anime Movies</h1>
              </div>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Discover the best anime movies from epic adventures to
                heartwarming stories
              </p>
            </motion.div>
          </div>
        </div>

        {/* Controls */}
        <div className="container mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="score">Highest Rated</option>
                <option value="year">Newest</option>
                <option value="popularity">Most Popular</option>
                <option value="title">A-Z</option>
              </select>
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

          {/* Results Count */}
          {!isLoading && movies.length > 0 && (
            <p className="text-gray-400 text-sm mb-6">
              Showing {movies.length} anime movies
            </p>
          )}

          {/* Loading */}
          {isLoading && (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6'
                  : 'space-y-4'
              }
            >
              {Array.from({ length: 12 }, (_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                <Film className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">
                Failed to Load Movies
              </h3>
              <p className="text-gray-400 mb-4">
                Unable to fetch anime movies. Please try again later.
              </p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Retry
              </Button>
            </div>
          )}

          {/* Movies Grid */}
          {!isLoading && !error && sortedMovies.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6 mb-8'
                  : 'space-y-4 mb-8'
              }
            >
              {sortedMovies.map((anime: JikanAnime, index: number) => (
                <AnimeCard
                  key={anime.mal_id}
                  anime={anime}
                  index={index}
                  variant={viewMode === 'list' ? 'list' : 'poster'}
                />
              ))}
            </motion.div>
          )}

          {/* Pagination */}
          {!isLoading && !error && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
                className="flex items-center gap-2"
              >
                Previous
              </Button>

              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, page - 2) + i;
                  if (pageNum > totalPages) return null;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        pageNum === page
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages}
                className="flex items-center gap-2"
              >
                Next
              </Button>
            </div>
          )}

          {/* No Results */}
          {!isLoading && !error && movies.length === 0 && (
            <div className="text-center py-12">
              <Film className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <h3 className="text-white font-semibold mb-2">No Movies Found</h3>
              <p className="text-gray-400">
                No anime movies are available at the moment.
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
