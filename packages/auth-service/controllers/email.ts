import crypto from "crypto";
import { NextFunction, Request, Response } from "express";
import { Token, errorInResponse } from "../utils/index.js";
import { EmailVerification, User } from "../models/index.js";
import { messageForEmailVerification, sendMail } from "../utils/index.js";

const TOKEN_LENGTH = 32;

export async function sendEmailVerificationLink(email: string) {
  const token = crypto.randomBytes(TOKEN_LENGTH).toString('hex');
  const expiry = Token.generateEpochTimestampInHours(24);
  await EmailVerification.saveEmailForVerification(email, token, expiry);

  const verificationLink = `${process.env.BASE_API_URL}/email/verify/confirm?token=${token}`;
  const mailSent = await sendMail(email, "Email Verification", messageForEmailVerification(verificationLink));
  if (!mailSent) {
    // throw new Error("Failed to send Email Verification link");
    console.log(`Failed to send Email Verification link at: ${email}`);
  }
}

export async function confirmEmailVerification(req: Request, res: Response, next: NextFunction) {
  const token = req.query.token as string;
  const result = await EmailVerification.findEmailVerificationRequestByToken(token);
  if (!result) return errorInResponse(res, 404, "Invalid Token");

  const now = new Date();
  if (result.expiry < now.getTime()) {
    return errorInResponse(res, 400, "Verification Token Expired");
  }

  await EmailVerification.deleteEmailVerificationRequest(result.email);
  await User.updateEmailVerificationStatus(result.email);

  res.status(201).json({
    message: "Email Verified Succesfully"
  });
  next();
}