import { Response, Request } from "express";

import userModel, { IUser } from "../models/user.model.js";

import { createToken } from "../lib/util.js";

import { CustomRequest } from "../middlewares/auth.middleware.js";

import { mailOTP } from "./mailer.controller.js";

// Check's Auth
export const checkAuth = async (req: Request, res: Response): Promise<void> => {
  const user = (req as CustomRequest).user;
  try {
    user.lastLogin = Date.now();
    await user.save();

    console.log(`${user.email} just logged in ! `);
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

// Checks Root exsists
export const checkRoot = async (req: Request, res: Response): Promise<void> => {
  try {
    const isRoot = await userModel.findOne({ role: "root" });
    if (isRoot) {
      res
        .status(409)
        .json({ message: "Root user already exsists", exsists: true });
      return;
    }

    res
      .status(200)
      .json({ message: "Root does not exsists Signup ! ", exsists: false });
    return;
  } catch (error) {
    console.log("Error in protectRegisterRoot controller : ", error);
    res.status(500).json({ message: "Internel server error ! " });
    return;
  }
};

// Creates Cookie
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{0,3})+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Invalid email" });
    return;
  }
  try {
    const user = (await userModel.findOne({ email })) as IUser;
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    if (user.loginAttempt >= 5) {
      res.status(423).json({
        message:
          "Account blocked due to too many login attempts. Use OTP login.",
        loginOTP: true,
      });
      return;
    }

    if (user.emailStatus === "verified") {
      user.incrementLoginAttempt();
      await user.save();
    }

    const validCredentials = await user.comparePassword(password);
    if (!validCredentials) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    if (user.emailStatus === "not-verified") {
      res
        .status(401)
        .json({ message: "Email address not verified !", verifyEmail: true });
      return;
    }

    createToken(res, user._id);
    user.resetLoginAttempt();
    await user.save();

    res.status(200).json({ message: "Credentials matched" });
    return;
  } catch (error) {
    console.error("Error in login controller", error);
    res.status(500).json({ message: "Internal server error !" });
    return;
  }
};

// Requests OTP
export const reqOTP = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ message: "All fields are required !" });
    return;
  }
  try {
    const user = (await userModel.findOne({ email })) as IUser;
    if (!user) {
      res.status(404).json({ message: "User not found ! " });
      return;
    }

    if (user.loginAttempt === 0) {
      if (user.emailStatus !== "not-verified") {
        res.status(400).json({ message: "Invalid Request !" });
        return;
      }
    }

    // Do not Pass if the request is under 5 minutes
    if (
      user.otpCreatedAt &&
      !(Date.now() - user.otpCreatedAt > 5 * 60 * 1000)
    ) {
      res.status(429).json({
        message: "OTP cooldown. Please wait before requesting again !",
        coolDown: true,
      });
      return;
    }

    const OTP = await mailOTP(email);
    user.otp = OTP;
    user.otpCreatedAt = Date.now();
    await user.save();

    res.status(200).json({ message: "OTP sended" });
    return;
  } catch (error) {
    console.error("Error in reqOTP controller : ", error);
    res.status(500).json({ message: "Internel server error !" });
    return;
  }
};

// Match OTP
export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  const { email, otp, reqType } = req.body;
  if (!email || !reqType || typeof otp !== "string" || otp.length !== 6) {
    res.status(400).json({ message: "Invalid Request!" });
    return;
  }

  if (
    !reqType ||
    !["verifyemail", "changepass", "otplogin", "forgetpass"].includes(reqType)
  ) {
    res.status(400).json({ message: "Invalid Request !" });
    return;
  }
  try {
    const user = (await userModel.findOne({ email })) as IUser;
    if (!user) {
      res.status(404).json({ message: "User not found ! " });
      return;
    }

    if (!user.otp) {
      res.status(400).json({ message: "Invalid Request ! " });
      return;
    }

    const validOTP = await user.compareOTP(otp);
    if (!validOTP) {
      res.status(400).json({ message: "Invalid OTP" });
      return;
    }

    // Expiry validation of OTP
    if (Date.now() - user.otpCreatedAt > 5 * 60 * 1000) {
      user.otp = "";
      res.status(400).json({ message: "OTP Expired !" });
      return;
    }

    user.otp = "";

    if (
      user.emailStatus !== "verified" &&
      ["verifyemail", "otplogin"].includes(reqType)
    ) {
      user.emailStatus = "verified";

      createToken(res, user._id);

      user.resetLoginAttempt();

      await user.save();

      console.log(`${email} just logged in !`);
      res.status(200).json({ message: "OTP verified !", login: true });
      return;
    }

    if (reqType === "changepass") {
      res.status(200).json({ message: "OTP verified !", changePass: true });
      return;
    }

    if (reqType === "forgetpass") {
      res.status(200).json({ message: "OTP verified !", forgotPass: true });
      return;
    }
  } catch (error) {
    console.error("Error in verifyOTP controller : ", error);
    res.status(500).json({ message: "Internel server error !" });
    return;
  }
};

// Logout
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie("secret_key", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
    });

    res
      .status(200)
      .json({ message: "Logged out successfully", loggedOut: true });
    return;
  } catch (error) {
    console.error("Error in logout controller : ", error);
    res.status(500).json({ message: "Internel server error !" });
  }
};

// Root Signup
export const registerRoot = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { fullName, email, contactNumber, password } = req.body;
  if (!fullName || !email || !contactNumber || !password) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  try {
    const user = await userModel.findOne({ email });
    if (user) {
      res
        .status(409)
        .json({ message: " User already registered ! ", isRoot: true });
      return;
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{0,3})+$/;
    if (!emailRegex.test(email)) {
      res
        .status(400)
        .json({ message: "Invalid Email addresss ! ", errorEmail: true });
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
      role: "root",
      status: "active",
    });
    await newRoot.save();

    console.log(`${newRoot.email} just got registered as root`);
    res.status(200).json({ message: "Root created successfully!" });
    return;
  } catch (error) {
    console.error("Error in registerRoot controller:", error);
    res.status(500).json({ message: "Internal server error !" });
    return;
  }
};
