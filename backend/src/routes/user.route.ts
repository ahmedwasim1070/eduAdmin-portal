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
} from "../controllers/auth.controller.js";
import { quiryRootUser } from "../controllers/userQuiry.controller.js";

import {
  protectRoute,
  validateRoot,
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

// Quieries
router.get("/quiry/root", protectRoute, validateRoot, quiryRootUser);

export default router;
