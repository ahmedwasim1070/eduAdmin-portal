import { Response } from "express";
import nodemailer from "nodemailer";
import crypto from "crypto";
import JWT from "jsonwebtoken";

export const createToken = (res: Response, userId: string): string => {
  const token = JWT.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  res.cookie("secret_key", token, {
    maxAge: 7 * 24 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};

export const generateSecurePin = (length = 6): string => {
  const buffer = crypto.randomBytes(length);
  const digits = "0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += digits[buffer[i] % 10];
  }

  return code;
};

export const sendMail = async (email: string): Promise<string> => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: process.env.NODE_ENV !== "development",
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASS,
    },
  });

  const otp = generateSecurePin();

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #f4f4f4; border-radius: 8px;">
      <div style="background: #ffffff; padding: 30px; border-radius: 8px; text-align: center;">
        <h2 style="color: #333;">Verify Your Email</h2>
        <p style="color: #555; font-size: 16px;">
          Hello 👋,<br /><br />
          Thank you for signing up with <strong>EduAdmin Portal</strong>.<br />
          Please use the following verification code to complete your registration:
        </p>
        <div style="margin: 30px 0; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #007bff;">
          ${otp}
        </div>
        <p style="color: #999; font-size: 14px;">
          This code will expire in 10 minutes. If you didn’t request this, you can safely ignore it.
        </p>
      </div>
      <p style="text-align: center; font-size: 12px; color: #aaa; margin-top: 20px;">
        © ${new Date().getFullYear()} EduAdmin Portal. All rights reserved.
      </p>
    </div>
  `;

  const info = await transporter.sendMail({
    from: `"Support | EduAdmin Portal" <${process.env.SMTP_MAIL}>`,
    to: email,
    subject: "Verify Your Email",
    html,
  });

  return otp;
};
