import jwt, { JwtPayload } from "jsonwebtoken";
import { Session } from "./dbServices.js";

export class Token {
    static generate_access_token(user_id: number, jwt_secret: string): string {
        const payload: JwtPayload = {
            user_id: user_id,
        };

        return jwt.sign(payload, jwt_secret, {
            expiresIn: "1h",
        });
    }

    static generate_refresh_token(user_id: number, jwt_secret: string): string {
        return jwt.sign({ user_id: user_id }, jwt_secret, {
            expiresIn: "365d",
        });
    }

    /*
   * Creating a timestamp in Epoch format
   * for respective days or hours in future from now
   * i.e. the expiry time of refresh token generated in respective token
   */
    static generate_epoch_timestamp_in_hours(hours: number): number {
        const current_date = new Date();
        current_date.setHours(current_date.getHours() + hours);
        return current_date.getTime();
    }

    static generate_epoch_timestamp_in_days(days: number): number {
        const current_date = new Date();
        current_date.setHours(current_date.getHours() + 24 * days);
        return current_date.getTime();
    }

    static async create_new_session(id: number, jwt_secret: string) {
        const access_token = this.generate_access_token(id, jwt_secret);
        const refresh_token = this.generate_refresh_token(id, jwt_secret);

        const expiry = BigInt(this.generate_epoch_timestamp_in_days(365));

        await Session.grant_new_session(refresh_token, expiry, id);

        return {
            access_token,
            refresh_token,
        };
    }
}
