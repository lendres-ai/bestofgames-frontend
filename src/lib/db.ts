import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

const databaseUrl = process.env.DATABASE_URL!;
// SSL nur für Cloud-Datenbanken erforderlich, nicht für localhost
const isLocalhost = databaseUrl.includes('localhost') || databaseUrl.includes('127.0.0.1');
const sslMode = isLocalhost ? false : 'require';

const client = postgres(databaseUrl, { ssl: sslMode });
export const db = drizzle(client);


