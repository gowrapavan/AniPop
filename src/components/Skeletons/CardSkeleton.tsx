import React from 'react';

export function CardSkeleton() {
  return (
    <div className="bg-gray-800/50 rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-[3/4] bg-gray-700"></div>
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-700 rounded"></div>
        <div className="h-3 bg-gray-700 rounded w-2/3"></div>
      </div>
    </div>
  );
}