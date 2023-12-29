import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * User-related database operations
 */
export class User {
  /**
   * Finds an existing user by ID or email.
   *
   * @param user_id - The ID of the user to find (optional).
   * @param email - The email address of the user to find (optional).
   * @returns The found user object, or null if not found.
   */
  static async find_existing_user(
    user_id?: number | null,
    email?: string | null,
  ) {
    if (user_id) {
      return prisma.users.findUnique({
        where: { id: user_id },
      });
    } else if (email) {
      return prisma.users.findUnique({
        where: { email: email },
      });
    }

    return null;
  }

  /**
   * Registers a new user in the database.
   *
   * @param name - The name of the user.
   * @param email - The email address of the user.
   * @param country_code - The country code of the user.
   * @param phone_number - The phone number of the user.
   * @param password - The password of the user (hashed before storing).
   * @returns The created user object.
   */
  static async register_new_user(
    name: string,
    email: string,
    country_code: number,
    phone_number: string,
    password: string,
  ) {
    return prisma.users.create({
      data: {
        name,
        email,
        country_code,
        phone_number,
        password, // ensure password is hashed before storing
      },
    });
  }

  /**
   * Updates the password of an existing user.
   *
   * @param user_id - The ID of the user to update.
   * @param new_password - The new password for the user (hashed before updating).
   * @returns Empty object representing successful update.
   */
  static async update_password(user_id: number, new_password: string) {
    return prisma.users.update({
      where: { id: user_id },
      data: { password: new_password }, // ensure password is hashed before updating
    });
  }

  /**
   * Marks an existing user's email as verified.
   *
   * @param email - The email address of the user to update.
   * @returns Empty object representing successful update.
   */
  static async update_email_verification_status(email: string) {
    return prisma.users.update({
      where: { email: email },
      data: { email_verified: true },
    });
  }

  /**
   * Retrieves information about a user by their ID.
   *
   * @param id - The ID of the user to retrieve.
   * @returns The user object with specified fields.
   */
  static async get_user_by_id(id: number) {
    return prisma.users.findUnique({
      where: { id: id },
      select: {
        id: true,
        name: true,
        email: true,
        country_code: true,
        phone_number: true,
        email_verified: true,
      },
    });
  }

  /**
   * Updates specific fields of an existing user.
   *
   * @param fields - An object containing the fields to update and their values.
   * @param id - The ID of the user to update.
   * @returns The updated user object.
   */
  static async update_user(fields: any, id: number) {
    return prisma.users.update({
      where: { id: id },
      data: fields,
    });
  }

  /**
   * Deactivates a user by adding their ID to the "deactivated" table.
   *
   * @param user_id - The ID of the user to deactivate.
   * @returns The newly created entry in the "deactivated" table.
   */
  static async deactivate_user(user_id: number) {
    return prisma.deactivated.create({
      data: { user_id: user_id },
    });
  }

  /**
   * Permanently deletes a user from the database.
   *
   * @param user_id - The ID of the user to delete.
   * @returns Empty object representing successful deletion.
   */
  static async delete_user(user_id: number) {
    await prisma.users.delete({
      where: { id: user_id },
    });
  }
}

/**
 * Session-related database operations
 */
export class Session {
  /**
   * Retrieves a session by the associated user ID.
   *
   * @param user_id - The ID of the user to find the session for.
   * @returns The found session object, or null if not found.
   */
  static async get_session_by_user_id(user_id: number) {
    return prisma.session.findFirst({
      where: { user_id: user_id },
    });
  }

  /**
   * Creates a new session for a user.
   *
   * @param token - The session token.
   * @param expiry - The expiry time of the session (bigint).
   * @param user_id - The ID of the user associated with the session.
   * @returns The newly created session object.
   */
  static async grant_new_session(
    token: string,
    expiry: bigint,
    user_id: number,
  ) {
    return prisma.session.create({
      data: { token, expiry, user_id },
    });
  }
}

/**
 * Password-related database operations
 */
export class Password {
  /**
   * Registers a new password reset request.
   *
   * @param email - The email address of the user requesting a password reset.
   * @param token - The unique token for the password reset request.
   * @param expiry - The expiry time of the password reset request (bigint).
   * @returns The created password reset request object.
   */
  static async register_reset_request(
    email: string,
    token: string,
    expiry: bigint,
  ) {
    return prisma.email_verification_and_password_reset_requests.create({
      data: { email, token, expiry },
    });
  }

  /**
   * Finds a password reset request by its token.
   *
   * @param reset_token - The token of the password reset request to find.
   * @returns The found password reset request object, or null if not found.
   */
  static async find_reset_request_by_token(reset_token: string) {
    return prisma.email_verification_and_password_reset_requests.findUnique({
      where: { token: reset_token },
    });
  }

  /**
   * Deletes a password reset request by email.
   *
   * @param email - The email address associated with the password reset request to delete.
   * @param reset_token - The Reset Token also
   * @returns Empty object representing successful deletion.
   */
  static async delete_reset_request(email: string, reset_token: string) {
    return prisma.email_verification_and_password_reset_requests.delete({
      where: { email: email, token: reset_token },
    });
  }
}

/**
 * Email verification-related database operations
 */
export class EmailVerification {
  /**
   * Saves an email for verification.
   *
   * @param email - The email address to be verified.
   * @param token - The unique token for the verification process.
   * @param expiry - The expiry time of the verification request (bigint).
   * @returns The created verification request object.
   */
  static async save_email_for_verification(
    email: string,
    token: string,
    expiry: bigint,
  ) {
    return prisma.email_verification_and_password_reset_requests.create({
      data: { email, token, expiry },
    });
  }

  /**
   * Finds an email verification request by its token.
   *
   * @param email_verification_token - The token of the verification request to find.
   * @returns The found verification request object, or null if not found.
   */
  static async find_email_verification_request_by_token(
    email_verification_token: string,
  ) {
    return prisma.email_verification_and_password_reset_requests.findUnique({
      where: { token: email_verification_token },
    });
  }

  /**
   * Deletes an email verification request by email.
   *
   * @param email - The email address associated with the verification request to delete.
   * @param token - Token also
   * @returns Empty object representing successful deletion.
   */
  static async delete_email_verification_requests(
    email: string,
    token: string,
  ) {
    return prisma.email_verification_and_password_reset_requests.delete({
      where: { email: email, token: token },
    });
  }
}
