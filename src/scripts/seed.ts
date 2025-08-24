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
    score: '9.0',
    pros: ['Levelvielfalt', 'Soundtrack'],
    cons: ['Story flach'],
    bodyMd: 'Ein sehr gutes Jump & Run…',
  });
  console.log('Seed ok');
}
main().then(()=>process.exit(0)).catch(e=>{console.error(e);process.exit(1);});