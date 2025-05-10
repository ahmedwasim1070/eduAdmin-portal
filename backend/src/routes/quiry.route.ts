import { Router } from "express";

import { protectRoute, validateRoot } from "../middlewares/auth.middleware.js";

import { quiryAllTypeUsers } from "../controllers/rootPrivileges.controller.js";

const router = Router();

// Quieries
// Root Quiries roots
router.post("/users", protectRoute, validateRoot, quiryAllTypeUsers);

export default router;
