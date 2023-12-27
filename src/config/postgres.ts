import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { pgSchema } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

import pkg from "pg";
const { Pool } = pkg;

import config from "../../configs/config.js";

let ssl;
if (config.env === "dev") {
  ssl = false;
} else {
  ssl = { rejectUnauthorized: false };
}

const pool = new Pool({
  user: config.database.username,
  password: config.database.password,
  host: config.database.host,
  database: config.database.database,
  port: 5432,
  ssl: ssl,
});

const db = drizzle(pool);
export default db;

export const contributorSchema = pgSchema("contributor");
export const jobSeekerSchema = pgSchema("job_seeker");

export async function checkConnection() {
  try {
    await db.execute(sql`SELECT NOW()`);
    console.log("> Database connection Sucessfull!");
    await migrate(db, { migrationsFolder: "drizzle" });
  } catch (error) {
    console.error("> Database connection ", error);
  }
}
