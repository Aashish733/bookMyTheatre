import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import { config } from "../config/config";

export const isEmailConfigured = () =>
  Boolean(config.emailUsername && config.emailPassword);

let cachedTransporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo> | null =
  null;

export const getMailTransporter = () => {
  if (!isEmailConfigured()) {
    throw new Error(
      "Email is not configured. Set NODEMAILER_EMAIL and NODEMAILER_PASSWORD in backend .env",
    );
  }

  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.emailUsername,
        pass: config.emailPassword,
      },
    });
  }

  return cachedTransporter;
};

export const sendMail = async (options: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) => {
  const transporter = getMailTransporter();

  const message = {
    from: `"BookMyTheatre" <${config.emailUsername}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  };

  const info = await transporter.sendMail(message);

  console.log(
    `[Email] to=${options.to} accepted=${info.accepted?.join(",")} rejected=${info.rejected?.join(",")} response=${info.response}`,
  );

  if (info.rejected?.length) {
    throw new Error(`Email rejected for: ${info.rejected.join(", ")}`);
  }

  return info.messageId;
};
