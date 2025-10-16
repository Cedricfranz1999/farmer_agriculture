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

export const sendVerifyEmail = async (
  to: string,
  status: string,
  name: string,
  rejectionMessage: string | null
) => {
  const rejectionSection = rejectionMessage
    ? `
      <div style="background-color: #ffe6e6; padding: 12px; border-left: 4px solid #d9534f; margin-top: 20px;">
        <p style="margin: 0; color: #b30000;">
          <strong>Rejection Reason:</strong> ${rejectionMessage}
        </p>
      </div>
    `
    : "";

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
      <h2 style="color: #2d6a4f;">Farmer Management System</h2>
      <h3>Hello ${name},</h3>
      <p>Thank you for applying to the <strong>Farmer Management System</strong>.</p>
      <p>Your current application status is: <strong>${status}</strong>.</p>
      ${rejectionSection}
      <p>Please keep this email for your records. If your status changes, you will receive another notification from us.</p>
      <hr style="margin: 20px 0;"/>
      <p style="font-size: 14px; color: #666;">
        This email was sent by the Farmer Management System at ${process.env.BASE_URL}.<br/>
        If you did not apply, you can safely ignore this message.
      </p>
    </div>
  `;

  return sendMail({
    to,
    subject: "Farmer Management System - Application Status",
    html,
  });
};

