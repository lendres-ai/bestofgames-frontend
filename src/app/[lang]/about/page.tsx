import type { Metadata } from "next";
import { Locale, getDictionary } from "@/lib/dictionaries";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: langParam } = await params;
  const lang = (langParam as Locale) || 'en';
  const dict = await getDictionary(lang);
  
  return {
    title: dict.metadata.about_title,
    description: dict.metadata.about_description,
  };
}

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: langParam } = await params;
  const lang = (langParam as Locale) || 'en';
  const dict = await getDictionary(lang);

  return (
    <main className="mx-auto max-w-screen-md px-[var(--container-x)] pt-[var(--section-pt)] pb-[var(--section-pb)] 2xl:px-0">
      <h1 className="mb-[var(--space-6)] text-3xl font-bold tracking-tight">{dict.about.title}</h1>
      <div className="prose prose-gray dark:prose-invert">
        <p>{dict.about.content_p1}</p>
        <p>{dict.about.content_p2}</p>
        <p>{dict.about.content_p3}</p>
      </div>
    </main>
  );
}

