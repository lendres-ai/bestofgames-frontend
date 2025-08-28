import {getTranslations} from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations('AboutPage');
  return {
    title: t('title'),
    description: t('intro'),
    alternates: {
      languages: {
        de: '/ueber-uns',
        en: '/about'
      }
    }
  };
}

export default async function AboutPage() {
  const t = await getTranslations('AboutPage');
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold">{t('title')}</h1>
      <p className="text-base text-gray-700 dark:text-gray-300">{t('intro')}</p>
      <p className="text-base text-gray-700 dark:text-gray-300">{t('mission')}</p>
    </div>
  );
}
