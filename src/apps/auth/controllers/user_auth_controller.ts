import { NextFunction, Request, Response } from "express";
import { Token, hashPassword } from "../utils/index.js";
import { sendEmailVerificationLink } from "../../../services/email.js";
import { User } from "../services/dbServices.js";
import config from "../../../../configs/config.js";

export async function register_new_user(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { name, email, country_code, phone, password } = req.body;
  const hashed_password = hashPassword(password);

  const existing_user = await User.find_existing_user(null, email);
  if (existing_user) {
    return res.status(409).send("Email Already Exists! Please Login");
  }

  const registeredUser = await User.register_new_user(
    name,
    email,
    country_code,
    phone,
    hashed_password,
  );

  const session = await Token.create_new_session(
    registeredUser.id,
    config.jwtSecret,
  );

  await sendEmailVerificationLink(registeredUser.email);

  res.status(201).json({
    message: "User Registration Succesfull",
    access_token: session.access_token,
    refresh_token: session.refresh_token,
  });

  next();
}

// Login Controller
export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const existing_user = await User.find_existing_user(null, email);
  if (!existing_user) {
    return res.status(404).send("User does not exists! Please Signup");
  }

  const hashed_password = hashPassword(password);
  if (existing_user.password !== hashed_password) {
    return res.status(404).send("Email or Passowrd is Incorrect");
  }

  const session = await Token.create_new_session(
    existing_user.id,
    config.jwtSecret,
  );

  return res.status(201).json({
    message: "Login Succesfull",
    access_token: session.access_token,
    refresh_token: session.refresh_token,
  });
}
