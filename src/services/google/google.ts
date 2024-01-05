import config from "../../../configs/config.js";
import axios from "axios";

export async function get_refresh_token(authorization_code: string) {
    const token_endpoint = "https://oauth2.googleapis.com/token";

    try {
        const response = await axios.post(token_endpoint, {
            code: authorization_code,
            client_id: config.google.client_id,
            client_secret: config.google.client_secret,
            redirect_uri: config.google.redirect_uri,
            grant_type: "authorization_code",
        });

        return response.data;
    } catch (error) {
        console.error("Error getting refresh token:", error);
        return null;
    }
}

export function get_google_oauth_url() {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

    const options = {
        redirect_uri: config.google.redirect_uri,
        client_id: config.google.client_id,
        access_type: "offline",
        response_type: "code",
        prompt: "consent",
        scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
            "https://mail.google.com/"
        ].join(" "),
    };

    const qs = new URLSearchParams(options);

    return `${rootUrl}?${qs.toString()}`;
}

export async function get_google_user_profile(id_token: string, access_token: string) {
    try {
        const res = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
            {
                headers: {
                    Authorization: `Bearer ${id_token}`,
                },
            }
        );
        return res.data;
    } catch (error: any) {
        console.error(error, "Error fetching Google user");
        throw new Error(error.message);
    }
}
