import userModel, { IUser } from "../models/user.model.js";
import { Response, Request } from "express";
import { createToken, sendMail } from "../lib/util.js";
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
      res.status(408).json({ message: "Account blocked (LOGIN Though OTP)" });
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

// Request OTP for verification
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
    if (user.loginAttempt < 5) {
      if (user.emailStatus !== "not-verified") {
        res.status(400).json({ message: "Invalid Request !" });
        return;
      }
    }

    const OTP = await sendMail(email);
    user.otp = OTP;
    await user.save();

    res.status(200).json({ message: "Verification OTP sent" });
    return;
  } catch (error) {
    console.error("Error in verifyEmailReq controller : ", error);
    res.status(500).json({ message: "Internel server error !" });
    return;
  }
};

// Match OTP
export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  const { email, otp } = req.body;
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
      res.status(400).json({ message: "OTP does not match" });
      return;
    }

    user.otp = "";
    user.emailStatus = "verified";
    createToken(res, user._id);
    user.resetLoginAttempt();
    await user.save();

    console.log(`${email} just logged in !`);
    res.status(200).json({ message: "OTP matched" });
    return;
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
      .json({ message: "Logged out sucessfully", loggedOut: true });
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
        .json({ message: "Account already registered with one account" });
      return;
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{0,3})+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ message: "Enter the valid email" });
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
