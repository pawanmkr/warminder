import { drizzle } from "drizzle-orm/node-postgres";
import { pgSchema } from "drizzle-orm/pg-core";

import pkg from "pg";
const { Pool } = pkg;

import config from "../../configs/config.js";

const pool = new Pool({
  user: config.database.username,
  password: config.database.password,
  host: config.database.host,
  database: config.database.database,
  port: 5432,
  // ssl: { rejectUnauthorized: false }
});

const db = drizzle(pool);

export const contributorSchema = pgSchema("contributor");
export const jobSeekerSchema = pgSchema("job_seeker");

export default db;
