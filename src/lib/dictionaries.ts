export type Locale = 'en' | 'de';
export const locales: Locale[] = ['en', 'de'];
export const defaultLocale: Locale = 'en';

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

// Helper to check if a string is a valid locale
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

