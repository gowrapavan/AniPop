import { useQuery } from '@tanstack/react-query';
import {
  jikanApi,
  JikanAnime,
  JikanCharacter,
  JikanRecommendation,
} from '../lib/jikan';
import {
  resolveAnimeDataIdByTitle,
  resolveAnimeDataIdWithFallback,
  fetchEpisodeList,
  EpisodeItem,
} from '../lib/hianime';
import {
  getCacheItem,
  setCacheItem,
  getMemoryCache,
  setMemoryCache,
} from '../lib/cache';

// Enhanced query options with better retry logic
const defaultQueryOptions = {
  staleTime: 10 * 60 * 1000, // 10 minutes
  gcTime: 30 * 60 * 1000, // 30 minutes
  retry: (failureCount: number, error: any) => {
    // Retry up to 5 times for all errors including rate limits
    return failureCount < 5;
  },
  retryDelay: (attemptIndex: number) => {
    // Exponential backoff: 2s, 4s, 8s, 16s, 32s
    const delay = Math.min(2000 * 2 ** attemptIndex, 32000);
    console.log(`Retrying in ${delay}ms (attempt ${attemptIndex + 1})`);
    return delay;
  },
  refetchOnWindowFocus: false,
  refetchOnReconnect: true,
};
export function useTopAiring() {
  return useQuery({
    queryKey: ['anime', 'top-airing'],
    queryFn: async () => {
      const response = await jikanApi.getTopAiring();
      return response.data;
    },
    ...defaultQueryOptions,
  });
}

export function useTrending() {
  return useQuery({
    queryKey: ['anime', 'trending'],
    queryFn: async () => {
      const response = await jikanApi.getTrending();
      return response.data;
    },
    ...defaultQueryOptions,
  });
}

export function useMostPopular() {
  return useQuery({
    queryKey: ['anime', 'most-popular'],
    queryFn: async () => {
      const response = await jikanApi.getMostPopular();
      return response.data;
    },
    ...defaultQueryOptions,
  });
}

export function useMostFavorite() {
  return useQuery({
    queryKey: ['anime', 'most-favorite'],
    queryFn: async () => {
      const response = await jikanApi.getMostFavorite();
      return response.data;
    },
    ...defaultQueryOptions,
  });
}

export function useLatestCompleted() {
  return useQuery({
    queryKey: ['anime', 'latest-completed'],
    queryFn: async () => {
      const response = await jikanApi.getLatestCompleted();
      return response.data || [];
    },
    ...defaultQueryOptions,
  });
}

export function useAnimeDetails(malId: number) {
  return useQuery({
    queryKey: ['anime', 'details', malId],
    queryFn: async () => {
      const response = await jikanApi.getAnimeDetails(malId);
      return response.data;
    },
    enabled: !!malId,
    staleTime: 15 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}

export function useAnimeCharacters(malId: number) {
  return useQuery({
    queryKey: ['anime', 'characters', malId],
    queryFn: async () => {
      const response = await jikanApi.getCharacters(malId);
      return response.data;
    },
    enabled: !!malId,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}

export function useAnimeRecommendations(malId: number) {
  return useQuery({
    queryKey: ['anime', 'recommendations', malId],
    queryFn: async () => {
      const response = await jikanApi.getRecommendations(malId);
      return response.data;
    },
    enabled: !!malId,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}

export function useAnimeDataId(title?: string) {
  return useQuery({
    queryKey: ['hianime', 'data-id', title],
    queryFn: async () => {
      if (!title) return null;

      console.log('Resolving anime data ID for:', title);
      const dataId = await resolveAnimeDataIdByTitle(title);
      console.log('Resolved data ID:', dataId);
      return dataId;
    },
    enabled: !!title,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useEnhancedAnimeDataId(title?: string, anime?: any) {
  return useQuery({
    queryKey: ['hianime', 'enhanced-data-id', title, anime?.mal_id],
    queryFn: async () => {
      if (!title) return null;

      const metadata = anime
        ? {
            type: anime.type,
            year: anime.year,
            season: anime.season,
            episodes: anime.episodes,
          }
        : undefined;

      console.log(
        'Enhanced resolving anime data ID for:',
        title,
        'with metadata:',
        metadata
      );
      const result = await resolveAnimeDataIdWithFallback(title, metadata);
      console.log('Enhanced resolved result:', result);
      return result;
    },
    enabled: !!title,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useEpisodeList(animeDataId?: string) {
  return useQuery({
    queryKey: ['hianime', 'episodes', animeDataId],
    queryFn: async () => {
      if (!animeDataId) return [];
      console.log('Fetching episodes for data ID:', animeDataId);
      const episodes = await fetchEpisodeList(animeDataId);
      console.log('Fetched episodes:', episodes.length);
      return episodes;
    },
    enabled: !!animeDataId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useEnhancedEpisodeList(animeDataResult?: {
  dataId: string | null;
  confidence: number;
}) {
  return useQuery({
    queryKey: ['hianime', 'enhanced-episodes', animeDataResult?.dataId],
    queryFn: async () => {
      if (!animeDataResult?.dataId) return [];
      console.log(
        'Fetching episodes for enhanced data ID:',
        animeDataResult.dataId
      );
      const episodes = await fetchEpisodeList(animeDataResult.dataId);
      console.log('Fetched episodes:', episodes.length);
      return episodes;
    },
    enabled: !!animeDataResult?.dataId && animeDataResult.confidence > 0.5,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useAnimeByGenre(genres: number[] = [], type: string = '') {
  return useQuery({
    queryKey: ['anime', 'by-genre', genres, type],
    queryFn: async () => {
      if (genres.length === 0 && !type) return [];

      // Use Jikan API search by genre or type
      const genreQuery = genres.length > 0 ? `genres=${genres.join(',')}` : '';
      const typeQuery = type ? `type=${type.toLowerCase()}` : '';
      const queryString = [genreQuery, typeQuery].filter(Boolean).join('&');

      try {
        const response = await jikanApi.getAnimeList({ query: queryString });
        return response.data || [];
      } catch (err) {
        console.error('Error fetching fallback anime by genre/type:', err);
        return [];
      }
    },
    enabled: genres.length > 0 || !!type,
    staleTime: 30 * 60 * 1000, // 30 mins
    gcTime: 60 * 60 * 1000,
  });
}

export function useRelatedAnime(anime: any) {
  return useQuery({
    queryKey: ['anime', 'related', anime?.mal_id],
    queryFn: async () => {
      if (!anime?.title) return [];

      const normalizedTitle = anime.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');

      // 1. Try search by title
      const searchResponse = await fetch(
        `https://api.jikan.moe/v4/anime?q=${normalizedTitle}&limit=14&sfw`
      );
      const searchData = await searchResponse.json();
      let results = (searchData.data || []).filter(
        (r: any) => r.mal_id !== anime.mal_id
      );

      // 2. Only if no results, use fallback
      if (!results.length) {
        const recResponse = await jikanApi.getRecommendations(anime.mal_id);
        results =
          recResponse.data?.map((rec: any) => rec.entry).filter(Boolean) || [];
      }

      return results;
    },
    enabled: !!anime?.mal_id,
    // ⬇️ Ensures it always refetches when anime changes, not reuses old data
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 0,
    gcTime: 30 * 60 * 1000,
  });
}
