import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EpisodeItem } from '../lib/hianime';
import { Button } from './ui/Button';

interface EpisodeListProps {
  episodes: EpisodeItem[];
  currentEpisodeId?: string;
  onEpisodeSelect: (episode: EpisodeItem) => void;
  className?: string;
}

export function EpisodeList({
  episodes,
  currentEpisodeId,
  onEpisodeSelect,
  className = '',
}: EpisodeListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentRange, setCurrentRange] = useState(0);

  const filteredEpisodes = useMemo(() => {
    if (!searchTerm) return episodes;
    return episodes.filter(
      (ep) =>
        ep.number.toString().includes(searchTerm) ||
        ep.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [episodes, searchTerm]);

  const totalEpisodes = episodes.length;
  const useGrid = totalEpisodes > 25;
  const usePagination = totalEpisodes > 50;
  const rangeSize = 100;
  const totalRanges = Math.ceil(totalEpisodes / rangeSize);

  const displayedEpisodes = useMemo(() => {
    if (!usePagination) return filteredEpisodes;

    const start = currentRange * rangeSize;
    const end = start + rangeSize;
    return filteredEpisodes.filter(
      (ep) => ep.number >= start + 1 && ep.number <= end
    );
  }, [filteredEpisodes, currentRange, usePagination, rangeSize]);

  const getRangeLabel = (rangeIndex: number) => {
    const start = rangeIndex * rangeSize + 1;
    const end = Math.min((rangeIndex + 1) * rangeSize, totalEpisodes);
    return `${start.toString().padStart(3, '0')}–${end
      .toString()
      .padStart(3, '0')}`;
  };

  if (totalEpisodes === 0) {
    return (
      <div className={`bg-gray-800/50 rounded-2xl p-6 ${className}`}>
        <div className="text-center">
          <p className="text-gray-400 mb-2">No episodes available</p>
          <p className="text-gray-500 text-sm">
            Episodes may still be loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-700/50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold">
            Episodes ({totalEpisodes})
          </h3>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search episodes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Range Pagination */}
        {usePagination && totalRanges > 1 && (
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentRange(Math.max(0, currentRange - 1))}
              disabled={currentRange === 0}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex flex-wrap gap-1">
              {Array.from({ length: Math.min(5, totalRanges) }, (_, i) => {
                const rangeIndex = Math.max(0, currentRange - 2) + i;
                if (rangeIndex >= totalRanges) return null;

                return (
                  <button
                    key={rangeIndex}
                    onClick={() => setCurrentRange(rangeIndex)}
                    className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                      rangeIndex === currentRange
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {getRangeLabel(rangeIndex)}
                  </button>
                );
              })}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setCurrentRange(Math.min(totalRanges - 1, currentRange + 1))
              }
              disabled={currentRange === totalRanges - 1}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Episodes */}
      <div className="p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRange}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={
              useGrid
                ? 'grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-15 gap-2'
                : 'space-y-2'
            }
          >
            {displayedEpisodes.map((episode, index) => (
              <motion.button
                key={episode.episodeId}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.02 }}
                onClick={() => onEpisodeSelect(episode)}
                className={`${
                  useGrid
                    ? 'aspect-square flex items-center justify-center text-sm font-medium rounded-lg transition-all duration-200'
                    : 'flex items-center gap-3 p-3 rounded-xl transition-all duration-200'
                } ${
                  currentEpisodeId === episode.episodeId
                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                    : 'bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white hover:scale-105'
                }`}
              >
                {useGrid ? (
                  <span>{episode.number}</span>
                ) : (
                  <>
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                        currentEpisodeId === episode.episodeId
                          ? 'bg-white/20'
                          : 'bg-gray-600'
                      }`}
                    >
                      {episode.number}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium">
                        Episode {episode.number}
                      </div>
                      {episode.title && (
                        <div className="text-xs text-gray-400 truncate">
                          {episode.title}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </motion.button>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
