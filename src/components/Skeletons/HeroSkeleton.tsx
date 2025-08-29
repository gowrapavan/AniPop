import React from 'react';

export function HeroSkeleton() {
  return (
    <div className="relative h-[400px] md:h-[500px] bg-gray-800 rounded-3xl overflow-hidden animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800/50 to-transparent">
        <div className="h-full flex items-center px-8 md:px-12">
          <div className="max-w-2xl space-y-4">
            <div className="h-8 bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-700 rounded w-4/6"></div>
            <div className="flex gap-4 mt-6">
              <div className="h-12 w-32 bg-gray-700 rounded-xl"></div>
              <div className="h-12 w-32 bg-gray-700 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}