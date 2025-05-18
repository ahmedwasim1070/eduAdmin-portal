import { Router } from "express";

import { protectRoute, validateRoot } from "../middlewares/auth.middleware.js";

import {
  changeName,
  quiryUsers
} from "../controllers/userFeatures.controller.js";

const router = Router();

// Quieries
// Root Quiries roots
router.get("/quiryAll", protectRoute, quiryUsers);
// Change Status
// router.post("/change/status", protectRoute, validateRoot, changeStatus);

// Change Name
router.post("/change/name", protectRoute, changeName);

export default router;
