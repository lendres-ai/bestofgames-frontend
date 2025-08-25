import 'dotenv/config';
import { db } from '@/lib/db';
import { games, reviews } from '@/lib/schema';

async function main() {
  const [g] = await db.insert(games).values({
    slug: 'mario',
    title: 'Super Mario Wonder',
    summary: 'Bunter Platformer mit cleveren Levels.',
    developer: 'Nintendo',
    publisher: 'Nintendo'
  }).returning();

  await db.insert(reviews).values({
    gameId: g.id,
    title: 'Super Mario Wonder Review',
    description: 'Ein sehr gutes Jump & Run…',
    introduction: 'Willkommen in der Wunderwelt von Mario!',
    gameplayFeatures: 'Levelvielfalt, Soundtrack',
    conclusion: 'Story flach, aber Spielspaß hoch',
    userOpinion: 'Ich fand das Leveldesign großartig und die Musik eingängig.',
    score: '9.0'
  });

  console.log('Seed ok');
}

main().then(() => process.exit(0)).catch(e => {
  console.error(e);
  process.exit(1);
});
