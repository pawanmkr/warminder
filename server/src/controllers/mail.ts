import { Request, Response } from "express";
import {send_mail_using_gmail} from "../services/google/gmail.js";
import {Gmail} from "../../types/google.js";
import {User} from "../apps/auth/services/dbServices.js";
import config from "../../configs/config.js";

export async function send_cold_mail(req: Request, res: Response) {
    const { receiver, body_text, subject } = req.body;
    const { user_id} = req.query;

    const user = await User.get_user_with_federated_credentials(parseInt(user_id as string));
    if (!user) {
        return res.status(404).json({
            message: "Invalid User"
        });
    }

    const data: Gmail = {
        sender: {
            email: user.email,
            name: user.name,
        },
        receiver_email: receiver,
        mail: {
            subject: subject,
            body: {
                text: body_text,
                // html: body_html,
            },
            // attachments
        },
        client_id: config.google.client_id,
        client_secret: config.google.client_secret,
        access_token: user.access_token,
        refresh_token: user.refresh_token,
    };

    await send_mail_using_gmail(data);
}
