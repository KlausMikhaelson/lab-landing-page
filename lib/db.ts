import { Pool } from "pg";

/**
 * A single shared connection pool. Cached on globalThis so Next.js dev HMR
 * (which re-evaluates modules) doesn't open a new pool on every reload.
 */
const globalForDb = globalThis as unknown as { _waitlistPool?: Pool };

export function getPool(): Pool {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set (add it to .env.local)");
  }
  if (!globalForDb._waitlistPool) {
    const isLocal = /@(localhost|127\.0\.0\.1)/.test(url);
    globalForDb._waitlistPool = new Pool({
      connectionString: url,
      max: 3, // small: serverless functions each hold their own pool
      // hosted Postgres (Neon/Supabase/Railway/…) requires TLS; local doesn't
      ssl: isLocal ? false : { rejectUnauthorized: false },
    });
  }
  return globalForDb._waitlistPool;
}

let schemaReady: Promise<void> | null = null;

/** Create the waitlist table on first use (idempotent, runs once per process). */
export function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = getPool()
      .query(
        `CREATE TABLE IF NOT EXISTS waitlist (
           id         BIGSERIAL PRIMARY KEY,
           email      TEXT NOT NULL UNIQUE,
           source     TEXT,
           created_at TIMESTAMPTZ NOT NULL DEFAULT now()
         )`
      )
      .then(() => undefined)
      .catch((err) => {
        schemaReady = null; // allow a retry on the next request
        throw err;
      });
  }
  return schemaReady;
}
