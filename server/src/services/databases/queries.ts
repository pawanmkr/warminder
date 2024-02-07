import { count, eq } from "drizzle-orm";
import db from "../../configs/postgres.js";
import { user_campaigns } from "../../schema/schema.js";


export class Campaign {
  static async get_user_campaigns_count(id: number) {
    return db
      .select({
        total: count(user_campaigns.user_id)
      })
      .from(user_campaigns)
      .where(eq(user_campaigns.user_id, id));
  }

  static async save_sheet(user_id: number, rows: any) {
    await db.insert(user_campaigns).values({ user_id, rows });
  }

  static async find_all_user_sheets(user_id: number) {
    return db
      .select({
        campaigns: user_campaigns.rows
      })
      .from(user_campaigns)
      .where(eq(user_campaigns.user_id, user_id));
  }
}
