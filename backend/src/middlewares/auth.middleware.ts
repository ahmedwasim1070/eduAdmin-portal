import { NextFunction, Request, Response } from "express";
import userModel from "../models/user.model.js";
import JWT, { JwtPayload } from "jsonwebtoken";

export interface protectRouteResponse extends Request {
  user: any;
}

export interface CustomJwtPyaload extends JwtPayload {
  userId: string;
}

// Check the Authentication cookie
export const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.cookies.secret_key;
  if (!token) {
    res.status(401).json({ message: "Unauthorized -No token provided" });
    return;
  }
  try {
    const decoded = JWT.verify(token, process.env.JWT_SECRET!);
    if (!decoded) {
      res.status(401).json({ message: "Unauthorized -Invalid token" });
      return;
    }

    const user = await userModel
      .findById((decoded as CustomJwtPyaload).userId)
      .select("-password");
    if (!user) {
      res.status(401).json({ message: "Unauthorized - No token provided" });
      return;
    }

    (req as protectRouteResponse).user = user;
    next();
  } catch (error) {
    console.log("Error in checkAuth middleware ", error);
    res.status(500).json({ message: "Internal server error!" });
    return;
  }
};

// Verifies if it is Root user or not
export const validateRoot = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const user = (req as protectRouteResponse).user;

  try {
    if (user.role !== "root") {
      res.status(401).json({ message: "Unauthorized !" });
      return;
    }

    next();
  } catch (error) {
    console.log("Error in validateRoot middleware ! :", error);
    res.status(500).json({ message: "Internel server error !" });
    return;
  }
};

// Protect authentication less signup if there is root
export const protectRegisterRoot = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const isRoot = await userModel.findOne({ role: "root" });
    if (isRoot) {
      res.status(409).json({ message: " Root user already exsists !" });
      return;
    }

    next();
  } catch (error) {
    console.log("Error in protectRegisterRoot middleware ", error);
    res.status(500).json({ message: "Internal server error!" });
    return;
  }
};
