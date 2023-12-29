import crypto from "crypto";
import { EmailVerification } from "../apps/auth/services/dbServices.js";
import { Token } from "../apps/auth/services/tokenAndSession.js";
import { sendMail, messageForEmailVerification } from "./nodemailer.js";
import config from "../../configs/config.js";

const TOKEN_LENGTH = 32;

export async function sendEmailVerificationLink(email: string) {
  const token = crypto.randomBytes(TOKEN_LENGTH).toString("hex");

  const expiry = BigInt(Token.generate_epoch_timestamp_in_hours(24));

  await EmailVerification.save_email_for_verification(email, token, expiry);

  const verificationLink = `${config.baseApiUrl}/auth/email/verify/confirm?token=${token}`;

  const mailSent = await sendMail(
    email,
    "Email Verification",
    messageForEmailVerification(verificationLink),
  );

  if (!mailSent) {
    return false;
  }
  return true;
}
