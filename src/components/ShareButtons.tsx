"use client";

import { Twitter, Facebook, Share2, Link, Check } from "lucide-react";
import { useState } from "react";
import { Locale, Dictionary } from "@/lib/dictionaries";
import { SITE_URL } from "@/lib/constants";

type ShareButtonsProps = {
  title: string;
  slug: string;
  score?: number | null;
  locale: Locale;
  dict: Dictionary;
};

export default function ShareButtons({
  title,
  slug,
  score,
  locale,
  dict,
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const gameUrl = `${SITE_URL}/${locale}/games/${slug}`;
  const scoreText = score ? ` - Score: ${score}/10 ⭐` : "";
  const shareText = `${dict.share.check_out} ${title}${scoreText}`;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(gameUrl)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(gameUrl)}`;
  const redditUrl = `https://reddit.com/submit?url=${encodeURIComponent(gameUrl)}&title=${encodeURIComponent(shareText)}`;

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(gameUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = gameUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const buttonBaseClass =
    "inline-flex items-center justify-center rounded-full p-2.5 transition-all hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500";

  return (
    <div className="flex items-center gap-2">
      <span className="mr-1 text-sm font-medium text-gray-600 dark:text-gray-400">
        <Share2 className="inline-block h-4 w-4" />
      </span>

      {/* Twitter/X */}
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={dict.share.share_on_twitter}
        className={`${buttonBaseClass} bg-black text-white hover:bg-gray-800`}
        title={dict.share.share_on_twitter}
        data-umami-event="Share" data-umami-event-platform="Twitter"
      >
        <Twitter className="h-4 w-4" />
      </a>

      {/* Facebook */}
      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={dict.share.share_on_facebook}
        className={`${buttonBaseClass} bg-[#1877F2] text-white hover:bg-[#166FE5]`}
        title={dict.share.share_on_facebook}
        data-umami-event="Share" data-umami-event-platform="Facebook"
      >
        <Facebook className="h-4 w-4" />
      </a>

      {/* Reddit */}
      <a
        href={redditUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={dict.share.share_on_reddit}
        className={`${buttonBaseClass} bg-[#FF4500] text-white hover:bg-[#E03D00]`}
        title={dict.share.share_on_reddit}
        data-umami-event="Share" data-umami-event-platform="Reddit"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
        </svg>
      </a>

      {/* Copy Link */}
      <button
        type="button"
        onClick={copyToClipboard}
        aria-label={copied ? dict.share.link_copied : dict.share.copy_link}
        className={`${buttonBaseClass} ${copied
            ? "bg-green-500 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          }`}
        data-umami-event="Share" data-umami-event-platform="Copy Link"
        title={copied ? dict.share.link_copied : dict.share.copy_link}
      >
        {copied ? <Check className="h-4 w-4" /> : <Link className="h-4 w-4" />}
      </button>
    </div>
  );
}

