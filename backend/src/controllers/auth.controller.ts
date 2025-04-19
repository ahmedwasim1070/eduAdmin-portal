import userModel, { IUser } from "../models/user.model.js";
import { Response, Request } from "express";
import { createToken } from "../lib/util.js";
import { CustomRequest } from "../middlewares/auth.middleware.js";

// Check's Auth
export const checkAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log(`${(req as CustomRequest).user.user.email} just logged in ! `);
    res.status(200).json({
      message: "Token verified - Logging In",
      user: (req as CustomRequest).user,
    });
    return;
  } catch (error) {
    console.log("Error in checAuth controller", error);
    res.status(500).json({ message: "Internel server error ! " });
    return;
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  try {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{0,3})+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ message: "Enter the valid email" });
      return;
    }

    const user = (await userModel.findOne({ email })) as IUser;
    if (!user) {
      res.status(404).json({ message: "User not found !" });
      return;
    }
    if (user.loginAttempt >= 5) {
      res.status(408).json({ message: "To many wront attempts ! Timed out" });
      return;
    }
    user.incrementLoginAttempt();
    await user.save();

    const validCredentials = await user.comparePassword(password);
    if (!validCredentials) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    createToken(res, user._id);
    user.resetLoginAttempt();
    await user.save();
    console.log(`${email} just logged in !`);
    res.status(200).json({ message: "Credentials matched" });
    return;
  } catch (error) {
    console.error("Error in login controller", error);
    res.status(500).json({ message: "Internal server error !" });
    return;
  }
};

// Root Signup
export const registerSignup = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { fullName, email, contactNumber, password, role, status } = req.body;
  if (!fullName || !email || !contactNumber || !password || !role || !status) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  try {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{0,3})+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ message: "Enter the valid email" });
      return;
    }

    const root = await userModel.findOne({ email });
    if (root) {
      res
        .status(409)
        .json({ message: "Account already registered with one account" });
      return;
    }

    const phoneRegex = /^\+?\d{10,14}$/;
    if (!phoneRegex.test(contactNumber)) {
      res.status(400).json({ message: "Invalid phone number !" });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({ message: "Invalid password !" });
      return;
    }

    const newRoot = new userModel({
      fullName,
      email,
      contactNumber,
      password,
      role,
      status,
    });
    await newRoot.save();

    console.log(`${newRoot.email} just got registered as root`);
    res.status(201).json({ message: "Root created successfully!" });
    return;
  } catch (error) {
    console.error("Error in resgisterSignup controller:", error);
    res.status(500).json({ message: "Internal server error !" });
    return;
  }
};
