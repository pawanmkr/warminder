import client from "../config/db.js";
import { QueryResultRow } from "pg";

export class Password {
  static async registerResetRequest(email: string, token: string, expiry: number): Promise<QueryResultRow> {
    const query = `
      INSERT INTO auth.password_reset_request (email, token, expiry)
      VALUES ($1, $2, $3) RETURNING *
    `;
    const res = await client.query(query, [email, token, expiry]);
    return res.rows[0];
  }
  
  static async findResetRequestByToken(resetToken: string): Promise<QueryResultRow> {
    const res = await client.query(
      `SELECT * FROM auth.password_reset_request WHERE token = $1`, 
    [resetToken]);
    return res.rows[0];
  }
  
  static async deleteResetRequest(email: string): Promise<void> {
    await client.query(
      `DELETE FROM auth.password_reset_request WHERE email = $1`, 
    [email]);
  }
}