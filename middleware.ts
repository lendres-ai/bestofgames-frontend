import createMiddleware from 'next-intl/middleware';
import {locales, defaultLocale} from './src/i18n/request';

export default createMiddleware({
  locales,
  defaultLocale
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
