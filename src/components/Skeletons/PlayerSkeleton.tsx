import React from 'react';

export function PlayerSkeleton() {
  return (
    <div className="aspect-video bg-gray-800 rounded-2xl flex items-center justify-center animate-pulse">
      <div className="w-16 h-16 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );
}