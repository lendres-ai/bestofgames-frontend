import 'dotenv/config';

export default {
  schema: './lib/schema.ts',
  out: './drizzle',
  url: process.env.DATABASE_URL!,
  dialect: 'postgresql',
} as const;