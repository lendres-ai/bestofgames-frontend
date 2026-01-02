import postgres from 'postgres';
import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';

// Lazy database connection to avoid build-time errors when DATABASE_URL is not set
let _db: PostgresJsDatabase | null = null;
let _connectionError: Error | null = null;

/**
 * Check if we're in a build/prerender phase without database access
 */
export function isDatabaseAvailable(): boolean {
  return !!process.env.DATABASE_URL;
}

function getDb(): PostgresJsDatabase {
  if (_db) return _db;
  if (_connectionError) throw _connectionError;

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    _connectionError = new Error(
      'DATABASE_URL environment variable is not set. ' +
      'Database queries will fail. This is expected during builds without database access.'
    );
    throw _connectionError;
  }

  // SSL only required for cloud databases, not localhost
  const isLocalhost = databaseUrl.includes('localhost') || databaseUrl.includes('127.0.0.1');
  const sslMode = isLocalhost ? false : 'require';

  const client = postgres(databaseUrl, { ssl: sslMode });
  _db = drizzle(client);
  return _db;
}

// Export a proxy that lazily initializes the database connection
export const db = new Proxy({} as PostgresJsDatabase, {
  get(_target, prop) {
    const realDb = getDb();
    const value = realDb[prop as keyof PostgresJsDatabase];
    if (typeof value === 'function') {
      return value.bind(realDb);
    }
    return value;
  },
});


