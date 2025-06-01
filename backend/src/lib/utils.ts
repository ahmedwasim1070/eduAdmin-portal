// Types Express
import { Response } from "express";

// JWT
import jwt from "jsonwebtoken";

// Creates encrypted token
export const createJwtToken = (userId: string, res: Response): void => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: "7d", // Token expires in 7 days
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "development",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return;
};
