import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';

import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Settings,
  Star,
  Play,
  Plus,
  Heart,
  Share2,
  MessageCircle,
  ChevronRight,
  Expand,
  Sun,
  SkipForward,
  SkipBack,
  Users,
  Clock,
  ChevronLeft,
  Filter,
  List,
  Grid,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import {
  useAnimeDetails,
  useEnhancedAnimeDataId,
  useEnhancedEpisodeList,
} from '../hooks/useAnimeData';
import { playerSrc } from '../lib/hianime';
import { getPreferredTitle, formatScore } from '../lib/utils';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { RecommendationProp } from '../components/RecommendationProp';
import { SEOHead } from '../components/SEOHead';

export function Watch() {
  const { malId } = useParams<{ malId: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const animeId = Number(malId);

  const currentEpId = searchParams.get('ep');
  const currentLang = (searchParams.get('lang') as 'sub' | 'dub') || 'sub';

  const { data: anime } = useAnimeDetails(animeId);
  const preferredTitle = anime ? getPreferredTitle(anime) : '';

  const { data: hianimeDataResult } = useEnhancedAnimeDataId(
    preferredTitle,
    anime
  );
  const {
    data: episodes = [],
    isLoading: episodesLoading,
    error: episodesError,
    refetch: refetchEpisodes,
  } = useEnhancedEpisodeList(hianimeDataResult);

  // State for retry logic
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const maxRetries = 5;

  // Auto-retry logic when episodes are empty
  useEffect(() => {
    if (
      hianimeDataResult?.dataId &&
      !episodesLoading &&
      episodes.length === 0 &&
      retryCount < maxRetries &&
      !isRetrying
    ) {
      console.log(
        `Episodes empty, retrying... (attempt ${retryCount + 1}/${maxRetries})`
      );
      setIsRetrying(true);

      const retryDelay = Math.min(2000 * Math.pow(2, retryCount), 10000); // Exponential backoff

      setTimeout(() => {
        setRetryCount((prev) => prev + 1);
        refetchEpisodes();
        setIsRetrying(false);
      }, retryDelay);
    }
  }, [
    hianimeDataResult?.dataId,
    episodesLoading,
    episodes.length,
    retryCount,
    isRetrying,
    refetchEpisodes,
  ]);

  // Reset retry count when episodes are successfully loaded
  useEffect(() => {
    if (episodes.length > 0) {
      setRetryCount(0);
      setIsRetrying(false);
    }
  }, [episodes.length]);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640); // You can adjust this breakpoint as needed
    };

    handleResize(); // Check screen size initially
    window.addEventListener('resize', handleResize); // Update on resize

    return () => window.removeEventListener('resize', handleResize); // Cleanup on unmount
  }, []);
  const truncationLimit = isMobile ? 63 : 30; // 45 for mobile, 30 for desktop

  // UI State
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [episodeFilter, setEpisodeFilter] = useState('All Episodes');
  const [selectedQuality, setSelectedQuality] = useState('HD-1');
  const [autoPlay, setAutoPlay] = useState(true);
  const [autoNext, setAutoNext] = useState(false);
  const [autoSkipIntro, setAutoSkipIntro] = useState(false);
  const [lightMode, setLightMode] = useState(false);

  // Auto-select first episode if none selected
  useEffect(() => {
    if (episodes.length > 0 && !currentEpId) {
      const firstEpisode = episodes[0];
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set('ep', firstEpisode.episodeId);
        return newParams;
      });
    }
  }, [episodes, currentEpId, setSearchParams]);

  const currentEpisode = episodes.find((ep) => ep.episodeId === currentEpId);

  const handleEpisodeSelect = (episode: (typeof episodes)[0]) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set('ep', episode.episodeId);
      return newParams;
    });
  };

  const handleLangToggle = (lang: 'sub' | 'dub') => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set('lang', lang);
      return newParams;
    });
  };

  const handleBack = () => {
    navigate(`/anime/${malId}`);
  };

  const playerUrl = currentEpId
    ? playerSrc(
        currentEpId,
        currentLang,
        selectedQuality as 'HD-1' | 'HD-2' | 'HD-3'
      )
    : '';

  const currentIndex = episodes.findIndex((ep) => ep.episodeId === currentEpId);
  const prevEpisode = currentIndex > 0 ? episodes[currentIndex - 1] : null;
  const nextEpisode =
    currentIndex < episodes.length - 1 ? episodes[currentIndex + 1] : null;

  // Episode filtering logic
  const getEpisodeRanges = () => {
    if (episodes.length <= 100) return [];
    const ranges = [];
    for (let i = 0; i < episodes.length; i += 100) {
      const start = i + 1;
      const end = Math.min(i + 100, episodes.length);
      ranges.push(
        `${start.toString().padStart(3, '0')}-${end
          .toString()
          .padStart(3, '0')}`
      );
    }
    return ranges;
  };

  const getFilteredEpisodes = () => {
    if (!episodeFilter || episodeFilter === 'All Episodes') return episodes;
    const [start, end] = episodeFilter.split('-').map((n) => parseInt(n));
    return episodes.slice(start - 1, end);
  };

  const ranges = getEpisodeRanges();
  const filteredEpisodes = getFilteredEpisodes();

  const handlePreviousEpisode = () => {
    if (prevEpisode) handleEpisodeSelect(prevEpisode);
  };

  const handleNextEpisode = () => {
    if (nextEpisode) handleEpisodeSelect(nextEpisode);
  };

  // Manual retry function
  const handleManualRetry = () => {
    setRetryCount(0);
    setIsRetrying(true);
    refetchEpisodes().finally(() => setIsRetrying(false));
  };

  // Check if we should show loading state
  const showEpisodesLoading = episodesLoading || isRetrying;
  const showEpisodesError =
    episodesError &&
    !showEpisodesLoading &&
    episodes.length === 0 &&
    retryCount >= maxRetries;
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      <SEOHead
        title={anime ? `Watch ${getPreferredTitle(anime)} ${currentEpisode ? `Episode ${currentEpisode.number}` : ''} Online Free` : 'Watch Anime Online - ANIPOP!'}
        description={anime ? 
          `Watch ${getPreferredTitle(anime)} ${currentEpisode ? `Episode ${currentEpisode.number}` : ''} online for free in HD quality with subtitles. Stream anime episodes instantly on ANIPOP!` :
          'Watch anime episodes online for free in HD quality with subtitles and dubbing.'
        }
        keywords={anime ? `watch ${getPreferredTitle(anime)}, ${getPreferredTitle(anime)} episode ${currentEpisode?.number || ''}, anime streaming, free anime` : 'watch anime online, anime streaming, free anime episodes'}
        url={`https://anipop.netlify.app/watch/anime/${malId}${currentEpId ? `?ep=${currentEpId}` : ''}`}
        image={anime?.images?.jpg?.large_image_url}
        type="video.tv_show"
        noIndex={!anime} // Don't index if anime not found
      />
      <Header />

      <div className="pt-16">
        {/* Breadcrumb */}
        <div className="bg-gray-800 border-b border-gray-700">
          <div className="container mx-auto px-6 lg:px-8 py-3 overflow-hidden">
            <nav className="flex items-center space-x-2 text-sm">
              <button
                onClick={handleBack}
                className="text-blue-400 hover:text-blue-300"
              >
                Home
              </button>
              <ChevronRight className="w-4 h-4 text-gray-500" />
              <button
                onClick={handleBack}
                className="text-blue-400 hover:text-blue-300"
              >
                TV
              </button>
              <ChevronRight className="w-4 h-4 text-gray-500" />
              <span className="text-gray-300 truncate">
                Watching {anime ? getPreferredTitle(anime) : 'Anime'}
              </span>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-4 lg:h-[calc(100vh-4rem)] lg:px-6 lg:py-4 overflow-hidden">
          {/* Episode List Sidebar */}
          <div className="w-full lg:col-span-3 bg-gray-800 border-r-0 lg:border-r border-gray-700 flex flex-col h-auto lg:h-full order-2 lg:order-1 flex-shrink-0 lg:rounded-xl overflow-hidden">
            {/* Episode Filter */}
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm sm:text-base truncate">
                  List of episodes:{' '}
                  {episodes.length > 0 && `(${episodes.length})`}
                </h3>
                <div className="flex gap-1">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded ${
                      viewMode === 'list'
                        ? 'bg-blue-600'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded ${
                      viewMode === 'grid'
                        ? 'bg-blue-600'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {ranges.length > 0 && (
                <div className="flex items-center gap-2">
                  <select
                    value={episodeFilter}
                    onChange={(e) => setEpisodeFilter(e.target.value)}
                    className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm min-w-0"
                  >
                    <option value="All Episodes">All Episodes</option>
                    {ranges.map((range) => (
                      <option key={range} value={range}>
                        {range}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Episodes List */}
            <div className="flex-1 overflow-y-auto p-2 sm:p-4 max-h-96 lg:max-h-none custom-scrollbar">
              {/* Loading State */}
              {showEpisodesLoading && (
                <div className="space-y-4">
                  <div className="text-center py-6">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-gray-400 text-sm">
                      {isRetrying
                        ? `Retrying episodes... (${retryCount}/${maxRetries})`
                        : 'Loading episodes...'}
                    </p>
                  </div>

                  {/* Episode Skeletons */}
                  <div
                    className={
                      viewMode === 'list'
                        ? 'space-y-2'
                        : 'grid grid-cols-8 sm:grid-cols-7 lg:grid-cols-7 gap-2'
                    }
                  >
                    {Array.from(
                      { length: viewMode === 'list' ? 8 : 21 },
                      (_, i) => (
                        <div
                          key={i}
                          className={`
                          animate-pulse bg-gray-700/50 rounded
                          ${
                            viewMode === 'list'
                              ? 'p-2 sm:p-3 flex items-center gap-2 sm:gap-3 h-12'
                              : 'aspect-square flex items-center justify-center'
                          }
                        `}
                        >
                          {viewMode === 'list' ? (
                            <>
                              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-600 rounded flex-shrink-0"></div>
                              <div className="flex-1 h-4 bg-gray-600 rounded"></div>
                            </>
                          ) : (
                            <div className="w-6 h-6 bg-gray-600 rounded"></div>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Error State */}
              {showEpisodesError && (
                <div className="text-center py-8">
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
                    Failed to Load Episodes
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Unable to fetch episodes after {maxRetries} attempts. This
                    might be due to:
                  </p>
                  <ul className="text-gray-400 text-xs mb-6 space-y-1">
                    <li>• Network connectivity issues</li>
                    <li>• Server temporarily unavailable</li>
                    <li>• Anime not available on streaming platform</li>
                  </ul>
                  <div className="space-y-3">
                    <Button
                      onClick={handleManualRetry}
                      variant="gradient"
                      size="sm"
                      className="shadow-glow"
                    >
                      Try Again
                    </Button>
                    <Button onClick={handleBack} variant="outline" size="sm">
                      Go Back to Details
                    </Button>
                  </div>
                </div>
              )}

              {/* Episodes List */}
              {!showEpisodesLoading &&
                !showEpisodesError &&
                episodes.length > 0 && (
                  <div
                    className={
                      viewMode === 'list'
                        ? 'space-y-2'
                        : 'grid grid-cols-8 sm:grid-cols-7 lg:grid-cols-7 gap-2'
                    }
                  >
                    {filteredEpisodes.map((episode) => (
                      <div
                        key={episode.episodeId}
                        onClick={() => handleEpisodeSelect(episode)}
                        className={`
                        cursor-pointer transition-all duration-200 rounded
                        ${
                          viewMode === 'list'
                            ? 'p-2 sm:p-3 bg-gray-700 hover:bg-blue-600 flex items-center gap-2 sm:gap-3'
                            : 'p-1 sm:p-2 bg-gray-700 hover:bg-blue-600 text-center aspect-square flex items-center justify-center text-xs sm:text-sm'
                        }
                        ${
                          currentEpisode?.episodeId === episode.episodeId
                            ? 'ring-2 ring-blue-500 bg-blue-900/30'
                            : ''
                        }
                        hover:scale-105
                      `}
                      >
                        {viewMode === 'list' ? (
                          <>
                            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 rounded flex items-center justify-center flex-shrink-0">
                              <Play className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-xs sm:text-sm">
                                {episode.title &&
                                episode.title !== `Episode ${episode.number}`
                                  ? episode.title.length > truncationLimit
                                    ? episode.title.substring(
                                        0,
                                        truncationLimit
                                      ) + '...'
                                    : episode.title
                                  : `Episode ${episode.number}`}
                              </div>
                            </div>
                          </>
                        ) : (
                          <span className="font-bold text-xs sm:text-sm">
                            {episode.number}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

              {/* Empty State (when not loading/error but no episodes) */}
              {!showEpisodesLoading &&
                !showEpisodesError &&
                episodes.length === 0 &&
                hianimeDataResult?.dataId && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-700/50 rounded-full flex items-center justify-center">
                      <Play className="w-8 h-8 text-gray-500" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">
                      No Episodes Available
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Episodes for this anime are not currently available.
                    </p>
                    <Button
                      onClick={handleManualRetry}
                      variant="outline"
                      size="sm"
                    >
                      Refresh Episodes
                    </Button>
                  </div>
                )}

              {/* No Data ID State */}
              {!showEpisodesLoading &&
                !hianimeDataResult?.dataId &&
                retryCount >= maxRetries && ( // ✅ only after retries fail
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-yellow-500/20 rounded-full flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-yellow-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 
             2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 
             0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-white font-semibold mb-2">
                      Anime Not Found
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      This anime is not available for streaming or could not be
                      found in our database.
                    </p>
                    <Button onClick={handleBack} variant="outline" size="sm">
                      Go Back to Details
                    </Button>
                  </div>
                )}
            </div>
          </div>

           {/* Player Section */}
          <div className="flex-1 lg:col-span-6 flex flex-col order-1 lg:order-2 min-w-0 overflow-hidden">
            {/* Video Player */}
        <div className="bg-black relative">
  {playerUrl ? (
    <iframe
      src={playerUrl}
      className="w-full h-[250px] sm:h-[350px] lg:h-[calc(100vh-20rem)] rounded-xl shadow-lg"
      allow="autoplay; fullscreen; picture-in-picture"
      sandbox="allow-scripts allow-same-origin" // restrict redirects
      allowFullScreen
      title={
        currentEpisode
          ? `Episode ${currentEpisode.number}`
          : 'Anime Player'
      }
      onLoad={(e) => {
        const iframe = e.currentTarget;
        try {
          // If the iframe tries to redirect, reset it
          if (iframe.contentWindow?.location.href !== playerUrl) {
            iframe.src = playerUrl;
          }
        } catch (err) {
          // Cross-origin iframes will throw here, ignore safely
        }
      }}
    />
  ) : (
    <div className="w-full h-[250px] sm:h-[350px] lg:h-[calc(100vh-20rem)] flex items-center justify-center">
      <div className="text-center text-white">
        <Play className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">
          {showEpisodesLoading
            ? 'Loading episodes...'
            : 'Select an episode to start watching'}
        </p>
      </div>
    </div>
  )}
</div>

            {/* Video Controls - Below the video */}
            <div className="bg-gray-900 p-2 sm:p-4 space-y-2 sm:space-y-4 overflow-hidden">
              {/* Top Controls */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                  <button
                    onClick={handlePreviousEpisode}
                    disabled={!prevEpisode}
                    className="flex items-center gap-2 text-white hover:text-gray-300 disabled:text-gray-600 text-sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Prev</span>
                  </button>
                  <button
                    onClick={handleNextEpisode}
                    disabled={!nextEpisode}
                    className="flex items-center gap-2 text-white hover:text-gray-300 disabled:text-gray-600 text-sm"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button className="flex items-center gap-2 text-white hover:text-gray-300 text-sm">
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Add to List</span>
                  </button>
                  <button className="flex items-center gap-2 text-white hover:text-gray-300 text-sm">
                    <Users className="w-4 h-4" />
                    <span className="hidden sm:inline">Watch2gether</span>
                  </button>
                </div>
              </div>
              {/* Quality Selection */}
              <div className="flex flex-col md:flex-row flex-wrap items-start md:items-center gap-2 md:gap-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-white">SUB:</span>
                  {['HD-1', 'HD-3', 'HD-2'].map((quality) => (
                    <button
                      key={quality}
                      onClick={() => {
                        handleLangToggle('sub');
                        setSelectedQuality(quality);
                      }}
                      className={`px-3 py-1 rounded text-sm ${
                        currentLang === 'sub' && selectedQuality === quality
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {quality}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 flex-wrap mt-2 md:mt-0">
                  <span className="text-sm font-semibold text-white">DUB:</span>
                  {['HD-1', 'HD-3', 'HD-2'].map((quality) => (
                    <button
                      key={quality}
                      onClick={() => {
                        handleLangToggle('dub');
                        setSelectedQuality(quality);
                      }}
                      className={`px-3 py-1 rounded text-sm ${
                        currentLang === 'dub' && selectedQuality === quality
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {quality}
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Episode Info */}
              {/* Current Episode Info */}
              {currentEpisode && (
                <div className="bg-gradient-to-r from-primary-500 to-accent-500 text-white p-3 rounded text-sm">
                  <div className="font-semibold">You are watching</div>
                  <div>
                    Episode {currentEpisode.number} -{' '}
                    {currentEpisode.title &&
                    currentEpisode.title !== `Episode ${currentEpisode.number}`
                      ? currentEpisode.title
                      : ''}
                  </div>
                  <div className="text-xs mt-1 opacity-90">
                    If current server doesn't work please try other servers
                    beside.
                  </div>
                </div>
              )}
            </div>

            {/* Next Episode Timer */}
            <div className="bg-blue-600 text-white p-3 text-center text-sm">
              <Clock className="w-4 h-4 inline mr-2" />
              Estimated the next episode will come at 8/31/2025, 9:15:00 PM
            </div>
          </div>

          {/* Anime Details Section - Right Column */}
          <div className="lg:col-span-3 bg-gray-800/50 rounded-xl p-4 sm:p-6 overflow-hidden order-3 lg:h-full lg:overflow-y-auto custom-scrollbar">
            {/* Desktop: Poster + Film Stats on top, Title, Description, Action Buttons */}
            {/* Mobile: Poster + Title side by side, Poster + Film Stats side by side, Description, View Detail button */}
            <div className="flex flex-col lg:flex-col sm:flex-row gap-4 sm:gap-6">
              {/* Poster */}
              <div className="flex-shrink-0 self-center lg:self-start">
                <img
                  src={anime?.images?.jpg?.image_url || '/placeholder.png'}
                  alt={anime ? getPreferredTitle(anime) : 'Anime'}
                  className="w-24 h-32 sm:w-32 sm:h-44 lg:w-full lg:h-auto lg:max-w-48 object-cover rounded-lg mx-auto sm:mx-0"
                />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0 overflow-hidden flex flex-col">
                {/* Mobile: Poster + Title side by side */}
                <div className="flex flex-col sm:flex-col lg:flex-col">
                  <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-between lg:justify-start w-full">
                    {/* Rating */}
                    {anime?.score && (
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-yellow-400 font-semibold">
                          {formatScore(anime.score)}
                        </span>
                      </div>
                    )}

                    {/* Title */}
                    <h2 className="text-lg sm:text-xl lg:text-base font-bold mb-2 truncate">
                      {anime ? getPreferredTitle(anime) : 'Loading...'}
                    </h2>
                  </div>
                  {/* Film Stats */}
                  <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-3 sm:mb-4">
                    <div className="bg-orange-600 px-2 py-1 rounded text-xs font-bold">
                      PG-13
                    </div>
                    <div className="bg-blue-600 px-2 py-1 rounded text-xs font-bold">
                      HD
                    </div>
                    <div className="bg-green-600 px-2 py-1 rounded text-xs font-bold">
                      SUB {episodes.length}
                    </div>
                    <div className="bg-blue-600 px-2 py-1 rounded text-xs font-bold">
                      DUB {episodes.length}
                    </div>
                    <span className="text-gray-400 text-xs whitespace-nowrap">
                      • TV • 24m • {anime?.year || 'Unknown'} •{' '}
                      {anime?.status || 'Unknown'}
                    </span>
                  </div>
                  {/* Description */}
                  <div className="text-gray-300 text-sm leading-relaxed mb-3 sm:mb-4 overflow-hidden lg:max-h-32 lg:overflow-y-auto custom-scrollbar">
                    {anime?.synopsis
                      ? anime.synopsis.length > 150
                        ? anime.synopsis.substring(0, 100) + '...'
                        : anime.synopsis
                      : 'No description available.'}
                  </div>
                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center gap-2 sm:gap-4">
                    <button
                      onClick={handleBack}
                      className="bg-gray-700 hover:bg-gray-600 px-3 sm:px-4 py-2 rounded text-sm transition-colors whitespace-nowrap w-full lg:w-auto"
                    >
                      View detail
                    </button>
                    <div className="flex flex-wrap gap-1">
                      {anime?.genres?.slice(0, 6).map((genre) => (
                        <span
                          key={genre.mal_id}
                          className="bg-gray-700/50 text-gray-300 text-xs px-2 py-1 rounded-full hover:bg-blue-600/20 hover:text-blue-400 transition-colors cursor-pointer"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Section */}

      <RecommendationProp animeId={animeId} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
