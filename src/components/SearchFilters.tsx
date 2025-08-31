import React, { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from './ui/Button';

interface SearchFiltersProps {
  type: string;
  status: string;
  genre: string;
  onFilterChange: (filterType: string, value: string) => void;
  onClearFilters: () => void;
  className?: string;
}

export const SearchFilters = memo(function SearchFilters({
  type,
  status,
  genre,
  onFilterChange,
  onClearFilters,
  className = '',
}: SearchFiltersProps) {
  const genres = [
    { id: '1', name: 'Action' },
    { id: '2', name: 'Adventure' },
    { id: '4', name: 'Comedy' },
    { id: '8', name: 'Drama' },
    { id: '10', name: 'Fantasy' },
    { id: '14', name: 'Horror' },
    { id: '22', name: 'Romance' },
    { id: '24', name: 'Sci-Fi' },
    { id: '27', name: 'Shounen' },
    { id: '30', name: 'Sports' },
    { id: '36', name: 'Slice of Life' },
    { id: '37', name: 'Supernatural' },
  ];

  const hasActiveFilters = Boolean(type || status || genre);

  const handleTypeChange = useCallback((value: string) => {
    onFilterChange('type', value);
  }, [onFilterChange]);

  const handleStatusChange = useCallback((value: string) => {
    onFilterChange('status', value);
  }, [onFilterChange]);

  const handleGenreChange = useCallback((value: string) => {
    onFilterChange('genre', value);
  }, [onFilterChange]);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className={`bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Filters</h3>
        {hasActiveFilters && (
          <Button
            onClick={onClearFilters}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Type
          </label>
          <div className="space-y-2">
            {[
              { value: '', label: 'All Types' },
              { value: 'tv', label: 'TV Series' },
              { value: 'movie', label: 'Movies' },
              { value: 'ova', label: 'OVA' },
              { value: 'special', label: 'Special' },
              { value: 'ona', label: 'ONA' },
            ].map((option) => (
              <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value={option.value}
                  checked={type === option.value}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                />
                <span className="text-gray-300 text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Status
          </label>
          <div className="space-y-2">
            {[
              { value: '', label: 'All Status' },
              { value: 'airing', label: 'Currently Airing' },
              { value: 'complete', label: 'Completed' },
              { value: 'upcoming', label: 'Upcoming' },
            ].map((option) => (
              <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value={option.value}
                  checked={status === option.value}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                />
                <span className="text-gray-300 text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Genre Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Genre
          </label>
          <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="genre"
                value=""
                checked={genre === ''}
                onChange={(e) => handleGenreChange(e.target.value)}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
              />
              <span className="text-gray-300 text-sm">All Genres</span>
            </label>
            {genres.map((genreOption) => (
              <label key={genreOption.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="genre"
                  value={genreOption.id}
                  checked={genre === genreOption.id}
                  onChange={(e) => handleGenreChange(e.target.value)}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                />
                <span className="text-gray-300 text-sm">{genreOption.name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
});