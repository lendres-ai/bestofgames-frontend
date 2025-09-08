// Environment variables validation
function getRequiredEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getOptionalEnvVar(name: string, defaultValue: string): string {
  return process.env[name] || defaultValue;
}

// Validate environment variables at startup
export const env = {
  DATABASE_URL: getRequiredEnvVar('DATABASE_URL'),
  NODE_ENV: getOptionalEnvVar('NODE_ENV', 'development'),
  VERCEL_ENV: getOptionalEnvVar('VERCEL_ENV', 'development'),
  NEXT_PUBLIC_SITE_URL: getOptionalEnvVar('NEXT_PUBLIC_SITE_URL', 'https://bestof.games'),
  VAPID_PUBLIC_KEY: getOptionalEnvVar('VAPID_PUBLIC_KEY', ''),
  VAPID_PRIVATE_KEY: getOptionalEnvVar('VAPID_PRIVATE_KEY', ''),
  VAPID_SUBJECT: getOptionalEnvVar('VAPID_SUBJECT', 'mailto:admin@bestof.games'),
  CRON_SECRET: getOptionalEnvVar('CRON_SECRET', ''),
} as const;

// Type-safe environment variables
export type Env = typeof env;