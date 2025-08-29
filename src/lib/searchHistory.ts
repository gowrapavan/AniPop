const SEARCH_HISTORY_KEY = 'hianime_search_history';
const MAX_HISTORY_ITEMS = 10;

export interface SearchHistoryItem {
  query: string;
  timestamp: number;
}

export function getSearchHistory(): SearchHistoryItem[] {
  try {
    const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (!stored) return [];
    
    const history: SearchHistoryItem[] = JSON.parse(stored);
    return history.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Error reading search history:', error);
    return [];
  }
}

export function addToSearchHistory(query: string): void {
  if (!query.trim()) return;
  
  try {
    const history = getSearchHistory();
    
    // Remove existing entry if it exists
    const filtered = history.filter(item => 
      item.query.toLowerCase() !== query.toLowerCase()
    );
    
    // Add new entry at the beginning
    const newHistory = [
      { query: query.trim(), timestamp: Date.now() },
      ...filtered
    ].slice(0, MAX_HISTORY_ITEMS);
    
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
  } catch (error) {
    console.error('Error saving search history:', error);
  }
}

export function clearSearchHistory(): void {
  try {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  } catch (error) {
    console.error('Error clearing search history:', error);
  }
}

export function removeFromSearchHistory(query: string): void {
  try {
    const history = getSearchHistory();
    const filtered = history.filter(item => 
      item.query.toLowerCase() !== query.toLowerCase()
    );
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing from search history:', error);
  }
}