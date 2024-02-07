import nodemailer from "nodemailer";
import {Gmail} from "../../../types/google.js";

export async function send_mail_using_gmail(data: Gmail) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: data.sender.email,
      clientId: data.client_id,
      clientSecret: data.client_secret,
      accessToken: data.access_token,
      refreshToken: data.refresh_token
    },
  });

  const mailOptions = {
    from: `${data.sender.name} <${data.sender.email}>`,
    to: data.receiver_email,
    subject: data.mail.subject,
    text: data.mail.body.text,
    html: data.mail.body.html || "",
    // attachments: data.mail.attachments,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}
