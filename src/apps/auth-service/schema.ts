import {
  serial,
  varchar,
  text,
  pgSchema,
  integer,
  timestamp,
  boolean,
} from 'drizzle-orm/pg-core';
import { userTypeEnum } from '../../shared/types.js';

const userSchema = pgSchema('user');

export const users = userSchema.table('users', {
  id: serial('id').primaryKey(),
  userType: userTypeEnum('user_type').notNull(),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  phone: varchar('phone', { length: 10 }).unique(),
  password: text('password').notNull(),
  emailVerified: boolean('email_verified').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const emailVerificationAndPasswordResetRequests = userSchema.table(
  'email_verification_and_password_reset_request',
  {
    id: serial('id').primaryKey(),
    email: text('email').unique().notNull(),
    token: text('token').unique().notNull(),
    expiry: integer('expiry').notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
  },
);

export const session = userSchema.table('session', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  token: text('token').unique().notNull(),
  expiry: integer('expiry').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const deactivated = userSchema.table('deactivated', {
  id: serial('id').primaryKey(),
  deactivatedAt: timestamp('deactivated_at').defaultNow(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
});
