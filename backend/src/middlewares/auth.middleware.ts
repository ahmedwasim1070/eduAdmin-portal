// Types Express
import { NextFunction, Response, Request } from "express";

// JWT
import jwt from "jsonwebtoken";
// User Model for mongoDB
import userModel from "../models/user.model.js";

// Extend Request type to include `user`
export interface AuthenticatedRequest extends Request {
  user?: any; // You can replace `any` with your actual user type if defined
}

// Validates cookie
export const validateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Fetch token from cookie
    const token = req.cookies?.token;

    if (!token) {
      res.status(401).json({ message: "Access denied. No token provided." });
      return;
    }

    // Verifies token
    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    if (!verifiedToken || !verifiedToken.userId) {
      res.status(401).json({ message: "Invalid token!" });
      return;
    }

    // Fetch user from DB
    const user = await userModel
      .findById(verifiedToken.userId)
      .select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found!" });
      return;
    }

    // Checks for email status
    if (user.emailStatus !== "verified") {
      res.status(403).json({
        message: "Unverified email !",
        redirectEmailVerification: true,
      });
       return;
    }

    // Checks for user status
    if (user.userStatus !== "active") {
      res.status(403).json({ message: "Suspended or Deleted user !" });
      return;
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error);
    res.status(500).json({ message: "Internal server error!" });
    return;
  }
};

// Protects base signup url
export const protectBaseSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Checks if db's is empty
    const users = await userModel.estimatedDocumentCount();
    if (users > 0) {
      res
        .status(403)
        .json({ message: "Base User already exsists", redirect: false });
      return;
    }

    next();
  } catch (error) {
    console.error("Error in protectBaseSignup middleware:", error);
    res.status(500).json({ message: "Internal server error!" });
    return;
  }
};
