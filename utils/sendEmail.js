/* eslint-disable import/prefer-default-export */
// eslint-disable-next-line import/no-extraneous-dependencies
import nodemailer from "nodemailer";
// eslint-disable-next-line import/no-extraneous-dependencies

export const sendEmail = async (Options) => {
    // 1) Create transporter ( service that will send email like "gmail")
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT, // if secure false port = 587, if true port = 465
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    // 2) Define email options (like from, to, subject, email content)
    const mailOpts = {
        from: `Noonify App <${process.env.EMAIL_USER}>`,
        to: Options.email,
        subject: Options.subject,
        text: Options.message,
    };

    // 3) Send email
    await transporter.sendMail(mailOpts);
}