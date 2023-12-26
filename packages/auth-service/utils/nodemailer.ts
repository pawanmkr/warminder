import * as nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.join(process.cwd(), '.env')
});

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.in",
  port: 465,
  secure: true,
  auth: {
    user: process.env.ZOHOMAIL,
    pass: process.env.ZOHOMAIL_PASSWORD
  }
});

export async function sendMail(recipient: string, subject: string, message: string): Promise<boolean> {
  const mailOptions = {
    from: process.env.ZOHOMAIL,
    to: recipient,
    subject: subject,
    text: message
  }
  
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.log("err: ", error);
    return false;
  }
}

export const messageForEmailVerification = (verificationLink: string) => {
  return `
  Thank you for signing up! To verify your email address, please click here: ${verificationLink}

  If you didn't request this verification, you can safely ignore this email.

  2023 Badsquad Bharat Council aka BBC`
};

export const messageForPasswordReset = (magicLink: string) => {
  return `
  To reset the password, please click here: ${magicLink}

  If you didn't request this link, you can safely ignore this email.

  2023 Badsquad Bharat Council aka BBC`
};