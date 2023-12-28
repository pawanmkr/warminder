import { NextFunction, Request, Response } from "express";
import { Token, hashPassword } from "../utils/index.js";
import { sendEmailVerificationLink } from "../../../services/email.js";
import { User } from "../services/dbServices.js";
import config from "../../../../configs/config.js";

const jwtSecretKey = config.jwtSecret;

export async function registerNewUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { name, email, phone, password } = req.body;
  const hashedPassword = hashPassword(password);

  const existingUser = await User.findExistingUser(null, email);
  if (existingUser) {
    return res.status(409).send("Email Already Exists! Please Login");
  }

  const registeredUser = await User.registerNewUser(
    name,
    email,
    phone,
    hashedPassword,
  );

  const session = await Token.createNewSession(registeredUser.id, jwtSecretKey);

  await sendEmailVerificationLink(registeredUser.email);

  res.status(201).json({
    message: "User Registration Succesfull",
    access_token: session.accessToken,
    refresh_token: session.refreshToken,
  });

  next();
}

// Login Controller
export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const existingUser = await User.findExistingUser(null, email);
  if (!existingUser) {
    return res.status(404).send("User does not exists! Please Signup");
  }

  const hashedPassword = hashPassword(password);
  if (existingUser.password !== hashedPassword) {
    return res.status(404).send("Email or Passowrd is Incorrect");
  }

  const session = await Token.createNewSession(existingUser.id, jwtSecretKey);

  return res.status(201).json({
    message: "Login Succesfull",
    access_token: session.accessToken,
    refresh_token: session.refreshToken,
  });
}
