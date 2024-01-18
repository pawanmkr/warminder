import {bigint, integer, pgTable, serial, text, timestamp, varchar} from "drizzle-orm/pg-core";

export const user = pgTable("users", {
    id: serial("id").primaryKey(),
    name: text("name"),
    email: text("email").unique(),
    country_code: integer("country_code"),
    phone_number: varchar("phone_number", { length: 10 }).unique(),
    picture: text("picture").default(""),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", {withTimezone: true}).defaultNow().notNull(),
});

export const session = pgTable("session", {
    id: serial("id").primaryKey(),
    user_id: integer("user_id").references(() => user.id, { onDelete: "cascade" }),
    token: text("token").unique(),
    expiry: bigint("expiry", { mode: "bigint" }),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const federated_credentials = pgTable("federated_credentials", {
    id: serial("id").primaryKey(),
    provider: text("provider"),
    access_token: text("access_token").unique(),
    refresh_token: text("refresh_token").unique(),
    user_id: integer("user_id").references(() => user.id, { onDelete: "cascade" }),
});

export const deactivated = pgTable("deactivated", {
    id: serial("id").primaryKey(),
    user_id: integer("user_id").references(() => user.id, { onDelete: "cascade" }),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const company = pgTable("company", {
    id: serial("id").primaryKey(),
    name: text("name"),
    location: text("location"),
    size: text("size").default("1-10"),
    website: text("website").default(""),
    picture: text("picture").default(""),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", {withTimezone: true}).defaultNow().notNull(),
});

export const email = pgTable("email", {
    id: serial("id").primaryKey(),
    email: text("email"),
    upvote: integer("upvote").default(0),
    downvote: integer("downvote").default(0),
    user_id: integer("user_id").references(() => user.id, { onDelete: "cascade" }),
    company_id: integer("company_id").references(() => company.id, { onDelete: "cascade" }),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const skill = pgTable("skill", {
    id: serial("id").primaryKey(),
    skill: text("skill").unique(),
});

export const company_skill = pgTable("company_skill", {
    company_id: integer("company_id").references(() => company.id, { onDelete: "cascade" }),
    skill_id: integer("skill_id").references(() => skill.id, { onDelete: "cascade" }),
});

export const role = pgTable("role", {
    id: serial("id").primaryKey(),
    role: text("role").unique(),
});

export const company_role = pgTable("company_role", {
    company_id: integer("company_id").references(() => company.id, { onDelete: "cascade" }),
    role_id: integer("role_id").references(() => role.id, { onDelete: "cascade" }),
});
