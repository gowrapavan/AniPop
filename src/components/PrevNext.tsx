import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/Button';
import { EpisodeItem } from '../lib/hianime';

interface PrevNextProps {
  currentEpisode?: EpisodeItem;
  episodes: EpisodeItem[];
  onEpisodeSelect: (episode: EpisodeItem) => void;
  className?: string;
}

export function PrevNext({ currentEpisode, episodes, onEpisodeSelect, className = '' }: PrevNextProps) {
  if (!currentEpisode || episodes.length === 0) {
    return null;
  }

  const currentIndex = episodes.findIndex(ep => ep.episodeId === currentEpisode.episodeId);
  const prevEpisode = currentIndex > 0 ? episodes[currentIndex - 1] : null;
  const nextEpisode = currentIndex < episodes.length - 1 ? episodes[currentIndex + 1] : null;

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <Button
        variant="outline"
        onClick={() => prevEpisode && onEpisodeSelect(prevEpisode)}
        disabled={!prevEpisode}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </Button>

      <div className="flex-1 text-center">
        <span className="text-gray-300 text-sm">
          Episode {currentEpisode.number} of {episodes.length}
        </span>
      </div>

      <Button
        variant="outline"
        onClick={() => nextEpisode && onEpisodeSelect(nextEpisode)}
        disabled={!nextEpisode}
        className="flex items-center gap-2"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}