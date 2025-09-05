import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About - BestOfGames",
  description: "Learn more about BestOfGames and our mission.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-screen-md px-[var(--container-x)] pt-[var(--section-pt)] pb-[var(--section-pb)] 2xl:px-0">
      <h1 className="mb-[var(--space-6)] text-3xl font-bold tracking-tight">About</h1>
      <div className="prose prose-gray dark:prose-invert">
        <p>
          BestOfGames is a curated collection of indie game reviews. We focus on
          stylish, bite-sized insights that help you discover your next favorite
          title.
        </p>
        <p>
          This project is built with the goal of showcasing modern web tooling
          and sharing passion for unique gaming experiences. All reviews are
          written with care and aim to highlight what makes each game special.
        </p>
        <p>
          Want to get in touch? Feel free to reach out via our contact page or
          follow us on social media. We&apos;re always happy to hear your
          feedback and suggestions.
        </p>
      </div>
    </main>
  );
}

