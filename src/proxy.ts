import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale, type Locale } from '@/lib/i18n/config';

const AB_COOKIE_NAME = 'ab_hero_variant';
const AB_COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

function getLocaleFromHeaders(request: NextRequest): Locale {
    const acceptLanguage = request.headers.get('accept-language');
    if (!acceptLanguage) return defaultLocale;

    // Parse Accept-Language header and find best match
    const preferredLocales = acceptLanguage
        .split(',')
        .map((lang) => {
            const [locale, q = '1'] = lang.trim().split(';q=');
            return { locale: locale.split('-')[0].toLowerCase(), quality: parseFloat(q) };
        })
        .sort((a, b) => b.quality - a.quality);

    for (const { locale } of preferredLocales) {
        if (locales.includes(locale as Locale)) {
            return locale as Locale;
        }
    }

    return defaultLocale;
}

/**
 * Assigns A/B test variant cookie if not already present
 */
function assignABVariant(request: NextRequest, response: NextResponse): NextResponse {
    const existingVariant = request.cookies.get(AB_COOKIE_NAME)?.value;

    if (existingVariant !== 'A' && existingVariant !== 'B') {
        // Assign new variant: 50/50 split
        const variant = Math.random() < 0.5 ? 'A' : 'B';
        response.cookies.set(AB_COOKIE_NAME, variant, {
            maxAge: AB_COOKIE_MAX_AGE,
            httpOnly: false, // Allow client-side read for tracking
            sameSite: 'lax',
            path: '/',
        });
    }

    return response;
}

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip static files, API routes, and Next.js internals
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/static') ||
        pathname.includes('.') || // files with extensions (favicon.ico, manifest.json, etc.)
        pathname === '/robots.txt' ||
        pathname === '/sitemap.xml'
    ) {
        return NextResponse.next();
    }

    // Check if pathname already has a locale prefix
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (pathnameHasLocale) {
        // Add A/B variant cookie if needed, then continue
        const response = NextResponse.next();
        return assignABVariant(request, response);
    }

    // Detect locale from headers and redirect
    const locale = getLocaleFromHeaders(request);
    const newUrl = new URL(`/${locale}${pathname}`, request.url);

    // Preserve search params
    newUrl.search = request.nextUrl.search;

    // Add A/B variant cookie to redirect response
    const redirectResponse = NextResponse.redirect(newUrl);
    return assignABVariant(request, redirectResponse);
}

export const config = {
    matcher: [
        // Match all paths except static files and API routes
        '/((?!_next|api|static|.*\\..*).*)',
    ],
};
