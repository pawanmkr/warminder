import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { Token, errorInResponse, hashPassword, sendMail, messageForEmailVerification, messageForPasswordReset } from "../utils/index.js";
import { User, Password } from "../models/index.js";

const TOKEN_LENGTH = 32;

export async function generatePasswordResetToken(req: Request, res: Response, next: NextFunction) {
  const { email } = req.body;
  const emailExists: boolean = await User.doesEmailAlreadyExists(email);
  if (!emailExists) {
    return res.status(404).json({
      error: `User does not with ${email}`
    });
  }
  const token = crypto.randomBytes(TOKEN_LENGTH).toString('hex');
  const expiry = Token.generateEpochTimestampInHours(24);
  await Password.registerResetRequest(email, token, expiry);

  const magicLink = `${process.env.CLIENT_URL}/password_reset?token=${token}`;
  const mailSent = await sendMail(email, "Request for Password Reset", messageForPasswordReset(magicLink));
  if (!mailSent) {
    return res.status(500).send("Internal Server Error");
  }

  res.status(201).json({
    magic_link: magicLink
  });
  next();
}

export async function confirmPasswordReset(req: Request, res: Response, next: NextFunction) {
  const { password, confirm_password, reset_token } = req.body;
  if (password !== confirm_password) {
    return errorInResponse(res, 400, "Entered passwords do not match");
  }

  const result = await Password.findResetRequestByToken(reset_token);
  if (!result) {
    return errorInResponse(res, 404, "Invalid token provided");
  }

  const now = new Date();
  if (now.getTime() > result.expiry) {
    return errorInResponse(res, 406, "Link expired! Please try again");
  }

  const user = await User.findExistingUser(null, null, result.email);
  if (!user) {
    return errorInResponse(res, 500, "Internal Server Error");
  }

  await User.updatePassword(user.user_id, hashPassword(password));
  await Password.deleteResetRequest(user.email);
  res.status(201).json({
    message: "Password changed Succesfully"
  });
  next();
}