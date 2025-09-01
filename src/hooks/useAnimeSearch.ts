import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { JikanAnime, JikanResponse, jikanApi } from '../lib/jikan';
import { addToSearchHistory } from '../lib/searchHistory';

interface SearchParams {
  query: string;
  page?: number;
  type?: string;
  status?: string;
  genre?: string;
  limit?: number;
}

async function searchAnime(
  params: SearchParams
): Promise<JikanResponse<JikanAnime[]>> {
  const { query, page = 1, type, status, genre, limit = 24 } = params;

  if (!query.trim()) {
    return { data: [], pagination: undefined };
  }

  try {
    // Use the jikanApi method (no localStorage writes here!)
    const data = await jikanApi.searchAnime({
      query: query.trim(),
      page,
      type,
      status,
      genre,
      limit,
    });

    return data;
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
}

export function useAnimeSearch(params: SearchParams) {
  // Memoize the query key to prevent unnecessary re-renders
  const queryKey = useMemo(
    () => ['anime', 'search', params],
    [
      params.query,
      params.page,
      params.type,
      params.status,
      params.genre,
      params.limit,
    ]
  );

  return useQuery({
    queryKey,
    queryFn: () => searchAnime(params),
    enabled: !!params.query?.trim(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error: any) => {
      // Retry up to 3 times for search requests
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => {
      // Exponential backoff for search: 3s, 6s, 12s
      const delay = Math.min(3000 * 2 ** attemptIndex, 12000);
      console.log(`Retrying search in ${delay}ms (attempt ${attemptIndex + 1})`);
      return delay;
    },

    // ✅ Add to search history only AFTER success
    onSuccess: (_, vars) => {
      if (params.query?.trim()) {
        addToSearchHistory(params.query.trim());
      }
    },
  });
}
