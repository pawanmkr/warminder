import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Token } from '../utils/index.js';
import { User, Session } from '../services/dbServices.js';
import config from '../../../../configs/config.js';

export async function verifyAndRefreshToken(req: Request, res: Response) {
  const { refresh_token } = req.body;

  jwt.verify(refresh_token, config.jwtSecret, async (err: any, user: any) => {
    if (err) {
      console.log('got an error');
      return res.status(403).json({
        error: 'The token has been tampered',
      });
    }

    const session = await Session.getSessionByUserId(parseInt(user.user_id));
    if (session[0].expiry <= Math.floor(Date.now() / 1000)) {
      return res.status(403).json({
        error: 'Token Expired',
      });
    }

    const usr = await User.getUserById(parseInt(user.user_id));
    const accessToken = Token.generateAccessToken(
      parseInt(user.user_id),
      usr[0].userType,
      config.jwtSecret,
    );

    res.status(201).json({
      access_token: accessToken,
    });
  });
}
