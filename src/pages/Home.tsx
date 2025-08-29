import React from 'react';
import { motion } from 'framer-motion';
import { Header } from '../components/Header';
import { HeroSpotlight } from '../components/HeroSpotlight';
import { AnimeCard } from '../components/AnimeCard';
import { CommentsPanel } from '../components/CommentsPanel';
import { GenresPanel } from '../components/GenresPanel';
import { CardSkeleton } from '../components/Skeletons/CardSkeleton';
import { HeroSkeleton } from '../components/Skeletons/HeroSkeleton';
import { TrendingSlider } from '../components/TrendingSlider';
import { Footer } from '../components/Footer';
import {
  useTopAiring,
  useTrending,
  useMostPopular,
  useMostFavorite,
  useLatestCompleted,
} from '../hooks/useAnimeData';

interface SectionProps {
  title: string;
  data: any[] | undefined;
  isLoading: boolean;
  layout?: 'carousel' | 'grid' | 'list';
  variant?: 'poster' | 'list';
  showViewMore?: boolean;
}

function Section({
  title,
  data,
  isLoading,
  layout = 'grid',
  variant = 'poster',
  showViewMore = true,
}: SectionProps) {
  if (isLoading) {
    return (
      <section className="block_area mb-8 overflow-x-hidden">
        <div className="block_area-header flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
        <div
          className={
            layout === 'carousel'
              ? 'flex gap-4 overflow-x-auto pb-4 max-w-full'
              : variant === 'list'
              ? 'space-y-3'
              : 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-full'
          }
        >
          {Array.from({ length: variant === 'list' ? 5 : 6 }, (_, i) => (
            <div
              key={i}
              className={layout === 'carousel' ? 'flex-shrink-0 w-44' : ''}
            >
              <CardSkeleton />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!data || data.length === 0) {
    return (
      <section className="block_area mb-8 overflow-x-hidden">
        <div className="block_area-header flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
        <p className="text-gray-400">No data available</p>
      </section>
    );
  }

  return (
    <section className="block_area mb-8 overflow-x-hidden">
      <div className="block_area-header flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        {showViewMore && (
          <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors flex items-center gap-1">
            View more
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}
      </div>
      <div
        className={
          layout === 'carousel'
            ? 'flex gap-4 overflow-x-auto pb-4 scrollbar-hide max-w-full'
            : variant === 'list'
            ? 'space-y-3'
            : 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-full overflow-x-hidden'
        }
      >
        {data.slice(0, variant === 'list' ? 5 : 12).map((anime, index) => (
          <div
            key={anime.mal_id}
            className={layout === 'carousel' ? 'flex-shrink-0 w-44' : ''}
          >
            <AnimeCard anime={anime} index={index} variant={variant} />
          </div>
        ))}
      </div>
    </section>
  );
}

export function Home() {
  const { data: trending, isLoading: trendingLoading } = useTrending();
  const { data: topAiring, isLoading: topAiringLoading } = useTopAiring();
  const { data: mostPopular, isLoading: mostPopularLoading } = useMostPopular();
  const { data: mostFavorite, isLoading: mostFavoriteLoading } =
    useMostFavorite();
  const { data: latestCompleted, isLoading: latestCompletedLoading } =
    useLatestCompleted();

  // Use first trending anime for hero spotlight
  const heroAnime = trending?.[0];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      <Header />

      {/* Main Content Container */}
      <div className="pt-16">
        {/* Hero Spotlight */}
        <div className="relative">
          {heroAnime ? (
            <HeroSpotlight animes={trending || []} slideIntervalMs={7000} />
          ) : trendingLoading ? (
            <HeroSkeleton />
          ) : null}
        </div>

        {/* Trending Section */}
        <div className="container mx-auto px-6 lg:px-8 py-6 max-w-7xl overflow-x-hidden">
          <section className="block_area mb-12">
            <div className="block_area-header mb-6">
              <h2 className="text-2xl font-bold text-white">Trending</h2>
            </div>
            <div className="block_area-content overflow-x-hidden">
              {trending && !trendingLoading ? (
                <TrendingSlider animes={trending.slice(0, 10)} />
              ) : (
                <div className="flex gap-4 overflow-x-auto pb-4 max-w-full">
                  {Array.from({ length: 10 }, (_, i) => (
                    <div key={i} className="flex-shrink-0 w-32">
                      <CardSkeleton />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Main Grid Layout */}
          <div className="grid lg:grid-cols-4 gap-8 overflow-x-hidden">
            {/* Main Content - 3 columns */}
            <div className="lg:col-span-3 min-w-0 overflow-x-hidden">
              {/* Featured Sections Grid */}
              <div className="grid md:grid-cols-2 gap-8 mb-12 overflow-x-hidden">
                <Section
                  title="Top Airing"
                  data={topAiring}
                  isLoading={topAiringLoading}
                  variant="list"
                  layout="grid"
                />
                <Section
                  title="Most Popular"
                  data={mostPopular}
                  isLoading={mostPopularLoading}
                  variant="list"
                  layout="grid"
                />
              </div>

              <Section
                title="Most Favorite"
                data={mostFavorite}
                isLoading={mostFavoriteLoading}
                variant="poster"
                layout="grid"
              />

              {/* Latest Episodes Section */}
              <Section
                title="Latest Episode"
                data={trending}
                isLoading={trendingLoading}
                layout="grid"
                variant="poster"
              />

              {/* New on HiAnime Section */}
              <Section
                title="Popular On HiAnime"
                data={mostPopular}
                isLoading={mostPopularLoading}
                layout="grid"
                variant="poster"
              />

              {/* Top Upcoming Section */}
              <Section
                title="Top Upcoming"
                data={mostFavorite}
                isLoading={mostFavoriteLoading}
                layout="grid"
                variant="poster"
              />
            </div>

            {/* Sidebar - 1 column */}
            <div className="lg:col-span-1 space-y-8 min-w-0">
              <GenresPanel />

              {/* Top 10 Section */}
              <div className="bg-[#1a1a1a] rounded-xl overflow-hidden">
                <div className="p-4 border-b border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">Top 10</h3>
                  </div>
                  <div className="flex gap-1">
                    <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded">
                      Today
                    </button>
                    <button className="px-3 py-1 text-gray-400 hover:text-white text-sm">
                      Week
                    </button>
                    <button className="px-3 py-1 text-gray-400 hover:text-white text-sm">
                      Month
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  {topAiring && !topAiringLoading ? (
                    <div className="space-y-3">
                      {topAiring.slice(0, 10).map((anime, index) => (
                        <div
                          key={anime.mal_id}
                          className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                        >
                          <div
                            className={`w-8 h-8 rounded flex items-center justify-center text-sm font-bold ${
                              index < 3
                                ? 'bg-yellow-600 text-black'
                                : 'bg-gray-700 text-white'
                            }`}
                          >
                            {String(index + 1).padStart(2, '0')}
                          </div>
                          <img
                            src={anime.images.jpg.image_url}
                            alt={anime.title}
                            className="w-12 h-16 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0 overflow-hidden">
                            <h4 className="text-white text-sm font-medium truncate">
                              {anime.title_english || anime.title}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                              {anime.episodes && (
                                <span>{anime.episodes} eps</span>
                              )}
                              {anime.year && <span>• {anime.year}</span>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {Array.from({ length: 10 }, (_, i) => (
                        <div key={i} className="flex items-center gap-3 p-2">
                          <div className="w-8 h-8 bg-gray-700 rounded animate-pulse"></div>
                          <div className="w-12 h-16 bg-gray-700 rounded animate-pulse"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-700 rounded animate-pulse mb-2"></div>
                            <div className="h-3 bg-gray-700 rounded animate-pulse w-2/3"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <CommentsPanel />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .block_area {
          position: relative;
          overflow-x: hidden;
        }
        .block_area-header {
          position: relative;
        }
        .block_area-content {
          position: relative;
          overflow-x: hidden;
        }
      `}</style>
    </div>
  );
}
