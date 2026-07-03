import pg from 'pg';

const { Pool } = pg;

// RepoLab stores everything (users + progress) in NeonDB — a serverless
// Postgres provider. Create a free project at https://neon.tech, grab the
// connection string it gives you (Dashboard -> Connection Details), and
// put it in DATABASE_URL in your .env file (see .env.example).
//
// Example connection string shape:
// postgresql://user:password@ep-something.region.aws.neon.tech/dbname?sslmode=require
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn(
    '[db] DATABASE_URL is not set. Set it to your NeonDB connection string ' +
    '(see .env.example) or the app will fail as soon as it needs the database.'
  );
}

// Neon requires SSL. If the connection string already includes
// `sslmode=require` the driver picks it up automatically; the explicit
// `ssl` option below is a safety net for connection strings that don't.
export const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
`;

const createProgressTable = `
  CREATE TABLE IF NOT EXISTS progress (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    guide_slug TEXT NOT NULL,
    completed_steps JSONB NOT NULL DEFAULT '[]',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, guide_slug)
  );
`;

export async function initDb() {
  await pool.query(createUsersTable);
  await pool.query(createProgressTable);
}

export default pool;
