import fs from 'fs';
import path from 'path';

const locales = ['en', 'de'];
const messagesDir = path.join(process.cwd(), 'messages');

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonObject | JsonArray;
interface JsonObject { [key: string]: JsonValue }
type JsonArray = JsonValue[];

function isJsonObject(value: JsonValue): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getKeys(obj: JsonObject, prefix = ''): string[] {
  return Object.keys(obj).reduce<string[]>((res, key) => {
    const value = obj[key];
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (isJsonObject(value)) {
      res.push(...getKeys(value, fullKey));
    } else {
      res.push(fullKey);
    }
    return res;
  }, []);
}

function loadMessages(locale: string): JsonObject | null {
  const filePath = path.join(messagesDir, `${locale}.json`);
  if (!fs.existsSync(filePath)) {
    console.error(`Missing translation file for locale: ${locale}`);
    process.exitCode = 1;
    return null;
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as JsonObject;
}

function main() {
  const [baseLocale, ...rest] = locales;
  const baseMessages = loadMessages(baseLocale);
  if (!baseMessages) return;
  const baseKeys = new Set(getKeys(baseMessages));

  for (const locale of rest) {
    const messages = loadMessages(locale);
    if (!messages) continue;
    const keys = new Set(getKeys(messages));
    const missing = [...baseKeys].filter((k) => !keys.has(k));
    const extra = [...keys].filter((k) => !baseKeys.has(k));
    if (missing.length || extra.length) {
      console.log(`\nLocale: ${locale}`);
      if (missing.length) {
        console.log(' Missing keys:');
        for (const k of missing) console.log(`  - ${k}`);
        process.exitCode = 1;
      }
      if (extra.length) {
        console.log(' Extra keys:');
        for (const k of extra) console.log(`  - ${k}`);
      }
    } else {
      console.log(`\nLocale: ${locale} — OK (no drift)`);
    }
  }
}

main();


