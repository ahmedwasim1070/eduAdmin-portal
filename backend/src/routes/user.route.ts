import { Router } from "express";

import { registerSignup, login } from "../controllers/auth.controller.js";

import { isRoot } from "../middlewares/auth.middleware.js";

const router = Router();

// Root signup
router.post("/signup/root", isRoot, registerSignup);
router.post("/login", login);

export default router;
