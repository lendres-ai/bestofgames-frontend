// Re-export from centralized config
export { locales, defaultLocale, isValidLocale, type Locale } from '@/lib/i18n/config';
import { type Locale } from '@/lib/i18n/config';

// Type for the dictionary structure
export type Dictionary = typeof import('@/dictionaries/en.json');

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import('@/dictionaries/en.json').then((m) => m.default as unknown as Dictionary),
  de: () => import('@/dictionaries/de.json').then((m) => m.default as unknown as Dictionary),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  // Fallback to English if locale not found
  const loader = dictionaries[locale] || dictionaries.en;
  return loader();
}

