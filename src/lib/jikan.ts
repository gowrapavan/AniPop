export const JIKAN_BASE = 'https://api.jikan.moe/v4';

export interface JikanAnime {
  mal_id: number;
  url?: string;
  approved?: boolean;

  // Titles
  title: string;
  title_english?: string;
  title_japanese?: string;
  titles?: Array<{ type: string; title: string }>;
  title_synonyms?: string[];

  // Media Info
  type?: string;
  source?: string;
  status: string;
  airing?: boolean;
  episodes?: number;
  duration?: string;
  rating?: string;

  // Dates
  season?: string;
  year?: number;
  aired: {
    from?: string;
    to?: string;
    string: string;
  };
  broadcast?: {
    day?: string | null;
    time?: string | null;
    timezone?: string | null;
    string?: string | null;
  };

  // Stats
  score?: number;
  scored_by?: number;
  rank?: number;
  popularity?: number;
  members?: number;
  favorites?: number;

  // Description
  synopsis?: string;
  background?: string;

  // Media Assets
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  trailer?: {
    youtube_id?: string;
    url?: string;
    embed_url?: string;
  };

  // People / Studios / Genres
  genres: Array<{ mal_id: number; name: string; type: string; url: string }>;
  explicit_genres?: Array<{
    mal_id: number;
    name: string;
    type: string;
    url: string;
  }>;
  themes?: Array<{ mal_id: number; name: string; type: string; url: string }>;
  demographics?: Array<{
    mal_id: number;
    name: string;
    type: string;
    url: string;
  }>;
  studios: Array<{ mal_id: number; name: string; type: string; url: string }>;
  producers: Array<{ mal_id: number; name: string; type: string; url: string }>;
  licensors?: Array<{
    mal_id: number;
    name: string;
    type: string;
    url: string;
  }>;

  // Relations
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
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

  try {
    const response = await fetch(`${JIKAN_BASE}${endpoint}`, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'User-Agent': 'HiAnime-App/1.0',
        'Cache-Control': 'no-cache',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error(
          'Rate limit exceeded. Please wait a moment and try again.'
        );
      }
      if (response.status >= 500) {
        throw new Error('Server error. Please try again in a few moments.');
      }
      throw new Error(`Jikan API error: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(
        'Request timeout. The server is taking too long to respond.'
      );
    }
    throw error;
  }
}
export const jikanApi = {
  getTopToday: () =>
    fetchJikan<JikanResponse<JikanAnime[]>>('/top/anime?limit=10'), // default top 10
  getTopWeek: () =>
    fetchJikan<JikanResponse<JikanAnime[]>>(
      '/top/anime?filter=bypopularity&limit=10'
    ),
  getTopMonth: () =>
    fetchJikan<JikanResponse<JikanAnime[]>>(
      '/top/anime?filter=favorite&limit=10'
    ),

  getTopAiring: () =>
    fetchJikan<JikanResponse<JikanAnime[]>>(
      '/top/anime?filter=airing&limit=20'
    ),
  getMostPopular: () =>
    fetchJikan<JikanResponse<JikanAnime[]>>(
      '/top/anime?filter=bypopularity&limit=20'
    ),
  getMostFavorite: () =>
    fetchJikan<JikanResponse<JikanAnime[]>>(
      '/top/anime?filter=favorite&limit=20'
    ),
  getLatestCompleted: () =>
    fetchJikan<JikanResponse<JikanAnime[]>>(
      '/top/anime?filter=completed&limit=20'
    ),
  getTrending: () =>
    fetchJikan<JikanResponse<JikanAnime[]>>('/seasons/now?limit=20'),
  getAnimeDetails: (malId: number) =>
    fetchJikan<JikanResponse<JikanAnime>>(`/anime/${malId}/full`),
  getCharacters: (malId: number) =>
    fetchJikan<JikanResponse<JikanCharacter[]>>(`/anime/${malId}/characters`),
  getRecommendations: (malId: number) =>
    fetchJikan<JikanResponse<JikanRecommendation[]>>(
      `/anime/${malId}/recommendations`
    ),
  searchAnime: (params: {
    query: string;
    page?: number;
    type?: string;
    status?: string;
    genre?: string;
    limit?: number;
  }) => {
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

    return fetchJikan<JikanResponse<JikanAnime[]>>(
      `/anime?${searchParams.toString()}`
    );
  },

  // ✅ Fetch a list of anime (generic, paginated)
  getAnimeList: (page: number = 1, limit: number = 24) =>
    fetchJikan<JikanResponse<JikanAnime[]>>(
      `/anime?page=${page}&limit=${limit}`
    ),

  // ✅ Fetch recommendations for a specific anime
  getAnimeRecommendations: (malId: number) =>
    fetchJikan<JikanResponse<JikanRecommendation[]>>(
      `/anime/${malId}/recommendations`
    ),
};
