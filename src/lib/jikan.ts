export const JIKAN_BASE = 'https://api.jikan.moe/v4';

export interface JikanAnime {
  mal_id: number;
  title: string;
  title_english?: string;
  title_japanese?: string;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  score?: number;
  scored_by?: number;
  rank?: number;
  popularity?: number;
  synopsis?: string;
  background?: string;
  season?: string;
  year?: number;
  status: string;
  episodes?: number;
  duration?: string;
  rating?: string;
  genres: Array<{ mal_id: number; name: string; type: string; url: string }>;
  studios: Array<{ mal_id: number; name: string; type: string; url: string }>;
  producers: Array<{ mal_id: number; name: string; type: string; url: string }>;
  aired: {
    from?: string;
    to?: string;
    string: string;
  };
  trailer?: {
    youtube_id?: string;
    url?: string;
    embed_url?: string;
  };
  relations?: JikanRelation[];
}

export interface JikanRelation {
  relation: string;
  entry: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
}

export interface JikanResponse<T> {
  data: T;
  pagination?: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items: {
      count: number;
      total: number;
      per_page: number;
    };
  };
}

export interface JikanCharacter {
  character: {
    mal_id: number;
    name: string;
    images: {
      jpg: {
        image_url: string;
      };
    };
  };
  role: string;
  voice_actors: Array<{
    person: {
      mal_id: number;
      name: string;
      images: {
        jpg: {
          image_url: string;
        };
      };
    };
    language: string;
  }>;
}

export interface JikanRecommendation {
  entry: {
    mal_id: number;
    title: string;
    images: {
      jpg: {
        image_url: string;
        small_image_url: string;
        large_image_url: string;
      };
    };
  };
  votes: number;
}

async function fetchJikan<T>(endpoint: string): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
  
  try {
    const response = await fetch(`${JIKAN_BASE}${endpoint}`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'HiAnime-App/1.0'
      }
    });
    
    clearTimeout(timeoutId);
    
  if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
    throw new Error(`Jikan API error: ${response.status}`);
  }
  return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout. Please try again.');
    }
    throw error;
  }
}

export const jikanApi = {
  getTopAiring: () => fetchJikan<JikanResponse<JikanAnime[]>>('/top/anime?filter=airing&limit=20'),
  getMostPopular: () => fetchJikan<JikanResponse<JikanAnime[]>>('/top/anime?filter=bypopularity&limit=20'),
  getMostFavorite: () => fetchJikan<JikanResponse<JikanAnime[]>>('/top/anime?filter=favorite&limit=20'),
  getLatestCompleted: () => fetchJikan<JikanResponse<JikanAnime[]>>('/top/anime?filter=completed&limit=20'),
  getTrending: () => fetchJikan<JikanResponse<JikanAnime[]>>('/seasons/now?limit=20'),
  getAnimeDetails: (malId: number) => fetchJikan<JikanResponse<JikanAnime>>(`/anime/${malId}/full`),
  getCharacters: (malId: number) => fetchJikan<JikanResponse<JikanCharacter[]>>(`/anime/${malId}/characters`),
  getRecommendations: (malId: number) => fetchJikan<JikanResponse<JikanRecommendation[]>>(`/anime/${malId}/recommendations`),
  searchAnime: (params: { query: string; page?: number; type?: string; status?: string; genre?: string; limit?: number }) => {
    const searchParams = new URLSearchParams({
      q: params.query,
      page: (params.page || 1).toString(),
      limit: (params.limit || 24).toString(),
      order_by: 'score',
      sort: 'desc',
    });
    
    if (params.type) searchParams.append('type', params.type);
    if (params.status) searchParams.append('status', params.status);
    if (params.genre) searchParams.append('genres', params.genre);
    
    return fetchJikan<JikanResponse<JikanAnime[]>>(`/anime?${searchParams.toString()}`);
  },
};