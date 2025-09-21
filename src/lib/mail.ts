// src/lib/mail.ts
import nodemailer from "nodemailer";

type MailerType = {
  to: string;
  subject: string;
  html?: string;
};

export const sendMail = async (data: MailerType) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
    },
  });

  return await transporter.sendMail({
    from: `Waste Tracker <${process.env.NODEMAILER_USER}>`,
    to: data.to,
    subject: data.subject,
    html: data.html,
  });
};

export const sendVerifyEmail = async (to: string) => {
  const html = `
    <div>
        <h3>WASTE TRACKER SYSTEM</h3>
        <h3>Verification Code</h3>
        <p>Enter the following verification code when prompted:</p>
        <p>To protect your account, do not share this code.</p>
        <p>
          Didn't request this?<br/>
          This code was generated for this email during signup at ${process.env.BASE_URL}.
          If you didn't make this request, you can safely ignore this email.
        </p>
    </div>`;

  return sendMail({
    to,
    subject: "Your Verification Code",
    html,
  });
};
