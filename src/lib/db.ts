
import { Pool } from "pg";

declare global {
  
  var _pgPool: Pool | undefined;
}

function createPool(): Pool {
  return new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    ssl:
      process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : false,
  });
}

// Singleton pool — reuse across hot-reloads in dev
const pool = globalThis._pgPool ?? createPool();

if (process.env.NODE_ENV !== "production") {
  globalThis._pgPool = pool;
}

export const db = {
  query: <T = unknown>(text: string, params?: unknown[]) =>
    pool.query<T & Record<string, unknown>>(text, params),

  getClient: () => pool.connect(),
};

export default pool;