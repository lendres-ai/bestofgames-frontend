import type { Metadata } from "next";
import { Mail, MessageSquare } from "lucide-react";
import { Locale, getDictionary } from "@/lib/dictionaries";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: langParam } = await params;
  const lang = (langParam as Locale) || 'en';
  const dict = await getDictionary(lang);
  
  return {
    title: dict.metadata.contact_title,
    description: dict.metadata.contact_description,
  };
}

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: langParam } = await params;
  const lang = (langParam as Locale) || 'en';
  const dict = await getDictionary(lang);

  return (
    <main className="mx-auto max-w-screen-md px-[var(--container-x)] pt-[var(--section-pt)] pb-[var(--section-pb)] 2xl:px-0">
      <h1 className="mb-[var(--space-6)] text-3xl font-bold tracking-tight">{dict.contact.title}</h1>
      <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">{dict.contact.intro}</p>
      
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border bg-white/60 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur dark:bg-gray-900/60">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/50">
            <Mail className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="mb-2 text-lg font-semibold">{dict.contact.email_title}</h2>
          <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">{dict.contact.email_content}</p>
          <a 
            href="mailto:hello@bestof.games" 
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-sky-400 dark:hover:text-sky-300"
          >
            hello@bestof.games
          </a>
        </div>
        
        <div className="rounded-2xl border bg-white/60 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur dark:bg-gray-900/60">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/50">
            <MessageSquare className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="mb-2 text-lg font-semibold">{dict.contact.feedback_title}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">{dict.contact.feedback_content}</p>
        </div>
      </div>
    </main>
  );
}

