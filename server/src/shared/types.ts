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

// T in beginning stads for type
export type TTemplate = {
  id?: number
  subject: string
  body: string
  attachments: string[]
}