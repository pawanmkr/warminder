import { Request, Response } from "express";
import {get_google_user_profile, get_refresh_token} from "../../../services/google.js";
import { User } from "../services/dbServices.js";

export async function handle_google_callback(req: Request, res: Response) {
    const data = await get_refresh_token(req.query.code as string);
    if (!data) {
        return res.status(500).json({
            message: "Something went wrong with Google Services."
        });
    }
    const { id_token, access_token, refresh_token } = data;

    const profile = await get_google_user_profile(id_token, access_token);
    if (!profile) {
        return res.status(500).json({
            message: "Failed to fetch Google User Profile."
        });
    }
    else if (!profile.verified_email) {
        return res.status(500).json({
            message: "Google User's Email is Not Verified."
        });
    }

    const existing_user =
        await User.find_existing_federated_credentials(profile.id, "google");

    if (!existing_user) {
        const registerd_user =
            await User.register_new_user(profile, access_token, refresh_token);
        return res.status(201).json(registerd_user);
    }
}
