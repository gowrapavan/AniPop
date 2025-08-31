export const PROXY = 'https://tv-stream-proxy.onrender.com/proxy?url=';
import stringSimilarity from 'string-similarity';

export async function hFetch(target: string, timeout = 10000): Promise<string> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const proxyUrl = PROXY + encodeURIComponent(target);
    const res = await fetch(proxyUrl, {
      signal: controller.signal,
      headers: {
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const text = await res.text();
    return text;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  } finally {
    clearTimeout(id);
  }
}

export type ServerQuality = 'HD-1' | 'HD-2' | 'HD-3';

export function playerSrc(
  epId: string,
  lang: 'sub' | 'dub' = 'sub',
  quality: ServerQuality = 'HD-1'
): string {
  let baseUrl = '';

  switch (quality) {
    case 'HD-1':
      baseUrl = 'https://megaplay.buzz/stream/s-4';
      break;
    case 'HD-2':
      baseUrl = 'https://megaplay.buzz/stream/s-2';
      break;
    case 'HD-3':
      baseUrl = 'https://megacloud.bloggy.click/stream/s-3';
      break;
  }

  return `${baseUrl}/${epId}/${lang}`;
}

interface AnimeMetadata {
  type?: string; // 'TV' | 'Movie' | 'OVA' | 'Special'
  year?: number;
  season?: string;
  episodes?: number;
}

interface MatchCandidate {
  dataId: string;
  title: string;
  normalizedTitle: string;
  similarity: number;
  typeMatch: boolean;
  yearMatch: boolean;
  seasonMatch: boolean;
  totalScore: number;
}

export async function resolveAnimeDataIdByTitle(
  title: string,
  metadata?: AnimeMetadata
): Promise<string | null> {
  try {
    console.log('Searching for anime:', title, 'with metadata:', metadata);
    const searchUrl = `https://hianimez.is/search?keyword=${encodeURIComponent(
      title
    )}`;
    const html = await hFetch(searchUrl);

    const temp = document.createElement('div');
    temp.innerHTML = html;

    const results = temp.querySelectorAll('a.film-poster-ahref');
    console.log('Found search results:', results.length);

    if (results.length === 0) return null;

    const normalizeTitle = (str: string) =>
      str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, ' ')
        .replace(/\b(the|a|an)\b/g, '') // Remove articles
        .trim();

    const searchTerm = normalizeTitle(title);
    const candidates: MatchCandidate[] = [];

    // Collect and score all candidates
    results.forEach((result) => {
      const resultTitle = result.getAttribute('title');
      const dataId = result.getAttribute('data-id');

      if (!resultTitle || !dataId) return;

      const normalizedResult = normalizeTitle(resultTitle);

      // Calculate string similarity
      const similarity = stringSimilarity.compareTwoStrings(
        normalizedResult,
        searchTerm
      );

      // Check metadata matches
      const typeMatch = checkTypeMatch(resultTitle, metadata?.type);
      const yearMatch = checkYearMatch(resultTitle, metadata?.year);
      const seasonMatch = checkSeasonMatch(
        resultTitle,
        metadata?.season,
        title
      );

      // Calculate total score with weighted factors
      let totalScore = similarity * 0.6; // Base similarity weight

      if (typeMatch) totalScore += 0.2; // Type match bonus
      if (yearMatch) totalScore += 0.1; // Year match bonus
      if (seasonMatch) totalScore += 0.1; // Season match bonus

      // Penalty for obvious mismatches
      if (metadata?.type === 'Movie' && isSeasonTitle(resultTitle)) {
        totalScore -= 0.3; // Heavy penalty for movie vs season mismatch
      }
      if (metadata?.type === 'TV' && isMovieTitle(resultTitle)) {
        totalScore -= 0.3; // Heavy penalty for TV vs movie mismatch
      }

      candidates.push({
        dataId,
        title: resultTitle,
        normalizedTitle: normalizedResult,
        similarity,
        typeMatch,
        yearMatch,
        seasonMatch,
        totalScore,
      });
    });

    if (candidates.length === 0) return null;

    // Sort by total score (highest first)
    candidates.sort((a, b) => b.totalScore - a.totalScore);

    console.log(
      'Top candidates:',
      candidates.slice(0, 3).map((c) => ({
        title: c.title,
        similarity: c.similarity.toFixed(3),
        totalScore: c.totalScore.toFixed(3),
        typeMatch: c.typeMatch,
        yearMatch: c.yearMatch,
        seasonMatch: c.seasonMatch,
      }))
    );

    const bestMatch = candidates[0];

    // Only return if we have a reasonable confidence
    if (bestMatch.totalScore >= 0.4) {
      console.log(
        'Best match selected:',
        bestMatch.title,
        'Score:',
        bestMatch.totalScore.toFixed(3)
      );
      return bestMatch.dataId;
    }

    console.log(
      'No confident match found. Best score:',
      bestMatch.totalScore.toFixed(3)
    );
    return null;
  } catch (error) {
    console.error('Error resolving anime data ID:', error);
    return null;
  }
}

