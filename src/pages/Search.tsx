import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Filter, Grid, List, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { AnimeCard } from '../components/AnimeCard';
import { CardSkeleton } from '../components/Skeletons/CardSkeleton';
import { Button } from '../components/ui/Button';
import { useAnimeSearch } from '../hooks/useAnimeSearch';
import { JikanAnime } from '../lib/jikan';

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

  const { data, isLoading, error } = useAnimeSearch({
    query,
    page,
    type,
    status,
    genre,
  });

  // Update search input when URL changes
  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
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
  };

  const handleFilterChange = (filterType: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(filterType, value);
    } else {
      newParams.delete(filterType);
    }
    newParams.set('page', '1'); // Reset to first page
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchParams({ q: query, page: '1' });
  };

  const hasActiveFilters = type || status || genre;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Type
                        </label>
                        <select
                          value={type}
                          onChange={(e) => handleFilterChange('type', e.target.value)}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                        >
                          <option value="">All Types</option>
                          <option value="tv">TV Series</option>
                          <option value="movie">Movies</option>
                          <option value="ova">OVA</option>
                          <option value="special">Special</option>
                          <option value="ona">ONA</option>
                          <option value="music">Music</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Status
                        </label>
                        <select
                          value={status}
                          onChange={(e) => handleFilterChange('status', e.target.value)}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                        >
                          <option value="">All Status</option>
                          <option value="airing">Currently Airing</option>
                          <option value="complete">Completed</option>
                          <option value="upcoming">Upcoming</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Genre
                        </label>
                        <select
                          value={genre}
                          onChange={(e) => handleFilterChange('genre', e.target.value)}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                        >
                          <option value="">All Genres</option>
                          <option value="1">Action</option>
                          <option value="2">Adventure</option>
                          <option value="4">Comedy</option>
                          <option value="8">Drama</option>
                          <option value="10">Fantasy</option>
                          <option value="14">Horror</option>
                          <option value="22">Romance</option>
                          <option value="24">Sci-Fi</option>
                          <option value="27">Shounen</option>
                          <option value="30">Sports</option>
                        </select>
                      </div>
                    </div>
                    
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
          {/* Results Header */}
          {query && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Search Results for "{query}"
                </h2>
                {data && (
                  <p className="text-gray-400">
                    Found {data.pagination?.items?.total || 0} results
                    {data.pagination?.current_page && data.pagination?.last_visible_page && (
                      <span> • Page {data.pagination.current_page} of {data.pagination.last_visible_page}</span>
                    )}
                  </p>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">View:</span>
                <div className="flex bg-gray-800 rounded-lg p-1">
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
          )}

          {/* Loading State */}
          {isLoading && (
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6'
                : 'space-y-4'
            }>
              {Array.from({ length: 12 }, (_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
                <Search className="w-12 h-12 text-red-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-red-400">Search Error</h3>
              <p className="text-gray-400 mb-6">
                Failed to search anime. Please try again later.
              </p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Try Again
              </Button>
            </motion.div>
          )}

          {/* No Results */}
          {!isLoading && !error && data && data.data.length === 0 && query && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-700 rounded-full flex items-center justify-center">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">No Results Found</h3>
              <p className="text-gray-400 mb-6">
                No anime found for "{query}". Try different keywords or check your spelling.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => {
                    setSearchInput('');
                    setSearchParams({});
                  }}
                  variant="outline"
                >
                  Clear Search
                </Button>
                <Button
                  onClick={() => navigate('/')}
                  variant="gradient"
                >
                  Browse Popular Anime
                </Button>
              </div>
            </motion.div>
          )}

          {/* Search Results */}
          {!isLoading && !error && data && data.data.length > 0 && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-8'
                    : 'space-y-4 mb-8'
                }
              >
                {data.data.map((anime: JikanAnime, index: number) => (
                  <motion.div
                    key={anime.mal_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <AnimeCard
                      anime={anime}
                      index={index}
                      variant={viewMode === 'list' ? 'list' : 'poster'}
                    />
                  </motion.div>
                ))}
              </motion.div>

              {/* Pagination */}
              {data.pagination && data.pagination.last_visible_page > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex items-center justify-center gap-2 flex-wrap"
                >
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>

                  <div className="flex gap-1">
                    {/* Show page numbers */}
                    {Array.from({ length: Math.min(5, data.pagination.last_visible_page) }, (_, i) => {
                      const pageNum = Math.max(1, page - 2) + i;
                      if (pageNum > data.pagination.last_visible_page) return null;
                      
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
                    disabled={page >= data.pagination.last_visible_page}
                    className="flex items-center gap-2"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </motion.div>
              )}
            </>
          )}

          {/* Empty State - No Search Query */}
          {!query && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Search className="w-12 h-12 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Start Your Search</h3>
              <p className="text-gray-400 mb-6">
                Enter an anime title above to find your favorite shows and movies.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {['One Piece', 'Naruto', 'Attack on Titan', 'Demon Slayer', 'My Hero Academia'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setSearchInput(suggestion);
                      setSearchParams({ q: suggestion, page: '1' });
                    }}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-sm transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}