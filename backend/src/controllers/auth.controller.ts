import userModel from "../models/user.model.js";
import { Response, Request } from "express";

interface CustomRequest extends Request {
  isRoot?: boolean;
}

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

    const user = await userModel.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found !" });
    }
  } catch (error) {
    console.error("Error in login controller", error);
    
  }
};

// Root Signup
export const registerSignup = async (
  req: Request,
  res: Response
): Promise<void> => {
  const isRoot = (req as CustomRequest).isRoot;

  if (!isRoot) {
    const { fullName, email, contactNumber, password, role, status } = req.body;
    if (!fullName || !email || !contactNumber || !password) {
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

      if (password.length <= 8) {
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
      res.status(500).json({ message: "Internal server error!" });
      return;
    }
  } else {
    res.status(403).json({ message: "Root user already exists!" });
    return;
  }
};
