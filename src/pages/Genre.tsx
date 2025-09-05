import React, { useState, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Tag, Grid, List } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { AnimeCard } from '../components/AnimeCard';
import { CardSkeleton } from '../components/Skeletons/CardSkeleton';
import { Button } from '../components/ui/Button';
import { JikanAnime, JikanResponse } from '../lib/jikan';
import { SEOHead } from '../components/SEOHead';

// ✅ Genre mapping for display names and IDs
const genreMap: Record<
  string,
  { id: string; name: string; description: string; color: string }
> = {
  action: {
    id: '1',
    name: 'Action',
    description: 'High-energy anime with intense fight scenes and adventures',
    color: 'from-red-600 to-orange-600',
  },
  adventure: {
    id: '2',
    name: 'Adventure',
    description: 'Epic journeys and exploration in fantastical worlds',
    color: 'from-green-600 to-teal-600',
  },
  comedy: {
    id: '4',
    name: 'Comedy',
    description: 'Hilarious anime that will make you laugh out loud',
    color: 'from-yellow-600 to-orange-600',
  },
  drama: {
    id: '8',
    name: 'Drama',
    description: 'Emotional stories with deep character development',
    color: 'from-purple-600 to-pink-600',
  },
  fantasy: {
    id: '10',
    name: 'Fantasy',
    description: 'Magical worlds filled with mythical creatures and powers',
    color: 'from-indigo-600 to-purple-600',
  },
  horror: {
    id: '14',
    name: 'Horror',
    description: 'Spine-chilling anime that will keep you on edge',
    color: 'from-gray-800 to-red-900',
  },
  romance: {
    id: '22',
    name: 'Romance',
    description: 'Heartwarming love stories and relationships',
    color: 'from-pink-600 to-rose-600',
  },
  'sci-fi': {
    id: '24',
    name: 'Sci-Fi',
    description: 'Futuristic technology and space exploration',
    color: 'from-blue-600 to-cyan-600',
  },
  shounen: {
    id: '27',
    name: 'Shounen',
    description: 'Action-packed anime targeted at young male audiences',
    color: 'from-orange-600 to-red-600',
  },
  sports: {
    id: '30',
    name: 'Sports',
    description: 'Competitive sports anime with teamwork and determination',
    color: 'from-green-600 to-blue-600',
  },
  'slice-of-life': {
    id: '36',
    name: 'Slice of Life',
    description: 'Realistic portrayals of everyday life',
    color: 'from-teal-600 to-green-600',
  },
  supernatural: {
    id: '37',
    name: 'Supernatural',
    description: 'Mysterious powers and otherworldly phenomena',
    color: 'from-purple-600 to-indigo-600',
  },
  thriller: {
    id: '41',
    name: 'Thriller',
    description: 'Suspenseful anime with psychological tension',
    color: 'from-gray-700 to-gray-900',
  },
  mystery: {
    id: '7',
    name: 'Mystery',
    description: 'Intriguing puzzles and detective stories',
    color: 'from-indigo-700 to-purple-700',
  },
  psychological: {
    id: '40',
    name: 'Psychological',
    description: 'Mind-bending stories exploring human psyche',
    color: 'from-gray-600 to-purple-800',
  },
  mecha: {
    id: '18',
    name: 'Mecha',
    description: 'Giant robots and mechanical warfare',
    color: 'from-gray-600 to-blue-700',
  },
  isekai: {
    id: '62',
    name: 'Isekai',
    description: 'Characters transported to another world',
    color: 'from-blue-600 to-purple-600',
  },
};

// ✅ Inline fetcher (no external hook needed)
async function fetchAnimeByGenre({
  genre,
  type,
  status,
  page,
  limit,
}: {
  genre?: string;
  type?: string;
  status?: string;
  page: number;
  limit: number;
}) {
  const params: Record<string, any> = { page, limit };
  if (genre) params.genres = genre; // ✅ Jikan expects "genres"
  if (type) params.type = type;
  if (status) params.status = status;

  const res = await axios.get<JikanResponse>('https://api.jikan.moe/v4/anime', {
    params,
  });
  return res.data;
}

