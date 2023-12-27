import { Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../../../configs/config.js';
import { ExtendedRequest } from '../../../shared/types.js';

export default async function verifyJwtToken(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader: string = req.headers.authorization || '';
  const token: string = (authHeader && authHeader.split(' ')[1]) || '';

  if (token) {
    jwt.verify(
      token,
      config.jwtSecret,
      (err: jwt.VerifyErrors | null, user: string | JwtPayload | undefined) => {
        if (err) {
          console.error(err);
          return res
            .status(403)
            .json({ error: 'Failed to authenticate token.' });
        }
        req.user = user;
        next();
      },
    );
  } else {
    res.status(401).send('Authorization Token is Missing');
  }
}
