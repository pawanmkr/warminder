import { Request, Response } from "express";
import { get_google_user_profile } from "../../../services/google/google.js";
import { User } from "../services/dbServices.js";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import config from "../../../../configs/config.js";

export async function handle_google_oauth(req: Request, res: Response) {
    try {
        const { code } = req.body;

        // Step 1: Get refresh token from Google
        const oAuth2Client = new OAuth2Client(
            config.google.client_id,
            config.google.client_secret,
            "postmessage",
        );

        const { tokens } = await oAuth2Client.getToken(code);
        if (!tokens.id_token || !tokens.access_token || !tokens.refresh_token) {
            return res.status(500).json({
                message: "Something went wrong with Google Services."
            });
        }

        // Extract relevant data from the response
        const { id_token, access_token, refresh_token } = tokens;

        // Step 2: Get user profile from Google using access token
        const profile = await get_google_user_profile(id_token, access_token);
        if (!profile || !profile.verified_email) {
            return res.status(500).json({
                message: "Failed to fetch Google User Profile or User's Email is not verified."
            });
        }

        // Step 3: Check if the user already exists in your database
        let user;
        user = await User.find_existing_federated_credentials_with_user_details(profile.id, "google");

        // Step 4: If the user doesn't exist, register a new user
        if (!user) {
            user = await User.register_new_user(profile, access_token, refresh_token);
        }

        // create jwt token and send in response
        const token =
            jwt.sign(
                { user_id: user.id },
                config.jwtSecret
            );
        return res.status(201).send(token);

    } catch (error) {
        console.error("Error in handle_google_callback:", error);
        return res.status(500).json({
            message: "Internal Server Error."
        });
    }
}
