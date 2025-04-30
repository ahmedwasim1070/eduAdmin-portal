import { Router } from "express";

import {
  checkAuth,
  checkRoot,
  login,
  logout,
  registerRoot,
  verifyEmailReq,
} from "../controllers/auth.controller.js";

import {
  protectRoute,
  protectRegisterRoot,
} from "../middlewares/auth.middleware.js";

const router = Router();

// Checks token
router.get("/check", protectRoute, checkAuth);
// Check Root
router.get("/checkRoot", checkRoot);
// Root signup
router.post("/signup/root", protectRegisterRoot, registerRoot);
// User login
router.post("/login", login);
// Logout
router.get("/logout", protectRoute, logout);
// verify email request
router.post("/verifyEmail", protectRoute, verifyEmailReq);

export default router;
