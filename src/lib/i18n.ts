import { type Locale, defaultLocale, getLocaleCode } from './i18n/config';

/**
 * Represents a localized text field that can be either:
 * - A plain string (legacy/non-localized)
 * - An object with locale keys { en: "...", de: "..." }
 */
export type LocalizedField = string | { [key in Locale]?: string } | null | undefined;

/**
 * Extracts the correct localized text from a field.
 * Handles both legacy plain strings and new JSONB locale objects.
 * Falls back to English if the requested locale is not available.
 *
 * @param field - The field value (string, locale object, or null)
 * @param locale - The desired locale
 * @returns The localized string, or empty string if no value exists
 */
export function getLocalizedText(field: LocalizedField, locale: Locale): string {
  if (!field) return '';

  // Legacy plain string - return as-is
  if (typeof field === 'string') return field;

  // JSONB locale object - get requested locale with fallback to English
  return field[locale] ?? field[defaultLocale] ?? '';
}

/**
 * Extracts localized text from an array of localized fields.
 *
 * @param fields - Array of localized field values
 * @param locale - The desired locale
 * @returns Array of localized strings
 */
export function getLocalizedTextArray(
  fields: LocalizedField[] | null | undefined,
  locale: Locale
): string[] {
  if (!fields) return [];
  return fields.map((field) => getLocalizedText(field, locale)).filter(Boolean);
}

/**
 * Formats a date according to the locale.
 *
 * @param date - Date string or Date object
 * @param locale - The desired locale
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatLocalizedDate(
  date: string | Date | null | undefined,
  locale: Locale,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString(getLocaleCode(locale), options);
}

/**
 * Formats a short date according to the locale.
 *
 * @param date - Date string or Date object
 * @param locale - The desired locale
 * @returns Formatted short date string
 */
export function formatLocalizedShortDate(
  date: string | Date | null | undefined,
  locale: Locale
): string {
  return formatLocalizedDate(date, locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

