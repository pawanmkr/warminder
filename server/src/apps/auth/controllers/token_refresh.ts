import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Token } from "../utils/index.js";
import { Session } from "../services/dbServices.js";
import config from "../../../../configs/config.js";

export async function verifyAndRefreshToken(req: Request, res: Response) {
  const { refreshToken } = req.body;

  jwt.verify(refreshToken, config.jwtSecret, async (err: any, user: any) => {
    if (err) {
      return res.status(403).json({
        error: "The token has been tampered",
      });
    }

    const session = await Session.get_session_by_user_id(
      parseInt(user.user_id),
    );
    if (session && session.expiry <= Math.floor(Date.now() / 1000)) {
      return res.status(403).json({
        error: "Token Expired",
      });
    }

    const accessToken = Token.generate_access_token(
      parseInt(user.user_id),
      config.jwtSecret,
    );

    res.status(201).json({
      access_token: accessToken,
    });
  });
}
