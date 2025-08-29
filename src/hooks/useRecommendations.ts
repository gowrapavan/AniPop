import { useQuery } from '@tanstack/react-query';
import { JikanAnime, jikanApi } from '../lib/jikan';
import { getCacheItem, setCacheItem } from '../lib/cache';

interface RecommendationResult {
  recommendations: JikanAnime[];
  recommendationType: 'related' | 'genre' | 'jikan' | 'top';
}

async function fetchRecommendations(
  animeId: number
): Promise<RecommendationResult> {
  const cacheKey = `recommendations_${animeId}`;
  const cached = getCacheItem<RecommendationResult>(cacheKey);

  if (cached) {
    console.log('Using cached recommendations:', cached.recommendationType);
    return cached;
  }

  console.log('Fetching fresh recommendations for anime ID:', animeId);

  try {
    // Step 1: Get anime details
    const animeDetails = await jikanApi.getAnimeDetails(animeId);
    const anime = animeDetails.data;

    // Step 2: Fetch related anime (sequels, prequels, etc.)
    if (anime.relations && anime.relations.length > 0) {
      const relatedIds = anime.relations
        .filter((relation) =>
          ['Sequel', 'Prequel', 'Spin-off', 'Side story'].includes(
            relation.relation
          )
        )
        .map((relation) => relation.entry.mal_id);

      if (relatedIds.length > 0) {
        const relatedAnime = await Promise.allSettled(
          relatedIds.map((id) => jikanApi.getAnimeDetails(id))
        );

        const validRelated = relatedAnime
          .filter((result) => result.status === 'fulfilled')
          .map((result) => result.value);

        if (validRelated.length > 0) {
          const result = {
            recommendations: validRelated,
            recommendationType: 'related' as const,
          };
          setCacheItem(cacheKey, result, 30 * 60 * 1000); // Cache for 30 minutes
          return result;
        }
      }
    }

    // Step 3: Fetch genre-based recommendations if no related anime found
    if (anime.genres && anime.genres.length > 0) {
      const genreIds = anime.genres.slice(0, 2).map((g) => g.mal_id);
      const genreQuery = genreIds.join(',');

      const genreResponse = await jikanApi.getAnimeList({
        query: `genres=${genreQuery}&order_by=score&sort=desc&limit=15`,
      });

      const genreRecommendations = genreResponse.data.filter(
        (a: JikanAnime) => a.mal_id !== animeId
      );
      if (genreRecommendations.length > 0) {
        const result = {
          recommendations: genreRecommendations,
          recommendationType: 'genre' as const,
        };
        setCacheItem(cacheKey, result, 30 * 60 * 1000); // Cache for 30 minutes
        return result;
      }
    }

    // Step 4: Fallback to top anime if no related or genre-based recommendations
    const topAnimeResponse = await jikanApi.getMostPopular();
    const topAnime = topAnimeResponse.data
      .filter((a: JikanAnime) => a.mal_id !== animeId)
      .slice(0, 12);

    const result = {
      recommendations: topAnime,
      recommendationType: 'top' as const,
    };
    setCacheItem(cacheKey, result, 60 * 60 * 1000); // Cache for 1 hour
    return result;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return { recommendations: [], recommendationType: 'top' as const };
  }
}

export function useRecommendations(animeId: number) {
  return useQuery({
    queryKey: ['recommendations', animeId],
    queryFn: () => fetchRecommendations(animeId),
    enabled: !!animeId,
    staleTime: 30 * 60 * 1000, // Cache for 30 minutes
    retry: 2,
    refetchOnWindowFocus: false,
    select: (data) => ({
      recommendations: data.recommendations,
      recommendationType: data.recommendationType,
      isLoading: false,
      error: null,
    }),
  });
}
