import type { Config } from "drizzle-kit";
import config from "./configs/config";

export default {
  schema: [
    "./dist/src/apps/auth/schema.js",
    "./dist/src/apps/company/schema.js",
  ],
  out: "./migrations",
  driver: "pg",
  dbCredentials: {
    host: config.database.host,
    user: config.database.username,
    password: config.database.password,
    database: config.database.database,
  },
} satisfies Config;
