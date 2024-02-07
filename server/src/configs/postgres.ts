import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { sql } from "drizzle-orm";
import config from "../../configs/config.js";

import pkg from "pg";
const { Pool } = pkg;

let ssl;
if (config.env === "dev") {
  ssl = true;
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

export async function check_connection() {
  try {
    await db.execute(sql`SELECT NOW()`);
    console.log("> Database connection Successful!");
    console.log("> Running Migrations...");
    await migrate(db, { migrationsFolder: "./migrations" });
    console.log("> Migrations Complete.\n");
  } catch (error) {
    console.error("> Database connection ", error);
  }
}