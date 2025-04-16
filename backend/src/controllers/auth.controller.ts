import userModel from "../models/user.model.js";
import { Request, Response } from "express";

export const rootSignup = async (req: Request, res: Response) => {
  const {
    fullName,
    email,
    contactNumber,
    password,
  } = req.body;
  try {
  } catch (error) {}
};
