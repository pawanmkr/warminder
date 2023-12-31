import { sendEmailVerificationLink } from "../../../services/email/email.js";
import { Request, Response } from "express";
import { errorInResponse } from "../utils/index.js";
import { EmailVerification, User } from "../services/dbServices.js";
// import { messageForEmailVerification, sendMail } from "../utils/index.js";

export async function sendMagicLink(req: Request, res: Response) {
  const { email } = req.body;

  const sent = await sendEmailVerificationLink(email);
  if (!sent) {
    return res.status(500);
  }

  return res.status(201).json({
    message:
      "Please check your inbox or spam folder for the magic verification link",
  });
}

export async function confirmEmailVerification(req: Request, res: Response) {
  const token = req.query.token as string;

  const result =
    await EmailVerification.find_email_verification_request_by_token(token);
  if (!result) return errorInResponse(res, 404, "Invalid Token");

  const now = new Date();
  if (result.expiry < now.getTime()) {
    return errorInResponse(res, 400, "Verification Token Expired");
  }

  await EmailVerification.delete_email_verification_requests(
    result.email,
    token,
  );
  await User.update_email_verification_status(result.email);

  res.json({
    message: "Email Verified Succesfully",
  });
}
