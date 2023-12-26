import client from "../config/db.js";
import { QueryResultRow } from "pg";

export class Session {
  static async getSessionByUserId(id: number): Promise<QueryResultRow> {
    const query = `SELECT * FROM auth.session WHERE created_by = $1`;
    const session = await client.query(query, [id]);
    return session.rows[0];
  }

  static async grantNewSession(token: string, expiry: number, created_by: number): Promise<void> {
    const query = `INSERT INTO auth.session (token, expiry, created_by) VALUES ($1, $2, $3) RETURNING *`;
    const session = await client.query(query, [token, expiry, created_by]);
  }
}
