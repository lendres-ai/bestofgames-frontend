import Link from "next/link";
import { Locale, Dictionary } from "@/lib/dictionaries";
import NewsletterSignup from "@/components/NewsletterSignup";

type FooterProps = {
  locale: Locale;
  dict: Dictionary;
};

export default function Footer({ locale, dict }: FooterProps) {
  return (
    <footer className="mt-12 border-t border-white/10 bg-white/50 backdrop-blur dark:bg-gray-900/50">
      <div className="mx-auto max-w-screen-xl px-6 py-8 lg:px-8">
        {/* Newsletter section */}
        <div className="mb-8 border-b border-gray-200/50 pb-8 dark:border-gray-700/50">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📬</span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{dict.newsletter.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{dict.newsletter.subtitle}</p>
              </div>
            </div>
            <div className="w-full sm:w-auto sm:min-w-[320px]">
              <NewsletterSignup locale={locale} dict={dict} variant="footer" />
            </div>
          </div>
        </div>

        {/* Copyright and links */}
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-gray-600 dark:text-gray-300 sm:flex-row">
          <p className="order-2 sm:order-1">© {new Date().getFullYear()} BestOfGames</p>
          <nav className="order-1 flex items-center gap-5 sm:order-2">
            <Link className="hover:text-gray-900 dark:hover:text-white" href={`/${locale}/about`}>{dict.footer.about}</Link>
            <Link className="hover:text-gray-900 dark:hover:text-white" href={`/${locale}/privacy`}>{dict.footer.privacy}</Link>
            <Link className="hover:text-gray-900 dark:hover:text-white" href={`/${locale}/contact`}>{dict.footer.contact}</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
