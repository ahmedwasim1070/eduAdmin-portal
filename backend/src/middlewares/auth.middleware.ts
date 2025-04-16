import userModel from "../models/user.model.js";
import { NextFunction, Request, Response } from "express";

export interface CustomRequest extends Request {
  isRoot?: boolean;
}

export const isRoot = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const isRootUser = await userModel.findOne({ role: "root" });
    if (isRootUser) {
      res.status(409).json({
        message: "Root already exsists",
      });
      return;
    }

    (req as CustomRequest).isRoot = false;

    next();
  } catch (error) {
    console.log("Error in isRoot middleware ", error);
    res.status(500).json({ message: "Internal server error!" });
  }
};
