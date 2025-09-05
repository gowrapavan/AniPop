import React, { useState } from 'react';
import { Twitter, Facebook, Copy } from 'lucide-react';
import { Footer } from '../components/Footer';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Play,
  Star,
  Calendar,
  Users,
  Eye,
  Heart,
  Share2,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  useAnimeDetails,
  useAnimeCharacters,
  useAnimeRecommendations,
  useRelatedAnime,
  useTrending, // ✅ add this
} from '../hooks/useAnimeData';

import { AnimeCard } from '../components/AnimeCard';
import { Header } from '../components/Header';
import { formatScore, getPreferredTitle } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { SEOHead } from '../components/SEOHead';

export function AnimeDetail() {
  const { malId } = useParams<{ malId: string }>();
  const navigate = useNavigate();

  const animeId = Number(malId);
  const { data: anime, isLoading, error } = useAnimeDetails(animeId);
  const { data: characters } = useAnimeCharacters(animeId);
  const { data: recommendations } = useAnimeRecommendations(animeId);
  const { data: trending } = useTrending();
  const combinedRecommendations = React.useMemo(() => {
    const recs = recommendations?.map((r) => r.entry) || [];
    const needed = 14 - recs.length;
    const trendingFill = trending?.slice(0, needed) || [];
    // fallback: if both empty, return trending alone (first 14)
    if (recs.length === 0 && trending?.length) {
      return trending.slice(0, 14);
    }
    return [...recs, ...trendingFill];
  }, [recommendations, trending]);

  const { data: relatedAnime = [] } = useRelatedAnime(anime);

  // mobile-only synopsis expander
  const [showFullSynopsis, setShowFullSynopsis] = useState(false);
  const SYNOPSIS_PREVIEW = 150;

  const handleWatchClick = () => {
    navigate(`/watch/anime/${malId}`);
  };

  const typeColors: Record<string, string> = {
    TV: 'bg-blue-500/20 text-blue-300',
    Movie: 'bg-red-500/20 text-red-300',
    OVA: 'bg-purple-500/20 text-purple-300',
    ONA: 'bg-pink-500/20 text-pink-300',
    Special: 'bg-green-500/20 text-green-300',
    Music: 'bg-yellow-500/20 text-yellow-300',
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = anime ? getPreferredTitle(anime) : 'Anime';

    switch (platform) {
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            title
          )}&url=${encodeURIComponent(url)}`
        );
        break;
      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`
        );
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <Header />
        <div className="pt-16 container mx-auto px-4 py-8">
          <div className="animate-pulse grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-3">
              <div className="h-96 bg-white/10 rounded-xl"></div>
            </div>
            <div className="lg:col-span-6">
              <div className="h-12 bg-white/10 rounded mb-4"></div>
              <div className="h-32 bg-white/10 rounded"></div>
            </div>
            <div className="lg:col-span-3">
              <div className="h-64 bg-white/10 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <SEOHead
          title="Anime Not Found - ANIPOP!"
          description="The anime you're looking for could not be found. Browse our collection of anime series and movies."
          noIndex={true}
        />
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto text-center"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-white/10 backdrop-blur rounded-full flex items-center justify-center">
              <Eye className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Anime Not Found</h2>
            <p className="text-gray-400 mb-6 leading-relaxed">
              The anime you're looking for doesn’t exist or has been removed.
            </p>
            <Button
              onClick={() => navigate('/')}
              variant="gradient"
              className="w-full shadow-glow"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back Home
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <SEOHead
        title={`${getPreferredTitle(anime)} - Watch Online Free`}
        description={anime.synopsis ? 
          `Watch ${getPreferredTitle(anime)} online for free. ${anime.synopsis.substring(0, 120)}...` :
          `Watch ${getPreferredTitle(anime)} anime online for free in HD quality with subtitles and dubbing.`
        }
        keywords={`${getPreferredTitle(anime)}, watch ${getPreferredTitle(anime)}, ${anime.genres?.map(g => g.name).join(', ')}, anime`}
        url={`https://anipop.netlify.app/anime/${anime.mal_id}`}
        image={anime.images.jpg.large_image_url}
        type="video.tv_show"
        structuredData={{
          "@context": "https://schema.org",
          "@type": anime.type === 'Movie' ? "Movie" : "TVSeries",
          "name": getPreferredTitle(anime),
          "alternateName": anime.title_japanese,
          "description": anime.synopsis,
          "image": anime.images.jpg.large_image_url,
          "datePublished": anime.aired?.from,
          "genre": anime.genres?.map(g => g.name),
          "aggregateRating": anime.score ? {
            "@type": "AggregateRating",
            "ratingValue": anime.score,
            "ratingCount": anime.scored_by,
            "bestRating": 10,
            "worstRating": 1
          } : undefined,
          "numberOfEpisodes": anime.episodes,
          "inLanguage": "ja",
          "subtitleLanguage": ["en", "ja"],
          "productionCompany": anime.studios?.map(s => ({
            "@type": "Organization",
            "name": s.name
          }))
        }}
      />
      <Header />

      <div className="pt-16">
        {/* Breadcrumb */}
        <div className="glass-effect border-b border-white/10">
          <div className="container mx-auto px-6 lg:px-8 py-3">
            <nav className="flex items-center space-x-2 text-sm">
              <Link
                to="/"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Home
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-500" />
              {anime.type && (
                <span
                  className={`text-blue-400 hover:text-blue-300 transition-colors ${anime.type}`}
                >
                  {anime.type}
                </span>
              )}
              <ChevronRight className="w-4 h-4 text-gray-500" />
              <span className="text-gray-300 truncate">
                {getPreferredTitle(anime)}
              </span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-6 lg:px-8 py-8">
          {/* ===================== MOBILE HEADER (ONLY) ===================== */}
          {/* Matches your requested layout, prevents overlay, keeps desktop intact */}
          <div className="block lg:hidden mb-8">
            <div
              className="
                grid grid-cols-[104px,1fr] gap-4 items-start
              "
            >
              {/* Poster spans all rows to the left, like your sketch */}
              <div className="row-span-4">
                <img
                  src={anime.images.jpg.large_image_url}
                  alt={getPreferredTitle(anime)}
                  className="w-[104px] h-[156px] object-cover rounded-xl shadow-glow"
                />
              </div>

              {/* Titles */}
              <div className="space-y-1">
                <h1 className="text-xl font-bold leading-tight">
                  {getPreferredTitle(anime)}
                </h1>
                {anime.title_japanese && (
                  <p className="text-gray-400 text-sm leading-tight">
                    {anime.title_japanese}
                  </p>
                )}
              </div>

              {/* Status (e.g., Currently Airing) */}
              <div className="flex items-center gap-2">
                {anime.status && (
                  <span className="bg-green-600/20 text-green-400 px-2 py-1 rounded-full text-xs font-semibold">
                    {anime.status}
                  </span>
                )}
              </div>

              {/* Score + TV + Episodes */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {typeof anime.score === 'number' && (
                  <span className="inline-flex items-center gap-1 bg-yellow-500/20 px-2 py-1 rounded-full">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    {formatScore(anime.score)}
                  </span>
                )}
                {anime.type && (
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      typeColors[anime.type] || 'bg-gray-700/50 text-gray-300'
                    }`}
                  >
                    {anime.type}
                  </span>
                )}

                {anime.episodes && (
                  <span className="bg-gray-700/50 px-2 py-1 rounded-full">
                    {anime.episodes} Episodes
                  </span>
                )}
              </div>

              {/* Share row */}
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-sm font-medium">
                  Share:
                </span>
                <Button
                  size="icon"
                  className="glass-effect"
                  onClick={() => handleShare('twitter')}
                >
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  className="glass-effect"
                  onClick={() => handleShare('facebook')}
                >
                  <Facebook className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  className="glass-effect"
                  onClick={() => handleShare('copy')}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  className="shadow-glow"
                >
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Watch Now (full width under the grid) */}
            <div className="mt-4">
              {anime.status === 'Not yet aired' ? (
                <Button
                  disabled
                  variant="gradient"
                  icon={<Calendar className="w-5 h-5" />}
                  iconPosition="left"
                  className="w-full shadow-glow opacity-90 cursor-default"
                >
                  {anime.aired?.from
                    ? `Releases on ${new Date(
                        anime.aired.from
                      ).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}`
                    : 'Release date TBA'}
                </Button>
              ) : (
                <Button
                  onClick={handleWatchClick}
                  variant="gradient"
                  icon={<Play className="w-5 h-5" />}
                  iconPosition="left"
                  className="w-full shadow-glow"
                >
                  Watch Now
                </Button>
              )}
            </div>

            {/* Synopsis (truncated with "More") */}
            <div className="glass-effect rounded-xl p-4 mt-4">
              <h2 className="text-lg font-semibold mb-2">Synopsis</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                {showFullSynopsis || !anime.synopsis
                  ? anime.synopsis || 'No synopsis available.'
                  : `${anime.synopsis.slice(0, SYNOPSIS_PREVIEW)}${
                      anime.synopsis.length > SYNOPSIS_PREVIEW ? '…' : ''
                    }`}
              </p>
              {anime.synopsis && anime.synopsis.length > SYNOPSIS_PREVIEW && (
                <button
                  className="text-blue-400 mt-2 text-sm font-semibold"
                  onClick={() => setShowFullSynopsis((s) => !s)}
                >
                  {showFullSynopsis ? 'Show Less' : 'More'}
                </button>
              )}
            </div>
          </div>
          {/* =================== END MOBILE HEADER (ONLY) =================== */}

          {/* ================= DESKTOP SECTION (UNCHANGED) ================= */}
          <div className="hidden lg:grid grid-cols-12 gap-8 mb-12">
            {/* Left: Poster */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-3 lg:sticky lg:top-20 space-y-6"
            >
              <img
                src={anime.images.jpg.large_image_url}
                alt={getPreferredTitle(anime)}
                className="w-full max-w-[300px] mx-auto lg:mx-0 rounded-xl shadow-glow"
              />

              {/* Genres */}
              {anime.genres?.length > 0 && (
                <div className="glass-effect max-w-[300px] rounded-xl p-4">
                  <h3 className="text-lg font-semibold mb-4">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {anime.genres.map((genre) => (
                      <Link
                        key={genre.mal_id}
                        to={`/genre/${encodeURIComponent(genre.name)}`}
                        className="bg-primary-500/20 border border-primary-500/40 px-4 py-2 rounded-full text-sm cursor-pointer text-primary-300 hover:bg-primary-500/30 hover:border-primary-400 transition-all"
                      >
                        {genre.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Middle: Title + Synopsis */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-6 space-y-6"
            >
              {/* Title + CTA */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                    {getPreferredTitle(anime)}
                  </h1>
                  {anime.title_japanese &&
                    anime.title_japanese !== anime.title && (
                      <p className="text-gray-400 text-lg">
                        {anime.title_japanese}
                      </p>
                    )}
                </div>
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-3">
                {anime.score && (
                  <div className="flex items-center gap-1 bg-yellow-500/20 px-3 py-1.5 rounded-full">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-yellow-400 font-medium">
                      {formatScore(anime.score)}
                    </span>
                  </div>
                )}
                {anime.type && (
                  <span
                    className={`px-3 py-1.5 rounded-full text-sm font-bold shadow-glow-sm ${
                      typeColors[anime.type] || 'bg-gray-700/50 text-gray-300'
                    }`}
                  >
                    {anime.type}
                  </span>
                )}

                {anime.status && (
                  <span className="bg-green-500/20 px-3 py-1.5 rounded-full text-sm font-bold text-green-400">
                    {anime.status}
                  </span>
                )}
                {anime.episodes && (
                  <div className="flex items-center gap-1 text-gray-300">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">{anime.episodes} Episodes</span>
                  </div>
                )}
                {anime.year && (
                  <div className="flex items-center gap-1 text-gray-300">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{anime.year}</span>
                  </div>
                )}
              </div>

              {/* Share */}
              <div className="flex items-center gap-3">
                {anime.status === 'Not yet aired' ? (
                  <Button
                    disabled
                    variant="gradient"
                    className="shadow-glow flex items-center gap-2 opacity-90 cursor-default"
                    icon={<Calendar className="w-5 h-5" />}
                    iconPosition="left"
                  >
                    {anime.aired?.from
                      ? `Releases on ${new Date(
                          anime.aired.from
                        ).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}`
                      : 'Release date TBA'}
                  </Button>
                ) : (
                  <Button
                    onClick={handleWatchClick}
                    variant="gradient"
                    className="shadow-glow flex items-center gap-2"
                    icon={<Play className="w-5 h-5" />}
                    iconPosition="left"
                  >
                    Watch Now
                  </Button>
                )}

                <span className="text-gray-400 text-sm font-medium">
                  Share:
                </span>
                <Button
                  size="icon"
                  className="glass-effect"
                  onClick={() => handleShare('twitter')}
                >
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  className="glass-effect"
                  onClick={() => handleShare('facebook')}
                >
                  <Facebook className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  className="glass-effect"
                  onClick={() => handleShare('copy')}
                >
                  <Copy className="w-4 h-4" />
                </Button>

                <Button
                  size="icon"
                  variant="destructive"
                  className="shadow-glow"
                >
                  <Heart className="w-4 h-4" />
                </Button>
              </div>

              {/* Synopsis */}
              <div className="glass-effect rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Synopsis</h2>
                <p className="text-gray-300 leading-relaxed">
                  {anime.synopsis || 'No synopsis available.'}
                </p>
              </div>
            </motion.div>

            {/* Right: Trailer + Related */}
            <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-20">
              {anime.trailer?.youtube_id && (
                <div className="glass-effect rounded-xl overflow-hidden">
                  <div className="p-4 border-b border-white/10">
                    <h3 className="text-lg font-semibold">Trailer</h3>
                  </div>
                  <div className="aspect-video">
                    <iframe
                      src={`https://www.youtube.com/embed/${anime.trailer.youtube_id}`}
                      title="Anime Trailer"
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              <div className="glass-effect rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Overview</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Type:</span>
                    {anime.type && (
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-semibold ${
                          typeColors[anime.type] ||
                          'bg-gray-700/50 text-gray-300'
                        }`}
                      >
                        {anime.type}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className="text-white">{anime.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Episodes:</span>
                    <span className="text-white">{anime.episodes}</span>
                  </div>
                  {anime.duration && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Duration:</span>
                      <span className="text-white">{anime.duration}</span>
                    </div>
                  )}
                  {anime.aired?.string && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Aired:</span>
                      <span className="text-white">{anime.aired.string}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* ================= END DESKTOP SECTION (UNCHANGED) ============== */}

          {/* Characters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Users className="w-6 h-6" />
              Characters
            </h2>
            <div className="flex gap-0 overflow-x-auto pb-2 scrollbar-hide">
              {characters?.slice(0, 12).map((char) => (
                <div
                  key={char.character.mal_id}
                  className="flex-shrink-0 w-32 flex flex-col items-center text-center 
                   glass-effect  p-2 hover:bg-white/10 transition cursor-pointer"
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/20 mb-3">
                    <img
                      src={char.character.images.jpg.image_url}
                      alt={char.character.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-medium text-sm text-white truncate w-full">
                    {char.character.name}
                  </h4>
                  <p className="text-xs text-gray-400">{char.role}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {relatedAnime.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                Related Anime
              </h2>
              <div
                className="
                  grid grid-cols-2
                  sm:grid-cols-3
                  md:grid-cols-4
                  min-[900px]:grid-cols-5
                  lg:grid-cols-6
                  xl:grid-cols-7
                  gap-3
                "
              >
                {relatedAnime.slice(0, 14).map((rec) => (
                  <AnimeCard key={rec.mal_id} anime={rec} />
                ))}
              </div>
            </motion.div>
          )}

          {/* Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              Recommended for You
            </h2>
            <div
              className="
                grid grid-cols-2
                sm:grid-cols-3
                md:grid-cols-4
                min-[900px]:grid-cols-5
                lg:grid-cols-6
                xl:grid-cols-7
                gap-3
              "
            >
              {combinedRecommendations.map((anime) => (
                <AnimeCard key={anime.mal_id} anime={anime} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />

      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
