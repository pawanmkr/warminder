import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import {
  Token,
  errorInResponse,
  hashPassword,
  //sendMail,
  //messageForEmailVerification,
  //messageForPasswordReset,
} from "../utils/index.js";
import { User, Password } from "../services/dbServices.js";

const TOKEN_LENGTH = 32;

export async function generate_password_reset_token(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { email } = req.body;

  const email_exists = await User.find_existing_user(null, email);
  if (!email_exists) {
    return res.status(404).json({
      error: `User does not with ${email}`,
    });
  }

  const token = crypto.randomBytes(TOKEN_LENGTH).toString("hex");
  const expiry = BigInt(Token.generate_epoch_timestamp_in_hours(24));

  await Password.register_reset_request(email, token, expiry);

  const magicLink = `${process.env.CLIENT_URL}/password_reset?token=${token}`;

  // const mailSent = await sendMail(email, "Request for Password Reset", messageForPasswordReset(magicLink));
  // if (!mailSent) {
  //   return res.status(500).send("Internal Server Error");
  // }

  res.status(201).json({
    magic_link: magicLink,
  });

  next();
}

export async function confirm_password_reset(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { password, confirm_password, reset_token } = req.body;
  if (password !== confirm_password) {
    return errorInResponse(res, 400, "Entered passwords do not match");
  }

  const result = await Password.find_reset_request_by_token(reset_token);
  if (!result) {
    return errorInResponse(res, 404, "Invalid token provided");
  }

  const now = new Date();
  if (now.getTime() > result.expiry) {
    return errorInResponse(res, 406, "Link expired! Please try again");
  }

  const user = await User.find_existing_user(null, result.email);
  if (!user) return errorInResponse(res, 500, "Internal Server Error");

  await User.update_password(user.id, hashPassword(password));

  await Password.delete_reset_request(user.email, reset_token);

  res.status(201).json({
    message: "Password changed Succesfully",
  });

  next();
}
