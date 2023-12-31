import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class Company {
  /**
   * Saves a new company to the database.
   *
   * @param name - The name of the company.
   * @param location - The location of the company.
   */
  static async save_company(name: string, location: string) {
    return await prisma.companies.create({
      data: { name, location },
    });
  }

  static async does_email_already_exists(email: string) {
    const res = 
      await prisma.emails.findFirst({
        where: { email: email }
      });

    if (res) {
      return true;
    } 
    return false;
  }

  /**
   * Saves a new email associated with a company and user.
   *
   * @param email - The email address to save.
   * @param company_id - The ID of the company the email belongs to.
   * @param user_id - The ID of the user associated with the email.
   */
  static async save_email(email: string, company_id: number, user_id: number) {
    await prisma.emails.create({
      data: { email, user_id, company_id },
    });
  }

  /**
   * Retrieves a list of companies with their names and locations.
   *
   * @returns An array of company objects with limited fields.
   */
  static async get_all_the_companies() {
    return prisma.companies.findMany({
      select: { id: true, name: true, location: true },
      take: 25, // Limit to 25 results
    });
  }
}
