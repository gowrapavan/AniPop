import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T {
  let timeout: NodeJS.Timeout;
  return ((...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}

export function formatScore(score?: number): string {
  if (!score) return 'N/A';
  return score.toFixed(1);
}

export function formatEpisodeCount(count?: number): string {
  if (!count) return 'Unknown';
  return `${count} episodes`;
}

export function getPreferredTitle(anime: { title: string; title_english?: string }): string {
  return anime.title_english || anime.title;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}