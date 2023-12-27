import {
  deactivated,
  emailVerificationAndPasswordResetRequests,
  session,
  users,
} from '../schema.js';
import db from '../../../config/postgres.js';
import { eq, sql } from 'drizzle-orm';

enum UserType {
  Contributor = 'contributor',
  JobSeeker = 'job_seeker',
}

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
    userType: UserType,
    name: string,
    email: string,
    phone: string,
    password: string,
  ) {
    const res = await db
      .insert(users)
      .values({ userType, name, email, phone, password })
      .returning();
    return res[0];
  }

  /* static async updateCreator(id: number, created_by: number) {
    await db.update(users).set({ created_by }).where(eq(users.id, id));
  } */

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
    return await db
      .select({
        id: users.id,
        name: users.id,
        email: users.email,
        phone: users.phone,
        emailVerified: users.emailVerified,
        userType: users.userType,
      })
      .from(users)
      .where(eq(users.id, id));
  }

  static async updateUser(fields: string[]) {
    /*
     *  CONTEXT
     *  fields.length + 1 is the user_id which has been attached/pushed in it
     */
    const userId = fields.length + 1;

    return await db.execute(sql`
      UPDATE user.users SET ${fields.join(', ')} WHERE id = $${userId};`);
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

  static async grantNewSession(token: string, expiry: number, userId: number) {
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
    expiry: number,
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
    expiry: number,
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
