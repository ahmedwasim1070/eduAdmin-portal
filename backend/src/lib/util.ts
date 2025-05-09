import dotenv from "dotenv";
dotenv.config();

import { Response } from "express";
import crypto from "crypto";
import JWT from "jsonwebtoken";
import { createTransport } from "nodemailer";

// Creates JWT authentication token
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

// Generates 6 digit pin
export const generateSecurePin = (length = 6): string => {
  const buffer = crypto.randomBytes(length);
  const digits = "0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += digits[buffer[i] % 10];
  }

  return code;
};

// Nodemailer Gmail SMTP creater
export const transporter = createTransport({
  host: "smtp.gmail.com",
  port: 587,
  // secure: process.env.NODE_ENV !== "development",
  auth: {
    // user: process.env.SMTP_MAIL,
    // pass: process.env.SMTP_PASS,
  },
});
