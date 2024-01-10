import { Prisma, PrismaClient } from "@prisma/client";
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
    static async save_company(name: string, location: string, size: string, website: string, picture_url: string) {
        return await prisma.companies.create({
            data: { name, location, size, website, picture: picture_url },
        });
    }

    static async save_role(company_id: number, role: string) {
        try {
            let role_res;

            role_res = await prisma.roles.findFirst({ where: { role } });
            if (!role_res) {
                role_res = await prisma.roles.create({ data: { role } });
            }

            await prisma.company_roles.create({
                data: { company_id, role_id: role_res.id },
            });
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

            skill_res = await prisma.skills.findFirst({ where: { skill } });
            if (!skill_res) {
                skill_res = await prisma.skills.create({ data: { skill } });
            }

            await prisma.company_skills.create({
                data: { company_id, skill_id: skill_res.id },
            });
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

    static async get_role(role: string) {
        return prisma.roles.findFirst({
            where: { role }
        });
    }

    static async get_skill(skill: string) {
        return prisma.skills.findFirst({
            where: { skill }
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
            GROUP BY c.id;`
        );
    }
}
