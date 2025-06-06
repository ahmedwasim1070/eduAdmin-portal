// Express
import { Request, Response } from "express";

// Middleware Setted Custom Request
import { AuthenticatedRequest } from "../middlewares/auth.middleware.js";

// SMTP mailer
import { sendOtp } from "./smtp.controller.js";

// Validators
import {
  validateFullName,
  validateEmail,
  validateContactNUmber,
  validatePassword,
  validateConfirmPassword,
  validateRole,
  validateCollegeName,
  validateUserLocation,
  validateOTP,
} from "../lib/validator.js";

// User Model from mongodb
import userModel from "../models/user.model.js";

// JWT token
import { createJwtToken } from "../lib/utils.js";

// Send user data after cookie verification
export const checkAuth = (req: AuthenticatedRequest, res: Response) => {
  const authUser = req.user;
  try {
    // Updates last login
    authUser.lastLogin = Date.now();

    // Safe User Payload
    const { password, ...userWithoutPassword } = authUser.toObject();
    res
      .status(200)
      .json({ message: "Logged In !", authUser: userWithoutPassword });
    return;
  } catch (error) {
    res.status(500).json({ message: "Invalid request !" });
    console.error("Error in baseSignup controller : ", error);
    return;
  }
};

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
  const firstError = validations.find((err) => err !== null);
  if (firstError) {
    res.status(400).json({ message: firstError });
    return;
  }
  //
  try {
    // Validates for exsisting user
    const isUser = await userModel.findOne({ email });
    if (isUser) {
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
    res.status(403).json({ message: "Unauthorized to perform that action !" });
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
  const firstError = validations.find((err) => err !== null);
  if (firstError) {
    res.status(400).json({ message: firstError });
    return;
  }
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
      const firstError = validations.find((err) => err !== null);
      if (firstError) {
        res.status(400).json({ message: firstError });
        return;
      }
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
  const firstError = validations.find((err) => err !== null);
  if (firstError) {
    res.status(400).json({ message: firstError });
    return;
  }
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
    const validPassword = await authUser.isValidPassword(password);
    if (!validPassword) {
      // Increments login attempt by one
      authUser.incrementLoginAttempt();
      await authUser.save();
      res.status(400).json({ message: "Invalid credentials !" });
      return;
    }

    // Resets login attempts
    authUser.resetLoginAttempt();
    await authUser.save();

    // Creates authentication cookie
    createJwtToken(authUser._id, res);

    res.status(200).json({ message: "Credentials matched !" });
    return;
  } catch (error) {
    console.error("Error in login controller : ", error);
    res.status(500).json({ message: "Invalid request !" });
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

// Sets the otp to user payload in db and also send email
export const requestOtp = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.body;

  // Validations on user payload
  const firstError = validateEmail(email);
  if (firstError) {
    res.status(400).json({ message: firstError });
  }
  try {
    // Validates the exsistance of the user
    const user = await userModel.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found !" });
      return;
    }

    // Validate that 1 otp with in 5 minutes
    if (user.otpCreatedAt && Date.now() - user.otpCreatedAt < 5 * 60 * 1000) {
      res.status(429).json({ message: "OTP cooldown" });
      return;
    }

    // Creates otp
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Sends OTP to the user email
    const isEmailSent = await sendOtp(otp, email); //returns boolean
    if (!isEmailSent) {
      res.status(500).json({ message: "Error sending the email !" });
      return;
    }

    // Sets the otp
    user.otp = otp;
    // Sets creation date of otp
    user.otpCreatedAt = Date.now();
    // Saves the user
    await user.save();

    res.status(200).json({ message: "OTP emailed !" });
    return;
  } catch (error) {
    console.error("Error in requestOtp controller :", error);
    res.status(500).json({ message: "Internet server error !" });
    return;
  }
};

// Verifies the otp stored in db
export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  const { email, otp } = req.body;

  // Validations on user payload
  const validations = [validateEmail(email), validateOTP(otp)];
  const firstError = validations.find((err) => err !== null);
  if (firstError) {
    res.status(400).json({ message: firstError });
    return;
  }
  try {
    // Validates exsistance of the user
    const user = await userModel.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found !" });
      return;
    }

    // Validates OTP
    const isValid =await user.isValidOTP(otp);
    if (!isValid) {
      res.status(400).json({ message: "Invalid or expired OTP !" });
      return;
    }

    // Validates email
    user.emailStatus = "verified";
    // Resets Password attempt
    user.loginAttempt = 0;
    // deletes OTP
    user.otp = undefined;
    user.markModified("otp");
    // delete otpCreationDate
    user.otpCreatedAt = undefined;
    user.markModified("otpCreatedAt");
    // Saves changes
    await user.save();

    // Creates authentication cookie
    createJwtToken(user._id, res);

    // On success
    res.status(200).json({ message: "Otp Matched !" });
    return;
  } catch (error) {
    console.error("Error in verifyOtp controller :", error);
    res.status(500).json({ message: "Internel server error !" });
    return;
  }
};

// Changes the password
export const changePassword = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  // Takes from token
  const authUser = req.user;
  // Takes from the form from client
  const { newPassword, confirmNewPassword } = req.body;

  // Validations on user payload
  const validations = [
    validatePassword(newPassword),
    validateConfirmPassword(newPassword, confirmNewPassword),
  ];
  const firstError = validations.find((err) => err !== null);
  if (firstError) {
    res.status(400).json({ message: firstError });
    return;
  }
  try {
    authUser.password = newPassword;
    authUser.markModified("password");
    // Saves user
    await authUser.save();

    // On success
    res.status(200).json({ message: "Password updated !" });
    return;
  } catch (error) {
    console.error("Error in changePassword controller :", error);
    res.status(500).json({ message: "Internel server error !" });
    return;
  }
};
