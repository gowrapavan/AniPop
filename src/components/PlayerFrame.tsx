import React, { useState } from 'react';
import { PlayerSkeleton } from './Skeletons/PlayerSkeleton';

interface PlayerFrameProps {
  src: string;
  title?: string;
  className?: string;
}

export function PlayerFrame({ src, title, className = '' }: PlayerFrameProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  console.log('PlayerFrame src:', src);

  const handleLoad = () => {
    console.log('Player loaded successfully');
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    console.log('Player failed to load');
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError) {
    return (
      <div className={`aspect-video bg-gray-800 rounded-2xl flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-400">
          <p className="mb-2">Failed to load player</p>
          <button
            onClick={() => {
              setHasError(false);
              setIsLoading(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative aspect-video rounded-2xl overflow-hidden bg-gray-900 ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 z-10">
          <PlayerSkeleton />
        </div>
      )}
      
      <iframe
        src={src}
        title={title}
        className="w-full h-full"
        allowFullScreen
        frameBorder="0"
        onLoad={handleLoad}
        onError={handleError}
        referrerPolicy="no-referrer-when-downgrade"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    </div>
  );
}