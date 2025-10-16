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

/**
 * @desc    Send an email for either OTP verification or account verification
 * @param   {string} email - User email to send the message
 * @param   {string} type - Type of email ('otp' or 'verification')
 * @param   {string} [code] - OTP code if type is 'otp'
 */
// export const sendEmail = async (email, type, code = "") => {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     let subject;
//     let htmlContent;

//     if (type === "verification") {
//       const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, {
//         expiresIn: process.env.JWT_EXPIRE_TIME,
//       });
//       subject = "Email Verification";
//       htmlContent = emailTemplate(token);
//     } else if (type === "otp") {
//       subject = "Your OTP Code";
//       htmlContent = otpTemplate(code);
//     } else {
//       throw new Error("Invalid email type. Must be 'otp' or 'verification'.");
//     }

//     const info = await transporter.sendMail({
//       from: `"PFlow 👻" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject,
//       html: htmlContent,
//     });

//     console.log("Email sent: %s", info.messageId);
//   } catch (error) {
//     console.error("Error sending email: ", error);
//   }
// };