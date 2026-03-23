import { Pool } from "pg";
import { ENV } from "./env";

const pool = new Pool({
  connectionString: ENV.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 2_000,
  ssl: ENV.IS_PROD ? { rejectUnauthorized: false } : false,
});

pool.on("error", (err) => {
  console.error("[DB] Unexpected pool error:", err);
});

export const db = {
  query: (text: string, params?: unknown[]) =>
    pool.query(text, params),
  getClient: () => pool.connect(),
};

export default pool;