function checkTypeMatch(resultTitle: string, expectedType?: string): boolean {
  if (!expectedType) return false;

  const title = resultTitle.toLowerCase();

  switch (expectedType.toLowerCase()) {
    case 'movie':
      return isMovieTitle(resultTitle);
    case 'tv':
      return !isMovieTitle(resultTitle) && !isOVATitle(resultTitle);
    case 'ova':
    case 'special':
      return isOVATitle(resultTitle);
    default:
      return false;
  }
}

function checkYearMatch(resultTitle: string, expectedYear?: number): boolean {
  if (!expectedYear) return false;

  // Extract year from title if present
  const yearMatch = resultTitle.match(/\b(19|20)\d{2}\b/);
  if (!yearMatch) return false;

  const titleYear = parseInt(yearMatch[0]);
  return Math.abs(titleYear - expectedYear) <= 1; // Allow 1 year difference
}

function checkSeasonMatch(
  resultTitle: string,
  expectedSeason?: string,
  originalTitle?: string
): boolean {
  if (!expectedSeason && !originalTitle) return false;

  const title = resultTitle.toLowerCase();
  const original = originalTitle?.toLowerCase() || '';

  // Check for season indicators
  const hasSeasonNumber = /season\s*(\d+|ii+|2nd|3rd|4th)/i.test(title);
  const hasSequelWords = /(season|part|series|cour)\s*(\d+|ii+|2nd|3rd)/i.test(
    title
  );

  // If original title suggests first season/movie, avoid sequels
  if (!hasSeasonIndicators(original) && (hasSeasonNumber || hasSequelWords)) {
    return false;
  }

  return true;
}

function hasSeasonIndicators(title: string): boolean {
  return /season|part|series|cour|\d+(nd|rd|th)|ii+/i.test(title);
}

function isMovieTitle(title: string): boolean {
  const movieKeywords = [
    'movie',
    'film',
    'gekijouban',
    'gekijo-ban',
    'the movie',
    'infinity castle',
    'mugen train',
  ];
  const titleLower = title.toLowerCase();
  return movieKeywords.some((keyword) => titleLower.includes(keyword));
}

function isOVATitle(title: string): boolean {
  const ovaKeywords = ['ova', 'special', 'ona', 'extra'];
  const titleLower = title.toLowerCase();
  return ovaKeywords.some((keyword) => titleLower.includes(keyword));
}

function isSeasonTitle(title: string): boolean {
  const seasonKeywords = [
    'season',
    'part',
    'series',
    'cour',
    '2nd',
    '3rd',
    '4th',
    'ii',
    'iii',
    'iv',
  ];
  const titleLower = title.toLowerCase();
  return seasonKeywords.some((keyword) => titleLower.includes(keyword));
}

