import { Request, Response } from "express";
import { Template } from "../services/databases/queries.js";
import { TTemplate } from "../shared/types.js";


export async function get_all_templates(req: Request, res: Response) {
    const user_id = parseInt(req.query.user_id as string);
    const temp = await Template.get_all_templates_by_user_id(user_id);
    return res.send(temp);
}


export async function create_new_template(req: Request, res: Response) {
    const user_id = parseInt(req.query.user_id as string);
    const { subject, body } = req.body;

    const attachments: string[] = []
    if (req.files) {
        // upload files to cdn and update attachmetns
    }

    const template: TTemplate = {
        subject,
        body,
        attachments
    }

    const tmp = await Template.create_new_template(user_id, template);
    return res.status(201).send(tmp);
}
