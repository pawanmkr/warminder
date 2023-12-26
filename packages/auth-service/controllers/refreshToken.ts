import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import { Token } from "../utils/index.js";
import { User, Session } from "../models/index.js";

const privateKey = process.env.JWT_SECRET_KEY;

export async function verifyAndRefreshToken(req: Request, res: Response, next: NextFunction) {
  const { refresh_token } = req.body;
  jwt.verify(refresh_token, privateKey, async (err: any, user: {user_id: string}) => {
    if (err) {
      console.log("got an error")
      return res.status(403).json({
        error: "The token has been tampered"
      })
    }

    const session = await Session.getSessionByUserId(parseInt(user.user_id));
    if (session.expiry <= Math.floor(Date.now() / 1000)) {
      return res.status(403).json({
        error: "Token Expired"
      });
    }
    
    const usr = await User.getUserById(parseInt(user.user_id));
    const accessToken = Token.generateAccessToken(parseInt(user.user_id), usr.user_type, privateKey);
    
    res.status(201).json({
      access_token: accessToken,
    });
  })
}