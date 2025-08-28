import {getRequestConfig} from 'next-intl/server';
import {routing} from '@/i18n/routing';

export default getRequestConfig(async ({requestLocale}) => {
  const requested = await requestLocale;
  const supportedLocales = routing.locales as readonly string[];
  const resolvedLocale = requested && supportedLocales.includes(requested as string)
    ? (requested as (typeof routing.locales)[number])
    : routing.defaultLocale;

  return {
    locale: resolvedLocale,
    messages: (await import(`../../messages/${resolvedLocale}.json`)).default,
    timeZone: 'Europe/Berlin',
    formats: {
      dateTime: {
        short: {year: 'numeric', month: 'short', day: '2-digit'}
      },
      number: {
        currency: {style: 'currency', currency: resolvedLocale === 'de' ? 'EUR' : 'USD'}
      }
    },
    onError: (error) => {
      if (process.env.NODE_ENV !== 'production') console.warn('[i18n]', error);
    },
    getMessageFallback: ({key}) => key
  };
});