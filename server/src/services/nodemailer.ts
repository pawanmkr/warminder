import * as nodemailer from "nodemailer";
import config from "../../configs/config.js";

const transporter = nodemailer.createTransport({
    host: "smtp.zoho.in",
    port: 465,
    secure: true,
    auth: {
        user: config.email.zoho.mail,
        pass: config.email.zoho.password,
    },
});

export async function sendMail(
    recipient: string,
    subject: string,
    message: string,
) {
    const mailOptions = {
        from: config.email.zoho.mail,
        to: recipient,
        subject: subject,
        text: message,
    };

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
    2023 Badsquad Bharat Council aka BBC`;
};

export const messageForPasswordReset = (magicLink: string) => {
    return `
    To reset the password, please click here: ${magicLink}
    If you didn't request this link, you can safely ignore this email.
    2023 Badsquad Bharat Council aka BBC`;
};
