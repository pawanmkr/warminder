export { };

import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';

declare global {
  interface ExtendedRequest extends Request {
    user: string | JwtPayload | undefined
  }
}