// Express
import { Request, Response } from "express";

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
import userModel from "../models/user.model.js";

// Signs up new user by already signed up user !
export const signup = async (req: Request, res: Response): Promise<void> => {
  const { fullName, email, contactNumber, password, confirmPassword, role } =
    req.body;

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
      // createdBy:
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

// Base root user signup