// Enhanced function for better anime type detection
export function detectAnimeType(title: string): string | undefined {
  if (isMovieTitle(title)) return 'Movie';
  if (isOVATitle(title)) return 'OVA';
  if (isSeasonTitle(title)) return 'TV';
  return undefined;
}

// Function to extract season number from title
export function extractSeasonNumber(title: string): number | undefined {
  const seasonMatch = title.match(/season\s*(\d+)|(\d+)(nd|rd|th)\s*season/i);
  if (seasonMatch) {
    return parseInt(seasonMatch[1] || seasonMatch[2]);
  }

  const romanMatch = title.match(/\b(ii|iii|iv|v)\b/i);
  if (romanMatch) {
    const romanNumerals: Record<string, number> = {
      ii: 2,
      iii: 3,
      iv: 4,
      v: 5,
    };
    return romanNumerals[romanMatch[1].toLowerCase()];
  }

  return undefined;
}

// Enhanced search with multiple strategies
export async function resolveAnimeDataIdWithFallback(
  title: string,
  metadata?: AnimeMetadata
): Promise<{
  dataId: string | null;
  confidence: number;
  matchedTitle?: string;
}> {
  try {
    // Strategy 1: Direct title search with metadata
    let dataId = await resolveAnimeDataIdByTitle(title, metadata);
    if (dataId) {
      return { dataId, confidence: 0.9, matchedTitle: title };
    }

    // Strategy 2: Try with English title if available
    if (metadata && title !== metadata.type) {
      dataId = await resolveAnimeDataIdByTitle(
        metadata.type || title,
        metadata
      );
      if (dataId) {
        return { dataId, confidence: 0.8, matchedTitle: metadata.type };
      }
    }

    // Strategy 3: Try simplified title (remove subtitles, special chars)
    const simplifiedTitle = title.split(':')[0].split('-')[0].trim();
    if (simplifiedTitle !== title) {
      dataId = await resolveAnimeDataIdByTitle(simplifiedTitle, metadata);
      if (dataId) {
        return { dataId, confidence: 0.7, matchedTitle: simplifiedTitle };
      }
    }

    return { dataId: null, confidence: 0 };
  } catch (error) {
    console.error('Error in enhanced anime resolution:', error);
    return { dataId: null, confidence: 0 };
  }
}

export type EpisodeItem = {
  episodeId: string;
  number: number;
  title?: string;
};

export async function fetchEpisodeList(
  animeDataId: string
): Promise<EpisodeItem[]> {
  try {
    console.log('Fetching episodes for ID:', animeDataId);
    const url = `https://hianimez.is/ajax/v2/episode/list/${animeDataId}`;
    const response = await hFetch(url);

    let json;
    try {
      json = JSON.parse(response);
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      return [];
    }

    if (!json?.status || !json?.html) {
      console.log('Invalid response format:', json);
      return [];
    }

    // Parse the HTML content
    const temp = document.createElement('div');
    temp.innerHTML = json.html;

    const episodeElements = temp.querySelectorAll('a.ssl-item.ep-item');
    console.log('Found episode elements:', episodeElements.length);

    const episodes: EpisodeItem[] = [];

    episodeElements.forEach((element) => {
      const episodeId = element.getAttribute('data-id');
      const episodeNumber = element.getAttribute('data-number');
      const titleElement = element.querySelector('.ep-name');
      const title = titleElement?.textContent?.trim();

      if (episodeId && episodeNumber) {
        episodes.push({
          episodeId,
          number: parseInt(episodeNumber, 10),
          title: title || `Episode ${episodeNumber}`,
        });
      }
    });

    // Sort episodes by number
    episodes.sort((a, b) => a.number - b.number);

    console.log('Parsed episodes:', episodes.length);
    return episodes;
  } catch (error) {
    console.error('Error fetching episode list:', error);
    return [];
  }
}
