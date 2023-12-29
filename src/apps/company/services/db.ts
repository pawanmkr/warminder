import db from "../../../config/postgres.js";
import { companies, emails } from "../schema.js";

export class Company {
  static async save_company(name: string, location: string) {
    return await db.insert(companies).values({ name, location }).returning();
  }

  static async save_email(email: string, company_id: number, user_id: number) {
    await db.insert(emails).values({ email, company_id, user_id });
  }

  static async get_all_the_companies() {
    return db
      .select({ name: companies.name, location: companies.location })
      .from(companies)
      .limit(25);
  }
}
