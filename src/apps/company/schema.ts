import {
  pgSchema,
  text,
  serial,
  timestamp,
  unique,
  integer,
} from "drizzle-orm/pg-core";
import { users } from "../auth/schema.js";

/**
 * Defines a schema named "company" for organizing database tables.
 */
export const company_schema = pgSchema("company");

/**
 * Creates a table named "companies" within the "company" schema with the following columns:
 *
 * - id: A unique serial number (integer) acting as the primary key.
 * - name: A text field for storing the company name, required to be not null.
 * - location: A text field for storing the company's location (optional).
 * - created_at: A timestamp indicating when the record was created, automatically set to the current time.
 * - updated_at: A timestamp tracking when the record was last updated.
 *
 * Enforces a unique constraint named "unique_name_location" to ensure that no two companies can have the same name and location combination.
 */
export const companies = company_schema.table(
  "companies",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    location: text("location"),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at"),
  },
  (t) => ({
    customUniqueConstraint: unique("unique_name_location").on(
      t.name,
      t.location,
    ),
  }),
);

/**
 * Creates a table named "emails" within the "company" schema with the following columns:
 *
 * - id: A unique serial number (integer) acting as the primary key.
 * - email: A text field for storing the email address, required to be not null.
 * - upvote: An integer field tracking the number of upvotes for the email, defaulting to 0 and not null.
 * - downvote: An integer field tracking the number of downvotes for the email, defaulting to 0 and not null.
 * - created_at: A timestamp indicating when the record was created, automatically set to the current time.
 * - updated_at: A timestamp tracking when the record was last updated.
 * - user_id: An integer field referencing the associated user's ID, enforcing referential integrity with a "cascade" delete action.
 * - company_id: An integer field referencing the associated company's ID, enforcing referential integrity with a "cascade" delete action.
 */
export const emails = company_schema.table("emails", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  upvote: integer("upvote").default(0).notNull(),
  downvote: integer("downvote").default(0).notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at"),
  user_id: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
});
