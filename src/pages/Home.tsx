import React from 'react';
import { motion } from 'framer-motion';
import { Crown } from 'lucide-react';
import { Header } from '../components/Header';
import { Button } from '../components/ui/Button';
import { HeroSpotlight } from '../components/HeroSpotlight';
import { AnimeCard } from '../components/AnimeCard';
import { CommentsPanel } from '../components/CommentsPanel';
import { GenresPanel } from '../components/GenresPanel';
import { CardSkeleton } from '../components/Skeletons/CardSkeleton';
import { HeroSkeleton } from '../components/Skeletons/HeroSkeleton';
import { TrendingSlider } from '../components/TrendingSlider';
import { Footer } from '../components/Footer';
import { Top10 } from '../components/Top10';
import { SEOHead } from '../components/SEOHead';

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
  error: any;
  refetch?: () => void;
  layout?: 'carousel' | 'grid' | 'list';
  variant?: 'poster' | 'list';
  showViewMore?: boolean;
}

function Section({
  title,
  data,
  isLoading,
  error,
  refetch,
  layout = 'grid',
  variant = 'poster',
  showViewMore = true,
}: SectionProps) {
  // Auto-retry on error after a delay
  React.useEffect(() => {
    if (error && refetch && !isLoading) {
      console.log(`Auto-retrying ${title} section in 5 seconds...`);
      const timer = setTimeout(() => {
        console.log(`Auto-retrying ${title} section now`);
        refetch();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error, refetch, isLoading, title]);

  // Error State with Retry
  if (error && !isLoading) {
    return (
      <section className="block_area mb-8 overflow-x-hidden">
        <div className="block_area-header flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-white font-semibold mb-2">
            Failed to Load {title}
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            {error?.message?.includes('Rate limit')
              ? 'Rate limit exceeded. Automatically retrying in a few seconds...'
              : 'Unable to fetch data. Please check your connection and try again.'}
          </p>
          <div className="flex items-center justify-center gap-2 text-blue-400 text-sm">
            <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            <span>Retrying automatically...</span>
          </div>
          {refetch && (
            <Button
              onClick={() => refetch()}
              variant="outline"
              size="sm"
              className="mx-auto mt-4"
            >
              Retry Now
            </Button>
          )}
        </div>
      </section>
    );
  }
  if (isLoading) {
    return (
      <section className="block_area mb-8 overflow-x-hidden">
        <div className="block_area-header flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
        <div
          className={
            layout === 'carousel'
              ? 'flex gap-4 overflow-x-auto pb-4 scrollbar-hide max-w-full'
              : variant === 'list'
              ? 'space-y-3'
              : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-full overflow-x-hidden'
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
            : 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-full overflow-x-hidden'
        }
      >
        {data.slice(0, variant === 'list' ? 5 : 15).map((anime, index) => (
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
  const {
    data: trending,
    isLoading: trendingLoading,
    error: trendingError,
    refetch: refetchTrending,
  } = useTrending();
  const {
    data: topAiring,
    isLoading: topAiringLoading,
    error: topAiringError,
    refetch: refetchTopAiring,
  } = useTopAiring();
  const {
    data: mostPopular,
    isLoading: mostPopularLoading,
    error: mostPopularError,
    refetch: refetchMostPopular,
  } = useMostPopular();
  const {
    data: mostFavorite,
    isLoading: mostFavoriteLoading,
    error: mostFavoriteError,
    refetch: refetchMostFavorite,
  } = useMostFavorite();
  const {
    data: latestCompleted,
    isLoading: latestCompletedLoading,
    error: latestCompletedError,
    refetch: refetchLatestCompleted,
  } = useLatestCompleted();

  // Use first trending anime for hero spotlight
  const heroAnime = trending?.[0];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">

      <SEOHead
        title="ANIPOP! - Watch Anime Online Free | HD Quality Anime Streaming"
        description="Watch thousands of anime episodes and movies online for free in HD quality. Stream popular anime series, latest releases, and classic titles with subtitles and dubbing."
        keywords="anime, watch anime online, free anime, anime streaming, anime movies, anime series, subbed anime, dubbed anime, HD anime"
        url="https://anipop.netlify.app/"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "ANIPOP!",
          "url": "https://anipop.netlify.app",
          "description": "Watch thousands of anime episodes and movies online for free in HD quality",
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://anipop.netlify.app/search?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        }}
      />
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
                  error={topAiringError}
                  refetch={refetchTopAiring}
                  variant="list"
                  layout="grid"
                />
                <Section
                  title="Most Popular"
                  data={mostPopular}
                  isLoading={mostPopularLoading}
                  error={mostPopularError}
                  refetch={refetchMostPopular}
                  variant="list"
                  layout="grid"
                />
              </div>

              <Section
                title="Most Favorite"
                data={mostFavorite}
                isLoading={mostFavoriteLoading}
                error={mostFavoriteError}
                refetch={refetchMostFavorite}
                variant="poster"
                layout="grid"
              />

              {/* Latest Episodes Section */}
              <Section
                title="Latest Episode"
                data={trending}
                isLoading={trendingLoading}
                error={trendingError}
                refetch={refetchTrending}
                layout="grid"
                variant="poster"
              />

              {/* New on HiAnime Section */}
              <Section
                title="Popular On HiAnime"
                data={mostPopular}
                isLoading={mostPopularLoading}
                error={mostPopularError}
                refetch={refetchMostPopular}
                layout="grid"
                variant="poster"
              />

              {/* Top Upcoming Section */}
              <Section
                title="Top Upcoming"
                data={mostFavorite}
                isLoading={mostFavoriteLoading}
                error={mostFavoriteError}
                refetch={refetchMostFavorite}
                layout="grid"
                variant="poster"
              />
            </div>

            {/* Sidebar - 1 column */}
            <div className="lg:col-span-1 space-y-8 min-w-0">
              <GenresPanel />

              {/* Top 10 Section */}
              <Top10 />

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
