
import { LocalizedField, getLocalizedText } from '@/lib/i18n';
import { Locale } from '@/lib/i18n/config';

/**
 * Calculates reading time in minutes based on word count.
 * Assumes average reading speed of 200 words per minute.
 */
export function calculateReadingTime(text: string | null | undefined): number {
  if (!text) return 0;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return minutes;
}

/**
 * Calculates total reading time for a review from localized fields.
 */
export function getReadingTime(
  reviewParts: (LocalizedField | null | undefined)[],
  locale: Locale
): number {
  const combinedText = reviewParts
    .map(part => getLocalizedText(part, locale))
    .join(' ');
  return calculateReadingTime(combinedText);
}
