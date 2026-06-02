import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Lazy init — we don't want to crash at import time during `next build`
// when env vars are absent. The first query is where DATABASE_URL is required.
let _db: NeonHttpDatabase<typeof schema> | null = null;
function getDb() {
  if (_db) return _db;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env.local.",
    );
  }
  const client = neon(url) as NeonQueryFunction<false, false>;
  _db = drizzle(client, { schema });
  return _db;
}

export const db = new Proxy({} as NeonHttpDatabase<typeof schema>, {
  get(_t, prop) {
    const target = getDb() as unknown as Record<PropertyKey, unknown>;
    const value = target[prop];
    return typeof value === "function" ? (value as Function).bind(target) : value;
  },
});

export { schema };
