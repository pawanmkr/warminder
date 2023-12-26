import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import config from '../../configs/config.js';

const pool: Pool = new Pool({
  user: config.database.username,
  password: config.database.password,
  host: config.database.host,
  database: config.database.database,
  port: 5432,
  // ssl: { rejectUnauthorized: false }
});

const db = drizzle(pool);

export default db;