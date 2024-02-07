import { eq, sql } from "drizzle-orm";
import db from "../../../configs/postgres.js";
import {
  companies,
  company_role,
  company_skill,
  emails,
  roles,
  skills,
} from "../../../schema/schema.js";


export class Company {
  /**
   * Saves a new company to the database.
   *
   * @param name - The name of the company.
   * @param location - The location of the company.
   * @param size
   * @param website
   */
  static async save_company(
    name: string,
    location: string,
    size: string,
    website: string,
    picture_url: string,
  ) {
    const res = await db
      .insert(companies)
      .values({ name, location, size, website, picture: picture_url })
      .returning();
    return res[0];
  }


  static async save_role(company_id: number, role_name: string) {
    let role_res;
    role_res = await db.select().from(roles).where(eq(roles.role, role_name));
    if (!role_res) {
      role_res = await db.insert(roles).values({ role: role_name }).returning();
    }

    await db.insert(company_role).values({ company_id, role_id: role_res[0].id });
  }


  static async save_skill(company_id: number, skill_name: string) {
    let skill_res;
    skill_res = await db.select().from(skills).where(eq(skills.skill, skill_name));
    if (!skill_res) {
      skill_res = await db.insert(skills).values({ skill: skill_name }).returning();
    }

    await db.insert(company_skill).values({ company_id, skill_id: skill_res[0].id });
  }


  static async does_email_already_exists(email: string) {
    const res = await db.select().from(emails).where(eq(emails.email, email));
    return !!res;
  }


  /**
   * Saves a new email associated with a company and user.
   *
   * @param email - The email address to save.
   * @param company_id - The ID of the company the email belongs to.
   * @param user_id - The ID of the user associated with the email.
   */
  static async save_email(email: string, company_id: number, user_id: number) {
    await db.insert(emails).values({ email, company_id, user_id });
  }


  /**
   * Retrieves a list of companies with their names and locations.
   *
   * @returns An array of company objects with limited fields.
   */
  static async get_all_the_companies() {
    const res = await db.execute(sql`
            SELECT
                c.id,
                c.name,
                c.picture,
                c.size,
                c.website,
                c.location,
                array_remove(array_agg(distinct (r.role)), NULL) AS roles,
                array_remove(array_agg(distinct (s.skill)), NULL) AS skills
            FROM companies c
            LEFT JOIN company_role cr ON c.id = cr.company_id
            LEFT JOIN roles r ON cr.role_id = r.id
            LEFT JOIN company_skill cs ON c.id = cs.company_id
            LEFT JOIN skills s ON cs.skill_id = s.id
            GROUP BY c.id;`
    );
    return res.rows;
  }
}
