import Link from "next-intl/link";
import {getTranslations} from 'next-intl/server';

export default async function NotFound() {
  const t = await getTranslations('NotFound');
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-2xl font-semibold">{t('title')}</h1>
      <p className="text-gray-600 dark:text-gray-400">
        {t('description')}
      </p>
      <Link href="/" className="text-indigo-600 underline dark:text-sky-400">
        {t('home')}
      </Link>
    </main>
  );
}