export function Genre() {
  const { genreName } = useParams<{ genreName: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('score');

  const genre = genreName ? genreMap[genreName.toLowerCase()] : null;
  const typeFilter = searchParams.get('type') || '';
  const statusFilter = searchParams.get('status') || '';
  const page = Number(searchParams.get('page')) || 1;

  // ✅ Fetch with react-query
  const { data, isLoading, error } = useQuery({
    queryKey: ['genreAnime', genre?.id, typeFilter, statusFilter, page],
    queryFn: () =>
      fetchAnimeByGenre({
        genre: genre?.id,
        type: typeFilter || undefined,
        status: statusFilter || undefined,
        page,
        limit: 24,
      }),
    enabled: !!genre, // don’t fetch if invalid genre
    keepPreviousData: true,
  });

  const animeList = data?.data || [];
  const totalPages = data?.pagination?.last_visible_page || 1;

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set('page', String(newPage));
      return params;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (filterType: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(filterType, value);
    else newParams.delete(filterType);
    newParams.set('page', '1'); // reset to first page
    setSearchParams(newParams);
  };

  const sortedAnime = useMemo(() => {
    if (!animeList.length) return [];
    const sorted = [...animeList];
    switch (sortBy) {
      case 'score':
        return sorted.sort((a, b) => (b.score || 0) - (a.score || 0));
      case 'year':
        return sorted.sort((a, b) => (b.year || 0) - (a.year || 0));
      case 'popularity':
        return sorted.sort((a, b) => (a.popularity || 0) - (b.popularity || 0));
      case 'title':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return sorted;
    }
  }, [animeList, sortBy]);

  // ❌ Invalid genre
  if (!genre) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <SEOHead
          title="Genre Not Found - ANIPOP!"
          description="The anime genre you're looking for doesn't exist. Browse our available anime genres."
          noIndex={true}
        />
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Tag className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <h2 className="text-2xl font-bold mb-2">Genre Not Found</h2>
            <p className="text-gray-400">
              The genre "{genreName}" doesn't exist or isn't available.
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <SEOHead
        title={`${genre.name} Anime - Watch ${genre.name} Anime Series & Movies`}
        description={`${genre.description} Discover and watch the best ${genre.name.toLowerCase()} anime series and movies online for free.`}
        keywords={`${genre.name.toLowerCase()} anime, ${genre.name.toLowerCase()} anime series, ${genre.name.toLowerCase()} anime movies, watch ${genre.name.toLowerCase()} anime`}
        url={`https://anipop.netlify.app/genre/${genreName}`}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": `${genre.name} Anime`,
          "description": genre.description,
          "url": `https://anipop.netlify.app/genre/${genreName}`,
          "mainEntity": {
            "@type": "ItemList",
            "name": `${genre.name} Anime Collection`
          }
        }}
      />
      <Header />

      <div className="pt-16">
        {/* Page Header */}
        <div
          className={`bg-gradient-to-r ${genre.color} border-b border-gray-700`}
        >
          <div className="container mx-auto px-6 lg:px-8 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <Tag className="w-8 h-8 text-white" />
                <h1 className="text-4xl font-bold">{genre.name} Anime</h1>
              </div>
              <p className="text-gray-200 text-lg max-w-2xl mx-auto">
                {genre.description}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Filters & Controls */}
        <div className="container mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8">
            {/* Sort + Filters */}
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
                  <option value="title">A-Z</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">Type:</span>
                <select
                  value={typeFilter}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="tv">TV Series</option>
                  <option value="movie">Movies</option>
                  <option value="ova">OVA</option>
                  <option value="special">Special</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="airing">Currently Airing</option>
                  <option value="complete">Completed</option>
                  <option value="upcoming">Upcoming</option>
                </select>
              </div>
            </div>

            {/* View Mode */}
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
          {!isLoading && animeList.length > 0 && (
            <div className="mb-6">
              <p className="text-gray-400 text-sm">
                Showing {animeList.length} {genre.name.toLowerCase()} anime •
                Page {page} of {totalPages}
              </p>
            </div>
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
                <Tag className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">
                Failed to Load {genre.name} Anime
              </h3>
              <p className="text-gray-400 mb-4">
                Unable to fetch {genre.name.toLowerCase()} anime. Please try
                again later.
              </p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Retry
              </Button>
            </div>
          )}

          {/* Anime Grid */}
          {!isLoading && !error && sortedAnime.length > 0 && (
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
              {sortedAnime.map((anime: JikanAnime, index: number) => (
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
          {!isLoading && !error && animeList.length === 0 && (
            <div className="text-center py-12">
              <Tag className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <h3 className="text-white font-semibold mb-2">
                No {genre.name} Anime Found
              </h3>
              <p className="text-gray-400">
                No anime in the {genre.name.toLowerCase()} genre are available
                with the current filters.
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
