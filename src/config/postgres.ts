import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
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

export async function checkConnection() {
  try {
    await db.execute(sql`SELECT NOW()`);
    console.log("> Database connection Sucessfull!");
    console.log("> Running Migrations...");
    await migrate(db, { migrationsFolder: "./migrations" });
    console.log("> Migrations Complete.\n");
  } catch (error) {
    console.error("> Database connection ", error);
  }
}
