import {
  serial,
  varchar,
  text,
  pgSchema,
  integer,
  timestamp,
  boolean,
  bigint,
} from "drizzle-orm/pg-core";

/**
 * Defines a schema named "user" for organizing database tables related to user data.
 */
export const userSchema = pgSchema("user");

/**
 * Creates a table named "users" within the "user" schema with the following columns:
 *
 * - id: A unique serial number (integer) acting as the primary key.
 * - name: A text field for storing the user's name, required to be not null.
 * - email: A text field for storing the user's email address, required to be unique and not null.
 * - phone: A varchar field for storing the user's phone number, limited to 10 characters and enforcing unique values (optional).
 * - password: A text field for storing the user's password, required to be not null.
 * - emailVerified: A boolean field indicating whether the user's email has been verified, defaulting to false.
 * - createdAt: A timestamp indicating when the user record was created, automatically set to the current time and not null.
 * - updatedAt: A timestamp tracking when the user record was last updated.
 */
export const users = userSchema.table("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  country_code: integer("country_code").notNull(),
  phone: varchar("phone", { length: 10 }).unique().notNull(),
  password: text("password").notNull(),
  emailVerified: boolean("email_verified").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
});

/**
 * Creates a table named "email_verification_and_password_reset_request" within the "user" schema with the following columns:
 *
 * - id: A unique serial number (integer) acting as the primary key.
 * - email: A text field for storing the email address associated with the request, required to be not null.
 * - token: A text field for storing a unique token used for verification or password reset, required to be not null.
 * - expiry: A bigint field indicating the expiration timestamp of the token, required to be not null.
 * - created_at: A timestamp indicating when the request record was created, automatically set to the current time and not null.
 */
export const emailVerificationAndPasswordResetRequests = userSchema.table(
  "email_verification_and_password_reset_request",
  {
    id: serial("id").primaryKey(),
    email: text("email").notNull(),
    token: text("token").unique().notNull(),
    expiry: bigint("expiry", { mode: "bigint" }).notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
  },
);

/**
 * Creates a table named "session" within the "user" schema with the following columns:
 *
 * - id: A unique serial number (integer) acting as the primary key.
 * - userId: An integer field referencing the associated user's ID, enforcing referential integrity with a "cascade" delete action.
 * - token: A text field for storing a unique session token, required to be not null.
 * - expiry: A bigint field indicating the expiration timestamp of the session, required to be not null.
 * - created_at: A timestamp indicating when the session record was created, automatically set to the current time and not null.
 */
export const session = userSchema.table("session", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  token: text("token").unique().notNull(),
  expiry: bigint("expiry", { mode: "bigint" }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Creates a table named "deactivated" within the "user" schema with the following columns:
 *
 * - id: A unique serial number (integer) acting as the primary key.
 * - deactivatedAt: A timestamp indicating when the user account was deactivated, automatically set to the current time.
 * - userId: An integer field referencing the associated user's ID, enforcing referential integrity with a "cascade" delete action.
 */
export const deactivated = userSchema.table("deactivated", {
  id: serial("id").primaryKey(),
  deactivatedAt: timestamp("deactivated_at").defaultNow(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
});
