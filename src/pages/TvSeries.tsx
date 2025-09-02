import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Tv, Grid, List } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { AnimeCard } from '../components/AnimeCard';
import { CardSkeleton } from '../components/Skeletons/CardSkeleton';
import { Button } from '../components/ui/Button';
import { useSearchParams } from 'react-router-dom';
import { JikanAnime } from '../lib/jikan';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export function TvSeries() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('score');
  const [statusFilter, setStatusFilter] = useState('');

  // ✅ Sync page with URL
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;

  // ✅ Query Jikan API (first /anime, fallback to /top/anime)
  const { data, isLoading, error } = useQuery({
    queryKey: ['tvSeries', { page, statusFilter }],
    queryFn: async () => {
      const params: Record<string, any> = {
        page,
        limit: 24,
        type: 'tv',
      };
      if (statusFilter) params.status = statusFilter;

      let res = await axios.get('https://api.jikan.moe/v4/anime', { params });
      if (!res.data.data || res.data.data.length === 0) {
        // fallback to /top/anime
        res = await axios.get('https://api.jikan.moe/v4/top/anime', { params });
      }
      return res.data;
    },
    keepPreviousData: true,
  });

  const tvSeries = data?.data || [];
  const totalPages = data?.pagination?.last_visible_page || 1;

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setSearchParams({ page: String(newPage) }); // ✅ updates URL
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sortedSeries = useMemo(() => {
    if (!tvSeries.length) return [];

    const sorted = [...tvSeries];
    switch (sortBy) {
      case 'score':
        return sorted.sort((a, b) => (b.score || 0) - (a.score || 0));
      case 'year':
        return sorted.sort((a, b) => (b.year || 0) - (a.year || 0));
      case 'popularity':
        return sorted.sort((a, b) => (a.popularity || 0) - (b.popularity || 0));
      case 'episodes':
        return sorted.sort((a, b) => (b.episodes || 0) - (a.episodes || 0));
      case 'title':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return sorted;
    }
  }, [tvSeries, sortBy]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
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
                <Tv className="w-8 h-8 text-blue-400" />
                <h1 className="text-4xl font-bold">TV Series</h1>
              </div>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Explore ongoing and completed anime TV series with multiple
                episodes
              </p>
            </motion.div>
          </div>
        </div>

        {/* Controls */}
        <div className="container mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
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
                  <option value="episodes">Most Episodes</option>
                  <option value="title">A-Z</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="airing">Currently Airing</option>
                  <option value="complete">Completed</option>
                  <option value="upcoming">Upcoming</option>
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

          {/* Results Count */}
          {!isLoading && sortedSeries.length > 0 && (
            <div className="mb-6">
              <p className="text-gray-400 text-sm">
                Showing {sortedSeries.length} TV series • Page {page} of{' '}
                {totalPages}
              </p>
            </div>
          )}

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
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                <Tv className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">
                Failed to Load TV Series
              </h3>
              <p className="text-gray-400 mb-4">
                Unable to fetch anime TV series. Please try again later.
              </p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Retry
              </Button>
            </div>
          )}

          {/* TV Series Grid */}
          {!isLoading && !error && sortedSeries.length > 0 && (
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
              {sortedSeries.map((anime: JikanAnime, index: number) => (
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
          {!isLoading && !error && sortedSeries.length === 0 && (
            <div className="text-center py-12">
              <Tv className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <h3 className="text-white font-semibold mb-2">
                No TV Series Found
              </h3>
              <p className="text-gray-400">
                No anime TV series are available at the moment.
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
