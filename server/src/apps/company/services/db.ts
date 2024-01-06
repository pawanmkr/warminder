import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class Company {
    /**
   * Saves a new company to the database.
   *
   * @param name - The name of the company.
   * @param location - The location of the company.
   * @param size
   * @param website
   */
    static async save_company(name: string, location: string, size: number, website: string) {
        return await prisma.companies.create({
            data: { name, location, size, website },
        });
    }

    static async save_tag(company_id: number, tag_id: number) {
        await prisma.company_tags.create({
            data: { company_id: company_id, tag_id: tag_id }
        });
    }

    static async get_tag(tag: string) {
        return prisma.tags.findFirst({
            where: { tag: tag }
        });
    }

    static async does_email_already_exists(email: string) {
        const res = 
      await prisma.emails.findFirst({
          where: { email: email }
      });

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
