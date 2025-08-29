import React from 'react';
import { motion } from 'framer-motion';
import { JikanAnime } from '../lib/jikan';
import { AnimeCard } from './AnimeCard';

interface SearchResultsGridProps {
  animes: JikanAnime[];
  viewMode: 'grid' | 'list';
  isLoading?: boolean;
  className?: string;
}

export function SearchResultsGrid({
  animes,
  viewMode,
  isLoading = false,
  className = '',
}: SearchResultsGridProps) {
  if (isLoading) {
    return (
      <div className={`${className}`}>
        <div className={
          viewMode === 'grid'
            ? 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6'
            : 'space-y-4'
        }>
          {Array.from({ length: 12 }, (_, i) => (
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`${className}`}
    >
      <div className={
        viewMode === 'grid'
          ? 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6'
          : 'space-y-4'
      }>
        {animes.map((anime, index) => (
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
      </div>
    </motion.div>
  );
}