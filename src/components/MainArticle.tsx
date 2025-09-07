"use client";

import Image from 'next/image';
import { useState } from 'react';
import Lightbox from './Lightbox';

interface MainArticleProps {
  reviewTitle: string | null;
  description: string | null;
  introduction: string | null;
  gameplayFeatures: string | null;
  conclusion: string | null;
  score: number | null;
  userOpinion: string | null;
  images?: Array<string | { src: string; caption?: string }>;
    pros?: string[];
    cons?: string[];
    className?: string;
}

export default function MainArticle({
  reviewTitle,
  description,
  introduction,
  gameplayFeatures,
  conclusion,
  score,
  userOpinion,
    images = [],
    pros = [],
    cons = [],
    className,
}: MainArticleProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Normalize images and skip the first one (used as cover in the hero)
  const normalizedImages = images.map((img) =>
    typeof img === 'string' ? { src: img } : img,
  );
  const lightboxImages = normalizedImages.slice(1);

  const textSections = (
    [
      introduction ? { key: 'introduction', text: introduction } : null,
      gameplayFeatures ? { key: 'gameplay', text: gameplayFeatures } : null,
      conclusion ? { key: 'conclusion', text: conclusion } : null,
    ].filter(Boolean) as Array<{ key: string; text: string }>
  );

    return (
      <article id="main" className={`px-4 pb-16 ${className ?? ''}`}>
      <header className="mb-8">
        <h2 className="mb-3 bg-gradient-to-r from-indigo-600 via-sky-500 to-fuchsia-500 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl">
          {reviewTitle}
        </h2>
        {description && (
          <p className="text-lg text-gray-600 dark:text-gray-300">{description}</p>
        )}
      </header>

      <div className="space-y-8">
        {textSections.map((section, idx) => (
          <div key={section.key} className="space-y-6">
            <div className="prose prose-slate max-w-none text-justify dark:prose-invert">
              <p>{section.text}</p>
            </div>

            {lightboxImages[idx] && (
              <figure
                className="group cursor-pointer overflow-hidden rounded-2xl shadow ring-1 ring-black/5"
                onClick={() => setLightboxIndex(idx)}
              >
                <Image
                  src={lightboxImages[idx].src}
                  alt={lightboxImages[idx].caption ?? `Screenshot ${idx + 1}`}
                  width={1280}
                  height={720}
                  className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
                {lightboxImages[idx].caption && (
                  <figcaption className="bg-black/60 p-2 text-xs text-white">
                    {lightboxImages[idx].caption}
                  </figcaption>
                )}
              </figure>
            )}
          </div>
        ))}

        {lightboxImages.length > textSections.length && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {lightboxImages.slice(textSections.length).map((img, i) => (
              <figure
                key={img.src}
                className="group cursor-pointer overflow-hidden rounded-2xl shadow ring-1 ring-black/5"
                onClick={() => setLightboxIndex(textSections.length + i)}
              >
                <Image
                  src={img.src}
                  alt={img.caption ?? `Screenshot ${textSections.length + i + 1}`}
                  width={640}
                  height={360}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                {img.caption && (
                  <figcaption className="bg-black/60 p-2 text-xs text-white">
                    {img.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        )}
      </div>

      {(pros.length > 0 || cons.length > 0) && (
        <section className="mt-10 grid gap-4 sm:grid-cols-2">
          {pros.length > 0 && (
            <div className="rounded-2xl border bg-gray-50/60 p-5 shadow-sm ring-1 ring-emerald-400/30 dark:bg-gray-900/40">
              <h4 className="mb-3 text-sm font-semibold text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]">
                Pros
              </h4>
              <ul className="space-y-2">
                {pros.map((p) => (
                  <li
                    key={p}
                    className="relative rounded-xl bg-emerald-500/10 px-3 py-2 text-sm text-emerald-800 ring-1 ring-emerald-500/30 drop-shadow-[0_0_6px_rgba(16,185,129,0.6)] dark:text-emerald-300"
                  >
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {cons.length > 0 && (
            <div className="rounded-2xl border bg-gray-50/60 p-5 shadow-sm ring-1 ring-rose-400/30 dark:bg-gray-900/40">
              <h4 className="mb-3 text-sm font-semibold text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]">
                Cons
              </h4>
              <ul className="space-y-2">
                {cons.map((c) => (
                  <li
                    key={c}
                    className="relative rounded-xl bg-rose-500/10 px-3 py-2 text-sm text-rose-800 ring-1 ring-rose-500/30 drop-shadow-[0_0_6px_rgba(244,63,94,0.6)] dark:text-rose-300"
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {typeof score === 'number' && (
        <div className="mt-10 flex items-center gap-3 rounded-2xl border bg-white/60 p-4 shadow-sm ring-1 ring-black/5 backdrop-blur dark:bg-gray-900/60">
          <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Score</span>
          <span className="font-mono text-2xl font-bold text-amber-500">{score.toFixed(1)} / 10</span>
        </div>
      )}

      {userOpinion && (
        <section className="mt-12 rounded-2xl border bg-gradient-to-br from-sky-50 via-white to-purple-50 p-6 shadow-sm ring-1 ring-black/5 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
          <h4 className="mb-2 text-lg font-semibold">Spielermeinung</h4>
          <blockquote className="border-l-4 border-sky-400/70 pl-4 italic text-gray-700 dark:text-gray-300">
            {userOpinion}
          </blockquote>
        </section>
      )}
      {lightboxIndex !== null && (
        <Lightbox
          images={lightboxImages}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </article>
  );
}
