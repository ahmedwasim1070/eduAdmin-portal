import { Router } from "express";

import {
  checkAuth,
  checkRoot,
  login,
  registerRoot,
} from "../controllers/auth.controller.js";

import {
  protectRoute,
  protectRegisterRoot
} from "../middlewares/auth.middleware.js";

const router = Router();

// Checks token
router.get("/check", protectRoute, checkAuth);
// Check Root
router.get('/checkRoot',checkRoot)
// Root signup
router.post("/signup/root", protectRegisterRoot, registerRoot);
// User login
router.post("/login", login);

export default router;
