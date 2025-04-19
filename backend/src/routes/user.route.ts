import { Router } from "express";

import {
  checkAuth,
  login,
  registerSignup,
} from "../controllers/auth.controller.js";

import { protectRoute } from "../middlewares/auth.middleware.js";

const router = Router();

// Checks token
router.get("/check", protectRoute, checkAuth);
// Root signup
router.post("/signup/root", registerSignup);
// User login
router.post("/login", login);

export default router;
