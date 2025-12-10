import type { Metadata } from "next";
import { Locale, getDictionary } from "@/lib/dictionaries";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: langParam } = await params;
  const lang = (langParam as Locale) || 'en';
  const dict = await getDictionary(lang);
  
  return {
    title: dict.metadata.privacy_title,
    description: dict.metadata.privacy_description,
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: langParam } = await params;
  const lang = (langParam as Locale) || 'en';
  const dict = await getDictionary(lang);

  return (
    <main className="mx-auto max-w-screen-md px-[var(--container-x)] pt-[var(--section-pt)] pb-[var(--section-pb)] 2xl:px-0">
      <h1 className="mb-[var(--space-6)] text-3xl font-bold tracking-tight">{dict.privacy.title}</h1>
      <div className="prose prose-gray dark:prose-invert">
        <p className="lead">{dict.privacy.intro}</p>
        
        <h2>{dict.privacy.data_collection_title}</h2>
        <p>{dict.privacy.data_collection_content}</p>
        
        <h2>{dict.privacy.cookies_title}</h2>
        <p>{dict.privacy.cookies_content}</p>
        
        <h2>{dict.privacy.third_party_title}</h2>
        <p>{dict.privacy.third_party_content}</p>
        
        <h2>{dict.privacy.contact_title}</h2>
        <p>{dict.privacy.contact_content}</p>
      </div>
    </main>
  );
}

