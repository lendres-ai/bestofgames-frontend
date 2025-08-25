import 'dotenv/config';

export default {
  schema: './src/lib/schema.ts',
  out: './src/drizzle',
  url: process.env.DATABASE_URL!,
  dialect: 'postgresql',
} as const;