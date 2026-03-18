import { Pool } from "pg";

const globalForDb = globalThis as unknown as {
  pool: Pool;
};

export const pool =
  globalForDb.pool ||
  new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.pool = pool;
}