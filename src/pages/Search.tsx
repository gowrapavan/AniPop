import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Search as SearchIcon,
  Filter,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { AnimeCard } from '../components/AnimeCard';
import { CardSkeleton } from '../components/Skeletons/CardSkeleton';
import { Button } from '../components/ui/Button';
import { useAnimeSearch } from '../hooks/useAnimeSearch';
import { JikanAnime } from '../lib/jikan';
import { SEOHead } from '../components/SEOHead';

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const type = searchParams.get('type') || '';
  const status = searchParams.get('status') || '';
  const genre = searchParams.get('genre') || '';

  const [searchInput, setSearchInput] = useState(query);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Memoize search parameters
  const searchParams_memo = useMemo(
    () => ({
      query,
      page,
      type,
      status,
      genre,
    }),
    [query, page, type, status, genre]
  );

  const { data, isLoading, error } = useAnimeSearch(searchParams_memo);

  // Sync input with query param
  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  // Handle form submit
  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchInput.trim()) {
        setSearchParams({
          q: searchInput.trim(),
          page: '1',
          ...(type && { type }),
          ...(status && { status }),
          ...(genre && { genre }),
        });
      }
    },
    [searchInput, type, status, genre, setSearchParams]
  );

  const handleFilterChange = useCallback(
    (filterType: string, value: string) => {
      const newParams = new URLSearchParams(searchParams);
      if (value) {
        newParams.set(filterType, value);
      } else {
        newParams.delete(filterType);
      }
      newParams.set('page', '1');
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('page', newPage.toString());
      setSearchParams(newParams);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [searchParams, setSearchParams]
  );

  const clearFilters = useCallback(() => {
    setSearchParams({ q: query, page: '1' });
  }, [query, setSearchParams]);

  const hasActiveFilters = useMemo(
    () => type || status || genre,
    [type, status, genre]
  );

  const searchResults = useMemo(() => data?.data ?? [], [data?.data]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <SEOHead
        title={query ? `Search Results for "${query}" - ANIPOP!` : 'Search Anime - Find Your Favorite Anime Series & Movies'}
        description={query ? `Search results for "${query}". Find anime series, movies, and shows matching your search query.` : 'Search through thousands of anime series and movies. Find your favorite anime by title, genre, or keyword and start watching instantly.'}
        keywords="anime search, find anime, anime database, search anime series, search anime movies"
        url={`https://anipop.netlify.app/search${query ? `?q=${encodeURIComponent(query)}` : ''}`}
        noIndex={!query} // Don't index empty search page
      />
      <Header />

      <div className="pt-16">
        {/* Search Header */}
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700">
          <div className="container mx-auto px-6 lg:px-8 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <h1 className="text-3xl font-bold mb-6 text-center">
                Search Anime
              </h1>

              {/* Search Form */}
              <form onSubmit={handleSearch} className="relative mb-6">
                <div className="flex">
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search for anime titles..."
                    className="flex-1 bg-black/50 border border-white/20 rounded-l-xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors backdrop-blur-sm text-lg"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowFilters(!showFilters)}
                    className="rounded-none border-l-0 border-white/20 hover:bg-white/10 bg-black/40 backdrop-blur-sm px-4"
                  >
                    <Filter className="w-5 h-5 text-gray-300" />
                  </Button>
                  <Button
                    type="submit"
                    variant="gradient"
                    className="rounded-l-none shadow-glow hover:shadow-glow-lg px-6"
                  >
                    <SearchIcon className="w-5 h-5" />
                  </Button>
                </div>
              </form>

              {/* Filters Panel */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 mb-6 border border-gray-700"
                  >
                    {/* filter dropdowns here */}
                    {hasActiveFilters && (
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <Button
                          onClick={clearFilters}
                          variant="outline"
                          size="sm"
                        >
                          Clear Filters
                        </Button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        {/* Search Results */}
        <div className="container mx-auto px-6 lg:px-8 py-8">
          {/* Loading */}
          {isLoading && (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6'
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
            <div className="text-center py-12 text-red-400">
              Failed to search anime. Please try again later.
            </div>
          )}

          {/* Results */}
          {!isLoading && !error && searchResults.length > 0 && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-8'
                    : 'space-y-4 mb-8'
                }
              >
                {searchResults.map((anime: JikanAnime, index: number) => (
                  <AnimeCard
                    key={anime.mal_id}
                    anime={anime}
                    index={index}
                    variant={viewMode === 'list' ? 'list' : 'poster'}
                  />
                ))}
              </motion.div>

              {/* Pagination here */}
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
