import { count, eq } from "drizzle-orm";
import db from "../../configs/postgres.js";
import { templates, user_campaigns, user_templates } from "../../schema/schema.js";
import { TTemplate } from "../../shared/types.js";


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


export class Template {
  static async get_all_templates_by_user_id(user_id: number) {
    return db
      .select({
        id: templates.id,
        subject: templates.subject,
        body: templates.body,
        attachments: templates.attachments
      })
      .from(templates)
      .leftJoin(user_templates, eq(templates.id, user_templates.template_id))
      .where(eq(user_templates.user_id, user_id))
      .execute();
  }

  static async create_new_template(user_id: number, template: TTemplate) {
    const tmp = await db
      .insert(templates)
      .values({
        subject: template.subject,
        body: template.body,
        attachments: template.attachments
      })
      .returning();

    console.log(tmp);

    await db
      .insert(user_templates)
      .values({
        user_id: user_id,
        template_id: tmp[0].id
      });

    return tmp[0];
  }
}