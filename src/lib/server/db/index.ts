import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

const client = process.env.DATABASE_URL ? new Database(process.env.DATABASE_URL) : new Database(':memory:');

export const db = drizzle(client, { schema });
export * from './schema';
