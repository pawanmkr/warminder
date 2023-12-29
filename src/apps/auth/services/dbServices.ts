import {
  deactivated,
  emailVerificationAndPasswordResetRequests,
  session,
  users,
} from "../schema.js";
import db from "../../../config/postgres.js";
import { eq } from "drizzle-orm";
//import { UserUpdate } from "../../../shared/types.js";

export class User {
  static async findExistingUser(userId?: number | null, email?: string | null) {
    let user: any[] = [];

    if (userId) {
      user = await db.select().from(users).where(eq(users.id, userId));
    } else if (email) {
      user = await db.select().from(users).where(eq(users.email, email));
    }

    return user[0];
  }

  static async registerNewUser(
    name: string,
    email: string,
    country_code: number,
    phone: string,
    password: string,
  ) {
    const res = await db
      .insert(users)
      .values({
        name: name,
        email: email,
        country_code: country_code,
        phone: phone,
        password: password,
      })
      .returning();

    return res[0];
  }

  static async updatePassword(userId: number, newPassword: string) {
    return await db
      .update(users)
      .set({ password: newPassword })
      .where(eq(users.id, userId));
  }

  static async updateEmailVerificationStatus(email: string) {
    return await db
      .update(users)
      .set({ emailVerified: true })
      .where(eq(users.email, email));
  }

  static async getUserById(id: number) {
    const res = await db
      .select({
        id: users.id,
        name: users.id,
        email: users.email,
        country_code: users.country_code,
        phone: users.phone,
        emailVerified: users.emailVerified,
      })
      .from(users)
      .where(eq(users.id, id));

    return res[0];
  }

  static async updateUser(fields: any, id: number) {
    return await db
      .update(users)
      .set(fields)
      .where(eq(users.id, id))
      .returning();
  }

  static async deactivateUser(userId: number) {
    return await db
      .insert(deactivated)
      .values({ userId: userId })
      .returning({ userId: deactivated.userId });
  }

  static async deleteUser(userId: number) {
    return await db.delete(users).where(eq(users.id, userId));
  }
}

// Session class
export class Session {
  static async getSessionByUserId(id: number) {
    return await db.select().from(session).where(eq(session.userId, id));
  }

  static async grantNewSession(token: string, expiry: bigint, userId: number) {
    return await db
      .insert(session)
      .values({ token, expiry, userId })
      .returning();
  }
}

// Password class
export class Password {
  static async registerResetRequest(
    email: string,
    token: string,
    expiry: bigint,
  ) {
    return await db
      .insert(emailVerificationAndPasswordResetRequests)
      .values({ email, token, expiry })
      .returning();
  }

  static async findResetRequestByToken(resetToken: string) {
    return await db
      .select()
      .from(emailVerificationAndPasswordResetRequests)
      .where(eq(emailVerificationAndPasswordResetRequests.token, resetToken));
  }

  static async deleteResetRequest(email: string) {
    return await db
      .delete(emailVerificationAndPasswordResetRequests)
      .where(eq(emailVerificationAndPasswordResetRequests.email, email))
      .returning();
  }
}

// EmailVerification class
export class EmailVerification {
  static async saveEmailForVerification(
    email: string,
    token: string,
    expiry: bigint,
  ) {
    return await db
      .insert(emailVerificationAndPasswordResetRequests)
      .values({ email, token, expiry })
      .returning();
  }

  static async findEmailVerificationRequestByToken(
    emailVerificationToken: string,
  ) {
    const res = await db
      .select()
      .from(emailVerificationAndPasswordResetRequests)
      .where(
        eq(
          emailVerificationAndPasswordResetRequests.token,
          emailVerificationToken,
        ),
      );

    return res[0];
  }

  static async deleteEmailVerificationRequest(email: string) {
    return await db
      .delete(emailVerificationAndPasswordResetRequests)
      .where(eq(emailVerificationAndPasswordResetRequests.email, email));
  }
}
