import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined;
}

function createPool(): Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }
  return new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }, // Supabase requires SSL
    max: 5,
  });
}

// Lazily created so builds/pages that don't touch the DB never fail just
// because DATABASE_URL isn't present at build time — the pool is only
// constructed the first time a query actually runs.
function getPool(): Pool {
  if (!global._pgPool) {
    global._pgPool = createPool();
  }
  return global._pgPool;
}

export const pool = {
  query: (text: string, params?: any[]) => getPool().query(text, params),
};
