import 'dotenv/config';
import { db } from '@/lib/db';
import { games, reviews } from '@/lib/schema';

async function main() {
  const [g] = await db.insert(games).values({
    slug: 'mario',
    title: 'Super Mario Wonder',
    summary: {
      en: 'Colorful platformer with clever levels.',
      de: 'Bunter Platformer mit cleveren Levels.',
    },
    developer: 'Nintendo',
    publisher: 'Nintendo',
    steamAppId: 3228590,
  }).returning();

  await db.insert(reviews).values({
    gameId: g.id,
    title: 'Super Mario Wonder Review',
    description: {
      en: 'A very good platformer…',
      de: 'Ein sehr gutes Jump & Run…',
    },
    introduction: {
      en: 'Welcome to Mario\'s wonder world!',
      de: 'Willkommen in der Wunderwelt von Mario!',
    },
    gameplayFeatures: {
      en: 'Level variety, soundtrack',
      de: 'Levelvielfalt, Soundtrack',
    },
    conclusion: {
      en: 'Story is shallow, but gameplay is great',
      de: 'Story flach, aber Spielspaß hoch',
    },
    userOpinion: {
      en: 'I found the level design great and the music catchy.',
      de: 'Ich fand das Leveldesign großartig und die Musik eingängig.',
    },
    score: '9.0'
  });

  console.log('Seed ok');
}

main().then(() => process.exit(0)).catch(e => {
  console.error(e);
  process.exit(1);
});
