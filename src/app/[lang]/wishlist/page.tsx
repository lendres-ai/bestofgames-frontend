import WishlistClient from "./WishlistClient";
import { Locale, getDictionary } from "@/lib/dictionaries";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: langParam } = await params;
  const lang = (langParam as Locale) || 'en';
  const dict = await getDictionary(lang);
  
  return {
    title: dict.wishlist.title,
    description: dict.wishlist.title,
  };
}

export default async function WishlistPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: langParam } = await params;
  const lang = (langParam as Locale) || 'en';
  const dict = await getDictionary(lang);
  
  return <WishlistClient locale={lang} dict={dict} />;
}

