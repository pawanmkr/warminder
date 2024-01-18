import "dotenv/config";
import type { Config } from "drizzle-kit";
import config from "./configs/config";

export default {
    schema: "./src/schema/schema.ts",
    out: "./migrations",
    driver: "pg",
    dbCredentials: {
        host: config.database.host,
        user: config.database.username,
        password: config.database.password,
        database: config.database.database,
    },
} satisfies Config;
