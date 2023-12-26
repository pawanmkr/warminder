import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import { Secret } from "jsonwebtoken";
import { QueryResultRow } from "pg";
import { Tokens } from "../types/index.js";
import { Token, hashPassword } from "../utils/index.js";
import { User } from "../models/index.js";
import { sendEmailVerificationLink } from "./email.js";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const privateKey: Secret = process.env.JWT_SECRET_KEY;
if (privateKey === undefined) {
  throw new Error("JWT_SECRET NOT FOUND");
}

export class UserController {
  // Registration Controller
  static async registerNewUser(req: Request, res: Response, next: NextFunction) {
    const { user_type, first_name, last_name, username, email, password, created_by } = req.body;
    const hashedPassword = hashPassword(password);

    const existingUser: boolean = await User.doesEmailAlreadyExists(email);
    if (existingUser) {
      return res.status(409).send("Email Already Exists! Please Login");
    }
    const usernameOccupied: boolean = await User.doesUserAlreadyExists(username);
    if (usernameOccupied) { // if username is not available
      return res.status(409).send(`Please choose another username, ${username} is not available`);
    }
    const registeredUser: QueryResultRow = await User.registerNewUser(
      user_type,
      first_name,
      last_name,
      username,
      email,
      hashedPassword
    );
    if (created_by === undefined || created_by === null) {
      await User.updateCreator(registeredUser.user_id, registeredUser.user_id);
    } else {
      await User.updateCreator(registeredUser.user_id, created_by);
    }
    const session: Tokens = await Token.createNewSession(registeredUser.user_id, registeredUser.user_type, privateKey as string);
    await sendEmailVerificationLink(registeredUser.email);
  
    res.status(201).json({
      message: `User Registration Succesfull`,
      access_token: session.accessToken,
      refresh_token: session.refreshToken
    });
    next();
  }

  // Login Controller
  static async login(req: Request, res: Response, next: NextFunction) {
    const { username, email, password } = req.body;
    if (!username && !email) {
      return res.status(400).json({ error: 'Username or Email is required' });
    }

    const existingUser: QueryResultRow = await User.findExistingUser(null, username, email)
    if (!existingUser) {
      return res.status(404).send("User does not exists! Please Signup");
    }

    const hashedPassword = hashPassword(password);
    if (existingUser.password !== hashedPassword) {
      return res.status(404).send("username or passowrd is incorrect");
    }
    const session: Tokens = await Token.createNewSession(existingUser.user_id, existingUser.user_type, privateKey as string);

    return res.status(201).json({
      message: `Login Succesfull`,
      access_token: session.accessToken,
      refresh_token: session.refreshToken
    });
    next();
  }
}
