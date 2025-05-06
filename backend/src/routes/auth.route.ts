import { Router } from "express";

import {
  checkAuth,
  checkRoot,
  login,
  logout,
  registerRoot,
  reqOTP,
  verifyOTP,
  changePassword,
  signup,
} from "../controllers/auth.controller.js";

import {
  protectRoute,
  protectRegisterRoot,
} from "../middlewares/auth.middleware.js";

const router = Router();

// Authentication Routes
// Checks token
router.get("/check", protectRoute, checkAuth);
// Check Root
router.get("/checkRoot", checkRoot);
// Root signup
router.post("/signup/root", protectRegisterRoot, registerRoot);
// User login
router.post("/login", login);
// User Logout
router.get("/logout", protectRoute, logout);
// Request OTP
router.post("/req/otp", reqOTP);
// Verifies OTP
router.post("/verify/otp", verifyOTP);
// Change Password
router.post("/change/password", protectRoute, changePassword);

// Supervisor user add another user (User Signup)
router.post("/signup/user", protectRoute, signup);

export default router;
