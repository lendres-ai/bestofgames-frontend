/**
 * Centralized constants for the application
 */

export const SITE_URL = 'https://bestof.games';
export const SITE_NAME = 'BestOfGames';
export const PLACEHOLDER_IMAGE = 'https://placehold.co/1200x675.png';

/**
 * Revalidation times for ISR (in seconds)
 */
export const REVALIDATION_TIMES = {
  HOME: 3600,         // 1 hour
  GAMES_LIST: 3600,   // 1 hour
  GAME_DETAIL: 86400, // 1 day
  STEAM_PRICE: 3600,  // 1 hour
} as const;

/**
 * Metadata defaults
 */
export const METADATA = {
  THEME_COLOR: '#4f46e5',
  KEYWORDS: ['indie games', 'game reviews', 'gaming', 'video games', 'game ratings', 'indie gaming'] as string[],
};

