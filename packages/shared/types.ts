import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';

export interface ExtendedRequest extends Request {
  user?: string | JwtPayload | undefined
}