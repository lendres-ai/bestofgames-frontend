import Link from 'next-intl/link';
import {getTranslations} from 'next-intl/server';

export default async function Footer() {
  const t = await getTranslations('Footer');
  return (
    <footer className="mt-12 border-t border-white/10 bg-white/50 backdrop-blur dark:bg-gray-900/50">
      <div className="mx-auto max-w-screen-xl px-6 py-8 text-sm text-gray-600 dark:text-gray-300 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="order-2 sm:order-1">© {new Date().getFullYear()} BestOfGames</p>
          <nav className="order-1 flex items-center gap-5 sm:order-2">
            <Link className="hover:text-gray-900 dark:hover:text-white" href="/about">{t('about')}</Link>
            <Link className="hover:text-gray-900 dark:hover:text-white" href="/privacy">{t('privacy')}</Link>
            <Link className="hover:text-gray-900 dark:hover:text-white" href="/contact">{t('contact')}</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}


