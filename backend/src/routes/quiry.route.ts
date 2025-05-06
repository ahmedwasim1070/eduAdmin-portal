import { Router } from "express";

import { protectRoute, validateRoot } from "../middlewares/auth.middleware.js";

import { quiryRootUser } from "../controllers/userQuiry.controller.js";

const router = Router();

// Quieries
// Root Quiries roots
router.get("/users/root", protectRoute, validateRoot, quiryRootUser);

export default router;
