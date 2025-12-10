/**
 * Centralized i18n configuration
 * All locale-related constants and type definitions
 */

export const locales = ['en', 'de'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

/**
 * Check if a string is a valid locale
 */
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

/**
 * Get locale code for Intl APIs
 */
export function getLocaleCode(locale: Locale): string {
  return locale === 'de' ? 'de-DE' : 'en-US';
}

