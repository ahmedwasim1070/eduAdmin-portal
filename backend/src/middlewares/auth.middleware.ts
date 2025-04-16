import { Request, Response, NextFunction } from "express";
import userModel from "../models/user.model.js";

interface CustomRequest extends Request {
  isRoot?: boolean;
}

export const isRoot = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const isRoot = await userModel.findOne({ role: "root" });
    if (isRoot) {
      return res.status(409).json({
        message: "There can be only one root user at a time",
        isRoot: true,
      });
    }

    req.isRoot = false;
    next();
  } catch (error) {
    console.log("Error in isRoot Middleware ", error);
    return res.status(500).json({ message: "Internel server error ! " });
  }
};
