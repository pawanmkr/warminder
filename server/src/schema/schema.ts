import { bigint, integer, jsonb, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email").unique(),
  country_code: integer("country_code"),
  phone_number: varchar("phone_number", { length: 10 }).unique(),
  picture: text("picture").default(""),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  token: text("token").unique(),
  expiry: bigint("expiry", { mode: "bigint" }),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const federated_credentials = pgTable("federated_credentials", {
  id: text("id").primaryKey().unique(),
  provider: text("provider"),
  access_token: text("access_token").unique(),
  refresh_token: text("refresh_token").unique(),
  user_id: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
});

export const deactivated_users = pgTable("deactivated_users", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: text("name"),
  location: text("location"),
  size: text("size").default("1-10"),
  website: text("website").default(""),
  picture: text("picture").default(""),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const emails = pgTable("emails", {
  id: serial("id").primaryKey(),
  email: text("email"),
  upvote: integer("upvote").default(0),
  downvote: integer("downvote").default(0),
  user_id: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  company_id: integer("company_id").references(() => companies.id, { onDelete: "cascade" }),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  skill: text("skill").unique(),
});

export const company_skill = pgTable("company_skill", {
  company_id: integer("company_id").references(() => companies.id, { onDelete: "cascade" }),
  skill_id: integer("skill_id").references(() => skills.id, { onDelete: "cascade" }),
});

export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  role: text("role").unique(),
});

export const company_role = pgTable("company_role", {
  company_id: integer("company_id").references(() => companies.id, { onDelete: "cascade" }),
  role_id: integer("role_id").references(() => roles.id, { onDelete: "cascade" }),
});

export const user_campaigns = pgTable("user_campaigns", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  rows: jsonb("rows").notNull(),
});
