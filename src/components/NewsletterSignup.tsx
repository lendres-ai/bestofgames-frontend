'use client';

import { useState, useRef, useCallback } from 'react';
import { type Locale, type Dictionary } from '@/lib/dictionaries';

interface NewsletterSignupProps {
    locale: Locale;
    dict: Dictionary;
    variant?: 'default' | 'compact' | 'footer';
}

export default function NewsletterSignup({ locale, dict, variant = 'default' }: NewsletterSignupProps) {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const conversionSentRef = useRef(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const [transform, setTransform] = useState('');
    const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });

    // 3D tilt effect for default variant only
    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (variant !== 'default' || !cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        const rotateX = (y - 0.5) * -6;
        const rotateY = (x - 0.5) * 6;

        setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`);
        setGlarePosition({ x: x * 100, y: y * 100 });
    }, [variant]);

    const handleMouseLeave = useCallback(() => {
        setTransform('');
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || status === 'loading') return;

        setStatus('loading');
        setErrorMessage('');

        try {
            const res = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || 'Subscription failed');
            }

            setStatus('success');
            setEmail('');

            // Track successful signup in Umami
            if (typeof window !== 'undefined' && window.umami) {
                window.umami.track('Newsletter Signup Success', { variant });
            }

            // Track Google Ads Conversion (only once)
            if (!conversionSentRef.current && typeof window !== 'undefined' && (window as any).gtag) {
                conversionSentRef.current = true;
                (window as any).gtag('event', 'conversion', {
                    'send_to': 'AW-17843649268/bnkJCKW_mNobEPT1wbxC',
                    'value': 0.1,
                    'currency': 'EUR',
                    'event_callback': () => {
                        // Conversion reported
                    }
                });
            }
        } catch (err) {
            setStatus('error');
            setErrorMessage(err instanceof Error ? err.message : 'Something went wrong');
        }
    };

    const t = dict.newsletter;

    // Footer variant - ultra compact, inline
    if (variant === 'footer') {
        return (
            <div className="w-full">
                {status === 'success' ? (
                    <p className="text-sm text-green-600 dark:text-green-400">{t.success}</p>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <label htmlFor="newsletter-footer" className="sr-only">{t.placeholder}</label>
                        <input
                            id="newsletter-footer"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t.placeholder}
                            required
                            className="flex-1 rounded-full border border-gray-200/50 bg-white/60 px-4 py-2.5 text-base backdrop-blur-sm transition placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/20 dark:border-gray-700/50 dark:bg-gray-800/60 dark:placeholder:text-gray-500 sm:text-sm"
                        />
                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400/50 disabled:opacity-50"
                        >
                            {status === 'loading' ? (
                                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            ) : (
                                <>
                                    {t.button}
                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                        <path d="M5 12h14" />
                                        <path d="m12 5 7 7-7 7" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>
                )}
                {status === 'error' && (
                    <p className="mt-2 text-sm text-red-500">{errorMessage || t.error}</p>
                )}
            </div>
        );
    }

    // Compact variant - smaller card, no 3D effect
    if (variant === 'compact') {
        return (
            <div className="rounded-2xl border border-white/20 bg-white/50 p-5 shadow-lg ring-1 ring-black/5 backdrop-blur-xl dark:border-white/10 dark:bg-gray-900/50 sm:p-6">
                <div className="flex items-start gap-3">
                    <span className="text-2xl">📬</span>
                    <div className="flex-1">
                        <h3 className="font-bold text-gray-900 dark:text-white">{t.title}</h3>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{t.subtitle}</p>
                        {status === 'success' ? (
                            <p className="mt-3 text-sm font-medium text-green-600 dark:text-green-400">
                                ✓ {t.success}
                            </p>
                        ) : (
                            <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-2 sm:flex-row">
                                <label htmlFor="newsletter-compact" className="sr-only">{t.placeholder}</label>
                                <input
                                    id="newsletter-compact"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={t.placeholder}
                                    required
                                    className="flex-1 rounded-full border border-gray-200/50 bg-white/70 px-4 py-2.5 text-base backdrop-blur-sm transition placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/20 dark:border-gray-700/50 dark:bg-gray-800/70 dark:placeholder:text-gray-500 sm:text-sm"
                                />
                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400/50 disabled:opacity-50"
                                >
                                    {status === 'loading' ? (
                                        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                    ) : (
                                        t.button
                                    )}
                                </button>
                            </form>
                        )}
                        {status === 'error' && (
                            <p className="mt-2 text-sm text-red-500">{errorMessage || t.error}</p>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Default variant - full featured with 3D tilt and glare
    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ transform, transition: transform ? 'transform 0.1s ease-out' : 'transform 0.4s ease-out' }}
            className="relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-white/60 via-white/40 to-fuchsia-50/30 p-6 shadow-xl ring-1 ring-white/10 backdrop-blur-xl dark:border-white/10 dark:from-gray-900/60 dark:via-gray-900/40 dark:to-indigo-950/30 sm:p-8"
        >
            {/* Glare effect */}
            <div
                className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 hover:opacity-100"
                style={{
                    background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.1) 0%, transparent 50%)`
                }}
            />

            {/* Decorative gradient blob */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br from-fuchsia-400/30 to-indigo-400/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-gradient-to-br from-sky-400/20 to-indigo-400/20 blur-3xl" />

            <div className="relative z-20 text-center">
                <span className="mb-4 inline-block text-4xl">📬</span>
                <h3 className="bg-gradient-to-r from-fuchsia-600 via-indigo-600 to-sky-500 bg-clip-text text-xl font-extrabold tracking-tight text-transparent sm:text-2xl">
                    {t.title}
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-gray-600 dark:text-gray-300 sm:text-base">
                    {t.subtitle}
                </p>

                {status === 'success' ? (
                    <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-green-100 px-5 py-3 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {t.success}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
                        <label htmlFor="newsletter-default" className="sr-only">{t.placeholder}</label>
                        <input
                            id="newsletter-default"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t.placeholder}
                            required
                            className="flex-1 rounded-full border border-white/30 bg-white/70 px-5 py-3 text-base shadow-inner backdrop-blur-sm transition placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30 dark:border-gray-700/50 dark:bg-gray-800/70 dark:placeholder:text-gray-500 sm:text-sm"
                        />
                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 via-indigo-500 to-sky-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-[1.03] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-400/50 disabled:opacity-50"
                        >
                            {status === 'loading' ? (
                                <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            ) : (
                                <>
                                    {t.button}
                                    <svg className="h-4 w-4 transition group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                                        <path d="M5 12h14" />
                                        <path d="m12 5 7 7-7 7" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>
                )}

                {status === 'error' && (
                    <p className="mt-4 text-sm text-red-500 dark:text-red-400">{errorMessage || t.error}</p>
                )}

                <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
                    {locale === 'de' ? 'Kein Spam. Jederzeit abmelden.' : 'No spam. Unsubscribe anytime.'}
                </p>
            </div>
        </div>
    );
}
