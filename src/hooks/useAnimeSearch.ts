import { useQuery } from '@tanstack/react-query';
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

async function searchAnime(params: SearchParams): Promise<JikanResponse<JikanAnime[]>> {
  const { query, page = 1, type, status, genre, limit = 24 } = params;
  
  if (!query.trim()) {
    return { data: [], pagination: undefined };
  }

  try {
    // Add to search history
    addToSearchHistory(query.trim());
    
    // Use the jikanApi method
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
  return useQuery({
    queryKey: ['anime', 'search', params],
    queryFn: () => searchAnime(params),
    enabled: !!params.query?.trim(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry on rate limit errors
      if (error.message.includes('Rate limit')) return false;
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}