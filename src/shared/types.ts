import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";
import { pgEnum } from "drizzle-orm/pg-core";

export interface ExtendedRequest extends Request {
  user?: string | JwtPayload | undefined;
}

export const userTypeEnum = pgEnum("user_type", ["contributor", "job_seeker"]);
