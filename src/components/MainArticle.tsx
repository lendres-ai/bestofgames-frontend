import Image from 'next/image';



interface MainArticleProps {
    reviewTitle: string | null;
    description: string | null;
    introduction: string | null;
    gameplayFeatures: string | null;
    conclusion: string | null;
    score: number | null;
    userOpinion: string | null;
    images?: string[];
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
}: MainArticleProps) {
    return (
        <article className="mx-auto max-w-3xl p-6 prose dark:prose-invert">
            <header>
                <h2 className="mb-2 text-3xl font-bold">{reviewTitle}</h2>
                {description && (
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">{description}</p>
                )}
            </header>

            {images.length > 1 && (
                <div className="flex gap-4 mb-6 overflow-x-auto">
                    {images.slice(1, 4).map((img, idx) => (
                        <Image
                            key={img}
                            src={img}
                            alt={`Screenshot ${idx + 1}`}
                            width={320}
                            height={180}
                            className="rounded shadow min-w-[200px] object-cover"
                        />
                    ))}
                </div>
            )}

            <section className="mt-6">
                {/* <h3 className="text-2xl font-semibold mt-6 mb-2">Einleitung</h3> */}
                <p>{introduction}</p>
            </section>

            <section className="mt-6">
                {/* <h3 className="text-2xl font-semibold mt-6 mb-2">Gameplay & Features</h3> */}
                <p>{gameplayFeatures}</p>
            </section>

            <section className="mt-6">
                {/* <h3 className="text-2xl font-semibold mt-6 mb-2">Fazit</h3> */}
                <p>{conclusion}</p>
            </section>

            {typeof score === 'number' && (
                <div className="mt-8 flex items-center gap-2">
                    <span className="text-lg font-bold">Score:</span>
                    <span className="text-2xl font-mono text-yellow-500">{score.toFixed(1)} / 10</span>
                </div>
            )}

            {userOpinion && (
                <section className="mt-10 border-t pt-6">
                    <h4 className="text-lg font-semibold mb-2">Spielermeinung</h4>
                    <blockquote className="italic text-gray-700 dark:text-gray-300 border-l-4 border-blue-400 pl-4">
                        {userOpinion}
                    </blockquote>
                </section>
            )}
        </article>
    );
}

