import { drizzle } from "drizzle-orm/postgres-js";
import {
  company,
  company_role,
  company_skill,
} from "../../../schema/schema.js";
import { eq } from "drizzle-orm";

// const db =

export class Company {
  /**
   * Saves a new company to the database.
   *
   * @param name - The name of the company.
   * @param location - The location of the company.
   * @param size
   * @param website
   */
  // static async save_company(
  //   name: string,
  //   location: string,
  //   size: string,
  //   website: string,
  //   picture_url: string,
  // ) {
  //   return await prisma.companies.create({
  //     data: { name, location, size, website, picture: picture_url },
  //   });
  // }

  static async save_company(
    name: string,
    location: string,
    size: string,
    website: string,
    picture_url: string,
  ) {
    return await db
      .insert(company)
      .value({ name, location, size, website, picture_url });
  }

  static async save_role(company_id: number, role: string) {
    try {
      let role_res;

      role_res = await db.role.where("role", "=", role).first();
      if (!role_res) {
        role_res = await db.insert(role).value({ company_id, role });
      }

      await db.insert(company_role).value(company_id, role_res.id);
      // I don't know what is going on down here!!!
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          console.log("There is a unique constraint violation.");
        }
      } else {
        throw e;
      }
    }
  }
  static async save_skill(company_id: number, skill: string) {
    try {
      let skill_res;

      skill_res = await db.skill.where("skill", "=", skill).first();
      if (!skill_res) {
        skill_res = await db.insert(skill).value({ company_id, skill });
      }

      await db.insert(company_skill).value(company_id, skill_res.id);

      // I don't know what is going on down here!!!
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          console.log("There is a unique constraint violation.");
        }
      } else {
        throw e;
      }
    }
  }

  // static async save_skill(company_id: number, skill: string) {
  //   try {
  //     let skill_res;
  //
  //     skill_res = await prisma.skills.findFirst({ where: { skill } });
  //     if (!skill_res) {
  //       skill_res = await prisma.skills.create({ data: { skill } });
  //     }
  //
  //     await prisma.company_skills.create({
  //       data: { company_id, skill_id: skill_res.id },
  //     });
  //   } catch (e) {
  //     if (e instanceof Prisma.PrismaClientKnownRequestError) {
  //       if (e.code === "P2002") {
  //         console.log("There is a unique constraint violation.");
  //       }
  //     } else {
  //       throw e;
  //     }
  //   }
  // }

  // static async get_role(role: string) {
  //   return prisma.roles.findFirst({
  //     where: { role },
  //   });
  // }
  static async get_role(role: string) {
    return await db.select().from(role).where(eq(role.role, role));
  }

  // static async get_skill(skill: string) {
  //   return prisma.skills.findFirst({
  //     where: { skill },
  //   });
  // }

  static async get_skill(skill: string) {
    return await db.select().from(skill).where(eq(skill.skill, skill));
  }

  // static async does_email_already_exists(email: string) {
  //   const res = await prisma.emails.findFirst({
  //     where: { email: email },
  //   });
  //
  //   return !!res;
  // }

  static async does_email_already_exists(email: string) {
    const res = await db.select().from(email).where(eq(email.email, email));

    return !!res;
  }
  /**
   * Saves a new email associated with a company and user.
   *
   * @param email - The email address to save.
   * @param company_id - The ID of the company the email belongs to.
   * @param user_id - The ID of the user associated with the email.
   */
  // static async save_email(email: string, company_id: number, user_id: number) {
  //   await prisma.emails.create({
  //     data: { email, user_id, company_id },
  //   });
  // }
  //
  static async save_email(email: string, company_id: number, user_id: number) {
    await db.insert(email).value({ email, company_id, user_id });
  }
  /**
   * Retrieves a list of companies with their names and locations.
   *
   * @returns An array of company objects with limited fields.
   */
  static async get_all_the_companies() {
    return prisma.$queryRawUnsafe(`
            SELECT
                c.id,
                c.name,
                c.picture,
                c.size,
                c.website,
                c.location,
                array_remove(array_agg(distinct (r.role)), NULL) AS roles,
                array_remove(array_agg(distinct (s.skill)), NULL) AS skills
            FROM company.companies c
            LEFT JOIN company.company_roles cr ON c.id = cr.company_id
            LEFT JOIN company.roles r ON cr.role_id = r.id
            LEFT JOIN company.company_skills cs ON c.id = cs.company_id
            LEFT JOIN company.skills s ON cs.skill_id = s.id
            GROUP BY c.id;`);
  }
}
