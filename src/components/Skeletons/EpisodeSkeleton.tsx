import React from 'react';

export function EpisodeSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl animate-pulse">
      <div className="w-12 h-8 bg-gray-700 rounded"></div>
      <div className="flex-1 h-4 bg-gray-700 rounded"></div>
    </div>
  );
}