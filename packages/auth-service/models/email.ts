import client from "../config/db.js";
import { QueryResultRow } from "pg";

export class EmailVerification {
  static async saveEmailForVerification(email: string, token: string, expiry: number): Promise<QueryResultRow> {
    const query = `
      INSERT INTO auth.email_verification (email, token, expiry)
      VALUES ($1, $2, $3) RETURNING *
    `;
    const res = await client.query(query, [email, token, expiry]);
    return res.rows[0];
  }
  
  static async findEmailVerificationRequestByToken(emailVerificationToken: string): Promise<QueryResultRow> {
    const res = await client.query(
      `SELECT * FROM auth.email_verification WHERE token = $1`, 
    [emailVerificationToken]);
    return res.rows[0];
  }
  
  static async deleteEmailVerificationRequest(email: string): Promise<void> {
    await client.query(
      `DELETE FROM auth.email_verification WHERE email = $1`, 
    [email]);
  }
}