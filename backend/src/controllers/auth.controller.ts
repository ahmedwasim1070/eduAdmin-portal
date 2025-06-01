// Express
import { Request, Response } from "express";

// Middleware
import { AuthenticatedRequest } from "../middlewares/auth.middleware.js";

// Validators
import {
  errorMessageThrower,
  validateFullName,
  validateEmail,
  validateContactNUmber,
  validatePassword,
  validateConfirmPassword,
  validateRole,
  validateCollegeName,
  validateUserLocation,
} from "../lib/validator.js";

// User Model from mongodb
import userModel from "../models/user.model.js";

// JWT token
import { createJwtToken } from "../lib/utils.js";

// Base root user signup
export const baseSignup = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { fullName, email, contactNumber, password, confirmPassword } =
    req.body;

  // Validations on user payload
  const validations = [
    validateFullName(fullName),
    validateEmail(email),
    validateContactNUmber(contactNumber),
    validatePassword(password),
    validateConfirmPassword(password, confirmPassword),
  ];
  errorMessageThrower(validations, res);
  //
  try {
    // Validates for exsisting user
    const isUser = await userModel.findOne({ email });
    if (!isUser) {
      res.status(409).json({ message: "User already exsists" });
      return;
    }

    // Creatse new user !
    const newUser = new userModel({
      fullName,
      email,
      contactNumber,
      password,
      role: "root",
      createdBy: "self-created",
    });
    // Saves new user
    await newUser.save();

    res.status(200).json({ message: "Base Root user created !" });
    return;
  } catch (error) {
    res.status(500).json({ message: "Invalid request !" });
    console.error("Error in baseSignup controller : ", error);
    return;
  }
};

// Signs up new user by already signed up user !
export const signup = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const authUser = req.user;
  const { fullName, email, contactNumber, password, confirmPassword, role } =
    req.body;

  // Validate Creater user permissions
  const hasPermission = authUser.hasPermissionFor(role);
  if (!hasPermission) {
    res.status(401).json({ message: "authorized to perform that action !" });
    return;
  }

  // Validations on user payload
  const validations = [
    validateFullName(fullName),
    validateEmail(email),
    validateContactNUmber(contactNumber),
    validatePassword(password),
    validateConfirmPassword(password, confirmPassword),
    validateRole(role),
  ];
  errorMessageThrower(validations, res);
  //
  try {
    // Checks if user already exsists
    const user = await userModel.findOne({ email });
    if (user) {
      res.status(409).json({ message: "User already exsists !" });
      return;
    }

    // Root should not be more then 3
    if (role === "root") {
      const rootUser = await userModel.find({ role: "root" });
      if (rootUser.length > 3) {
        res.status(429).json({ message: "Max number of root reached !" });
        return;
      }
    }

    // Creates new user
    let newUser = new userModel({
      fullName,
      email,
      contactNumber,
      password,
      role,
      createdBy: authUser.email,
    });

    // For College Canditates
    if (["principal", "admin", "student"].includes(role)) {
      const { collegeName, userLocation } = req.body;

      // Validations on user payload
      const validations = [
        validateCollegeName(collegeName),
        validateUserLocation(userLocation),
      ];
      errorMessageThrower(validations, res);
      //

      // College should exsists to register admin | student
      const collegePrincipals = await userModel.find({
        collegeName,
        role: "principal",
      });
      // If there is no college for admin | student users
      if (collegePrincipals.length === 0 && role !== "principal") {
        res.status(404).json({ message: "College not found !" });
        return;
      }
      //

      // For principal user should not be more then 3 principal
      if (collegePrincipals.length > 3 && role === "principal") {
        res.status(429).json({ message: "Max number of principal reached !" });
        return;
      }
      //

      // For admin user should not be more then 3
      if (role === "admin") {
        const collegeAdmins = await userModel.find({
          collegeName,
          role: "admin",
        });
        if (collegeAdmins.length > 3) {
          res.status(429).json({ message: "Max number of admin reached !" });
          return;
        }
      }
      //

      // For college canditate payload should be different
      newUser.collegeName = collegeName;
      newUser.userLocation = userLocation;
    }

    // Saves new user
    await newUser.save();

    console.log(`${email} just got registered !`);
    res.status(200).json({ message: "User Registered successfully !" });
    return;
  } catch (error) {
    console.error("Error in signup controller : ", error);
    res.status(500).json({ message: "Internel server error ! " });
    return;
  }
};

// Login creates cookie
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Validations on user payload
  const validations = [validateEmail(email), validatePassword(password)];
  errorMessageThrower(validations, res);
  //
  try {
    const authUser = await userModel.findOne({ email });
    if (!authUser) {
      res.status(404).json({ message: "User not found !" });
      return;
    }

    // Verifies user attempts
    if (authUser.loginAttempt > 5) {
      res.status(429).json({
        message: "Too many password attempts !",
        redirectOtpLogin: true,
      });
      return;
    }

    // Validates password
    const validPassword = authUser.isValidPassword(password);
    if (!validPassword) {
      // Increments login attempt by one
      authUser.incrementLoginAttempt();
      authUser.save();
      res.status(400).json({ message: "Invalid credentials !" });
      return;
    }

    // Resets login attempts
    authUser.resetLoginAttempt();
    authUser.save();

    // Creates authentication cookie
    createJwtToken(authUser._id, res);

    res.status(200).json({ message: "Credentials matched !" });
    return;
  } catch (error) {
    res.status(500).json({ message: "Invalid request !" });
    console.error("Error in login controller : ", error);
    return;
  }
};

// Logouts clear cookies
export const logout = (req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production", // Only use secure in production
    });

    res.status(200).json({ message: "Successfully logged out." });
    return;
  } catch (error) {
    console.error("Error in logout controller:", error);
    res.status(500).json({ message: "Internal server error." });
    return;
  }
};
