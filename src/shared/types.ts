import { Request } from "express";

export interface ExtendedRequest extends Request {
  user?: {
    user_id: number;
  };
}

export type UserUpdate = {
  name: string;
  email: string;
  phone: string;
  password: string;
};
